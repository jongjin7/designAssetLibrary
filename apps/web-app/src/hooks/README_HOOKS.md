# NOVA Custom Hooks Management Guide

커스텀 훅을 체계적으로 관리하여 코드의 가독성, 재사용성 및 유지보수성을 높이기 위한 가이드라인입니다.

## 1. 계층적 구조 (Categorization)

훅의 목적에 따라 디렉토리를 분리하여 관리하는 패턴을 추천합니다.

- `/hooks/common`: UI 라이프사이클이나 공통 브라우저 API (예: `useIsDesktop`, `usePWA`, `useWindowSize`)
- `/hooks/domain`: 특정 비즈니스 엔터티 중심 로직 (예: `useAssets`, `useFolders`, `useAssetSelection`)
- `/hooks/features`: 특정 페이지나 대형 피처 전용 로직 (예: `useLibraryPage`, `useLibraryFilters`)
- `/hooks/utils`: 범용 내비게이션, 검색, 디바운스 등 (예: `useNavHistory`, `useSearch`)

## 2. 반환 객체 패턴 (Balanced Return)

단일 값 반환(`useSingle`)보다는 명확한 구조적 반환 패턴을 따릅니다.

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

## 3. Composable Pattern (훅의 조립)

복잡한 훅은 작은 단위의 도메인 훅들을 조립하여 만듭니다. (예: `useLibraryPage`)

```typescript
// useLibraryPage.ts 내부 호출 예시
export function useLibraryPage() {
  const { assets } = useAssets();      // 도메인 로직 재사용
  const { filter } = useFilters();     // 필터 로직 재사용
  // ... 조립 및 가공 로직
}
```

## 4. Barrel Export (`index.ts`)

`hooks/` 폴더 내의 각 디렉토리나 루트에 `index.ts`를 두어 외부에서 깔끔하게 임포트할 수 있도록 합니다.

```typescript
// apps/web-app/src/hooks/index.ts
export * from './domain/useAssets';
export * from './common/useIsDesktop';
// ...
```

## 5. Pure Logic vs. Connected Logic 분리

- **Pure Hooks**: `useState`, `useEffect`만 사용하여 독립적으로 동작 (테스트 용이)
- **Connected Hooks**: `useStore`(Zustand 등)에 직접 연결되어 전역 상태를 제어 (기능 중심)

---

이러한 패턴을 통해 팀 규모가 커져도 어떤 훅이 어디에 있는지 쉽게 찾고, 중복 로직을 사전에 방지할 수 있습니다.
