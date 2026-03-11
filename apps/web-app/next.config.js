const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  // 개발 모드에서는 워커 캐싱 비활성화 (HMR 충돌 방지)
  disable: process.env.NODE_ENV === 'development', 
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 같은 네트워크의 모바일 기기에서 IP 접속 허용 (개발 시)
  allowedDevOrigins: [
    'https://localhost:3000',
    'https://127.0.0.1:3000',
    'https://192.168.102.38:3000',
    'https://192.168.103.38:3000',
    'http://192.168.102.38:3000',
    'http://192.168.103.38:3000',
    '192.168.102.*',
    '192.168.103.*',
    '192.168.0.*',
  ],
};

module.exports = withPWA(nextConfig);
