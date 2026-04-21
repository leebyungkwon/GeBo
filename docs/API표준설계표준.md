API 표준 설계
1. 개요 및 핵심 설계 철학
본 문서는 내부 시스템과 외부 파트너가 일관되고 신뢰할 수 있는 방식으로 연동할 수 있도록 돕는 RESTful API 설계 표준 가이드라인입니다.
1.1. 설계 원칙
•	API-First (설계 우선): 코드 구현 전 OpenAPI(Swagger)와 같은 표준 규격으로 API 설계를 선행하고, 이를 단일 진실 공급원(Single Source of Truth)으로 삼아 병렬 개발을 진행합니다.
•	API-as-a-Product (제품으로서의 API): API는 단순한 통합 기술이 아닌 소비자를 위한 '제품'입니다. 개발자 경험(DX)을 최우선으로 하여, 내부 로직을 노출하지 않는 직관적인 인터페이스(Outside-In)를 구성해야 합니다.
•	RESTful 원칙 준수: 리소스 중심의 아키텍처를 채택하며, 클라이언트-서버 분리, 무상태성(Stateless), 표준 HTTP 메서드 활용 원칙을 엄격히 따릅니다.

2. URI 및 엔드포인트 설계
URI는 리소스의 고유한 식별자이자 API의 네비게이션 역할을 합니다. 개발자가 예측 가능하도록 직관적이고 일관성 있게 구성해야 합니다.
2.1. 명명 규칙 (Naming Conventions)
•	명사 사용: URI는 조작 대상(리소스)만을 나타내는 명사로 구성하며, 동사를 포함해서는 안 됩니다. 행위는 HTTP 메서드로 표현합니다.
•	복수형 우선: 리소스 이름은 컬렉션과 개별 항목을 명확히 아우를 수 있도록 항상 복수형을 사용합니다.
•	소문자와 하이픈: URI는 소문자만 사용하며, 단어 구분 시 가독성을 위해 하이픈(-, Kebab-case)을 사용합니다. 언더스코어(_)나 카멜 케이스(camelCase)는 사용하지 않습니다.
2.2. 계층 구조와 평면화 (Flattening)
•	중첩 깊이 제한: 리소스 간 관계가 복잡해지면 URL이 지나치게 길어지므로, 최대 컬렉션/아이템/컬렉션 뎁스(2단계)로 제한합니다.
•	관계가 그 이상 깊어질 경우, 하위 리소스를 독립적인 최상위 엔드포인트로 평면화(Flatten) 합니다.

[예시]
•	Good: GET /users, GET /users/123/orders (명사 및 복수형, 적절한 중첩)
•	Good: GET /orders/99/products (평면화된 구조)
•	Bad: POST /create-user, GET /getUsers (동사 사용)
•	Bad: GET /users/123/orders/99/products (지나친 중첩)

3. HTTP 메서드 활용 (HTTP Methods)
HTTP 메서드는 리소스에 대한 CRUD(생성, 조회, 수정, 삭제) 작업을 정의하며, 각 메서드의 **안정성(Safe)**과 **멱등성(Idempotency)**을 보장해야 합니다.
메서드	의미 및 용도	응답 코드 (성공 시)
GET	특정 리소스나 컬렉션을 조회할 때 사용합니다.	200 OK
POST	새 리소스를 생성하거나, REST로 표현하기 어려운 복잡한 작업을 수행할 때 사용합니다.	201 Created / 200 OK
PUT	기존 리소스를 전체 교체(Replace) 하거나, 존재하지 않으면 생성할 때 사용합니다.	200 OK / 204 No Content
PATCH	기존 리소스의 부분 수정(Partial Update) 을 수행할 때 사용합니다.	200 OK
DELETE	기존 리소스를 삭제할 때 사용합니다.	204 No Content / 200 OK

4. 데이터 포맷 및 규격
응답 및 요청 데이터의 일관된 형태는 클라이언트 개발의 복잡도를 낮춥니다.
•	JSON 기본 사용: API의 기본 요청 및 응답 포맷은 application/json이어야 합니다.
•	명명 규칙: JSON 객체의 속성 키(Key)는 카멜 케이스(camelCase) 혹은 조직 표준에 따라 스네이크 케이스(snake_case)를 일관되게 적용합니다.
•	날짜/시간 표준: 모든 날짜 및 시간 데이터는 RFC 3339 (예: 2024-01-01T15:00:00.000Z) 규격을 따릅니다.
•	최상위 객체 래핑: 응답 본문의 최상위 레벨은 배열([...])이 아닌 객체({...}) 구조를 권장합니다. 컬렉션 반환 시 {"data": [...]}와 같이 명명된 속성 안에 포함시킵니다.
 
5. HTTP 상태 코드 및 오류 처리
표준 HTTP 상태 코드를 반환하여 요청의 성공/실패 여부를 명확하게 알리고, 오류 발생 시 디버깅이 가능하도록 구조화된 JSON 응답을 제공합니다.

5.1. 주요 상태 코드
•	2xx (성공): 200 OK(성공), 201 Created(생성 성공), 202 Accepted(비동기 작업 수락), 204 No Content(반환할 본문 없음).
•	4xx (클라이언트 오류): 400 Bad Request(입력 파라미터/형식 오류), 401 Unauthorized(인증 실패), 403 Forbidden(권한 부족), 404 Not Found(리소스 없음), 409 Conflict(비즈니스 로직 충돌/중복), 422 Unprocessable Entity(유효성 검증 실패), 429 Too Many Requests(속도 제한 초과).
•	5xx (서버 오류): 500 Internal Server Error(서버 내부 장애), 503 Service Unavailable(일시적 서비스 불가).

5.2. 표준화된 에러 응답 규격 (Error Response Payload)
오류 발생 시 클라이언트 측에서 기계적으로 파싱하고 원인을 파악할 수 있도록 일관된 에러 페이로드를 제공합니다. 절대 서버의 스택 트레이스(Stack Trace)나 내부 시스템 세부 사항을 노출해서는 안 됩니다.
[권장 에러 페이로드 구조]
{
  "error": {
    "code": "INVALID_PARAMETER",
    "message": "입력 데이터 유효성 검증에 실패했습니다.",
    "target": "email",
    "details": [
      {
        "code": "FORMAT_ERROR",
        "message": "올바른 이메일 형식이 아닙니다.",
        "target": "email"
      }
    ]
  }
}

6. API 보안 아키텍처 (Security)
강력한 'Security by Design'을 적용하여 데이터와 시스템을 보호해야 합니다.
•	전송 계층 보안: 모든 API 통신은 TLS 1.2 이상을 적용한 HTTPS를 통해서만 이루어져야 합니다. HTTP 요청은 거부해야 합니다.
•	인증 및 인가 (AuthN/AuthZ): API 키 또는 사용자 자격 증명은 절대 URL(Query Parameter 등)에 노출하지 않습니다. API 접근은 OAuth 2.0 프로토콜 기반의 토큰(예: JWT)을 발급받아 Authorization: Bearer <token> 헤더를 통해 인증합니다.
•	접근 제어 최소화 원칙 (Least Privilege): 발급된 토큰의 접근 범위(Scope)와 수명을 최소한으로 제한합니다.
•	속도 제한 (Rate Limiting): DoS 공격 및 자원 고갈을 방지하기 위해 API 게이트웨이 레벨에서 호출 빈도를 제한하고, 초과 시 429 Too Many Requests 상태 코드 및 Retry-After 헤더를 반환합니다

