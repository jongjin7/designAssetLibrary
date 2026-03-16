# NOVA 프로젝트 기여 가이드 (Contribution Guide)

NOVA 프로젝트에 참여해 주셔서 감사합니다. 이 문서는 원활한 협업과 코드 품질 유지를 위한 통합 가이드를 제공합니다.

---

## 1. 커밋 메시지 규칙 (Commit Convention)

모든 커밋 메시지는 에이전트와 개발자가 동시에 명확히 이해할 수 있도록 다음 규칙을 따릅니다. **작업 상세 내용(Subject)은 반드시 한글로 작성**함을 원칙으로 합니다.

- **기본 형식**: `type(scope): 한글로 작업 내용 요약` (scope는 생략 가능)
- **사용 가능한 프리픽스 (Type)**:
  - `docs:`: 문서 추가 및 수정
  - `docs(design):`: 디자인 시스템 관련 문서 수정
  - `docs(feat):`: 기능 명세서 수정
  - `docs(setup):`: 설정 및 가이드 수정
  - `feat:`: 새로운 기능 개발 (코드)
  - `fix:`: 버그 및 오류 수정 (코드/환경)
  - `refactor:`: 코드 리팩토링

**예시:** `docs(design): design-tokens.md에 글래스모피즘 토큰 추가`  
**예시:** `fix: 캡처 화면의 React 타입 호환성 오류 해결`

---

## 2. 분야별 세부 가이드

상세한 개발 규칙 및 문서 작성 가이드는 아래 링크를 참조하십시오.

### 2.1 [개발 코드 구현 가이드 (CONTRIBUTING_CODE.md)](./CONTRIBUTING_CODE.md)
- **원자적 분할(Atomic Granularity)** 원칙 준수
- 컴포넌트 및 로직 분리 기준
- Tailwind CSS 및 타이포그래피 규칙

### 2.2 [문서 작성 규칙 (CONTRIBUTING_DOCS.md)](./CONTRIBUTING_DOCS.md)
- 문서 구조 (H1 병기, 영문 기술 명세 등)
- 파일 및 폴더 명명 규칙

---

> [!IMPORTANT]
> 모든 코드는 구현 후 스토리북(Storybook)에 등록되어야 하며, 디자인 시스템의 변경 사항은 즉시 관련 문서에 반영되어야 합니다.
