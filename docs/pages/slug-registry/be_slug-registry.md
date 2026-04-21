# Slug 레지스트리 BE 상세 설계서

## 1. 개요
- **도메인**: Slug 레지스트리(SlugRegistry) — 위젯 빌더 연동용 slug 사전 등록/관리 CRUD
- **DB 설계**: [db_slug-registry.md](../../db/slug-registry/db_slug-registry.md)
- **패키지 경로**: `com.ge.bo`

---

## 2. 파일 구조

```
com.ge.bo/
├── entity/
│   └── SlugRegistry.java
├── dto/
│   ├── SlugRegistryRequest.java       # 등록/수정 요청
│   └── SlugRegistryResponse.java      # 응답
├── repository/
│   └── SlugRegistryRepository.java
├── service/
│   └── SlugRegistryService.java
└── controller/
    └── SlugRegistryController.java
```

---

## 3. 엔티티 설계

### 3.1 SlugRegistry

| 필드 | 컬럼 | 타입 (Java) | 매핑 | 설명 |
|:---|:---|:---|:---|:---|
| id | id | Long | @Id, AUTO_INCREMENT | PK |
| slug | slug | String | @Column(length=100, unique=true, NOT NULL) | slug 값 (시스템 유일) |
| name | name | String | @Column(length=100, NOT NULL) | slug 별칭 |
| type | type | String | @Column(length=20, NOT NULL) | 용도 구분 (PAGE_DATA / PAGE_TEMPLATE / ETC) |
| description | description | String | @Column(columnDefinition="TEXT", NULL) | 상세 설명 |
| active | active | Boolean | @Column(NOT NULL, default=true) | 사용여부 |
| createdBy~updatedAt | - | - | @CreatedBy/@CreatedDate/@LastModifiedBy/@LastModifiedDate | 감사 컬럼 |

### 3.2 DTO

**SlugRegistryRequest** (등록/수정):

| 필드 | 타입 | 필수 | Bean Validation | 비고 |
|:---|:---|:---|:---|:---|
| slug | String | Y | @NotBlank, @Size(max=100), @Pattern(^[a-zA-Z0-9_-]+$) | 영문/숫자/하이픈/언더스코어만 허용 |
| name | String | Y | @NotBlank, @Size(max=100) | slug 별칭 |
| type | String | Y | @NotBlank, @Pattern(^(PAGE_DATA\|PAGE_TEMPLATE\|ETC)$) | 용도 구분 |
| description | String | N | - | 상세 설명 |
| active | Boolean | N | - | 미입력 시 true |

**SlugRegistryResponse**:

| 필드 | 타입 | 설명 |
|:---|:---|:---|
| id | Long | PK |
| slug | String | slug 값 |
| name | String | slug 별칭 |
| type | String | 용도 구분 |
| description | String | 상세 설명 |
| active | Boolean | 사용여부 |
| createdBy | String | 등록자 |
| createdAt | LocalDateTime | 등록일시 |
| updatedBy | String | 수정자 |
| updatedAt | LocalDateTime | 수정일시 |

---

## 4. API 엔드포인트 명세

| Method | URL | 설명 | 권한 | 트랜잭션 | 성공 코드 |
|:---|:---|:---|:---|:---|:---|
| GET | `/api/v1/slug-registry` | 목록 조회 (페이징 + 필터) | SUPER_ADMIN | readOnly | 200 |
| GET | `/api/v1/slug-registry/active` | 활성 slug 전체 목록 (위젯 빌더용, 페이징 없음) | 인증 사용자 | readOnly | 200 |
| GET | `/api/v1/slug-registry/{id}` | 단건 조회 | SUPER_ADMIN | readOnly | 200 |
| POST | `/api/v1/slug-registry` | 등록 | SUPER_ADMIN | REQUIRED | 201 |
| PUT | `/api/v1/slug-registry/{id}` | 수정 | SUPER_ADMIN | REQUIRED | 200 |
| DELETE | `/api/v1/slug-registry/{id}` | 삭제 | SUPER_ADMIN | REQUIRED | 204 |

### 4.1 GET `/api/v1/slug-registry` — 목록 조회

**Query Parameters:**

