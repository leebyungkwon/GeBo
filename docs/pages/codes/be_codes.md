# 공통코드 관리 BE 상세 설계서

## 1. 개요
- **도메인**: 공통코드(CodeGroup + CodeDetail) — 시스템 코드성 데이터 CRUD
- **DB 설계**: [db_codes.md](../../db/codes/db_codes.md)
- **FE 설계**: [fe_codes.md](./fe_codes.md)
- **패키지 경로**: `com.ge.bo`

---

## 2. 파일 구조

```
com.ge.bo/
├── entity/
│   ├── CodeGroup.java
│   └── CodeDetail.java
├── dto/
│   ├── CodeGroupRequest.java      # 그룹 생성/수정 요청
│   ├── CodeGroupResponse.java     # 그룹 응답 (상세 목록 포함)
│   ├── CodeDetailRequest.java     # 코드 생성/수정 요청
│   └── CodeDetailResponse.java    # 코드 응답
├── repository/
│   ├── CodeGroupRepository.java
│   └── CodeDetailRepository.java
├── service/
│   └── CodeService.java
└── controller/
    └── CodeController.java
```

---

## 3. 엔티티 설계

### 3.1 CodeGroup

| 필드 | 컬럼 | 타입 (Java) | 매핑 | 설명 |
|:---|:---|:---|:---|:---|
| id | id | Long | @Id, AUTO_INCREMENT | PK |
| groupCode | group_code | String | @Column(length=30, UNIQUE, NOT NULL) | 그룹코드 |
| groupName | group_name | String | @Column(length=50, NOT NULL) | 그룹명 |
| description | description | String | @Column(length=200, NULL) | 설명 |
| active | active | Boolean | @Column(NOT NULL, default=true) | 사용여부 |
| details | - | List\<CodeDetail\> | @OneToMany(mappedBy, cascade=ALL, orphanRemoval) | 하위 코드 |
| createdBy~updatedAt | - | - | @CreatedBy/@CreatedDate/@LastModifiedBy/@LastModifiedDate | 감사 컬럼 |

**제약조건:**
- UNIQUE: `group_code`
- details: `@OrderBy("sortOrder ASC")`
- 생성 후 `groupCode`는 수정 불가

### 3.2 CodeDetail

| 필드 | 컬럼 | 타입 (Java) | 매핑 | 설명 |
|:---|:---|:---|:---|:---|
| id | id | Long | @Id, AUTO_INCREMENT | PK |
| group | group_id | CodeGroup | @ManyToOne(LAZY), FK | 소속 그룹 |
| code | code | String | @Column(length=30, NOT NULL) | 코드값 |
| name | name | String | @Column(length=50, NOT NULL) | 코드명 |
| description | description | String | @Column(length=200, NULL) | 설명 |
| sortOrder | sort_order | Integer | @Column(NOT NULL, default=1) | 정렬순서 |
| active | active | Boolean | @Column(NOT NULL, default=true) | 사용여부 |
| createdBy~updatedAt | - | - | 감사 컬럼 | |

**제약조건:**
- UNIQUE: `(group_id, code)` — 같은 그룹 내 코드값 유일
- FK: `group_id → code_group.id ON DELETE CASCADE`

### 3.3 DTO

**CodeGroupRequest** (생성/수정):

| 필드 | 타입 | 필수 | Bean Validation | 에러 메시지 |
|:---|:---|:---|:---|:---|
| groupCode | String | Y (생성만) | @NotBlank, @Size(max=30), @Pattern(^[A-Z0-9_]+$) | 영문 대문자, 숫자, _만 사용 가능합니다. |
| groupName | String | Y | @NotBlank, @Size(max=50) | 그룹명을 입력해주세요. |
| description | String | N | @Size(max=200) | - |
| active | Boolean | N | - | - |

**CodeDetailRequest** (생성/수정):

| 필드 | 타입 | 필수 | Bean Validation | 에러 메시지 |
|:---|:---|:---|:---|:---|
| code | String | Y | @NotBlank, @Size(max=30), @Pattern(^[A-Z0-9_]+$) | 영문 대문자, 숫자, _만 사용 가능합니다. |
| name | String | Y | @NotBlank, @Size(max=50) | 코드명을 입력해주세요. |
| description | String | N | @Size(max=200) | - |
| sortOrder | Integer | Y | @Min(1), @Max(999) | 정렬순서는 1~999 사이여야 합니다. |
| active | Boolean | N | - | - |

