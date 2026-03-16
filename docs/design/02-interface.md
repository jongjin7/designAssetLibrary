# 인터페이스 명세서 (Interface Specification)

NOVA의 반응형 레이아웃 전략과 주요 컴포넌트의 사양 및 규격을 정의합니다.

---

## 1. 반응형 레이아웃 전략

데스크탑, 태블릿, 모바일을 아우르는 어댑티브 인터페이스를 지향합니다.

| Screen Type | Width Range | Layout Strategy | Sidebar Behavior |
| :--- | :--- | :--- | :--- |
| **Mobile** | `< 768px` | **Single Column** | 하단 탭 네비게이션 사용. |
| **Tablet** | `768px - 1024px` | **2-Column** | 사이드바 축소 (아이콘 모드). |
| **Desktop** | `> 1024px` | **3rd-Column** | 사이드바 확장 및 우측 상세 패널. |

### 데스크탑 3컬럼 구조
1.  **Sidebar (Left)**: 고정 너비(240px) 또는 접기(80px). 탐색 메뉴 및 폴더 트리.
2.  **Dashboard (Center)**: 가변 너비. 에셋 그리드 및 메인 컨트롤 바.
3.  **Detail Panel (Right)**: 맥락적 정보 제공 패널(320px). AI 메타데이터 및 편집.

---

## 2. 표준 규격 (Standard Sizing)

모든 인터랙티브 요소는 `sm`, `md`, `lg` 규격을 표준화하여 일관성을 유지합니다.

| Size | Height | Font Size | Icon Size | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **sm** | `2.25rem` (36px) | `0.75rem` (12px) | `14px` | 필터 요소, 모바일 리스트 항목. |
| **md** | `2.75rem` (44px) | `0.875rem` (14px) | `16px` | 기본 입력창, 버튼 (Default). |
| **lg** | `3.25rem` (52px) | `1rem` (16px) | `18px` | 메인 검색바, 강조 CTA 버튼. |

---

## 3. 주요 컴포넌트 명세 (Phase 1)

### Atoms (기본 요소)
-   **NVInput & NVSelect**: `has-[:disabled]`를 통한 통합 상태 관리. 내부 패딩 및 아이콘 위치 규격화.
-   **NVButton**: `primary`, `secondary`, `vivid`, `danger`, `ghost`, `glass` 변형 제공.
-   **NVEmptyState**: 콘텐츠 부재 시 로고 중심의 중앙 정렬 레이아웃 제공.

### Molecules (결합 단위)
-   **NVAssetCard**: 1:1 정방형 썸네일, 글라스모피즘 푸터, 호버 시 퀵 액션 노출.
-   **NVSearchBar**: 통합 검색 필드와 상세 필터 토글 버튼 결합.
-   **NVFilterGroup**: 전역/카테고리 필터 칩셋 관리.

### Organisms (기능 단위)
-   **NVAssetGrid**: 적응형 그리드 시스템.
    -   모바일: 최소 2열.
    -   데스크탑: 뷰포트에 따라 3~5열 가변 (사이드바 확장 시 가독성 우선).

---

## 4. 레이어 계층 및 성능 (Z-Index & Performance)

-   **Z-Index**:
    -   Level 0: 기본 콘텐츠.
    -   Level 1: 고정 헤더 및 사이드바.
    -   Level 2: 툴팁 등 상단 오버레이.
    -   Level 3: 모달 및 카메라 뷰파인더.
    -   Level 4: 글로벌 AI 피드백 및 Shimmer 효과.
-   **Performance**:
    -   **CLS**: < 0.1 (레이아웃 이동 최소화).
    -   **Response**: UI 상태 변경 < 100ms 지각 속도 유지.
    -   **Grid**: 가상화(Virtualization)를 통한 수백 개 에셋의 60fps 스크롤 유지.
