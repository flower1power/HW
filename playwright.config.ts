import { defineConfig, devices, Project } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const browser = process.env.BROWSER;

const projects: Project[] = [
  {
    name: 'chrome',
    use: {
      ...devices['Desktop Chrome'],
      headless: false,
      viewport: { width: 1920, height: 1080 },
      bypassCSP: true,
      contextOptions: {
        ignoreHTTPSErrors: true,
      },
      screenshot: 'only-on-failure',
      trace: 'retain-on-failure',
      video: 'retain-on-failure',
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      launchOptions: {
        args: ['--disable-blink-features=AutomationControlled'],
      },
    },
  },
];

function getProjects(): Project[] {
  return browser ? projects.filter((project) => project.name === browser) : projects;
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    locale: 'en-US',
    trace: 'on-first-retry',
  },

  projects: getProjects(),
});
