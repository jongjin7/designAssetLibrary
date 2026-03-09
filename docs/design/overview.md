# 디자인 개요: NOVA "Fluid Premium" (Design Overview)

NOVA 디자인 시스템의 핵심 철학인 'Fluid Premium'과 Atomic Design 방법론, 그리고 인터랙션 속도와 시각적 품질에 대한 성능 목표를 정의한 문서입니다.

## 1. Design Philosophy: Fluid Premium

1.  **Instant Feedback**: Every tap or click initiates a micro-interaction within 10ms.
2.  **Visual Depth**: Extensive use of **Glassmorphism** (frosted glass) and layered shadows to create internal hierarchy.
3.  **Adaptive Context**: Components morph based on the device—e.g., a Mobile Bottom Nav becomes a Desktop Sidebar icon set.
4.  **AI-Integrated Aesthetics**: AI-extracted colors (#palette) influence the background of the asset detail panel dynamically (Dynamic Accents).

---

## 2. Design Methodology: Atomic Design

To ensure high performance and reusability, we build from the bottom up:

- **Atoms**: Tokens (Colors, Typography) and base controls (Buttons, Icons).
- **Molecules**: Combined controls (SearchBar, TagChip, UserBadge).
- **Organisms**: Complex functional units (AssetCard, CaptureOverlay, Sidebar).
- **Templates**: Page-level layouts (GridDashboard, CameraLayout).
- **Pages**: Functional instances (PWA Home, Desktop Manager).

---

## 3. Performance & Design Targets

- **Target Response**: < 100ms for UI state changes; < 200ms for complex filtering.
- **Aesthetic Goal**: "Apple-level" finish with subtle gradients and smooth transitions.
- **Accessibility**: WCAG 2.1 AA compliant, with special care for high-contrast dark modes.
