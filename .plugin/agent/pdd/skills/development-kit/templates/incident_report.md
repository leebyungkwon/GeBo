# Incident Post-Mortem & RCA Report (SRE Standard)

## 1. Incident Metadata
| Key | Value |
| :--- | :--- |
| **Incident ID** | INC-202X-001 |
| **Status** | Resolved / Monitoring / Closed |
| **Severity** | **SEV-1 (Critical)** / SEV-2 (Major) / SEV-3 (Minor) |
| **Date** | 202X-MM-DD |
| **Downtime** | 00 hr 45 min |
| **Lead Responder** | [Name] |

### 🚨 Severity Definitions
- **SEV-1 (Critical)**: Service Down. All users affected. Immediate revenue loss. (Call CTO immediately)
- **SEV-2 (Major)**: Core feature broken. Significant user impact. (Wake up team)
- **SEV-3 (Minor)**: Non-critical bug or performance degradation. (Next business day)
- **SEV-4 (Trivial)**: Cosmetic issue or internal tool glitch.

## 2. Executive Summary
*Briefly describe what happened, the impact, and the root cause in 2-3 sentences.*
> Example: The checkout service API returned 500 errors for 45 minutes due to a database connection pool exhaustion caused by a missing index on the `orders` table.

## 3. Impact Analysis
- **User Impact**: 15% of users (approx. 500) failed to complete purchase.
- **Data Loss**: No permanent data loss.
- **Revenue Impact**: Estimated $5,000 loss.

## 4. Detailed Timeline (UTC)
| Time | Status | Event Description |
| :--- | :--- | :--- |
| 10:00 | **Start** | Deployment `v2.1.0` started. |
| 10:05 | **Detected** | Monitoring alert "High Error Rate > 5%" triggered. |
| 10:15 | **Investigating** | On-call engineer checked logs, found DB timeout errors. |
| 10:30 | **Mitigation** | Rolled back to `v2.0.0`. Error rate dropped. |
| 10:45 | **Resolved** | System fully stabilized. |

## 5. Root Cause Analysis (The 5 Whys)
*Trace the problem to its origin.*

1.  **Why did the API fail?**
    - Because the DB connection pool was exhausted.
2.  **Why was the pool exhausted?**
    - Because queries were taking too long (> 5s) and holding connections.
3.  **Why were queries slow?**
    - Because the new `SELECT * FROM orders` query missed the index.
4.  **Why was the index missing?**
    - Because the migration script `005_add_index.sql` failed during deploy but didn't stop the pipeline.
5.  **Why did the pipeline continue?** (Root Cause)
    - **Because the CI/CD script ignored the exit code of the DB migration tool.**

## 6. Lessons Learned
### What went well?
- Alert triggered within 5 minutes.
- Rollback was fast and effective.

### What went wrong?
- Migration failure was silent in CI logs.
- Load testing didn't catch the slow query (insufficient mock data).

## 7. Action Items (Prevention)
| Priority | Task Description | Owner | Jira Ticket | Due Date |
| :--- | :--- | :--- | :--- | :--- |
| **P0** | Fix CI pipeline to fail on migration error | DevOps | [OPS-101] | Immediate |
| **P1** | Add index to `orders` table | Backend | [BE-205] | Today |
| **P2** | Add database load testing step in CI | QA | [QA-302] | Next Sprint |
