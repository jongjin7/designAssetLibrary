# Sprint 1: 모바일 화면 구성 명세 (Mobile UI Screen Specification)

Sprint 1 모바일(PWA) 앱의 각 화면(Screen)별 UI 구성 요소, 레이아웃 구조, 내비게이션 흐름을 정의합니다. 기능 명세([sprint1-mobile.md](sprint1-mobile.md))를 기반으로 실제 화면 단위의 컴포넌트 배치와 인터랙션을 구체화합니다.

Sprint 1 mobile UI consists of **4 primary screens**: Library, Camera Capture, Search, and Settings. All screens share a fixed `BottomTabs` navigation and follow a single-column layout (`< 768px`).

---

## 1. 내비게이션 구조 (Navigation Structure)

### 1.1 전체 화면 흐름

```text
                    ┌─────────────────┐
                    │   Splash Screen  │
                    │  (auth check)    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        [미인증]         [인증완료]
              │              │
              ▼              ▼
       /login             /library  ◀──── 기본 진입점
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
          /search        /capture       /settings
```

### 1.2 BottomTabs 구성 (전체 화면 공통 고정)

```text
┌────────────────────────────────────────┐
│  [Library]  [Search]  [📷]  [Settings] │  ← 하단 탭 내비게이션 (화면 하단 고정)
└────────────────────────────────────────┘
```

| 탭 | 아이콘 | 경로 | 비고 |
| --- | --- | --- | --- |
| Library | `grid-2x2` | `/library` | 기본 활성 탭 |
| Search | `search` | `/search` | |
| Capture | `camera` | `/capture` | 중앙 FAB 스타일, 강조 색상 |
| Settings | `settings` | `/settings` | |

---

## 2. 화면별 UI 구성

### 2.1 Library Screen (`/library`)

에셋 전체 목록을 표시하는 메인 화면입니다.

```text
┌─────────────────────────────┐
│  [NOVA]            [👤]     │  ← 상단 바 (스크롤 시 상단 고정)
│  ┌─────────────────────┐    │
│  │ 🔍 검색 바 (포커스) │    │  ← SearchBar (탭 시 검색 화면으로 이동)
│  └─────────────────────┘    │
│  [모두] [최근] [즐겨찾기]    │  ← 카테고리 필터 (기능별 칩셋)
├─────────────────────────────┤
│  ┌──────┐ ┌──────┐          │
│  │Asset │ │Asset │          │  ← AssetGrid (2-col, virtualized)
│  │Card  │ │Card  │          │
│  └──────┘ └──────┘          │
│  ┌──────┐ ┌──────┐          │
│  │Asset │ │Asset │          │
│  └──────┘ └──────┘          │
│           ...               │
├─────────────────────────────┤
│  [Library] [Search] [📷] [⚙]│  ← BottomTabs
└─────────────────────────────┘
```

**구성 컴포넌트:**

| 컴포넌트 | 역할 | 출처 |
| --- | --- | --- |
| `TopBar` | 앱 로고 + 유저 아바타 | `packages/ui/layout` |
| `SearchBar` | 탭 시 `/search`로 이동 (입력 불가) | `packages/ui/molecules` |
| `FilterChip` | 카테고리 필터, 수평 스크롤 | `packages/ui/atoms` |
| `AssetGrid` | 2열 가상 스크롤 그리드 | `packages/ui/organisms` |
| `AssetCard` | 썸네일 + 태그 + 팔레트 뱃지 | `packages/ui/organisms` |
| `BottomTabs` | 하단 고정 내비게이션 | `packages/ui/layout` |

---

### 2.2 Capture Screen (`/capture`)

카메라 촬영 및 파일 선택을 통한 에셋 수집 화면입니다.

