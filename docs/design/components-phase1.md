# 공통 컴포넌트: Phase 1 (Common Components)

Sprint 1과 2에서 개발되는 핵심 컴포넌트(AssetCard, Grid, CaptureOverlay 등)의 사양과 에스테틱, 동작 방식 및 성능 체크리스트를 포함하는 문서입니다.

## 1. Content & Display

### `AssetCard` (The Core Display Unit)
- **Props**: `src`, `title`, `tags`, `palette`, `isCompact`.
- **Aesthetics**: Glassmorphism footer with dynamic background hover (glow).
- **Behavior**: Single-click for selective mode; double-click for full-screen detail view.

### `AssetGrid` (Windowed View)
- **Strategy**: Virtualization (using `react-window` or custom logic) to maintain **0.2s scroll performance**.
- **Layout**: 2-column (Mobile), 4+ column (Desktop Adaptive).

---

## 2. Capture & Action

### `CaptureOverlay` (Mobile PWA Focus)
- **Role**: Overlaid camera interface with real-time AI feedback.
- **Micro-interactions**: Shimmer effect on target area when AI detects an object.
- **Controls**: Shutter button, Flash toggle, Lens switch.

### `GlobalActionButton` (The Capture Trigger)
- **Role**: Floating Action Button (FAB) on mobile; Quick Capture in desktop sidebar.
- **Logic**: Morphing animation—expands into a menu or triggers the camera.

---

## 3. Navigation & Filtering

### `AdaptiveSidebar` (Desktop Focus)
- **Role**: 3nd column containing `FolderTree`, `SmartFolderList`, and User Info.
- **Adaptive**: Collapses to icon-only view on medium screens.

### `BottomTabs` (Mobile Focus)
- **Role**: Fixed bottom navigation for PWA.
- **Links**: Library, Search, Camera (Active Center), Settings.

### `SearchBar` (Omni-search)
- **Features**: Keyboard-first interaction (Cmd+K).
- **Results**: Fuzzy matching across tags, names, and even color palettes.

---

## 4. Hierarchy & Organization

### `FolderTree` (Recursive Navigation)
- **Role**: Infinite depth tree for manual folders.
- **Actions**: Drag-and-drop to move assets between folders (Sprint 2 goal).

---

## 5. Performance Checklist for Components
- [ ] No layout shifts on image load (Blur-up technique).
- [ ] Hover states trigger in < 20ms using CSS transitions.
- [ ] Skeleton screen state defined for async data loading.
