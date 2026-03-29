# [권한 관리] BE 상세 설계서

> 디자인 시안: `design_roles.md` 참조 (이미지 파일 없음)

---

## 1. 개요

| 항목 | 내용 |
| :--- | :--- |
| 기능명 | 역할(Role) CRUD 관리 |
| 경로 | `GET/POST/PATCH/DELETE /api/v1/roles` |
| 접근 권한 | **SUPER_ADMIN 전용** (EDITOR 접근 불가) |
| DB 설계서 | `docs/db/roles/db_roles.md` |

---

## 2. 패키지 구조

```
com.ge.bo
├── controller/
│   └── RoleController.java
├── service/
│   └── RoleService.java
├── repository/
│   └── RoleRepository.java
├── entity/
│   └── Role.java
└── dto/
    └── RoleDto.java
        ├── CreateRequest
        ├── UpdateRequest
        └── Response
```

---

## 3. API 명세

### 3.1 전체 역할 목록 조회
| 항목 | 내용 |
| :--- | :--- |
| Method | `GET` |
| Path | `/api/v1/roles` |
| 응답 | `List<RoleDto.Response>` |
| 트랜잭션 | `@Transactional(readOnly = true)` |

**Response Body:**
```json
[
  {
    "id": 1,
    "code": "SUPER_ADMIN",
    "displayName": "최고 관리자",
    "description": "모든 기능에 접근 가능",
    "color": "#4361ee",
    "isSystem": true,
    "memberCount": 3
  }
]
```

---

### 3.2 역할 생성
| 항목 | 내용 |
| :--- | :--- |
| Method | `POST` |
| Path | `/api/v1/roles` |
| 권한 | SUPER_ADMIN |
| 트랜잭션 | `@Transactional` |

**Request Body:**
```json
{
  "code": "CONTENT_MANAGER",
  "displayName": "콘텐츠 매니저",
  "description": "콘텐츠 관리 전담",
  "color": "#10b981"
}
```

**비즈니스 로직:**
1. `code` 중복 여부 확인 → 중복 시 `400 BAD_REQUEST`
2. `code` 자동 대문자 변환
3. `isSystem = false` 고정
4. 저장 후 `RoleDto.Response` 반환

---

### 3.3 역할 수정
| 항목 | 내용 |
| :--- | :--- |
| Method | `PATCH` |
| Path | `/api/v1/roles/{id}` |
| 권한 | SUPER_ADMIN |
| 트랜잭션 | `@Transactional` |

**Request Body:**
```json
{
  "displayName": "콘텐츠 매니저",
  "description": "수정된 설명",
  "color": "#8b5cf6"
}
```

**비즈니스 로직:**
- `code` 변경 불가 (수정 대상 필드: `displayName`, `description`, `color`)
- 존재하지 않는 `id` → `404 NOT_FOUND`

---

### 3.4 역할 삭제
| 항목 | 내용 |
| :--- | :--- |
| Method | `DELETE` |
| Path | `/api/v1/roles/{id}` |
| 권한 | SUPER_ADMIN |
| 트랜잭션 | `@Transactional` |

**비즈니스 로직:**
1. 존재하지 않는 `id` → `404 NOT_FOUND`
2. `isSystem = true` → `400 BAD_REQUEST` ("시스템 기본 역할은 삭제할 수 없습니다.")
3. `adminRepository.countByRole(code) > 0` → `409 CONFLICT` ("해당 역할을 사용 중인 관리자가 N명 있습니다.")
4. 검증 통과 시 삭제

---

## 4. BE Validation (입력값 검증)

### 4.1 CreateRequest

| 필드 | 어노테이션 | 규칙 | 오류 메시지 |
| :--- | :--- | :--- | :--- |
| `code` | `@NotBlank` | 필수 입력 | "역할 코드를 입력해주세요." |
| `code` | `@Size(min=2, max=30)` | 2~30자 | "역할 코드는 2자 이상 30자 이하여야 합니다." |
| `code` | `@Pattern(regexp="^[A-Z0-9_]+$")` | 영문 대문자·숫자·`_`만 허용 | "영문 대문자, 숫자, _만 입력 가능합니다." |
| `displayName` | `@NotBlank` | 필수 입력 | "표시명을 입력해주세요." |
| `displayName` | `@Size(max=20)` | 최대 20자 | "표시명은 20자 이하여야 합니다." |
| `description` | `@Size(max=100)` | 최대 100자 (선택) | "설명은 100자 이하여야 합니다." |
| `color` | `@NotBlank` | 필수 입력 | "색상을 선택해주세요." |
| `color` | `@Pattern(regexp="^#[0-9a-fA-F]{6}$")` | Hex 색상 형식 | "올바른 색상 형식이 아닙니다." |

