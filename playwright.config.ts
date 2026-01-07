import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright 설정 (로컬 개발 환경 전용)
 *
 * E2E 테스트는 로컬에서만 실행됩니다.
 * CI 환경에서는 백엔드 API 서버 접근 불가로 인해 비활성화되어 있습니다.
 *
 * 로컬 테스트 실행 방법:
 * 1. Docker Compose로 백엔드 서버 실행: docker-compose up -d
 * 2. E2E 테스트 실행: npm run test:e2e
 *
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./src/test/e2e",

  // 테스트 실행 시간 제한
  timeout: 30 * 1000,

  // expect() 함수 타임아웃
  expect: {
    timeout: 5000,
  },

  // 병렬 실행 설정
  fullyParallel: true,

  // 재시도 설정 (로컬에서는 재시도 없음)
  retries: 0,

  // 워커 수 설정 (기본값 사용)
  workers: undefined,

  // 리포터 설정
  reporter: [["list"]],

  use: {
    // 로컬 개발 서버 URL (Docker Compose 환경)
    baseURL: "http://localhost:3000",

    // 스크린샷 설정 (실패 시에만)
    screenshot: "only-on-failure",

    // 비디오 녹화 설정 (실패 시에만)
    video: "retain-on-failure",

    // 트레이스 설정 (실패 시에만)
    trace: "on-first-retry",
  },

  // 테스트 프로젝트 설정 (브라우저별)
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // 필요시 다른 브라우저 추가
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    // 모바일 뷰포트 테스트
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],

  // 로컬 환경에서는 Docker Compose로 서버를 수동 실행해야 함
  // webServer 설정 없음 (자동 서버 시작 안 함)
});
