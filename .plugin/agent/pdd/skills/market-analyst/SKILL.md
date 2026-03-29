---
name: market-analyst
type: Skill
phase: Pre-Plan
description: |
  A skill for conducting systematic market research.
  Focuses on finding direct competitors and analyzing their feature sets.

  Tools:
  - Web Search (search_web)
---

# Market Analyst Skill Instructions

## 1. When to use this skill
- At the very beginning of the project (Phase 0).
- Before the Product Manager writes requirements.

## 2. Research Strategy (Advanced)
### 🔍 Level 1: Broad Search (Competitor Hunt)
- Queries: `Best [Service] alternatives`, `[Service] pricing`, `[Service] features`
- Goal: Landscape Map (누가 1등이고 누가 2등인가?)

### 🔬 Level 2: Deep Dive (Evidence Gathering)
- **User Sentiment**:
  - `site:reddit.com "[App Name] sucks"`, `site:twitter.com "[App Name] bug"`
  - *Goal*: Find real pain points, not marketing fluff.
- **Academic/Tech**:
  - `site:arxiv.org [Keyword]`, `site:medium.com "how [App] works"`
  - *Goal*: Technical feasibility and algorithm trends.
- **Business**:
  - `[App Name] pitch deck`, `[App Name] revenue 2024`
  - *Goal*: Understand their specific Business Model.

### 📖 Level 3: Content Extraction
- Do not rely on search snippets.
- **Action**: Use `ReadURL` to fetch the full content of insightful blog posts or reports.
- **Synthesis**: Cross-check conflicting data.

## 3. How to Apply (Strict Process)
1.  **Generate Plan**: Run the following command to get your "Attack Vector".
    ```bash
    node scripts/generate_research_plan.js "Key Competitor Name"
    ```
2.  **Execute Search**: Copy-paste the generated queries into `search_web`.
3.  **Read & Analyze**: Use `ReadURL` for promising results.
4.  **Synthesize**: Report findings in `market_analysis.md`.
