# UI Development Workflow & Best Practices

## Implementation Workflow
1. **Utility Setup**: `src/lib/utils.ts`에 `cn` (clsx + tailwind-merge) 함수를 먼저 정의합니다.
2. **Base Theme**: `src/index.css`에 프로젝트 고유의 컬러 팔레트와 폰트를 정의합니다.
3. **Component Dev**: 개별 컴포넌트를 `src/components/ui`에 작성합니다.
4. **Storybook**: 각 컴포넌트 생성 시 `.stories.tsx` 파일을 함께 작성하여 시각적으로 검증합니다.
5. **Export**: `src/index.tsx`에서 외부로 노출할 컴포넌트를 export합니다.

## Best Practices
- **Accessibility (A11y)**: 가능한 경우 Radix UI Primitive를 활용하여 접근성을 확보합니다.
- **Micro-interactions**: 버튼 클릭, 호버, 입력 폼 포커스 시 사용자에게 즉각적인 시각적 피드백을 제공합니다.
- **Type Safety**: TypeScript를 엄격하게 사용하여 Props의 안정성을 보장합니다.
- **Atomic Design**: 컴포넌트를 Atom, Molecule, Organism으로 명확히 구분하여 재사용성을 극대화합니다.
