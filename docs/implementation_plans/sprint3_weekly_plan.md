# NOVA: Sprint 3 Integrated Weekly Plan

본 문서는 **Sprint 3(Week 7–9)** 동기화·스토리지 인프라 완성의 통합 실행 계획입니다.

> **연관 문서**: `DEVELOPMENT_PLAN_S3_S4.md` · `docs/architecture/sync-storage-spec.md`

---

## 📅 주간 상세 일정 (Weekly Schedule)

### **[Sprint 3: 동기화 인프라 완성] (Week 7–9)**

**목표**: `USE_MOCK` 플래그를 완전히 제거하고, Local-First 아키텍처(HybridAssetRepository + Supabase 동기화)를 확립하여 검색·뷰어 등 상위 기능이 올라설 토대를 완성한다.

---

#### **Week 7: Supabase 초기화 & 인증 & 최초 동기화 (US-3-00)**

**목표**: Supabase 프로젝트를 초기화하고, OAuth 인증을 연결한 뒤 Sprint 1&2에서 쌓인 로컬 데이터를 클라우드로 최초 업로드한다.

**Supabase 프로젝트 초기화**
- [ ] **DB 스키마 마이그레이션**: `assets`, `folders`, `tags`, `tag_groups`, `asset_tags`, `asset_folders`, `smart_folders`, `library`, `profiles` 9개 테이블 생성
- [ ] **RLS 정책**: 전 테이블 `auth.uid() = user_id` 조건 적용
- [ ] **Storage 버킷**: `assets`(원본), `thumbnails`(WebP), `avatars`(프로필 이미지) 버킷 생성 + RLS 정책 설정

**인증 & 프로필 (US-3-00)**
- [ ] **Google OAuth 2.0**: "Google로 계속하기" → Supabase Auth OAuth 플로우 → 계정 자동 생성
- [ ] **Apple Sign in**: "Apple로 계속하기" → Sign in with Apple (iOS 강제 정책, macOS 권장)
- [ ] **세션 유지**: `refreshToken` 자동 갱신, 앱 재시작 시 자동 로그인
- [ ] **로그아웃**: 로컬 토큰 + IndexedDB 세션 삭제
- [ ] **프로필 자동 생성**: 최초 로그인 시 `profiles` 레코드 자동 생성 (OAuth 제공자 이름·아바타 URL 초기값)
- [ ] **표시 이름·아바타 편집**: 프로필 설정 화면에서 편집 → `profiles` 테이블 업데이트, `avatars/` 버킷 업로드
- [ ] **사용자별 데이터 로드**: 로그인 후 해당 `user_id` 에셋·폴더만 조회 (RLS 차단 확인)

**최초 동기화 & Asset 타입 확장**
- [ ] **Asset 타입 syncStatus 필드 추가**: `packages/types/src/asset.ts`에 `syncStatus`, `remoteId`, `lastSyncedAt`, `updatedAt` 필드 추가
- [ ] **최초 업로드**: 로컬 에셋(`syncStatus: 'local_only'`) → Supabase Storage 업로드 + DB 메타데이터 등록
- [ ] **업로드 진행 상태 UI**: 진행률 표시 (N/M 완료)
- [ ] **실패 처리**: 실패 에셋 재시도 큐 보관, 수동 재시도 지원
- [ ] **HybridAssetRepository 구현 착수**: `USE_MOCK` 플래그 제거 시작, `LocalAssetRepository` (OPFS + IndexedDB) 연결
- [ ] **StorageService 용량 측정 유틸리티**: `estimateStorage()` 구현 — 디바이스 여유 용량 측정

**AI 맥락 요약 Edge Function**
- [ ] **Edge Function 구현**: `sourceUrl`이 있는 에셋 대상 — 페이지 본문 크롤링 → AI 요약(핵심 주제·요약·키워드 3개) → `memo` 필드 업데이트
- [ ] **소급 처리**: Supabase 최초 연동 후 기존 URL 에셋 소급 처리 + 이후 신규 저장 시 자동 실행

---

#### **Week 8: Delta Sync 엔진 & Realtime 통합 (US-3-01)**

**목표**: `HybridAssetRepository`를 완성하고, Delta Sync 엔진과 Supabase Realtime 구독을 완전히 통합한다. 오프라인 큐(모바일·데스크탑 양쪽)를 HybridRepo 체계로 편입한다.

**HybridAssetRepository 완성**
- [ ] **USE_MOCK 코드 완전 제거**: 코드베이스 전체에서 `USE_MOCK` 잔존 0줄 달성
- [ ] **`getAssets()`**: 로컬에서 즉시 반환, 백그라운드에서 원격 메타데이터 비교
- [ ] **`saveAsset()`**: 로컬 즉시 저장 (`syncStatus: 'local_only'`)
- [ ] **`syncNow()`**: 수동 트리거 시 Delta Sync 실행

