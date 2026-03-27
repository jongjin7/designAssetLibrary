import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error || 'naver_auth_failed')}`
    );
  }

  // state 쿠키 검증 (CSRF 방어)
  const cookieState = request.cookies.get('naver_oauth_state')?.value;
  if (!state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(`${origin}/login?error=invalid_state`);
  }

  // 1. 네이버 액세스 토큰 교환 (POST — client_secret을 URL에 노출하지 않음)
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    code,
    state,
  });

  const tokenRes = await fetch('https://nid.naver.com/oauth2.0/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams,
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/login?error=naver_token_failed`);
  }

  const { access_token } = await tokenRes.json();

  // 2. 네이버 사용자 정보 조회
  const profileRes = await fetch('https://openapi.naver.com/v1/nid/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!profileRes.ok) {
    return NextResponse.redirect(`${origin}/login?error=naver_profile_failed`);
  }

  const { response: naverProfile } = await profileRes.json();
  const email: string = naverProfile.email;

  if (!email) {
    return NextResponse.redirect(`${origin}/login?error=naver_no_email`);
  }

  // 3. Supabase admin으로 사용자 upsert (createUser 후 존재하면 updateUserById)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const userMeta = {
    full_name: naverProfile.name,
    avatar_url: naverProfile.profile_image,
    provider: 'naver',
    naver_id: naverProfile.id,
  };

  // createUser 시도 → 이미 존재하면 updateUserById로 메타데이터 업데이트
  const { error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: userMeta,
  });

  if (createError) {
    if (!createError.message.includes('already been registered')) {
      return NextResponse.redirect(`${origin}/login?error=user_upsert_failed`);
    }
    // 페이지네이션으로 전체 유저 탐색
    let existing = null;
    let page = 1;
    while (!existing) {
      const { data: pageData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (listError) return NextResponse.redirect(`${origin}/login?error=user_upsert_failed`);
      existing = pageData.users.find(u => u.email === email) ?? null;
      if (pageData.users.length < 1000) break;
      page++;
    }
    if (existing) {
      await supabaseAdmin.auth.admin.updateUserById(existing.id, { user_metadata: userMeta });
    }
  }

  // 4. Supabase 세션 발급: generateLink는 이메일을 발송하지 않음
  //    admin API는 링크만 반환하며, 브라우저를 이 URL로 리다이렉트하면
  //    Supabase가 세션 쿠키를 발급해 줌 (사용자는 이메일을 받지 않음)
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (linkError || !linkData?.properties?.action_link) {
    return NextResponse.redirect(`${origin}/login?error=signin_link_failed`);
  }

  const res = NextResponse.redirect(linkData.properties.action_link);
  res.cookies.delete('naver_oauth_state');
  return res;
}
