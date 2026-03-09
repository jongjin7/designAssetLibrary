
# 통합 개발 계획: NOVA (Integrated Development Plan: Sprint 1 & 2)

모바일(PWA) 수집 환경과 데스크탑(Web/Electron) 관리 환경을 단일 코드베이스로 구축하기 위한 통합 개발 계획서입니다. '저장 마찰 제로'와 '실시간 동기화'를 목표로 한 기술 스택과 아키텍처, 마일스톤을 다룹니다.

## 1. 요약 (Summary)

본 스펙은 모바일(PWA) 수집 환경과 데스크탑(Web/Electron) 관리 환경을 단일 코드베이스 및 인프라 내에서 구축하기 위한 지침입니다. 특히 PRD에서 강조된 **"저장 마찰 제로"**와 **"0.2초 내 즉시 탐색"**을 실현하기 위해 초기 단계부터 고성능 이미지 처리 엔진과 실시간 동기화 아키텍처를 설계합니다.

## 2. 통합 목표 (Integrated Goals)

* **Performance:** 에셋 반영 지연 시간 **3초 이내**, 검색 응답 속도 **200ms 이내**.
* **Reliability:** 오프라인 큐(IndexedDB)와 재개 가능한 업로드(TUS Protocol)를 통한 데이터 무결성 보장.
* **Intelligent UX:** AI를 통한 주조색(5종) 및 사물 자동 태깅, 폴더 기반 자동 조직화.

## 3. 기술 스택 및 아키텍처 (Integrated Plan)

### 3.1 기술 스택 분석 및 확정

PRD의 MVP 요구사항을 반영한 최적의 스택입니다.

* **Framework:** `Next.js 15 (App Router)` - PWA와 데스크탑 웹 통합 대응.
* **Styling**: Tailwind CSS v4 (Engine-level CSS variable support).
* **Architecture**: Monorepo using `pnpm workspaces`.
* **Performance Engine**: OPFS (Origin Private File System) for lightning-fast local caching.
* **Database & Realtime:** `Supabase (PostgreSQL)` - 실시간 상태 동기화 및 RLS 보안.
* **Local Storage:** `OPFS (Origin Private File System)` - 브라우저 내 고해상도 이미지 고속 I/O.
* **Image Processing:** `Web Worker` + `Canvas API` / `Sharp` - UI 스레드 분리형 이미지 최적화.
* **AI Engine:** `Supabase Edge Functions` + `TensorFlow.js` - 온디바이스 및 에지 서버 하이브리드 분석.

### 3.2 핵심 아키텍처: 고성능 동기화 파이프라인

1. **Ingestion:** 카메라(S1), 공유 시트(S1), 드래그&드롭(S2), 확장 프로그램(S2)을 통한 멀티 채널 유입.
2. **Processing:** 업로드 전 클라이언트 워커에서 EXIF 제거 및 썸네일 생성.
3. **Storage:** TUS 프로토콜을 이용해 Supabase Storage에 안전하게 적재.
4. **Broadcast:** Supabase Realtime을 통해 연결된 모든 클라이언트(데스크탑/모바일)에 즉시 알림.

### 3.3 데이터베이스 스키마 확장 (Sprint 1 & 2 통합)

Sprint 2의 계층형 폴더 구조를 고려하여 설계된 핵심 스키마입니다.

* **`assets` Table:** `phash`(유사도 검색용 해시), `palette`(추출 컬러 JSONB), `folder_id` 포함.
* **`folders` Table:** `parent_id`를 통한 무제한 트리 구조, `is_smart_folder` 필드 포함.
* **`tags` Table:** 다대다 관계를 통한 유연한 필터링 지원.

## 4. 마일스톤 (Milestones)

* **Sprint 1 (Weeks 1-3):** PWA 인프라, 카메라 API 및 OPFS 저장소, AI 태깅 엔진 초기 버전.
* **Sprint 2 (Weeks 4-6):** 데스크탑 대시보드 UI, 브라우저 확장 프로그램(6종 캡처), 폴더/스마트 폴더 시스템.

## 5. 보안 및 리스크 관리

* **Privacy:** 모든 업로드 에셋은 클라이언트 사이드에서 GPS 메타데이터 즉시 삭제.
* **Integrity:** 파일 해시(SHA-256)를 고유 ID로 사용하여 중복 업로드 방지 및 로컬 경로 변경 대응.
* **Conflict:** MVP 단계에서는 '최종 쓰기 승리(Last-Write-Wins)' 정책 적용.

## 6. 체크리스트 (Check List)

* [ ] PWA 카메라 및 갤러리 접근 권한 획득 확인
* [ ] 3초 이내 동기화 완료 여부 (E2E 테스트)
* [ ] AI 태그 정확도 70% 이상 달성 확인
* [ ] 폴더 계층 이동 시 실시간 데이터 정합성 검증
* [ ] 브라우저 확장 프로그램의 Batch Save 기능 동작 확인
