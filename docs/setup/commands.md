# Development Commands: NOVA (pnpm)

NOVA 모노레포 환경에서 pnpm을 사용하여 프로젝트를 빌드, 실행, 테스트하기 위한 주요 명령어 가이드입니다. 루트 및 개별 앱별 명령어와 Supabase 관련 명령어를 포함합니다.

This guide lists the primary commands for working within the NOVA monorepo using **pnpm**.

## 1. Top-Level Commands (Root)

Run these from the project root directory.

| Command | Description |
| :--- | :--- |
| `pnpm install` | Install all dependencies for the entire monorepo. |
| `pnpm dev` | Start the **web-app** (Next.js) via root filter. |
| `pnpm -r build` | Build all applications and packages in the workspace. |
| `pnpm -r lint` | Run ESLint across all workspaces. |
| `pnpm -r type-check` | Run TypeScript checking across all workspaces. |

---

## 2. Application-Specific Commands

You can use the `--filter` (or `-F`) flag to run commands for specific apps from the root.

### Web App (`apps/web-app`)
- `pnpm --filter web-app dev` - Start Next.js development server.
- `pnpm --filter web-app build` - Build the Next.js production bundle.

### Desktop App (`apps/desktop-app`)
- `pnpm --filter desktop-app desktop:dev` - Launch Electron in development mode.
- `pnpm --filter desktop-app desktop:build` - Package the Electron app.

### Browser Extension (`apps/extension`)
- `pnpm --filter nova-extension dev` - Start Vite for extension development.
- `pnpm --filter nova-extension build` - Build the extension.

---

## 3. Database & Backend (Supabase)

| Command | Description |
| :--- | :--- |
| `supabase start` | Start the local Supabase environment (Docker required). |
| `supabase stop` | Stop the local Supabase environment. |
| `supabase db reset` | Reset the local database. |
| `pnpm gen:types` | (Custom script) Generate TypeScript types from the local schema. |

---

## 4. Maintenance & Cleaning
- `pnpm clean` - Remove all `node_modules` and build artifacts.
- `pnpm update -r` - Update packages across the workspace.
