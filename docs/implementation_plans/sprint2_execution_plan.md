# Sprint 2: Desktop Management Execution Plan

This document outlines the systematic implementation steps for Sprint 2, focusing on the Desktop Experience and Advanced Asset Management.

---

## 🏗 Phase 1: Dashboard Foundation (P1)
**Goal**: Establish a professional 3-column layout and desktop-native UX.

### 1.1 High-Performance 3-Column Layout
- [ ] **Sidebar (Col 1)**: Implement a fixed-width navigation area for Library, Favorites, Folders, and Smart Views.
- [ ] **Asset Grid (Col 2)**: Optimize the existing `AssetGrid` for desktop resolutions (multi-column, variable gap).
- [ ] **Info Panel (Col 3)**: Replace the mobile `BottomSheet` with a persistent right-side panel for editing metadata.

### 1.2 Desktop-First Interactions
- [ ] **Drag-and-Drop (D&D)**: Implement a global drop zone for instant file uploads from OS file explorer.
- [ ] **Multi-Select**: Shift/Ctrl+Click functionality to select multiple assets in the grid.
- [ ] **Keyboard Shortcuts**: `Delete` for removal, `F2` for rename, `Cmd+A` for select all.

---

## 📂 Phase 2: Organized Library (P2)
**Goal**: Advanced categorization using hierarchical and dynamic folder logic.

### 2.1 Hierarchical Folder System
- [ ] **Table Schema**: Update/verify `folders` table for recursive parent-child relationships.
- [ ] **Tree UI**: Implement an expandable/collapsible folder tree in the Sidebar.
- [ ] **Move Logic**: Drag assets into folders to update their `folder_id`.

### 2.2 Smart Folder Logic
- [ ] **Query Builder**: Create an internal utility to map folder rules (e.g., tags, date range) to filter queries.
- [ ] **Smart Views**: Automatically populate "folders" based on metadata conditions.
- [ ] **Performance**: Ensure smart folder assets load in < 200ms.

---

## 🔌 Phase 3: Extension & Advanced Capture (P3)
**Goal**: Broaden capture channels and deepen native integration.

### 3.1 Browser Extension (6 Modes)
- [ ] **Web Extension Shell**: Activate `apps/extension` with manifest v3.
- [ ] **Capture Engine**: Implement Full Page, Element, and Visible Area capture logic.
- [ ] **Auto-Upload**: Zero-friction sync from the browser directly to the NOVA library.

### 3.2 Native Enhancements
- [ ] **Electron Bridge**: Expose more native APIs for file system access and system notifications.
- [ ] **Global Hotkeys**: Desktop shortcut to trigger quick capture or dashboard focus.

---

## 📈 Current Status & Next Action
- [x] **Desktop Environment Setup**: Basic responsive switching and dashboard entry point created.
- [ ] **Next Immediate Task**: Implement the **Right-side Info Panel** in the Dashboard to replace mobile Detail View logic.

---

> [!IMPORTANT]
> All desktop changes must maintain backward compatibility with the Mobile Capture experience via the shared `web-app` codebase.
