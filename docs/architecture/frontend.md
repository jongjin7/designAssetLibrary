# Frontend Architecture: NOVA

Next.js, Electron, 브라우저 확장 프로그램 등 3개의 애플리케이션이 공유하는 프론트엔드 구조를 설명합니다. 공통 UI 라이브러리(`packages/ui`)와 고성능 렌더링을 위한 OPFS 및 웹 워커 활용 방안을 다룹니다.

NOVA's frontend is split across three distinct applications (`web-app`, `desktop-app`, `extension`) that share a common UI and logic layer.

## 1. Frameworks & Tools

- **Next.js 15 (App Router):** Unified PWA and Desktop Web engine.
- **Electron 30:** Desktop shell for native file system access.
- **Manifest V3:** High-performance browser capture extension.
- **Vanilla CSS:** Modular styling for maximum performance (**0.2s target**).
- **OPFS (Origin Private File System):** Direct browser-level storage for high-res asset caching.
- **Web Workers:** Background processing for image compression (WebP), SHA-256 generation, and AI analysis.

## 2. Shared Design System (`packages/ui`)

All frontend applications consume from the `packages/ui` package to ensure visual consistency between the mobile camera interface and the desktop file manager.

- **Design Tokens:** Defined centrally in `packages/ui/tokens`.
- **Core Components:** Buttons, Modals, Asset Cards, and File Grids.

## 3. High-Performance Pipeline

To achieve **0.2s instant browsing**, the system implements:

1. **Client-side Optimization:** Web Worker + Canvas API for instant thumbnails and metadata stripping.
2. **Local Hybrid Storage:** **OPFS (Origin Private File System)** for lightning-fast image I/O.
3. **Resumable Sync:** **TUS Protocol** integration via Supabase Storage.

## 4. Platform Capabilities

### 4.1 PWA Strategy (Sprint 1)

- **Offline Mode:** Assets captured while offline are stored in IndexedDB.
- **Background Sync:** Service Workers handle the upload queue when connectivity is restored.

### 4.2 Desktop Integration (Sprint 2)

- **Styling**: Tailwind CSS v4 (CSS-first engine)
    - Zero-config approach (No `tailwind.config.js`).
    - Theme configuration via native CSS `@theme` in `globals.css`.
    - Auto-scanning of workspace packages via `@source` directives.
- **Responsive Layout:** A 3-level adaptive layout:
    - **Mobile:** Single column (viewfinder/list).
    - **Tablet:** 2-column (sidebar + list).
    - **Desktop:** 3-column (sidebar + list + detail panel).
- **Native APIs:** Use `window.electron` bridge for local file system drag-and-drop.

## 5. State Management

- **React Context:** For lightweight application-wide state (Auth, Theme).
- **SWR / React Query:** Or similar for server state synchronization with Supabase.
- **Supabase Realtime:** To push updates to the UI immediately after AI classification.
