# Sprint 2: 데스크탑 관리 화면 구성 명세 (Desktop UI Screen Specification)

Sprint 2 데스크탑 대시보드와 브라우저 확장 프로그램의 UI 구성 요소, 레이아웃 구조, 내비게이션 흐름을 정의합니다. 기능 명세([sprint2-desktop.md](sprint2-desktop.md))를 기반으로 대량 관리와 정밀 캡처를 위한 화면 사양을 구체화합니다.

Sprint 2 Desktop UI focuses on a **3-column high-performance layout** (Sidebar - Explorer - Inspector) for maximum productivity.

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
   ├─ Inbox (새항목) ├─ 에셋 그리드 (Explorer)
   ├─ 모든 에셋      ├─ 검색 결과 (Search)
   ├─ 즐겨찾기       └─ 에셋 상세 (Inspector)
   ├─ 폴더 트리
   └─ 스마트 폴더
```

### 1.2 사이드바 구성 (Sidebar Navigation)

| 메뉴 그룹 | 구성 요소 | 가용 인터랙션 |
| --- | --- | --- |
| **Workspace** | **Inbox (로컬 감시)** | Chokidar로 감지된 로컬 신규 에셋 승인 대기 목록 |
| **Library** | 모든 에셋, 즐겨찾기, 최근 항목 | 클릭 시 Explorer 그리드 필터링 |
| **Folders** | 계층형 폴더 (Max 5 Depth) | 드래그로 위치 변경, 우측 화살표로 하위 폴더 개폐 |
| **Smart Views**| 스마트 폴더 목록 | 조건 기반(예: "최근 7일 Red") 자동 갱신 목록 |

---

## 2. 화면별 UI 구성

### 2.1 Desktop Dashboard (`/library`)

3-Column 레이아웃을 통해 탐색, 목록 확인, 상세 편집을 한 화면에서 수행합니다.

| 컬럼 | 명칭 | 주요 기능 |
| --- | --- | --- |
| **Column 1** | **Sidebar** | 네비게이션, 폴더 관리, Inbox 상태 확인 |
| **Column 2** | **Explorer** | 에셋 그리드. `Shift+Click` 다중 선택, Drag to Move 지원 |
| **Column 3** | **Inspector** | 메타데이터 편집 패널. 팔레트, **태그 추가/삭제**, 자동 저장(Auto-save) 지원 |

---

### 2.2 Browser Extension (Capture Tool)

기능 명세에 따른 **7가지 캡처 모드**를 지원합니다.

| 모드 | 아이콘 | 설명 |
| --- | --- | --- |
| **전체 페이지** | `Scroll` | 긴 웹페이지 전체 스크롤 합성 캡처 |
| **보이는 영역** | `Monitor` | 현재 뷰포트 즉시 캡처 |
| **영역 선택** | `Crop` | 사용자 드래그 지정 영역 크롭 |
| **요소 캡처** | `MousePointer` | DOM 요소 단위 자동 감지 캡처 |
| **이미지 추출** | `Images` | 페이지 내 모든 이미지 소스 리스트화 (Batch Save) |
| **URL 북마크** | `Link` | 이미지 없이 URL 정보만 에셋으로 저장 |
| **반응형 캡처** | `Smartphone` | 주요 중단점(Breakpoints)별 세트 캡처 |

---

## 3. 데스크탑 전용 UI 규칙

### 3.1 Drag & Drop (D&D)

*   **Global Drop Zone**: Explorer 영역 전체가 드롭 존. OS 파일 드래그 시 "Drop to Upload" 오버레이 활성화.
*   **Move to Folder**: 에셋 카드를 사이드바 폴더로 드래그하여 이동.

### 3.2 단축키 (Keyboard-First Workflow)

가장 빈번한 작업을 마우스 없이 수행할 수 있도록 지원합니다.

| 단축키 | 동작 |
| --- | --- |
| `Ctrl + K` (또는 `Cmd + K`) | 전체 검색(Omni-search) 바 활성화 |
| `F` | 선택된 에셋을 지정된 '즐겨찾기' 폴더로 즉시 이동 |
| `Space` | 에셋 퀵 프리뷰 (Quick Look) |
| `Delete` | 에셋 삭제 (확인 팝업 노출) |
| `1 ~ 5` | 선택된 에셋에 별점(Rating) 부여 |

### 3.3 로딩 및 상태 안내

- **Skeleton UI**: 사이드바와 그리드에 독립적 스켈레톤 적용.
- **Sync Badge**: 모바일/확장 프로그램 동기화 중일 때 사이드바 상단 인디케이터 노출.

---

## 4. 수락 기준 (Acceptance Criteria)

- [ ] **[3열 레이아웃]** 1280px 이상 해상도에서 레이아웃 깨짐 없이 3열 유지.
- [ ] **[단축키 동작]** `Space` 프리뷰 및 `F` 이동 기능이 100ms 이내에 반응.
- [ ] **[7종 캡처]** 브라우저 확장 프로그램에서 URL 북마크를 포함한 7종 모드가 정상 작동.
- [ ] **[실시간 동기화]** 모바일 촬영 데이터가 데스크탑 상단 Inbox에 3초 이내 노출.

---

## 5. 관련 문서

| 문서 | 내용 |
| --- | --- |
| [sprint2-desktop.md](sprint2-desktop.md) | Sprint 2 기능 명세 |
| [sprint1-mobile-screens.md](sprint1-mobile-screens.md) | Sprint 1 모바일 화면 명세 |
