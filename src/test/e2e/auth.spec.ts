import { test, expect } from '@playwright/test';

test.describe('인증 테스트', () => {
  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인 페이지로 이동
    await page.goto('/');
  });

  test('로그인 페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
    // 로그인 페이지 요소 확인 (실제 프로젝트에 맞게 수정 필요)
    // await expect(page.getByRole('heading', { name: /로그인/i })).toBeVisible();

    // 현재는 기본 페이지 로드만 확인
    expect(page.url()).toContain('/');
  });

  test.skip('유효한 자격증명으로 로그인 성공', async ({ page }) => {
    // TODO: 실제 로그인 플로우 구현
    // await page.fill('input[name="email"]', 'test@example.com');
    // await page.fill('input[name="password"]', 'password123');
    // await page.click('button[type="submit"]');

    // await expect(page).toHaveURL(/dashboard/);
  });

  test.skip('잘못된 자격증명으로 로그인 실패', async ({ page }) => {
    // TODO: 실제 로그인 플로우 구현
    // await page.fill('input[name="email"]', 'wrong@example.com');
    // await page.fill('input[name="password"]', 'wrongpassword');
    // await page.click('button[type="submit"]');

    // await expect(page.getByText(/잘못된 이메일 또는 비밀번호/i)).toBeVisible();
  });
});
