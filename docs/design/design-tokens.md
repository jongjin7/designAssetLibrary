# 디자인 토큰: NOVA 시스템 (Design Tokens)

Tailwind v4를 기반으로 한 NOVA 디자인 시스템의 색상 팔레트, 타이포그래피, 글라스모피즘 효과 및 간격 시스템을 정의합니다. 특히 모노레포에서의 @source 설정법을 포함합니다.

## 1. Colors (Premium Palette)

The NOVA palette is built on deep slate neutrals with vibrant indigo and electric cyan accents.

### Tailwind v4 Implementation

```css
@theme {
  --color-nv-bg: #0B0E14;
  --color-nv-glass: rgba(255, 255, 255, 0.05);
  --color-nv-primary: #6366F1;
  --color-nv-vivid: #06B6D4;
  --color-nv-text-primary: #F8FAFC;
  --color-nv-text-secondary: #94A3B8;
}

/* ⚠️ Monorepo Configuration Note */
/* Tailwind 4 requires explicit @source directives to find utility classes in other packages/folders */
@source "../**/*.{js,ts,jsx,tsx}";
@source "../../../../packages/ui/src/**/*.{js,ts,jsx,tsx}";
```

| Category | Token | Value | Description |
| :--- | :--- | :--- | :--- |
| **Surface** | `--nv-bg-main` | `#0B0E14` (Dark Only) | Main background for Desktop/PWA. |
| **Surface** | `--nv-surface-glass` | `rgba(255, 255, 255, 0.05)` | Frost glass base for cards. |
| **Accent** | `--nv-accent-primary` | `#6366F1` | Electric Indigo (Primary CTAs). |
| **Accent** | `--nv-accent-vivid` | `#06B6D4` | Cyan (AI/Success states). |
| **Text** | `--nv-text-primary` | `#F8FAFC` | High contrast off-white. |
| **Text** | `--nv-text-secondary` | `#94A3B8` | Subdued slate grey. |

---

## 2. Typography (Modern Professional)

- **Primary Font**: `Inter, system-ui` (UI controls, labels).
- **Display Font**: `Outfit, sans-serif` (Headlines, Page Titles).

| Usage | Semantics | Size | Weight |
| :--- | :--- | :--- | :--- |
| **Title** | `h1` | `2.25rem` (36px) | 700 (Bold) |
| **Heading** | `h2` | `1.5rem` (24px) | 600 (Semi-Bold) |
| **Label** | `span` | `0.875rem` (14px) | 500 (Medium) |
| **Caption** | `small` | `0.75rem` (12px) | 400 (Regular) |

---

## 3. Glass & Shadows (Rich Aesthetics)

- **Blur Target**: `backdrop-filter: blur(12px)`.
- **Card Shadow**: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);`.
- **Hover Depth**: `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);`.

---

## 4. Spacing (Grid System)

- **Base Unit**: `4px` (Quarter-rem).
- **Standard Padding**: `1rem` (Mobile) / `1.5rem` (Desktop).
- **Grid Gap**: `1rem`.
