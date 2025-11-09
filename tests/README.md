# SkinScan E2E Tests

Comprehensive end-to-end testing suite using Playwright for the SkinScan application.

## 📁 Test Structure

```
tests/
├── auth.spec.ts              # Authentication & onboarding tests
├── scan.spec.ts              # Scan flow and navigation tests
├── payment.spec.ts           # Premium features & Stripe integration tests
├── visual-regression.spec.ts # Visual regression and responsive design tests
└── README.md                 # This file
```

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### Interactive UI Mode
```bash
npm run test:ui
```

### Headed Mode (See browser)
```bash
npm run test:headed
```

### Debug Mode
```bash
npm run test:debug
```

### View Last Report
```bash
npm run test:report
```

### Specific Test File
```bash
npx playwright test auth.spec.ts
```

### Specific Test
```bash
npx playwright test -g "should load landing page"
```

## 📝 Test Coverage

### Authentication Tests (`auth.spec.ts`)
- ✅ Landing page loads correctly
- ✅ Navigation to auth page
- ✅ Sign up form validation
- ✅ Sign in form validation
- ✅ Google OAuth button presence
- ✅ Invite token handling
- ✅ Onboarding route configuration

### Scan Flow Tests (`scan.spec.ts`)
- ✅ Scan page structure
- ✅ Results page routing
- ✅ Analysis page routing
- ✅ Routine page routing
- ✅ Progress page loads
- ✅ Navigation flows
- ✅ Camera permissions
- ✅ Error handling (404, invalid IDs)

### Payment Tests (`payment.spec.ts`)
- ✅ Premium upsell UI
- ✅ Upgrade modal presence
- ✅ Pricing display
- ✅ Rate limit upgrade flow
- ✅ Success/cancel redirects
- ✅ Paywall features
- ✅ Referral system

### Visual Regression Tests (`visual-regression.spec.ts`)
- ✅ Landing page screenshots
- ✅ Auth page (sign in/sign up)
- ✅ Onboarding page
- ✅ Progress page
- ✅ Scan page
- ✅ 404 page
- ✅ Mobile responsive (375px)
- ✅ Tablet responsive (768px)
- ✅ Dark mode (if available)

## 🔧 Configuration

Tests are configured in `playwright.config.ts`:

- **Browser**: Chromium (default)
- **Base URL**: http://localhost:5173
- **Retries**: 2 on CI, 0 locally
- **Workers**: 1 on CI, parallel locally
- **Reporters**: HTML + List
- **Screenshots**: On failure
- **Videos**: On first retry
- **Traces**: On first retry

## 🌐 CI/CD Integration

Tests run automatically on:
- Push to `main`, `develop`, or `claude/**` branches
- Pull requests to `main` or `develop`

GitHub Actions workflows:
- `.github/workflows/ci.yml` - Full CI pipeline
- `.github/workflows/playwright.yml` - Visual regression tests

## 📊 Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```

Reports include:
- Test results with status
- Screenshots on failure
- Video recordings
- Execution traces
- Performance metrics

## 🐛 Debugging Tests

### Debug Specific Test
```bash
npx playwright test auth.spec.ts --debug
```

### Show Trace Viewer
```bash
npx playwright show-trace trace.zip
```

### Generate Trace
```bash
npx playwright test --trace on
```

## ⚠️ Known Limitations

These tests check **UI structure and routing** without full authentication:

1. **Authentication Required**: Some flows require actual user login
   - Full onboarding completion
   - Scan capture and analysis
   - Premium feature access

2. **External Services**: Tests don't hit real services
   - Supabase Auth (mocked in tests)
   - Stripe Checkout (UI only)
   - n8n AI webhook

3. **Visual Tests**: First run generates baseline screenshots
   - Subsequent runs compare against baselines
   - Update baselines: `npx playwright test --update-snapshots`

## 🔐 Testing with Authentication

To test authenticated flows, you need:

1. **Test Database**: Separate Supabase project
2. **Test User**: Pre-created test account
3. **Environment Variables**:
   ```bash
   VITE_SUPABASE_URL=https://test-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_test_key
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=testpassword123
   ```

Example authenticated test:
```typescript
test('authenticated scan flow', async ({ page }) => {
  // Login
  await page.goto('/auth');
  await page.fill('#signin-email', process.env.TEST_USER_EMAIL);
  await page.fill('#signin-password', process.env.TEST_USER_PASSWORD);
  await page.click('button[type="submit"]');

  // Wait for redirect
  await page.waitForURL('/');

  // Navigate to scan
  await page.goto('/scan');

  // ... test scan flow
});
```

## 📈 Performance Benchmarks

Current build metrics:
- **Bundle Size**: 1,135 kB (⚠️ needs code splitting)
- **CSS**: 80 kB
- **Hero Image**: 129 kB (⚠️ needs optimization)

Performance recommendations:
1. Implement code splitting with `React.lazy()`
2. Optimize images (WebP, compression)
3. Use CDN for static assets
4. Add bundle analyzer

## 🤝 Contributing

When adding new features:

1. **Write tests first** (TDD)
2. **Add to appropriate spec file**
3. **Update this README** if adding new test categories
4. **Run tests locally** before pushing
5. **Check CI results** on pull request

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [CI/CD Integration](https://playwright.dev/docs/ci)
