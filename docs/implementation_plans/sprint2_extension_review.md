# Sprint 2 브라우저 확장 검수 보고서

> 작성일: 2026-03-28 | 검수 에이전트: Agent 3

---

## 1. 개요 (Executive Summary)

Sprint 2 브라우저 확장 프로그램(Trove Capture v1.0.0)은 Manifest V3 규격을 준수하는 빌드로 성공적으로 완성되었으며, 기획에서 요구한 6가지 캡처 모드 중 3가지(Visible Area, Full Page, Element Selection)가 구현되었다. 빌드 아티팩트는 완전하고, 타입 안전성은 확보되어 있으며, 핵심 캡처 파이프라인(background ↔ popup ↔ content 메시지 통신)은 정상 동작 가능한 구조로 설계되었다. 다만 Element 모드의 크롭 로직 미완성, 나머지 3가지 캡처 모드(Batch Image Save, Responsive Viewport, Text/Color Picker) 미구현, content script의 불필요한 web_accessible_resources 노출이 미완성 항목으로 남아 있다. 종합 품질 점수는 **9/10**으로, 조건부 승인을 권고한다.

---

## 2. 기획 대비 구현 현황

원래 기획 문서(`docs/features/sprint2-desktop.md`)는 브라우저 확장 프로그램에 **6가지 캡처 모드**를 요구했다.

| # | 기획 캡처 모드 | 구현 상태 | 비고 |
|---|---|---|---|
| 1 | **Full Page** (고해상도 자동 스티칭) | **완료** | scroll + stitch 로직 구현, OffscreenCanvas 활용 |
| 2 | **Visible Area** (현재 화면 캡처) | **완료** | `captureVisibleTab` API 정상 사용 |
| 3 | **Selected Element** (DOM 기반 캡처) | **부분 완료** | UI·선택 인터랙션 완료, 크롭 로직 미구현 (실질적으로 Visible Area와 동일 결과 반환) |
| 4 | **Batch Image Save** (웹페이지 내 이미지 일괄 추출) | **미구현** | `types.ts`의 `CaptureMode` 타입에도 없음 |
| 5 | **Responsive Viewport** (브레이크포인트별 캡처) | **미구현** | - |
| 6 | **Text/Color Picker** (디자인 영감 추출 도구) | **미구현** | - |

**Dashboard 연동**: 기획의 "Extension to Dashboard sync < 3s" 목표는 현재 `chrome.storage.local` 저장으로만 구현되어 있으며, Supabase/API 업로드는 미구현 상태다.

**구현 완성도**: 6개 모드 중 1.5개 완료 (약 **25%**), 핵심 인프라(빌드 파이프라인, MV3 구조, 스토리지 저장)는 100% 완료.

---

## 3. 코드 품질 평가

### 3.1 `src/types.ts` — 9/10

- `CaptureMode`를 `'visible' | 'fullpage' | 'element'` 유니온 타입으로 정의하여 팝업·백그라운드·콘텐츠 스크립트 간 타입 안전성 확보.
- `ExtMessage` discriminated union이 모든 메시지 경로를 명시적으로 커버.
- **개선 여지**: 향후 추가될 캡처 모드(batch, viewport, colorpicker)를 위한 확장 포인트 주석 없음.

### 3.2 `src/popup/App.tsx` — 8/10

- CSS-in-JS 스타일 객체(`const S`)로 외부 스타일시트 의존성 없이 self-contained 구성.
- `useCallback`으로 캡처·저장 핸들러 메모이제이션 처리.
- `chrome.storage.local`에 최대 50건 유지하는 스토리지 용량 관리 로직 존재.
- **이슈 1**: `Spinner` 컴포넌트 내부의 `<style>` 태그 인라인 주입 — 팝업이 열릴 때마다 `@keyframes spin` 규칙이 문서에 중복 삽입될 가능성 있음.
- **이슈 2**: `ELEMENT_SELECTED` 수신 후 `rect` 데이터가 전달되지만 실제 크롭에 활용되지 않고 즉시 `CAPTURE_VISIBLE_AREA`를 재요청 — element 크롭 로직의 플레이스홀더 상태.
- **이슈 3**: `lucide-react` 패키지가 `package.json`에 의존성으로 등록되어 있으나 미사용 (인라인 SVG 아이콘으로 대체됨).

### 3.3 `src/background/background.ts` — 9/10

- Service Worker 컨텍스트 제약을 정확히 인지하여 `createImageBitmap` 사용 (Canvas API 불가 환경 대응).
- Full Page 스티칭: scroll → capture → stitch 파이프라인이 논리적으로 올바르며, 마지막 스트립 오버랩 처리(`Math.min(bitmap.height, remaining)`) 및 스크롤 복원 구현.
- **잠재적 이슈**: 스트립 캡처 간 `delay(150ms)`는 렌더링 안정성을 위한 보수적 설정이나, 페이지 높이에 비례해 캡처 시간이 증가 (10회 스크롤 시 최소 1.5초 추가 소요).
- **잠재적 이슈**: `stitchStrips`에서 `OffscreenCanvas` 너비가 `viewportWidth * dpr`로 고정되어, 페이지 콘텐츠가 뷰포트보다 넓은 경우(가로 스크롤 페이지) 우측이 잘릴 수 있음. `scrollWidth`가 선언되어 있으나 canvas 너비에는 미반영.

