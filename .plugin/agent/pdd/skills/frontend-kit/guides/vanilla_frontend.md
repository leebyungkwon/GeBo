# Vanilla Frontend Engineering Guide (No Frameworks)

## 1. Philosophy
**"Back to Basics, but Modern."**
Build lightweight, fast, and timeless web applications using standard Web APIs. No bundlers (optional), no heavy runtimes.

## 2. HTML5 Strategy (Semantic Structure)
Use tags that describe content, not appearance.

```html
<!-- ✅ Good: Semantic -->
<article class="blog-post">
  <header class="blog-post__header">
    <h1>The Power of Vanilla</h1>
    <time datetime="2024-02-08">Feb 8, 2024</time>
  </header>
  <p>Content goes here...</p>
</article>

<!-- ❌ Bad: Div Soup -->
<div class="header">
  <div class="title">The Power of Vanilla</div>
</div>
```

### Key Rules
*   Every interactive element must be focusable (`<button>`, `<a>`, or `tabindex="0"`).
*   Use inputs with correct types (`type="email"`, `type="date"`) for mobile keyboards.

## 3. Modern CSS Strategy (Native Powers)
### 3.1 Architecture: BEM + Variables
Use **BEM (Block Element Modifier)** naming to prevent leakage.
Use **CSS Variables** for theming.

```css
:root {
  --primary-color: #007bff;
  --spacing-md: 16px;
}

/* Block */
.card {
  background: white;
  padding: var(--spacing-md);
  border-radius: 8px;
}

/* Element */
.card__title {
  color: var(--primary-color);
  font-weight: bold;
}

/* Modifier */
.card--featured {
  border: 2px solid gold;
}
```

### 3.2 Layout
*   **Grid**: For page layouts (2D).
*   **Flexbox**: For components/alignment (1D).
*   **No Floats**: Never use `float` for layout.

## 4. Modern JavaScript (ES6+ Modules)
Drop jQuery. Use native DOM APIs.

### 4.1 Modules (`type="module"`)
Organize code into reusable files.
```html
<script type="module" src="./main.js"></script>
```
```javascript
// utils.js
export const $ = (selector) => document.querySelector(selector);

// main.js
import { $ } from './utils.js';
const btn = $('#submit-btn');
```

### 4.2 State Management (Proxy Store)
Simple reactivity without React.
```javascript
const createStore = (initialState, render) => {
  return new Proxy(initialState, {
    set(target, prop, value) {
      target[prop] = value;
      render(); // Auto-render on change
      return true;
    }
  });
};

const state = createStore({ count: 0 }, updateUI);
```

### 4.3 DOM Performance
*   **Event Delegation**: Attach one listener to parent (`ul`), not 100 listeners to children (`li`).
    ```javascript
    document.querySelector('.list').addEventListener('click', (e) => {
      if (e.target.matches('.list__item')) { /* ... */ }
    });
    ```
*   **DocumentFragment**: Batch DOM insertions.

## 5. References
*   **DOM Manipulation**: [You Might Not Need jQuery](https://youmightnotneedjquery.com/)
*   **CSS Architecture**: [BEM Methodology](https://en.bem.info/methodology/)
*   **MDN Web Docs**: [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
