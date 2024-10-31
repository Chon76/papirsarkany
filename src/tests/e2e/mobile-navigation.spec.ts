import { devices, expect, test } from '@playwright/test';

const iphone13 = devices['iPhone 13'];

test('Mobile navigation', async ({ browser, browserName }) => {
  test.skip(browserName === 'firefox', 'isMoble is not supported in firefox');

  const context = await browser.newContext({
    ...iphone13,
  });
  const page = await context.newPage();

  await page.goto('/');

  const hamburgerMenuIcon = page.getByLabel('mobile navigation menu');
  const hamburgerMenuContent = page.getByTestId('hamburger-menu-content');
  
  await hamburgerMenuIcon.click();

  await hamburgerMenuContent.waitFor({ state: 'visible' });
  await expect(hamburgerMenuIcon).toBeFocused();
  await expect(hamburgerMenuContent).toBeVisible();

  await page.getByRole('link', { name: 'Anyagok' }).click();

  await page.waitForURL('**/anyagok');
  expect(page.url()).toContain('/anyagok');

  await expect(hamburgerMenuIcon).not.toBeFocused();
  await expect(hamburgerMenuContent).toBeHidden();
});
