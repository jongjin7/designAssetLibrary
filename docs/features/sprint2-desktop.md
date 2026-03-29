# Sprint 2: Desktop Expansion & Organization Specification

This specification defines the functional and technical requirements for the **"Electron-based Native Management & Capture Channel Expansion"**, the core objective of Sprint 2.

## 1. Feature Goals

- **Native File Power:** Local file Drag & Drop and **Monitored Folders (Chokidar)** for auto-ingestion.
- **Browser Super-Charge:** Powerful browser extension supporting 7 sophisticated capture modes.
- **Deep Organization:** Hierarchical folders (up to 5 levels) and condition-based **Smart Folders**.
- **Keyboard-First Workflow:** Ultra-fast categorization and sorting via hotkeys (e.g., F-key menu).
- **Rich Metadata:** Automated context memos, rating (1-5), color labels, and Batch Renaming.

---

## 2. Core User Stories

1. **As an administrator**, I want to migrate massive local design folders to NOVA with a single drag-and-drop.
2. **As a web collector**, I want to capture specific areas of a webpage or multiple images and send them instantly to my library.
3. **As an organizer**, I want a smart folder that automatically displays 'Red assets' or 'PNGs saved within the last 7 days'.

---

## 3. Technical Requirements

### 3.1 Electron Integration
- **Native FS Access:** Real-time change detection and auto-inbox ingestion using `chokidar`.
- **High Performance:** **Sharp**-based batch processing for thumbnails to minimize wait time for 100+ uploads.
- **Local DB:** SQLite (`better-sqlite3`) to ensure **< 200ms response time** when listing tens of thousands of assets.

### 3.2 Browser Extension (Manifest V3)
- **7 Imaging Modes:** Area, Element, Visible, Full Page, Batch Save, Auto-Detect (Scroll detection), URL Bookmark.
- **Context Menu:** Page analysis and batch image extraction via right-click.
- **Drop Zone:** Dedicated overlay drop zone displayed on the right edge when dragging web images for instant saving.

### 3.3 Advanced Sorting & Naming
- **Smart Folder Engine:** Real-time query engine supporting complex conditions (AND/OR) for tags, formats, dates, and colors.
- **Batch Rename:** Naming engine supporting 6+ parameters including `%N` (Number) and `%F` (Folder name).

---

## 4. Acceptance Criteria (AC)

- [ ] Successful build and execution of Desktop apps for both macOS and Windows.
- [ ] Grid thumbnail loading completed within **3s** for 100+ dragged-and-dropped images.
- [ ] Successful ingestion of all 7 browser capture modes into the Electron main process.
- [ ] Smart Folders: Real-time reflection (within 3s) of asset lists after condition changes.
- [ ] Performance: Navigation and tagging response maintained under **200ms** in environments with 20,000+ tags.
