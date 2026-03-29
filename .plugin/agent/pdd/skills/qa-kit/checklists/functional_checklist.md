# Ultimate Functional QA Checklist (v2.0)

> **Rule**: If a check fails, file a bug with the provided "Example Data".

## 1. 🔐 Authentication & Session (Security First)
*Focus: Session hijacking, timeouts, and multi-device handling.*

| Category | Test Case | Example Data / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Login** | Valid Credentials | User: `test@valid.com`, Pass: `123456` | Redirect to Dashboard in < 2s. |
| **Login** | Invalid Password (Brute Force Protection) | Enter wrong password 5 times rapidly. | Account locked for 5 mins or Captcha appears. |
| **Session** | Token Expiration | Wait 30 mins (or edit local storage token). | API returns 401 -> Redirect to Login. |
| **Session** | Multi-Tab Sync | Log out in Tab A. Refresh Tab B. | Tab B should redirect to Login immediately. |
| **Social** | OAuth Cancel | Click "Login with Google" -> Click "Cancel". | Return to Login page gracefully (No 500 Error). |

## 2. 📝 Input Forms & Validation (Data Integrity)
*Focus: XSS, SQL Injection prevention, and UX micro-interactions.*

| Category | Test Case | Example Data / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Input** | HTML Injection (XSS) | `<script>alert('hacked')</script>` | Saved as plain text or rejected. Alert MUST NOT pop up. |
| **Input** | SQL Injection | `' OR '1'='1` in Search/Login field. | System handles logic securely (No DB Dump/Bypass). |
| **Required** | Whitespace Only | Enter "   " (spaces) in required 'Name'. | Show error "Name is required". (Do not save empty string). |
| **Limits** | Max Length Boundary | Paste 5,000 chars into 'Description'. | Truncate or show "Max 500 chars" error. |
| **UX** | Tab Order | Press `Tab` repeatedly. | Focus moves logically (Input -> Button). |

## 3. 🔍 Search, Filter & List (The Core)
*Focus: Empty states, pagination logic, and result accuracy.*

| Category | Test Case | Example Data / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Search** | Case Insensitivity | Search "apple", "Apple", "APPLE". | All return the same result "Apple". |
| **Search** | No Results (Empty State) | Search "Xyz123NoMatch". | Show "No results found for 'Xyz...'" (Not broken layout). |
| **Filter** | Combined Filters | Category: "Shoes" + Color: "Red". | Only show Red Shoes. (Intersection logic). |
| **List** | Pagination Edge | Go to Page 1 -> Click Prev. | Button disabled or does nothing. |
| **Load** | Skeleton Loading | Throttling Network to 'Slow 3G'. | Show Skeleton UI (Not white screen) while loading. |

## 4. 💳 Payment & Checkout (Business Critical)
*Focus: Calculation accuracy and transaction states.*

| Category | Test Case | Example Data / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Calc** | Floating Point Math | Price $19.99 * 3 items. | Total $59.97 (Not $59.970000004). |
| **Coupon** | Case/Space Handling | Enter ` SUMMER20 ` (Spaces). | Trim and apply coupon successfully. |
| **Flow** | Back Button | Pay Success -> Click Browser 'Back'. | Should NOT re-submit payment. Redirect to Order History. |
| **Error** | Card Declined | Use Test Card for 'Decline'. | Show "Card declined, please try another" (No crash). |

## 5. 🌐 Network & Edge Cases (Resilience)
*Focus: How the app behaves when things go wrong.*

| Category | Test Case | Example Data / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Network** | Offline Mode | Turn off Wifi -> Click "Save". | Show "No Internet Connection" toast. (Do not lose data). |
| **API** | Server Error (500) | Mock API to return 500 status. | Show "Something went wrong" (Generic error), NOT JSON dump. |
## 7. 🛡️ Input Validation & Data Types
*Focus: Strict format checks, boundaries, and mandatory fields.*

| Category | Test Case | Example Data / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Email** | Invalid Format | `user@` (No domain), `@domain.com` (No user). | Show "Invalid email address" error. |
| **Email** | Case Sensitivity | `User@Example.com` vs `user@example.com`. | Treat as SAME user (normalize input). |
| **Password** | Complexity Rule | Set pass `12345` (Too weak). | Show "Must conform to complexity requirements". |
| **Password** | Match Check | Pass: `abc`, Confirm: `abd`. | Show "Passwords do not match". |
| **Number** | Negative Value | Enter Price: `-100`. | Show "Price cannot be negative". |
| **Number** | Zero Handling | Enter Quantity: `0`. | Show "Must be at least 1" (if applicable). |
| **Date** | Future/Past | Birth Date: `2050-01-01` (Future). | Show "Invalid date range". |
| **File** | Size Limit | Upload `Movie.mp4` (500MB). | Show "Max file size is 5MB". |
| **File** | Type Restriction | Upload `malware.exe`. | Show "Only images (JPG/PNG) allowed". |
## 6. ♻️ CRUD Operations (Data Lifecycle)
*Focus: Data persistence, state updates, and cancellation.*

| Category | Test Case | Example Data / Action | Expected Result |
| :--- | :--- | :--- | :--- |
| **Create** | Persistence | Create Item "New Task" -> Refresh Page. | Item "New Task" should still exist in the list. |
| **Create** | Duplicate Prevention | Create Item "Task A". Try to create "Task A" again (if unique). | Show "Item already exists" error. |
| **Read** | Detail View Match | Click Item "Task A" in list. | Detail page shows correct data for "Task A" (Not "Task B"). |
| **Read** | Direct Link (Deep Link) | Copy URL of Item A -> Open Incognito. | Should load Item A directly (if public/auth). |
| **Update** | Edit Verification | Rename "Task A" to "Task B" -> Save. | List updates immediately to "Task B". |
| **Update** | Edit Cancel | Rename "Task B" to "Task C" -> Click CANCEL. | Item remains "Task B". (No changes saved). |
| **Delete** | Confirmation Modal | Click Delete Button. | Show "Are you sure?" modal. (Do NOT delete immediately). |
| **Delete** | Soft/Hard Delete | Confirm Delete -> Refresh Page. | Item is gone from list. (Check DB if Soft Delete). |
