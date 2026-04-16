# US-3-01: AI Asset Tagging & UI Refinement

## 1. 개요 (Overview)
디바이스 내(On-device) AI 분석 기술을 활용하여 에셋의 업로드와 동시에 자동으로 객체 및 분위기를 분류하고, 직관적인 자산 관리를 위해 에셋 카드의 메타데이터 노출을 정제하는 작업을 수행함.

## 2. 주요 구현 내용 (Key Implementations)

### 2.1. AI 분석 시스템 (AI Tagging)
- **분류 모델**: `@tensorflow-models/mobilenet` (MobileNet v2) 사용.
- **On-device 처리**: 서버 통신 없이 브라우저 내에서 직접 분석을 수행하여 프라이버시 보호 및 성능 최적화.
- **분석 종류**:
    - **객체 분류 (Objects)**: 이미지 내 사물 인식 및 태깅 (Confidence Threshold: 0.1).
    - **분위기 분석 (Mood)**: 이미지의 지배적인 색상(채도, 대비, 밝기 등) 분석을 통해 'Vibrant', 'Calm', 'Warm' 등 분위기 키워드 태그 생성.
- **성능 가드**: 분석 과정에서 지연(Lag) 방지를 위해 5초 타임아웃 적용 및 온보딩 시 모델 사전 로드(Warm-up) 수행.

### 2.2. 라이브러리 UI 정제 (UI Refinement)
- **메타데이터 노이즈 제거**: 에셋 카드 및 리스트 뷰에서 중요도가 낮은 확장자명(.jpg, .png 등) 및 파일 용량 정보를 제거하여 디자인 에셋 자체에 집중할 수 있는 레이아웃 구현.
- **이름 중심 레이아웃**: 확장자가 제외된 순수 파일명을 강조하여 가독성 개선.
- **컬러칩(Palette Bar) 유지**: 디자인 에셋의 핵심 데이터인 주요 색상 팔레트 정보는 유지하여 시각적 탐색 효율 확보.
- **중앙화된 로딩 시스템**: AI 분석 중임을 알리는 글로벌 로딩 오버레이를 통합하여 모바일/데스크탑 일관된 UX 제공.

## 3. 기술적 결정 사항 (Architectural Decisions)

### 3.1. IndexedDB 통합
- 분석된 AI 태그는 `MockAssetRepository` 레이어에서 기존 메타데이터와 병합되어 IndexedDB에 영구 저장됨.
- 저장 시 OPFS(Origin Private File System) 경로를 활용하여 대량의 에셋을 안정적으로 관리.

### 3.2. 상태 관리 (Zustand)
- `useAssetStore`에 `isAnalyzing` 글로벌 상태를 추가하여 여러 화면에서 분석 진행 상황을 동기화하여 표시함.

## 4. 향후 계획 (Future Plans)
- 사용자에 의한 AI 생성 태그 편집 기능 고도화.
- 다중 객체 인식 정확도 향상 및 상세 분위기 알고리즘 정교화.
