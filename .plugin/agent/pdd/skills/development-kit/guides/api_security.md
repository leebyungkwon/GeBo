# API Security Specification & Configuration (Unified)

## 1. Network Security (Headers)
### 1.1 Specification (The Rules)
| Header | Value | Purpose |
| :--- | :--- | :--- |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Force HTTPS |
| `Content-Security-Policy` | `default-src 'self'` | Prevent XSS |
| `X-Content-Type-Options` | `nosniff` | Prevent Sniffing |
| `X-Frame-Options` | `DENY` | Prevent Clickjacking |

### 1.2 Implementation (The Code)
**Nginx Config**:
```nginx
server {
    listen 443 ssl http2;
    # HSTS & Cipher Suites
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;
}
```

**Express (Helmet)**:
```javascript
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
  frameguard: { action: 'deny' },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true }
}));
```

## 2. Authentication (JWT Standard)
### 2.1 Specification
*   **Algorithm**: `RS256` (Asymmetric) REQUIRED.
*   **Storage**:
    *   Access Token: Memory (Variable)
    *   Refresh Token: `HttpOnly` Cookie
*   **Validation**: Check `exp`, `iss`, `aud`, and `signature`.

### 2.2 Implementation
```javascript
// Cookie Config
res.cookie('refreshToken', token, {
  httpOnly: true,
  secure: true, // HTTPS only
  sameSite: 'strict', // CSRF protection
  path: '/auth/refresh'
});
```

## 3. Rate Limiting Strategy
### 3.1 Specification
| Scope | Limit | Window | Store |
| :--- | :--- | :--- | :--- |
| Public API | 60 req | 1 min | Redis |
| Login API | 5 req | 1 min | Redis |

### 3.2 Implementation (Redis)
```javascript
const limiter = rateLimit({
  store: new RedisStore({ client: redisClient }),
  windowMs: 60 * 1000, // 1 min
  max: 60,
  message: { error: 'Too Many Requests' }
});
```

## 4. Input Validation & Sanitization
### 4.1 Specification
*   **Whitelist**: Reject unknown fields.
*   **Sanitize**: Using `DOMPurify` for HTML.
*   **Type Check**: Using `Zod`/`Joi`.

### 4.2 Implementation
```javascript
const UserSchema = z.object({
  username: z.string().min(3).max(20),
  bio: z.string().transform((val) => DOMPurify.sanitize(val))
});
```
