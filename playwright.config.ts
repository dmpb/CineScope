import { defineConfig, devices } from "@playwright/test";

const useSystemChromium = process.env.USE_SYSTEM_CHROMIUM === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  timeout: 60000,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    timeout: 180000,
    reuseExistingServer: !process.env.CI,
    env: {
      TMDB_MOCK_MODE: "1",
      TMDB_BEARER_TOKEN: "mock-token-for-e2e"
    }
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: useSystemChromium
          ? {
              executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? "/usr/bin/chromium-browser"
            }
          : undefined
      }
    }
  ]
});
