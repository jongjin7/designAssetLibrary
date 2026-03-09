# Sprint 2: Desktop Management Specification

데스크탑 대시보드와 브라우저 확장 프로그램 개발을 위한 기능 명세서입니다. 계층형 폴더 관리, 메타데이터 기반 스마트 폴더, 그리고 6가지 모드의 강력한 웹 캡처 도구 사양을 정의합니다.

Sprint 2 focuses on the **Desktop Experience**, featuring advanced organization through hierarchical folders and dynamic "Smart Folders".

## 1. Feature Goals

- **Desktop Dashboard:** 3-column high-performance adaptive layout.
- **Hierarchical Folders:** Unlimited depth tree with instant move/copy.
- **Smart Folders:** Dynamic virtual views using `is_smart_folder` PostgreSQL logic.
- **Browser Extension:** 6-mode capture tool with zero-friction saving.
- **Bulk Operations:** Multi-select and batch metadata editing.

---

## 2. Core User Stories

1. **As a power user**, I want to drag multiple files from my desktop into my library.
2. **As an organized user**, I want to place assets into nested folders with unlimited depth.
3. **As a curator**, I want a folder that automatically shows all `#blue` assets from the last 30 days.

---

## 3. Technical Requirements

### 3.1 Folder System (`folders` table)

- **Structure:** Recursive tree navigation using PostgreSQL queries.
- **Actions:** Create, Rename, Nest, Delete (with orphan handling).
- **Auto-tagging:** Folders can have `auto_tags` that are applied to any new asset moved into them.

### 3.2 Smart Folders Logic

- **Implementation:** Query builder that translates conditions into PostgreSQL JSONB filters.
- **Virtual Views:** Folders with `is_smart_folder = true` act as dynamic viewpoints for assets with matching tags/colors.

### 3.3 Desktop App Extension

- **6 Capture Modes:** 
  - **Full Page:** High-res auto-stitching.
  - **Visible Area:** Current screen capture.
  - **Selected Element:** DOM-based capture.
  - **Batch Image Save:** Extracts all images from a webpage.
  - **Responsive Viewport:** Tests capture at different breakpoints.
  - **Text/Color Picker:** Quick tool for design inspiration.
- **Performance:** Extension to Dashboard sync also targeting < 3s.

---

## 4. Milestones (Sprint 2: Weeks 4-6)

- **Week 4:** Desktop Dashboard UI & Adaptive Layout.
- **Week 5:** Hierarchical Folder System & Smart Folder Logic.
- **Week 6:** Browser Extension (6 modes) & Beta Release.

---

## 5. Acceptance Criteria (AC)

- [ ] Users can create nested folders up to unlimited levels deep.
- [ ] Drag-and-drop file upload works on both Web and Electron apps.
- [ ] "Smart Folder" query results update in < 200ms when filtered.
- [ ] Browser extension successfully captures and uploads images directly to the user's library under 3s.
