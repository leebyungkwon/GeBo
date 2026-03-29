# 페이지 메이커 워크플로우 완전 가이드

> **대상**: 이 프로젝트에 처음 합류한 신입 개발자
> **목표**: Make > List / Layer 기능이 무엇인지, 어떻게 동작하는지, 메뉴와 어떻게 연결되는지를 처음부터 끝까지 이해한다.

---

## 목차

1. [이 시스템이 존재하는 이유](#1-이-시스템이-존재하는-이유)
2. [핵심 개념 먼저 이해하기](#2-핵심-개념-먼저-이해하기)
3. [전체 흐름 한눈에 보기](#3-전체-흐름-한눈에-보기)
4. [Make > List 완전 해설](#4-make--list-완전-해설)
5. [Make > Layer 완전 해설](#5-make--layer-완전-해설)
6. [메뉴 연동 완전 해설](#6-메뉴-연동-완전-해설)
7. [내부 데이터 흐름 (기술적 관점)](#7-내부-데이터-흐름-기술적-관점)
8. [실전 시나리오 — 처음부터 끝까지](#8-실전-시나리오--처음부터-끝까지)
9. [자주 하는 실수 & FAQ](#9-자주-하는-실수--faq)
10. [용어 사전](#10-용어-사전)

---

## 1. 이 시스템이 존재하는 이유

일반적인 관리자 시스템을 만들면 이런 패턴이 반복됩니다.

```
"상품 관리" 화면 만들기
  → 검색폼 컴포넌트 작성 (이름, 카테고리, 날짜)
  → 테이블 컴포넌트 작성 (이름, 가격, 상태 컬럼)
  → 등록/수정 팝업 작성
  → API 연동
  → 메뉴 등록
  → 배포

"게시글 관리" 화면 만들기
  → 똑같은 과정 반복...
```

**페이지 메이커**는 이 반복을 없애기 위해 만든 도구입니다.

```
"상품 관리" 화면 만들기
  → Make > List에서 필드 클릭 클릭 (10분)
  → Make > Layer에서 팝업 구성 (5분)
  → 메뉴 등록 (2분)
  → 완성!
```

---

## 2. 핵심 개념 먼저 이해하기

### 2.1 slug — 화면의 주민등록번호

**slug**는 각 화면을 식별하는 고유한 영문 ID입니다.

```
slug = "user-list"
  → URL: /admin/generated/user-list
  → DB 조회 키: page_templates.slug = 'user-list'
  → API 경로: GET /api/v1/page-templates/by-slug/user-list

slug = "user-form"
  → 팝업 호출 시: <LayerPopupRenderer slug="user-form" />
```

slug가 같은 것들은 모두 같은 화면을 가리킵니다.
slug를 보면 어떤 화면인지 바로 알 수 있어야 합니다. (예: `product-list`, `order-edit`)

### 2.2 configJson — 화면 설계도

빌더에서 설정한 모든 내용이 JSON 문자열로 DB에 저장됩니다.

**List 화면의 configJson 구조:**
```json
{
  "fieldRows": [
    {
      "id": "row-1",
      "cols": 4,
      "fields": [
        { "id": "f-1", "type": "input", "label": "이름", "colSpan": 1 },
        { "id": "f-2", "type": "select", "label": "상태", "colSpan": 1, "options": ["활성:active", "비활성:inactive"] }
      ]
    }
  ],
  "tableColumns": [
    { "id": "c-1", "header": "이름", "accessor": "name", "cellType": "text" },
    { "id": "c-2", "header": "상태", "accessor": "status", "cellType": "badge" },
    { "id": "c-3", "header": "관리", "accessor": "actions", "cellType": "actions",
      "actions": ["edit", "delete"],
      "editPopupSlug": "user-form" }
  ],
  "buttons": [
    { "id": "btn-1", "label": "등록", "type": "primary", "action": "register", "popupSlug": "user-form" }
  ]
}
```

**Layer 팝업의 configJson 구조:**
```json
{
  "layerTitle": "사용자 등록/수정",
  "layerType": "center",
  "layerWidth": "md",
  "fieldRows": [
    {
      "id": "row-1",
      "cols": 2,
      "fields": [
        { "id": "f-1", "type": "input", "label": "이름", "fieldKey": "name", "colSpan": 1 },
        { "id": "f-2", "type": "input", "label": "이메일", "fieldKey": "email", "colSpan": 1 }
      ]
    }
  ],
  "layerButtons": [
    { "id": "lb-1", "label": "닫기", "type": "secondary", "action": "close" },
    { "id": "lb-2", "label": "저장", "type": "primary", "action": "save" }
  ]
}
```

### 2.3 page_data — 실제 데이터 창고

사용자가 화면에서 입력한 데이터는 `page_data` 테이블에 저장됩니다.

```
page_data 테이블
┌────┬───────────────┬──────────────────────────────────────────┐
│ id │ template_slug │ data_json                                │
├────┼───────────────┼──────────────────────────────────────────┤
│  1 │ user-list     │ {"name": "홍길동", "email": "h@g.com"}   │
│  2 │ user-list     │ {"name": "김철수", "email": "k@g.com"}   │
│  3 │ product-list  │ {"name": "노트북", "price": "1200000"}   │
└────┴───────────────┴──────────────────────────────────────────┘
```

각 화면(slug)별로 데이터가 쌓입니다.
`data_json`은 JSONB 타입이라 스키마가 고정되지 않고, 화면마다 다른 키를 가질 수 있습니다.

### 2.4 저장 vs 생성 — 반드시 구분해야 하는 두 개념

| | **저장** | **생성** |
|---|---|---|
| 버튼 | 💾 저장 | ⚡ 생성 |
| 하는 일 | 설계 내용을 DB에 기록 | 실제 작동하는 파일 생성 |
| 저장 위치 | DB `page_template` 테이블 | FE 코드 파일 |
| 파일 경로 | — | `bo/src/app/admin/generated/{slug}/page.tsx` |
| 이후 상태 | 불러와서 계속 수정 가능 | URL로 직접 접근 가능 |

> ⚠️ **중요**: 저장만 하면 실제 화면이 없습니다. 반드시 **생성**까지 해야 메뉴에 연결할 수 있습니다.
>
> 단, 동적 렌더러(`[slug]/page.tsx`)가 있어서 생성 없이도 DB의 configJson으로 화면을 그릴 수는 있습니다. 그러나 커스텀 로직이 필요할 때는 생성된 파일을 직접 수정해야 합니다.

---

## 3. 전체 흐름 한눈에 보기

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 STEP 1        STEP 2         STEP 3          STEP 4     STEP 5
 빌더에서       템플릿         실제 파일        메뉴        완성된
 설계           저장           생성             등록        화면 운영
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Make > List]
필드/컬럼/버튼  ─→  page_template  ─→  generated/    ─→  메뉴 URL  ─→  목록 화면
클릭으로 구성        DB 저장             {slug}/           연결            CRUD
                    (configJson)        page.tsx

[Make > Layer]
팝업 유형/필드  ─→  page_template  ─→  generated/    ─→  List 버튼 ─→  팝업 열림
버튼 구성            DB 저장             {slug}/           에 연결         저장/수정
                    (configJson)        page.tsx
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 4. Make > List 완전 해설

### 4.1 화면 구성 요소

```
┌──────────────────────────────────────────────────────────────┐
│                     Make > List 빌더                          │
├────────────────────────┬─────────────────────────────────────┤
│   왼쪽: 설정 패널        │        오른쪽: 실시간 미리보기         │
│                        │                                     │
│ [템플릿 선택 드롭다운]   │  검색폼:                            │
│  └ 저장된 템플릿 목록    │  ┌──────────────┬──────────────┐   │
│                        │  │이름           │상태           │   │
│ [공통(JSON)] [DB 연동]  │  └──────────────┴──────────────┘   │
│  └ DB탭: 실제 테이블     │  [검색] [초기화]                     │
│    선택 → 필드 자동생성   │                                     │
│                        │  테이블:                            │
│ 탭: [검색] [테이블] [버튼]│  ┌────┬──────┬────────────────┐   │
│                        │  │이름 │상태   │      관리       │   │
│ 검색 탭:               │  ├────┼──────┼────────────────┤   │
│  + 행 추가             │  │홍길동│ 활성 │ [수정] [삭제]  │   │
│    + 필드 추가         │  └────┴──────┴────────────────┘   │
│      (input/select/    │                                     │
│       date/dateRange/  │  [등록] 버튼                        │
│       radio/checkbox/  │                                     │
│       quickDate)       │                                     │
│                        │                                     │
│ 테이블 탭:             │                                     │
│  + 컬럼 추가           │                                     │
│    (text/badge/        │                                     │
│     boolean/actions)  │                                     │
│                        │                                     │
│ 버튼 탭:              │                                     │
│  + 버튼 추가           │                                     │
│    (등록/엑셀/커스텀)   │                                     │
│                        │                                     │
│ [💾 저장] [⚡ 생성]     │                                     │
└────────────────────────┴─────────────────────────────────────┘
```

### 4.2 검색 탭 — 검색 필드 구성

검색폼에 들어갈 입력 요소를 추가합니다.

**행(Row) 개념:**
- 검색폼은 **행** 단위로 구성됩니다.
- 각 행은 최대 cols 수(1~5) 만큼 칸을 가집니다.
- 필드의 colSpan으로 몇 칸을 차지할지 지정합니다.

```
cols=4인 행에 필드 2개:
┌────────────────┬────────────────┬─────────────────────────────┐
│ 이름 (span=1)  │ 상태 (span=1)  │  (빈 공간 span=2)            │
└────────────────┴────────────────┴─────────────────────────────┘

cols=4인 행에 날짜범위(span=2) + 이름(span=1):
┌──────────────────────────┬────────────────┬──────────────────┐
│ 날짜 범위 (span=2)        │ 이름 (span=1)  │ (빈 공간 span=1) │
└──────────────────────────┴────────────────┴──────────────────┘
```

**필드 유형:**

| 유형 | 설명 | 사용 예 |
|---|---|---|
| `input` | 텍스트 입력 | 이름, 키워드 검색 |
| `select` | 드롭다운 | 상태, 카테고리 |
| `date` | 날짜 선택 | 등록일 |
| `dateRange` | 시작일~종료일 | 기간 검색 |
| `radio` | 라디오 버튼 | 성별, 유형 |
| `checkbox` | 체크박스 | 복수 상태 필터 |
| `quickDate` | 오늘/1주/1개월 버튼 | 빠른 기간 선택 |

**DB 연동 탭 사용 시:**
실제 DB 테이블을 선택하면 컬럼 타입에 따라 검색 필드가 자동 생성됩니다.
- `varchar`, `text` → input
- `boolean`, `tinyint(1)` → select
- `datetime`, `timestamp` → dateRange
- `enum` → select

### 4.3 테이블 탭 — 목록 컬럼 구성

데이터 목록에 표시할 컬럼을 정의합니다.

**컬럼 셀 유형:**

| 유형 | 설명 | 예 |
|---|---|---|
| `text` | 일반 텍스트 | 이름, 이메일 |
| `badge` | 색상 배지 | 상태(활성=초록, 비활성=회색) |
| `boolean` | Y/N 또는 커스텀 텍스트 | 공개여부 |
| `actions` | 수정/삭제/상세 버튼 | 관리 컬럼 |

**`actions` 컬럼의 팝업 연결:**

```
actions 컬럼 설정 시
  ├─ 수정 버튼 → editPopupSlug: "user-form"
  │               클릭 시 해당 Layer 팝업이 기존 데이터를 채워서 열림
  ├─ 상세 버튼 → detailPopupSlug: "user-detail"
  │               클릭 시 해당 Layer 팝업이 readonly 모드로 열림
  └─ 삭제 버튼 → confirm 후 DELETE /api/v1/page-data/{slug}/{id}
```

### 4.4 버튼 탭 — 상단/하단 버튼 구성

목록 화면의 기능 버튼을 추가합니다.

| 액션 | 동작 |
|---|---|
| `register` | 지정한 Layer 팝업을 **등록 모드**로 열기 |
| `excel` | 목록 데이터 엑셀 다운로드 (구현 예정) |
| `custom` | 커스텀 함수 실행 (코드에서 직접 구현) |

버튼 위치는 `above`(목록 위) 또는 `between`(검색폼과 목록 사이)으로 설정합니다.

### 4.5 목록 표시 방식

| 방식 | 설명 | 사용 예 |
|---|---|---|
| `pagination` | 페이지 번호 네비게이션 | 일반 목록 |
| `scroll` | 무한 스크롤 (자동 다음 페이지 로드) | 피드형 목록 |

---

## 5. Make > Layer 완전 해설

### 5.1 Layer가 하는 역할

Layer는 **팝업 창**입니다. List 화면의 버튼을 클릭했을 때 나타나서:
- **등록**: 새 데이터를 입력하고 저장
- **수정**: 기존 데이터를 불러와서 수정
- **상세**: 기존 데이터를 읽기 전용으로 보기

### 5.2 팝업 유형 2가지

**중앙 팝업 (center)**
```
┌─────────────────────────────────────────────┐
│                 배경 (어둡게)                  │
│   ┌─────────────────────────────────────┐   │
│   │ 사용자 등록                    [X]   │   │
│   ├─────────────────────────────────────┤   │
│   │ 이름 [          ] 이메일 [          ]│   │
│   │ 메모 [                              ]│   │
│   ├─────────────────────────────────────┤   │
│   │                   [닫기]    [저장]   │   │
│   └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
width: sm / md / lg / xl 선택
```

**우측 드로어 (right)**
```
┌────────────────────────┬────────────────────┐
│                        │ 사용자 등록    [X] │
│                        ├────────────────────┤
│   기존 화면 (흐려짐)    │ 이름 [            ]│
│                        │ 이메일 [          ]│
│                        │ 메모 [            ]│
│                        │                   │
│                        ├────────────────────┤
│                        │ [닫기]    [저장]   │
└────────────────────────┴────────────────────┘
항상 고정 너비 420px
```

### 5.3 필드 구성

Layer의 폼 필드도 Row 기반으로 구성합니다.

```
예: cols=2인 Row에 필드 3개

┌────────────────────┬────────────────────┐
│ 이름 (colSpan=1)   │ 이메일 (colSpan=1) │  ← Row 1 (cols=2)
└────────────────────┴────────────────────┘
┌────────────────────────────────────────┐
│ 메모 (colSpan=2, rowSpan=2)            │  ← Row 2 (cols=2)
│                                        │    textarea가 두 행 높이
│                                        │
└────────────────────────────────────────┘
```

**rowSpan**: textarea처럼 높이가 필요한 필드는 rowSpan=2 또는 3으로 설정하면 세로로 더 넓게 표시됩니다.

### 5.4 fieldKey — 데이터와 연결되는 핵심 키

필드에 `fieldKey`를 설정하면 DB 저장/로드 시 이 키가 사용됩니다.

```
Layer 필드 설정:
  label: "사용자명"
  fieldKey: "username"          ← 이게 DB 저장 키

저장 시 page_data.data_json:
  { "username": "홍길동" }       ← fieldKey가 JSON 키가 됨

수정 시 기존 데이터 로드:
  DB에서 data_json.username 읽어서
  "사용자명" 필드에 자동으로 채워줌
```

`fieldKey`를 설정하지 않으면 label을 camelCase로 변환한 값이 사용됩니다.
(예: "사용자명" → 자동 변환 실패 가능, 명시적 설정 권장)

### 5.5 하단 버튼 액션

| 액션 | 동작 |
|---|---|
| `close` | 팝업 닫기 |
| `save` | 데이터 저장 후 팝업 닫기 + 목록 새로고침 |
| `custom` | 아무 동작 없음 (개발자가 코드에서 구현) |

---

## 6. 메뉴 연동 완전 해설

### 6.1 메뉴 구조 이해하기

사이드바 메뉴는 DB `menus` 테이블에서 불러옵니다.

```
menus 테이블 구조 (트리 형태)
┌─────────────────────────────────────────────┐
│ isCategory=true  → 섹션 구분자 (클릭 불가)   │
│  예: "MANAGEMENT", "SYSTEM"                 │
├─────────────────────────────────────────────┤
│ url 없음 + 자식 있음 → 폴더 (클릭 시 열림)    │
│  예: "Settings", "Templates"               │
├─────────────────────────────────────────────┤
│ url 있음 → 실제 페이지 링크                   │
│  예: url="/admin/settings/users"           │
└─────────────────────────────────────────────┘
```

사이드바에 표시되는 모습:
```
SYSTEM                          ← isCategory=true (회색 텍스트)
  Settings ▼                    ← url 없음, 자식 있음 (폴더)
    관리자 관리                  ← url=/admin/settings/users
    메뉴 관리                   ← url=/admin/settings/menus
```

### 6.2 List 화면을 메뉴에 연결하는 방법

**Settings > 메뉴 관리** 접속 후:

```
Step 1: 원하는 위치에 새 메뉴 추가
        (예: MANAGEMENT 카테고리 하위)

Step 2: 메뉴 정보 입력
  ┌──────────────────────────────────────────────────┐
  │ 이름: 사용자 관리                                  │
  │ URL:  [                          ] [페이지 메이커 연동▼] │
  │                                          ↓              │
  │                                  저장된 LIST 템플릿 목록  │
  │                                  ├ 사용자 목록           │
  │                                  │  /admin/generated/user-list │
  │                                  └ ...                  │
  │                                                        │
  │ 아이콘: Users                                          │
  └──────────────────────────────────────────────────────┘

Step 3: 저장

Step 4: 사이드바 새로고침 → 메뉴 표시 확인
```

**"페이지 메이커 연동" 버튼**은 `LIST` 타입 템플릿만 목록에 표시합니다.
(`LAYER` 팝업은 메뉴 URL로 사용하지 않기 때문)

### 6.3 Layer 팝업은 메뉴에 직접 연결하지 않는다

Layer 팝업은 **List 화면의 버튼**에 연결됩니다. 메뉴 URL 연결 대상이 아닙니다.

```
연결 방법 1: 등록 버튼에 연결
  Make > List → 버튼 탭 → [등록] 버튼 추가
  → 팝업 slug: user-form
  → 저장 후 재생성

연결 방법 2: 수정/상세 버튼에 연결
  Make > List → 테이블 탭 → actions 컬럼 추가
  → 수정 버튼 팝업: user-form
  → 상세 버튼 팝업: user-detail
  → 저장 후 재생성
```

---

## 7. 내부 데이터 흐름 (기술적 관점)

신입 개발자가 코드 수준에서 이해해야 할 내용입니다.

### 7.1 List 화면이 데이터를 보여주는 흐름

```
사용자가 /admin/generated/user-list 접속
        ↓
GeneratedPage 컴포넌트 마운트
        ↓
GET /api/v1/page-templates/by-slug/user-list
        ↓
configJson 파싱 → fieldRows, tableColumns, buttons 추출
        ↓
검색폼 동적 렌더링 (fieldRows → 필드 컴포넌트들)
        ↓
GET /api/v1/page-data/user-list?page=0&size=10
        ↓
응답: { content: [{id:1, dataJson:{name:"홍길동",...}}, ...] }
        ↓
tableColumns의 accessor로 data_json에서 값 추출
  (예: accessor="name" → row.name → "홍길동")
        ↓
테이블 행 렌더링
```

### 7.2 검색 실행 흐름

```
사용자가 검색 조건 입력 후 [검색] 클릭
        ↓
searchValues = { "f-1": "홍", "f-2": "active" }
        ↓
fieldKey/accessor → API 파라미터 키로 변환
  (예: fieldKey="name" → params.name="홍")
        ↓
GET /api/v1/page-data/user-list?page=0&name=홍&status=active
        ↓
BE: SELECT * FROM page_data
    WHERE template_slug='user-list'
      AND data_json->>'name' ILIKE '%홍%'
      AND data_json->>'status' = 'active'
        ↓
결과 목록 표시
```

### 7.3 Layer 팝업이 열리는 흐름

```
사용자가 [등록] 버튼 클릭 (popupSlug="user-form")
        ↓
setPopupOpen(true)
setPopupSlug("user-form")
setEditId(null)             ← null = 신규 등록 모드
        ↓
<LayerPopupRenderer open={true} slug="user-form" editId={null} />
        ↓
GET /api/v1/page-templates/by-slug/user-form
        ↓
configJson 파싱 → fieldRows, layerTitle, layerType, layerButtons 추출
        ↓
팝업 렌더링
```

```
사용자가 [수정] 버튼 클릭 (editPopupSlug="user-form")
        ↓
setPopupOpen(true)
setPopupSlug("user-form")
setEditId(1)                ← 1 = 수정 모드 (행의 _id)
setEditRowData({name:"홍길동", email:"h@g.com"})   ← 현재 행 데이터
        ↓
LayerPopupRenderer: initialData={name:"홍길동",...}
        ↓
각 필드의 fieldKey로 initialData에서 값 찾아 자동 채움
  (예: fieldKey="name" → values["f-1"] = "홍길동")
        ↓
팝업에 기존 데이터가 채워진 상태로 열림
```

### 7.4 Layer 팝업에서 저장하는 흐름

```
사용자가 [저장] 클릭
        ↓
필수 필드 검증 (required=true인 필드들)
        ↓
fieldKey 기준으로 dataJson 구성
  values = { "f-1": "홍길동", "f-2": "hong@g.com" }
  →
  dataJson = { "name": "홍길동", "email": "hong@g.com" }
        ↓
editId === null ?
  → POST /api/v1/page-data/user-list    (신규 등록)
  → PUT  /api/v1/page-data/user-list/1  (수정)
        ↓
성공 → toast 표시 → 팝업 닫힘 → onSaved() 호출 → 목록 새로고침
```

### 7.5 전체 아키텍처 다이어그램

```
[브라우저]
  │
  ├── Sidebar ──────── GET /api/v1/menus ──────────────────────────┐
  │                                                                │
  ├── /admin/generated/{slug}                                      │
  │     │                                                          │
  │     ├── GET /api/v1/page-templates/by-slug/{slug}             │
  │     │     └── page_template 테이블                             │
  │     │           configJson → 화면 구조                          │
  │     │                                                          │
  │     ├── GET /api/v1/page-data/{slug}?검색조건                   │
  │     │     └── page_data 테이블 (JSONB 검색)                    │
  │     │                                                          │
  │     └── LayerPopupRenderer (slug="user-form")                 │
  │           │                                                   │
  │           ├── GET /api/v1/page-templates/by-slug/user-form    │
  │           │                                                   │
  │           └── POST/PUT /api/v1/page-data/{listSlug}          │
  │                 └── page_data 테이블 insert/update            │
  │                                                               │
  └── /admin/settings/menus ───────────────────────────────────────┘
        → 메뉴 트리 관리
        → URL 필드에 /admin/generated/{slug} 입력
```

---

## 8. 실전 시나리오 — 처음부터 끝까지

"**직원 관리**" 화면을 만드는 전체 과정입니다.

### Phase 1: 등록/수정 팝업 만들기 (Make > Layer)

Layer를 먼저 만드는 이유: List에서 버튼을 연결할 때 Layer slug가 필요하기 때문.

**① Make > Layer 접속**

**② 팝업 기본 설정**
```
팝업 제목: 직원 등록/수정
팝업 유형: 중앙 팝업
너비: md
```

**③ 폼 필드 구성**
```
+ 행 추가 (cols=2)
  + 필드 추가
    유형: input
    라벨: 이름
    fieldKey: name
    colSpan: 1
    필수: ✅

  + 필드 추가
    유형: input
    라벨: 이메일
    fieldKey: email
    colSpan: 1

+ 행 추가 (cols=2)
  + 필드 추가
    유형: select
    라벨: 부서
    fieldKey: department
    옵션: 개발팀:dev, 마케팅팀:marketing, 인사팀:hr
    colSpan: 1

  + 필드 추가
    유형: date
    라벨: 입사일
    fieldKey: joinDate
    colSpan: 1

+ 행 추가 (cols=2)
  + 필드 추가
    유형: textarea
    라벨: 메모
    fieldKey: memo
    colSpan: 2   ← 전체 너비
    rowSpan: 2   ← 높이 2배
```

**④ 하단 버튼** (기본값 유지)
```
[닫기] (secondary, close)
[저장] (primary, save)
```

**⑤ 저장**
- slug: `employee-form`
- 이름: 직원 등록/수정

**⑥ 생성 클릭**
- 파일 생성: `/admin/generated/employee-form/page.tsx`

---

### Phase 2: 목록 화면 만들기 (Make > List)

**① Make > List 접속**

**② 검색 탭 구성**
```
+ 행 추가 (cols=4)
  + 필드 추가
    유형: input
    라벨: 이름
    fieldKey: name
    colSpan: 1

  + 필드 추가
    유형: select
    라벨: 부서
    fieldKey: department
    옵션: 전체:, 개발팀:dev, 마케팅팀:marketing, 인사팀:hr
    colSpan: 1

  + 필드 추가
    유형: dateRange
    라벨: 입사일
    fieldKey: joinDate
    colSpan: 2
```

**③ 테이블 탭 구성**
```
+ 컬럼 추가
  유형: text
  헤더: 이름
  accessor: name
  너비: 150px

+ 컬럼 추가
  유형: text
  헤더: 이메일
  accessor: email
  너비: 200px

+ 컬럼 추가
  유형: badge
  헤더: 부서
  accessor: department
  배지 설정:
    dev       → 개발팀  (blue)
    marketing → 마케팅팀 (green)
    hr        → 인사팀  (purple)

+ 컬럼 추가
  유형: actions
  헤더: 관리
  너비: 120px
  수정 버튼: ✅  → 팝업: employee-form
  삭제 버튼: ✅
```

**④ 버튼 탭 구성**
```
+ 버튼 추가
  라벨: 등록
  유형: primary
  액션: register
  팝업: employee-form
```

**⑤ 저장**
- slug: `employee-list`
- 이름: 직원 관리

**⑥ 생성 클릭**
- 파일 생성: `/admin/generated/employee-list/page.tsx`

---

### Phase 3: 메뉴 등록 (Settings > 메뉴 관리)

**① Settings > 메뉴 관리 접속**

**② 새 메뉴 추가**
```
위치: MANAGEMENT 카테고리 하위 (또는 원하는 위치)
이름: 직원 관리
URL: [페이지 메이커 연동 클릭] → employee-list 선택
       → /admin/generated/employee-list 자동 입력
아이콘: Users
```

**③ 저장**

---

### Phase 4: 확인

```
사이드바에 "직원 관리" 메뉴 표시 ✅

클릭 시:
  - 이름/부서/입사일 검색폼 표시 ✅
  - 빈 테이블 (아직 데이터 없음) ✅
  - [등록] 버튼 표시 ✅

[등록] 클릭:
  - "직원 등록/수정" 팝업 열림 ✅
  - 이름/이메일/부서/입사일/메모 입력 ✅
  - [저장] → 팝업 닫힘 → 목록에 행 추가 ✅

목록의 [수정] 클릭:
  - 기존 데이터가 채워진 팝업 열림 ✅
  - 수정 후 [저장] → 목록 업데이트 ✅

목록의 [삭제] 클릭:
  - 확인 다이얼로그 → 확인 → 행 제거 ✅
```

---

## 9. 자주 하는 실수 & FAQ

### Q1. 생성했는데 URL에 접근이 안 돼요.

**원인**: FE 서버가 새 파일을 인식하지 못했을 가능성.
**해결**: FE 서버 재시작 또는 브라우저 하드 새로고침(Ctrl+Shift+R).

---

### Q2. 수정 팝업을 열었는데 데이터가 비어 있어요.

**원인**: Layer 필드의 `fieldKey`가 DB에 저장된 키와 다릅니다.
**확인 방법**:
```
DB page_data.data_json 확인:
  {"userName": "홍길동"}   ← 저장된 키

Layer 필드 fieldKey:
  "name"                  ← 다른 키 → 매핑 실패

해결: fieldKey를 "userName"으로 변경
     또는 DB 저장 키를 통일
```

---

### Q3. 검색해도 결과가 나오지 않아요.

**원인**: 검색 필드의 `fieldKey`가 `data_json` 키와 다릅니다.

```
BE 검색 쿼리:
  data_json->>'name' ILIKE '%홍%'
            ↑ fieldKey 값

List 검색 필드 fieldKey = "name" ✅
Layer 저장 fieldKey = "userName" ❌ → 다름 → 검색 안 됨
```

**해결**: List의 검색 fieldKey와 Layer의 저장 fieldKey를 동일하게 맞춥니다.

---

### Q4. Layer 팝업을 만들었는데 메뉴 연동 목록에 안 보여요.

**이유**: 정상입니다. 메뉴 URL 연동은 `LIST` 타입만 지원합니다.
Layer는 메뉴에 직접 연결하지 않고, List의 버튼에 연결합니다.

---

### Q5. 저장/생성 버튼이 두 개 모두 있는데 언제 뭘 눌러야 하나요?

```
작업 중 (계속 수정할 예정)  → 저장만
배포 준비 완료               → 저장 후 생성
생성 후 내용 변경            → 다시 저장 후 재생성
                             (파일이 최신 configJson으로 덮어쓰여짐)
```

---

### Q6. slug는 어떻게 짓는 게 좋나요?

```
좋은 예:
  user-list        사용자 목록
  user-form        사용자 등록/수정 팝업
  product-list     상품 목록
  product-form     상품 등록/수정 팝업
  order-list       주문 목록
  order-detail     주문 상세 팝업

나쁜 예:
  list1            무슨 목록인지 모름
  popup            어떤 팝업인지 모름
  new              너무 일반적
```

규칙: `{도메인}-{유형}` 형식. 유형은 `list`(목록) 또는 `form`/`detail`(팝업).

---

## 10. 용어 사전

| 용어 | 정의 |
|---|---|
| **slug** | 화면을 식별하는 고유 영문 ID. URL과 DB 키로 사용됨 |
| **configJson** | 빌더에서 만든 화면 설계 내용을 JSON으로 직렬화한 문자열 |
| **page_template** | 화면 설계(configJson)를 저장하는 DB 테이블 |
| **page_data** | 실제 운영 데이터를 저장하는 DB 테이블. JSONB 구조 |
| **fieldKey** | 폼 필드가 data_json에서 사용하는 키 이름 |
| **accessor** | 테이블 컬럼이 data_json에서 읽어오는 키 이름 |
| **동적 렌더러** | `[slug]/page.tsx` — configJson을 읽어 화면을 동적으로 구성하는 공통 컴포넌트 |
| **LayerPopupRenderer** | slug를 받아 Layer 템플릿을 팝업으로 표시하는 공통 컴포넌트 |
| **colSpan** | 필드가 가로 방향으로 차지하는 칸 수 (1~5) |
| **rowSpan** | 필드가 세로 방향으로 차지하는 칸 수 (1~3, textarea 등에 사용) |
| **isCategory** | 사이드바에서 섹션 구분자 역할 (클릭 불가능한 제목) |
| **DB 연동 탭** | 실제 DB 테이블 컬럼을 읽어 필드/컬럼을 자동 생성하는 빌더 기능 |
| **공통(JSON) 탭** | 직접 필드를 구성하는 기본 빌더 모드 |
| **LIST 타입** | 검색폼+목록 화면 템플릿. 메뉴 URL 연동 대상 |
| **LAYER 타입** | 팝업 화면 템플릿. List 버튼에 slug로 연결 |
