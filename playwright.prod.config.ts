import { defineConfig, devices } from "@playwright/test";

// Visual-state checks that need real hydration run against `next start` (after `npm run build`).
export default defineConfig({
  testDir: "./e2e",
  testMatch: "landing-visibility.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: { baseURL: "http://127.0.0.1:3100", trace: "on-first-retry" },
  webServer: { command: "npx next start -p 3100", url: "http://127.0.0.1:3100", reuseExistingServer: false, timeout: 60_000 },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
