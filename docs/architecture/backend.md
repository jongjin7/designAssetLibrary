# Backend Architecture: NOVA

Supabase를 기반으로 한 고성능 데이터 파이프라인, TUS 프로토콜을 이용한 안정적인 업로드, 그리고 Edge Functions와 TensorFlow.js를 활용한 AI 분류 시스템 등 백엔드 구조를 설명합니다.

The NOVA platform uses **Supabase** as its core backend service with a focus on high-performance data pipelines and AI classification.

## 1. Stack Components

- **Supabase Database:** PostgreSQL with JSONB and similarity search support.
- **Supabase Storage:** S3-compatible storage with **TUS Protocol** Support for resumable uploads.
- **Supabase Auth:** Email/Social login with Row-Level Security (RLS).
- **Supabase Edge Functions:** Serverless logic hosting **TensorFlow.js** for server-side AI refinement.
- **Supabase Realtime:** Instant state broadcasting to all connected clients.

## 2. High-Performance Sync Pipeline

### 2.1 Perceptual Hashing (phash)
- **Goal:** Enable "0.2s search" and similarity-based discovery.
- **Execution:** Generated via Edge Functions or TensorFlow.js on the server to ensure consistency.

### 2.2 AI Engine
- **TensorFlow.js:** Used in Supabase Edge Functions for sophisticated object detection and color palette refinement (5 core colors).
- **TUS Protocol:** Guaranteed delivery of large assets even over poor mobile connections.

## 3. Security & Row Level Security (RLS)

- All tables in the database are protected by RLS.
- Policies ensure that users can only **SEE** and **EDIT** assets where `user_id == auth.uid()`.
- GPS/EXIF metadata is stripped client-side before reaching the storage layer to ensure privacy.
