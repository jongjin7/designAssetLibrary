
# 통합 개발 계획: NOVA — Sprint 3 & 4

> **연관 문서**: `DEVELOPMENT_PLAN_S1_S2.md` (Sprint 1 & 2) · `docs/architecture/sync-storage-spec.md`
> **기간**: Week 7–12 (6주)
> **범위**: 동기화·스토리지 인프라 완성 → 검색·뷰어 완성 → 출시 QA

---

## 1. 요약 (Summary)

Sprint 3는 **동기화 인프라를 실 코드에 완전히 구현**하는 것이 목표다.
검색·뷰어 등 상위 기능이 모두 `HybridAssetRepository` 위에서 동작해야 하므로,
`USE_MOCK` 플래그를 제거하고 Local-First 아키텍처를 먼저 확립한다.
이 토대 없이 검색·뷰어를 먼저 구현하면 Sprint 4에서 전면 리팩터가 불가피하다.

Sprint 4는 안정적인 인프라 위에서 **검색·뷰어 경험을 완성**하고 출시 품질에 도달한다.
Week 10–11은 FTS 검색, 4종 레이아웃, 복합 필터, 중복 검사, 무드보드를 구현하고,
Week 12는 환경설정·집중 QA·배포 패키지 준비에 집중한다.

---

## 2. Sprint 3 — 동기화 인프라 완성 (Week 7–9)

### 2.1 목표

> "검색·뷰어·출시 준비 등 모든 상위 기능이 올라설 Local-First 토대를 완성한다."

| 지표 | 목표값 |
| :--- | :--- |
| 모바일→데스크탑 동기화 반영 | **< 3초** |
| 오프라인 저장 → 복귀 후 자동 업로드 | **100%** |
| `USE_MOCK` 코드 잔존 | **0줄** |
| 위험 구간 감지 → 최적화 다이얼로그 표시 | **100%** 정상 동작 |

### 2.2 아키텍처 결정

#### 2.2.1 HybridAssetRepository 완성

```
dataService.ts
  └─ HybridAssetRepository (항상 사용 — USE_MOCK 완전 제거)
       ├─ 읽기/쓰기 → LocalAssetRepository (OPFS + IndexedDB) — 즉시 응답
       └─ sync()   → SupabaseSyncService (백그라운드 · 수동 트리거)
```

| 메서드 | 동작 |
| :--- | :--- |
| `getAssets()` | 로컬에서 즉시 반환. 백그라운드에서 원격 메타데이터 비교 |
| `saveAsset()` | 로컬 즉시 저장 (`syncStatus: 'local_only'`) |
| `syncNow()` | 수동 트리거 시 Delta Sync 실행 |
| `estimateStorage()` | 디바이스 여유 용량 측정 및 최적화 모드 제안 |

#### 2.2.2 Delta Sync 엔진

```
1. IndexedDB에서 syncStatus = 'pending' | 'local_only' 에셋 조회
2. Supabase DB에서 lastSyncedAt 이후 변경된 원격 에셋 조회 (Delta)
3. Diff 분석
   a. 로컬에만 있음  → Supabase Storage 업로드 후 remoteId 기록
   b. 서버에만 있음  → 최적화 모드: 썸네일만 / 기본 모드: 원본 다운로드
   c. 양쪽 모두 변경 → LWW (updatedAt 기준), 큰 차이는 사용자 다이얼로그
4. lastSyncedAt 갱신
5. UI Toast: "N개 업로드, M개 다운로드 완료"
```

#### 2.2.3 Supabase Realtime 연동 (HybridAssetRepository 통합)

> Sprint 2에서 Electron Renderer에 `Supabase Client (Realtime 구독)`을 초기 연결하여 Sprint 2 DoD "3초 이내 반영"을 달성한다.
> Sprint 3에서는 이 구독을 `HybridAssetRepository`와 완전히 통합하고, 동기화 정책(Debounce·수동 트리거 분리)을 확립한다.

