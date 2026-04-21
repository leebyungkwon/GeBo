# Builder 시스템 가이드

> 경로: `/admin/templates/builder/list` , `/admin/templates/builder/layer`
> 마지막 업데이트: 2026-04-13

---

## 목차

1. [List Builder](#1-list-builder)
2. [Layer Builder](#2-layer-builder)
3. [저장 방식 2가지](#3-저장-방식-2가지)
   - [관리자방식 — DB 저장](#관리자방식--db-저장)
   - [개발자방식 — TSX 파일 생성](#개발자방식--tsx-파일-생성)
4. [메뉴 연결 방법](#4-메뉴-연결-방법-관리자방식)
5. [List ↔ Layer 연동 흐름](#5-list--layer-연동-흐름)
6. [API 목록](#6-api-목록)
7. [기능 상세 가이드](#7-기능-상세-가이드)
   - [Button 필드 — 다중선택](#button-필드--다중선택)
   - [DateRange 필드 — 날짜 범위 검색](#daterange-필드--날짜-범위-검색)
   - [Text 셀 — 공통코드 복수값 표시](#text-셀--공통코드-복수값-표시)

---

## 1. List Builder

**목적:** 검색폼 + 데이터 테이블 형태의 목록 화면을 No-Code로 구성

### 구성 요소

| 탭 | 설명 |
|---|---|
| **검색** | 검색 필드를 Row 단위로 추가. 각 Row에 1~5칸 배치 |
| **테이블** | 컬럼 단위 추가. 헤더명 / Key / 너비 / 정렬 설정 |
| **버튼** | 등록 / 엑셀 다운로드 / 커스텀 버튼 생성. 위치(검색폼 위/사이) 선택 |

### 검색 필드 타입

| 타입 | 설명 |
|---|---|
| `input` | 텍스트 입력 |
| `select` | 드롭다운 선택 (수동 옵션 또는 공통코드 연동) |
| `date` | 단일 날짜 |
| `dateRange` | 날짜 범위 (시작~종료) |
| `radio` | 라디오 버튼 |
| `checkbox` | 체크박스 |
| `button` | 선택 버튼 (수동 옵션 또는 공통코드 연동). **다중선택** 옵션 지원 |

### 테이블 컬럼 타입

| 타입 | 설명 | Key 필요 |
|---|---|---|
| `text` | 일반 텍스트 / 숫자 | ✅ |
| `badge` | 뱃지 (값별 색상 매핑) | ✅ |
| `boolean` | 공개/비공개 등 true/false 표시 | ✅ |
| `actions` | 수정 / 상세 / 삭제 버튼 컬럼 | ❌ |
| `file` | 첨부파일 개수 표시 + 팝업 연결 | ✅ (Layer 파일 Key와 동일하게 입력) |

### 템플릿 불러오기 검색

설정 패널 상단 드롭다운에서 저장된 LIST 템플릿을 불러올 수 있습니다.
템플릿이 많을 경우 드롭다운 내 검색창에 이름을 입력하면 목록이 실시간으로 필터링됩니다.

### 생성 이력

[생성] 버튼으로 TSX 파일을 생성할 때마다 해당 시점의 설정이 이력으로 저장됩니다.
상단 **[생성 이력...]** 드롭다운을 열면 과거 생성 이력 목록을 확인할 수 있으며,
항목을 선택하면 그 시점의 설정(configJson)이 빌더에 복원됩니다.
이력은 개별 삭제도 가능합니다.

### 데이터 소스

| 모드 | 설명 |
|---|---|
| **공통(JSON)** | `page_data` 테이블에 JSONB로 데이터 저장. 범용 목적 |
| **DB 연동** | 실제 업무 테이블 직접 연결. DB 테이블 선택 시 컬럼 자동 생성 |

### 표시 방식

- **페이지네이션**: 페이지당 N건, 페이지 번호 표시
- **무한스크롤**: 스크롤 시 자동으로 다음 데이터 로드

---

## 2. Layer Builder

**목적:** 등록 / 수정 / 상세 용도의 레이어 팝업을 No-Code로 구성

### 팝업 유형

| 유형 | 설명 |
|---|---|
| **중앙 팝업 (center)** | 화면 정중앙에 오버레이 모달 형태 |
| **우측 드로어 (right)** | 오른쪽에서 슬라이드인 패널 형태 |

### 팝업 너비 (중앙 팝업)

| 옵션 | 너비 |
|---|---|
| Small | 480px |
| Medium | 672px |
| Large | 768px |
| X-Large | 896px |

### 폼 필드 타입

| 타입 | 설명 |
|---|---|
| `input` | 텍스트 입력 |
| `select` | 드롭다운 (수동 옵션 또는 공통코드) |
| `textarea` | 여러 줄 텍스트 |
| `editor` | WYSIWYG 에디터 (Markdown/WYSIWYG 전환) |
| `date` | 날짜 선택 |
| `radio` | 라디오 버튼 |
| `checkbox` | 체크박스 |
| `file` | 파일 업로드 (개당/전체 용량 제한, 허용 타입 설정) |
| `image` | 이미지 업로드 (미리보기 포함) |
| `video` | 동영상 업로드 |

### 템플릿 불러오기 검색

우측 상단 템플릿 드롭다운에서 저장된 LAYER 템플릿을 불러올 수 있습니다.
드롭다운 내 검색창에 이름을 입력하면 목록이 실시간으로 필터링됩니다.

### 생성 이력

[생성] 버튼으로 TSX 파일을 생성할 때마다 해당 시점의 설정이 이력으로 저장됩니다.
상단 **[생성 이력...]** 드롭다운을 열면 과거 생성 이력 목록을 확인할 수 있으며,
항목을 선택하면 그 시점의 설정(configJson)이 빌더에 복원됩니다.
이력은 개별 삭제도 가능합니다.

### 필드 설정 항목

| 항목 | 설명 |
|---|---|
| **라벨** | 필드 표시 이름 |
| **Key** | 데이터 저장 키. `data_json`의 키가 됨. List 컬럼 Key와 반드시 일치해야 함 |
| **ColSpan** | 가로 몇 칸 차지할지 (1~5) |
| **RowSpan** | 세로 몇 칸 차지할지 (1~3, textarea/editor 기본 2) |
| **필수 항목** | 저장 전 빈 값 검증 |
| **읽기 전용** | 상세 보기용 — 입력 불가 |

---

## 3. 저장 방식 2가지

```
                ┌─────────────────────────────────┐
                │      Builder (List / Layer)      │
                └──────────┬──────────┬────────────┘
                           │          │
               ┌───────────▼──┐  ┌────▼──────────────────┐
               │  [수정] 버튼  │  │     [생성] 버튼         │
               │   DB 저장    │  │   TSX 파일 생성         │
               └───────────┬──┘  └────┬──────────────────┘
                           │          │
               ┌───────────▼──┐  ┌────▼──────────────────┐
               │  공통 렌더러  │  │ 개발자가 직접 코드 수정  │
               │ [slug]/page  │  │ /admin/generated/{slug}│
               └──────────────┘  └───────────────────────┘
```

---

### 관리자방식 — DB 저장

> 코드를 전혀 건드리지 않고, 빌더에서 구성한 화면 설정을 DB에 저장하고
> 공통 렌더러가 그 설정을 읽어 실제 페이지를 보여주는 방식입니다.

---

#### STEP 1. List Builder에서 화면 구성

`/admin/templates/builder/list` 접속 후:

- 검색 필드 추가 (예: 타입 select, 타이틀 input)
- 테이블 컬럼 추가 (예: 타입, 타이틀, 첨부파일)
- 버튼 추가 (예: 등록 버튼 → Layer 팝업 연결)
- Layer 팝업 연결 (actions 컬럼 → 수정/상세 팝업 slug 설정)

이 시점에서는 **아무것도 저장되지 않은 상태**입니다.
우측 미리보기에서 샘플 데이터로 결과를 확인할 수 있습니다.

---

#### STEP 2. [저장/수정] 버튼으로 DB 저장

우측 상단 **[저장/수정]** 버튼 클릭 → 저장 모달이 열립니다.

| 입력 항목 | 예시 | 설명 |
|---|---|---|
| 템플릿 이름 | 게시판 목록1 | 빌더에서 식별용 이름 |
| Slug | board1 | URL 경로에 사용됨 (영문, 숫자, 하이픈) |
| 설명 | 게시판 목록 페이지 | 선택 입력 |

저장 버튼 클릭 시:

```
POST /api/v1/page-templates
{
  "name": "게시판 목록1",
  "slug": "board1",
  "templateType": "LIST",
  "configJson": "{ 검색폼/테이블/버튼 전체 설정 JSON }",
  "description": "..."
}
```

DB의 `page_template` 테이블에 1개 행이 저장됩니다.

```
page_template 테이블
┌────┬──────────────┬────────┬──────────────┬────────────────────────────┐
│ id │ name         │ slug   │ templateType │ configJson                 │
├────┼──────────────┼────────┼──────────────┼────────────────────────────┤
│ 1  │ 게시판 목록1  │ board1 │ LIST         │ {"fieldRows":[...],"table..│
└────┴──────────────┴────────┴──────────────┴────────────────────────────┘
```

> ⚠️ TSX 파일은 생성되지 않습니다. DB에만 저장됩니다.

---

#### STEP 3. 메뉴에 연결

메뉴 관리 화면(`/admin/menus`)으로 이동합니다.

1. 원하는 메뉴 항목 클릭 (또는 새 메뉴 추가)
2. URL 입력란 옆 **[페이지 메이커 연동]** 버튼 클릭
3. 저장된 LIST 템플릿 목록이 드롭다운으로 표시됨
4. **게시판 목록1** 선택
5. URL 입력란에 `/admin/generated/board1` 자동 입력됨
6. **[저장]** 버튼 클릭

```
menu 테이블
┌────┬─────────┬───────────────────────────┐
│ id │ name    │ url                       │
├────┼─────────┼───────────────────────────┤
│ 10 │ 게시판1  │ /admin/generated/board1   │
└────┴─────────┴───────────────────────────┘
```

이제 사이드바에 **게시판1** 메뉴가 생기고, 클릭하면 `/admin/generated/board1`로 이동합니다.

---

#### STEP 4. 페이지 접속 시 공통 렌더러 동작

사용자가 사이드바에서 **게시판1** 클릭 →
URL: `/admin/generated/board1`
이 URL은 Next.js의 **`[slug]/page.tsx`** (공통 렌더러) 가 처리합니다.

```
[slug]/page.tsx 실행 순서

1. URL에서 slug 추출 → "board1"

2. BE API 호출
   GET /api/v1/page-templates/by-slug/board1?type=LIST
   ↓
   응답: { configJson: "{ 검색필드, 테이블컬럼, 버튼 설정... }" }

3. configJson 파싱
   → 검색 필드 목록, 테이블 컬럼 목록, 버튼 목록 추출

4. 초기 데이터 로드
   GET /api/v1/page-data/board1?page=0&size=10
   ↓
   응답: { content: [...행 데이터], totalElements: 5 }

5. 화면 렌더링
   → 검색폼 (타입 select, 타이틀 input) 표시
   → 테이블 (타입, 타이틀, 첨부파일 컬럼) 표시
   → 등록 버튼 표시
   → 실제 데이터 행 표시
```

---

#### KEY 구조 — 빌더 설정 → DB 저장 → 목록 표시 전체 흐름

> **Key** 는 빌더 UI에서 입력하는 값으로, Layer와 List 양쪽에서 동일하게 사용됩니다.
> Key는 빌더 설정(`configJson`) → 실제 데이터(`data_json`) → 파일 연결(`field_key`) 세 곳에 걸쳐 사용됩니다.
>
> ⚠️ Key 미입력 시 → 라벨명이 자동으로 Key가 됨 (한글 라벨 = 한글 Key → **반드시 영문으로 직접 입력 권장**)

---

**1단계 — Layer Builder에서 Key 설정 → page_template.configJson에 저장**

빌더에서 필드를 추가하고 Key를 입력하면, 그 내용이 `configJson` 안에 그대로 저장됩니다.

```json
// page_template 테이블의 configJson 컬럼 (templateType = LAYER)
// 빌더에서 입력한 Key가 "fieldKey" 프로퍼티로 저장됨
{
  "fieldRows": [
    {
      "cols": 2,
      "fields": [
        { "label": "타입",    "fieldKey": "type",    "type": "select" },
        { "label": "제목",    "fieldKey": "title",   "type": "input"  },
        { "label": "내용",    "fieldKey": "content", "type": "editor" },
        { "label": "첨부파일", "fieldKey": "attach",  "type": "file"   }
      ]
    }
  ]
}
```

---

**2단계 — List Builder에서 Key 설정 → page_template.configJson에 저장**

List 빌더의 각 컬럼에 설정한 Key가 `configJson` 안에 저장됩니다.

```json
// page_template 테이블의 configJson 컬럼 (templateType = LIST)
// 빌더에서 입력한 Key가 "accessor" 프로퍼티로 저장됨
{
  "tableColumns": [
    { "header": "타입",    "accessor": "type",   "cellType": "text"    },
    { "header": "제목",    "accessor": "title",  "cellType": "text"    },
    { "header": "첨부파일", "accessor": "attach", "cellType": "file"    },
    { "header": "",        "accessor": "",       "cellType": "actions",
      "editPopupSlug": "board1", "detailPopupSlug": "board1-detail" }
  ]
}
```

---

**3단계 — 사용자가 폼 저장 → page_data.data_json에 Key 기준으로 저장**

Layer 팝업에서 [저장] 클릭 시, Key를 키로 사용해 `data_json`에 저장됩니다.

```json
// page_data 테이블의 data_json 컬럼
// Key가 그대로 JSON 키가 됨
{
  "type":    "공지",
  "title":   "첫 번째 게시글",
  "content": "<p>내용입니다</p>",
  "attach":  [1, 2]
}
```

파일 필드(`attach`)의 값은 **파일 ID 배열** — 실제 파일은 `page_file` 테이블에 별도 저장됩니다.

```
page_file 테이블
┌────┬─────────┬───────────┬────────────────┬──────────────────┐
│ id │ data_id │ field_key │ orig_name      │ file_size        │
├────┼─────────┼───────────┼────────────────┼──────────────────┤
│ 1  │ 100     │ attach    │ 보고서.pdf      │ 1,240,000 bytes  │
│ 2  │ 100     │ attach    │ 첨부파일.xlsx   │ 524,000 bytes    │
└────┴─────────┴───────────┴────────────────┴──────────────────┘
          ↑             ↑
    page_data.id    Key = Layer에서 입력한 Key와 동일
```

---

**4단계 — 목록 조회 시 Key로 data_json에서 값을 꺼내 표시**

```
page_data.data_json              List 컬럼 Key       화면 표시
────────────────────────────     ─────────────────   ──────────────────
{ "type":    "공지"         } →→  Key: "type"    →   "공지"
{ "title":   "첫 번째 게시글"} →→  Key: "title"   →   "첫 번째 게시글"
{ "attach":  [1, 2]         } →→  Key: "attach"  →   "📎 2"
```

---

**Key 불일치 시 문제 예시**

```
Layer Key  →  data_json 저장키  →  List Key   →  화면
──────────────────────────────────────────────────────
"attach"   →  "attach": [1,2]  →  "attach"   →  📎 2  ✅
"attach"   →  "attach": [1,2]  →  "files"    →  -     ❌ (Key 불일치)
"attachFiles" → "attachFiles":[1] → "attach" →  -     ❌ (Key 불일치)
```

---

**전체 Key 흐름 요약**

```
[Layer Builder]    [page_template.configJson]  [page_data.data_json]  [List Builder]
  Key 입력       →   fieldKey 프로퍼티로 저장  →   Key로 저장됨       ←   Key 입력
─────────────────────────────────────────────────────────────────────────────────────
  "type"         →   fieldKey: "type"         →   "type":  "공지"    ←   Key: "type"
  "title"        →   fieldKey: "title"        →   "title": "제목"    ←   Key: "title"
  "attach"(file) →   fieldKey: "attach"       →   "attach": [1,2]    ←   Key: "attach"
                                                        ↓
                                                 [page_file 테이블]
                                                 field_key: "attach"
                                                 data_id: 100
                                                 id: 1, 2
```

> Layer configJson에서는 `fieldKey`, List configJson에서는 `accessor`라는 프로퍼티명으로 저장되지만
> 빌더 UI에서는 둘 다 **Key** 라고 표시되며, 반드시 **동일한 값**을 입력해야 합니다.

---

#### STEP 5. 데이터 등록 (Layer 팝업 연동)

목록 페이지에서 **[등록]** 버튼 클릭 →
`LayerPopupRenderer` 컴포넌트가 Layer 팝업을 불러옵니다.

```
LayerPopupRenderer 실행 순서

1. popupSlug = "board1" (Layer 타입)

2. BE API 호출
   GET /api/v1/page-templates/by-slug/board1?type=LAYER
   ↓
   응답: { configJson: "{ 팝업 폼 필드 설정... }" }

3. configJson 파싱 → 폼 필드 렌더링
   (타입 select, 제목 input, 내용 editor, 첨부파일 file)

4. 사용자가 값 입력 후 [저장] 클릭

5. 파일이 있으면 먼저 업로드
   POST /api/page-files/upload → 파일 ID 반환

6. 데이터 저장
   POST /api/v1/page-data/board1
   {
     "dataJson": {
       "type": "공지",
       "title": "첫 번째 게시글",
       "content": "<p>내용</p>",
       "attach": [1, 2]   ← 업로드된 파일 ID 배열
     }
   }

7. 파일을 방금 저장된 데이터 ID에 연결
   PATCH /api/page-files/link
   { "fileIds": [1, 2], "dataId": 100 }

8. 팝업 닫힘 → 목록 자동 새로고침
```

`page_data` 테이블에 행이 추가됩니다:

```
page_data 테이블
┌─────┬───────────────┬────────────────────────────────────────────────┐
│ id  │ template_slug │ data_json                                      │
├─────┼───────────────┼────────────────────────────────────────────────┤
│ 100 │ board1        │ {"type":"공지","title":"첫 번째 게시글",        │
│     │               │  "content":"<p>내용</p>","attach":[1,2]}       │
└─────┴───────────────┴────────────────────────────────────────────────┘
```

`page_file` 테이블에도 파일 정보가 저장됩니다:

```
page_file 테이블
┌────┬───────────────┬─────────┬───────────┬──────────────┐
│ id │ template_slug │ data_id │ field_key │ orig_name    │
├────┼───────────────┼─────────┼───────────┼──────────────┤
│ 1  │ board1        │ 100     │ attach    │ 보고서.pdf    │
│ 2  │ board1        │ 100     │ attach    │ 첨부파일.xlsx │
└────┴───────────────┴─────────┴───────────┴──────────────┘
```

---

#### STEP 6. 수정 / 상세 버튼

목록에서 행의 **연필(수정)** 아이콘 클릭:

```
→ editId = 100 (행 ID)
→ editRowData = { type: "공지", title: "첫 번째 게시글", attach: [1,2] }
→ LayerPopupRenderer(slug="board1", type=LAYER, editId=100, initialData=editRowData)
→ 기존 값이 채워진 폼 표시
→ [저장] → PUT /api/v1/page-data/board1/100
```

**눈(상세)** 아이콘 클릭:

```
→ 별도 LAYER 템플릿 slug 사용 (예: board1-detail)
→ readonly=true 필드로 구성된 팝업
→ 저장 버튼 없이 조회만 가능
```

---

#### 전체 관계도 요약

```
[빌더 저장]
page_template (id=1, slug=board1, type=LIST,  configJson=목록설정)
page_template (id=2, slug=board1, type=LAYER, configJson=팝업설정)
                    ↑                               ↑
              LIST 빌더가 저장               LAYER 빌더가 저장

[메뉴 연결]
menu (name=게시판1, url=/admin/generated/board1)
                              ↑
                      slug "board1" 로 연결

[데이터 저장]
page_data (id=100, template_slug=board1, data_json={...})
                              ↑
                      slug "board1" 로 저장

[파일 저장]
page_file (id=1, template_slug=board1, data_id=100, field_key=attach)
page_file (id=2, template_slug=board1, data_id=100, field_key=attach)
                              ↑
                  data_id로 page_data와 연결
```

---

#### 특징 요약

| 항목 | 내용 |
|---|---|
| 코드 배포 | ❌ 불필요 — DB만 바뀌면 즉시 반영 |
| 반영 속도 | 저장 즉시 |
| WAS 다중화 | ✅ 모든 서버가 같은 DB를 바라보므로 문제없음 |
| 커스터마이징 | 빌더 설정 범위 내 (코드 수정 불가) |
| 대상 | 운영자 / 기획자 |

---

### 개발자방식 — TSX 파일 생성

#### 목적

1. **커스터마이징** — 빌더로 구성한 화면을 코드 파일로 받아 개발자가 직접 비즈니스 로직을 추가·수정
2. **데이터 호환** — 생성된 파일도 slug 기반 `page_data` CRUD를 그대로 사용하므로 관리자방식과 데이터 구조 동일

---

#### STEP 1. Layer Builder에서 팝업 구성 → [생성]

`/admin/templates/builder/layer` 접속 후:

- 팝업 필드 구성 + 각 필드에 Key 입력 (예: type, title, content, attach)
- **[생성]** 버튼 클릭 → slug 입력 (예: `board1`)

생성되는 파일:

```
bo/src/app/admin/generated/board1/LayerPopup.tsx
```

> DB에는 저장하지 않습니다. 파일 자체가 팝업 컴포넌트입니다.

---

#### STEP 2. List Builder에서 화면 구성 → [생성]

`/admin/templates/builder/list` 접속 후:

- 검색 필드, 테이블 컬럼 구성
- actions 컬럼 → 팝업 slug에 STEP 1에서 생성한 slug 입력 (예: `board1`)
- **[생성]** 버튼 클릭 → slug 입력 (예: `board1`)

생성되는 파일:

```
bo/src/app/admin/generated/board1/page.tsx
```

생성된 `page.tsx`는 `LayerPopup.tsx`를 직접 import하여 사용합니다:

```tsx
import LayerPopup from './LayerPopup';
```

> DB에는 저장하지 않습니다. 두 파일이 함께 동작합니다.

---

#### STEP 3. 메뉴에 연결

메뉴 관리(`/admin/menus`)에서 URL 입력란에 직접 입력:

```
/admin/generated/board1
```

저장 클릭.

> 관리자방식의 [페이지 메이커 연동] 버튼은 DB 저장 방식 전용입니다.
> 개발자방식은 URL을 직접 입력합니다.

---

#### STEP 4. 접속

사이드바에서 메뉴 클릭 → `/admin/generated/board1` 접근

Next.js가 생성된 `board1/page.tsx`를 공통 렌더러(`[slug]/page.tsx`)보다 **우선 실행**합니다.

```
board1/page.tsx 실행
  → LayerPopup.tsx 직접 import (DB 조회 없음)
  → 데이터 CRUD: GET/POST/PUT/DELETE /api/v1/page-data/board1
```

---

#### 특징

| 항목 | 관리자방식 (DB 저장) | 개발자방식 (파일 생성) |
|---|---|---|
| 템플릿 DB 저장 | ✅ 필요 | ❌ 불필요 |
| 레이어 팝업 | LayerPopupRenderer (런타임 DB 조회) | LayerPopup.tsx 직접 import |
| 실제 데이터 CRUD | `/page-data/{slug}` | `/page-data/{slug}` (동일) |
| 커스터마이징 | 빌더 설정 범위 내 | 코드 수준 완전 자유 |
| 코드 배포 | ❌ 불필요 | ✅ 필요 (next build) |
| 대상 | 운영자 / 기획자 | 개발자 |

---

## 4. 메뉴 연결 방법 (관리자방식)

### 연결 순서

```
1. Builder > List에서 페이지 구성 완료
2. [저장/수정] 버튼 → 이름/slug 입력 → 저장
3. 관리자 > 메뉴 관리 접속
4. 연결할 메뉴 항목 클릭 (또는 새 메뉴 추가)
5. URL 필드 옆 [페이지 메이커 연동] 버튼 클릭
6. 저장된 LIST 템플릿 드롭다운에서 선택
7. URL에 /admin/generated/{slug} 자동 입력됨
8. [저장] 버튼 클릭
```

### 연결 후 실행 흐름

```
사용자가 사이드바 메뉴 클릭
  → /admin/generated/board1 접근
  → [slug]/page.tsx (공통 렌더러) 실행
  → GET /api/v1/page-templates/by-slug/board1?type=LIST
  → configJson 파싱 → 검색폼 + 테이블 렌더링
  → GET /api/v1/page-data/board1 → 실제 데이터 표시
```

### 브레드크럼 / 페이지 제목 표시

```
메뉴 트리 재귀 탐색 → 현재 URL과 일치하는 메뉴명 표시
메뉴명 없으면 → page_template.name으로 fallback
```

---

## 5. List ↔ Layer 연동 흐름

### 설정 단계

```
[Layer Builder]
  → 팝업 구성 (예: 게시판 등록/수정)
  → 각 필드에 Key 설정 (예: type, title, content, attach)
  → DB 저장 → slug: board1, templateType: LAYER

[List Builder]
  → actions 컬럼 추가
  → 수정 버튼 → 연결 팝업: board1 (LAYER 템플릿)
  → 상세 버튼 → 연결 팝업: board1-detail (별도 LAYER 템플릿)
  → file 컬럼 추가 → Key: attach (Layer의 파일 Key와 동일하게 입력)
  → DB 저장 → slug: board1, templateType: LIST
```

### 실행 단계

```
목록 페이지 (/admin/generated/board1)
  ├── [등록] 버튼 클릭
  │     → LayerPopupRenderer(slug="board1", editId=null)
  │     → GET /page-templates/by-slug/board1?type=LAYER
  │     → LAYER configJson → 빈 폼 렌더링
  │     → [저장] → POST /api/v1/page-data/board1
  │     → 파일 있으면 → POST /api/page-files/upload
  │                    → PATCH /api/page-files/link
  │
  ├── [수정] 버튼 클릭 (행의 연필 아이콘)
  │     → LayerPopupRenderer(slug="board1", editId=행ID, initialData=행데이터)
  │     → 기존 데이터 채워진 폼 렌더링
  │     → [저장] → PUT /api/v1/page-data/board1/{id}
  │
  ├── [상세] 버튼 클릭 (행의 눈 아이콘)
  │     → LayerPopupRenderer(slug="board1-detail", editId=행ID)
  │     → readonly 모드 렌더링 (저장 버튼 없음)
  │
  └── [삭제] 버튼 클릭 (행의 휴지통 아이콘)
        → confirm 확인
        → DELETE /api/v1/page-data/board1/{id}
        → 연관 page_file 자동 삭제
```

---

## 6. API 목록

### 페이지 템플릿 (page_template)

| 메서드 | URL | 설명 |
|---|---|---|
| GET | `/api/v1/page-templates` | 전체 템플릿 목록 (이름순) |
| GET | `/api/v1/page-templates/{id}` | ID로 단건 조회 |
| GET | `/api/v1/page-templates/by-slug/{slug}?type=LIST\|LAYER` | slug + 타입으로 단건 조회 |
| POST | `/api/v1/page-templates` | 신규 저장 (DB만 저장) |
| PUT | `/api/v1/page-templates/{id}` | 수정 (DB만 수정) |
| DELETE | `/api/v1/page-templates/{id}` | 삭제 (DB만 삭제) |

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

## 주요 파일 위치

| 파일 | 역할 |
|---|---|
| `bo/src/app/admin/templates/builder/list/page.tsx` | List Builder 페이지 |
| `bo/src/app/admin/templates/builder/layer/page.tsx` | Layer Builder 페이지 |
| `bo/src/app/admin/templates/make/_shared/` | 빌더 공통 모듈 (styles, types, utils, components) |
| `bo/src/app/admin/generated/[slug]/page.tsx` | DB configJson 기반 공통 렌더러 |
| `bo/src/components/layer/LayerPopupRenderer.tsx` | 레이어 팝업 공통 렌더러 |
| `bo/src/components/menus/MenuDetail.tsx` | 메뉴 관리 + 페이지 메이커 연동 |
| `bo-api/.../PageTemplateController.java` | 템플릿 CRUD API |
| `bo-api/.../PageTemplateService.java` | DB + 파일 이중 저장 로직 |
| `bo-api/.../PageDataController.java` | 데이터 CRUD + 엑셀 API |
| `bo-api/.../PageFileController.java` | 파일 업로드/다운로드 API |

---

## 7. 기능 상세 가이드

---

### Button 필드 — 다중선택

버튼 타입 검색 필드에서 여러 버튼을 동시에 선택할 수 있는 기능입니다.

#### 설정 방법

필드 추가 또는 편집 패널에서 버튼 타입을 선택하면 **다중선택** 토글이 표시됩니다.

| 설정 | 동작 |
|---|---|
| **다중선택 OFF** (기본) | 버튼 하나만 선택 가능. 다른 버튼 클릭 시 이전 선택 해제 |
| **다중선택 ON** | 여러 버튼 동시 선택 가능. 이미 선택된 버튼 재클릭 시 해제 |

#### 저장 형식

다중선택 ON 상태에서 여러 버튼을 선택하면 값이 **쉼표 구분 문자열**로 저장됩니다.

```
한국 + 미국 선택 → "KR,US"
```

#### 검색 연동

다중선택 값은 검색 API에 쉼표 구분 문자열 그대로 전송됩니다.
BE에서 ILIKE 방식으로 처리되므로 선택한 값 중 하나라도 포함된 데이터가 조회됩니다.

---

### DateRange 필드 — 날짜 범위 검색

시작일~종료일 범위로 데이터를 검색하는 기능입니다.

#### 사용 조건

> ⚠️ **반드시 Key(fieldKey)를 영문으로 설정해야 합니다.**
> Key가 비어 있으면 라벨명(한글)이 Key로 사용되어 검색이 동작하지 않습니다.

```
올바른 예: Key = date2
잘못된 예: Key 미입력 → 라벨 "날짜2 시작" 그대로 사용 → 검색 안 됨
```

#### 동작 방식

사용자가 시작일과 종료일을 입력하면 해당 범위 내 데이터만 조회됩니다.

| 입력 상태 | 검색 조건 |
|---|---|
| 시작일만 입력 | 시작일 이후 데이터 (`>=`) |
| 종료일만 입력 | 종료일 이전 데이터 (`<=`) |
| 둘 다 입력 | 시작일 ~ 종료일 사이 데이터 (`>=` AND `<=`) |
| 둘 다 미입력 | 날짜 조건 없음 (전체 조회) |

#### Layer 폼 Key와 일치 필요

검색 대상 날짜 데이터는 Layer 등록 폼에서 저장한 Key와 동일해야 합니다.

```
Layer 폼의 날짜 필드 Key: "date2"
List 검색 dateRange 필드 Key: "date2"  ← 반드시 동일하게 설정
```

---

### Text 셀 — 공통코드 복수값 표시

테이블의 text 타입 컬럼에 공통코드 연동을 설정하면, 저장된 코드값을 이름으로 변환하여 표시합니다.

#### 단일값 / 복수값 모두 지원

| 저장값 | 표시 결과 |
|---|---|
| `COMM001` (단일) | `한국` |
| `COMM001,COMM002,COMM003` (복수) | `한국,미국,중국` |

복수값은 **checkbox** 또는 **button(다중선택)** 검색 필드로 저장된 데이터에서 발생합니다.

#### 설정 방법

테이블 컬럼 편집 패널에서:
1. **공통코드 연동** 드롭다운에서 해당 코드 그룹 선택
2. **표시 방식** → `이름 표시` 선택 (기본값)

`코드값 표시`를 선택하면 변환 없이 코드값 그대로 표시됩니다.
