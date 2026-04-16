# NOVA: Sprint 1 & 2 Integrated Weekly Plan

본 문서는 **Sprint 1(Week 1-3)** 모바일 MVP 베타와 **Sprint 2(Week 4-6)** 데스크탑 확장 및 하이브리드 조직화의 통합 실행 계획입니다.

---

## 📅 주간 상세 일정 (Weekly Schedule)

### **[Sprint 1: Mobile MVP Beta] (Week 1–3)**

**목표**: 모바일 PWA 환경에서 촬영 및 수집 즉시 AI 분류와 로컬 영구 저장이 완료되는 MVP 구축.

#### **Week 1: Foundations & Local Storage**
- [x] **Infrastructure**: `apps/web-app` PWA 설정 및 standalone 모드 대응.
- [x] **Core Layout**: 모바일-데스크탑 반응형 셸 엔진 및 `useIsDesktop` 구현.
- [x] **Onboarding & Setup (US-1-01)**: 앱 최초 실행 가이드 및 로컬 라이브러리(OPFS) 생성 자동화.
- [x] **Persistence (US-1-04)**: `OPFS` 원본 저장 및 `IndexedDB` 메타데이터 영구 저장 브릿지 (`opfs.ts`).

#### **Week 2: AI Capture & Smart Ingestion**
- [x] **Capture Engine (US-1-02)**: 카메라 뷰파인더(`CaptureViewfinder`) 및 직접 촬영/저장 로직 구현.
- [/] **AI Tagging Engine**:
  - [x] **Color Analysis**: K-Means 알고리즘 기반 주조색 5종 추출 (`colorExtractor.ts`).
  - [ ] **Core Classification**: MobileNet 기반 객체, 구도, 스타일 자동 카테고리화.
- [x] **Inbox & Grid**: 수집 자산의 최상단 인박스 자동 유입 및 썸네일 그리드 렌더링.

#### **Week 3: External Integration & Beta QA**
- [ ] **OS Share Sheet (US-1-03)**: iOS/Android 공유 시트를 통한 이미지 및 URL 직수신 로직 완성.
- [ ] **Offline Sync**: 서비스 워커 오프라인 큐 처리 및 캐싱 전략 고도화.
- [x] **Sprint 1 DoD**: 에셋 저장 성공률 및 로컬 데이터 영구 보존(Persistence) 최종 검증.

---

### **[Sprint 2: Desktop & Organization] (Week 4–6)**

**목표**: 데스크탑 고도화 및 하이브리드(Cloud + Local) 데이터 동기화 기반 완성.

#### **Week 4: Desktop Shell & Bulk Ingestion**
- [x] **3-Panel Architecture (US-2-00)**: 사이드바 - 그리드 - 인스펙터 구조의 `DesktopShell` 완성.
- [x] **Selection & Bulk Action (US-2-14)**: 관리 모드 토글, 다중 선택(Shift/Cmd), 일괄 삭제/이동 엔진.
- [ ] **Ingestion Pipeline v2 (US-2-01)**: OS 탐색기 드래그&드롭 일괄 저장 및 **감시 폴더(Monitored Folder)** 시스템.
- [ ] **Native Ingestion (US-2-04)**: 클립보드 이미지 붙여넣기(`Cmd+V`) 및 대량 업로드 비동기 오버레이.

#### **Week 5: Advanced Taxonomy & Classification**
- [ ] **Hierarchical Folders (US-2-05)**: 2단계 중첩 폴더 트리, 새 폴더(+) 및 폴더 관리(...) Popover UI.
- [ ] **Automated Workflow (US-2-06, 08)**: 폴더 이동 시 태그 자동 부여 및 스마트 폴더(검색 조건 기반) 시스템.
- [ ] **Quick Classification (US-2-10)**: `F` 키 카테고리 검색/분류 팔레트 및 전용 단축키 시스템.
- [ ] **Rich Metadata (US-2-09, 13)**: 별점, 컬러 라벨, 도메인 맥락 자동 수집 및 인라인 메모 시스템.

#### **Week 6: Web Extension & Batch Tools**
- [ ] **Web Extension v1 (US-2-02, 03)**: 브라우저 7종 캡처 모드 및 웹 이미지 드래그 저장 오버레이.
- [ ] **Power Tools (US-2-11, 12)**: 태그 속성 복사/붙여넣기 및 일괄 이름 변경(Batch Rename) 엔진.
- [ ] **Hybrid Sync Foundation**: `SupabaseAssetRepository` 연동 및 로컬 OPFS 캐시 삭제(Purge) 관리.

---

## ✅ 완료 조건 (Definition of Done)

1. [ ] **모바일**: iOS/Android 카메라 및 공유 시트 → OPFS 저장 E2E 워크플로우 100% 성공.
2. [ ] **데스크탑**: 30,000개 에셋 환경에서도 그리드 스크롤 및 태깅 응답 200ms 이내 유지.
3. [ ] **동기화**: 오프라인에서 수집한 데이터가 온라인 전환 시 Supabase와 자동 연동 확인.
4. [ ] **AI 품질**: 로컬 태깅 정확도(MobileNet 기준) 및 주조색 5종 추출 오차 범위 내 확인.

---
> [!IMPORTANT]
> 모든 개발 항목은 `packages/ui` 디자인 시스템과 `Hybrid Data Provider` 아키텍처 원칙을 준수해야 합니다.