| 계층 | Sprint 2 (기본 구독) | Sprint 3 (HybridRepo 통합) |
| :--- | :--- | :--- |
| Realtime 연결 | Supabase Client 직접 구독 | `SupabaseSyncService` 내부로 캡슐화 |
| 메타데이터 반영 | 이벤트 수신 → 그리드 즉시 업데이트 | 변경 후 **3초 Debounce** 일괄 처리 |
| 원본 바이너리 | 미구현 | **수동 "지금 동기화"** 트리거 시에만 업/다운로드 |
| syncStatus 갱신 | 미구현 | 이벤트 수신 시 `syncStatus` 자동 갱신 |

#### 2.2.4 스마트 스토리지 최적화

| 여유 공간 | 상태 | 조치 |
| :--- | :--- | :--- |
| > 1 GB | 안전 | 기본 모드 유지 |
| 500 MB ~ 1 GB | 경고 | 설정 화면에 경고 배지 표시 |
| < 500 MB | 위험 | `NVStorageOptimizeDialog` 표시 |

**최적화 모드 전환 흐름:**
```
[위험 구간 감지]
  → NVStorageOptimizeDialog 표시
      ├─ "시뮬레이션 보기" → 확보 가능 용량 미리보기 (파괴적 동작 없음)
      ├─ "최적화 시작"    → 로컬 원본 → Supabase 업로드 후 로컬 삭제
      └─ "나중에"         → 경고 배지 유지, 다음 실행 시 재안내
```

### 2.3 사용자 스토리별 구현 명세

#### US-3-00: Supabase 초기화 & 인증 & 최초 동기화

> Sprint 1 & 2는 Supabase 없이 로컬 단독 동작했다. Sprint 3 첫 주에 Supabase를 초기화하고 인증을 연결한 뒤, 로컬 데이터를 클라우드로 최초 업로드한다. 이 작업이 완료되어야 HybridAssetRepository와 Delta Sync가 의미 있게 동작한다.

**Supabase 프로젝트 초기화**

| 항목 | 상세 |
| :--- | :--- |
| **DB 스키마 생성** | `assets`, `folders`, `tags`, `tag_groups`, `asset_tags`, `asset_folders`, `smart_folders`, `library`, `profiles` 테이블 마이그레이션 |
| **Storage 버킷** | `assets` (원본), `thumbnails` (WebP), `avatars` (프로필 이미지) 버킷 생성 + RLS 정책 설정 |
| **RLS 정책** | 전 테이블 `auth.uid() = user_id` 조건 적용 |

**인증 & 프로필**

| 항목 | 상세 |
| :--- | :--- |
| **Google OAuth 2.0** | "Google로 계속하기" → Supabase Auth OAuth 플로우 → 계정 자동 생성 |
| **Apple Sign in** | "Apple로 계속하기" → Sign in with Apple (iOS 강제 정책, macOS 권장) |
| **세션 유지** | `refreshToken` 자동 갱신, 앱 재시작 시 자동 로그인 |
| **로그아웃** | 로컬 토큰 + IndexedDB 세션 삭제 |
| **프로필 자동 생성** | 최초 로그인 시 `profiles` 레코드 자동 생성 (OAuth 제공자 이름·아바타 URL 초기값) |
| **표시 이름·아바타 편집** | 프로필 설정 화면에서 편집 → `profiles` 테이블 업데이트, `avatars/` 버킷 업로드 |
| **사용자별 데이터 로드** | 로그인 후 해당 `user_id` 에셋·폴더만 조회 (타 계정 데이터 미노출) |

**Sprint 1 & 2 로컬 데이터 최초 동기화**

| 항목 | 상세 |
| :--- | :--- |
| **최초 업로드** | 로컬에 저장된 모든 에셋(`syncStatus: 'local_only'`) → Supabase Storage 업로드 + DB 메타데이터 등록 |
| **진행 상태 표시** | 업로드 진행률 UI (N/M 완료) |
| **실패 처리** | 실패 에셋 재시도 큐 보관, 수동 재시도 지원 |

**AI 맥락 요약 Edge Function**

