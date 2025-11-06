import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  reactStrictMode: false,
  output: "standalone",
  sassOptions: {
    includePaths: [path.join(__dirname, "src/assets/styles")],
    prependData: "@import '@/assets/styles/main.scss';",
  },
  // React Compiler 활성화 (비활성화)
  // experimental: {
  //   reactCompiler: true,
  // },
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

  // nginx가 API 프록시를 처리하므로 rewrites 제거
  // 개발 환경에서는 nginx가 /api 요청을 https://aistudio-dev.hell0world.net/api로 프록시
};

export default nextConfig;
