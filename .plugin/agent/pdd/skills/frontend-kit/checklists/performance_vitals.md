# Core Web Vitals & Performance Checklist (Unified)

## 1. Key Metrics (Targets)
- **LCP (Largest Contentful Paint)**: Loading Performance. **< 2.5 sec**.
- **FID (First Input Delay) / INP**: Interactivity. **< 200 ms**.
- **CLS (Cumulative Layout Shift)**: Visual Stability. **< 0.1**.

## 2. Optimization Checklist (Standard)

### 🚀 LCP (Loading)
- [ ] **Image**: Use modern formats (`WebP/AVIF`) and explicit sizes.
- [ ] **Priority**: Critical images uses `priority={true}`.
- [ ] **CDN**: Serve static assets via CDN.

### 📐 CLS (Stability)
- [ ] **Skeleton**: Use Skeleton UI placeholders.
- [ ] **Dimensions**: Always reserve space for Images/Ads.
- [ ] **Font**: Use `font-display: swap`.

### ⚡ Bundle Size (JS)
- [ ] **Code Splitting**: Use `React.lazy()` or Dynamic Imports.
- [ ] **Tree Shaking**: Verify unused exports.

## 3. Advanced Optimization (Deep Dive)

### 3.1 LCP Hacking
*   **Priority Hint**: Tell browser "Load this FIRST".
    ```html
    <img src="hero.jpg" fetchpriority="high" alt="Hero">
    ```

### 3.2 Advanced CLS Defense
*   **CSS `aspect-ratio`**: Reserve space for images before loading.
    ```css
    .hero-img { aspect-ratio: 16 / 9; }
    ```

### 3.3 JS Bundle Optimization
*   **Dynamic Import**: Load heavy libraries only when needed.
    ```tsx
    const HeavyChart = dynamic(() => import('./Chart'), { ssr: false });
    ```
*   **Import Cost**: Avoid importing entire libraries (e.g., Lodash).

## 4. Measuring Tools
- **Lighthouse**: Run audit in Chrome DevTools.
- **Web Vitals Extension**: Real-time checking.
