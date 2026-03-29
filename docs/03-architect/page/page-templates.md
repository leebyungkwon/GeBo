# 페이지 템플릿 관리 BE 상세 설계서

## 1. 개요

- **도메인**: 페이지 템플릿(PageTemplate) — 페이지 메이커 설정을 DB에 저장하고, TSX 컴포넌트 파일을 생성하여 실제 Next.js 페이지로 서비스
- **패키지 경로**: `com.ge.bo`
- **관련 화면**: `/admin/templates/make/list` (메이커), `/admin/generated/{slug}` (생성된 실제 페이지)

---

## 2. Tech Spec (RFC)

### 2.1 Context & Scope

| 항목 | 내용 |
|:---|:---|
| Feature | 페이지 템플릿 DB 저장 + TSX 파일 생성 이중 저장 API |
| Problem | 페이지 메이커 설정을 영구 보존하고, 메뉴와 연동 가능한 실제 Next.js 페이지로 즉시 서비스 불가 |
| Goals | ① config JSON → DB 저장(재편집 용) ② TSX 코드 → 파일시스템 저장(실제 페이지 서비스 용) |

### 2.2 이중 저장 아키텍처

```
[FE 페이지 메이커]
  ├─ generateSearchCode()   ┐
  └─ generateTableCode()    ┘ → TSX 코드 생성 (FE 책임)
         │
         │  POST /api/v1/page-templates
         │  { name, slug, description, configJson, tsxCode, collapsible }
         ▼
[BE PageTemplateService]
  ├─ configJson → DB (page_template 테이블) — 재편집, 설정 복원용
  └─ tsxCode   → 파일시스템 저장            — 실제 Next.js 페이지 서비스용
         │
         │  저장 경로: ../bo/src/app/admin/generated/{slug}/page.tsx
         ▼
[Next.js App Router]
  URL: /admin/generated/{slug} → 실제 페이지 렌더링
```

> **설계 결정**: TSX 코드 생성은 FE가 담당 (이미 generateSearchCode/generateTableCode 함수 보유).
> BE는 받은 TSX 문자열을 파일로 쓰기만 함 — Java가 React 코드를 이해할 필요 없음.

### 2.3 Data Flow

```
Client → PageTemplateController → PageTemplateService
                                    ├─ PageTemplateRepository → PostgreSQL (JSON config)
                                    └─ FileWriterUtil → 파일시스템 (TSX 파일)
```

---

## 3. 파일 구조

```
com.ge.bo/
├── entity/
│   └── PageTemplate.java
├── dto/
│   ├── PageTemplateRequest.java        # 생성/수정 요청 (tsxCode 포함)
│   └── PageTemplateResponse.java       # 응답
├── repository/
│   └── PageTemplateRepository.java
├── service/
│   ├── PageTemplateService.java
│   └── PageTemplateFileService.java    # TSX 파일 쓰기/삭제 전담
└── controller/
    └── PageTemplateController.java
```

---

## 4. DB 설계

### 4.1 ERD

```
page_template
├── id              BIGSERIAL PK
├── name            VARCHAR(100) NOT NULL UNIQUE    -- 템플릿 표시 이름
├── slug            VARCHAR(100) NOT NULL UNIQUE    -- URL + 파일경로 기준 (kebab-case)
├── description     VARCHAR(200) NULL              -- 설명
├── template_type   VARCHAR(20) NOT NULL DEFAULT 'LIST'
├── config_json     TEXT NOT NULL                  -- 재편집용 JSON 설정
├── collapsible     BOOLEAN NOT NULL DEFAULT FALSE
├── file_path       VARCHAR(300) NOT NULL          -- 생성된 TSX 파일 절대경로 (관리용)
├── created_by      VARCHAR(50) NOT NULL
├── created_at      TIMESTAMP NOT NULL
├── updated_by      VARCHAR(50) NOT NULL
└── updated_at      TIMESTAMP NOT NULL
```

### 4.2 DDL

```sql
CREATE TABLE page_template (
    id              BIGSERIAL       PRIMARY KEY,
    name            VARCHAR(100)    NOT NULL,
    slug            VARCHAR(100)    NOT NULL,
    description     VARCHAR(200),
    template_type   VARCHAR(20)     NOT NULL DEFAULT 'LIST',
    config_json     TEXT            NOT NULL,
    collapsible     BOOLEAN         NOT NULL DEFAULT FALSE,
    file_path       VARCHAR(300)    NOT NULL,
    created_by      VARCHAR(50)     NOT NULL,
    created_at      TIMESTAMP       NOT NULL,
    updated_by      VARCHAR(50)     NOT NULL,
    updated_at      TIMESTAMP       NOT NULL,
    CONSTRAINT uq_page_template_name UNIQUE (name),
    CONSTRAINT uq_page_template_slug UNIQUE (slug)
);

CREATE INDEX idx_page_template_name ON page_template (name);
CREATE INDEX idx_page_template_slug ON page_template (slug);
```