```text
┌─────────────────────────────┐
│                      [✕]   │  ← 닫기 버튼 (→ /library)
│                             │
│  ┌─────────────────────┐   │
│  │                     │   │
│  │   카메라 뷰파인더    │   │  ← CaptureViewfinder (전체 너비)
│  │                     │   │
│  │  [AI 감지 shimmer]  │   │  ← AI 오브젝트 인식 시 오버레이
│  │                     │   │
│  └─────────────────────┘   │
│                             │
│  ┌─────┐  ┌──────┐  ┌─────┐│
│  │갤러리│  │ 셔터 │  │전환 ││  ← CaptureControls
│  │ 📁  │  │  ⭕  │  │ 🔄  ││     (갤러리 선택 / 셔터 / 전/후면)
│  └─────┘  └──────┘  └─────┘│
│                             │
│  [플래시 OFF]  [타이머 OFF] │  ← OptionBar (보조 옵션)
└─────────────────────────────┘
```

**촬영 후 플로우:**

```text
셔터 클릭
  → Web Worker: EXIF 제거 + 썸네일 생성
  → AI 분류 shimmer 표시 (팔레트/태그 추출 중)
  → 업로드 큐 등록 (TUS Protocol)
  → UploadSuccessToast 표시
  → 연속 촬영 모드 유지 (화면 유지)
```

**구성 컴포넌트:**

| 컴포넌트 | 역할 | 비고 |
| --- | --- | --- |
| `CaptureViewfinder` | 카메라 실시간 스트림 뷰 | PWA 인터페이스 전용 |
| `AIShimmerOverlay` | AI 오브젝트 감지 효과 레이어 | 콘텐츠 상단 배치 |
| `CaptureControls` | 촬영 및 카메라 조작부 | |
| `OptionBar` | 부가 기능 설정 바 | |
| `UploadProgressBar` | 업로드 진행률 표시줄 | 상단 영역 고정 |

---

### 2.3 Search Screen (`/search`)

태그, 컬러, 파일명을 아우르는 통합 검색 화면입니다.

```text
┌─────────────────────────────┐
│  ← [검색어 입력...]  [취소] │  ← SearchBar (자동 포커스, 취소 → /library)
├─────────────────────────────┤
│  최근 검색                  │  ← (검색어 없을 때)
│  #brand  #ui  #icon         │  ← RecentSearchChips
│                             │
│  추천 컬러 검색              │
│  🔴 🔵 🟡 🟢 ⚫ ⚪          │  ← ColorPaletteFilter
├─────────────────────────────┤
│  검색 결과 (실시간)          │  ← (검색어 입력 시)
│  ┌──────┐ ┌──────┐          │
│  │Asset │ │Asset │          │  ← AssetGrid (검색 결과)
│  └──────┘ └──────┘          │
├─────────────────────────────┤
│  [Library] [Search] [📷] [⚙]│  ← BottomTabs
└─────────────────────────────┘
```

**구성 컴포넌트:**

| 컴포넌트 | 역할 | 비고 |
| --- | --- | --- |
| `SearchBar` | 자동 포커스, 입력 시 실시간 쿼리 | debounce 200ms |
| `RecentSearchChips` | 최근 검색어 (로컬 저장) | |
| `ColorPaletteFilter` | 팔레트 컬러 기반 필터링 | `phash` 검색 |
| `AssetGrid` | 검색 결과 그리드 | Library와 동일 컴포넌트 |
| `EmptyState` | 결과 없을 때 안내 UI | |

---

### 2.4 Asset Detail Sheet (Bottom Sheet)

`AssetCard` 탭 시 메인 화면 위에 올라오는 바텀 시트입니다. (별도 라우트 없음)

