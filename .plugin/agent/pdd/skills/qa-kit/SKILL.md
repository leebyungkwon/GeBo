---
name: qa-kit
type: Skill
phase: Verify
description: |
  Professional Quality Assurance & Test Automation Toolkit.
  Focuses on E2E Testing, Security Audits, Performance Metrics, and Accessibility.
  Ensures zero-defect delivery via rigorous testing standards.

  Tools:
  - Test Strategy (Pyramid of Testing)
  - E2E Automation Guide (Playwright)
  - Security & Accessibility Audit
---

# QA Skill Instructions

## 1. When to use this skill
- Before creating `verification_report.md`.
- When writing test cases or automation scripts.
- To audit the final product for release.

## 2. Resources
### 📘 Engineering Guides
- **Test Strategy**: `guides/test_strategy.md`
    - Defining Unit vs Integration vs E2E scope.
- **E2E Automation**: `guides/e2e_playwright.md`
    - Writing robust E2E tests using Playwright.
- **Bug Reporting Standard**: `guides/bug_report_standard.md`
    - Severity (Critical/Major) vs Priority (P0/P1) matrix.

### ✅ Checklists
- **Functional Check (Pre-Bug)**: `checklists/functional_checklist.md`
    - Core verification items for Auth, Forms, Search, and Payment.
- **Accessibility Audit**: `checklists/a11y_audit.md`
    - WCAG 2.1 compliance check (Keyboard, Screen Reader).

## 3. How to Apply
1.  **Plan**: Define *what* to test using the Test Strategy.
2.  **Automate**: Write E2E scripts for critical user flows (Login, Checkout).
3.  **Audit**: Run Lighthouse & Axe for performance/a11y.
4.  **Report**: File bugs with clear reproduction steps & logs.
