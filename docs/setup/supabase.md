# 백엔드 동기화: Supabase 통합 가이드

Supabase를 허브로 Cloudflare R2(파일 저장), PostgreSQL(메타데이터), Realtime(변경 구독), Auth(사용자 인증)를 연결하는 백엔드 동기화 아키텍처 설정 가이드입니다.

## 1. 아키텍처 개요

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
| **Supabase Auth** | 사용자 인증 및 JWT 발급 | Google, Kakao OAuth + Naver 직접 구현 |
| **PostgreSQL** | 에셋 메타데이터 중앙 저장 | `assets`, `folders`, `tags` 테이블 |
| **Supabase Realtime** | 클라이언트 간 변경 사항 구독 | 모바일 ↔ 데스크탑 즉시 동기화 |
| **Cloudflare R2** | 원본 이미지 및 썸네일 파일 저장 | S3 호환 API, Egress 무료 |

---

## 2. Supabase 프로젝트 설정

### 2.1 패키지 버전

```
@supabase/supabase-js@2.100.1  (@supabase/auth-js@2.100.1)
```

**Admin API 가용 메서드 (`supabase.auth.admin.*`)**

| 메서드 | 용도 |
|--------|------|
| `createUser(attributes)` | 신규 사용자 생성 |
| `updateUserById(uid, attributes)` | 기존 사용자 정보 업데이트 |
| `getUserById(uid)` | UID로 사용자 조회 |
| `listUsers(params)` | 사용자 목록 조회 (페이지네이션) |
| `deleteUser(id)` | 사용자 삭제 |
| `generateLink(params)` | magic link / 이메일 인증 링크 생성 |
| `inviteUserByEmail(email)` | 초대 이메일 발송 |

> ⚠️ `upsertUser()`는 공식 문서에 언급되더라도 실제 패키지에 존재하지 않습니다. 신규 생성은 `createUser`, 업데이트는 `updateUserById`를 조합해서 사용하세요.

### 2.2 환경변수 (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>       # sb_publishable_... 형식
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>    # sb_secret_... 형식 — 서버 전용

# Naver OAuth (Supabase 미지원 → 직접 구현)
NEXT_PUBLIC_NAVER_CLIENT_ID=<naver-client-id>        # 공개 가능 (OAuth URL에 포함됨)
NAVER_CLIENT_SECRET=<naver-client-secret>            # 서버 전용

# Cloudflare R2
R2_ACCOUNT_ID=<your-cloudflare-account-id>
R2_ACCESS_KEY_ID=<your-r2-access-key>
R2_SECRET_ACCESS_KEY=<your-r2-secret-key>
R2_BUCKET_NAME=nova-assets
R2_PUBLIC_URL=https://<your-r2-public-domain>
```

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY`, `NAVER_CLIENT_SECRET`는 서버 사이드(API Routes)에서만 사용합니다. `NEXT_PUBLIC_` 접두사를 붙이면 클라이언트에 노출되므로 절대 붙이지 마세요.

### 2.3 클라이언트 초기화 (`apps/web-app/src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## 3. Auth — 사용자 인증

### 3.1 인증 방식

| 방식 | 구현 방법 | 비고 |
| --- | --- | --- |
| **Google OAuth** | Supabase 네이티브 | `signInWithOAuth({ provider: 'google' })` |
| **Kakao OAuth** | Supabase 네이티브 | `account_email` scope 명시 필요 |
| **Naver OAuth** | 직접 구현 | Supabase 미지원, `/api/auth/naver/callback` 서버 라우트 처리 |
| **게스트** | localStorage mock | 실제 DB 미사용, 체험용 |

### 3.2 OAuth 프로바이더 설정

#### Google

