# 동기화 및 스토리지 최적화 아키텍처 (Sync & Storage Optimization)

> **버전**: 1.0 (2026-03-28)  
> **관련 파일**: `apps/web-app/src/lib/repositories/`, `apps/web-app/src/lib/storage/opfs.ts`, `apps/web-app/src/lib/dataService.ts`

---

## 1. 개요 (Overview)

Trove는 **Local-First** 철학을 핵심으로 삼는다. 모든 데이터 쓰기 및 읽기는 네트워크 상태와 무관하게 
로컬 저장소(OPFS + IndexedDB)에서 즉시 처리되며, 서버(Supabase)와의 동기화는 사용자가 
명시적으로 제어한다.

이 접근 방식은 macOS 사진 앱의 자동 동기화 철학과 iCloud의 계층적 저장 구조에서 영감을 받았으나,
**디자인 전문가의 작업 흐름**에 맞게 다음과 같은 방향으로 차별화된다.

| 항목 | macOS 사진 앱 | Trove |
| :--- | :--- | :--- |
| 동기화 트리거 | 자동 (항상 백그라운드) | **수동 (사용자 클릭)** |
| 저장 주체 | 클라우드 우선 | **로컬 우선** |
| 원본 이동 | Optimize 시 자동 이동 | **사용자 승인 후 이동** |
| 메타데이터 | 클라우드와 항상 동기화 | **경량 자동 + 바이너리 수동 분리** |

---

## 2. 저장소 계층 구조 (Storage Hierarchy)

```
L1  RAM Cache          — 현재 렌더링 중인 에셋 (수 MB, 탭 종료 시 소멸)
L2  OPFS              — 원본 바이너리 파일 (수 GB, 영구 · 기본 모드)
L3  IndexedDB         — 에셋 메타데이터 + 동기화 대기열 (수 MB, 영구)
L4  Supabase Storage  — 원본 파일 마스터 (클라우드, 최적화 모드의 주 저장소)
L4  Supabase DB       — 글로벌 메타데이터 (PostgreSQL, 다기기 공유)
```

- **기본 모드**: L2(OPFS)가 원본 파일의 주 저장소.
- **최적화 모드**: L4(Supabase Storage)가 원본 파일의 주 저장소. L2에는 WebP 섬네일만 유지.

---

## 3. 데이터 타입 확장 (Asset Type Extension)

동기화 상태를 추적하기 위해 `Asset` 타입에 다음 필드를 추가한다.

```typescript
// packages/types/src/asset.ts (목표 스키마)
interface Asset {
  // ... 기존 필드 ...

  // 동기화 상태
  syncStatus: 'synced' | 'pending' | 'local_only' | 'error';
  remoteId?: string;       // Supabase DB의 UUID (로컬 전용 에셋은 없음)
  lastSyncedAt?: string;   // ISO 8601, 마지막 성공 동기화 시각
  updatedAt: string;       // ISO 8601, 충돌 해결(LWW)에 사용
}
```

---

## 4. 동기화 정책 (Sync Policy)

### 4.1 메타데이터 (자동 동기화)

파일명, 태그, 폴더 구조, 즐겨찾기 등 초경량 데이터는 네트워크 연결 시 **자동으로** Supabase DB와 동기화된다.

- **목적**: 여러 기기에서 폴더 구조와 검색 인덱스를 항상 최신 상태로 유지.
- **크기 기준**: 단일 레코드 1KB 미만.
- **주기**: 변경 발생 후 약 3초 뒤 Debounce 처리하여 일괄 전송.

### 4.2 원본 바이너리 파일 (수동 동기화)

PNG, SVG, Figma 소스 등 원본 파일은 사용자의 명시적 행동 없이는 업로드/다운로드하지 않는다.

**수동 동기화 트리거:**
1. 사이드바 또는 설정 화면의 "지금 동기화" 버튼 클릭.
2. 설정에서 "수동 동기화 모드" 스위치가 활성화된 상태에서만 동작.

**동기화 엔진 동작 순서 (`syncNow()`):**
```
1. IndexedDB에서 syncStatus = 'pending' | 'local_only' 에셋 목록 조회
2. Supabase DB에서 lastSyncedAt 이후 변경된 원격 에셋 목록 조회 (Delta)
3. 비교 분석 (Diff)
   a. 로컬에만 있음  → Supabase Storage에 업로드 후 remoteId 기록
   b. 서버에만 있음  → 최적화 모드라면 섬네일만 다운로드, 기본 모드라면 원본 다운로드
   c. 양쪽 모두 있고 updatedAt 다름 → LWW(Last Write Wins) 정책 적용
4. 모든 처리 완료 후 lastSyncedAt 갱신
5. UI에 결과 리포트 ("N개 업로드, M개 다운로드 완료")
```

### 4.3 충돌 해결 (Conflict Resolution)

- **기본 정책**: Last Write Wins (LWW) — `updatedAt`이 더 최근인 데이터 채택.
- **중요 데이터**: 양쪽 모두 변경되어 차이가 클 경우, 사용자에게 선택 다이얼로그 표시.

---

## 5. 스마트 스토리지 최적화 (Smart Storage Optimization)

### 5.1 디바이스 용량 감지

앱 진입 시 및 대용량 에셋 등록 시 `StorageService`가 현재 용량을 측정한다.

```typescript
// apps/web-app/src/lib/storage/StorageService.ts (목표)
const estimate = await navigator.storage.estimate();
const available = estimate.quota! - estimate.usage!; // 여유 용량 (bytes)
```

**임계값 정의:**

