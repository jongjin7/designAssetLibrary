# NOVA: 디자인 자산 라이브러리 문서 (Design Asset Library Documentation)

이 문서는 NOVA 프로젝트의 전체 문서 구조와 주요 링크를 제공하는 메타 문서입니다. 프로젝트 개요, 디자인/UI 바로가기, 아키텍처 및 설정 가이드를 포함합니다.

---

## 1. Project Overview

NOVA aims to bridge the gap between physical and digital design inspiration.

- **Sprint 1 (Mobile Context):** Capture anything, anywhere. Use AI to categorize it instantly.
- **Sprint 2 (Desktop Context):** Organize everything. Use folders, smart folders, and desktop tools to manage your library.

---

## 2. Quick Links

### 🎨 [Design & UI](design/overview.md)

- [**Design Overview**](design/overview.md) (Fluid Premium Philosophy)
- [Design Tokens](design/design-tokens.md) (Colors, Typography)
- [Layout Guide](design/layout.md) (3-Column Adaptive)
- [**Common Components (Phase 1)**](design/components-phase1.md) (Shared Assets)
- [Storybook Strategy](design/storybook.md) (Isolated Testing)

### 🛠️ [Setup & Infrastructure](setup/structure.md)

- [Monorepo Structure](setup/structure.md)
- [Development Commands](setup/commands.md)

### 🏗️ [Architecture](architecture/frontend.md)

- [**Frontend Architecture & Hooks**](architecture/frontend.md) (Next.js, PWA, Hooks)
- [**Custom Hooks Management**](architecture/frontend.md#7-custom-hooks-architecture) (Categorization & Patterns)
- [**Data Layer (Repository Pattern)**](architecture/frontend.md#5-data-layer--state-management) (Local-First & Sync)
- [**Database Schema Design**](architecture/database-schema.md) (Sprint 1 & 2 Unified)
- [Backend (Supabase)](architecture/backend.md)
- [**Coding Implementation Guide**](CONTRIBUTING_CODE.md) (Atomic Granularity & Anti-Bloat)

### ✨ [Feature Specs](features/sprint1-mobile.md)

- [**Sprint 1: Mobile Collector**](features/sprint1-mobile.md) (PWA & AI)
- [**Mobile & PWA Architecture**](architecture/frontend.md#41-mobile--pwa-architecture) (Offline & Install)
- [**Sprint 2: Desktop Manager**](features/sprint2-desktop.md) (Folders & Extensions)

---

## 3. Reference Documents

- [**Development Plan (Sprint 1 & 2)**](DEVELOPMENT_PLAN_S1_S2.md)
- [**Integration Roadmap (Sprint 3 & 4)**](DEVELOPMENT_PLAN_S3_S4.md)
- [Design Tokens](design/design-tokens.md)
- [UI Components (Phase 1)](design/components-phase1.md)

---

## 4. Getting Started

To get the project running locally, refer to the [Monorepo Setup Guide](setup/structure.md) and [Development Commands](setup/commands.md).