| 파라미터 | 타입 | 필수 | 설명 |
|:---|:---|:---|:---|
| page | int | N | 페이지 번호 (0-based, 기본 0) |
| size | int | N | 페이지 크기 (기본 20) |
| type | String | N | 용도 구분 필터 (PAGE_DATA / PAGE_TEMPLATE / ETC) |
| keyword | String | N | slug / name 부분 검색 |

**Response Body (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "slug": "boardListSave",
      "name": "게시판 목록",
      "type": "PAGE_DATA",
      "description": "게시판 목록 데이터 저장용 slug",
      "active": true,
      "createdBy": "system",
      "createdAt": "2025-01-01T00:00:00",
      "updatedBy": "system",
      "updatedAt": "2025-01-01T00:00:00"
    }
  ],
  "totalElements": 5,
  "totalPages": 1,
  "size": 20,
  "number": 0
}
```

### 4.2 GET `/api/v1/slug-registry/active` — 활성 목록 (위젯 빌더용)

- 페이징 없이 `active=true`인 전체 목록 반환
- slug ASC 정렬

**Response Body (200 OK):**
```json
[
  { "id": 1, "slug": "boardListSave", "name": "게시판 목록", "type": "PAGE_DATA", "active": true },
  { "id": 2, "slug": "board-search",  "name": "게시판 검색", "type": "PAGE_DATA", "active": true }
]
```

### 4.3 POST `/api/v1/slug-registry` — 등록

**Request Body:**
```json
{
  "slug": "boardListSave",
  "name": "게시판 목록",
  "type": "PAGE_DATA",
  "description": "게시판 목록 저장용 slug",
  "active": true
}
```

**Response (201 Created):** SlugRegistryResponse

### 4.4 PUT `/api/v1/slug-registry/{id}` — 수정

**Request Body:** SlugRegistryRequest (전체 필드)
**Response (200 OK):** SlugRegistryResponse

### 4.5 DELETE `/api/v1/slug-registry/{id}` — 삭제

**Response (204 No Content)**

---

## 5. 비즈니스 로직 상세

### 5.1 등록

```mermaid
flowchart TD
    A[POST /slug-registry] --> B[@Valid 검증]
    B -- 실패 --> C[400 VALIDATION_FAILED]
    B -- 성공 --> D[slug 중복 확인]
    D -- 중복 --> E[409 SLUG_REGISTRY_SLUG_DUPLICATE]
    D -- 없음 --> F[엔티티 저장]
    F --> G[201 Created]
