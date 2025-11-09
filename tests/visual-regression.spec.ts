import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('landing page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot of the landing page
    await expect(page).toHaveScreenshot('landing-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('auth page screenshot - sign in', async ({ page }) => {
    await page.goto('/auth');
    await page.waitForTimeout(1000);

    // Take screenshot of auth page
    await expect(page).toHaveScreenshot('auth-signin.png', {
      animations: 'disabled',
    });
  });

  test('auth page screenshot - sign up', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: 'Sign Up' }).click();
    await page.waitForTimeout(500);

    // Take screenshot of sign up tab
    await expect(page).toHaveScreenshot('auth-signup.png', {
      animations: 'disabled',
    });
  });

  test('onboarding page screenshot', async ({ page }) => {
    await page.goto('/onboarding');
    await page.waitForTimeout(1000);

    // Take screenshot (may redirect if not authenticated)
    await expect(page).toHaveScreenshot('onboarding-or-redirect.png', {
      animations: 'disabled',
    });
  });

  test('progress page screenshot', async ({ page }) => {
    await page.goto('/progress');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('progress-page.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('scan page screenshot', async ({ page }) => {
    await page.goto('/scan');
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('scan-page.png', {
      animations: 'disabled',
    });
  });

  test('404 page screenshot', async ({ page }) => {
    await page.goto('/this-does-not-exist');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('404-page.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Responsive Design Tests', () => {
  test('landing page mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('landing-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('landing page tablet view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('landing-tablet.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });

  test('auth page mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/auth');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('auth-mobile.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Dark Mode (if implemented)', () => {
  test('landing page dark mode', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Try to toggle dark mode if button exists
    const darkModeToggle = page.locator('[aria-label*="dark" i], [aria-label*="theme" i]').first();
    if (await darkModeToggle.isVisible({ timeout: 1000 }).catch(() => false)) {
      await darkModeToggle.click();
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot('landing-dark.png', {
        fullPage: true,
        animations: 'disabled',
      });
    }
  });
});
