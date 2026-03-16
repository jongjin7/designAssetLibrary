# 공통 컴포넌트: Phase 1 (Common Components)

Sprint 1과 2에서 개발되는 핵심 컴포넌트의 사양, 에스테틱, 동작 방식 및 성능 체크리스트를 포함하는 문서입니다.

## 1. Atoms (Basic Elements)

디자인 시스템의 가장 작은 단위로, `size` 속성을 통해 `sm`, `md`, `lg` 규격을 표준화합니다.

### `NVInput` & `NVSelect`
- **Props**: `size` (sm/md/lg), `icon`, `disabled`, `error`.
- **Sizing**:
  - `sm`: h-9, text-xs.
  - `md`: h-11, text-sm (Default).
  - `lg`: h-[52px], text-base.
- **Aesthetics**: `relative` 컨테이너 내 `has-[:disabled]` 선택자를 통한 통합 상태 관리.

### `NVChip`
- **Props**: `size` (sm/md), `isActive`, `onRemove`, `disabled`.
- **Usage**: 필터 칩, 태그, 상태 표시용.
- **Micro-interactions**: Hover 시 밝기 증가, Click 시 scale down (active 상태).

### `NVEmptyState`
- **Props**: `icon`, `title`, `description`, `action`.
- **Aesthetics**: 로고/아이콘 중심의 중앙 정렬 레이아웃.

---

## 2. Molecules (Component Units)

여러 Atom이나 HTML 요소가 결합된 단위입니다.

### `NVAssetCard` (The Core Display Unit)
- **Props**: `fileName`, `thumbnail`, `palette`, `isCompact`, `isSelected`, `isFavorite`.
- **Aesthetics**:
  - Standard: 정방형(1:1), Glassmorphism footer, Hover Glow 효과.
  - Compact: 4:3 비율, 정보 최소화 (모바일/리스트뷰용).
- **Behavior**: Hover 시 체크박스 및 Quick Actions(Star, Maximize) 노출.

### `NVSearchBar`
- **Props**: `value`, `onChange`, `onFilterToggle`.
- **Features**: 통합 검색 필드와 필터 토글 버튼 결합.

### `NVFilterGroup`
- **Role**: `NVChip`들의 집합으로, 다중 선택 및 상태 관리를 내장.

---

## 3. Organisms (Layout Units)

### `NVAssetGrid`
- **Layout**: Adaptive Grid 시스템.
  - Mobile: 2-column (Minimum).
  - Desktop (Sidebar Expanded): **최대 2-column** (가독성 확보를 위해 카드의 최소 너비 보장).
  - Desktop (Default): Viewport에 따라 3~5 column 가변.
- **Performance**: Virtualization 적용 및 0.2s 이내 스크롤 응답성 유지.

---

## 4. 디자인 시스템 개발 규칙

### Storybook 작성 표준
모든 컴포넌트는 다음 3가지 핵심 스토리를 포함해야 합니다:
1. **Sizes**: 모든 크기 가변 옵션을 한눈에 비교.
2. **Variants**: 주요 시각적 변형 (Icons, Colors 등).
3. **States**: 상호작용 상태 (Active, Disabled, Loading, Error).

### 상태 스타일링 규칙
- `has-[:disabled]` 스타일을 사용하여 자식 요소의 상태가 컨테이너에 반영되도록 구현.
- 모든 애니메이션은 `duration-300` 이하의 `ease-out` 계열을 기본값으로 사용.

---

## 5. Performance Checklist
- [x] Sizing 규격화 (sm/md/lg) 완료.
- [x] Storybook 구조 표준화 완료.
- [ ] No layout shifts on image load (Blur-up 적용 중).
- [x] Hover states trigger in < 20ms using CSS transitions.
- [x] Skeleton screen state (NVEmptyState와 연계하여 구현).
