import { test, expect } from '@playwright/test';

test.describe('기본 페이지 로드 테스트', () => {
  test('홈페이지가 정상적으로 로드되는지 확인', async ({ page }) => {
    // 홈페이지로 이동
    await page.goto('/');

    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/Admin/i);
  });

  test('페이지가 응답하는지 확인', async ({ page }) => {
    const response = await page.goto('/');

    // HTTP 상태 코드가 200인지 확인
    expect(response?.status()).toBe(200);
  });
});

test.describe('네비게이션 테스트', () => {
  test('페이지 간 이동이 정상적으로 작동하는지 확인', async ({ page }) => {
    await page.goto('/');

    // 네비게이션 링크 클릭 (실제 프로젝트의 링크로 수정 필요)
    // 예: await page.click('text=대시보드');

    // URL이 변경되었는지 확인
    // await expect(page).toHaveURL(/dashboard/);
  });
});
