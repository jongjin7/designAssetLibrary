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

1.  **Sidebar (Left)**: Fixed-width (240px) or Collapsible (80px). 
    - *Contains*: Navigation, FolderTree, SmartFolders.
2.  **Dashboard Content (Center)**: Fluid width. 
    - *Contains*: AssetGrid, Page Headers, Control Bars.
3.  **Detail Panel (Right)**: Contextual (320px). 
    - *Contains*: Full-res preview, Extended AI Metadata, Palette Edit.

---

## 3. Mobile PWA Specifics

- **Bottom Navigation**: Sticky (`position: fixed; bottom: 0;`).
- **Safe Area**: Insets for iPhone Dynamic Island and bottom indicator.
- **Gesture Control**: Swipe-down to close capture preview; horizontal swipe for gallery.

---

## 4. Layering (Z-Index Hierarchy)

- **Base**: `0` (Content).
- **Sticky Header/Sidebar**: `10`.
- **Top Overlays (Tooltips)**: `50`.
- **Modals/Capture Viewfinder**: `100`.
- **Global AI Feedback Shimmer**: `150`.

---

## 5. Performance Targets
- **Layout Shift**: < 0.1 CLS (Cumulative Layout Shift).
- **First Meaningful Paint**: < 1.0s on 4G connections.
- **Scroll Speed**: Steady 60fps even with 100+ assets in the grid.
