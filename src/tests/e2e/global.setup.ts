import { test as setup } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

function isStorageStateExists() {
  return fs.existsSync(
    path.resolve(
      import.meta.dirname!,
      '../../../playwright-storage-state.json',
    ),
  );
}

setup('accept cookie consent', async ({ page, baseURL }) => {
  setup.skip(
    Boolean(baseURL?.includes('127.0.0.1')) && isStorageStateExists(),
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
