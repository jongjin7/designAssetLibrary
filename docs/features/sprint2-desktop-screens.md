# Sprint 2: 데스크탑 관리 화면 구성 명세 (Desktop UI Screen Specification)

Sprint 2 데스크탑 대시보드와 브라우저 확장 프로그램의 UI 구성 요소, 레이아웃 구조, 내비게이션 흐름을 정의합니다. 기능 명세([sprint2-desktop.md](sprint2-desktop.md))를 기반으로 대량 관리와 정밀 캡처를 위한 화면 사양을 구체화합니다.

Sprint 2 Desktop UI focuses on a **3-column high-performance layout** for maximum productivity. It introduces hierarchical navigation, bulk editing, and a 6-mode browser capture tool.

---

## 1. 내비게이션 구조 (Navigation Structure)

### 1.1 전체 화면 흐름

데스크탑 앱은 고정된 사이드바를 통해 주 메뉴와 폴더 구조를 탐색합니다.

```text
┌─────────────────┐
│  Desktop Shell  │
└────────┬────────┘
         │
  ┌──────┴───────┐
  ▼              ▼
Sidebar Nav      Main Content Area
  │              │
  ├─ 모든 에셋    ├─ 에셋 그리드 (Grid)
  ├─ 즐겨찾기     ├─ 검색 결과 (Search)
  ├─ 폴더 트리    └─ 폴더 상세 (Folder View)
  └─ 스마트 폴더
```

### 1.2 사이드바 구성 (Sidebar Navigation)

화면 좌측에 고정되어 서비스 전체의 컨텍스트를 제어합니다.

| 메뉴 그룹 | 구성 요소 | 가용 인터랙션 |
| --- | --- | --- |
| **Library** | 모든 에셋, 즐겨찾기, 최근 항목 | 클릭 시 메인 그리드 필터링 |
| **Folders** | 계층형 폴더 트리 (무제한 깊이) | 폴더 생성/삭제, 드래그로 위치 변경, 가로 화살표로 하위 폴더 개폐 |
| **Smart Views**| 스마트 폴더 목록 | 조건 기반 자동 갱신 목록 확인 |

---

## 2. 화면별 UI 구성

### 2.1 Desktop Dashboard (`/dashboard`)

3-Column 레이아웃을 통해 탐색, 목록 확인, 상세 편집을 한 화면에서 수행합니다.

```text
┌──────────┬──────────────────────────────┬──────────┐
│ [NOVA]   │ 🔍 [ 검색어...         ] [👤]  │ [Detail] │
│          ├──────────────────────────────┤          │
│ Library  │                              │ [Image]  │
│ - All    │                              │          │
│ - Favs   │    [ 모든 에셋 ]  [정렬] [뷰]  │ FileInfo │
│          │                              │ Size/Date│
│ Folders  │ ┌──────┐ ┌──────┐ ┌──────┐   │          │
│ ▿ Work   │ │Asset │ │Asset │ │Asset │   │ Palette  │
│   - UI   │ │Card  │ │Card  │ │Card  │   │ [🔴🔵🟢] │
│   - Icon │ └──────┘ └──────┘ └──────┘   │          │
│          │ ┌──────┐ ┌──────┐ ┌──────┐   │ Tags     │
│ Smart    │ │Asset │ │Asset │ │Asset │   │ #ui #web │
│ - Blue   │ │Card  │ │Card  │ │Card  │   │          │
│          │ └──────┘ └──────┘ └──────┘   │ [Actions]│
└──────────┴──────────────────────────────┴──────────┘
 (Column 1)          (Column 2)            (Column 3)
```

**컬럼별 역할 정의:**

| 컬럼 | 명칭 | 주요 기능 |
| --- | --- | --- |
| **Column 1** | **Sidebar** | 서비스 로고, 메뉴 내비게이션, 계층형 폴더 트리 관리 |
| **Column 2** | **Explorer** | 검색 및 필터링된 에셋 목록 노출. 다중 선택(Shift/Ctrl) 기능 지원 |
| **Column 3** | **Inspector** | 선택된 에셋의 메타데이터 편집 패널. 실시간 저장(Auto-save) 지원 |

---

### 2.2 Browser Extension (Capture Tool)

브라우저 우측 상단 팝업 또는 오버레이 형태로 실행되는 6가지 캡처 기능입니다.

#### 1) 캡처 모드 선택 (Mode Selector)
사용자가 확장 프로그램 아이콘 클릭 시 노출되는 메인 메뉴입니다.

