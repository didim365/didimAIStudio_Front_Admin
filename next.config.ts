import type { NextConfig } from "next";
const path = require("path");

const nextConfig: NextConfig = {
<<<<<<< HEAD
  experimental: {
    reactCompiler: true,
=======
  reactStrictMode: false,
  output: "standalone",
  distDir: "nextjs-build",
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

  // CORS 문제 해결을 위한 프록시 설정 추가
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://auth:8000/api/:path*",
      },
    ];
>>>>>>> c4ad53d0f292fbd087929664e40ccff692fcc572
  },
};

export default nextConfig;