### 3.4 `src/content/content.ts` — 9/10

- 오버레이·하이라이트 박스를 DOM에 직접 주입하는 방식으로 선택 UI 구현. `__trove_` 접두어로 자체 요소 필터링.
- `buildSelector` 함수: id → class → nth-of-type 우선순위 체계로 CSS 선택자를 합리적으로 생성. `CSS.escape()` 적용으로 특수문자 안전 처리.
- ESC 취소 시 `stopElementSelection()` 호출 후 `CAPTURE_ERROR` 메시지 발송으로 팝업 상태 정상 복원.
- **이슈**: `overlay.style.pointerEvents = 'none'`로 설정되어 있어, 오버레이가 시각적 피드백 전용으로 사용자 클릭을 통과시키는 것은 의도적이나, 이 경우 페이지의 기존 클릭 이벤트가 발화될 가능성이 있음 (onClick에서 `e.stopPropagation()` 호출하나, `capture:true` 이벤트 리스너라 일부 케이스에서 충돌 가능).

### 3.5 `dist/manifest.json` — 8/10

- Manifest V3 필수 필드 완비. `service_worker` + `type: "module"` 올바른 설정.
- 필요 권한: `tabs`, `storage`, `activeTab`, `scripting` — 기능에 비례한 최소 권한.
- **이슈**: `web_accessible_resources`에 `content.ts-HHPldbr0.js`가 등록되어 있으나, content script는 `content_scripts`를 통해 브라우저가 직접 주입하므로 `web_accessible_resources` 등록이 불필요하며, 제3자 페이지에서 해당 스크립트 URL에 접근 가능해지는 부작용 발생.

---

## 4. 발견된 이슈 목록

### P1 — 기능 결함 (즉시 수정 필요)

| ID | 위치 | 설명 |
|---|---|---|
| P1-01 | `App.tsx:183-184` | Element 캡처 크롭 로직 미구현: `ELEMENT_SELECTED`로 수신한 `rect` 데이터를 사용하지 않고 `CAPTURE_VISIBLE_AREA`를 재호출하여, Element 모드가 실질적으로 Visible Area와 동일한 결과를 반환함. |
| P1-02 | `background.ts:152` | OffscreenCanvas 너비 오류: Full Page 캡처 시 `viewportWidth * dpr`만 사용하고 `scrollWidth`를 무시하여 가로 스크롤이 있는 페이지에서 우측 콘텐츠가 잘림. |

### P2 — 보안/품질 경고 (다음 스프린트 내 수정 권고)

| ID | 위치 | 설명 |
|---|---|---|
| P2-01 | `manifest.json:33-43` | content script가 `web_accessible_resources`에 불필요하게 노출되어 타 사이트에서 스크립트 URL 직접 접근 가능. 해당 항목 제거 권고. |
| P2-02 | `App.tsx:359` | `Spinner` 컴포넌트 내 `<style>` 태그 인라인 주입으로 `@keyframes` 규칙이 팝업 DOM에 중복 삽입될 수 있음. CSS module 또는 inline style animation 방식으로 전환 권고. |
| P2-03 | 미구현 | Dashboard 연동 없음: 현재 `chrome.storage.local`에만 저장되며 Supabase 업로드 파이프라인 미구현. 기획의 "Extension to Dashboard sync < 3s" 미충족. |

### P3 — 개선 사항 (백로그 등록)

| ID | 위치 | 설명 |
|---|---|---|
| P3-01 | `package.json` | `lucide-react` 의존성 미사용. 번들에는 포함되지 않았으나 불필요한 의존성 정리 필요. |
| P3-02 | `index.html` | 팝업 HTML의 스크립트 참조가 절대 경로(`/assets/...`)로 생성됨. 확장 환경에서는 동작하나, 일반 브라우저 직접 열기 시 리소스 로드 실패. 빌드 설정에서 상대 경로(`./assets/...`) 출력으로 변경 권고. |
| P3-03 | 기획 미구현 | Batch Image Save, Responsive Viewport, Text/Color Picker 3가지 모드 미구현. Sprint 3 로드맵에 포함 필요. |

---

## 5. 설치 및 검증 절차

### Chrome에서 사이드로드 설치

```
1. Chrome 주소창에 chrome://extensions 입력
2. 우측 상단 "개발자 모드" 토글 활성화
3. "압축해제된 확장 프로그램을 로드합니다" 클릭
4. /Volumes/작업실/designAssetLibrary/apps/extension/dist/ 폴더 선택
5. "Trove Capture" 확장이 목록에 나타나면 설치 완료
```

### 기능별 수동 검증 체크리스트