### 4.3 DB 설계 결정 사항

| 항목 | 결정 | 근거 |
|:---|:---|:---|
| config_json | `TEXT` 저장 | FE 주도로 스키마 변경 가능, DB 타입 제약 불필요 |
| tsxCode | **DB 미저장** | 파일시스템이 원본, configJson으로 재생성 가능 |
| slug | `VARCHAR(100) UNIQUE` | URL + 파일경로 식별자, kebab-case |
| file_path | `VARCHAR(300)` | 생성된 파일 절대경로 보관 (삭제/갱신 시 활용) |
| Menu FK | **미적용** | Menu.url = `/admin/generated/{slug}`, DB 의존성 최소화 |

---

## 5. 엔티티 설계 — PageTemplate.java

| 필드 | 컬럼 | 타입 | 제약 | 설명 |
|:---|:---|:---|:---|:---|
| id | id | Long | PK, AUTO_INCREMENT | PK |
| name | name | String | NOT NULL, UNIQUE, length=100 | 표시 이름 |
| slug | slug | String | NOT NULL, UNIQUE, length=100 | URL/파일 경로 식별자 |
| description | description | String | NULL, length=200 | 설명 |
| templateType | template_type | String | NOT NULL, length=20, default='LIST' | 템플릿 유형 |
| configJson | config_json | String | NOT NULL, columnDefinition="TEXT" | 재편집용 JSON 설정 |
| collapsible | collapsible | Boolean | NOT NULL, default=false | 검색폼 접기 여부 |
| filePath | file_path | String | NOT NULL, length=300 | 생성된 TSX 파일 경로 |
| createdBy~updatedAt | - | - | @CreatedBy/@CreatedDate etc. | 감사 컬럼 |

---

## 6. DTO 설계

### 6.1 PageTemplateRequest (생성/수정)

```java
public class PageTemplateRequest {
    @NotBlank
    @Size(max = 100)
    String name;               // 표시 이름 (예: "사용자 검색 목록")

    @NotBlank
    @Pattern(regexp = "^[a-z0-9-]+$", message = "slug는 소문자, 숫자, 하이픈만 허용")
    @Size(max = 100)
    String slug;               // URL/파일 식별자 (예: "user-search-list")

    @Size(max = 200)
    String description;

    @NotBlank
    String configJson;         // FE 설정 JSON

    @NotBlank
    String tsxCode;            // FE 생성 TSX 코드 (파일 저장 후 DB 미보관)

    boolean collapsible;
}
```

### 6.2 PageTemplateResponse (응답)

```java
public class PageTemplateResponse {
    Long id;
    String name;
    String slug;
    String description;
    String templateType;
    String configJson;
    boolean collapsible;
    String filePath;           // 생성된 TSX 파일 경로
    String pageUrl;            // 실제 접근 URL (/admin/generated/{slug})
    String createdBy;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
```

---

## 7. API 설계

기준: `api_standard.md` — kebab-case URI, 복수형, camelCase JSON

| Method | URI | 권한 | 설명 | 응답 |
|:---|:---|:---|:---|:---|
| `GET` | `/api/v1/page-templates` | authenticated | 목록 조회 (name ASC) | `200 List<PageTemplateResponse>` |
| `GET` | `/api/v1/page-templates/{id}` | authenticated | 단건 조회 | `200 PageTemplateResponse` |
| `POST` | `/api/v1/page-templates` | authenticated | 생성 (DB + TSX 파일) | `201 PageTemplateResponse` |
| `PUT` | `/api/v1/page-templates/{id}` | authenticated | 수정 (DB + TSX 파일 덮어쓰기) | `200 PageTemplateResponse` |
| `DELETE` | `/api/v1/page-templates/{id}` | authenticated | 삭제 (DB + TSX 파일 삭제) | `204 No Content` |

### 7.1 요청/응답 예시