---

## 4. API 엔드포인트 명세

| Method | URL | 설명 | 권한 | 트랜잭션 | 성공 코드 |
|:---|:---|:---|:---|:---|:---|
| GET | `/api/v1/codes` | 전체 그룹+상세 목록 조회 | SUPER_ADMIN | readOnly | 200 |
| GET | `/api/v1/codes/{id}` | 그룹 단건 조회 | SUPER_ADMIN | readOnly | 200 |
| POST | `/api/v1/codes` | 그룹 생성 | SUPER_ADMIN | REQUIRED | 201 |
| PUT | `/api/v1/codes/{id}` | 그룹 수정 | SUPER_ADMIN | REQUIRED | 200 |
| DELETE | `/api/v1/codes/{id}` | 그룹 삭제 (하위 포함) | SUPER_ADMIN | REQUIRED | 204 |
| POST | `/api/v1/codes/{groupId}/details` | 코드 추가 | SUPER_ADMIN | REQUIRED | 201 |
| PUT | `/api/v1/codes/{groupId}/details/{detailId}` | 코드 수정 | SUPER_ADMIN | REQUIRED | 200 |
| DELETE | `/api/v1/codes/{groupId}/details/{detailId}` | 코드 삭제 | SUPER_ADMIN | REQUIRED | 204 |

---

## 5. 비즈니스 로직 상세

### 5.1 그룹 목록 조회

```mermaid
flowchart TD
    A[GET /codes] --> B[전체 CodeGroup 조회]
    B --> C[@EntityGraph로 details fetch join]
    C --> D[sortOrder ASC 정렬된 상태로 반환]
    D --> E[200 OK + List 반환]
```

### 5.2 그룹 생성

```mermaid
flowchart TD
    A[POST /codes] --> B[@Valid 검증]
    B -- 실패 --> C[400 VALIDATION_FAILED]
    B -- 성공 --> D{groupCode 중복?}
    D -- 중복 --> E[409 CODE_GROUP_DUPLICATE]
    D -- 없음 --> F{XSS 문자 포함?}
    F -- 포함 --> G[400 XSS_DETECTED]
    F -- 없음 --> H[groupCode 자동 대문자 + trim]
    H --> I[엔티티 저장]
    I --> J[201 Created]
```

**핵심 비즈니스 규칙:**
1. groupCode는 자동 대문자 변환 + trim
2. groupCode 전체 테이블에서 유일
3. 생성 시 active 기본값 true
4. XSS 문자(`<`, `>`, `"`, `'`) 차단

### 5.3 그룹 수정

**핵심 비즈니스 규칙:**
1. groupCode는 수정 불가 — 요청에 groupCode가 있어도 무시
2. groupName, description, active만 수정 가능
3. XSS 문자 차단

### 5.4 그룹 삭제

**핵심 비즈니스 규칙:**
1. CascadeType.ALL로 하위 code_detail 자동 삭제
2. 삭제 후 204 No Content

### 5.5 코드 추가

```mermaid
flowchart TD
    A[POST /codes/{groupId}/details] --> B[@Valid 검증]
    B -- 실패 --> C[400]
    B -- 성공 --> D{그룹 존재?}
    D -- 없음 --> E[404 GROUP_NOT_FOUND]
    D -- 있음 --> F{같은 그룹 내 code 중복?}
    F -- 중복 --> G[409 CODE_DETAIL_DUPLICATE]
    F -- 없음 --> H[code 자동 대문자 + trim]
    H --> I[엔티티 저장]
    I --> J[201 Created]
```

### 5.6 코드 수정

**핵심 비즈니스 규칙:**
1. code 변경 시 같은 그룹 내 중복 체크 (자신 제외)
2. code 자동 대문자 변환

### 5.7 코드 삭제

**핵심 비즈니스 규칙:**
1. 그룹 존재 확인 + 코드 존재 확인
2. 코드가 해당 그룹에 속하는지 확인

---

## 6. Validation 상세

