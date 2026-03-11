# 데이터 레이어 아키텍처 (Data Layer Architecture)

NOVA 프로젝트는 데이터 소스(Mock, Supabase 등)에 유연하게 대응하고 오프라인 우선(Local-First) 환경을 지원하기 위해 **레포지토리 패턴(Repository Pattern)**을 사용합니다.

## 1. 개요

애플리케이션 로직이 구체적인 데이터 저장소의 구현(API 호출, 로컬 파일 시스템 등)에 의존하지 않도록 인터페이스를 통해 추상화합니다. 이를 통해 개발 중에는 완벽한 Mock 환경을, 운영 중에는 실제 Supabase 백엔드를 코드 수정 없이 스위칭할 수 있습니다.

## 2. 핵심 구성 요소

```text
apps/web-app/src/
├── lib/
│   ├── repositories/
│   │   ├── AssetRepository.ts       # 인터페이스 정의 (Abstract)
│   │   ├── MockAssetRepository.ts   # 로컬/OPFS 기반 Mock 구현
│   │   └── SupabaseAssetRepository.ts # 실 서비스용 Supabase 구현
│   ├── storage/
│   │   └── opfs.ts                  # 로컬 파일 시스템(OPFS) 유틸리티
│   └── dataService.ts               # 레포지토리 싱글톤 관리 및 스위칭 로직
└── hooks/
    └── useAssets.ts                 # UI 컴포넌트용 통합 데이터 Hook
```

### 2.1 AssetRepository (Interface)
모든 에셋 관련 데이터 요청이 따라야 할 규칙을 정의합니다.
- `getAssets()`: 에셋 목록 조회
- `saveAsset(asset, file)`: 에셋 저장 (메타데이터 + 바이너리)
- `deleteAsset(id)`: 에셋 삭제
- `toggleFavorite(id)`: 즐겨찾기 토글

### 2.2 MockAssetRepository (Local-First)
서버가 없는 환경에서도 데이터 영속성을 유지하기 위해 하이브리드 로컬 저장 방식을 사용합니다.
- **메타데이터**: `localStorage` (JSON)
- **이미지 바이너리**: **OPFS (Origin Private File System)** — 브라우저의 전용 고성능 파일 시스템을 사용하여 기가바이트 단위의 자산 저장 가능.

### 2.3 dataService.ts (Implementation Switch)
환경 변수(`NEXT_PUBLIC_USE_MOCK`) 및 API 키 설정 상태에 따라 적절한 레포지토리 인스턴스를 반환합니다.

## 3. 데이터 흐름

1. **UI 컴포넌트**: `useAssets` 훅을 호출합니다.
2. **Hook**: `dataService`를 통해 현재 활성화된 레포지토리를 가져옵니다.
3. **Repository**:
   - **조회 시**: 로컬 OPFS 경로가 포함된 경우 이를 `URL.createObjectURL`을 통해 즉시 사용 가능한 Blob URL로 변환하여 UI에 전달합니다.
   - **저장 시**: 전달받은 이미지(Blob 또는 DataURL)를 OPFS에 파일로 쓰고, 메타데이터 리스트를 갱신합니다.
4. **UI 업데이트**: 갱신된 데이터 상태를 반영하여 목록을 다시 렌더링합니다.

## 4. 오프라인 시나리오 지원

PWA 환경에서 네트워크가 끊겼을 때도 앱은 `MockAssetRepository`를 통해 로컬 자원을 그대로 활용합니다. 실 서비스 도입 시에는 `SupabaseAssetRepository`와 로컬 캐싱 레이어(OPFS/IndexedDB)를 통합하는 **오프라인-동기화(Offline-Sync)** 전략으로 확장될 예정입니다.
