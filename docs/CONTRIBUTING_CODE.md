# 개발 코드 구현 가이드: 원자적 분할 및 비대화 방지 (Coding Implementation Guide)

> [!TIP]
> 커밋 메시지 규칙 등 공통 프로젝트 관례는 [CONTRIBUTING.md](./CONTRIBUTING.md)을 참조하십시오.

한 페이지 혹은 하나의 파일에 방대한 코드를 작성하여 비대해지는 것을 방지하고, 작고 명확한 단위로 코드를 분할하여 유지보수성과 가독성을 극대화하는 것을 원칙으로 합니다.

The NOVA project follows a philosophy of **Atomic Granularity**. We strictly avoid bloated files by breaking down components and logic into the smallest possible functional units. This approach ensures high readability, easier testing, and better alignment for both human developers and AI coding agents.

---

## 1. Core Philosophy (핵심 철학)

| Principle | Description | Goal |
| :--- | :--- | :--- |
| **Atomic Snippets** | 모든 파일은 단 하나의 명확한 책임(SRP)만 가집니다. | 코드 비대화(Bloat) 방지 |
| **Max Line Limits** | 컴포넌트는 가급적 150줄, 로직 파일은 100줄 이내를 지향합니다. | 가독성 및 AI 컨텍스트 최적화 |
| **Aggressive Extraction** | 복잡한 로직이나 반복되는 UI 패턴은 지체 없이 별도 파일로 추출합니다. | 재사용성 극대화 및 결합도 감소 |

---

## 2. Implementation Strategy (구현 전략)

### 2.1 Component Splitting (컴포넌트 분할)

하나의 컴포넌트 파일이 비대해지기 전에 하위 컴포넌트로 분리하십시오.

- **Trigger**: 컴포넌트 내부에 로컬 상태(`useState`)가 3개 이상이거나, JSX 구조가 3단계 이상의 깊이를 가지면 분리를 검토합니다.
- **Location**: 특정 페이지에서만 쓰이는 컴포넌트는 해당 페이지 폴더의 `_components/` 하위에, 공통 컴포넌트는 `packages/ui/`에 위치시킵니다.
- **Rule**: "UI는 그리기만 하고, 복잡한 계산은 훅(Hook)으로 넘긴다."

### 2.2 Logic & Hook Extraction (로직 및 훅 추출)

비즈니스 로직, 데이터 가공, 외부 API 통신 등은 컴포넌트 파일 외부에 존재해야 합니다.

- **Trigger**: 동일한 로직이 2개 이상의 컴포넌트에서 쓰이거나, 로직 코드가 30줄을 넘어가면 커스텀 훅으로 추출합니다.
- **Location**: `hooks/`, `services/`, 또는 `packages/shared/src/utils/`.
- **Rule**: 컴포넌트는 데이터의 흐름만 제어하고, 실제 데이터 조작 로직은 독립적으로 테스트 가능한 파일로 관리합니다.

### 2.3 Styling & UI Component Management (스타일링 및 UI 컴포넌트 관리)

일관된 디자인 시스템 유지와 코드 격리를 위해 다음 규칙을 준수합니다.

- **Tailwind CSS First**: 개별 컴포넌트의 기본 레이아웃, 간격, 폰트 스타일은 Tailwind CSS 클래스를 사용합니다.
- **Custom Classes for Complex Effects**: 그라데이션, 복잡한 Shadow(layered), 다단계 트랜지션 등 Tailwind로 표현하기에 코드 가독성을 해치는 복잡한 시각 효과는 `globals.css`에 의미 있는 이름의 커스텀 클래스로 정의하여 사용합니다. (예: `.nv-glass-panel-premium`)
- **Storybook UI**: 반복적으로 사용되는 원자적(Atomic) UI 패턴이나 공통 컴포넌트는 `packages/ui/`에서 관리하며, Storybook을 통해 독립적으로 개발 및 품질을 검증합니다.
- **Documentation Sync (New)**: 디자인 시스템에 새로운 컴포넌트가 추가되거나 기존 사양이 변경될 경우, 반드시 `docs/design/` 내 관련 문서를 즉시 업데이트해야 합니다. 이는 AI 에이전트와 인간 개발자 간의 지식 동기화를 위한 핵심 절차입니다. 세부 규칙은 `.agent/workflows/design-system.md`를 참조하십시오.
- **Style Isolation**: 전역 CSS 클래스보다는 컴포넌트 수준의 스타일링을 지향하되, 공통 시각 효과는 커스텀 유틸리티 클래스를 통해 재사용합니다.

### 2.4 Typography & Sizing (타이포그래피 및 사이징)

- **Base Font**: 모든 UI의 기본 폰트는 `Pretendard`를 사용합니다. 웹 폰트 로딩 최적화를 위해 CSS 변수 `--font-sans`를 참조하십시오.
- **2-Multiple Sizing System**: 모든 폰트 사이즈는 **2배수(Even numbers)** 단위로 설정하는 것을 원칙으로 합니다. (예: 12px, 14px, 16px, 20px, 24px, 32px ...)
- **Tailwind Rules**: 가급적 Tailwind의 기본 폰트 사이즈 클래스(`text-xs`, `text-sm` 등)를 사용하며, 커스텀 사이즈가 필요한 경우에도 2배수 규칙을 준수하여 `text-[18px]`와 같이 작성합니다. 홀수 단위(11px, 13px 등)의 사용은 지양합니다.

---

## 3. Practical Example: Asset List (실전 예시: 에셋 목록)

- **`AssetListPage.tsx`**: 전체 레이아웃 구성 (최상위 데이터 페칭만 담당)
- **`_components/AssetGrid.tsx`**: 목록 렌더링 및 가상 스크롤 제어
- **`_components/AssetCard.tsx`**: 개별 아이템의 시각적 요소 구성
- **`hooks/useAssetOperations.ts`**: 필터링, 검색, 정렬 등 비즈니스 로직

---

## 4. Coding Standard Checklist

- [ ] 파일 하나가 200줄을 초과하고 있지는 않은가? (초과 시 반드시 분할)
- [ ] 컴포넌트 내부에 비즈니스 로직(수학적 계산, 복잡한 조건문 등)이 직접 포함되어 있는가? (**Hook으로 추출**)
- [ ] UI 요소 중 다른 곳에서도 쓰일 법한 부분이 있는가? (**Atom 단위로 추출**)
- [ ] **디자인 시스템 작업 후 `docs/design/` 문서와 스토리북을 업데이트하였는가?**
- [ ] 이 파일을 에이전트(AI)에게 주었을 때 한눈에 전체 구조를 파악할 수 있을 정도로 간결한가?
