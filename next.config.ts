import { withSentryConfig } from "@sentry/nextjs";
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

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "woobin-kim",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  }
});
