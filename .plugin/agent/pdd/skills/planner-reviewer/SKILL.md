---
name: planner-reviewer
type: Skill
phase: Plan
description: |
  A skill for the Lead Planner to mechanically review the quality of specifications produced by sub-agents.
  Uses automated scripts to check for structural integrity and missing sections.
  Enforces a strict Feedback Loop (Reject & Retry).

  Tools:
  - Spec Validator Script (`scripts/review-spec.js`)
---

# Planner Reviewer Skill Instructions

## 1. When to use this skill
- Immediately after `Service Planner` or `Technical Architect` completes their task.
- Before accepting `functional_spec.md` or `system_architecture.md` as final.

## 2. Capability: Automated Spec Validation
You have access to a validation script that checks the structure of the functional specification.

### Command
```bash
node scripts/review-spec.js
```

### Interpretation of Output
- **[PASS]**: The spec has all required sections. You may proceed to review the content logic.
- **[FAIL]**: The spec is missing critical sections (e.g., Exception Handling).
  - **Action**: You MUST **Reject** the task. Call the sub-agent again with the specific error message from the script.

## 3. How to Reject (Feedback Loop)
If the validation fails or if you find logical flows, use the `Task` tool to send it back.

**Example Rejection Prompt:**
> "Service Planner, your spec failed the automated review.
> Missing Section: '4. Exception Handling'.
> Please fix this and re-submit."
