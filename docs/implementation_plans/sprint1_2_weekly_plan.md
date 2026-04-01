# NOVA: Sprint 1 & 2 Integrated Weekly Plan

본 문서는 **Sprint 1(Week 1-3)** 모바일 MVP 베타와 **Sprint 2(Week 4-6)** 데스크탑 확장 및 하이브리드 조직화의 통합 실행 계획입니다.

---

## 📅 주간 상세 일정 (Weekly Schedule)

### **[Sprint 1: Mobile MVP Beta] (Week 1–3)**

**목표**: 모바일 PWA 환경에서 촬영 및 수집 즉시 AI 분류와 로컬 영구 저장이 완료되는 MVP를 구축합니다.

#### **Week 1: PWA Shell & Local Storage**

- [x] **Infrastructure**: `apps/web-app` PWA 설정 (`manifest.json` 기반 standalone 설정 완료).
- [x] **Core Layout**: 모바일 및 데스크탑 대응 레이아웃 엔진 (`useIsDesktop` 적용).
- [x] **On-Device Storage**: `OPFS` 원본 저장부 및 `IndexedDB` 기반 메타데이터 저장 브릿지 (`opfs.ts` 구현 완료).

#### **Week 2: AI Capture & Classification**

- [x] **Camera API**: `CaptureViewfinder` 및 `CaptureControls` 통한 카메라 제어 구현 완료.
- [/] **AI Tagging Engine**:
  - [x] **TensorFlow.js 기반 주조색 추출**: `colorExtractor.ts` (K-Means Clustering) 구현 완료.
  - [ ] **객체 및 구도 인식**: MobileNet 기반 자동 객체 카테고리 태그 부여 (구현 예정).
  - [ ] **Web Worker 최적화**: 메인 스레드 블로킹 방지를 위한 비동기 처리 구조화.
- [x] **Inbox Management**: 라이브러리/인박스 진입점 및 기본 에셋 그리드 (`AssetGrid.tsx`) 구현 완료.

#### **Week 3: Share Integration & Beta QA**

- [ ] **OS Share Sheet**: `manifest.json` 내 `share_target` 등록 및 이미지/URL 수신 로직 (구현 예정).
- [ ] **PWA Offline**: 서비스 워커를 통한 완전 오프라인 큐 처리 및 캐싱 전략 고도화.
- [x] **Sprint 1 DoD**: 에셋 저장 성공률 및 로컬 영구 저장 보장 검증 완료.

---

### **[Sprint 2: Desktop & Organization] (Week 4–6)**

**목표**: 데스크탑 고도화 및 하이브리드(Cloud + Local) 데이터 동기화 기반을 완성합니다.

#### **Week 4: Desktop Shell & Ingestion**

- [x] **3-Panel Layout**: 사이드바 - 에셋 그리드 - 인스펙터 구조의 `DesktopShell` 및 `Sidebar` UI 구축 완료.
- [ ] **Asset Grid v2**: 대량 에셋 대응을 위한 가상 스크롤(Virtual Scroll) 적용.
- [ ] **Batch Upload**: OS 탐색기 드래그&드롭 즉시 업로드 오버레이 및 배치 처리 엔진.

#### **Week 5: Advanced Organization & Taxonomy**

- [ ] **Hierarchical Folders**: 5단계 중첩 지원 폴더 트리 UI 및 DB 연동 (진행 중).
- [ ] **Smart Folder**: 태그, 별점, 컬러 라벨 기반 자동 분류 가상 폴더 시스템.
- [ ] **Auto-Tagging**: 폴더 이동 시 태그 자동 부여 파이프라인.

#### **Week 6: Extension & Hybrid Sync**

- [ ] **Web Extension**: 브라우저 확장 프로그램 7종 캡처 모드 브릿지.
- [ ] **Hybrid Sync Logic**: `SupabaseAssetRepository` 기반 클라우드 동기화 및 OPFS 캐싱 제어 로직.
- [ ] **Cache Management**: 로컬 용량 기반 캐시 Purge 및 클라우드 원본 전환 관리.

---

## ✅ 완료 조건 (Definition of Done)

1. [ ] **모바일**: iOS/Android 카메라 및 공유 시트 → OPFS 저장 E2E 워크플로우 100% 성공.
2. [ ] **데스크탑**: 30,000개 에셋 환경에서도 그리드 스크롤 및 태깅 응답 200ms 이내 유지.
3. [ ] **동기화**: 오프라인에서 수집한 데이터가 온라인 전환 시 Supabase와 자동 연동 확인.
4. [ ] **AI 품질**: 로컬 태깅 정확도(MobileNet 기준) 및 주조색 5종 추출 오차 범위 내 확인.

---
> [!IMPORTANT]
> 모든 개발 항목은 `packages/ui` 디자인 시스템과 `Hybrid Data Provider` 아키텍처 원칙을 준수해야 합니다.
