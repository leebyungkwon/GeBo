# Advanced Bug Reporting Standard (v3.0)

## 1. The Principle: "Zero Round-Trip"
A perfect bug report needs **zero questions** from the developer.
It should contain everything needed to fix the bug.

## 2. The Golden Template (Structure)

### [Bug ID] Short, Actionable Title
*   **Format**: `[Component] Description of failure under Condition`
*   **Example**: `[Checkout] 500 Error when coupon code has trailing spaces`

### 📍 Context
*   **Severity**: Critical | Major | Minor
*   **Priority**: P0 (Immediate) | P1 (Next Release) | P2 (Backlog)
*   **Environment**: Production | Staging | Dev
*   **Device**: Chrome 120 (Win 11) | Safari 17 (iOS 17)

### 🔁 Repro Steps (The Recipe)
1.  Navigate to `[URL]`
2.  Perform action `[Action]`
3.  Enter data `[Input]`
4.  Observe `[Result]`

### 📉 Expected vs Actual
*   **Expected**: System handles X gracefully.
*   **Actual**: System crashes with Y error.

### 🛠️ Technical Details (Critical)
*   **API Request**: Curl or JSON Payload.
*   **API Response**: Status Code & Error Body.
*   **Console Log**: Stack trace from DevTools.

---

## 3. Real-World Example (Copy This Style)

### 🐛 [Checkout] 500 Error when Coupon `SUMMER24 ` has Trailing Space

**Context**:
*   **Severity**: **Major** (User cannot complete purchase with coupon)
*   **Priority**: **P1** (Fix in next sprint, workaround exists)
*   **Environment**: Staging (https://staging.store.com)
*   **Browser**: Chrome 121

**Steps to Reproduce**:
1.  Log in as user `tester@example.com`
2.  Add "Premium Plan" to cart.
3.  In the coupon field, enter `SUMMER24 ` (Note the space at the end).
4.  Click "Apply Coupon".

**Expected Result**:
*   The system should trim the whitespace and apply the coupon.
*   OR show a user-friendly error: "Invalid coupon code format".

**Actual Result**:
*   The UI freezes for 2 seconds.
*   A toast message appears: "Network Error: 500".
*   User remains on the same page but cannot retry without refreshing.

**Technical Details (The Evidence)**:

**1. API Request (Payload)**:
```json
POST /api/v1/cart/apply-coupon
{
  "cartId": "cart_12345",
  "code": "SUMMER24 "  // <--- The culprit
}
```

**2. API Response**:
```json
HTTP/1.1 500 Internal Server Error
{
  "error": "Unhandled Exception",
  "message": "Cannot read properties of null (reading 'discount_amount')",
  "traceId": "req_abc123xyz"
}
```

**3. Console Log**:
```
Uncaught (in promise) Error: Request failed with status code 500
    at createError (createError.js:16)
    at settle (settle.js:17)
    at XMLHttpRequest.onloadend (xhr.js:66)
```

**QA Hypothesis**:
*   Backend seems to be searching for `"SUMMER24 "` in the DB exactly.
*   It returns `null` (not found).
*   Then the code tries to access `result.discount_amount` without checking if `result` is null.
*   **Fix Suggestion**: Add `.trim()` in the backend controller or handle null result.

---

## 4. Severity vs Priority Matrix (Decision Guide)

| Scenario | Severity (Impact) | Priority (Urgency) | Action |
| :--- | :--- | :--- | :--- |
| **Payment Gateway Down** | **Critical** | **P0** | Wake up the team immediately. |
| **Typo in Terms of Service** | Minor | **P1** | Legal issue. Fix in next deployment. |
| **Dark Mode Glitch** | Minor | P3 | Fix when bored. |
| **Crash on IE11** | Major | **Won't Fix** | We don't support IE11. Close ticket. |
