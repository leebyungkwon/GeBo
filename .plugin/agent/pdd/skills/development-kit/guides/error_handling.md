# Error Handling & Exception Standard

## 1. Philosophy
*   **Operational Errors** (e.g., Timeout, DB Connection): Handle and Recover.
*   **Programmer Errors** (e.g., Null Pointer, Syntax): Crash and Restart (Fail Fast).
*   **Security First**: Never leak stack traces or internal paths to the client.

## 2. Standard Error Response (JSON)
*Must match `api_standard.md`.*

```json
{
  "success": false,
  "error": {
    "code": "e.g., INVALID_INPUT",
    "message": "Human readable message (Safe to show)",
    "traceId": "Unique Trace ID for logs"
  }
}
```

## 3. Custom Error Hierarchy
Do not throw raw `Error`. Use typed classes.

```javascript
class AppError extends Error {
  constructor(message, statusCode, code, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code; // e.g., 'USER_NOT_FOUND'
    this.isOperational = isOperational; // True = expected error
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends AppError {
  constructor(message = 'Bad Request') {
    super(message, 400, 'BAD_REQUEST');
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Not Found') {
    super(message, 404, 'NOT_FOUND');
  }
}
```

## 4. Global Error Handler (Middleware)
*Centralize all error logic here.*

```javascript
const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';
  
  // 1. Log the error (Securely)
  logger.error({
    message: err.message,
    stack: err.stack, // Log stack, but don't show to user
    traceId: req.traceId,
    path: req.path
  });

  // 2. Operational Error (Expected) -> Return precise code
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message
      }
    });
  }

  // 3. Programmer Error (Unexpected) -> Return Generic 500
  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isProd ? 'Something went wrong.' : err.message
    }
  });
};
```

## 5. Async Error Catching
Avoid `try-catch` everywhere. Use wrapper or Express v5+.

```javascript
// Valid
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/users', asyncHandler(async (req, res) => {
  const users = await db.getUsers(); // No try-catch needed
  res.json(users);
}));
```