| 항목 | 상세 |
| :--- | :--- |
| **대상** | `sourceUrl`이 있는 에셋 (브라우저 확장·공유 시트로 저장된 URL 에셋) |
| **동작** | Supabase Edge Function → 페이지 본문 크롤링 → AI 요약 (핵심 주제·요약·키워드 3개) → `memo` 필드 업데이트 |
| **처리 시점** | Supabase 최초 연동 후 기존 URL 에셋 소급 처리 + 이후 신규 저장 시 자동 실행 |

#### US-3-01: Supabase 실시간 동기화 & Local-First 인프라

| 시나리오 | 동작 |
| :--- | :--- |
| 모바일 촬영 → 데스크탑 반영 | Realtime 이벤트 수신 후 그리드 즉시 업데이트 (< 3초) |
| 데스크탑 태그 편집 → 모바일 반영 | 메타데이터 자동 동기화 (3초 Debounce) |
| 오프라인 (모바일) | `syncStatus: 'pending'`로 IndexedDB 저장 → 네트워크 복귀 시 HybridRepo가 자동 업로드 재시도 |
| 오프라인 (데스크탑) | `syncStatus: 'local_only'`로 SQLite 저장 → 온라인 복귀 시 Delta Sync 자동 실행 (**데스크탑 오프라인 큐 신규 구현**) |
| 동시 편집 충돌 | LWW (`updatedAt` 기준), 큰 차이는 사용자 다이얼로그 |

**동기화 UI 컴포넌트 (sync-storage-spec §7):**

에셋 카드 배지:

| `syncStatus` | 아이콘 | 설명 |
| :--- | :--- | :--- |
| `synced` | 구름+체크 | 서버와 완전 동기화 |
| `pending` | 구름+화살표 | 동기화 대기 중 |
| `local_only` | 핀 | 클라우드 비연동 |
| `error` | 경고 | 동기화 오류 |

글로벌 Sync Center (사이드바 하단):
```
[☁ 마지막 동기화: 오늘 오후 2:30]  [지금 동기화 ↑]
```

#### Asset 타입 확장

```typescript
// packages/types/src/asset.ts — 추가 필드
interface Asset {
  // ...기존 필드...
  syncStatus: 'synced' | 'pending' | 'local_only' | 'error';
  remoteId?: string;
  lastSyncedAt?: string;  // ISO 8601
  updatedAt: string;      // ISO 8601 — LWW 충돌 해결 기준
}
```

### 2.4 Sprint 3 완료 조건 (Definition of Done)

- [ ] Supabase DB 스키마 전체 마이그레이션 완료 (9개 테이블 + RLS)
- [ ] Google OAuth + Apple Sign in 로그인 E2E 성공
- [ ] 최초 로그인 시 `profiles` 레코드 자동 생성 확인
- [ ] 로그인 후 본인 데이터만 노출 (RLS 차단 확인)
- [ ] Sprint 1 & 2 로컬 에셋 → Supabase 최초 업로드 100% 완료
- [ ] `Asset` 타입 동기화 필드 추가 (`syncStatus`, `updatedAt`, `remoteId`)
- [ ] `HybridAssetRepository` 완성 — `USE_MOCK` 코드 0줄 잔존
- [ ] Delta Sync (`syncNow()`) 3가지 케이스 (업로드/다운로드/LWW) 동작 확인
- [ ] 오프라인 저장 → 복귀 후 자동 업로드 100% 확인
- [ ] 모바일→데스크탑 E2E 3초 이내 반영 검증
- [ ] `NVStorageOptimizeDialog` — 위험 구간 감지 및 최적화 플로우 완전 동작
- [ ] 동기화 배지 4종 UI 표시 확인
- [ ] 글로벌 Sync Center 위젯 및 설정 페이지 동기화 섹션 구현 완료

---

## 3. Sprint 4 — 검색·뷰어 & 출시 준비 (Week 10–12)

### 3.1 목표

> "동기화 인프라 위에서 탐색 경험을 완성하고 출시 품질에 도달한다."

| 지표 | 목표값 |
| :--- | :--- |
| 키워드 검색 응답 (10만 에셋) | **< 200ms** |
| 색상 검색 정확도 | **≥ 80%** |
| 앱 시작 시간 (10만 에셋) | **< 3초** |
| 크래시율 | **< 0.5%** |
| 심각 버그 | **0건** |

