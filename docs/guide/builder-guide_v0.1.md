# Builder 시스템 가이드

> 경로: `/admin/templates/make/list` , `/admin/templates/make/layer`
> 마지막 업데이트: 2026-04-14

---

## 목차

1. [시스템 개요](#1-시스템-개요)
2. [가이드 문서](#2-가이드-문서)
3. [빌더 사용 권장 순서](#3-빌더-사용-권장-순서)
4. [저장 방식 2가지](#4-저장-방식-2가지)
5. [List ↔ Layer KEY 구조](#5-list--layer-key-구조)
6. [데이터 테이블 관계](#6-데이터-테이블-관계)
7. [활용 시나리오 예시](#7-활용-시나리오-예시)
8. [자주 발생하는 실수](#8-자주-발생하는-실수)
9. [API 목록](#9-api-목록)
10. [주요 파일 위치](#10-주요-파일-위치)

---

## 1. 시스템 개요

Builder 시스템은 코드 없이 목록 화면과 팝업을 구성하는 No-Code 도구입니다.

| 빌더 | 목적 |
|---|---|
| **List Builder** | 검색폼 + 데이터 테이블 형태의 목록 화면 구성 |
| **Layer Builder** | 등록 / 수정 / 상세 용도의 레이어 팝업 구성 |

구성한 화면은 **두 가지 방식**으로 운영할 수 있습니다.

| 방식 | 대상 | 설명 |
|---|---|---|
| **관리자방식** | 운영자 / 기획자 | DB에 저장 → 공통 렌더러가 실시간 렌더링. 코드 배포 불필요 |
| **개발자방식** | 개발자 | TSX 파일 생성 → 개발자가 직접 코드 수정 |

---

## 2. 가이드 문서

각 역할에 맞는 가이드를 참고하세요.

| 문서 | 대상 | 내용 |
|---|---|---|
| [List Builder 가이드](list-builder-guide.md) | 운영자 / 개발자 | 검색·테이블·버튼 탭 상세, 저장 및 메뉴 연결 |
| [Layer Builder 가이드](layer-builder-guide.md) | 운영자 / 개발자 | 팝업 구성, 폼 필드 타입별 상세, 저장 및 List 연결 |
| [운영자 가이드](operator-guide.md) | 운영자 / 기획자 | 빌더 → 저장 → 메뉴 연결 → 데이터 관리 전체 흐름 |
| [개발자 가이드](developer-guide.md) | 개발자 | 파일 생성, 공통(JSON) API 활용, 커스터마이징 |

---

## 3. 빌더 사용 권장 순서

> **Layer 빌더를 먼저, List 빌더를 나중에** 만드는 것을 권장합니다.

### 왜 Layer를 먼저 만들어야 할까?

List의 테이블 컬럼 Key는 Layer의 필드 Key와 반드시 일치해야 합니다.
Layer를 먼저 만들어 Key를 확정한 뒤 List에서 동일한 Key를 입력하면
불일치로 인한 문제를 처음부터 방지할 수 있습니다.

```
✅ 권장 순서

  1. Layer Builder
     - 팝업 폼 필드 구성
     - 각 필드에 Key 확정 (예: title, type, content, attach)
     - [저장/수정] → slug 지정 (예: board1)

  2. List Builder
     - 테이블 컬럼 구성 시 Layer에서 확정한 Key 그대로 사용
     - actions 컬럼 → 팝업 slug: board1 입력
     - 등록 버튼 → 팝업 slug: board1 입력
     - [저장/수정] → 동일 slug 지정 (예: board1)

  3. 메뉴 관리
     - [페이지 메이커 연동] → 저장된 LIST 템플릿 연결
```

### slug 네이밍 권장 규칙

같은 화면 군끼리 prefix를 통일하면 빌더 목록에서 찾기 쉽습니다.

| 화면 | List slug | Layer slug (등록/수정) | Layer slug (상세) |
|---|---|---|---|
| 게시판 | `board` | `board` | `board-detail` |
| 공지사항 | `notice` | `notice` | `notice-detail` |
| FAQ | `faq` | `faq` | `faq-detail` |
| 회원 관리 | `user` | `user` | `user-detail` |

> List와 Layer (등록/수정)는 **동일한 slug**를 사용합니다.
> 상세 전용 팝업은 별도 slug로 분리합니다 (예: `board-detail`).

---

## 4. 저장 방식 2가지

```
                ┌─────────────────────────────────┐
                │      Builder (List / Layer)      │
                └──────────┬──────────┬────────────┘
                           │          │
               ┌───────────▼──┐  ┌────▼──────────────────┐
               │  [저장/수정]  │  │      [생성] 버튼        │
               │   DB 저장    │  │   TSX 파일 생성         │
               └───────────┬──┘  └────┬──────────────────┘
                           │          │
               ┌───────────▼──┐  ┌────▼──────────────────┐
               │  공통 렌더러  │  │ 개발자가 직접 코드 수정  │
               │ [slug]/page  │  │ /admin/generated/{slug}│
               └──────────────┘  └───────────────────────┘
```

| 항목 | 관리자방식 (DB 저장) | 개발자방식 (파일 생성) |
|---|---|---|
| 코드 배포 | ❌ 불필요 | ✅ 필요 |
| 반영 속도 | 저장 즉시 | 빌드 후 반영 |
| 커스터마이징 | 빌더 설정 범위 내 | 코드 수준 완전 자유 |
| 레이어 팝업 | LayerPopupRenderer (런타임 DB 조회) | LayerPopup.tsx 직접 import |
| 대상 | 운영자 / 기획자 | 개발자 |

> 상세 사용 방법: [운영자 가이드](operator-guide.md) / [개발자 가이드](developer-guide.md)

---

## 5. List ↔ Layer KEY 구조

> List와 Layer를 연결하는 핵심 개념입니다.
> Layer 필드의 **Key**와 List 컬럼의 **Key**는 반드시 동일해야 합니다.

**Key 흐름:**

```
[Layer Builder]          [page_data.data_json]       [List Builder]
필드 Key 입력         →  JSON 키로 저장           ←  컬럼 Key 입력
─────────────────────────────────────────────────────────────────────
"type"               →  "type":   "공지"          ←  Key: "type"
"title"              →  "title":  "첫 번째 글"    ←  Key: "title"
"attach" (file)      →  "attach": [1, 2]          ←  Key: "attach"
                                    ↓
                             [page_file 테이블]
                             field_key: "attach"
```

**configJson 내 Key 프로퍼티명:**

| 빌더 | configJson 저장 프로퍼티명 | 화면 표시 이름 |
|---|---|---|
| Layer Builder | `fieldKey` | Key |
| List Builder | `accessor` | Key |

> 빌더 UI에서는 둘 다 **Key** 로 표시됩니다. 반드시 **동일한 값**을 입력해야 합니다.

**Key 불일치 시 증상:**

| 증상 | 원인 |
|---|---|
| List 컬럼이 비어 있음 | Layer fieldKey ≠ List accessor |
| 파일 개수가 0으로 표시 | Layer file Key ≠ List file 컬럼 Key |
| 수정 팝업에 기존 값이 안 채워짐 | Layer fieldKey ≠ data_json 실제 키 |

**Key 규칙:**

> ⚠️ Key는 반드시 **영문·숫자·언더스코어(_)** 만 사용하세요.
> 한글 Key는 화면에 데이터가 표시되지 않고, 날짜 범위 검색이 동작하지 않습니다.

---

## 6. 데이터 테이블 관계

Builder 시스템은 3개의 테이블로 데이터를 관리합니다.

```
┌──────────────────────────────────────────────────────────────────┐
│                       page_template                              │
│  id │ slug   │ templateType │ configJson                         │
│  1  │ board  │ LIST         │ { 검색/테이블/버튼 설정 }            │
│  2  │ board  │ LAYER        │ { 팝업 필드/버튼 설정 }              │
└──────────────────────────┬───────────────────────────────────────┘
                           │ slug 기준으로 연결
┌──────────────────────────▼───────────────────────────────────────┐
│                         page_data                                │
│  id  │ template_slug │ data_json                                 │
│  100 │ board         │ { "title":"첫 글", "type":"notice", ... } │
│  101 │ board         │ { "title":"두 번째 글", ... }              │
└──────────────────────────┬───────────────────────────────────────┘
                           │ data_id 기준으로 연결
┌──────────────────────────▼───────────────────────────────────────┐
│                         page_file                                │
│  id │ data_id │ field_key │ orig_name      │ file_size           │
│  1  │ 100     │ attach    │ 보고서.pdf      │ 1,240,000 bytes     │
│  2  │ 100     │ attach    │ 첨부파일.xlsx   │ 524,000 bytes       │
└──────────────────────────────────────────────────────────────────┘
```

| 테이블 | 역할 | 저장 시점 |
|---|---|---|
| `page_template` | 빌더에서 구성한 **화면 설정** 저장 | [저장/수정] 버튼 클릭 시 |
| `page_data` | 실제 **업무 데이터** 저장 | 팝업에서 [저장] 클릭 시 |
| `page_file` | **첨부파일** 저장. data_id로 page_data와 연결 | 파일 업로드 후 [저장] 클릭 시 |

> `page_template`이 없어도 `page_data`는 slug 기준으로 독립적으로 동작합니다.
> 개발자방식(TSX 파일 생성)은 `page_template`을 저장하지 않고 `page_data`만 사용합니다.

---

## 7. 활용 시나리오 예시

### 게시판 화면 처음부터 만들기

아래는 "게시판" 화면을 처음부터 완성하는 전체 흐름입니다.

**1단계 — Layer Builder: 등록/수정 팝업 구성**

```
/admin/templates/make/layer 접속

팝업 설정:
  유형: 중앙 팝업 / 너비: Large / 제목: 게시글 등록

폼 필드 추가 (2칸 행):
  - 제목    | Key: title   | Input   | ColSpan 4 | 필수
  - 타입    | Key: type    | Select  | ColSpan 1 | 공통코드 연동
  - 내용    | Key: content | Editor  | ColSpan 5
  - 첨부파일 | Key: attach  | File    | ColSpan 5

[저장/수정] → 이름: 게시판 팝업 / slug: board
```

**2단계 — Layer Builder: 상세 팝업 구성 (선택)**

```
팝업 설정:
  유형: 우측 드로어 / 제목: 게시글 상세

동일 필드 추가 + 모든 필드 읽기 전용 체크
하단 버튼: 닫기만 남기고 저장 삭제

[저장/수정] → 이름: 게시판 상세 / slug: board-detail
```

**3단계 — List Builder: 목록 화면 구성**

```
/admin/templates/make/list 접속

검색 탭:
  - 검색어  | Key: title  | Input    | ColSpan 2
  - 타입    | Key: type   | Select   | 공통코드 연동
  - 등록일  | Key: regDate | DateRange | ColSpan 2

테이블 탭:
  - 타입    | Key: type   | Badge (공통코드 연동)
  - 제목    | Key: title  | Text
  - 첨부    | Key: attach | File
  - 관리    | (Key 없음)   | Actions → 수정: board / 상세: board-detail / 삭제: ON

버튼 탭:
  - 등록 버튼 | primary | 팝업 slug: board

[저장/수정] → 이름: 게시판 목록 / slug: board
```

**4단계 — 메뉴 연결**

```
/admin/menus 접속
→ [+ 메뉴 추가] 또는 연결할 메뉴 클릭
→ [페이지 메이커 연동] → 게시판 목록 선택
→ URL: /admin/generated/board 자동 입력
→ [저장]
```

**결과:**

```
사이드바 "게시판" 클릭
  → 목록 화면 표시 (검색폼 + 테이블)
  → [등록] 클릭 → 등록 팝업 열림 → 저장 → 목록 갱신
  → 수정 아이콘 클릭 → 수정 팝업 열림 (기존 값 채워짐)
  → 상세 아이콘 클릭 → 상세 팝업 열림 (읽기 전용)
  → 삭제 아이콘 클릭 → 확인 후 삭제
```

---

## 8. 자주 발생하는 실수

### ❌ List를 Layer보다 먼저 저장

**증상:** actions 컬럼에 팝업 slug를 입력했는데 팝업이 열리지 않음
**원인:** Layer 템플릿이 아직 DB에 없어서 렌더러가 팝업 설정을 찾지 못함
**해결:** Layer 먼저 저장 → List 저장

---

### ❌ Key를 한글로 입력

**증상:** 데이터를 등록했는데 목록 테이블에 값이 표시되지 않음
**원인:** Layer의 fieldKey가 한글 → data_json에 한글 키로 저장 → List accessor(영문)와 불일치
**해결:** Layer와 List 모두 Key를 영문으로 재입력 후 재저장. 기존 데이터는 재등록 필요

---

### ❌ List slug ≠ Layer slug

**증상:** 등록 버튼 클릭 시 팝업이 열리지 않거나 "템플릿을 찾을 수 없습니다" 오류
**원인:** 버튼 설정의 팝업 slug와 Layer 저장 시 입력한 slug가 다름
**해결:** List 빌더에서 버튼/actions의 팝업 slug를 Layer slug와 동일하게 수정 후 재저장

---

### ❌ file 컬럼 Key 불일치

**증상:** 목록에서 첨부파일 컬럼이 항상 `-` 또는 `📎 0`으로 표시
**원인:** Layer file 필드 Key(예: `attach`)와 List file 컬럼 Key(예: `files`)가 다름
**해결:** 둘 다 동일한 Key로 통일 후 재저장. 기존 파일 데이터는 영향 없음

---

### ❌ DateRange Key 미입력 (한글 자동 사용)

**증상:** 날짜 범위로 검색해도 결과가 0건
**원인:** Key를 비워두면 라벨명(한글)이 파라미터 키가 됨 → BE에서 영문만 허용하므로 검색 조건 무시
**해결:** DateRange 필드의 Key를 영문으로 입력 (예: `regDate`) 후 재저장

---

### ❌ 수정 팝업에 기존 값이 채워지지 않음

**증상:** 수정 아이콘 클릭 시 팝업이 열리지만 모든 필드가 비어 있음
**원인:** List 테이블 컬럼 Key와 Layer 필드 Key가 불일치 → 행 데이터의 키가 팝업 필드 Key와 매핑 안 됨
**해결:** Layer fieldKey = List accessor 동일하게 맞춤

---

## 9. API 목록

### 페이지 템플릿 (page_template)

| 메서드 | URL | 설명 |
|---|---|---|
| GET | `/api/v1/page-templates` | 전체 템플릿 목록 (이름순) |
| GET | `/api/v1/page-templates/{id}` | ID로 단건 조회 |
| GET | `/api/v1/page-templates/by-slug/{slug}?type=LIST\|LAYER` | slug + 타입으로 단건 조회 |
| POST | `/api/v1/page-templates` | 신규 저장 |
| PUT | `/api/v1/page-templates/{id}` | 수정 |
| DELETE | `/api/v1/page-templates/{id}` | 삭제 |

### 페이지 데이터 (page_data)

| 메서드 | URL | 설명 |
|---|---|---|
| GET | `/api/v1/page-data/{slug}` | 목록 조회 (검색 + 페이지네이션) |
| GET | `/api/v1/page-data/{slug}/{id}` | 단건 조회 |
| POST | `/api/v1/page-data/{slug}` | 신규 등록 |
| PUT | `/api/v1/page-data/{slug}/{id}` | 수정 |
| DELETE | `/api/v1/page-data/{slug}/{id}` | 삭제 (연관 파일 함께 삭제) |
| GET | `/api/v1/page-data/{slug}/export` | 엑셀/CSV 다운로드 |

### 파일 (page_file)

| 메서드 | URL | 설명 |
|---|---|---|
| POST | `/api/page-files/upload` | 파일 업로드 (임시 상태) |
| GET | `/api/page-files/{id}` | 파일 다운로드 (Blob 스트리밍) |
| GET | `/api/page-files/meta?ids=1,2,3` | 파일 메타 일괄 조회 |
| PATCH | `/api/page-files/link` | 파일 → page_data 연결 |
| DELETE | `/api/page-files/{id}` | 파일 삭제 |

---

## 10. 주요 파일 위치

| 파일 | 역할 |
|---|---|
| `bo/src/app/admin/templates/make/list/page.tsx` | List Builder 페이지 |
| `bo/src/app/admin/templates/make/layer/page.tsx` | Layer Builder 페이지 |
| `bo/src/app/admin/templates/make/_shared/` | 빌더 공통 모듈 (styles, types, utils, components) |
| `bo/src/app/admin/generated/[slug]/page.tsx` | DB configJson 기반 공통 렌더러 |
| `bo/src/app/admin/generated/{slug}/page.tsx` | 개발자방식 생성 목록 페이지 |
| `bo/src/app/admin/generated/{slug}/LayerPopup.tsx` | 개발자방식 생성 팝업 컴포넌트 |
| `bo/src/components/layer/LayerPopupRenderer.tsx` | 레이어 팝업 공통 렌더러 |
| `bo/src/components/menus/MenuDetail.tsx` | 메뉴 관리 + 페이지 메이커 연동 |
| `bo-api/.../PageTemplateController.java` | 템플릿 CRUD API |
| `bo-api/.../PageDataController.java` | 데이터 CRUD + 엑셀 API |
| `bo-api/.../PageFileController.java` | 파일 업로드/다운로드 API |
