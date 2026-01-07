import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 설정
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './src/test/e2e',

  // 테스트 실행 시간 제한
  timeout: 30 * 1000,

  // expect() 함수 타임아웃
  expect: {
    timeout: 5000
  },

  // 병렬 실행 설정
  fullyParallel: true,

  // CI 환경에서 재시도 설정
  retries: process.env.CI ? 2 : 0,

  // 워커 수 설정
  workers: process.env.CI ? 1 : undefined,

  // 리포터 설정
  reporter: process.env.CI
    ? [['list'], ['github']]
    : [['list']],

  use: {
    // 기본 URL (환경변수로 설정 가능, 로컬은 4000, CI는 3000)
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // 스크린샷 설정 (실패 시에만)
    screenshot: 'only-on-failure',

    // 비디오 녹화 설정 (실패 시에만)
    video: 'retain-on-failure',

    // 트레이스 설정 (실패 시에만)
    trace: 'on-first-retry',
  },

  // 테스트 프로젝트 설정 (브라우저별)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
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

  // 로컬 개발 서버 실행 설정
  // CI 환경에서만 자동으로 서버 시작
  // 로컬에서는 Docker compose 사용 (PLAYWRIGHT_BASE_URL=http://localhost:4000 설정)
  webServer: process.env.CI ? {
    command: 'PLAYWRIGHT_TEST=true npm run build && PLAYWRIGHT_TEST=true npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  } : undefined,
});
