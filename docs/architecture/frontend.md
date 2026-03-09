# 프론트엔드 아키텍처: NOVA (Frontend Architecture: NOVA)

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
- **Implementation Strategy:** All components and logic must follow the [Coding Implementation Guide](../CONTRIBUTING_CODE.md) (Atomic Granularity & Anti-Bloat) to ensure small, manageable files and prevent bloated components.

## 3. High-Performance Pipeline

To achieve **0.2s instant browsing**, the system implements:

1. **Client-side Optimization:** Web Worker + Canvas API for instant thumbnails and metadata stripping.
2. **Local Hybrid Storage:** **OPFS (Origin Private File System)** for lightning-fast image I/O.
3. **Resumable Sync:** **TUS Protocol** integration via Supabase Storage.

## 4. Platform Capabilities

### 4.1 PWA Strategy (Sprint 1)

- **Offline Mode:** Assets captured while offline are stored in IndexedDB.
- **Background Sync:** Service Workers handle the upload queue when connectivity is restored.
- **Secure Context (Camera Access):** `MediaDevices.getUserMedia()` requires a Secure Context (HTTPS or `localhost`). Mobile testing should use `--experimental-https`.
- **Hybrid Capture Fallback:** On insecure/unsupported environments, the app automatically reflects an alternative "File Input" picker to ensure capture remains functional via the device gallery.

### 4.2 Desktop Integration (Sprint 2)

- **Styling**: Tailwind CSS v4 (CSS-first engine)
  - Zero-config approach (No `tailwind.config.js`).
  - Theme configuration via native CSS `@theme` in `globals.css`.
  - Auto-scanning of workspace packages via `@source` directives.
- **Responsive Layout:** A 3-level adaptive layout:
  - **Mobile**: Single column (viewfinder/list).
  - **Tablet**: 2-column (sidebar + list).
  - **Desktop**: 3-column (sidebar + list + detail panel).
- **Native APIs:** Use `window.electron` bridge for local file system drag-and-drop.

## 5. State Management

- **React Context:** For lightweight application-wide state (Auth, Theme).
- **SWR / React Query:** Or similar for server state synchronization with Supabase.
- **Supabase Realtime:** To push updates to the UI immediately after AI classification.

---

## 6. Mock 환경 설정 (Mock: MSW 2.x + Faker.js)

Supabase 백엔드 없이 개발할 수 있도록 MSW(Mock Service Worker)와 Faker.js를 활용한 완전한 오프라인 Mock 환경을 구성합니다. 개발 환경(`NODE_ENV=development`)에서만 활성화되며, 프로덕션 번들에는 포함되지 않습니다.

### 6.1 설치

```bash
pnpm add -D msw@latest @faker-js/faker --filter web-app
# MSW Service Worker 파일 생성
npx msw init apps/web-app/public --save
```

### 6.2 디렉토리 구조

```text
apps/web-app/
└── src/
    └── mocks/
        ├── browser.ts        # MSW 브라우저 워커 설정 (entry point)
        ├── handlers/
        │   ├── assets.ts     # /assets 관련 핸들러
        │   ├── folders.ts    # /folders 관련 핸들러
        │   └── auth.ts       # /auth 관련 핸들러
        └── factories/
            ├── asset.ts      # Faker 기반 에셋 Fixture 생성
            └── folder.ts     # Faker 기반 폴더 Fixture 생성
```

### 6.3 워커 초기화 (`src/mocks/browser.ts`)

```typescript
import { setupWorker } from 'msw/browser'
import { assetHandlers } from './handlers/assets'
import { folderHandlers } from './handlers/folders'
import { authHandlers } from './handlers/auth'

export const worker = setupWorker(
  ...assetHandlers,
  ...folderHandlers,
  ...authHandlers
)
```

### 6.4 개발 환경에서만 활성화 (`apps/web-app/src/app/layout.tsx`)

```typescript
// MSW는 클라이언트 컴포넌트에서만 초기화
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') return

  const { worker } = await import('../mocks/browser')
  return worker.start({ onUnhandledRequest: 'bypass' })
}

// Root Layout 또는 최상위 Provider에서 호출
enableMocking()
```

### 6.5 Faker 기반 Fixture 생성 (`src/mocks/factories/asset.ts`)

```typescript
import { faker } from '@faker-js/faker'

export interface MockAsset {
  id: string
  file_name: string
  r2_key: string
  sha256: string
  phash: string
  palette: string[]
  tags: string[]
  mime_type: string
  size_bytes: number
  created_at: string
}

export const createMockAsset = (overrides?: Partial<MockAsset>): MockAsset => ({
  id: faker.string.uuid(),
  file_name: faker.system.fileName({ extensionCount: 1 }),
  r2_key: `uploads/${faker.string.uuid()}.webp`,
  sha256: faker.string.hexadecimal({ length: 64, casing: 'lower' }),
  phash: faker.string.hexadecimal({ length: 16, casing: 'lower' }),
  palette: Array.from({ length: 5 }, () => faker.color.rgb()),
  tags: faker.helpers.arrayElements(['brand', 'ui', 'icon', 'photo', 'illustration'], { min: 1, max: 3 }),
  mime_type: 'image/webp',
  size_bytes: faker.number.int({ min: 50_000, max: 5_000_000 }),
  created_at: faker.date.recent({ days: 30 }).toISOString(),
  ...overrides,
})

// 복수 생성 헬퍼
export const createMockAssets = (count = 20) =>
  Array.from({ length: count }, () => createMockAsset())
```

### 6.6 MSW 핸들러 예시 (`src/mocks/handlers/assets.ts`)

```typescript
import { http, HttpResponse } from 'msw'
import { createMockAssets } from '../factories/asset'

// 인메모리 DB (개발 세션 동안 유지)
let mockAssets = createMockAssets(24)

export const assetHandlers = [
  // GET /api/assets — 목록 조회
  http.get('/api/assets', () => {
    return HttpResponse.json({ data: mockAssets, count: mockAssets.length })
  }),

  // POST /api/assets — 새 에셋 추가
  http.post('/api/assets', async ({ request }) => {
    const body = await request.json() as Partial<typeof mockAssets[0]>
    const newAsset = { ...createMockAssets(1)[0], ...body }
    mockAssets = [newAsset, ...mockAssets]
    return HttpResponse.json({ data: newAsset }, { status: 201 })
  }),

  // DELETE /api/assets/:id
  http.delete('/api/assets/:id', ({ params }) => {
    mockAssets = mockAssets.filter((a) => a.id !== params.id)
    return HttpResponse.json({ success: true })
  }),
]
```

### 6.7 환경 조건 정리

| 환경 | MSW 활성화 | 실제 Supabase 연결 |
| --- | --- | --- |
| `development` | ✅ 활성화 | ❌ (Mock으로 대체) |
| `test` | ✅ `msw/node` 사용 | ❌ |
| `production` | ❌ 비활성화 | ✅ |
