# Accessibility (A11y) Audit Checklist

## 1. Automated Tools (First Pass)
Run these tools before manual check.
- [ ] **Lighthouse**: Accessibility score > 90?
- [ ] **axe-core**: No critical violations found?
- [ ] **ESLint-plugin-jsx-a11y**: Zero lint errors?

## 2. Keyboard Navigation (Manual)
*Use `Tab` key only. No mouse.*
- [ ] **Focus Visible**: Can you see where the focus is? (Outline)
- [ ] **Logical Order**: Does `Tab` move top-left to bottom-right?
- [ ] **No Traps**: Can you `Shift+Tab` out of modals/menus?
- [ ] **Interactive Elements**: Can you press `Enter`/`Space` to activate buttons?

## 3. Screen Reader (VoiceOver / NVDA)
*Close your eyes. Listen.*
- [ ] **Images**: Do meaningful images have `alt` text? (Decorative = empty `alt=""`)
- [ ] **Forms**: Do inputs have associated `<label>`?
- [ ] **Headings**: Is the heading structure (`h1` -> `h2` -> `h3`) logical?
- [ ] **Dynamic Content**: Do alerts/modals announce themselves? (`role="alert"`, `aria-live`)

## 4. Visual Design
- [ ] **Contrast**: Text/Background contrast ratio > 4.5:1?
- [ ] **Zoom**: Does the site break at 200% zoom?
- [ ] **Color Only**: Is color the *only* way to convey info? (e.g., Red border for error without icon/text -> ❌)
