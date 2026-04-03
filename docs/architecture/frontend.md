# 프론트엔드 아키텍처: NOVA (Frontend Architecture: NOVA)

Next.js, Electron, 브라우저 확장 프로그램 등 3개 애플리케이션의 공통 프론트엔드 구조 및 기술 규약. 공통 UI 라이브러리(`packages/ui`) 구성 및 OPFS, 웹 워커를 활용한 고성능 렌더링 전략을 포함함.

NOVA's frontend is split across three distinct applications (`web-app`, `desktop-app`, `extension`) that share a common UI and logic layer.

## 1. Frameworks & Tools

- **Next.js 15 (App Router):** Unified PWA and Desktop Web engine.
- **Electron 30:** Desktop shell for native file system access.
- **Manifest V3:** High-performance browser capture extension.
- **Vanilla CSS:** Modular styling for maximum performance (**0.2s target**).
- **OPFS (Origin Private File System):** Direct browser-level storage for high-res asset caching.
- **Web Workers:** Background processing for image compression (WebP), SHA-256 generation, and AI analysis via **TensorFlow.js**.

## 2. Shared Design System (`packages/ui`)

All frontend applications consume from the `packages/ui` package to ensure visual consistency between the mobile camera interface and the desktop file manager.

- **Design Tokens:** Defined centrally in `packages/ui/tokens`.
- **Core Components:** Buttons, Modals, Asset Cards, and File Grids.
- **Implementation Strategy:** All components and logic must follow the [Coding Implementation Guide](../CONTRIBUTING_CODE.md) (Atomic Granularity & Anti-Bloat) to ensure small, manageable files and prevent bloated components.

## 3. High-Performance Pipeline

To achieve **0.2s instant browsing**, the system implements:

1. **Client-side Optimization:** Web Worker + Canvas API for instant thumbnails and metadata stripping.
2. **Local Hybrid Storage:** **OPFS (Origin Private File System)** for lightning-fast image I/O.
   - 대용량 바이너리 데이터의 브라우저 샌드박스 전용 파일 시스템 저장.
   - 하드 디스크 가용 용량의 최대 60%(GB 단위) 확보를 통한 고해상도 자산 관리.
3. **Resumable Sync:** **TUS Protocol** integration via Supabase Storage.

## 4. Platform-Specific Implementation

### 4.1 Mobile & PWA Architecture

- **Engine:** `@ducanh2912/next-pwa` 기반의 전문 자산 캐싱 및 오프라인 구동 환경.
- **Offline Mode:** 
  - `NetworkStatus` 컴포넌트를 통한 실시간 연결 상태 감지.
  - 오프라인 환경 내 캐싱 페이지 기반 카메라 캡처 및 검색 기능 유지.
  - 네트워크 단절 시 OPFS와 LocalStorage 결합 기반 Local-First 모드 자동 전환.
- **Secure Context (Camera Access):** `MediaDevices.getUserMedia()` requires a Secure Context (HTTPS or `localhost`). Mobile testing uses `next dev --experimental-https`.
- **Hybrid Capture Fallback:** 카메라 미지원 또는 보안 미충족 시 파일 입력(갤러리) 모드 자동 전환.

#### 4.1.1 기술적 제약 및 브라우저 정책 (Technical Constraints)
- **beforeinstallprompt 제약**: 사용자 거부/취소 시 브라우저 정책에 따른 이벤트 발생 대기 시간 존재.
- **iOS 플랫폼 정책**: Safari 브라우저 기반의 "홈 화면에 추가" 기능만 허용하며, 타 브라우저 대상 설치 안내 배너 노출 제한.
- **보안 컨텍스트(HTTPS)**: 자가 서명 인증서 환경(`dev:https`)에서 일부 기기의 PWA 설치 기능 제한 가능성 (운영 환경 적용 필수).

### 4.2 Desktop & Electron Integration

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

일관된 데이터 인터페이스 제공을 위한 **레포지토리 패턴(Repository Pattern)** 기반 아키텍처.

### 5.1 Repository Pattern