**POST /api/v1/page-templates**
```json
// Request
{
  "name": "사용자 검색 목록",
  "slug": "user-search-list",
  "description": "사용자 조회용 기본 목록 화면",
  "configJson": "{\"fieldRows\":[...],\"tableColumns\":[...],\"collapsible\":false}",
  "tsxCode": "'use client';\n\nimport React, { useState } from 'react';\n...",
  "collapsible": false
}

// Response 201
{
  "id": 1,
  "name": "사용자 검색 목록",
  "slug": "user-search-list",
  "description": "사용자 조회용 기본 목록 화면",
  "templateType": "LIST",
  "configJson": "{\"fieldRows\":[...],\"tableColumns\":[...]}",
  "collapsible": false,
  "filePath": "/app/bo/src/app/admin/generated/user-search-list/page.tsx",
  "pageUrl": "/admin/generated/user-search-list",
  "createdBy": "admin",
  "createdAt": "2026-03-24T10:00:00",
  "updatedAt": "2026-03-24T10:00:00"
}
```

**에러 응답 예시**
```json
// 409 — 이름 중복
{ "success": false, "error": { "code": "PAGE_TEMPLATE_NAME_DUPLICATE", "message": "이미 동일한 이름의 템플릿이 존재합니다." } }

// 409 — slug 중복
{ "success": false, "error": { "code": "PAGE_TEMPLATE_SLUG_DUPLICATE", "message": "이미 사용 중인 slug입니다." } }

// 404
{ "success": false, "error": { "code": "PAGE_TEMPLATE_NOT_FOUND", "message": "해당 페이지 템플릿을 찾을 수 없습니다." } }

// 500 — 파일 쓰기 실패
{ "success": false, "error": { "code": "PAGE_TEMPLATE_FILE_ERROR", "message": "TSX 파일 생성 중 오류가 발생했습니다." } }
```

---

## 8. ErrorCode 추가 (4개)

```java
/* 페이지 템플릿 */
PAGE_TEMPLATE_NOT_FOUND(HttpStatus.NOT_FOUND, "PAGE_TEMPLATE_NOT_FOUND", "해당 페이지 템플릿을 찾을 수 없습니다."),
PAGE_TEMPLATE_NAME_DUPLICATE(HttpStatus.CONFLICT, "PAGE_TEMPLATE_NAME_DUPLICATE", "이미 동일한 이름의 템플릿이 존재합니다."),
PAGE_TEMPLATE_SLUG_DUPLICATE(HttpStatus.CONFLICT, "PAGE_TEMPLATE_SLUG_DUPLICATE", "이미 사용 중인 slug입니다."),
PAGE_TEMPLATE_FILE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "PAGE_TEMPLATE_FILE_ERROR", "TSX 파일 생성 중 오류가 발생했습니다."),
```

---

## 9. 비즈니스 로직

### 9.1 PageTemplateService

| 메서드 | DB 처리 | 파일 처리 | 예외 |
|:---|:---|:---|:---|
| `getAll()` | name ASC 전체 조회 | - | - |
| `getById(id)` | id로 단건 조회 | - | NOT_FOUND |
| `create(request)` | name/slug 중복 검사 → 저장 | TSX 파일 생성 | NAME_DUPLICATE, SLUG_DUPLICATE, FILE_ERROR |
| `update(id, request)` | 존재 확인 → 중복 검사(자신 제외) → 저장 | 기존 파일 삭제 → 신규 파일 생성 | NOT_FOUND, NAME_DUPLICATE, SLUG_DUPLICATE, FILE_ERROR |
| `delete(id)` | 존재 확인 → 삭제 | TSX 파일 삭제 (실패 시 로그만 기록) | NOT_FOUND |

### 9.2 PageTemplateFileService

```
- 저장 경로 설정 (application.yml): page-template.output-dir
  예) ../bo/src/app/admin/generated
- writeFile(slug, tsxCode): {outputDir}/{slug}/page.tsx 파일 쓰기
- deleteFile(filePath): 파일 삭제 (없으면 무시)
- 트랜잭션 주의: DB 저장 성공 후 파일 쓰기 → 파일 실패 시 DB 롤백
```

### 9.3 트랜잭션 처리 전략

```
@Transactional
create(request):
  1. DB 저장 (flush 전 상태)
  2. TSX 파일 쓰기 시도
     → 성공: 커밋
     → 실패: RuntimeException 발생 → @Transactional 자동 롤백
              + 작성된 파일 수동 삭제 (보상 처리)
```

---

## 10. application.yml 추가 설정

```yaml
# 페이지 템플릿 TSX 파일 출력 경로
page-template:
  output-dir: "../bo/src/app/admin/generated"
```

---

## 11. 생성되는 TSX 파일 구조 예시

`bo/src/app/admin/generated/user-search-list/page.tsx`

```tsx
'use client';

/**
 * [자동 생성] 페이지 메이커 — 사용자 검색 목록
 * 생성일: 2026-03-24
 * 수정하려면 페이지 메이커(/admin/templates/make/list)에서 재생성하세요.
 */

import React, { useState } from 'react';
import { SearchForm, SearchRow, SearchField } from '@/components/search';
// ... (코드 생성기 output 그대로)

export default function UserSearchListPage() {
    // ... 생성된 코드
}
```

