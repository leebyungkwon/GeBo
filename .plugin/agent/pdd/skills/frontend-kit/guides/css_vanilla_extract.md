# Vanilla Extract & Zero-Runtime Guide

## 1. Introduction
**Vanilla Extract** is a "TypeScript-first" CSS-in-JS library. It generates static CSS files at build time (**Zero-Runtime**), offering the best of both worlds: the power of TS and the performance of native CSS.

## 2. Core Philosophy
*   **Type Safety**: CSS properties are typed. Use explicit values or tokens.
*   **Zero Runtime**: No JS execution for styles in the browser (unlike Styled-Components).
*   **Static Extraction**: Styles are compiled into a standard `.css` file.

## 3. Technology Stack
*   **@vanilla-extract/css**: Core library.
*   **@vanilla-extract/recipes**: For component variants (like Stitches/CVA).
*   **@vanilla-extract/sprinkles**: Atomic CSS generation (like Tailwind).

## 4. Setup & Usage

### 4.1 Define Styles (`.css.ts`)
Values explicitly come from your theme vars.

```ts
// button.css.ts
import { style } from '@vanilla-extract/css';
import { vars } from './theme.css';

export const container = style({
  padding: 10,
  backgroundColor: vars.colors.primary,
  color: 'white',
  // Pseudo-selectors
  ':hover': {
    backgroundColor: vars.colors.primaryDark
  }
});
```

### 4.2 Use in Component (`.tsx`)
```tsx
import * as styles from './button.css';

export const Button = () => (
  <button className={styles.container}>
    Click Me
  </button>
);
```

## 5. Advanced Patterns (Recipes)
Handle variants effectively using the `recipe` API.

```ts
// button.css.ts
import { recipe } from '@vanilla-extract/recipes';

export const button = recipe({
  base: {
    borderRadius: 6,
  },
  variants: {
    color: {
      neutral: { background: 'whitesmoke' },
      brand: { background: 'blueviolet', color: 'white' }
    },
    size: {
      small: { padding: 12 },
      large: { padding: 24 }
    }
  },
  defaultVariants: {
    color: 'neutral',
    size: 'small'
  }
});

// Usage: <button className={button({ color: 'brand', size: 'large' })} />
```

## 6. References
*   **Official Docs**: [Vanilla Extract Documentation](https://vanilla-extract.style/)
*   **Recipes**: [Vanilla Extract Recipes](https://vanilla-extract.style/documentation/packages/recipes/)
*   **Sprinkles**: [Framework Agnostic Atomic CSS](https://vanilla-extract.style/documentation/packages/sprinkles/)
*   **Comparison**: [CSS-in-JS Performance Cost](https://github.com/snoopcode/css-in-js-performance)
