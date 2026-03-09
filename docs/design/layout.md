# 레이아웃 가이드: NOVA 어댑티브 인터페이스 (Layout Guide)

데스크탑, 태블릿, 모바일을 아우르는 3컬럼 가변 레이아웃 전략과 반응형 그리드, 네비게이션 동작 방식 및 레이어 계층(z-index)을 설명하는 가이드입니다.

## 1. Responsive Grid Breakdown

| Screen Type | Width Range | Layout Strategy | Sidebar Behavior |
| :--- | :--- | :--- | :--- |
| **Mobile** | `< 768px` | **Single Column** | Hidden (Bottom Tabs). |
| **Tablet** | `768px - 1280px` | **2-Column** | Collapsed Sidebar. |
| **Desktop** | `> 1280px` | **3rd-Column** | Permanent Expanded Sidebar. |

---

## 2. Desktop 3-Column Structure

1. **Sidebar (Left)**: 고정 너비(240px) 또는 접기 가능(80px) 구조.
   - *구성*: 탐색 메뉴, 폴더 트리, 스마트 폴더.
2. **Dashboard Content (Center)**: 가변 너비 유동 레이아웃.
   - *구성*: 에셋 그리드, 페이지 헤더, 컨트롤 바.
3. **Detail Panel (Right)**: 맥락에 따른 우측 패널(320px).
   - *구성*: 고해상도 프리뷰, 상세 AI 메타데이터, 팔레트 편집.

---

## 3. Mobile PWA Specifics

- **Bottom Navigation**: Sticky (하단 고정형 인터페이스).
- **Safe Area**: Insets for iPhone Dynamic Island and bottom indicator.
- **Gesture Control**: Swipe-down to close capture preview; horizontal swipe for gallery.

---

## 4. Layering (Z-Index Hierarchy)

- **Base**: 콘텐츠 기본 레이어 (Level 0).
- **Sticky Header/Sidebar**: 고정 헤더 및 사이드바 (Level 1).
- **Top Overlays (Tooltips)**: 툴팁 등 상단 오버레이 (Level 2).
- **Modals/Capture Viewfinder**: 모달 및 카메라 뷰파인더 (Level 3).
- **Global AI Feedback Shimmer**: AI 피드백 및 전체 화면 효과 (Level 4).

---

## 5. Performance Targets

- **Layout Shift**: < 0.1 CLS (누적 레이아웃 이동 최적화).
- **First Meaningful Paint**: 4G 환경 기준 1.0초 이내 렌더링.
- **Scroll Speed**: 그리드 내 에셋 100개 이상 시 60fps 유지.
