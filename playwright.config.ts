import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  // Tests of one file share the customer account (and its cart), so they run one after another.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  // The demo store is a shared public stand: now and then a request hangs for 20-30 seconds.
  retries: 2,
  timeout: 180_000,
  expect: { timeout: 40_000 },
  reporter: [['list'], ['html', { open: 'never' }], ['allure-playwright', { resultsDir: 'allure-results' }]],
  use: {
    baseURL: env.baseUrl,
    ignoreHTTPSErrors: true,
    actionTimeout: 40_000,
    navigationTimeout: 60_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
