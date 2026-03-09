# UI 개발 워크플로우 및 권장 사항 (UI Development Workflow & Best Practices)

이 문서는 상시적으로 업데이트되는 UI 개발의 단계별 흐름과 효율적인 협업을 위한 권장 사항을 담고 있습니다. 개발 시 반드시 [코드 구현 가이드](../CONTRIBUTING_CODE.md)를 참고하여 원자적 분할(Atomic Granularity) 및 코드 비대화 방지 원칙을 따르십시오.

## Implementation Workflow

1. **Utility Setup**: `src/lib/utils.ts`에 `cn` (clsx + tailwind-merge) 함수를 먼저 정의합니다.
2. **Base Theme**: `src/index.css`에 프로젝트 고유의 컬러 팔레트와 폰트를 정의합니다.
3. **Component Dev**: 개별 컴포넌트를 `src/components/ui`에 작성합니다.
4. **Storybook**: 각 컴포넌체 생성 시 `.stories.tsx` 파일을 함께 작성하여 시각적으로 검증합니다.
5. **Export**: `src/index.tsx`에서 외부로 노출할 컴포넌트를 export합니다.

## Best Practices

- **Accessibility (A11y)**: 가능한 경우 Radix UI Primitive를 활용하여 접근성을 확보합니다.
- **Micro-interactions**: 버튼 클릭, 호버, 입력 폼 포커스 시 사용자에게 즉각적인 시각적 피드백을 제공합니다.
- **Type Safety**: TypeScript를 엄격하게 사용하여 Props의 안정성을 보장합니다.
- **Atomic Design**: 컴포넌트를 Atom, Molecule, Organism으로 명확히 구분하여 재사용성을 극대화합니다.
- **Separation of Concerns**: [코드 구현 가이드](../CONTRIBUTING_CODE.md)에 따라 비대한 컴포넌트 작성을 지양하고 기능 단위를 최소화하여 분리합니다.
