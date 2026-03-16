# 개발 워크플로우 및 가이드 (Workflow & Guide)

NOVA 디자인 시스템의 효율적인 개발 흐름과 스토리북 활용 규칙을 정의합니다.

---

## 1. UI 개발 프로세스

디자인 시스템 컴포넌트를 개발할 때는 다음 단계를 따릅니다.

1.  **Atom First**: 가장 작은 단위인 `packages/ui/src/atoms`부터 개발을 시작합니다.
2.  **Theme Mapping**: `theme.css`에 정의된 공식 변수를 적극적으로 활용합니다.
3.  **Encapsulation**: 컴포넌트 내부 스타일은 Tailwind 유틸리티를 기본으로 하며, 복잡한 효과는 `styles.module.css`를 사용하여 격리합니다.
4.  **Storybook First**: 컴포넌트 구현과 동시에 `.stories.tsx`를 작성하여 시각적으로 검증합니다.
5.  **Export**: 작성된 컴포넌트를 패키지 root의 `index.tsx`에서 export하여 메인 앱에서 참조 가능하게 합니다.

---

## 2. 스토리북 관리 규칙 (Storybook Rules)

독립적인 컴포넌트 개발과 시각적 일관성 검증을 위한 핵심 환경입니다.

### 디렉토리 구조
모든 스토리와 컴포넌트는 `packages/ui` 내에서 **Atomic Design** 구조를 따릅니다.

```text
/packages/ui/src/
├── atoms/          # 기본 요소 (Button, Input, Chip 등)
├── molecules/      # 결합 요소 (SearchBar, TagList 등)
├── organisms/      # 기능 단위 (AssetCard, FolderTree 등)
├── layout/         # 레이아웃 프레임 (Sidebar, MobileNav 등)
└── capture/        # 캡처 전용 UI (CaptureOverlay 등)
```

### 필수 스토리 구성
모든 컴포넌트는 최소 3가지 핵심 스토리를 포함해야 합니다.
1.  **Sizes**: 모든 규격(sm/md/lg) 비교.
2.  **Variants**: 테마별 시각적 변형.
3.  **States**: 상호작용 상태 (Active, Disabled, Loading, Error).

---

## 3. 개발 모범 사례 (Best Practices)

-   **Type Safety**: TypeScript 인터페이스를 엄격하게 사용하여 컴포넌트의 신뢰성을 보장합니다.
-   **A11y**: 가능한 경우 Radix UI Primitive를 활용하여 웹 접근성을 확보합니다.
-   **Viewports**: 스토리북의 Viewport 기능을 활용해 375px(모바일), 1024px(테스크탑) 환경을 상시 테스트합니다.
-   **Dark Mode**: 모든 스토리는 기본적으로 다크 모드를 기준으로 작성하며, 라이트 모드에서의 가독성을 함께 확인합니다.

---

## 4. 품질 체크리스트 (Quality Checklist)

- [x] 모든 대화형 요소가 호버/클릭 피드백을 제공하는가?
- [x] 전역 CSS 변수(`var(--color-...)`)가 아닌 Tailwind 공식 변수를 사용했는가?
- [x] 이미지 로딩 시 레이아웃 시프트(CLS)가 발생하지 않는가?
- [x] 모바일 터치 타겟(최소 44px 이상)이 확보되었는가?
- [x] 불필요한 `!important` 사용을 지양했는가?
