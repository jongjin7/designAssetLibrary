---
description: 디자인 시스템 컴포넌트 개발 및 문서화 규칙
---

// turbo-all

NOVA 디자인 시스템(@nova/ui)에 새로운 컴포넌트를 추가하거나 기존 기능을 수정할 때 반드시 준수해야 하는 규칙입니다.

## 1. 컴포넌트 개발 시 필수 단계

1.  **코드 구현**: `@nova/ui` 패키지의 적절한 계층(Atoms, Molecules, Organisms)에 구현합니다.
2.  **Storybook 작성**: 모든 컴포넌트는 다음 3가지 핵심 스토리를 포함해야 합니다.
    - `Sizes`: 모든 크기 변종 (`sm`, `md`, `lg`) 표시.
    - `Variants`: 주요 시각적 변형 (Icons, Colors 등).
    - `States`: 상호작용 상태 (Active, Disabled, Loading 등).
3.  **디자인 문서 업데이트**: `docs/design` 내의 관련 문서를 반드시 업데이트합니다.
    - `components-phase1.md`: 새로운 컴포넌트의 사양 및 동작 정의 추가.
    - `design-tokens.md`: 새로운 토큰이나 표준 사이즈 규격이 추가된 경우 반영.

## 2. 디자인 원칙

- **표준 사이즈 준수**: `sm` (36px), `md` (44px), `lg` (52px) 규격에 맞게 구현합니다.
- **Glassmorphism**: 푸터나 오버레이 요소에는 `backdrop-blur` 및 투명도 설정을 적용하여 프리미엄 에스테틱을 유지합니다.
- **상태 관리**: `has-[:disabled]`와 같은 최신 CSS 선택자를 활용하여 선언적으로 스타일을 관리합니다.

## 3. 작업 확인 절차

1.  `npm run dev:storybook`으로 스토리북에서 정해진 스토리들이 잘 보이는지 확인합니다.
2.  `docs/design` 문서에 해당 내용이 정확히 기록되었는지 검토합니다.
3.  앱 페이지(예: `/library`)에 적용하여 실제 동작 및 레이아웃을 검증합니다.
