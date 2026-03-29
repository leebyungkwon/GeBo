# Security Guard Checklist (Based on OWASP)

## 1. Injection & Input Validation
- [ ] **Sanitization**: 모든 사용자 입력(Query, Body, Params)을 검증(Validate)하고 정제(Sanitize)하는가?
- [ ] **Parameterized Queries**: SQL 사용 시 PreparedStatement나 ORM을 사용하여 SQL Injection을 방지하는가?

## 2. Authentication & Authorization
- [ ] **No Hardcoded Secrets**: 코드 내에 API Key, Token, Password가 하드코딩되어 있지 않은가? (.env 사용 필수)
- [ ] **Least Privilege**: 데이터베이스나 API 접근 권한이 최소한으로 설정되어 있는가?

## 3. Sensitive Data Exposure
- [ ] **HTTPS**: 모든 통신은 암호화(TLS/SSL)를 가정하고 설계되었는가?
- [ ] **Error Handling**: 에러 메시지에 스택 트레이스나 민감한 내부 정보(DB 구조 등)가 노출되지 않는가?

## 4. Dependencies
- [ ] **Secure Versions**: `package.json`의 라이브러리들이 최신 보안 패치가 적용된 버전을 사용하는가?