| 모드 | 아이콘 | 설명 |
| --- | --- | --- |
| **전체 페이지** | `Scroll` | 긴 웹페이지를 자동으로 스크롤하며 하나의 이미지로 합성 |
| **보이는 영역** | `Monitor` | 현재 브라우저 뷰포트에 표시된 영역만 즉시 캡처 |
| **영역 선택** | `Crop` | 사용자가 드래그하여 지정한 영역만 크롭하여 저장 |
| **요소 캡처** | `MousePointer` | 마우스 오버된 DOM 요소를 감지하여 해당 영역만 캡처 |
| **이미지 추출** | `Image` | 현재 페이지에 삽입된 모든 이미지 소스를 리스트화하여 선택 저장 |
| **반응형 캡처** | `Smartphone` | 주요 중단점(Breakpoints)별 화면을 세트로 생성하여 저장 |

#### 2) 캡처 프리뷰 및 저장 (Preview & Sync)
캡처 직후 에셋을 라이브러리로 전송하기 전 최종 확인 단계입니다.

```text
┌─────────────────────────────┐
│ ◀ 캡처 확인         [⬆ 저장] │  ← 상단 액션바
├─────────────────────────────┤
│                             │
│       [ 캡처된 이미지 ]       │  ← 캡처 결과물 미리보기
│                             │
├─────────────────────────────┤
│ 파일명: [ auto-generated ]  │  ← 기본 메타데이터 입력
│ 폴더:   [ 선택하세요...   ▼]  │  ← 저장 대상 폴더 지정
│ 태그:   [ #captured +    ]  │  ← 추가 태그 부여
└─────────────────────────────┘
```

---

## 3. 데스크탑 전용 UI 규칙

### 3.1 Drag & Drop (D&D)

*   **Global Drop Zone**: 에셋 그리드(Col 2) 영역 전체가 드롭 존으로 작동하며, OS 탐색기에서 파일을 끌어올 때 "Drop to Upload" 오버레이가 활성화됩니다.
*   **Move to Folder**: 그리드 내의 에셋 카드를 사이드바의 특정 폴더로 드래그하여 이동할 수 있습니다.

### 3.2 Hover Effects

*   **Interactive Cards**: 에셋 카드 호버 시 다중 선택을 위한 체크박스와 퀵 액션(즐겨찾기, 확대) 버튼이 노출됩니다.
*   **Sidebar Items**: 호버 시 폴더 설정(이름 변경, 삭제) 버튼이 우측에 나타납니다.

### 3.3 로딩 및 상태 안내

| 상황 | 처리 방식 |
| --- | --- |
| 대량 데이터 로딩 | 사이드바와 그리드에 독립적인 Skeleton UI 적용 |
| 스마트 폴더 쿼리 | 검색 결과 상단에 "Smart View 업데이트 중..." 인디케이터 표시 |
| 확장 프로그램 동기화 | 캡처 이미지 전송 시 사이드바 상단에 '동기화 중' 상태 배지 노출 |

---

## 4. 수락 기준 (Acceptance Criteria)

### 대시보드 및 관리 (Dashboard & Management)
- [ ] **[3열 레이아웃]** 1280px 이상의 해상도에서 사이드바, 그리드, 정보 패널이 겹침 없이 3열로 유지된다.
- [ ] **[폴더 트리 인터랙션]** 폴더 생성/이동 시 UI 반영 속도가 로컬 업데이트 기준 100ms 이내로 체감되어야 한다.
- [ ] **[다중 선택]** `Shift+Click` 또는 마우스 드래그를 통한 다중 선택 기능이 오류 없이 작동한다.
- [ ] **[실시간 동기화]** 모바일 기기에서 캡처된 에셋이 데스크탑 대시보드에 3초 이내로 자동 동기화되어 나타난다.

### 브라우저 확장 프로그램 (Capture Tool)
- [ ] **[캡처 모드 동작]** 6가지 캡처 모드 중 '전체 페이지' 캡처 시 잘림 현상이나 합성 오류가 발생하지 않는다.
- [ ] **[저장 속도]** 캡처 완료 후 '저장' 버튼 클릭 시 라이브러리 전송 완료까지 3초 이내에 수행된다.
- [ ] **[폴더 연동]** 확장 프로그램 내에서 대시보드의 폴더 트리를 실시간으로 불러와 저장 위치를 지정할 수 있다.

---

## 5. 관련 문서

| 문서 | 내용 |
| --- | --- |
| [sprint2-desktop.md](sprint2-desktop.md) | Sprint 2 기능 명세 (Feature Goals, 기술 요구사항) |
| [sprint1-mobile-screens.md](sprint1-mobile-screens.md) | Sprint 1 모바일 화면 구성 명세 |
| [sprint2_execution_plan.md](../implementation_plans/sprint2_execution_plan.md) | Sprint 2 실행 절차 및 우선순위 로드맵 |
| [layout.md](../design/layout.md) | 반응형 레이아웃 전략 및 z-index 계층 |
