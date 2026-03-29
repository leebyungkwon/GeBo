---
name: spec-authoring
type: Skill
phase: Plan (Service)
description: |
  A skill for Service Planners to self-validate their specifications before submission.
  Detects vague words (ambiguity) and structural issues.
  Encourages precision and clarity in documentation.

  Tools:
  - Clarity Validator Script (`scripts/validate-clarity.js`)
---

# Spec Authoring Skill Instructions

## 1. When to use this skill
- ALWAYS before saving `functional_spec.md`.
- Use it to "Self-Correct" your writing style.

## 2. Capability: Clarity Check
You have access to a script that scans for words that lead to developer confusion.

### Command
```bash
node scripts/validate-clarity.js
```

### Interpretation of Output
- **[WARN]**: The script found vague words like "Fast", "Easy", "Appropriate".
  - **Action**: Rewrite the sentence with specific numbers or conditions.
  - *Bad*: "The system should response fast."
  - *Good*: "The system must respond within 200ms."

## 3. How to Apply
1.  **Draft** the `functional_spec.md`.
2.  **Run** the validation script.
3.  **Refine** any flagged ambiguities.
4.  **Save** the final version.
