# Role DB 상세 설계서

## 1. 개요
시스템에서 사용하는 역할(Role)을 관리하기 위한 데이터베이스 설계입니다.
SUPER_ADMIN, EDITOR 등의 시스템 기본 역할은 삭제 불가(`is_system = true`)하며, 운영자가 커스텀 역할을 추가할 수 있습니다.

---

## 2. 테이블 정의: `role`

| 컬럼명 | 논리명 | 타입 | Nullable | PK/UK | 기본값 | 설명 |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| `id` | 식별자 | BIGINT | N | PK | AI | Auto Increment |
| `code` | 역할코드 | VARCHAR(30) | N | UK | | 영문 대문자·숫자·`_` 조합 (e.g. `SUPER_ADMIN`) |
| `display_name` | 표시명 | VARCHAR(20) | N | | | 화면에 표시되는 역할 이름 |
| `description` | 설명 | VARCHAR(100) | Y | | | 역할에 대한 부가 설명 |
| `color` | 색상 | VARCHAR(7) | N | | `#6b7280` | Hex 색상 코드 |
| `is_system` | 시스템여부 | BOOLEAN | N | | `false` | true이면 삭제 불가 |
| `created_at` | 등록일시 | TIMESTAMP | N | | | JPA Auditing 자동 관리 |
| `updated_at` | 수정일시 | TIMESTAMP | N | | | JPA Auditing 자동 관리 |

---

## 3. 인덱스 설계

| 인덱스명 | 컬럼 | 종류 | 목적 |
| :--- | :--- | :--- | :--- |
| `PK_ROLE` | `id` | PK | 기본 식별 |
| `UK_ROLE_CODE` | `code` | UNIQUE | 역할 코드 중복 방지 |
| `IDX_ROLE_IS_SYSTEM` | `is_system` | INDEX | 시스템 역할 필터링 최적화 |

---

## 4. 초기 데이터 (System Roles)

| code | display_name | color | is_system |
| :--- | :--- | :--- | :---: |
| `SUPER_ADMIN` | 최고 관리자 | `#4361ee` | true |
| `EDITOR` | 편집자 | `#6b7280` | true |

---

## 5. 제약 사항

- `code`는 중복될 수 없으며 영문 대문자, 숫자, `_`만 허용
- `is_system = true`인 역할은 DELETE API 호출 시 서비스 레이어에서 거부
- `admin_user.role` 컬럼이 `role.code`를 참조 (현재 String FK, 추후 정규화 고려)
- `created_at`, `updated_at`은 JPA Auditing(`@CreatedDate`, `@LastModifiedDate`)으로 자동 관리

---

## 6. admin_user 테이블과의 관계

```
admin_user.role (VARCHAR) ──참조──▶ role.code (VARCHAR, UNIQUE)
```

> 현재 물리적 FK 제약 없이 애플리케이션 레벨에서 관리.
> `deleteRole()` 시 `adminRepository.countByRole(code)` 로 사용 인원 검증 후 삭제 허용.