```

**핵심 비즈니스 규칙:**
1. slug 중복 시 409 Conflict
2. slug 영문/숫자/하이픈/언더스코어만 허용 (Bean Validation @Pattern)
3. active 미입력 시 기본값 true

### 5.2 수정

**핵심 비즈니스 규칙:**
1. id로 존재 확인 → 없으면 404
2. slug 수정 시 다른 레코드와 중복 확인 (자기 자신 제외)
3. 모든 필드 수정 가능

### 5.3 삭제

**핵심 비즈니스 규칙:**
1. id로 존재 확인 → 없으면 404
2. 단건 삭제

---

## 6. Validation 상세

### 6.1 Controller 레벨 (Bean Validation)

| 필드 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|
| slug | @NotBlank, @Size(max=100), @Pattern(^[a-zA-Z0-9_-]+$) | slug는 영문/숫자/하이픈/언더스코어만 가능합니다. |
| name | @NotBlank, @Size(max=100) | slug 별칭을 입력해주세요. |
| type | @NotBlank, @Pattern(^(PAGE_DATA\|PAGE_TEMPLATE\|ETC)$) | 올바른 타입을 입력해주세요. |

### 6.2 Service 레벨 (비즈니스 Validation)

| 검증 항목 | HTTP | Error Code | 에러 메시지 |
|:---|:---|:---|:---|
| slug 중복 | 409 | SLUG_REGISTRY_SLUG_DUPLICATE | 이미 사용 중인 slug입니다. |
| 레코드 없음 | 404 | SLUG_REGISTRY_NOT_FOUND | 해당 slug를 찾을 수 없습니다. |

---

## 7. 예외 매핑 테이블

| 예외 상황 | HTTP | Error Code | 사용자 메시지 |
|:---|:---|:---|:---|
| slug 없음 | 404 | SLUG_REGISTRY_NOT_FOUND | 해당 slug를 찾을 수 없습니다. |
| slug 중복 | 409 | SLUG_REGISTRY_SLUG_DUPLICATE | 이미 사용 중인 slug입니다. |
| 권한 부족 | 403 | FORBIDDEN | 접근 권한이 없습니다. |
| Validation 실패 | 400 | VALIDATION_FAILED | (필드별 메시지) |

---

## 8. 보안 매트릭스

| API | Method | 권한 | 비고 |
|:---|:---|:---|:---|
| `/api/v1/slug-registry` | GET, POST, PUT, DELETE | `ROLE_SUPER_ADMIN` | 관리 기능 |
| `/api/v1/slug-registry/active` | GET | 인증 사용자 | 위젯 빌더 드롭다운 용도 |

---

## 9. Repository 쿼리 설계

| 메서드명 | 용도 |
|:---|:---|
| `findAll(Specification, Pageable)` | 필터 + 페이징 목록 조회 |
| `findAllByActiveTrueOrderBySlugAsc()` | 위젯 빌더용 활성 목록 |
| `existsBySlug(String)` | slug 중복 확인 (등록 시) |
| `existsBySlugAndIdNot(String, Long)` | slug 중복 확인 (수정 시, 자기 자신 제외) |

---

## 10. DataInitializer 처리

기존 `DataInitializer`에 추가:
- `initSlugRegistry()` — count > 0이면 스킵 (멱등성 보장)
- 초기 데이터: `boardListSave`(게시판 목록, PAGE_DATA), `board-search`(게시판 검색, PAGE_DATA)
- `initSlugRegistryMenu()` — `/admin/settings/slug-registry` URL 없으면 Settings 하위에 메뉴 등록

---

## 11. BE 개발 체크리스트

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 11.1 엔티티 및 DB
- [ ] SlugRegistry 엔티티의 모든 필드가 설계서와 일치하는가?
- [ ] slug에 UNIQUE 제약이 적용되었는가?
- [ ] 감사 컬럼 4개가 JPA Auditing으로 자동 설정되는가?
- [ ] DataInitializer에 초기 slug 데이터가 포함되었는가?
- [ ] DataInitializer에 메뉴 등록이 포함되었는가?
- [ ] 중복 실행 시 에러가 없는가? (멱등성)

### 11.2 API 엔드포인트
- [ ] GET `/api/v1/slug-registry` — 페이징 + 필터 조회가 구현되었는가?
- [ ] GET `/api/v1/slug-registry/active` — 활성 목록 전체 조회가 구현되었는가?
- [ ] GET `/api/v1/slug-registry/{id}` — 단건 조회가 구현되었는가?
- [ ] POST `/api/v1/slug-registry` — 등록이 구현되었는가?
- [ ] PUT `/api/v1/slug-registry/{id}` — 수정이 구현되었는가?
- [ ] DELETE `/api/v1/slug-registry/{id}` — 삭제가 구현되었는가?
- [ ] POST 성공 시 HTTP 201을 반환하는가?
- [ ] DELETE 성공 시 HTTP 204를 반환하는가?

### 11.3 비즈니스 로직
- [ ] slug 중복 시 409가 발생하는가? (등록/수정 모두)
- [ ] 수정 시 자기 자신 slug는 중복 허용되는가?
- [ ] active=false slug는 /active 목록에 미포함되는가?

### 11.4 보안
- [ ] /slug-registry (관리) — ROLE_SUPER_ADMIN 권한이 적용되었는가?
- [ ] /slug-registry/active — 인증 사용자면 접근 가능한가?

### 11.5 FE 연동 테스트
- [ ] 목록 조회: 페이지 진입 시 slug 목록이 정상 표시되는가?
- [ ] type 필터: 선택 시 해당 타입만 표시되는가?
- [ ] 키워드 검색: slug/name 부분 검색이 동작하는가?
- [ ] 등록: slug 중복 시 409 에러 토스트가 표시되는가?
- [ ] 위젯 빌더: connectedSlug 드롭다운에 active slug가 표시되는가?
