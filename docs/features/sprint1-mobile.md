# Sprint 1: Mobile Collector Specification

모바일 웹(PWA) 기반의 디자인 자산 수집 도구에 대한 기능 명세서입니다. 카메라 캡처, 이미지 최적화, AI 기반 자동 분류 및 실시간 동기화 구현을 목표로 합니다.

Sprint 1 focuses on building the **PWA-based mobile application** for instant design asset collection.

## 1. Feature Goals

- **Instant Camera Capture:** Mobile-optimized UI for rapid shooting.
- **Client-Side Processing:** EXIF/GPS metadata removal and thumbnail generation in-browser.
- **AI Classification:** Real-time extraction of 5 core colors, components, and objects.
- **High-Performance Storage:** **OPFS (Origin Private File System)** for local image caching.
- **Reliable Sync:** **TUS Protocol** for resumable uploads within a 3s target.

---

## 2. Core User Stories
1. **As a designer**, I want to take a photo of a physical design and have its colors automatically extracted.
2. **As a collector**, I want to capture multiple assets in a row without waiting for each one to upload.
3. **As a user**, I want to see my mobile-captured assets update in real-time on my desktop dashboard.

---

## 3. Technical Requirements

### 3.1 PWA Camera & Storage (`/apps/web-app`)

- **API:** Use `Navigator.mediaDevices.getUserMedia` for custom camera interface.
- **Local Cache:** Use **OPFS** for high-speed I/O of high-res assets.
- **Privacy:** Client-side Web Worker strips GPS/EXIF before upload.
- **Offline:** IndexedDB queue for metadata; TUS for resumable file chunks.

### 3.2 Smart Folders Logic

- **Implementation:** Query builder that translates conditions into PostgreSQL JSONB filters.
- **Virtual Views:** Folders with `is_smart_folder = true` act as dynamic viewpoints for assets with matching tags/colors.

### 3.3 Desktop App Extension

- **6 Capture Modes:** Full Page, Visible Area, Selected Element, Batch Image Save, Responsive Viewport, and Text/Color Picker.
- **Performance:** Extension to Dashboard sync also targetting < 3s.

### 3.4 Storage Logic
- **Pathing:** `/users/[user_id]/[year]/[month]/[uuid].webp`.
- **Optimization:** Automatic conversion to WEBP/AVIF to minimize storage and bandwidth.

---

## 4. Acceptance Criteria (AC)
- [ ] PWA can be installed on iOS/Android home screens.
- [ ] Users can capture an image and see it appear in the dashboard within **3 seconds**.
- [ ] AI-extracted tags achieve **70% accuracy** in early testing.
- [ ] Privacy check: Uploaded files contain no GPS coordinates.
- [ ] Deduplication: SHA-256 hash prevents duplicate uploads of the same physical file.
