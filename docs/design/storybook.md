# 스토리북 문서: NOVA 시스템 (Storybook Documentation)

독립적인 컴포넌트 개발과 시각적 일관성 검증을 위한 Storybook 8의 사용 목적, 카테고리 구성 및 테스트 모범 사례를 기술한 문서입니다.

## 1. Why Storybook?

- **Visual Regression Testing**: Ensure that a change in `packages/ui` doesn't break both the PWA and the Desktop App.
- **Documentation**: Automatic generation of prop-types and usage examples for other developers.
- **Prototypes**: Share UI mockups with stakeholders before backend integration.

---

## 2. Core Story Categories

| Category | Description | Examples |
| :--- | :--- | :--- |
| **Atoms** | Stateless base components. | Buttons, Icons, TagChips. |
| **Molecules** | Connected base units. | SearchBar, PaletteDisplay. |
| **Organisms** | High-level functional units. | AssetCard, FolderTree. |
| **Capture Layer** | Specialized capture UI. | CaptureOverlay, ShimmerFeed. |
| **Layouts** | Grid / Responsive templates. | ThreeColumnDashboard, MobileTabs. |

---

## 3. Best Practices for Stories

1.  **Multiple Viewports**: Use `viewport` parameters to test every component in Mobile (375px), Tablet (768px), and Desktop (1440px).
2.  **Accessibility Testing**: Run `@storybook/addon-a11y` on every story to catch color contrast or ARIA issues.
3.  **Interaction Stories**: Use `play` functions and `@storybook/testing-library` to simulate 0.2s interactions.
4.  **Dark Mode Support**: Ensure every story has a dark/light mode toggle.

---

## 4. Visual Testing Targets
- **Hover Transitions**: Smooth 200ms ease-in-out.
- **Glassmorphism Transparency**: Ensure readability against different background images.
- **Grid Layouts**: Verify auto-flow and wrapping at small widths.

---

## 5. Usage Example

```bash
# Run Storybook locally
npm run storybook

# Build Storybook for review
npm run build-storybook
```
