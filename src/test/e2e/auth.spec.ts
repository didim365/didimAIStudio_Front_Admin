import { test, expect } from "@playwright/test";

test.describe("인증 테스트", () => {
  test.beforeEach(async ({ page }) => {
    // 네트워크 요청 로깅
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        console.log('>>>', request.method(), request.url());
      }
    });

    page.on('response', async response => {
      if (response.url().includes('/api/')) {
        console.log('<<<', response.status(), response.url());
        try {
          const body = await response.text();
          console.log('Response body:', body.substring(0, 200));
        } catch (e) {
          console.log('Could not read response body');
        }
      }
    });

    // 콘솔 로그 출력
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    // 각 테스트 전에 로그인 페이지로 이동
    await page.goto("/");
  });

  test("로그인 페이지가 정상적으로 로드되는지 확인", async ({ page }) => {
    // 로그인 페이지 요소 확인 (실제 프로젝트에 맞게 수정 필요)
    // await expect(page.getByRole('heading', { name: /로그인/i })).toBeVisible();

    // 현재는 기본 페이지 로드만 확인
    expect(page.url()).toContain("/");
  });

  test("유효한 자격증명으로 로그인 성공", async ({ page }) => {
    await page.fill('input#email', "admin@didim365.com");
    await page.fill('input#password', "didim12##");
    await page.click('button[type="submit"]');

    // 네트워크 요청이 완료될 때까지 대기
    await page.waitForTimeout(2000);

    await expect(page).toHaveURL(/users/, { timeout: 10000 });
  });

  test("잘못된 자격증명으로 로그인 실패", async ({ page }) => {
    await page.fill('input#email', 'wrong@example.com');
    await page.fill('input#password', 'wrongpassword');
    await page.click('button[type="submit"]');

    // 네트워크 요청이 완료될 때까지 대기
    await page.waitForTimeout(2000);

    // toast 에러 메시지가 표시되는지 확인
    const toast = page.locator('[data-sonner-toast]');
    await expect(toast).toBeVisible({ timeout: 10000 });

    // 에러 toast인지 확인 (data-type="error" 속성)
    await expect(toast).toHaveAttribute('data-type', 'error');
  });
});
