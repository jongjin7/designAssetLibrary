# Sprint 1: 모바일 화면 구성 명세 (Mobile UI Screen Specification)

Sprint 1 모바일(PWA) 앱의 각 화면(Screen)별 UI 구성 요소, 레이아웃 구조, 내비게이션 흐름을 정의합니다. 기능 명세([sprint1-mobile.md](sprint1-mobile.md))를 기반으로 실제 화면 단위의 컴포넌트 배치와 인터랙션을 구체화합니다.

Sprint 1 mobile UI consists of **3 primary screens**: Library, Camera Capture, and Profile. All screens share a fixed `BottomTabs` navigation and follow a single-column layout (`< 768px`).

---

## 1. 내비게이션 구조 (Navigation Structure)

### 1.1 전체 화면 흐름

OS의 공유 메뉴(Share Sheet)를 통한 외부 데이터 인입 경로가 포함됩니다.

```text
                    ┌─────────────────┐
                    │   Splash Screen  │
                    │  (auth check)    │
                    └────────┬────────┘
                             │
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
         [미인증]         [인증완료]      [외부 앱 공지]
               │              │              │
               ▼              ▼              ▼
        /login             /library  ◀── /share_target
                             │        (외부 사진/URL 수신)
               ┌──────────────┼──────────────┐
               ▼              ▼              ▼
           /library       /capture       /profile
               │
               └─▶ [상세검색/필터]
```

### 1.2 BottomTabs 구성 (전체 화면 공통 고정)

| 탭 | 아이콘 | 경로 | 비고 |
| --- | --- | --- | --- |
| **Library** | `grid-2x2` | `/library` | 기본 진입점 및 에셋 탐색 |
| **Capture** | `camera` | `/capture` | 중앙 FAB 스타일, 강조 색상 적용 |
| **Profile** | `user` | `/profile` | 개인화 설정 및 계정 관리 |

---

## 2. 화면별 UI 구성

### 2.1 Library Screen (`/library`)

에셋 전체 목록을 표시하는 메인 화면입니다. 2열 그리드와 실시간 인라인 검색을 지원합니다.

*   **SearchBar**: 텍스트 입력 시 `200ms debounce` 후 실시간 필터링. 우측 [⊶] 버튼으로 상세 필터 전환.
*   **AssetGrid**: 대용량 데이터를 위한 가상화 스크롤(Virtual Scroll) 적용.
*   **AssetCard**: 썸네일, 주요 추출 색상(팔레트 팁), 태그 정보 포함.

### 2.2 Capture Screen (`/capture`)

카메라 촬영 및 갤러리 선택을 통해 에셋을 수집하는 핵심 화면입니다.

1.  **Camera Mode**: 실시간 뷰파인더와 촬영 가이드 오버레이 노출.
2.  **File Review**: 촬영 후 또는 갤러리 선택 후 결과물 확인. 셔터가 '업로드' 버튼으로 전환.
3.  **Uploading**: 상단 진행 바(`UploadProgressBar`) 인터랙션 및 결과 성공 시 Toast 알림.

### 2.3 Search Screen (`/search`)

*   **RecentSearch**: 최근 검색어 칩(Chip) 제공.
*   **Color Filter**: 주요 색상(🔴🔵🟡...) 아이콘을 통한 시각적 필터링.
*   **Real-time Results**: 태그, 파일명, 컬러 등 복합 조건의 실시간 검색 결과 노출.

### 2.4 Asset Detail Sheet (Bottom Sheet)

`AssetCard` 탭 시 하단에서 슬라이드 업 형태로 노출됩니다.

*   **HI-RES Preview**: 고해상도 이미지 확인 및 핀치 줌 지원.
*   **AI Metadata**: AI가 분석한 객체(Object), 구도(Composition), 5가지 주요 색상(Palette) 나외.
*   **Palette Interaction**: 개별 컬러 탭 시 헥사(Hex) 코드 클립보드 복사.
*   **Actions**: 공유(OS Native), 폴더 이동(Sprint 2 연동), 저장소 삭제.

---

## 3. 공통 UI 규칙

### 3.1 Safe Area 대응

iOS/Android의 시스템 영역 보호를 위해 다음 규칙을 적용합니다.
- `BottomTabs`: `safe-area-inset-bottom` 여백 포함.
- `CaptureControls`: 홈 인디케이터 침범 방지를 위해 하단 여백 추가 확보.

### 3.2 로딩 및 AI 분석 상태

| 상황 | 처리 방식 |
| --- | --- |
| 에셋 목록 로딩 | `AssetCard` Skeleton UI 적용 |
| 이미지 비동기 로딩 | 저해상도 Blur-up 효과 |
| AI 분석 중 | 시트 내부 메타데이터 영역에 Shimmer 효과 및 "분석 중..." 메시지 노출 |

### 3.3 제스처 인터랙션

- `Swipe-down`: 바텀 시트 및 캡처 화면 닫기.
- `Long-press`: 에셋 다중 선택 모드 진입.
- `Pinch-zoom`: 상세 페이지 이미지 확대.

### 3.4 화면 방향 정책 (Orientation Policy)

*   **세로 모드(Portrait) 고정**: NOVA Mobile은 세로 탐색에 최적화된 앱입니다.
*   **PWA 설정**: `manifest.json` 내 `orientation: portrait`를 통해 설치형 앱의 가로 전환 차단.
*   **브라우저 폴백**: 가로 모드(Landscape) 감지 시 "세로 모드 최적화" 안내 오버레이 노출 및 기능 제한.

---

## 4. 수락 기준 (Acceptance Criteria)

- [ ] 모든 최상위 경로에서 `BottomTabs`가 하단에 고정 표시된다.
- [ ] iOS/Android `Share Target`을 통한 이미지 수신 및 라이브러리 추가가 정상 동작한다.
- [ ] 기기 가로 전환 시 안내 오버레이가 나타나며 기능이 보호된다.
- [ ] 카메라 권한 거부 시 '파일 선택' 모드로 자동 폴백된다.

---

## 5. 관련 문서

| 문서 | 내용 |
| --- | --- |
| [sprint1-mobile.md](sprint1-mobile.md) | Sprint 1 기능 명세 |
| [sprint2-desktop-screens.md](sprint2-desktop-screens.md) | Sprint 2 데스크탑 화면 명세 (비교 참고) |
