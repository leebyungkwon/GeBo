# Professional Test Strategy & Implementation Guide (v4.0)

## 1. The Strategy: "Shift Left"
We catch bugs **during development**, not after release.
*   **Unit**: 70% (Fast feedback loop)
*   **Integration**: 20% (Contract verification)
*   **E2E**: 10% (User journey verification)

## 2. Technology Stack (The Best-in-Class)
*   **Runner**: `Vitest` (Faster than Jest, native ESM support).
*   **DOM Testing**: `React Testing Library` (Test behavior, not implementation).
*   **API Mocking**: `MSW` (Mock Service Worker) - Intercept requests at network level.
*   **E2E**: `Playwright` (Reliable, auto-waiting, trace viewer).

## 3. Implementation Details (Code Level)

### 3.1 Unit Testing: The "Pure" Logic
**Rule**: Test inputs and outputs. Do not test checking implementation details.

```ts
// ❌ Bad: Testing internal state
it('sets loading to true', () => {
  const component = shallow(<UserList />);
  expect(component.state('loading')).toBe(true);
});

// ✅ Good: Testing user behavior
it('shows loading spinner initially', () => {
  render(<UserList />);
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

### 3.2 Integration Testing: API Mocking with MSW
**Rule**: Don't mock `fetch` manually. Use MSW handlers.

```ts
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/user', () => {
    return HttpResponse.json({ id: 1, name: 'John Maverick' });
  }),
];

// setupTests.ts
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### 3.3 E2E Testing: Resilient Selectors
**Rule**: Test like a user. Use accessible roles.

```ts
// tests/login.spec.ts
test('user can login', async ({ page }) => {
  await page.goto('/login');
  // ❌ Bad: page.click('.submit-btn')
  // ✅ Good:
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await expect(page.getByText('Welcome, John')).toBeVisible();
});
```

## 4. CI/CD Pipeline (GitHub Actions)
**Rule**: Block merge if tests fail.

```yaml
# .github/workflows/test.yml
name: Quality Gate
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      
      # 1. Parallel Execution
      - run: pnpm test:unit --shard=1/2
      - run: pnpm test:unit --shard=2/2
      
      # 2. E2E (Only on changed files for speed)
      - run: pnpm exec playwright test
```

## 5. Handling Flaky Tests
**Definition**: A test that passes sometimes and fails others.
**Solution**:
1.  **Retries**: Configure Playwright to retry failed tests 2x.
2.  **Isolation**: Ensure DB is cleaned before EVERY test.
3.  **No Sleep**: Never use `await sleep(1000)`. Use `await expect(...).toBeVisible()`.