**Delta Sync 엔진 (`syncNow()`)**
- [ ] **로컬 전용 에셋 업로드**: `syncStatus: 'pending' | 'local_only'` 에셋 → Supabase Storage 업로드 후 `remoteId` 기록
- [ ] **서버 전용 에셋 다운로드**: 최적화 모드(썸네일만) / 기본 모드(원본 다운로드) 분기
- [ ] **LWW 충돌 해결**: 양쪽 모두 변경된 경우 `updatedAt` 기준 Last Write Wins, 큰 차이는 사용자 다이얼로그
- [ ] **`lastSyncedAt` 갱신**: Delta 범위 기준으로 갱신
- [ ] **UI Toast**: "N개 업로드, M개 다운로드 완료" 알림

**Supabase Realtime → HybridAssetRepository 통합**
- [ ] **`SupabaseSyncService` 캡슐화**: Realtime 구독을 `SupabaseSyncService` 내부로 이동
- [ ] **3초 Debounce 일괄 처리**: 메타데이터 변경 이벤트 수신 후 Debounce 적용
- [ ] **원본 바이너리**: 수동 "지금 동기화" 트리거 시에만 업/다운로드 실행
- [ ] **`syncStatus` 자동 갱신**: Realtime 이벤트 수신 시 자동으로 `syncStatus` 갱신

**오프라인 큐 통합**
- [ ] **모바일 Background Sync → HybridRepo 편입**: 기존 서비스 워커 오프라인 큐를 HybridRepo 체계로 통합
- [ ] **데스크탑 오프라인 큐 신규 구현**: 오프라인 시 `syncStatus: 'local_only'`로 SQLite 저장 → 온라인 복귀 시 Delta Sync 자동 실행

---

#### **Week 9: 스토리지 최적화 다이얼로그 & 동기화 UI & Sprint 3 DoD 검증**

**목표**: 스토리지 최적화 플로우를 완성하고, 사용자에게 노출되는 동기화 UI(배지·Sync Center·설정 섹션)를 구현한 뒤, Sprint 3 완료 조건을 전수 검증한다.

**스마트 스토리지 최적화 (NVStorageOptimizeDialog)**
- [ ] **용량 상태 감지**: 여유 공간 > 1GB(안전) / 500MB~1GB(경고 배지) / < 500MB(위험 → 다이얼로그) 분기
- [ ] **`NVStorageOptimizeDialog` 구현**:
  - [ ] "시뮬레이션 보기": 확보 가능 용량 미리보기 (파괴적 동작 없음)
  - [ ] "최적화 시작": 로컬 원본 → Supabase 업로드 후 로컬 삭제
  - [ ] "나중에": 경고 배지 유지, 다음 실행 시 재안내
- [ ] **설정 화면 경고 배지**: 500MB~1GB 구간에서 설정 화면에 배지 표시

**동기화 UI 컴포넌트**
- [ ] **에셋 카드 syncStatus 배지 4종**:
  - `synced` → 구름+체크 아이콘
  - `pending` → 구름+화살표 아이콘
  - `local_only` → 핀 아이콘
  - `error` → 경고 아이콘
- [ ] **글로벌 Sync Center 위젯** (사이드바 하단): `[☁ 마지막 동기화: 오늘 오후 2:30]  [지금 동기화 ↑]`
- [ ] **설정 페이지 동기화 섹션**: 수동 모드 스위치, "지금 동기화" 버튼, 저장 공간 사용량, 최적화 버튼

**Zustand Store 분리**
- [ ] **`syncSlice`**: `lastSyncedAt`, `isSyncing`, `syncError`, `pendingCount` 상태 관리
- [ ] **`storageSlice`**: `availableBytes`, `mode`(`'default' | 'optimized'`), `warningLevel` 상태 관리

**Sprint 3 DoD 최종 검증**
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

## ✅ Sprint 3 완료 조건 요약 (Definition of Done)

| 지표 | 목표값 | 확인 |
| :--- | :--- | :---: |
| 모바일→데스크탑 동기화 반영 | < 3초 | [ ] |
| 오프라인 저장 → 복귀 후 자동 업로드 | 100% | [ ] |
| `USE_MOCK` 코드 잔존 | 0줄 | [ ] |
| 위험 구간 감지 → 최적화 다이얼로그 표시 | 100% 정상 동작 | [ ] |

---

> [!IMPORTANT]
> HybridAssetRepository 완성 없이 검색·뷰어(Sprint 4)를 먼저 구현하면 전면 리팩터가 불가피합니다. Week 7의 Supabase 초기화 및 인증 연결이 Week 8 Delta Sync의 선행 조건입니다.
