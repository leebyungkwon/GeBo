# Security Design Specification (Threat Model: Unified Standard)

## 1. Document Control
| Version | Date | Author | Reviewer | Status |
| :--- | :--- | :--- | :--- | :--- |
| 1.0 | 202X-MM-DD | [Developer Name] | Security Architect | Draft |

## 2. System Scope & Assets (v3)
### 2.1 Critical Assets
| Asset ID | Asset Name | Classification | Confidentiality | Integrity | Availability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| A-01 | User Credentials | **Confidential** | High | High | High |
| A-02 | Payment Data | **Restricted** | High | High | High |
| A-03 | Product Public Info | Public | Low | High | High |

### 2.2 Data Flow Diagram (DFD)
`User` -> `WAF` -> `Load Balancer` -> `Auth Service` -> `DB`

## 3. Threat Analysis (STRIDE) (v2 + v3)
*Analyze threats using the STRIDE model against the assets.*

### 3.1 Spoofing (Identity)
*   **Threat**: Attacker uses a stolen JWT or creates a fake one without signature.
*   **Checklist**:
    - [ ] Is `alg: 'none'` rejected?
    - [ ] Is the JWT secret strong (RS256)?
*   **Mitigation**: Enforce `verifySignature()` middleware on all routes.

### 3.2 Tampering (Data Integrity)
*   **Threat**: Attacker modifies the `price` field in the HTTP Payload.
*   **Checklist**:
    - [ ] Are input parameters validated against a strict schema (Zod/Joi)?
    - [ ] Is payload signature (HMAC) verified for critical logic?
*   **Mitigation**: Implement `Zod` schema validation middleware.

### 3.3 Repudiation (Non-denial)
*   **Threat**: User claims "I didn't buy this."
*   **Mitigation**: Comprehensive Audit Logs (Who, What, When, IP) stored in immutable storage.

### 3.4 Information Disclosure (Privacy)
*   **Threat**: API returns "Database Connection Error" with IPs.
*   **Mitigation**: Global Error Handler checks `NODE_ENV === 'production'` and returns generic JSON.

### 3.5 Denial of Service (Availability)
*   **Threat**: API flooding (DDoS).
*   **Mitigation**: Rate Limiting (Token Bucket) via Redis.

### 3.6 Elevation of Privilege (Authorization)
*   **Threat**: User ID `1` changes URL to `/users/2` to view other data.
*   **Mitigation**: Check `req.user.id === req.params.id` in controller logic.

## 4. Risk Assessment (DREAD Scoring) (v2)
*Score identified threats to prioritize fixes.*

| Threat ID | **D**amage | **R**eproducibility | **E**xploitability | **A**ffected Users | **D**iscoverability | **Total** | Risk |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| T-01 (SQLi) | 10 | 8 | 8 | 10 | 8 | **44** | **Critical** |
| T-02 (Log) | 2 | 10 | 4 | 2 | 8 | **26** | Medium |

## 5. Compliance & Sign-off (v3)
### 5.1 Compliance Checklist
- [ ] **ISO 27001 (A.14)**: Encryption at rest/transit applied?
- [ ] **GDPR**: "Right to be Forgotten" implemented?
- [ ] **PCI-DSS**: No Credit Card numbers in logs?

### 5.2 Approval
> I certify that the security controls above are implemented and the Residual Risk is accepted.

- **Developer**: ________________ (Sign)
- **Security Lead**: ________________ (Sign)