### 6.1 Controller 레벨 (Bean Validation)

| 필드 | 검증 규칙 | 에러 메시지 |
|:---|:---|:---|
| groupCode | @NotBlank, @Size(max=30), @Pattern(^[A-Z0-9_]+$) | 영문 대문자, 숫자, _만 사용 가능합니다. |
| groupName | @NotBlank, @Size(max=50) | 그룹명을 입력해주세요. |
| code | @NotBlank, @Size(max=30), @Pattern(^[A-Z0-9_]+$) | 영문 대문자, 숫자, _만 사용 가능합니다. |
| name | @NotBlank, @Size(max=50) | 코드명을 입력해주세요. |
| sortOrder | @Min(1), @Max(999) | 정렬순서는 1~999 사이여야 합니다. |

### 6.2 Service 레벨 (비즈니스 Validation)

| 검증 항목 | HTTP | Error Code | 에러 메시지 |
|:---|:---|:---|:---|
| 그룹 존재 확인 실패 | 404 | CODE_GROUP_NOT_FOUND | 해당 코드 그룹을 찾을 수 없습니다. |
| 코드 존재 확인 실패 | 404 | CODE_DETAIL_NOT_FOUND | 해당 코드를 찾을 수 없습니다. |
| groupCode 중복 | 409 | CODE_GROUP_DUPLICATE | 이미 동일한 그룹코드가 존재합니다. |
| 같은 그룹 내 code 중복 (생성) | 409 | CODE_DETAIL_DUPLICATE | 동일 그룹 내에 같은 코드값이 존재합니다. |
| 같은 그룹 내 code 중복 (수정, 자신 제외) | 409 | CODE_DETAIL_DUPLICATE | 동일 그룹 내에 같은 코드값이 존재합니다. |
| XSS 문자 감지 | 400 | XSS_DETECTED | 허용되지 않는 문자가 포함되어 있습니다. |
| 코드가 해당 그룹에 미소속 | 400 | CODE_GROUP_MISMATCH | 해당 코드는 이 그룹에 속하지 않습니다. |
| groupName/name trim 후 빈 값 | 400 | VALIDATION_FAILED | (필드별 메시지) |

---

## 7. 예외 매핑 테이블

| 예외 상황 | HTTP | Error Code | 사용자 메시지 |
|:---|:---|:---|:---|
| 그룹 없음 | 404 | CODE_GROUP_NOT_FOUND | 해당 코드 그룹을 찾을 수 없습니다. |
| 코드 없음 | 404 | CODE_DETAIL_NOT_FOUND | 해당 코드를 찾을 수 없습니다. |
| 그룹코드 중복 | 409 | CODE_GROUP_DUPLICATE | 이미 동일한 그룹코드가 존재합니다. |
| 코드값 중복 | 409 | CODE_DETAIL_DUPLICATE | 동일 그룹 내에 같은 코드값이 존재합니다. |
| XSS 문자 | 400 | XSS_DETECTED | 허용되지 않는 문자가 포함되어 있습니다. |
| 그룹 미소속 | 400 | CODE_GROUP_MISMATCH | 해당 코드는 이 그룹에 속하지 않습니다. |
| 권한 부족 | 403 | FORBIDDEN | 접근 권한이 없습니다. |
| Validation 실패 | 400 | VALIDATION_FAILED | (필드별 메시지) |

---

## 8. 보안 매트릭스

| API | Method | 권한 | 비인가 시 |
|:---|:---|:---|:---|
| `/api/v1/codes/**` | ALL | `ROLE_SUPER_ADMIN` | 403 Forbidden |

---

## 9. Repository 쿼리 설계

### CodeGroupRepository

| 메서드명 | 용도 |
|:---|:---|
| `findAllByOrderByGroupCodeAsc()` | 전체 그룹 목록 (정렬) |
| `existsByGroupCode(groupCode)` | 그룹코드 중복 확인 |

### CodeDetailRepository

| 메서드명 | 용도 |
|:---|:---|
| `existsByGroupAndCode(group, code)` | 코드값 중복 (생성 시) |
| `existsByGroupAndCodeAndIdNot(group, code, id)` | 코드값 중복 (수정 시, 자신 제외) |

---

## 10. BE 개발 체크리스트 (07단계 검증 필수)

