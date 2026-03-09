# 백엔드 동기화: Supabase 통합 가이드 (Backend Sync: Supabase Integration Guide)

Supabase를 허브로 Cloudflare R2(파일 저장), PostgreSQL(메타데이터), Realtime(변경 구독), Auth(사용자 인증)를 연결하는 백엔드 동기화 아키텍처 설정 가이드입니다. 각 서비스의 역할 분리와 환경변수 설정부터 실제 코드 예시까지 포함합니다.

## 1. 아키텍처 개요 (Architecture Overview)

NOVA의 백엔드는 Supabase를 허브로 각 서비스가 분리된 역할을 담당합니다.

```text
[Client (PWA / Electron / Extension)]
        │
        ▼
┌───────────────────────────────────────────┐
│                  Supabase                 │
│                                           │
│  ┌──────────┐  ┌──────────────────────┐  │
│  │   Auth   │  │  PostgreSQL (메타DB)  │  │
│  │ (JWT 발급) │  │ assets, folders, tags│  │
│  └──────────┘  └──────────────────────┘  │
│        │                │                 │
│        │       ┌────────────────┐         │
│        └──────▶│   Realtime     │         │
│                │ (변경 구독 채널) │         │
│                └────────────────┘         │
└───────────────────────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│       Cloudflare R2           │
│  (원본 이미지 / 썸네일 파일 저장) │
└───────────────────────────────┘
```

| 서비스 | 역할 | 비고 |
| --- | --- | --- |
| **Supabase Auth** | 사용자 인증 및 JWT 발급 | OAuth (Google) + Magic Link 지원 |
| **PostgreSQL** | 에셋 메타데이터 중앙 저장 | `assets`, `folders`, `tags` 테이블 |
| **Supabase Realtime** | 클라이언트 간 변경 사항 구독 | 모바일 ↔ 데스크탑 즉시 동기화 |
| **Cloudflare R2** | 원본 이미지 및 썸네일 파일 저장 | S3 호환 API, Egress 무료 |

---

## 2. Supabase 프로젝트 설정

### 2.1 환경변수 (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>  # 서버 전용

# Cloudflare R2
R2_ACCOUNT_ID=<your-cloudflare-account-id>
R2_ACCESS_KEY_ID=<your-r2-access-key>
R2_SECRET_ACCESS_KEY=<your-r2-secret-key>
R2_BUCKET_NAME=nova-assets
R2_PUBLIC_URL=https://<your-r2-public-domain>
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드(Edge Functions, API Routes)에서만 사용하고, 클라이언트에 절대 노출하지 않습니다.

### 2.2 클라이언트 초기화 (`packages/shared/src/supabase.ts`)

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

---

## 3. Auth — 사용자 인증

### 3.1 인증 방식

- **OAuth:** Google 로그인 (Supabase 대시보드 → Authentication → Providers → Google)
- **Magic Link:** 이메일 기반 패스워드리스 로그인

### 3.2 RLS (Row Level Security) 기본 정책

모든 테이블에 RLS를 활성화하고, 인증된 사용자만 자신의 데이터에 접근합니다.

```sql
-- assets 테이블 RLS 예시
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own assets"
ON assets
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## 4. PostgreSQL — 메타데이터 스키마

Sprint 1 & 2 통합 스키마입니다. 계층형 폴더 구조와 AI 분석 결과를 포함합니다.

```sql
-- 에셋 테이블
CREATE TABLE assets (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  folder_id   UUID REFERENCES folders(id),
  file_name   TEXT NOT NULL,
  r2_key      TEXT NOT NULL UNIQUE,       -- Cloudflare R2 오브젝트 키
  sha256      TEXT NOT NULL UNIQUE,       -- 중복 방지용 파일 해시
  phash       TEXT,                       -- 유사 이미지 검색용 해시
  palette     JSONB,                      -- AI 추출 주조색 (최대 5종)
  tags        TEXT[] DEFAULT '{}',        -- AI 자동 태깅
  mime_type   TEXT,
  size_bytes  BIGINT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- 폴더 테이블 (무제한 트리 구조)
CREATE TABLE folders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id       UUID REFERENCES folders(id),  -- NULL이면 루트 폴더
  name            TEXT NOT NULL,
  is_smart_folder BOOLEAN DEFAULT false,         -- AI 기반 자동 분류 폴더
  rule            JSONB,                         -- 스마트 폴더 규칙
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- 태그 테이블 (다대다 관계)
CREATE TABLE tags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  UNIQUE (user_id, name)
);

CREATE TABLE asset_tags (
  asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
  tag_id   UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (asset_id, tag_id)
);
```

---

## 5. Realtime — 변경 구독

모바일에서 업로드 시 데스크탑 대시보드가 즉시 갱신되는 동기화 플로우입니다.

### 5.1 Supabase 대시보드 설정

`Database` → `Replication` → `assets` 테이블에 대해 **INSERT, UPDATE, DELETE** 이벤트 활성화.

### 5.2 구독 코드 (`apps/web-app`)

```typescript
import { createClient } from '@nova/shared'

const supabase = createClient()

const channel = supabase
  .channel('assets-sync')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'assets',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Asset changed:', payload)
      // UI 상태 업데이트 로직
    }
  )
  .subscribe()

// 컴포넌트 언마운트 시 구독 해제
return () => { supabase.removeChannel(channel) }
```

---

## 6. Cloudflare R2 — 파일 저장

Supabase Storage 대신 R2를 사용하는 이유: **Egress(다운로드) 비용이 무료**이며 대용량 이미지 서빙에 최적화되어 있습니다.

### 6.1 업로드 플로우

```text
[Client]
  │ 1. 클라이언트에서 Web Worker가 EXIF 제거 + 썸네일 생성
  │ 2. Supabase Edge Function에 서명된 업로드 URL 요청
  ▼
[Supabase Edge Function]
  │ 3. R2 Presigned PUT URL 생성 후 클라이언트에 반환
  ▼
[Cloudflare R2]
  │ 4. 클라이언트가 Presigned URL로 직접 R2에 업로드 (서버 거치지 않음)
  ▼
[Supabase Edge Function / DB Trigger]
    5. 업로드 완료 후 PostgreSQL `assets` 테이블에 메타데이터 INSERT
```

### 6.2 R2 Presigned URL 발급 (Edge Function)

```typescript
// supabase/functions/get-upload-url/index.ts
import { S3Client, PutObjectCommand } from 'npm:@aws-sdk/client-s3'
import { getSignedUrl } from 'npm:@aws-sdk/s3-request-presigner'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${Deno.env.get('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: Deno.env.get('R2_ACCESS_KEY_ID')!,
    secretAccessKey: Deno.env.get('R2_SECRET_ACCESS_KEY')!,
  },
})

Deno.serve(async (req) => {
  const { key, contentType } = await req.json()

  const url = await getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: Deno.env.get('R2_BUCKET_NAME'), Key: key, ContentType: contentType }),
    { expiresIn: 300 } // 5분 유효
  )

  return new Response(JSON.stringify({ url }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

## 7. 관련 문서

- [프로젝트 구조](file:///Volumes/macData/designAssetLibrary/docs/setup/structure.md)
- [개발 명령어](file:///Volumes/macData/designAssetLibrary/docs/setup/commands.md)
- [통합 개발 계획](file:///Volumes/macData/designAssetLibrary/docs/DEVELOPMENT_PLAN.md)
