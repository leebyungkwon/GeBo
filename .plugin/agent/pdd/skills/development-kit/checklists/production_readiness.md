# Production Readiness Checklist (Launch Control)

## 1. DevOps & Infrastructure
- [ ] **Dockerized**: `Dockerfile`이 존재하고 정상적으로 빌드되는가?
- [ ] **CI Pipeline**: `.github/workflows/ci.yml`이 테스트와 린트를 통과하는가?
- [ ] **Health Check**: `/health` 또는 `/api/status` 엔드포인트가 구현되어 있는가?
- [ ] **Environment**: `.env.example`이 제공되고, 실제 비밀키(`Secrets`)는 제외되었는가?

## 2. Performance (Optimization)
- [ ] **Bundle Size**: 프론트엔드 빌드 사이즈가 합리적인가? (불필요한 라이브러리 제거)
- [ ] **Database Index**: 자주 조회되는 쿼리 컬럼에 DB 인덱스가 걸려있는가?
- [ ] **Caching**: 정적 리소스(Image, CSS)에 적절한 캐시 헤더(Cache-Control)가 설정되었는가?
- [ ] **Lazy Loading**: 스크롤 아래 있는 이미지나 컴포넌트는 Lazy Load 되는가?

## 3. Observability (Logging)
- [ ] **Structured Log**: `console.log` 대신 구조화된 로거(`winston`, `pino`)를 사용하는가?
- [ ] **Error Tracking**: 치명적 에러 발생 시 알림을 보낼 준비가 되었는가? (Sentry 등 연동 준비)

## 4. API Standardization
- [ ] **OpenAPI Spec**: API 명세서(`openapi.yaml/json`)가 최신 상태인가?
- [ ] **Status Codes**: 성공(2xx), 클라이언트 에러(4xx), 서버 에러(5xx)를 정확히 구분해서 반환하는가?