> ⚠️ **모든 항목이 ✅가 될 때까지 완료 보고 불가**

### 10.1 엔티티 및 DB
- [ ] CodeGroup 엔티티의 모든 필드가 설계서와 일치하는가?
- [ ] CodeDetail 엔티티의 모든 필드가 설계서와 일치하는가?
- [ ] CodeGroup.details에 @OneToMany(cascade=ALL, orphanRemoval=true)가 설정되었는가?
- [ ] CodeDetail.group에 @ManyToOne(LAZY)가 설정되었는가?
- [ ] @OrderBy("sortOrder ASC")가 적용되었는가?
- [ ] UNIQUE (group_code)가 엔티티에 선언되었는가?
- [ ] UNIQUE (group_id, code)가 엔티티에 선언되었는가?
- [ ] 감사 컬럼 (@CreatedBy 등)이 자동 설정되는가?
- [ ] 초기 데이터 (STATUS/CATEGORY/PRIORITY + 하위 코드)가 삽입되는가?
- [ ] 중복 실행 시 에러가 없는가? (멱등성)

### 10.2 API 엔드포인트
- [ ] GET `/api/v1/codes` — 전체 조회가 구현되었는가?
- [ ] GET `/api/v1/codes/{id}` — 단건 조회가 구현되었는가?
- [ ] POST `/api/v1/codes` — 그룹 생성이 구현되었는가?
- [ ] PUT `/api/v1/codes/{id}` — 그룹 수정이 구현되었는가?
- [ ] DELETE `/api/v1/codes/{id}` — 그룹 삭제가 구현되었는가?
- [ ] POST `/api/v1/codes/{groupId}/details` — 코드 추가가 구현되었는가?
- [ ] PUT `/api/v1/codes/{groupId}/details/{detailId}` — 코드 수정이 구현되었는가?
- [ ] DELETE `/api/v1/codes/{groupId}/details/{detailId}` — 코드 삭제가 구현되었는가?
- [ ] POST 성공 시 HTTP 201을 반환하는가?
- [ ] DELETE 성공 시 HTTP 204를 반환하는가?

### 10.3 Request DTO Validation
- [ ] groupCode: @NotBlank, @Size(max=30), @Pattern이 적용되었는가?
- [ ] groupName: @NotBlank, @Size(max=50)이 적용되었는가?
- [ ] code: @NotBlank, @Size(max=30), @Pattern이 적용되었는가?
- [ ] name: @NotBlank, @Size(max=50)이 적용되었는가?
- [ ] sortOrder: @Min(1), @Max(999)가 적용되었는가?
- [ ] @Valid가 Controller @RequestBody에 적용되었는가?

### 10.4 비즈니스 Validation
- [ ] 그룹 존재 확인 실패 시 404가 발생하는가?
- [ ] 코드 존재 확인 실패 시 404가 발생하는가?
- [ ] groupCode 중복 시 409가 발생하는가?
- [ ] 같은 그룹 내 code 중복 (생성) 시 409가 발생하는가?
- [ ] 같은 그룹 내 code 중복 (수정, 자신 제외) 시 409가 발생하는가?
- [ ] XSS 문자 검증이 동작하는가?
- [ ] groupCode 자동 대문자 변환 + trim이 동작하는가?
- [ ] code 자동 대문자 변환 + trim이 동작하는가?
- [ ] 코드가 해당 그룹에 소속되는지 확인하는가?

### 10.5 삭제 및 연쇄 처리
- [ ] 그룹 삭제 시 하위 code_detail이 자동 삭제되는가?
- [ ] 코드 삭제 시 해당 코드만 삭제되는가?

### 10.6 트랜잭션
- [ ] GET API에 @Transactional(readOnly=true)가 적용되었는가?
- [ ] CUD API에 @Transactional이 적용되었는가?