| 구분 | 기준 | 조치 |
| :--- | :--- | :--- |
| 안전 구간 | 여유 공간 > 1 GB | 기본 모드 유지, 조치 없음 |
| 경고 구간 | 여유 공간 500 MB ~ 1 GB | 설정 화면에 경고 배지 표시 |
| 위험 구간 | 여유 공간 < 500 MB | 최적화 모드 전환 제안 다이얼로그 표시 |

### 5.2 저용량 최적화 모드 안내 흐름 (UX Flow)

```
1. [위험 구간 감지]
   ↓
2. [알림 다이얼로그 표시]
   "디바이스 저장 공간이 부족합니다. (여유: XXX MB)
    최적화 모드로 전환하면 원본 파일을 클라우드에 안전하게 보관하고,
    이 기기에는 고화질 섬네일만 유지하여 최대 XX GB를 확보할 수 있습니다."
   ↓
3. [사용자 선택]
   ├─ "시뮬레이션 보기" → 전환 시 확보 가능 용량 미리보기 (파괴적 동작 없음)
   ├─ "최적화 시작"    → 로컬 원본 → Supabase 업로드 후 로컬 삭제
   └─ "나중에"         → 경고 배지 유지, 다음 실행 시 재안내
   ↓
4. [최적화 완료]
   "저장 공간 X GB 확보 완료. 로컬에는 섬네일이 유지되며,
    원본은 언제든지 다운로드할 수 있습니다."
```

### 5.3 최적화 모드 동작 방식

- **에셋 조회**: 섬네일을 즉시 표시. 원본이 필요할 경우(다운로드/편집 클릭 시) On-Demand 스트리밍.
- **캐시 관리**: 작업 완료 후 7일이 지난 로컬 원본 캐시는 자동 삭제. 섬네일은 유지.
- **복귀**: 사용자가 기본 모드로 되돌아갈 경우, 다음 동기화 시 원본을 다시 다운로드.

---

## 6. 리포지토리 아키텍처 (Repository Architecture)

### 현재 구조 (Current)

```
dataService.ts
  ├─ USE_MOCK = true  → MockAssetRepository  (OPFS + IndexedDB)
  └─ USE_MOCK = false → SupabaseAssetRepository (Supabase 전용)
```

### 목표 구조 (Target — HybridAssetRepository)

```
dataService.ts
  └─ HybridAssetRepository (항상 사용)
       ├─ 읽기/쓰기 → LocalAssetRepository (OPFS + IndexedDB) — 즉시 응답
       └─ sync()   → SupabaseSyncService (백그라운드 · 수동 트리거)
```

| 메서드 | 동작 |
| :--- | :--- |
| `getAssets()` | 로컬에서 즉시 반환. 백그라운드에서 원격 메타데이터만 비교 |
| `saveAsset()` | 로컬에 즉시 저장 (`syncStatus: 'local_only'`) |
| `syncNow()` | 수동 트리거 시 Delta Sync 실행 |
| `estimateStorage()` | 디바이스 여유 용량 측정 및 최적화 모드 제안 |

---

## 7. UI/UX 명세 (UI Specification)

### 7.1 에셋 카드 동기화 배지

각 에셋 카드 우하단에 아이콘 표시:

| 상태 | 아이콘 | 설명 |
| :--- | :--- | :--- |
| `synced` | ☁️✓ (구름+체크) | 서버와 완전히 동기화됨 |
| `pending` | ☁️↑ (구름+화살표) | 동기화 대기 중 (로컬에만 존재) |
| `local_only` | 📍 (핀) | 클라우드 비연동 상태 |
| `error` | ⚠️ (경고) | 동기화 오류 발생, 재시도 필요 |

### 7.2 글로벌 동기화 센터 (Global Sync Center)

사이드바 하단 프로필 영역 위, 또는 라이브러리 헤더 우측에 배치:

```
[☁️ 마지막 동기화: 오늘 오후 2:30]  [지금 동기화 ↑]
```

- "지금 동기화" 클릭 시 진행률 스피너 표시 및 결과 Toast 알림.
- 동기화 중에는 버튼 비활성화.

### 7.3 설정 페이지 동기화 섹션

```
동기화 설정
  ├─ [스위치] 수동 동기화 모드  (기본: ON)
  │           ON: "지금 동기화" 버튼 클릭 시에만 동기화
  │           OFF: 메타데이터 변경 시 자동 동기화 (향후 구현)
  ├─ [버튼]   지금 동기화
  └─ [표시]   저장 공간 사용량 — [■■■□□] 3.2 GB / 10 GB
               └─ [버튼] 저장 공간 최적화...
```

---

## 8. 구현 로드맵 (Implementation Roadmap)

### Sprint 3 — 동기화 기반 구축

- [ ] `Asset` 타입에 `syncStatus`, `updatedAt`, `remoteId` 필드 추가
- [ ] `HybridAssetRepository` 클래스 뼈대 구현 (로컬 읽기/쓰기)
- [ ] Delta Sync 엔진 (`syncNow()`) 구현
- [ ] `StorageService` — `navigator.storage.estimate()` 기반 용량 측정 유틸리티

### Sprint 4 — 스마트 스토리지 최적화 UI

- [ ] 저용량 감지 알림 다이얼로그 (`NVStorageOptimizeDialog`)
- [ ] 에셋 카드 동기화 배지 컴포넌트
- [ ] 설정 페이지 동기화 섹션 구현
- [ ] 사이드바 글로벌 Sync Center 위젯

### Sprint 5 — 안정화 및 고도화

- [ ] On-Demand 원본 다운로드 (최적화 모드)
- [ ] 충돌 해결 다이얼로그 UI
- [ ] 로컬 캐시 7일 자동 정리 (Service Worker 활용)
- [ ] 동기화 이력 로그 페이지
