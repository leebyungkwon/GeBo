---
name: stitch-integration-kit
type: Skill
phase: Design
description: |
  Toolkit for integrating with Stitch (UI Visual Builder).
  Helps the Designer Agent translate functional requirements into Stitch-ready component specifications.

  Contents:
  - Stitch Component Mapping Template
  - Visual Style Token Definition Guide
---

# Stitch Integration Skill Instructions

## 1. When to use this skill
- When the user selects **"Strategy B: Stitch Integration"** in the design phase.
- When you need to generate a structured spec that can be easily imported or built in Stitch.

## 2. Resources
### 📄 Templates
- **Component Mapping**: `templates/component_mapping.md`
    - Maps logical UI elements (from `functional_spec.md`) to Stitch Components.
    - Defines properties (props), constraints, and styles.

## 3. How to Apply
1.  **Review Spec**: Read `functional_spec.md` to identify required UI elements.
2.  **Map to Stitch**: Use the template to define corresponding Stitch components (e.g., `Input` -> `Stitch.TextInput`).
3.  **Define Tokens**: Specify color and typography tokens compatible with Stitch's theme system.
