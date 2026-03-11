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
   - 대용량 바이너리 데이터를 브라우저 샌드박스 내부의 전용 파일 시스템에 직접 저장.
   - 하드 디스크 가용 용량의 최대 60%(GB 단위)까지 확보 가능하여 수만 장의 고해상도 자산 관리 가능.
3. **Resumable Sync:** **TUS Protocol** integration via Supabase Storage.

## 4. Platform Capabilities

### 4.1 PWA Strategy (Sprint 1)

- **Engine:** `@ducanh2912/next-pwa`를 통한 전문적인 자산 캐싱 및 오프라인 구동 환경 구축.
- **Offline Mode:** 
  - `NetworkStatus` 컴포넌트를 통해 실시간 연결 상태 감지.
  - 오프라인 시에도 캐싱된 페이지를 통해 카메라 캡처 및 검색 기능 정상 작동.
  - 네트워크 단절 시 OPFS와 LocalStorage를 결합한 Local-First 모드로 자동 전환.
- **Secure Context (Camera Access):** `MediaDevices.getUserMedia()` requires a Secure Context (HTTPS or `localhost`). Mobile testing uses `next dev --experimental-https`.
- **Hybrid Capture Fallback:** 카메라 미지원 또는 보안 미충족 시 자동으로 파일 입력(갤러리) 모드로 전환.

#### 4.1.1 Known Issues & Constraints
- **beforeinstallprompt 쿨다운**: 사용자가 설치를 거절하거나 취소할 경우, 브라우저 정책에 의해 일정 시간 동안 설치 이벤트가 발생하지 않을 수 있습니다.
- **iOS 제약**: 의도적으로 iOS에서는 Safari 브라우저에서만 "홈 화면에 추가" 기능을 지원하며, 타 브라우저(Chrome 등)에서는 설치 안내 배너를 숨김 처리합니다.
- **HTTPS 필수**: 자가 서명 인증서(`dev:https`) 사용 시 일부 모바일 기기에서 PWA 설치 기능이 비활성화될 수 있습니다 (실서비스 배포 시 해결).

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

## 5. Data Layer & State Management

NOVA는 데이터 소스에 관계없이 일관된 인터페이스를 제공하기 위해 **레포지토리 패턴(Repository Pattern)**을 도입했습니다.

### 5.1 Repository Pattern

데이터 소스 추상화를 위해 다음과 같은 구조를 유지합니다:

```text
apps/web-app/src/
├── lib/
│   ├── repositories/
│   │   ├── AssetRepository.ts       # 인터페이스 정의
│   │   ├── MockAssetRepository.ts   # OPFS + LocalStorage 기반 영구 저장
│   │   └── SupabaseAssetRepository.ts # 실 서비스용 통신 구현
│   ├── storage/
│   │   └── opfs.ts                  # 로컬 파일 시스템 유틸리티
│   └── dataService.ts               # 레포지토리 주입 관리
```

- **AssetRepository Interface**: 에셋 조회, 저장, 삭제, 즐겨찾기 등 모든 데이터 도달 규칙 정의.
- **MockAssetRepository**: OPFS + LocalStorage 기반의 영구 로컬 저장소 구현.
- **SupabaseAssetRepository**: 실제 클라우드 백엔드 통신 구현.
- **DataService**: 환경 변수(`NEXT_PUBLIC_USE_MOCK`)에 따라 런타임에 적절한 구현체를 주입.

### 5.2 State Mangement
- **React Context:** For lightweight application-wide state (Auth, Theme).
- **useAssets Hook:** 레포지토리 로직을 캡슐화하여 UI 컴포넌트에 로딩 상태 및 실시간 데이터 제공.
- **Supabase Realtime:** To push updates to the UI immediately after AI classification.

---

## 6. Persistent Mock 환경 (Offline-First Development)

Supabase 백엔드 없이도 실제 앱과 동일한 영속성을 가지는 Mock 환경을 구축했습니다.

- **Storage Strategy**:
  - **이미지 바이너리**: OPFS(`FileSystemDirectoryHandle`)에 직접 저장하여 대용량 처리.
  - **메타데이터**: `localStorage`에 JSON 포맷으로 저장하여 새로고침 후에도 목록 유지.
- **Initialization Lock**: React Strict Mode나 동시 호출로 인한 OPFS 경합을 방지하기 위해 `initializationPromise` 기반의 락 메커니즘 적용.

### 6.1 환경 조건 정리

| 환경 | Mock (OPFS) 활성화 | 실제 Supabase 연결 |
| --- | --- | --- |
| `development` | ✅ 활성화 | ❌ (Mock으로 대체) |
| `production` | ❌ 비활성화 | ✅ |
