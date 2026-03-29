# Sprint 1: Mobile Collector Specification (Local-First)

This specification defines the functional and technical requirements for the **"PWA-based Instant Local Collection"** environment, the core objective of Sprint 1.

## 1. Feature Goals (Sprint 1 Limited)

- **Instant Camera Capture:** Mobile-optimized, low-latency shooting UI (completion within 1s).
- **Client-Side Pre-processing:** In-browser EXIF/GPS stripping and thumbnail generation worker.
- **Local AI Classification:** On-device (MobileNet) extraction of 5 core colors, composition, and objects.
- **High-Performance Storage:** **OPFS (Origin Private File System)** for high-speed I/O of large assets.
- **Stable Persistence:** IndexedDB for guaranteed offline metadata persistence.

---

## 2. Core User Stories

1. **As a designer**, I want to capture physical sketches or design references offline and instantly extract color palettes.
2. **As a collector**, I want to shoot multiple photos in a row without UI blocking, maintaining a seamless collection flow.
3. **As a user**, I want to send inspirations from other apps directly to my NOVA library via the iOS/Android 'Share' menu.

---

## 3. Technical Requirements

### 3.1 PWA Camera & Storage
- **Camera API:** Custom camera interface using `Navigator.mediaDevices.getUserMedia`.
- **Local Persistence:** **OPFS** as the primary source storage to prevent data loss even when browser cache is cleared.
- **Worker Isolation:** Image pre-processing (GPS removal, resizing) performed in Web Workers to prevent main-thread blocking.

### 3.2 OS Integration (Capture Channels)
- **Share Sheet Support:** Implementation of data reception logic via `share_target` in `manifest.json`.
- **Gallery Picker:** Multiple asset ingestion using standard `<input type="file">`.

### 3.3 Security & Performance
- **Deduplication:** Prevention of duplicate storage using **SHA-256 file hashes** as library IDs.
- **Privacy:** Immediate anonymization (GPS extraction) of all pending assets on the client side.
- **Latency Target:** From shutter click to local storage completion within **< 1s**.

---

## 4. Acceptance Criteria (AC)

- [ ] Successful installation of PWA on iOS/Android home screens.
- [ ] Verification of offline capture and persistent storage (data retained after app restart).
- [ ] AI Auto-tagging: **≥ 70% accuracy** across 3 categories (Color, Composition, Object) based on local test sets.
- [ ] Privacy Check: Confirmation that stored images contain no GPS coordinates.
- [ ] External App Integration: Successful ingestion and tagging of images/URLs shared via OS menus.
