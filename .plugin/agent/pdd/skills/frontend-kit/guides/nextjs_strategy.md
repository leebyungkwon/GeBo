# Next.js App Router Strategy (Unified)

## 1. Core Philosophy (Server First)
*   **Server First**: Everything is a Server Component by default.
*   **Edge Ready**: Design for computing at the edge.

## 2. Directory Structure & Rendering

### 2.1 Feature-Sliced App Router
```
app/
├── (dashboard)/
│   ├── settings/
│   │   ├── page.tsx
│   │   ├── loading.tsx   # Instant Loading State
│   │   └── error.tsx     # Error Boundary
└── layout.tsx            # Root Layout
```

### 2.2 Rendering Strategy
| Feature | Server Component (Default) | Client Component (`"use client"`) |
| :--- | :--- | :--- |
| **Data Fetching** | ✅ Direct DB Access | ❌ (Use Query) |
| **Interactivity** | ❌ | ✅ (Hooks, Events) |

## 3. Data Patterns (Standard)
### 3.1 Data Fetching
Fetch directly in the component (async/await).
```tsx
export default async function Dashboard() {
  const data = await db.query('SELECT * ...');
  return <Table data={data} />;
}
```

## 4. Advanced Patterns (Deep Dive)

### 4.1 Server Actions (Mutations & Validation)
Handle server-side logic and validation.

```tsx
// Action
export async function createUser(prevState: any, formData: FormData) {
  const result = schema.safeParse(data);
  if (!result.success) return { errors: result.error.flatten() };
  return { message: 'Success' };
}
```

### 4.2 Streaming & Suspense
Break down page rendering chunks.

```tsx
<Suspense fallback={<SkeletonChart />}>
  <RevenueChart />
</Suspense>
```

### 4.3 Parallel Routes (`@folder`)
Render complex layouts simultaneously.
*   Structure: `app/@sidebar`, `app/@main`.

## 5. Optimization & SEO
*   **Metadata API**: Dynamic SEO tags.
*   **Image Optimization**: Use `next/image`.
*   **Font Optimization**: Use `next/font`.
