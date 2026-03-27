# 백엔드 아키텍처: NOVA (Backend Architecture: NOVA)

Supabase를 기반으로 한 고성능 데이터 파이프라인, TUS 프로토콜을 이용한 안정적인 업로드, 그리고 Edge Functions와 TensorFlow.js를 활용한 AI 분류 시스템 등 백엔드 구조를 설명합니다.

The NOVA platform uses **Supabase** as its core backend service with a focus on high-performance data pipelines and AI classification.

## 1. Stack Components

- **Supabase Database:** PostgreSQL with JSONB and similarity search support.
- **Supabase Storage:** S3-compatible storage with **TUS Protocol** Support for resumable uploads.
- **Supabase Auth:** Email/Social login with Row-Level Security (RLS).
- **Supabase Edge Functions:** Serverless logic hosting **TensorFlow.js** for server-side AI refinement and consistency. (Primary extraction is performed client-side for immediate feedback).
- **Supabase Realtime:** Instant state broadcasting to all connected clients.

## 2. High-Performance Sync Pipeline

### 2.1 Perceptual Hashing (phash)

- **Goal:** Enable "0.2s search" and similarity-based discovery.
- **Execution:** Primarily generated client-side for instant feedback; can be cross-verified via Edge Functions or TensorFlow.js on the server to ensure consistency.

### 2.2 AI Engine

- **TensorFlow.js:** Used in the frontend for immediate color extraction and object detection. Also available in Supabase Edge Functions for sophisticated server-side refinement and 5 core color validation.
- **TUS Protocol:** Guaranteed delivery of large assets even over poor mobile connections.

## 3. Security & Row Level Security (RLS)

- All tables in the database are protected by RLS.
- Policies ensure that users can only **SEE** and **EDIT** assets where `user_id == auth.uid()`.
- GPS/EXIF metadata is stripped client-side before reaching the storage layer to ensure privacy.

---

## 4. 인증 플로우 (Authentication Flow)

Supabase Auth를 중심으로 로그인부터 RLS 보호 API 호출까지의 전체 인증 흐름을 설명합니다. JWT를 기반으로 클라이언트와 서버가 무상태(Stateless)로 인증 상태를 공유합니다.

### 4.1 전체 플로우

```text
[Client]
  │
  │ 1. 로그인 요청 (Google OAuth / Magic Link)
  ▼
[Supabase Auth]
  │ 2. 사용자 검증 후 Access Token (JWT) + Refresh Token 발급
  │    Access Token 유효기간: 1시간 (기본값)
  ▼
[Client — localStorage / Cookie에 토큰 저장]
  │
  │ 3. API 요청 시 Authorization 헤더에 JWT 첨부
  │    Authorization: Bearer <access_token>
  ▼
[Supabase PostgREST / Edge Functions]
  │ 4. JWT 서명 검증 → auth.uid() 추출
  │ 5. RLS 정책으로 user_id == auth.uid() 행만 접근 허용
  ▼
[PostgreSQL — RLS 통과된 데이터만 반환]
```

### 4.2 토큰 자동 갱신 (`packages/shared/src/supabase.ts`)

`@supabase/ssr` 클라이언트는 Access Token 만료 전 자동으로 Refresh Token을 사용해 토큰을 갱신합니다.

```typescript
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    // 토큰 자동 갱신 및 세션 지속: 기본적으로 활성화
  )
```

### 4.3 인증 상태 구독 (`apps/web-app`)

인증 상태 변경(로그인 / 로그아웃 / 토큰 갱신)을 실시간으로 감지해 UI에 반영합니다.

```typescript
import { createClient } from '@nova/shared'

const supabase = createClient()

// 인증 상태 변경 구독
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    if (event === 'SIGNED_IN') {
      // 로그인 완료 → 대시보드로 이동
      router.push('/dashboard')
    }
    if (event === 'SIGNED_OUT') {
      // 로그아웃 → 로그인 페이지로 이동
      router.push('/login')
    }
    if (event === 'TOKEN_REFRESHED') {
      // 토큰 자동 갱신 완료 (자동 처리)
      console.log('Token refreshed:', session?.access_token)
    }
  }
)

// 컴포넌트 언마운트 시 구독 해제
return () => subscription.unsubscribe()
```

### 4.4 로그인 방식별 구현

#### Google / Kakao OAuth (Supabase 네이티브)

```typescript
// Kakao는 이메일 수집을 위해 scope 명시 필요
const scopes: Partial<Record<'google' | 'kakao', string>> = {
  kakao: 'profile_nickname profile_image account_email',
};

await supabase.auth.signInWithOAuth({
  provider, // 'google' | 'kakao'
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
    scopes: scopes[provider],
  },
})
```

콜백: `/auth/callback` 페이지에서 `supabase.auth.exchangeCodeForSession(code)` 호출.

#### Naver OAuth (직접 구현 — Supabase 미지원)

```
[Client] 네이버 버튼 클릭
  → https://nid.naver.com/oauth2.0/authorize?client_id=NEXT_PUBLIC_NAVER_CLIENT_ID&...
[Naver] 동의 후 /api/auth/naver/callback?code=...&state=... 리다이렉트
[Server Route]
  1. 네이버 액세스 토큰 교환 (NAVER_CLIENT_SECRET 사용, 서버 전용)
  2. 네이버 프로필 API로 email, name, profile_image 조회
  3. admin.createUser() 로 생성 시도 → 이미 존재하면 listUsers()로 조회 후 updateUserById() 업데이트
     ※ upsertUser()는 실제 패키지에 존재하지 않음 — createUser + updateUserById 조합 사용
  4. admin.generateLink({ type: 'magiclink' }) 로 세션 발급용 일회성 URL 생성
     ※ admin API는 이메일을 발송하지 않음 — 사용자 이메일 수신 없음
  5. action_link 로 리다이렉트 → Supabase가 세션 쿠키 발급 → /library 이동
```

#### Magic Link (이메일)

```typescript
await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

### 4.5 보호된 라우트 미들웨어 (`apps/web-app/middleware.ts`)

Next.js Middleware에서 JWT를 검증해 인증되지 않은 접근을 차단합니다.

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie helpers */ } }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // 인증되지 않은 사용자는 로그인 페이지로 리디렉션
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
```

### 4.6 인증 방식 요약

| 방식 | 사용 시나리오 | 비고 |
| --- | --- | --- |
| **Google OAuth** | 일반 사용자 로그인 | Supabase 대시보드 → Providers에서 활성화 |
| **Kakao OAuth** | 카카오 사용자 로그인 | Supabase 네이티브 지원, `account_email` scope 필수 |
| **Naver OAuth** | 네이버 사용자 로그인 | Supabase 미지원 → `/api/auth/naver/callback` 직접 구현 |
| **Magic Link** | 이메일 기반 패스워드리스 | 별도 설정 불필요 (기본 활성화) |
| **게스트** | 비로그인 체험 | localStorage 기반 mock 세션, 실제 DB 미사용 |
| **JWT (Access Token)** | 모든 API 요청 인증 | 유효기간 1시간, 자동 갱신 |
| **RLS** | DB 행 수준 접근 제어 | `auth.uid() = user_id` 정책 |
