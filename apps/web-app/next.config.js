/** @type {import('next').NextConfig} */
const nextConfig = {
  // 같은 네트워크의 모바일 기기에서 IP 접속 허용 (개발 시)
  allowedDevOrigins: [
    'https://192.168.102.38:3000',
    'http://192.168.102.38:3000',
    '192.168.102.*',
    '192.168.0.*',
  ],
};

module.exports = nextConfig;