1. [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 클라이언트 ID 생성
2. 승인된 리디렉션 URI: `https://<project-ref>.supabase.co/auth/v1/callback`
3. Supabase 대시보드 → Authentication → Providers → Google → Client ID / Secret 입력

#### Kakao

1. [Kakao Developers](https://developers.kakao.com) → 애플리케이션 추가 → REST API 키 확인
2. 카카오 로그인 → 활성화, Redirect URI: `https://<project-ref>.supabase.co/auth/v1/callback`
3. 카카오 로그인 → 동의항목: 닉네임, 프로필 사진, 이메일(선택 → 필수) 설정
4. Supabase 대시보드 → Authentication → Providers → Kakao → REST API 키 입력

#### Naver (직접 구현)

Supabase가 Naver를 공식 지원하지 않아 서버 라우트로 직접 구현합니다.

1. [Naver Developers](https://developers.naver.com) → 애플리케이션 등록
2. 사용 API: **네아로(네이버 아이디로 로그인)** 선택
3. 서비스 URL: `https://your-app.com`
4. Callback URL: `https://your-app.com/api/auth/naver/callback`
5. 발급된 Client ID → `.env.local`의 `NEXT_PUBLIC_NAVER_CLIENT_ID`
6. 발급된 Client Secret → `.env.local`의 `NAVER_CLIENT_SECRET`

**Naver OAuth 플로우 (`apps/web-app/src/app/api/auth/naver/callback/route.ts`):**

```
[브라우저]
  1. 네이버 버튼 클릭
     → https://nid.naver.com/oauth2.0/authorize?client_id=...&redirect_uri=.../api/auth/naver/callback
  2. 네이버 로그인 동의

[Naver → /api/auth/naver/callback?code=...&state=...]
  3. 네이버 액세스 토큰 교환 (NAVER_CLIENT_SECRET 사용, 서버 전용)
  4. 네이버 사용자 프로필 조회 (email, name, profile_image)
  5. admin.createUser() 로 생성 시도 → 이미 존재하면 listUsers()로 조회 후 updateUserById() 업데이트
  6. admin.generateLink({ type: 'magiclink' }) 로 세션 발급용 일회성 URL 생성
     ※ admin API는 이메일을 발송하지 않음 — 링크만 반환
  7. 브라우저를 action_link 로 리다이렉트 → Supabase가 세션 쿠키 발급

[브라우저]
  8. /library 로 최종 이동
```

### 3.3 콜백 처리

- **Google / Kakao:** `/auth/callback` 페이지에서 `supabase.auth.exchangeCodeForSession(code)` 호출
- **Naver:** `/api/auth/naver/callback` 서버 라우트에서 전체 처리 후 magic link로 세션 발급

### 3.4 RLS (Row Level Security) 기본 정책

```sql
-- assets 테이블 RLS 예시
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own assets"
ON assets FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

---

## 4. PostgreSQL — 메타데이터 스키마

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
  is_smart_folder BOOLEAN DEFAULT false,
  rule            JSONB,
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

### 5.1 Supabase 대시보드 설정

`Database` → `Replication` → `assets` 테이블에 대해 **INSERT, UPDATE, DELETE** 이벤트 활성화.

### 5.2 구독 코드

```typescript
const channel = supabase
  .channel('assets-sync')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'assets', filter: `user_id=eq.${userId}` },
    (payload) => { /* UI 상태 업데이트 */ }
  )
  .subscribe()

return () => { supabase.removeChannel(channel) }
```

---

## 6. Cloudflare R2 — 파일 저장

Supabase Storage 대신 R2를 사용하는 이유: **Egress(다운로드) 비용이 무료**이며 대용량 이미지 서빙에 최적화되어 있습니다.

### 6.1 업로드 플로우

```text
[Client]
  1. Web Worker가 EXIF 제거 + 썸네일 생성
  2. Supabase Edge Function에 Presigned URL 요청
[Supabase Edge Function]
  3. R2 Presigned PUT URL 생성 후 클라이언트에 반환
[Client → Cloudflare R2]
  4. Presigned URL로 직접 R2에 업로드 (서버 거치지 않음)
[DB Trigger]
  5. 업로드 완료 후 PostgreSQL assets 테이블에 메타데이터 INSERT
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
  return new Response(JSON.stringify({ url }), { headers: { 'Content-Type': 'application/json' } })
})
```

---

## 7. 관련 문서

- [프로젝트 구조](structure.md)
- [개발 명령어](commands.md)
- [백엔드 아키텍처](../architecture/backend.md)
- [통합 개발 계획](../DEVELOPMENT_PLAN.md)