### 10.7 보안
- [ ] /api/v1/codes/** 에 ROLE_SUPER_ADMIN 권한이 설정되었는가?

### 10.8 예외 처리
- [ ] 설계서 섹션 7의 모든 예외가 ErrorCode enum + BusinessException으로 구현되었는가?
- [ ] 에러코드가 설계서와 일치하는가?
- [ ] 에러 메시지가 설계서와 일치하는가?

### 10.9 성능
- [ ] 그룹 목록 조회 시 @EntityGraph로 N+1 방지가 적용되었는가?
- [ ] details가 sortOrder 기준으로 정렬되는가?

### 10.10 코드 품질
- [ ] `./gradlew build` 오류가 없는가?
- [ ] 에러 메시지/코드가 상수(ErrorCode enum)로 관리되는가?
- [ ] DTO → Entity 변환이 일관적인가?

### 10.11 데이터 초기화
- [ ] DataInitializer에 공통코드 초기 데이터가 포함되었는가?
- [ ] STATUS (승인완료/진행중/대기/반려) 코드가 삽입되는가?
- [ ] CATEGORY (공지사항/FAQ/이벤트) 코드가 삽입되는가?
- [ ] PRIORITY (긴급/보통/낮음) 코드가 삽입되는가?
- [ ] 중복 실행 시 에러가 없는가? (멱등성)

### 10.12 응답 형식
- [ ] 그룹 조회 시 details가 포함되어 반환되는가?
- [ ] details가 sortOrder 기준 정렬되어 있는가?
- [ ] null 필드(description)가 적절히 처리되는가?

### 10.13 FE 하드코딩/로컬 저장 제거
- [ ] useCodeStore에 목(Mock) 데이터 배열이 남아있지 않은가?
- [ ] setTimeout 등 가짜 지연 처리가 남아있지 않은가?
- [ ] localStorage/sessionStorage 직접 저장 코드가 없는가?
- [ ] 모든 데이터가 API에서 조회되는가? (하드코딩 배열 없음)

### 10.14 FE-BE API 응답 형식 일치 검증
- [ ] BE CodeGroupResponse의 필드명이 FE CodeGroup 타입과 일치하는가?
- [ ] BE CodeDetailResponse의 필드명이 FE CodeDetail 타입과 일치하는가?
- [ ] 날짜 형식(ISO 8601)이 FE에서 정상 파싱되는가?
- [ ] null/undefined 처리가 FE-BE 간 일관적인가?

### 10.15 FE 연동 테스트 — 그룹 CRUD
- [ ] 그룹 목록 조회: 페이지 진입 시 그룹 목록이 정상 표시되는가?
- [ ] 그룹 생성: "그룹 추가" → 입력 → 추가 → 성공 토스트 + 목록 새로고침 확인
- [ ] 그룹 생성 중복: 동일 groupCode로 추가 시 409 에러 토스트 표시 확인
- [ ] 그룹 수정: 그룹명/설명/사용여부 변경 → 저장 → 성공 토스트 + 반영 확인
- [ ] 그룹 수정 validation: 그룹명 빈 값 저장 시 에러 표시 확인
- [ ] 그룹 삭제: confirm → 삭제 → 성공 토스트 + 목록에서 제거 확인
- [ ] 그룹 선택/해제: 클릭 토글이 정상 동작하는가?

### 10.16 FE 연동 테스트 — 코드 상세 CRUD
- [ ] 코드 목록: 그룹 선택 시 하위 코드 테이블이 정상 표시되는가?
- [ ] 코드 추가: 인라인 추가 행 → 코드값/코드명 입력 → 추가 → 성공 토스트 + 테이블 반영 확인
- [ ] 코드 추가 중복: 동일 code값 추가 시 409 에러 토스트 표시 확인
- [ ] 코드 편집: 편집 → 수정 → 저장 → 성공 토스트 + 반영 확인
- [ ] 코드 삭제: confirm → 삭제 → 성공 토스트 + 테이블에서 제거 확인
- [ ] 코드 사용여부 토글: Y/N 클릭 → 즉시 반영 확인

### 10.17 FE 연동 테스트 — 에러 처리
- [ ] 400 에러 (validation 실패): 에러 토스트가 표시되는가?
- [ ] 404 에러 (존재하지 않는 그룹/코드): 에러 토스트가 표시되는가?
- [ ] 409 에러 (중복): 에러 토스트에 서버 메시지가 표시되는가?
- [ ] 미인증 (401): 로그인 페이지로 리다이렉트되는가?
- [ ] 미인가 (403): 에러 토스트가 표시되는가?
