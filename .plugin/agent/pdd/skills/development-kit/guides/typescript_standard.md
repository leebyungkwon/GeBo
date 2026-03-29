# TypeScript Engineering Specification (v2.0)

## 1. Compiler Configuration (`tsconfig.json`) Specification
The following configuration is **MANDATORY** for all projects.

```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "module": "esnext",
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"] // Enforce Absolute Imports
    },
    // Strictness (The "Safety Belt")
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUncheckedIndexedAccess": true, // Critical for array safety
    "exactOptionalPropertyTypes": true,
    
    // Developer Experience
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

## 2. Naming & Style Conventions

### 2.1 Types & Interfaces
*   **PascalCase** for all types. (`User`, `LoginResponse`)
*   **No Hungarian Notation**: Do **NOT** prefix with `I` or `T`.
    *   Good: `interface User { ... }`
    *   Bad: `interface IUser { ... }` (This is archaic)
*   **Suffix Props**: Component props must end with `Props`. (`ButtonProps`)

### 2.2 File Naming
*   **Logic**: `camelCase.ts` (e.g., `userUtils.ts`, `authHook.ts`)
*   **Components**: `PascalCase.tsx` (e.g., `Button.tsx`)
*   **Constants**: `UPPER_SNAKE_CASE` inside `camelCase.ts`.

## 3. Advanced Type Patterns

### 3.1 Branded Types (Nominal Typing)
Prevent accidental usage of strings as IDs. Use "Branding".

```ts
// Definition
declare const __brand: unique symbol;
type Brand<T, Label extends string> = T & { [__brand]: Label };

export type UserId = Brand<string, 'UserId'>;
export type OrderId = Brand<string, 'OrderId'>;

// Usage
function getUser(id: UserId) { ... }
const id = "123" as UserId; // Explicit cast required at boundary
getUser("123"); // ❌ Compile Error: string is not UserId
```

### 3.2 Result Type (Functional Error Handling)
Avoid `throw` in business logic. Return `Result<T, E>`.

```ts
type Result<T, E = Error> = 
  | { success: true; data: T } 
  | { success: false; error: E };

function parseEmail(input: string): Result<string> {
  if (!input.includes('@')) {
    return { success: false, error: new Error('Invalid Email') };
  }
  return { success: true, data: input };
}
```

### 3.3 Zod Integration (Runtime Validation)
Typescript checks compile-time; Zod checks runtime. Inference is key.

```ts
import { z } from 'zod';

const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
});

// Auto-infer TS type from Zod Schema
export type User = z.infer<typeof UserSchema>; 
```

## 4. Anti-Patterns (Strictly Forbidden)

### 4.1 The "Any" Virus
*   **Forbidden**: `data: any`
*   **Alternative**: Use `unknown` + Type Guard (Zod).

### 4.2 Non-Null Assertion
*   **Forbidden**: `user!.name`
*   **Reason**: It lies to the compiler. If it's really not null, check it properly.
*   **Alternative**: `if (user) { ... }`

### 4.3 Default Exports
*   **Discouraged**: `export default function ...`
*   **Reason**: Refactoring is harder, name mismatches occur.
*   **Rule**: Use **Named Exports** (`export const Button = ...`) primarily.

## 5. References & Further Reading
*   **Official Documentation**: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
*   **Style Guide**: [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
*   **Advanced Patterns**: [Total TypeScript (Matt Pocock)](https://www.totaltypescript.com/tutorials)
*   **React + TS**: [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
*   **Validation**: [Zod Documentation](https://zod.dev/)
