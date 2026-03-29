---
name: tech-researcher
type: Skill
phase: Architect
description: |
  A skill for the Technical Architect to validate architectural decisions against real-world data.
  Enables searching for Cloud Pricing, Library Deprecation Status, and Managed Service limits.
  Prevents "Resume Driven Development" and ensures "Cost-Effective" architecture.

  Tools:
  - Web Search (search_web)
---

# Tech Researcher Skill Instructions

## 1. When to use this skill
- When proposing a specific technology stack (e.g., "Use AWS Lambda").
- When defining database schemas (e.g., "Check Firestore document size limits").
- When estimating costs.

## 2. Research Checklist
Before finalizing `system_architecture.md`, you MUST verify:

### 💰 Cost Feasibility
- Search: "AWS Lambda pricing per request 2025" or "Vercel Pro plan limits".
- **Action**: If the free tier is too low for the project scale, warn the user.

### 💀 Deprecation / Health Check
- Search: "Is [Library Name] deprecated?" or "[Library Name] last commit date".
- **Action**: Do not use libraries that haven't been updated in 1 year.

### ⚖️ Alternatives Analysis
- Search: "[Tech A] vs [Tech B] performance benchmark".
- **Action**: Justify your choice with at least one comparison data point.

## 3. How to Apply
1.  **Draft** the architecture mentally.
2.  **Search** for key constraints (Price, Limit, Health).
3.  **Refine** the spec based on findings.
4.  **Cite** your sources in the `system_architecture.md` (e.g., "Based on AWS Pricing Page...").