---

## 12. 보안 설계 (Threat Model 요약)

| 위협 | 완화 방법 |
|:---|:---|
| 미인증 접근 | `anyRequest().authenticated()` — JWT 필터 차단 |
| Path Traversal (파일 쓰기) | slug 정규식 검증 (`^[a-z0-9-]+$`) + 출력 경로 고정 |
| 악성 TSX 코드 주입 | outputDir 외부 경로 접근 차단, 파일 확장자 `.tsx` 고정 |
| XSS (configJson) | React 자동 escape, JSON 직렬화 저장 |
| SQL Injection | JPA Parameterized Query |
| 파일 쓰기 실패로 인한 DB/파일 불일치 | @Transactional + 보상 처리(파일 삭제) |

---

## 13. SecurityConfig 변경 사항

`/api/v1/page-templates/**` — `anyRequest().authenticated()` 기존 규칙 적용, **추가 설정 불필요**.
생성된 페이지 `/admin/generated/**` — Next.js 미들웨어에서 인증 처리 (기존 admin 라우트 보호 로직).

---

## 14. BE 개발 체크리스트 (15항목)

| # | 항목 | 완료 |
|:--|:--|:--:|
| 1 | `PageTemplate` 엔티티 — slug, filePath 포함, @EntityListeners 감사 컬럼 | ☐ |
| 2 | `PageTemplateRepository` — `existsByName`, `existsBySlug`, `existsByNameAndIdNot`, `existsBySlugAndIdNot` | ☐ |
| 3 | `PageTemplateRequest` — @NotBlank, @Size, slug @Pattern(`^[a-z0-9-]+$`) 검증 | ☐ |
| 4 | `PageTemplateResponse` — pageUrl 필드(`/admin/generated/{slug}`) 포함, 정적 팩토리 | ☐ |
| 5 | `application.yml` — `page-template.output-dir` 경로 설정 | ☐ |
| 6 | `PageTemplateFileService.writeFile(slug, tsxCode)` — 디렉토리 자동 생성, 파일 쓰기 | ☐ |
| 7 | `PageTemplateFileService.deleteFile(filePath)` — 파일 없으면 무시, 예외 비전파 | ☐ |
| 8 | `PageTemplateService.create()` — name/slug 중복 → DB 저장 → 파일 쓰기 → 파일 실패 시 DB 롤백 | ☐ |
| 9 | `PageTemplateService.update()` — 존재 확인 → 중복 검사 → DB 수정 → 기존 파일 삭제 → 신규 파일 쓰기 | ☐ |
| 10 | `PageTemplateService.delete()` — DB 삭제 → 파일 삭제 (파일 실패는 로그만) | ☐ |
| 11 | `PageTemplateController` — @RestController, @RequestMapping("/api/v1/page-templates") | ☐ |
| 12 | `ErrorCode.java` — 4개 에러코드 추가 (NOT_FOUND, NAME_DUPLICATE, SLUG_DUPLICATE, FILE_ERROR) | ☐ |
| 13 | `./gradlew build` 빌드 성공 확인 | ☐ |
| 14 | 전체 CRUD + 에러 시나리오 테스트 (이름 중복 409, slug 중복 409, 없는 ID 404, 파일 생성 확인) | ☐ |
| 15 | FE 연동 테스트 — 저장 후 `/admin/generated/{slug}` 접근 시 생성된 페이지 렌더링 확인 | ☐ |

---

## 15. FE 연동 정보

| 항목 | 내용 |
|:---|:---|
| 저장 요청 | `POST /api/v1/page-templates` — configJson + tsxCode(코드 생성기 output) 함께 전송 |
| 목록 조회 | `GET /api/v1/page-templates` → id, name, slug, pageUrl 로 드롭다운 구성 |
| 단건 조회 | `GET /api/v1/page-templates/{id}` → configJson 파싱 후 메이커에 복원 |
| 메뉴 연동 URL | `pageUrl` 필드 값 (`/admin/generated/{slug}`) → 메뉴 URL에 자동 입력 |
| FE Store | `usePageTemplateStore.ts` 신규 생성 예정 |
| TSX 생성 위치 | `bo/src/app/admin/generated/{slug}/page.tsx` — next dev 환경에서 자동 인식 |

---

*설계서 작성일: 2026-03-24*
*작성자: Architect Agent (PDD 6단계)*
*v2: DB 저장 + TSX 파일 생성 이중 저장 방식으로 변경*