### 4.2 UpdateRequest

| 필드 | 어노테이션 | 규칙 | 오류 메시지 |
| :--- | :--- | :--- | :--- |
| `displayName` | `@NotBlank` | 필수 입력 | "표시명을 입력해주세요." |
| `displayName` | `@Size(max=20)` | 최대 20자 | "표시명은 20자 이하여야 합니다." |
| `description` | `@Size(max=100)` | 최대 100자 (선택) | "설명은 100자 이하여야 합니다." |
| `color` | `@NotBlank` | 필수 입력 | "색상을 선택해주세요." |
| `color` | `@Pattern(regexp="^#[0-9a-fA-F]{6}$")` | Hex 색상 형식 | "올바른 색상 형식이 아닙니다." |

### 4.3 Controller 적용

```java
@PostMapping
public ResponseEntity<RoleDto.Response> createRole(@Valid @RequestBody RoleDto.CreateRequest request) { ... }

@PatchMapping("/{id}")
public ResponseEntity<RoleDto.Response> updateRole(@PathVariable Long id, @Valid @RequestBody RoleDto.UpdateRequest request) { ... }
```

> 검증 실패 시 `GlobalExceptionHandler`에서 `MethodArgumentNotValidException` → `400 BAD_REQUEST` 반환

---

## 6. 보안 매트릭스

| API | 허용 Role | 비고 |
| :--- | :--- | :--- |
| `GET /api/v1/roles` | SUPER_ADMIN | ⚠️ 현재 미적용 — Spring Security 설정 필요 |
| `POST /api/v1/roles` | SUPER_ADMIN | ⚠️ 현재 미적용 |
| `PATCH /api/v1/roles/{id}` | SUPER_ADMIN | ⚠️ 현재 미적용 |
| `DELETE /api/v1/roles/{id}` | SUPER_ADMIN | ⚠️ 현재 미적용 |

> **개선 필요:** `SecurityConfig`에서 `/api/v1/roles/**` 경로에 `SUPER_ADMIN` 권한 제한 추가 필요

---

## 7. 트랜잭션 전략

| 메서드 | 전파 속성 | readOnly | 비고 |
| :--- | :--- | :---: | :--- |
| `getAllRoles()` | `REQUIRED` | ✅ | 조회 전용 최적화 |
| `createRole()` | `REQUIRED` | ❌ | 단일 테이블 쓰기 |
| `updateRole()` | `REQUIRED` | ❌ | 단일 테이블 쓰기 |
| `deleteRole()` | `REQUIRED` | ❌ | 검증 + 삭제 원자성 보장 |

---

## 8. 예외 매핑

| 예외 상황 | HTTP Status | Error Code | 사용자 메시지 |
| :--- | :---: | :--- | :--- |
| 역할 코드 중복 | 400 | `DUPLICATE_ROLE_CODE` | "이미 사용 중인 역할 코드입니다." |
| 역할 미존재 | 404 | `ROLE_NOT_FOUND` | "역할을 찾을 수 없습니다." |
| 시스템 역할 삭제 | 400 | `SYSTEM_ROLE` | "시스템 기본 역할은 삭제할 수 없습니다." |
| 사용 중인 역할 삭제 | 409 | `ROLE_IN_USE` | "해당 역할을 사용 중인 관리자가 N명 있습니다." |
| 권한 없음 | 403 | `AUTH_001` | "접근 권한이 없습니다." |

---

## 9. 미구현 / 개선 필요 사항

| 항목 | 현황 | 개선 방향 |
| :--- | :--- | :--- |
| SUPER_ADMIN 권한 체크 | ❌ 미적용 | `SecurityConfig`에 경로별 Role 제한 추가 |
| `memberCount` 조회 성능 | 매 응답마다 `COUNT` 쿼리 실행 | 캐싱 또는 JOIN 쿼리로 최적화 고려 |
| `admin_user.role` FK | String 참조, 물리 FK 없음 | 추후 `role_id` FK 컬럼으로 정규화 고려 |
