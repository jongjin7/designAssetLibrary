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

  // 1. 네이버 액세스 토큰 교환
  const tokenParams = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: process.env.NAVER_CLIENT_ID!,
    client_secret: process.env.NAVER_CLIENT_SECRET!,
    code,
    state: state || '',
  });

  const tokenRes = await fetch(
    `https://nid.naver.com/oauth2.0/token?${tokenParams}`,
    { method: 'GET', headers: { 'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID! } }
  );

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

  // 3. Supabase admin으로 사용자 upsert
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error: upsertError } = await supabaseAdmin.auth.admin.upsertUser({
    email,
    email_confirm: true,
    user_metadata: {
      full_name: naverProfile.name,
      avatar_url: naverProfile.profile_image,
      provider: 'naver',
      naver_id: naverProfile.id,
    },
  });

  if (upsertError) {
    return NextResponse.redirect(`${origin}/login?error=user_upsert_failed`);
  }

  // 4. 자동 로그인용 magic link 생성 후 리다이렉트
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo: `${origin}/library` },
  });

  if (linkError || !linkData?.properties?.action_link) {
    return NextResponse.redirect(`${origin}/login?error=signin_link_failed`);
  }

  return NextResponse.redirect(linkData.properties.action_link);
}