---

### Week 10–11: 검색 & 뷰어

### 3.2 검색 아키텍처

#### 3.2.1 전문 검색 인덱스

- **FTS**: Supabase PostgreSQL `tsvector` 컬럼을 `assets`, `tags`, `memos` 테이블에 추가.
- **pHash 유사도 검색**: 별도 Worker에서 Hamming Distance 계산 → 역방향 이미지 검색.
- **색상 검색**: 저장 시 추출한 `palette` JSONB의 HSL 범위(±15%)를 PostgreSQL에서 직접 필터링.
- **인덱스**: `assets(name, memo)` tsvector · `assets(phash)` btree · `asset_tags(tag_id, asset_id)` 복합.

#### 3.2.2 검색 쿼리 파이프라인

```
사용자 입력 (Ctrl+F)
  │
  ├─ QueryParser
  │   ├─ OR 연산: "(cat OR dog) black" → tsquery
  │   ├─ 제외 연산: "-party" → NOT 절
  │   └─ 인용구: '"exact phrase"' → phrase search
  │
  ├─ FilterBuilder
  │   ├─ 포맷, 날짜, 별점, 컬러 라벨, 파일 크기, 비율
  │   └─ 태그 Any(OR) / All(AND) 모드
  │
  └─ SearchService
      ├─ IndexedDB (로컬 캐시 우선 — Sprint 3 인프라 활용)
      └─ Supabase RPC (캐시 미스 시 폴백)
```

#### 3.2.3 뷰어 렌더링

| 레이아웃 | 구현 방식 |
| :--- | :--- |
| **Waterfall** | CSS `columns` + `break-inside: avoid` |
| **Justified** | 행 높이 동일 유지 너비 계산 알고리즘 (Flickr 방식) |
| **Grid** | CSS `grid` 고정 셀, `aspect-ratio` 유지 |
| **List** | 단일 컬럼 테이블 뷰, 메타데이터 인라인 표시 |

- 썸네일 지연 로드: `IntersectionObserver` + OPFS 캐시 우선 읽기.
- GIF/WebP: 호버 300ms 유지 시 정적 썸네일 → 원본 URL 교체.

### 3.3 사용자 스토리별 구현 명세

#### US-4-01: 키워드 전문 검색 & 고급 문법

| 구분 | 상세 |
| :--- | :--- |
| **진입** | `Ctrl+F` (현재 폴더) / `Ctrl+Alt+F` (전체 라이브러리) |
| **OR 연산** | `(cat \|\| dog) poster` → `tsquery` 변환 |
| **제외 연산** | `-keyword` → `NOT` 절 |
| **인용구** | `"exact phrase"` → Phrase search |
| **범위** | 이름 / 태그 / 메모 / 출처 URL 선택 필터 |
| **자동완성** | 입력 중 실시간 태그·파일명 추천 (100ms 이내) |
| **최근 검색** | 최근 5개 IndexedDB 캐시 |

#### US-4-02: 색상 팔레트 검색

> 주조색 추출(`node-vibrant` / Edge Function → `palette` JSONB)은 Sprint 1 US-1-02에서 이미 구현. Sprint 4는 저장된 팔레트 데이터를 기반으로 검색 UI를 추가한다.

- 검색 UI: 색상 스와치 클릭 → HSL 범위 쿼리. Hex/RGB/HSL 직접 입력 지원.
- 유사도 허용 오차: 슬라이더로 ±5%~±30% 조정.

#### US-4-03: 고급 필터 (복합 조건)

- 필터 상태 URL 파라미터 직렬화 → 새로고침 후 유지.
- 자주 쓰는 필터 조합 최대 10개 저장 (IndexedDB).
- 활성 필터 칩 표시, 개별 제거 가능.

#### US-4-04: 그리드 4종 & 에셋 뷰어

**뷰어 키맵:**

