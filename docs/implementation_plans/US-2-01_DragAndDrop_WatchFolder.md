# Implementation Plan — US-2-01: Local File Drag & Drop & Watched Folder

## 1. Goal
- Support high-performance, asynchronous drag & drop for files and folders.
- Support 8 file formats: `JPG, PNG, WebP, GIF, SVG, PDF, OTF, TTF`.
- Implement a "Watched Folder" feature in the Electron app to automatically import files.

## 2. Technical Stack
- **Library**: `chokidar` for folder watching (Main Process).
- **Communication**: Electron IPC (Main <-> Preload <-> Renderer).
- **UI**: React (Renderer) + Lucide Icons.

## 3. Tasks

### Phase 1: Enhanced Drag & Drop (Renderer)
- [ ] **Modify `DropZone.tsx`**:
    - Update `handleDrop` to use `webkitGetAsEntry()` for recursive folder traversal.
    - Pass an array of `File` objects to the handler.
- [ ] **Modify `DesktopLibraryView.tsx`**:
    - Update `handleDrop` to support all 8 formats.
    - Implement batch processing logic (non-blocking for 100+ files).
    - Show error toast for unsupported formats.

### Phase 2: Folder Watching (Electron Main & Preload)
- [ ] **Install `chokidar`**: Add to `apps/desktop-app` dependencies.
- [ ] **Modify `apps/desktop-app/src/main.ts`**:
    - Add `FolderWatcher` class to manage `chokidar` instance.
    - Implement IPC listeners: `set-watch-folder`, `get-watch-folder`, `toggle-watch`.
    - Send `new-file-detected` event to renderer when a file is added.
- [ ] **Modify `apps/desktop-app/src/preload.ts`**:
    - Expose `watchFolder` API: `setPath`, `getPath`, `onFileAdded`.

### Phase 3: Integration (Renderer)
- [ ] **Create/Update `useDesktopShell` or a new hook**:
    - Listen for `onFileAdded` event from Electron.
    - Automatically call `addAsset` when a file is detected.
- [ ] **UI for Settings**:
    - (Optional/Later) Add a way to configure the watched folder in the UI. For now, we can use a default path or a simple IPC call.

## 4. Verification
- Drop a folder with mixed content: verify only supported formats are added.
- Drop 100+ files: verify UI remains responsive.
- Add a file to the watched folder: verify it appears in the library automatically.
