import { test as setup } from '@playwright/test';

setup('bypass cookie consent', async ({ page, baseURL }) => {
  setup.skip(
    Boolean(baseURL?.includes('127.0.0.1')),
    'Skipping cookie consent in local environment',
  );

  await page.goto('/');

  await page.waitForLoadState('networkidle');

  await page.evaluate(() => {
    if (window.Truendo) {
      window.Truendo.acceptAllCookies();
    }
  });

  await page.context().storageState({ path: 'playwright-storage-state.json' });
});
