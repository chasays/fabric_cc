import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
//   testDir: './tests/e2e',
  timeout: 60000, 
  expect: { timeout: 30000 }, // Increased from 15000 to 30 seconds
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
    
  reporter: [
    ['html'],
    ['allure-playwright'],
    ['junit', { outputFile: 'reports/junit.xml' }]
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'https://parabank.parasoft.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    headless: false
  },

  projects: [
    {
      name: 'chromium',
      // use: { ...devices['Desktop Chrome'] },
      // avoid cloudflare bot verification, use local chrome, instead of chromium
      use: { ...devices['Desktop Chrome'],  channel: 'chrome' },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // todo add mobile divice
    // {
    //   name: 'api',
    //   testDir: './tests/api',
    // }
  ],
}); 