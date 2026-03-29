---
name: service-planning-kit
type: Skill
phase: Plan
description: |
  A professional toolkit for Service Planners.
  Contains standard templates for Functional Specifications (FSD) and checklists for Edge Case discovery.
  Helps generate high-quality, developer-ready planning documents.

  Tools:
  - FSD Template (Standardized Structure)
  - Edge Case Checklist (Unhappy Path)
  - User Flow Pattern (Mermaid)
---

# Service Planning Skill Instructions

## 1. When to use this skill
- When the `service-planner` agent starts writing the `functional_spec.md`.
- When you need to verify if the planning covers all necessary edge cases.

## 2. Resources
### 📄 Templates
- **Functional Spec Template**: `templates/fsd_template.md`
    - Use this markdown structure to ensure consistent documentation.
    - Includes sections for: User Flow, UI Elements, Logic, Validation, Exceptions.

### ✅ Checklists
- **Edge Case Checklist**: `checklists/edge_case_checklist.md`
    - Use this to strictly review the plan.
    - Questions like "What if the internet cuts off?", "What if the list is empty?".

## 3. How to Apply
1.  **Load Template**: Read `templates/fsd_template.md`.
2.  **Fill Content**: Map the PM's requirements into the template sections.
3.  **Self-Correction**: Run through the `checklists/edge_case_checklist.md` and add missing logic.
