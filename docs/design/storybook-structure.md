# 스토리북 구조: NOVA 공유 라이브러리 (Storybook Structure: NOVA Shared Library)

To maintain a scalable component library across the monorepo, Storybook follows a strict directory structure mirroring **Atomic Design**.

## 1. Primary Directory Mapping

All components and their stories live in `packages/ui`.

```text
/packages/ui/
├── src/
│   ├── atoms/          # Minimal UI elements (Button, Icon, Chip)
│   ├── molecules/      # Component clusters (SearchBar, TagList)
│   ├── organisms/      # Complex features (AssetCard, FolderTree)
│   ├── capture/        # Specialized Capture UI for PWA/Ext
│   ├── layout/         # Dashboard frames (Sidebar, MobileNav)
│   └── tokens/         # CSS Variable definitions (Color, Typography)
└── .storybook/         # Storybook configuration (Theme, Viewports)
```

---

## 2. Component Bundling Rules

Every component folder must contain:

1. **`index.tsx`**: The functional React component.
2. **`styles.module.css`**: Scoped Vanilla CSS.
3. **`types.ts`**: TypeScript Interface/Props.
4. **`Component.stories.tsx`**: Storybook stories.
5. **`Component.mdx`**: (Optional) Long-form design documentation.

---

## 3. Atomic Classification Guide

| Level | Component Example | Rules |
| :--- | :--- | :--- |
| **Atom** | `NVButton` | No external data. Pure style + callback. <br/>*Variants: primary, secondary, vivid, danger, ghost, glass* |
| **Molecule** | `NVAvatarGroup` | Combines 2+ Atoms. |
| **Organism** | `NVAssetCard` | May use multiple molecules. Complex state. |
| **Layout** | `NVMainGrid` | Defines the flex/grid container. |

---

## 4. Documentation Strategy

- **Auto-generated Props**: We use TypeScript interfaces to auto-populate the Storybook control panel.
- **Interactions**: Complex components (like `CaptureOverlay`) include a **"Play"** story to demonstrate AI shimmers.
- **Design Tokens**: A dedicated `Tokens` page in Storybook displays all current CSS variables.

---

## 5. Deployment Workflow

1. **Develop**: Create component and story in `packages/ui`.
2. **Test**: Verify in Storybook (Mobile/Desktop views).
3. **Deploy**: Storybook is built and deployed as a static site (Chromatic or Vercel) for designer review.
