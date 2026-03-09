# 개발 코드 구현 가이드: 원자적 분할 및 비대화 방지 (Coding Implementation Guide: Atomic Granularity & Anti-Bloat)

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
- [ ] 이 파일을 에이전트(AI)에게 주었을 때 한눈에 전체 구조를 파악할 수 있을 정도로 간결한가?