| 키 | 동작 |
| :--- | :--- |
| `Space` | 빠른 미리보기 |
| `C` / 더블클릭 | 상세 모드 (메모 편집) |
| `` ` `` | 창에 맞추기 |
| `Shift+F` / `Shift+R` / `Shift+C` | 반전 / 회전 / 자르기 |
| `←` / `→` | 이전 / 다음 에셋 |

- 인스펙터: 파일명·포맷·크기·해상도·생성일·출처 URL·태그·별점·라벨·메모·색상 팔레트.
- 투명 PNG: 배경색 커스텀 (인스펙터 내 색상 피커).

#### US-4-05: GIF·WebP·영상 호버 미리보기

- 설정에서 "그리드 자동재생" ON/OFF 토글.
- 뷰어: 재생/일시정지, 루프 ON/OFF만 제공 (MVP 최소화).

#### US-4-06: 빠른 선택 표시 (J키) & 역방향 이미지 검색

- `Cmd+J` / `J` → 빠른 폴더 이동 팔레트 오픈.
- 에셋 우클릭 → "이미지로 이미지 검색" → pHash 기반 유사 에셋 표시.

#### US-4-07: 중복 파일 검사

| 모드 | 방식 | 실행 |
| :--- | :--- | :--- |
| **Identical** | SHA-256 해시 비교 | 포어그라운드 |
| **Similar** | pHash Hamming Distance (슬라이더) | 백그라운드 Worker |

- 중복 그룹 표시 → 보존 파일 선택 → 나머지 삭제 or 병합(메타데이터 통합).

#### US-4-08: 레퍼런스 관계 연결 (무드보드)

- 인스펙터 하단 "관련 레퍼런스 추가" → 라이브러리 내 다른 에셋 연결.
- 무드보드 뷰: 캔버스형 레이아웃.
- AI 유사도 추천: 동일 태그·색상 기반 최대 6개.
- 관계 양방향: A→B 연결 시 B 인스펙터에도 A 표시.

#### US-4-09: 추천 페이지 스냅샷 아카이브

- URL 저장 에셋에 "페이지 스냅샷" 버튼 표시.
- 클릭 시 페이지 스크린샷 → Cloudflare R2 별도 보관.
- 설정에서 "URL 저장 시 자동 스냅샷" ON/OFF.

---

### Week 12: 출시 준비

### 3.4 환경설정 (US-4-10)

| 섹션 | 항목 |
| :--- | :--- |
| **계정** | 연결된 OAuth 계정 확인 (Google / Apple) · 계정 탈퇴 (데이터 전체 삭제 확인 모달 포함) |
| **테마·디스플레이** | 다크/라이트/시스템 연동 · 줄 레벨 · 언어 |
| **썸네일·뷰어** | 배경색 커스텀 · Pixelate 모드 · GPU 가속 ON/OFF |
| **GIF·영상** | 자동재생 ON/OFF · 호버 동작 선택 |
| **동기화** | 수동 모드 스위치 · "지금 동기화" · 저장 공간 사용량 · 최적화 버튼 |
| **스크린샷** | 자동 태그 · 클립보드 복사 · Retina @2x · 단축키 커스텀 |
| **보안** | 비밀번호 잠금 · Touch ID (macOS) |
| **단축키** | 150개 전체 커스터마이징 |

### 3.5 집중 QA

| 항목 | 기준 |
| :--- | :--- |
| 전체 US 인수 조건 | 100% 통과 |
| 10만 에셋 로드 테스트 | 앱 시작 < 3초, 검색 < 200ms |
| 브라우저 확장 호환성 | Chrome · Firefox · Edge · Safari |
| OS 호환성 | macOS Sonoma/Ventura · Windows 11/10 |
| 크래시율 | < 0.5%, 심각 버그 0건 |
| 출시 패키지 | macOS `.dmg` + Windows `.exe` NSIS |
| 법적 문서 | 개인정보처리방침 · 서비스이용약관 초안 |

### 3.6 Sprint 4 완료 조건 (Definition of Done)

- [ ] 10만 에셋 키워드 검색 200ms 이내 성능 테스트 통과
- [ ] 고급 검색 문법 E2E: `-제외` / 인용구 / `Ctrl+Alt+F` 전체 라이브러리
- [ ] 색상 팔레트 검색: 스와치 클릭 및 Hex 직접 입력 → 정확도 ≥ 80% 확인
- [ ] 레이아웃 4종 (Waterfall/Justified/Grid/List) 정상 전환 확인
- [ ] GIF·영상 인라인 미리보기 정상 동작
- [ ] 중복 파일 검사 2종 (Identical / Similar) 정상 동작
- [ ] 인스펙터 편집 저장 후 1초 이내 반영
- [ ] 환경설정 변경 즉시 반영 확인
- [ ] 집중 QA 체크리스트 100% 통과
- [ ] macOS DMG + Windows EXE 배포 패키지 완료

---

## 4. 공통 기술 결정 (Sprint 3 & 4 공유)

### 4.1 상태 관리

- Zustand store를 `searchSlice`, `syncSlice`, `storageSlice`로 분리.
- `syncSlice`: `lastSyncedAt`, `isSyncing`, `syncError`, `pendingCount` 상태 관리.
- `storageSlice`: `availableBytes`, `mode` ('default' | 'optimized'), `warningLevel` 관리.

### 4.2 성능 최적화

- 검색 결과 가상화: `@tanstack/react-virtual` — 10만 개 리스트 렌더링 최적화.
- 썸네일 Worker Pool: OPFS 읽기 전용 Worker 3개 상시 대기.
- 동기화 Worker: `SupabaseSyncService`는 별도 Web Worker에서 실행 — UI 스레드 블로킹 방지.

### 4.3 리스크 & 대응

| 리스크 | 가능성 | 영향 | 대응 |
| :--- | :---: | :---: | :--- |
| FTS 200ms 목표 미달 (데이터 폭증 시) | 중 | 높음 | `pg_trgm` GIN 인덱스 + 쿼리 Plan 분석. 필요 시 Meilisearch 도입 검토 |
| LWW 충돌로 인한 데이터 소실 | 중 | 높음 | MVP: LWW 적용. v1.1: 3-way merge 도입 (PRD §6 로드맵) |
| Safari 확장 심사 지연 (2~4주) | 높음 | 중 | Sprint 2 종료 전 선제 제출. QA 기간과 병행 |
| OPFS 미지원 환경 (구형 Safari 등) | 낮음 | 중 | `localStorage` + `Cache API` 폴백 레이어 구현 |
| 최적화 모드 롤백 비용 (대용량 다운로드) | 중 | 중 | 선택적 복귀 UI — 폴더 단위로 점진적 다운로드 지원 |

---

## 5. 전체 Sprint 3 & 4 타임라인

```
Week 7   Supabase 초기화 (DB 스키마·Storage 버킷·RLS 설정)
          OAuth 인증 연동 (Google + Apple), 프로필 생성
          Sprint 1 & 2 로컬 데이터 최초 업로드
          Asset 타입 syncStatus 필드 추가
          HybridAssetRepository 구현 착수 (USE_MOCK 제거)
          StorageService 용량 측정 유틸리티

Week 8   Delta Sync 엔진 (syncNow()) 구현
          Supabase Realtime → HybridAssetRepository 통합 (Debounce·수동 트리거 정책 확립)
          오프라인 큐 통합 (모바일 Background Sync → HybridRepo 체계 편입 + 데스크탑 오프라인 큐 신규 구현)

Week 9   NVStorageOptimizeDialog & 최적화 모드 전환
          동기화 배지·Sync Center·설정 섹션 UI
          Sprint 3 DoD 검증

Week 10  검색 인프라 (FTS 인덱스, QueryParser, FilterBuilder)
          색상 팔레트 검색, 복합 필터

Week 11  뷰어 4종 레이아웃, GIF 인라인 미리보기
          중복 파일 검사, 무드보드, 스냅샷 아카이브

Week 12  환경설정 42개 항목
          집중 QA (전체 US 인수 조건, 10만 에셋 성능)
          배포 패키지 빌드, 법적 문서
          Sprint 4 DoD 검증 → 출시 승인
```

---

## 6. 버전 이력

| 버전 | 날짜 | 내용 |
| :--- | :--- | :--- |
| **v1.0** | 2026-03-29 | 최초 작성. PRD v1.0 Sprint 3 & 4 + sync-storage-spec v1.0 통합 |
