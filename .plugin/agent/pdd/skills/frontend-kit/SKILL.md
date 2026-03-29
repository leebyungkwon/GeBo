---
name: frontend-kit
type: Skill
phase: Develop
description: |
  Professional Toolkit for Modern Frontend Engineering.
  Focuses on Component Patterns, State Management Strategy, and Core Web Vitals.
  Ensures scalable and high-performance UI code.

  Tools:
  - Component Design Patterns (Atomic, Compound)
  - State Management Rules (Server vs Client)
  - Performance Checklist (Core Web Vitals)
---

# Frontend Skill Instructions

## 1. When to use this skill
- Before creating React/Vue Components.
- When deciding where to store data (Context vs Query vs Store).
- Before deployment (Optimization check).

## 2. Resources
### 📘 Engineering Guides
- **Component Patterns**: `guides/component_design.md`
    - Atomic Design & Compound Component Pattern.
- **State Strategy**: `guides/state_management.md`
    - Separation of Server State (API) and Client State (UI).
- **CSS Strategy (Option A)**: `guides/css_tailwind.md`
    - Tailwind v4 + Shadcn/ui (Productivity Focused).
- **CSS Strategy (Option B)**: `guides/css_vanilla_extract.md`
    - Vanilla Extract (Type-Safety & Zero-Runtime Focused).
- **Next.js Strategy**: `guides/nextjs_strategy.md`
    - App Router, Server Components, and Actions.
- **Vanilla Frontend Strategy**: `guides/vanilla_frontend.md`
    - Pure HTML5, BEM CSS, ES Modules (No Framework).

### ✅ Checklists
- **Performance Vitals**: `checklists/performance_vitals.md`
    - LCP, CLS, FID optimization targets.

## 3. How to Apply
1.  **Design**: Choose the right pattern (e.g., Compound for Dropdown).
2.  **State**: Don't put API data in Redux; use React Query.
3.  **Optimize**: Measure LCP < 2.5s using standard tools.