데이터 소스 추상화를 위한 폴더 구조 및 규칙:

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

- **AssetRepository Interface**: 에셋 조회, 저장, 삭제, 즐겨찾기 등 데이터 도달 규칙 정의.
- **MockAssetRepository**: OPFS + LocalStorage 기반 영구 로컬 저장소 구현.
- **SupabaseAssetRepository**: 실제 클라우드 백엔드 통신 구현.
- **DataService**: 환경 변수(`NEXT_PUBLIC_USE_MOCK`) 기반 런타임 구현체 주입.

### 5.2 State Mangement
- **React Context:** For lightweight application-wide state (Auth, Theme).
- **Custom Hooks:** 훅 전용 아키텍처 가이드([Section 7](#7-custom-hooks-architecture))에 따른 도메인 및 피처 로직 캡슐화 제공.
- **Supabase Realtime:** To push updates to the UI immediately after AI classification.

---

## 6. 하이브리드 영속성 및 Mock 전략 (Persistence Strategy)

서비스 인프라 무관, 로컬 단독 구동이 가능한 고성능 영속성 환경.

- **Storage Strategy**:
  - **이미지 바이너리**: OPFS(`FileSystemDirectoryHandle`) 직접 저장을 통한 대용량 처리.
  - **메타데이터**: `localStorage` 내 JSON 포맷 저장을 통한 데이터 영속성 유지.
- **Initialization Lock**: React Strict Mode 및 동시 호출 환경의 OPFS 경합 방지를 위한 `initializationPromise` 기반 락 메커니즘 적용.

### 6.1 환경 조건 정리

| 환경 | Mock (OPFS) 활성화 | 실제 Supabase 연결 |
| --- | --- | --- |
| `development` | ✅ 활성화 | ❌ (Mock으로 대체) |
| `production` | ❌ 비활성화 | ✅ |

---

## 7. Custom Hooks Architecture

코드의 가독성, 재사용성 및 유지보수성을 극대화하기 위해 다음과 같은 커스텀 훅 관리 패턴을 준수합니다.

### 7.1 계층적 구조 (Categorization)

훅의 목적에 따라 디렉토리를 분리하여 관리합니다 (`apps/web-app/src/hooks/`).

- **`/hooks/common`**: UI 라이프사이클이나 공통 브라우저 API (예: `useIsDesktop`, `usePWA`, `useWindowSize`)
- **`/hooks/domain`**: 특정 비즈니스 엔터티 중심 로직 (예: `useAssets`, `useFolders`, `useAssetSelection`)
- **`/hooks/features`**: 특정 페이지나 대형 피처 전용 복합 로직 (예: `useLibraryPage`, `useLibraryFilters`)
- **`/hooks/utils`**: 범용 내비게이션, 검색, 디바운스 등 (예: `useNavHistory`, `useSearch`)

### 7.2 반환 객체 패턴 (Balanced Return)

단일 값 반환보다는 명확한 구조적 반환 패턴을 지향합니다.

```typescript
// 추천: 데이터, 상태, 액션을 구분하여 반환
const { 
  assets,       // Data
  loading,      // Meta State
  actions: {    // Controller Actions
    addAsset, 
    deleteAsset 
  }
} = useAssets();
```

### 7.3 Composable Pattern (훅의 조립)

복잡한 훅은 작은 단위의 도메인 훅들을 조립하여 만듭니다. (예: `useLibraryPage`는 `useAssets`, `useFolders` 등을 내부에서 호출)

### 7.4 Barrel Export (`index.ts`)

`hooks/index.ts`를 통해 외부에서는 `@nova/hooks`와 같은 경로 별칭으로 깔끔하게 임포트할 수 있도록 합니다.

### 7.5 Pure Logic vs. Connected Logic 분리

- **Pure Hooks**: `useState`, `useEffect`만 사용하여 독립적으로 동작 (테스트 용이)
- **Connected Hooks**: `useStore`(Zustand 등)에 직접 연결되어 전역 상태를 제어 (기능 중심)
