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

  // API 프록시는 src/app/api/[...path]/route.ts에서 처리
};

export default nextConfig;
