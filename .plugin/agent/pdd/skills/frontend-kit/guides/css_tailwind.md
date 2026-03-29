# Tailwind CSS & Shadcn Strategy Guide

## 1. Introduction
**Tailwind CSS** is a utility-first CSS framework for rapidly building custom user interfaces. Combined with **Shadcn/ui** (Headless UI + Tailwind), it provides the ultimate productivity stack.

## 2. Core Philosophy
*   **Utility-First**: Don't write CSS. Compose classes directly in HTML.
*   **Colocation**: Style and structure live together (`<div class="flex">`).
*   **Design System**: Use `tailwind.config.ts` to enforce tokens (colors, spacing).

## 3. Technology Stack & Setup
### 3.1 Tailwind CSS v4 (Evolution)
*   **Zero Config**: Detects content files automatically.
*   **Rust Engine**: Lightning fast builds (Oxide).
*   **Native CSS**: CSS variables are first-class citizens.

### 3.2 Shadcn/ui (Architecture)
*   User owns the code (Copy & Paste components).
*   Built on **Radix UI** (Accessible primitives).

## 4. Best Practices & Patterns

### 4.1 Class Sorting (Prettier)
Always use `prettier-plugin-tailwindcss` to enforce consistent class order.
```bash
npm install -D prettier prettier-plugin-tailwindcss
```

### 4.2 Component Variants (CVA)
Use `class-variance-authority` (CVA) for complex component states.

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground",
        outline: "border border-input bg-background hover:bg-accent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

### 4.3 Avoiding "Class Soup"
Extract complex composites into Shadcn-style components, NOT `@apply`.
*   **Good**: `<Button variant="outline" />`
*   **Bad**: `.btn { @apply bg-blue-500 ... }`

## 5. References
*   **Official Docs**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)
*   **Component Library**: [Shadcn/ui](https://ui.shadcn.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Utility**: [clsx & tw-merge](https://github.com/dcastil/tailwind-merge) (Essential for overriding styles)
