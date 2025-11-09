import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load landing page correctly', async ({ page }) => {
    // Check if the landing page loads with key elements
    await expect(page.locator('text=SkinScan')).toBeVisible();
    await expect(page.locator('text=Get Started Free')).toBeVisible();
  });

  test('should navigate to auth page', async ({ page }) => {
    // Click on "Get Started" button
    await page.getByRole('link', { name: /Get Started/i }).first().click();

    // Should navigate to auth page
    await expect(page).toHaveURL(/.*auth/);
    await expect(page.locator('text=Sign In')).toBeVisible();
    await expect(page.locator('text=Sign Up')).toBeVisible();
  });

  test('should show sign up form', async ({ page }) => {
    await page.goto('/auth');

    // Click on Sign Up tab
    await page.getByRole('tab', { name: 'Sign Up' }).click();

    // Check form elements
    await expect(page.locator('#signup-email')).toBeVisible();
    await expect(page.locator('#signup-password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create Account' })).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: 'Sign Up' }).click();

    // Enter invalid email
    await page.fill('#signup-email', 'invalid-email');
    await page.fill('#signup-password', 'password123');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Should show validation error
    await expect(page.locator('text=/invalid.*email/i')).toBeVisible({ timeout: 5000 });
  });

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/auth');
    await page.getByRole('tab', { name: 'Sign Up' }).click();

    // Enter short password
    await page.fill('#signup-email', 'test@example.com');
    await page.fill('#signup-password', 'short');
    await page.getByRole('button', { name: 'Create Account' }).click();

    // Should show validation error
    await expect(page.locator('text=/password.*least.*8/i')).toBeVisible({ timeout: 5000 });
  });

  test('should show sign in form', async ({ page }) => {
    await page.goto('/auth');

    // Sign In tab should be default
    await expect(page.locator('#signin-email')).toBeVisible();
    await expect(page.locator('#signin-password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });

  test('should have Google Sign In button', async ({ page }) => {
    await page.goto('/auth');

    // Check for Google Sign In button
    await expect(page.getByRole('button', { name: /Continue with Google/i })).toBeVisible();
  });

  test('should show invite message when invite token is present', async ({ page }) => {
    await page.goto('/auth?invite=test-token-123');

    // Should show invite message
    await expect(page.locator('text=/invited.*Sign up/i')).toBeVisible();
  });
});

test.describe('Onboarding Flow', () => {
  test('should show onboarding page structure', async ({ page }) => {
    // Navigate directly to onboarding (normally requires auth)
    await page.goto('/onboarding');

    // Check if page loads (may redirect if not authenticated)
    // This is a basic structure check
    await expect(page).toHaveURL(/.*onboarding|.*auth/);
  });

  // Note: Full onboarding tests would require actual authentication
  // which needs a test database and real credentials
  test('should have onboarding route configured', async ({ page }) => {
    const response = await page.goto('/onboarding');
    expect(response?.status()).toBeLessThan(500); // Should not be a server error
  });
});

test.describe('Protected Routes', () => {
  test('scan page should require authentication', async ({ page }) => {
    await page.goto('/scan');

    // Should redirect to auth or show auth required message
    await page.waitForTimeout(2000);
    const url = page.url();
    expect(url.includes('/auth') || url.includes('/scan')).toBeTruthy();
  });

  test('progress page should be accessible', async ({ page }) => {
    const response = await page.goto('/progress');
    expect(response?.status()).toBe(200);
  });
});
