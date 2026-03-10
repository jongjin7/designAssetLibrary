# NOVA 문서 작성 및 커밋 규칙 (Documentation Contribution Guide)

이 문서는 NOVA 프로젝트의 `docs` 디렉토리 내 문서를 작성하고 수정할 때 준수해야 할 규칙을 정의합니다. 특히 에이전트(LLM)와 사람(개발자) 간의 협업 효율을 극대화하는 데 초점을 맞춥니다.

---

## 1. 문서 명명 규칙 (File Naming)

- 모든 파일명은 **영문 케밥 케이스(kebab-case)**를 사용합니다. (예: `design-tokens.md`, `database-schema.md`)
- 관련된 주제별로 폴더를 구분하여 관리합니다. (`design/`, `architecture/`, `features/`, `setup/`)

## 2. 콘텐츠 구조 규칙 (Content Structure)

에이전트의 기술적 정확도와 개발자의 가시성을 위해 다음 하이브리드 구조를 엄격히 준수합니다.

1. **H1 제목**: 한글 명칭과 영문 명칭을 병기합니다.
   - 형식: `# [한글제목]: [영문부제] ([Original English Title])`
2. **한글 요약문 (Visible Summary)**: 제목 바로 아래에 해당 문서의 핵심 내용을 한글로 1~3문장 작성합니다. (에이전트가 아닌 **사람**을 위한 섹션)
3. **영문 기술 명세 (Technical Specs)**: 본문 및 모든 하위 섹션(H2~)은 기술적 정밀도를 위해 **영문**으로 작성합니다. (에이전트의 **코드 생성 정확도**를 위한 섹션)

```markdown
# 문서 제목: 부제 (Document Title)

여기에 핵심 내용을 한글로 요약합니다.

## 1. Technical Section
English description here for better agent alignment.
```

## 3. 커밋 메시지 규칙 (Commit Convention)

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

## 4. 기술적 정밀성 유지

- **Performance Target**: 성능 관련 수치(예: 0.2s, 100ms)는 반드시 영문 명세에 명시합니다.
- **Code Reference**: `@source`, `globals.css` 등 코드와 연관된 파일 경로나 기술 용어는 번역하지 않고 원문을 유지합니다.

---

> [!IMPORTANT]
> 이 규칙은 에이전트가 기술적 의도를 오해하지 않도록 방어하는 동시에, 개발자가 빠르게 문서의 목적을 파악할 수 있도록 설계되었습니다.
