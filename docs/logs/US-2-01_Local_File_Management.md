# Feature Log: US-2-01 로컬 파일 관리 유닛 (Drag & Drop + Watcher)

- **ID**: US-2-01
- **Status**: Completed
- **Date**: 2026-04-04
- **Related PR/Commit**: `feat: 로컬 파일 드래그&드롭 및 감시 폴더 기능 구현 및 시스템 안정화`

## 1. 구현 목표
데스크탑 앱의 강점을 살려 로컬 파일 시스템과 라이브러리를 직접 연결하고 자동화된 수집 환경을 구축함.

## 2. 핵심 구현 사항
### 2.1. 재귀적 파일 드래그&드롭 (Renderer)
- `webkitGetAsEntry` API를 사용하여 폴더 드롭 시 하위 트리를 모두 탐색.
- 수집된 대량의 파일을 5개씩 배치(Batch) 처리하여 UI 블로킹 방지.
- `JPG, PNG, WebP, GIF, SVG, PDF, OTF, TTF` 8종 포맷 자동 필터링.

### 2.2. 실시간 폴더 감시 (Main Process)
- `chokidar` 기반의 폴더 감시 엔진 구축.
- 새 파일 감지 시 `file-added` IPC 이벤트를 통해 렌더러에 즉시 알림.
- 로컬 경로는 앱의 `userData`에 JSON으로 저장되어 영구 유지.

### 2.3. 보안 통신 프로토콜 (`nova-asset://`)
- HTTPS 오리진에서 `file://` 접근 차단 문제를 해결하기 위해 전용 프로토콜 구축.
- `protocol.registerSchemesAsPrivileged`를 통해 `fetch` 권한 부여.

## 3. 기술적 도전 및 해결 (Gotchas)
### 3.1. EMFILE 에러 (Too many open files)
- **증상**: 감시 폴더 내에 `node_modules` 등이 포함될 경우 시스템 파일 오픈 제한을 초과하는 오류 발생.
- **해결**: `ignored` 옵션에 `node_modules`, `.git`, `dist` 등 대규모 폴더를 블랙리스트로 등록하고 탐색 깊이(`depth: 5`)를 제한함.

### 3.2. Preload 주입 및 경로 이슈
- **증상**: 빌드 과정에서 `preload.js` 확장자 불일치로 `window.electron` 객체가 주입되지 않음.
- **해결**: `main.ts` 설정값을 실제 빌드 결과물인 `.js`로 정정하여 렌더러 API 정상 작동 확인.

### 3.3. IPC 리스너 중복 이슈
- **증상**: 리액트 재렌더링 시 이벤트 리스너가 누적되어 중복 업로드 현상 발생 가능성.
- **해결**: `preload.ts`의 `receive` 함수가 `removeListener` 클린업 함수를 반환하도록 개선하고 `useEffect`에 연동함.

## 4. 품질 검증
- **Unit Tests**: `fileValidation.test.ts`를 통해 포맷 필터링 및 배치 처리 로직 검증 (8/8 PASS).
- **Manual QA**: 데스크탑 앱 내에서 실제 폴더 지정 및 신규 파일 생성 시 실시간 라이브러리 추가 확인.

## 5. 향후 과제
- 감시 중인 폴더의 파일이 **삭제**되거나 **이동**될 때 원격 DB와 동기화할지 여부 결정 필요.
- 윈도우 환경에서의 경로 구분자(`/` vs `\`) 호환성 추가 테스트.
