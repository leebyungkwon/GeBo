---
name: development-kit
type: Skill
phase: Develop
description: |
  Essential toolkit for production-grade software development.
  Focuses on Code Quality (Clean Code), Security (OWASP), and Testing (TDD).
  Prevents "working but messy" or "insecure" code.

  Tools:
  - Security Checklist (OWASP Top 10)
  - Advanced Code/Architecture Audit (SOLID, Immutability)
  - Technical Spec (RFC Template)
  - TDD Spec Template

# Development Skill Instructions

## 1. When to use this skill
- **Before coding**: Write a `tech_spec.md` first. (RFC process)
- **During coding**: Follow `clean_code.md` (SOLID, Types).
- **Before commit**: Run `security_owasp.md`.

## 2. Resources
### 📄 Templates
- **Tech Spec (RFC)**: `templates/tech_spec.md`
- **Threat Model (STRIDE)**: `templates/threat_model.md`
    - Security risk analysis before coding.
- **TDD Spec**: `templates/tdd_spec.md`
- **Incident Report (RCA)**: `templates/incident_report.md`
    - Post-mortem analysis for bugs/outages.

### 📘 Engineering Guides
- **Database Rules**: `guides/database_engineering.md`
    - Schema design & Indexing strategy.
- **REST API Standard**: `guides/api_standard.md`
- **Error Handling**: `guides/error_handling.md`
- **TypeScript Rules**: `guides/typescript_standard.md`
    - Strict Config, Utility Types, No-Any policy.
- **API Security Hardening**: `guides/api_security.md`
    - JWT, CORS, Rate Limiting standards.
- **REST API Standard**: `guides/api_standard.md`
    - Naming convention & Error response format.

### ✅ Checklists
- **Architecture & Clean Code**: `checklists/clean_code.md`
    - SOLID, Layered Architecture.
- **Security**: `checklists/security_owasp.md`
- **Production Ready**: `checklists/production_readiness.md`

- **README**: `templates/readme_standard.md`
    - Professional documentation structure.

## 3. How to Apply
1.  **Plan Tests**: Use the TDD Spec to define what to test before coding.
2.  **Implement**: Write code following the Clean Code Audit points.
3.  **Secure**: Verify against the Security Guard checklist.
4.  **Launch**: Finalize with Product Readiness Checklist (Docker/CI).
