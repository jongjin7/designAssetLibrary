# 디자인 시스템 파운데이션 (Design System Foundation)

NOVA 프로젝트의 디자인 철학인 **'Fluid Premium'**과 이를 구현하기 위한 핵심 디자인 토큰 및 방법론을 정의합니다.

---

## 1. 디자인 철학: Fluid Premium

NOVA는 전문 디자이너를 위한 도구로서, 매끄러운 반응성과 고품격 시각 효과를 지향합니다.

1.  **Instant Feedback**: 모든 터치와 클릭은 10ms 이내에 미세한 반응(Micro-interaction)을 시작합니다.
2.  **Visual Depth**: 글라스모피즘(Glassmorphism)과 다층 레이어 그림자를 사용하여 내부 계층 구조를 명확히 표현합니다.
3.  **Adaptive Context**: 기기 환경에 따라 컴포넌트가 변형됩니다. (예: 모바일 하단 탭 -> 데스크탑 사이드바 아이콘).
4.  **AI-Integrated Aesthetics**: AI가 분석한 데이터가 UI의 강조 색상이나 배경에 동적으로 반영됩니다.

---

## 2. 디자인 방법론: Atomic Design

확장성과 유지보수성을 위해 상향식(Bottom-up) 빌드 방식을 채택합니다.

-   **Atoms (원자)**: 디자인 토큰(색상, 타이포그래피) 및 기본 컨트롤(버튼, 아이콘).
-   **Molecules (분자)**: 결합된 컨트롤(검색바, 태그 칩, 유저 배지).
-   **Organisms (유기체)**: 복잡한 기능 단위(에셋 카드, 캡처 오버레이, 사이드바).
-   **Templates (템플릿)**: 페이지 레벨의 레이아웃 프레임.
-   **Pages (페이지)**: 실제 데이터가 담긴 기능적 인스턴스.

---

## 3. 핵심 디자인 토큰 (Tailwind v4 기반)

NOVA는 Tailwind v4의 공식 변수명을 오버라이드하여 표준 호환성과 커스텀 정체성을 동시에 확보합니다.

### Colors (Premium Palette)

| Category | Official Variable | Brand Value | Description |
| :--- | :--- | :--- | :--- |
| **Background** | `--color-slate-950` | `#0B0E14` | 프로젝트 메인 배경색 (Dark 전용). |
| **Surface** | `--color-slate-900` | `#111827` | 카드, 메뉴 및 사이드바 표면색. |
| **Primary** | `--color-indigo-500` | `#6366F1` | 메인 브랜드 컬러 (Indigo). |
| **Vivid** | `--color-cyan-500` | `#06B6D4` | 강조 및 AI 포인트 컬러 (Cyan). |
| **Danger** | `--color-rose-500` | `#F43F5E` | 에러, 위험 및 삭제 상태 (Rose). |
| **Text (P)** | `--color-slate-50` | `#F8FAFC` | 고대비 본문 텍스트. |
| **Text (S)** | `--color-slate-400` | `#94A3B8` | 보조 정보 및 레이블 텍스트. |
| **Text (T)** | `--color-slate-500` | `#64748B` | 비활성 또는 설명 텍스트. |
| **Effect** | `--color-glass` | `rgba(255, 255, 255, 0.05)` | 글라스모피즘 베이스 투명도. |

### Typography (Modern Professional)

-   **Primary Font**: `Pretendard Variable`, `sans-serif` (전역 폰트).
-   **Fallback**: `-apple-system`, `BlinkMacSystemFont`, `system-ui`.

| Usage | Semantics | Size | Weight |
| :--- | :--- | :--- | :--- |
| **Title** | `h1` | `2.25rem` (36px) | 800 (Extra-Bold) |
| **Heading** | `h2` | `1.5rem` (24px) | 700 (Bold) |
| **Label** | `span / p` | `0.875rem` (14px) | 600 (Semi-Bold) |
| **Caption** | `small` | `0.75rem` (12px) | 400 (Regular) |

---

### Effects (Rich Aesthetics & Depth)

NOVA는 전문 디자이너를 위한 고도의 시각적 깊이를 글라스모피즘과 그림자를 통해 표현합니다.

| Type | Tailwind Classes | Description |
| :--- | :--- | :--- |
| **Dark Glass** | `bg-black/40 backdrop-blur-2xl border-white/5` | 밝은 에셋 배경 위에서 대비를 확보할 때 사용. |
| **Light Glass** | `bg-white/[0.08] backdrop-blur-3xl border-white/20` | 프리미엄 발광 효과와 어두운 배경 대비용. |

---

## 4. Corner Radius (코너 라운딩 표준)

컴포넌트의 크기와 계층에 따라 일관된 라운딩 규칙을 적용합니다.

| Size | Tailwind Class | Usage |
| :--- | :--- | :--- |
| **Small (sm)** | `rounded-lg` | 버튼, 인풋, 태그 칩 (36px 높이 기준) |
| **Medium (md)** | `rounded-lg` | 표준 컨트롤러 (44px 높이 기준) |
| **Large (lg)** | `rounded-xl` | 모달, 메인 섹션, 큰 버튼 (52px 높이 기준) |
| **Extra Large (xl)** | `rounded-2xl` | **메인 카드, 셀렉션 바, 팝업 컨테이너** |

---

## 5. 온 글라스 인터랙션 (On-Glass Interaction)

글라스 패널 위에 배치되는 요소들은 일반적인 서피스보다 더 높은 투명도와 세밀한 테두리를 가집니다.

- **Button Harmony**: 글라스 패널(`rounded-2xl`) 내부의 버튼은 `rounded-lg`를 유지하여 형태적 대비와 안정감을 동시에 제공합니다.
- **Glass-Optimized Buttons**: `glass-primary`, `glass-danger`, `glass-neutral` 변체를 사용하여 패널 질감과 버튼이 자연스럽게 투과(Nested)되도록 합니다.
