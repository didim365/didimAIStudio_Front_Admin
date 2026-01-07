import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: false,
  // CI 환경에서는 standalone 빌드를 사용하지 않음 (next start와 호환성 문제)
  output: process.env.CI ? undefined : "standalone",
  sassOptions: {
    includePaths: [path.join(__dirname, "src/assets/styles")],
    prependData: "@import '@/assets/styles/main.scss';",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aistudio-dev.hell0world.net",
      },
      {
        protocol: "https",
        hostname: "aistudio.hell0world.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // 개발/배포 환경에서 이미지 최적화 비활성화 (외부 이미지 직접 로드)
    unoptimized: true,
  },

  // CORS 문제 해결을 위한 프록시 설정 추가
  async rewrites() {
    // CI 환경 또는 Playwright 테스트 환경에서는 실제 개발 서버로 프록시
    // Docker Compose 환경에서는 auth 컨테이너로 프록시
    const apiDestination = process.env.CI || process.env.PLAYWRIGHT_TEST
      ? "https://aistudio-dev-admin.didim365.com/api/:path*"
      : "http://auth:8000/api/:path*";

    return [
      {
        source: "/api/:path*",
        destination: apiDestination,
      },
    ];
  },
};

export default nextConfig;
