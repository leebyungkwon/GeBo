# REST API Global Standard Guide (v2.0)

## 1. URI Design Rules (Resource Naming)
*   **Case**: `kebab-case` only. (e.g., `/user-profiles`, not `/userProfiles`)
*   **Plurals**: Use plurals for resources. (e.g., `/users`, not `/user`)
*   **Nouns**: No verbs in URI. (e.g., `DELETE /users/1` instead of `POST /users/1/delete`)
*   **Nesting**: Avoid nesting deeper than 2 levels.
    *   Good: `/users/1/orders`
    *   Bad: `/users/1/orders/5/items/3` -> Use `/order-items/3` directly.
*   **Trailing Slash**: Do not use trailing slashes. (`/users` ⭕, `/users/` ❌)

## 2. HTTP Methods & Semantics
| Method | Action | Idempotent | Safe | Success Status | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | Read | Yes | Yes | 200 OK | Retrieve resource(s). |
| **POST** | Create | No | No | 201 Created | Create a new resource. Returns `Location` header. |
| **PUT** | Replace | Yes | No | 200 OK | Replace entire resource (Full update). |
| **PATCH** | Update | No | No | 200 OK | Update specific fields (Partial update). |
| **DELETE** | Delete | Yes | No | 204 No Content | Remove resource. |

## 3. Standard Request/Response Format
### JSON Rules
*   **Keys**: `camelCase` (e.g., `firstName`)
*   **Dates**: ISO 8601 String (e.g., `"2024-02-08T10:00:00Z"`)

### Success Response (Envelope Pattern)
```json
{
  "success": true,
  "data": {
    "id": "user_123",
    "username": "jdoe"
  },
  "meta": {  // Optional: for list meta
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Error Response (Standardized)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",  // Machine-readable
    "message": "Invalid email format", // Human-readable
    "details": [ // Optional validation details
      { "field": "email", "issue": "must be a valid email" }
    ],
    "traceId": "abc-123-xyz" // For debugging
  }
}
```

## 4. HTTP Status Codes (Strict Usage)
### 2xx Success
*   `200 OK`: Standard success.
*   `201 Created`: Resource created successfully (POST).
*   `204 No Content`: Successful request but no body returned (DELETE).

### 4xx Client Error
*   `400 Bad Request`: Validation failure or malformed JSON.
*   `401 Unauthorized`: Authentication missing or invalid (No Token).
*   `403 Forbidden`: Authenticated but no permission (Scope/Role).
*   `404 Not Found`: Resource does not exist.
*   `409 Conflict`: Resource state conflict (e.g., Duplicate Email).
*   `429 Too Many Requests`: Rate limit exceeded.

### 5xx Server Error
*   `500 Internal Server Error`: Unhandled application exception.
*   `503 Service Unavailable`: Maintenance or overload.

## 5. Filtering, Sorting, Pagination (Query Params)
*   **Pagination**:
    *   `GET /users?page=2&limit=20` (Offset-based)
    *   `GET /users?cursor=xyz` (Cursor-based for infinity scroll)
*   **Sorting**:
    *   `GET /users?sort=-created_at` (`-` for desc, `+` or empty for asc)
*   **Filtering**:
    *   `GET /users?status=active` (Exact match)
    *   `GET /users?age[gte]=18` (Range)
*   **Search**:
    *   `GET /users?q=john` (Full-text search)

## 6. Authentication Header (Bearer)
Always use the Authorization header for protected routes.
```http
Authorization: Bearer <access_token>
```