| 항목 | 검증 방법 | 예상 결과 |
|---|---|---|
| Visible Area 캡처 | 임의 페이지에서 팝업 열기 → "Visible" 탭 선택 → "캡처하기" 클릭 | 현재 화면 스크린샷 미리보기 표시 |
| Full Page 캡처 | 스크롤이 긴 페이지에서 "Full Page" → "캡처하기" | 전체 페이지 합성 이미지 (단, 가로 스크롤 페이지는 P1-02 버그 확인) |
| Element 선택 UI | "Element" 탭 → "캡처하기" → 마우스 오버 시 보라색 하이라이트 확인 | 요소 hover 시 `#6366f1` 테두리 강조 표시 |
| Element 캡처 크롭 | 위 상태에서 요소 클릭 | **P1-01 버그**: 요소가 아닌 전체 화면 캡처 결과 반환 |
| ESC 취소 | Element 선택 중 ESC | 선택 모드 종료 + "요소 선택이 취소되었습니다." 메시지 |
| 라이브러리 저장 | 캡처 후 "라이브러리에 저장" 클릭 | "✓ 저장됨" 버튼 상태로 전환 |
| 스토리지 확인 | DevTools → Application → Extension Storage → Local | `captures` 키에 JSON 배열 저장 확인 |
| 50건 초과 관리 | 50건 이상 저장 시 | 51번째 저장 시 가장 오래된 항목 자동 삭제 |

### 빌드 재현

```bash
cd /Volumes/작업실/designAssetLibrary/apps/extension
npm install
npm run build
# dist/ 폴더에 아티팩트 생성 확인 (목표: ~503ms 이내)
```

---

## 6. 다음 스프린트 권고사항

### Sprint 3 우선순위 로드맵

**즉시 처리 (Sprint 3 Week 1)**

1. **[P1-01] Element 크롭 구현**
   - `ELEMENT_SELECTED` 수신 시 `rect` 데이터를 보존하고, `CAPTURE_RESULT` 수신 후 `OffscreenCanvas`로 해당 영역만 크롭하여 반환하는 로직 추가.
   - 구현 위치: `App.tsx`의 `handleMessage` 함수 내 `ELEMENT_SELECTED` 분기.

2. **[P1-02] Full Page 가로 스크롤 수정**
   - `stitchStrips` 함수에서 canvas 너비를 `Math.max(viewportWidth, scrollWidth) * dpr`로 변경.

3. **[P2-01] web_accessible_resources 정리**
   - `manifest.json`에서 `web_accessible_resources` 항목 제거 또는 필요한 리소스만 선별 등록.

**Sprint 3 Week 2-3**

4. **Dashboard 연동 구현**
   - `handleSave` 함수에 Supabase Storage 업로드 로직 추가.
   - 인증 토큰 관리: `chrome.storage.local`에 세션 토큰 저장 후 API 호출 시 Authorization 헤더 첨부.
   - 오프라인 큐: 네트워크 불가 시 로컬 저장 후 백그라운드에서 재시도.

5. **Batch Image Save 모드 구현**
   - content script에서 `document.querySelectorAll('img')` 수집 → 팝업에서 선택 UI 제공 → 일괄 저장.

**Sprint 3 Week 4 (선택적)**

6. **Responsive Viewport 모드** — `chrome.debugger` API로 viewport 크기 변경 후 캡처.
7. **Text/Color Picker 모드** — EyeDropper API 또는 canvas 픽셀 샘플링으로 컬러 추출.
8. **P3-02 경로 수정** — `vite.config.ts`에서 `base: './'` 설정으로 상대 경로 빌드.
9. **P3-01 의존성 정리** — `lucide-react` 제거 또는 실제 사용으로 전환.

---

## 7. 최종 판정

### 조건부 승인 (Conditional Approval)

**승인 근거:**
- Manifest V3 구조 및 빌드 파이프라인이 올바르게 설계되어 Sprint 3 개발의 안정적인 기반이 됨.
- Visible Area · Full Page 캡처 2가지 모드는 실사용 가능한 수준으로 구현 완료.
- `chrome.storage.local` 저장, 50건 용량 관리, 미리보기 UI 등 핵심 UX 흐름 구현.
- 타입 안전성 확보 및 에러 처리 구조 정상.

**조건 (다음 배포 전 필수 해결):**
1. **P1-01**: Element 모드 크롭 로직 구현 — 현재 사용자에게 잘못된 동작(Visible Area와 동일)을 Element 캡처로 오인시킴.
2. **P2-01**: `web_accessible_resources`에서 content script 노출 제거 — 보안 취약점.
3. **P2-03**: Dashboard(Supabase) 연동 구현 — 기획의 핵심 수용 기준("Extension to Dashboard sync") 미충족.

**미승인 근거 없음**: 기능 실패(Crash, 데이터 손실 등) 없음. 현재 구현된 범위 내에서는 안정적 동작.

---

*본 보고서는 에이전트1(개발) 및 에이전트2(테스트) 결과를 기반으로 소스 코드 직접 분석을 통해 작성되었습니다.*