```text
┌─────────────────────────────┐
│  (딤 배경 — 탭 시 닫힘)     │
│                             │
│ ┌─────────────────────────┐ │
│ │ — (드래그 핸들)          │ │  ← BottomSheet
│ │                         │ │
│ │ [고해상도 이미지 프리뷰] │ │
│ │                         │ │
│ │ 파일명.webp   1.2MB     │ │
│ │ 2026. 03. 09            │ │
│ │                         │ │
│ │ 추출 컬러  🔴🔵🟡🟢⚫   │ │  ← PaletteStrip
│ │                         │ │
│ │ 태그  #brand #ui #icon  │ │  ← TagList
│ │                         │ │
│ │ [공유]  [이동]  [삭제]  │ │  ← ActionBar
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**구성 컴포넌트:**

| 컴포넌트 | 역할 | 비고 |
| --- | --- | --- |
| `BottomSheet` | 드래그 핸들 포함 슬라이드 업 | swipe-down으로 닫기 |
| `AssetPreview` | 고해상도 이미지 표시 | Blur-up 기법 적용 |
| `PaletteStrip` | AI 추출 컬러 5종 표시 | |
| `TagList` | 태그 칩 목록 + 편집 버튼 | |
| `ActionBar` | 공유 / 폴더 이동 / 삭제 액션 | |

---

## 3. 공통 UI 규칙

### 3.1 Safe Area 대응

iOS의 Dynamic Island 및 홈 인디케이터(Home Indicator)와의 간섭을 방지하기 위해 다음 레이아웃 규칙을 적용합니다:

- **하단 내비게이션 (BottomTabs):** 기기의 `safe-area-inset-bottom` 만큼 하단 여백(Padding)을 추가하여 인터랙션 영역을 보호합니다.
- **캡처 컨트롤 (CaptureControls):** 기본 하단 여백(16px)에 `safe-area-inset-bottom`을 합산하여 셔터 버튼이 홈 인디케이터에 가려지지 않도록 배치합니다.

### 3.2 로딩 상태 규칙

| 상황 | 처리 방식 |
| --- | --- |
| 에셋 목록 로딩 | `AssetCard` Skeleton (Pulse animation) |
| 이미지 로딩 | Blur-up (저해상도 → 고해상도 전환) |
| 업로드 진행 | 상단 `UploadProgressBar` (0→100%) |
| AI 분류 중 | `AIShimmerOverlay` (shimmer 효과) |

### 3.3 제스처 인터랙션

| 제스처 | 화면 | 동작 |
| --- | --- | --- |
| Swipe-down | `BottomSheet` | 시트 닫기 |
| Swipe-down | `CaptureViewfinder` | 캡처 화면 닫기 |
| Long-press | `AssetCard` | 다중 선택 모드 진입 |
| Pinch-zoom | `AssetPreview` | 이미지 확대/축소 |

---

## 4. Acceptance Criteria (AC)

- [ ] `/library` 진입 시 `BottomTabs`가 하단에 고정 표시된다.
- [ ] `AssetGrid`는 100개 이상 에셋에서도 60fps 스크롤을 유지한다.
- [ ] 카메라 셔터 후 3초 이내에 `AssetGrid`에 새 카드가 나타난다.
- [ ] `SearchBar` 입력 후 200ms debounce로 실시간 검색 결과가 표시된다.
- [ ] `BottomSheet`의 swipe-down 제스처로 시트가 닫힌다.
- [ ] iPhone의 Dynamic Island 영역과 홈 인디케이터 영역이 Safe Area로 정상 처리된다.
- [ ] 오프라인 상태에서 캡처 시 IndexedDB에 대기열이 쌓이고, 온라인 복귀 시 자동 업로드된다.

---

## 5. 관련 문서

| 문서 | 내용 |
| --- | --- |
| [sprint1-mobile.md](sprint1-mobile.md) | Sprint 1 기능 명세 (Feature Goals, 기술 요구사항) |
| [layout.md](../design/layout.md) | 반응형 레이아웃 전략 및 z-index 계층 |
| [components-phase1.md](../design/components-phase1.md) | 컴포넌트 상세 사양 |
| [overview.md](../design/overview.md) | Fluid Premium 디자인 철학 |
