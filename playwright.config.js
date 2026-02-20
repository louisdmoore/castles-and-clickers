import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  retries: 1,
  use: {
    viewport: { width: 1280, height: 720 },
    trace: 'on-first-retry',
  },
  expect: {
    toHaveScreenshot: {
      // Canvas and animations cause non-deterministic pixels.
      // Allow up to 2% pixel diff to avoid false positives.
      maxDiffPixelRatio: 0.02,
      // Use CSS animations disabled to reduce flakiness
      animations: 'disabled',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: true,
  },
});
