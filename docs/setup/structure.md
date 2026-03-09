# 프로젝트 구조: NOVA 모노레포 (Project Structure: NOVA Monorepo)

모노레포 내의 각 애플리케이션(`apps`)과 공유 패키지(`packages`)의 역할 및 디렉토리 구조를 설명합니다. 각 구성 요소가 어떻게 유기적으로 연결되어 고성능 파이프라인을 형성하는지 정의합니다.

The NOVA project uses a monorepo architecture to share logic and types between the mobile PWA, desktop Electron app, and browser extension.

## 1. Directory Tree

```text
/
├── apps/
│   ├── web-app/         # Next.js 15: Mobile PWA & Desktop Web Dashboard
│   ├── desktop-app/     # Electron 30: Desktop File System Integration
│   └── extension/       # Manifest V3: Browser Capture Tool
├── packages/
│   ├── shared/          # Shared DB types, AI logic, and common utils
│   ├── ui/              # Shared Design System & UI Components
│   └── config/          # Shared ESlint, Prettier, and Tailwind configurations
├── docs/                # Project documentation (Technical Spec, Design, Setup)
└── README.md            # Entry point for the entire monorepo
```

## 2. Component Descriptions

### `/apps/web-app` (Primary UX)

- **Framework:** Next.js 15 (App Router).
- **Styling:** Vanilla CSS with custom design tokens.
- **Role:** Handles the unified dashboard for both mobile (PWA) and desktop users.
- **Sprint 1 Focus:** Camera integration & mobile layout optimization.

### `/apps/desktop-app` (File Manager)

- **Framework:** Electron 30 + Vite.
- **Role:** Specific for desktop-only features like drag-and-drop local file synchronization and system-level context menus.

### `/apps/extension` (Capture Tool)

- **Framework:** React + Vite (Manifest V3).
- **Role:** Captures web design assets directly from browser tabs (6-mode capture).

### `/packages/shared` (Core Logic)

- **Content:** Zod schemas, Supabase client configuration, and shared AI logic.
- **Goal:** Single source of truth for the database schema (phash, palette, sha256).

## 3. High-Performance Pipeline

To achieve **0.2s instant browsing**, the system implements:

1. **Client-side Optimization:** Web Worker + Canvas API for instant thumbnails and metadata stripping.
2. **Local Hybrid Storage:** **OPFS (Origin Private File System)** for lightning-fast image I/O.
3. **Resumable Sync:** **TUS Protocol** integration via Supabase Storage.

## 4. Workflow for Developers

1. **Adding a Feature:** Ensure shared types are added to `packages/shared` first if they impact multiple apps.
2. **UI Updates:** Check `packages/ui` to see if a component can be shared before building it locally.
3. **Running the Project:** Refer to [commands.md](commands.md) for CLI instructions.
