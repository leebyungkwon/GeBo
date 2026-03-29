# E2E Automation Guide (Playwright)

## 1. Why Playwright?
*   **Reliable**: Auto-waits for elements (no `sleep(1000)`).
*   **Fast**: Runs tests in parallel across browsers.
*   **Traceable**: Records video and network trace for failures.

## 2. Writing Robust Tests

### 2.1 Locators (The "User-First" Rule)
Don't use CSS selectors (`div > span`). Use accessible roles.

```ts
// ❌ Bad (Brittle)
await page.click('.btn-primary');

// ✅ Good (Resilient)
await page.getByRole('button', { name: 'Submit' }).click();
await page.getByLabel('Email Address').fill('user@example.com');
```

### 2.2 Atomic Tests
Each test must be independent.
Example: *Test A* should not depend on *Test B* creating a user.
**Use `beforeEach` to seed data.**

```ts
test.beforeEach(async ({ page }) => {
  await seedDatabase(); // Reset DB
  await page.goto('/login');
});
```

### 2.3 Visual Regression Testing
Verify UI pixel-perfectness.
```ts
await expect(page).toHaveScreenshot('landing-page.png');
```

## 3. Project Structure
```
tests/
├── e2e/
│   ├── auth.spec.ts
│   └── payment.spec.ts
├── fixtures/          # Reusable test setups
└── page-objects/      # POM (Page Object Model)
    ├── LoginPage.ts
    └── DashboardPage.ts
```

## 4. Page Object Model (POM)
Encapsulate page mechanics to keep tests clean.

```ts
// Check `LoginPage.ts`
export class LoginPage {
  constructor(private page: Page) {}
  
  async login(user, pass) {
    await this.page.getByLabel('User').fill(user);
    await this.page.getByLabel('Pass').fill(pass);
    await this.page.getByRole('button', { name: 'Log in' }).click();
  }
}
```
