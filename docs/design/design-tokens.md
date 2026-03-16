# 디자인 토큰: NOVA 시스템 (Design Tokens)

Tailwind v4를 기반으로 한 NOVA 디자인 시스템의 색상 팔레트, 타이포그래피, 글라스모피즘 효과 및 간격 시스템을 정의합니다. 특히 모노레포에서의 @source 설정법을 포함합니다.

## 1. Colors (Premium Palette)

The NOVA palette is built on deep slate neutrals with vibrant indigo and electric cyan accents.

### Design System Tokens (Core)

NOVA 프로젝트는 다음과 같은 핵심 디자인 토큰을 사용하여 일관된 사용자 경험을 제공합니다. 모노레포 환경에서는 각 앱과 패키지 간의 공유 설정을 통해 이 시스템을 통제합니다.

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

- **Blur Target**: Ultra-Frost (12px Blur 효과를 통한 배경 투과)
- **Card Shadow**: Subtle Elevation (콘텐츠 깊이감 1단계)
- **Hover Depth**: Floating (상호작용 시의 깊이감 2단계)

---

## 4. Spacing (Grid System)

- **Base Unit**: `4px` (Quarter-rem).
- **Standard Padding**: `1rem` (Mobile) / `1.5rem` (Desktop).
- **Grid Gap**: `1rem`.

### Standardized Sizing (sm / md / lg)

컴포넌트의 높이 및 내부 요소 크기를 관리하기 위한 표준 규격입니다.

| Size | Height | Font Size | Icon Size | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **sm** | `2.25rem` (36px) | `0.75rem` (12px) | `14px` | 필터링 요소, 모바일 리스트 |
| **md** | `2.75rem` (44px) | `0.875rem` (14px) | `16px` | 기본 입력창, 버튼 (Default) |
| **lg** | `3.25rem` (52px) | `1rem` (16px) | `18px` | 데스크탑 메인 검색바, 강조 CTA |
