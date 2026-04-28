# Builder 시스템 완전 가이드 v0.3

> 마지막 업데이트: 2026-04-27
> 문서 버전: v0.3 — 기존 모든 가이드 문서를 통합·대체

---

## 목차

1. [이 시스템이 존재하는 이유 (Why)](#1-이-시스템이-존재하는-이유-why)
2. [컴포넌트 3계층 구조 (What)](#2-컴포넌트-3계층-구조-what)
3. [데이터 흐름 전체 그림](#3-데이터-흐름-전체-그림)
4. [빌더 → 저장 → 렌더링 상세](#4-빌더--저장--렌더링-상세)
5. [두 가지 운영 방식](#5-두-가지-운영-방식)
6. [컴포넌트 카탈로그](#6-컴포넌트-카탈로그)
7. [운영자 실전 가이드 (관리자방식)](#7-운영자-실전-가이드-관리자방식)
8. [개발자 실전 가이드 (개발자방식)](#8-개발자-실전-가이드-개발자방식)
9. [핵심 규칙 및 자주 하는 실수](#9-핵심-규칙-및-자주-하는-실수)
10. [API 레퍼런스](#10-api-레퍼런스)
11. [주요 파일 위치](#11-주요-파일-위치)

---

## 1. 이 시스템이 존재하는 이유 (Why)

### 1.1 근본 목적

이 Builder 시스템의 궁극적 목표는 **"한 번 만든 화면 구성 요소가 어디서든, 언제든, 누가 보더라도 완벽히 동일하게 동작하는 것"** 입니다.

관리자 화면에서 새로운 목록·폼·팝업이 필요할 때마다 개발자가 처음부터 코드를 짜는 방식은:
- 비슷한 코드가 파일마다 조금씩 다르게 복사됨
- 버그 수정이나 디자인 변경 시 모든 파일을 일일이 찾아 고쳐야 함
- 개발자 없이는 화면 변경이 불가능

**이 시스템이 해결하는 것:**

| 기존 방식의 문제 | 이 시스템의 해결 |
|---|---|
| 화면마다 코드 파편화 | 공통 컴포넌트 1개가 모든 화면 담당 |
| 버그 수정 → 모든 파일 수정 | 공통 컴포넌트 1개만 고치면 전체 반영 |
| 개발자가 없으면 화면 변경 불가 | 운영자가 빌더 UI에서 직접 설정·저장 |
| 빌더 미리보기 ≠ 실제 화면 | 동일한 렌더러를 빌더와 실제 화면에서 공유 → 완전 일치 |

### 1.2 설계 원칙 — 절대로 어기지 말 것

**원칙 1: 단일 공통 컴포넌트 파이프라인**
> 어떤 빌더 페이지(quick-list, quick-detail, widget)를 통해 만들든, 최종 렌더링은 반드시 동일한 공통 렌더러 컴포넌트를 통해야 한다.

**원칙 2: 인라인 코딩 금지**
> 특정 페이지 파일(page.tsx) 안에서 `style={{...}}` 또는 `className="..."` 을 추가하여 레이아웃·스타일 문제를 땜질하는 것은 절대 금지.
> 문제가 생겼다면 그것은 **공통 컴포넌트가 해당 상황을 아직 처리하지 못하는 설계 결함**이므로, 공통 컴포넌트를 개선해야 한다.

**원칙 3: 빌더 미리보기 = 실제 화면 (WYSIWYG)**
> 빌더에서 보이는 미리보기와 실제 운영 화면은 픽셀 단위로 동일해야 한다.
> 이를 위해 빌더의 미리보기와 실제 출력 페이지가 **동일한 렌더러 컴포넌트**를 공유한다.

---

## 2. 컴포넌트 3계층 구조 (What)

이 시스템의 화면은 **3개의 계층**으로 구성됩니다.

```
┌─────────────────────────────────────────────────────────────────┐
│                     레이아웃 컴포넌트 (Layout)                    │
│         화면 전체의 틀과 공간 배치를 담당                          │
│    PageLayout  /  [slug]/page.tsx  /  generated/{slug}/page.tsx  │
└────────────────────────────┬────────────────────────────────────┘
                             │ 내부에 컨텐츠 컴포넌트 조합
┌────────────────────────────▼────────────────────────────────────┐
│                    컨텐츠 컴포넌트 (Content)                      │
│    화면 안의 각 기능 블록을 담당 (검색폼, 테이블, 폼, 공간)          │
│                                                                   │
│   SearchRenderer   TableRenderer   FormRenderer   SpaceRenderer   │
│       ↑                ↑               ↑               ↑          │
│  SearchWidgetBuilder TableBuilder  FormBuilder   SpaceBuilder     │
│           (빌더: 설정 UI)         (렌더러: 실제 출력)              │
└────────────────────────────┬────────────────────────────────────┘
                             │ 내부에 필드 컴포넌트 삽입
┌────────────────────────────▼────────────────────────────────────┐
│                     필드 컴포넌트 (Field)                         │
│    컨텐츠 안의 개별 입력/표시 요소를 담당                           │
│                                                                   │
│        FieldRenderer            TableCellRenderer                │
│   (폼·검색의 모든 필드 타입)     (테이블의 모든 셀 타입)            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.1 레이아웃 컴포넌트 (Layout)

화면의 **껍데기**입니다. 헤더/사이드바/본문 영역의 구조를 잡고, 어떤 컨텐츠 컴포넌트를 어디에 배치할지 결정합니다.

| 컴포넌트 | 역할 |
|---|---|
| `PageLayout.tsx` | 전체 어드민 레이아웃 (사이드바 + 헤더 + 본문 영역) |
| `[slug]/page.tsx` | 관리자방식 출력 페이지 — DB에서 설정을 읽어 렌더링 |
| `generated/{slug}/page.tsx` | 개발자방식 출력 페이지 — 개발자가 직접 코드 작성 |

### 2.2 컨텐츠 컴포넌트 (Content)

레이아웃 안에 들어가는 **기능 블록**입니다. 각 컨텐츠 타입마다 **Builder(설정 UI) + Renderer(실제 출력)** 쌍으로 존재합니다.

| 컨텐츠 타입 | Builder (설정 UI) | Renderer (실제 출력) | 용도 |
|---|---|---|---|
| 검색폼 | `SearchWidgetBuilder` | `SearchRenderer` | 검색 조건 입력폼 |
| 테이블 | `TableBuilder` | `TableRenderer` | 데이터 목록 테이블 |
| 폼 | `FormBuilder` | `FormRenderer` | 데이터 입력/수정 폼 |
| 공간 | `SpaceBuilder` | `SpaceRenderer` | 버튼·링크 등 자유 배치 |
| 레이어 팝업 | (Layer Builder 페이지) | `LayerPopupRenderer` | 등록/수정/상세 팝업 |

> **중요:** Builder가 만드는 미리보기와 실제 화면의 Renderer는 동일한 컴포넌트입니다.
> 빌더 미리보기에서 보이는 것이 곧 실제 화면입니다.

**분기 허브 — WidgetRenderer**

모든 컨텐츠 Renderer는 `WidgetRenderer` 라는 단일 허브를 통해 분기됩니다.
`WidgetRenderer`는 위젯 타입(`widgetType`)을 보고 적절한 Renderer로 라우팅합니다.

```
WidgetRenderer
  widgetType === 'SEARCH'  → SearchRenderer
  widgetType === 'TABLE'   → TableRenderer
  widgetType === 'FORM'    → FormRenderer
  widgetType === 'SPACE'   → SpaceRenderer
```

### 2.3 필드 컴포넌트 (Field)

컨텐츠 안에 들어가는 **개별 입력/표시 요소**입니다.

**FieldRenderer** — 폼(FormRenderer)과 검색(SearchRenderer) 내부에서 사용

| 필드 타입 | 표시 형태 | 사용 예 |
|---|---|---|
| `input` | 한 줄 텍스트 입력 | 이름, 이메일, 검색어 |
| `select` | 드롭다운 선택 | 권한, 부서, 상태 |
| `date` | 날짜 선택 | 입사일, 등록일 |
| `dateRange` | 시작~종료 날짜 범위 | 계약기간, 조회기간 |
| `radio` | 단일 선택 버튼 | 고용형태 |
| `checkbox` | 복수 선택 체크박스 | 담당업무 |
| `button` | 버튼 형태 단일 선택 | 조회기간 (오늘/1주/1개월) |
| `textarea` | 여러 줄 텍스트 | 소개, 내용 |
| `file` | 파일 첨부 | 첨부파일 |
| `image` | 이미지 첨부 | 프로필 사진 |
| `video` | 동영상 (URL 또는 파일) | 동영상 콘텐츠 |
| `action-button` | 액션 버튼 | 검색, 초기화 |

**TableCellRenderer** — 테이블(TableRenderer) 내부의 각 셀에서 사용

| 셀 타입 | 표시 형태 | 옵션 |
|---|---|---|
| `text` | 일반 텍스트 | `isNumber`: 숫자 3자리 콤마, 공통코드 연동 |
| `badge` | 색상 배지 | `badgeShape`: round/square, `showIcon`: 도트 표시 |
| `boolean` | 참/거짓 텍스트 | `trueText`/`falseText` 커스텀 |
| `file` | 첨부파일 수 | 클릭 시 파일 뷰어 |
| `actions` | 액션 버튼 그룹 | edit/detail/delete 프리셋 + 커스텀 버튼 |

---

## 3. 데이터 흐름 전체 그림

```
┌──────────────────────────────────────────────────────────────────┐
│                        빌더 (Input)                               │
│                                                                   │
│    /admin/templates/make/                                         │
│      ├── quick-list    (검색폼 + 테이블 + 버튼 위젯)               │
│      ├── quick-detail  (폼 위젯)                                  │
│      └── widget        (공간 + 검색폼 + 테이블 + 폼 자유 조합)     │
│                                                                   │
│    빌더 안에서:                                                    │
│      Builder 컴포넌트로 설정 구성                                   │
│      → WidgetRenderer로 즉시 미리보기                              │
└────────────────────────────┬─────────────────────────────────────┘
                             │ [저장/수정] 클릭
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                          DB 저장                                  │
│                                                                   │
│    page_template 테이블                                           │
│      slug      : "board"                                          │
│      type      : LIST | LAYER | WIDGET | PAGE                    │
│      configJson: { 설정 전체를 JSON으로 저장 }                     │
└────────────────────────────┬─────────────────────────────────────┘
                             │ 메뉴에서 slug 연결
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     출력 페이지 (Output)                           │
│                                                                   │
│    /admin/generated/[slug]/page.tsx   ← 공통 렌더러               │
│      1. slug로 page_template 조회                                  │
│      2. configJson 파싱                                           │
│      3. WidgetRenderer → 각 컨텐츠 Renderer 호출                  │
│      4. Renderer → FieldRenderer / TableCellRenderer 호출         │
│      → 화면 완성                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### 3.1 DB 테이블 구조

```
page_template (화면 설정)
┌─────┬───────┬──────────┬────────────────────────────────────┐
│ id  │ slug  │ type     │ configJson                         │
│  1  │ board │ LIST     │ { 검색/테이블/버튼 위젯 설정 }      │
│  2  │ board │ LAYER    │ { 팝업 폼 필드/버튼 설정 }          │
└─────┴───┬───┴──────────┴────────────────────────────────────┘
          │ slug 기준으로 데이터 연결
page_data (실제 업무 데이터)
┌─────┬───────────────┬──────────────────────────────────────┐
│ id  │ template_slug │ data_json                            │
│ 100 │ board         │ { "title": "첫 글", "type": "공지" } │
│ 101 │ board         │ { "title": "두 번째 글", ... }        │
└─────┴───────┬───────┴──────────────────────────────────────┘
              │ data_id 기준으로 파일 연결
page_file (첨부파일)
┌─────┬─────────┬───────────┬─────────────────┐
│ id  │ data_id │ field_key │ orig_name        │
│  1  │ 100     │ attach    │ 보고서.pdf        │
│  2  │ 100     │ attach    │ 첨부파일.xlsx     │
└─────┴─────────┴───────────┴─────────────────┘
```

---

## 4. 빌더 → 저장 → 렌더링 상세

### 4.1 빌더 3종류

| 빌더 경로 | 목적 | 생성 가능한 위젯 |
|---|---|---|
| `/admin/templates/make/quick-list` | 검색폼 + 테이블 목록 화면 | Search + Table + Space(버튼) |
| `/admin/templates/make/quick-detail` | 상세/입력 폼 화면 | Form |
| `/admin/templates/make/widget` | 자유 조합 (페이지 전체 설계) | 모든 위젯 타입 자유 조합 |

### 4.2 빌더 내부 동작 원리

빌더 화면은 크게 **좌측 설정 패널**과 **우측 미리보기**로 나뉩니다.

```
빌더 페이지
 ├── 좌측: 설정 패널
 │    ├── ContentRowHeader  (행/위젯 헤더 — 추가/삭제/이동)
 │    ├── SizeSettingPanel  (크기 설정 — colSpan/rowSpan)
 │    ├── SpaceBuilder      (공간 컨텐츠 설정)
 │    ├── FormBuilder       (폼 컨텐츠 설정)
 │    ├── TableBuilder      (테이블 컨텐츠 설정)
 │    └── SearchWidgetBuilder (검색폼 컨텐츠 설정)
 │
 └── 우측: 미리보기 (WidgetRenderer 사용 — 실제 화면과 동일)
      └── WidgetRenderer → SearchRenderer / TableRenderer / FormRenderer / SpaceRenderer
```

설정 패널에서 값을 변경하면 → 미리보기가 즉시 업데이트됩니다.
미리보기에서 보이는 것이 **저장 후 실제 화면에서 보이는 것과 완전히 동일**합니다.

### 4.3 [저장/수정] 버튼 흐름

```
[저장/수정] 클릭
  → 저장 모달 (SaveModal)
      ├── Slug 선택 (기존 slug 선택 시 덮어쓰기)
      └── 템플릿 이름 입력 (slug 선택 시 자동 채움)
  → POST /api/v1/page-templates (신규) 또는 PUT /api/v1/page-templates/{id} (수정)
  → page_template 테이블에 configJson 저장
```

### 4.4 렌더링 흐름

```
/admin/generated/board (사용자가 메뉴 클릭)
  ↓
[slug]/page.tsx (공통 렌더러)
  ↓
GET /api/v1/page-templates/by-slug/board?type=LIST
  ↓
configJson 파싱 → widgetRows 배열 추출
  ↓
PageGridRenderer (행 × 위젯 격자 배치)
  ↓
WidgetRenderer (위젯 타입별 분기)
  ├── widgetType=SEARCH  → SearchRenderer → FieldRenderer (각 검색 필드)
  ├── widgetType=TABLE   → TableRenderer  → TableCellRenderer (각 셀)
  ├── widgetType=FORM    → FormRenderer   → FieldRenderer (각 폼 필드)
  └── widgetType=SPACE   → SpaceRenderer  → FieldRenderer (버튼 등)
```

---

## 5. 두 가지 운영 방식

### 5.1 관리자방식 (No-Code)

> 대상: 운영자, 기획자 — 코드 없이 화면을 만들고 즉시 반영

```
빌더에서 구성 → [저장/수정] → 메뉴 연결
  → 즉시 운영 화면에 반영 (코드 배포 불필요)
```

| 특징 | 내용 |
|---|---|
| 반영 속도 | 저장 즉시 |
| 커스터마이징 | 빌더 설정 범위 내 |
| 팝업 | `LayerPopupRenderer`가 런타임에 DB 조회 |
| 데이터 | 공통 `page-data` API |

### 5.2 개발자방식 (Code Generation)

> 대상: 개발자 — 빌더로 초안을 생성하고 코드를 직접 수정

```
빌더에서 구성 → [생성] → TSX 파일 생성
  → 개발자가 파일 열어 코드 수정
  → 빌드 후 반영
```

| 특징 | 내용 |
|---|---|
| 반영 속도 | 빌드 후 반영 |
| 커스터마이징 | 코드 수준 완전 자유 |
| 팝업 | `LayerPopup.tsx` 직접 import |
| 데이터 | 공통 `page-data` API 또는 별도 비즈니스 API |

생성 파일 위치:
```
bo/src/app/admin/generated/
  └── {slug}/
       ├── page.tsx         ← 목록 페이지 (List Builder [생성])
       └── LayerPopup.tsx   ← 레이어 팝업 (Layer Builder [생성])
```

> **Next.js 우선순위:** `generated/{slug}/page.tsx` 가 존재하면 공통 렌더러 `[slug]/page.tsx` 보다 우선 실행됩니다.

### 5.3 방식 선택 기준

```
빌더 설정 범위로 충분한가?
  YES → 관리자방식 (즉시 반영, 운영자 직접 관리 가능)
  NO  → 개발자방식 (복잡한 비즈니스 로직, 특수 UI 필요)
```

---

## 6. 컴포넌트 카탈로그

### 6.1 레이아웃 컴포넌트

```
bo/src/components/layout/PageLayout.tsx
  → 전체 어드민 레이아웃. 사이드바 + 헤더 + 본문 (children) 구조.
  → 모든 페이지가 이 레이아웃 안에서 렌더링됨.

bo/src/app/admin/generated/[slug]/page.tsx
  → 관리자방식의 단일 출력 페이지.
  → slug → page_template 조회 → WidgetRenderer 호출.

bo/src/app/admin/generated/{slug}/page.tsx
  → 개발자방식. 빌더 [생성] 버튼으로 파일 생성되거나 직접 작성.
```

### 6.2 컨텐츠 컴포넌트

**WidgetRenderer** — 모든 컨텐츠의 분기 허브
```
bo/src/app/admin/templates/make/_shared/components/renderer/WidgetRenderer.tsx

Props:
  mode          : 'preview' | 'live'
  widget        : 위젯 설정 (widgetType 포함)
  contentColSpan: 위젯이 차지하는 그리드 열 수
  codeGroups    : 공통코드 목록
  handlers      : 테이블 액션 핸들러
  ...
```

**SearchRenderer** — 검색폼 출력
```
bo/src/app/admin/templates/make/_shared/components/renderer/SearchRenderer.tsx

displayStyle:
  'standard' : CSS Grid 형태 (일반 검색폼)
  'simple'   : 인라인 Flex 형태 (간단한 검색바)
```

**TableRenderer** — 테이블 출력
```
bo/src/app/admin/templates/make/_shared/components/renderer/TableRenderer.tsx

displayMode:
  'pagination': 페이지네이션
  'scroll'    : 무한스크롤 (IntersectionObserver 기반)
```

**FormRenderer** — 폼 출력
```
bo/src/app/admin/templates/make/_shared/components/renderer/FormRenderer.tsx

Props:
  title      : 폼 섹션 타이틀 (1 row 68px 영역에 세로 중앙 정렬)
  description: 타이틀 아래 설명
  showBorder : 테두리 표시 여부
  bgColor    : 바탕색 CSS 값
```

**SpaceRenderer** — 공간(버튼·링크 등) 출력
```
bo/src/app/admin/templates/make/_shared/components/renderer/SpaceRenderer.tsx

공간 안의 아이템: action-button, image, video 등
정렬·그림자·테두리·바탕색 옵션 지원
```

**PageGridRenderer** — 행×위젯 격자 배치
```
bo/src/app/admin/templates/make/_shared/components/renderer/PageGridRenderer.tsx

CSS Grid 12칸 기준으로 widgetRows를 배치.
각 셀에 WidgetRenderer 삽입.
```

### 6.3 필드 컴포넌트

**FieldRenderer** — 폼·검색 필드 개별 렌더링
```
bo/src/app/admin/templates/make/_shared/components/renderer/FieldRenderer.tsx

mode:
  'preview': disabled 상태 (빌더 미리보기)
  'live'   : 인터랙티브 입력 (실제 페이지)

지원 타입:
  input / select / date / dateRange / radio / checkbox
  button / textarea / file / image / video / action-button
```

**TableCellRenderer** — 테이블 셀 개별 렌더링
```
bo/src/app/admin/templates/make/_shared/components/renderer/TableCellRenderer.tsx

mode:
  'preview': rowIndex 기반 샘플 데이터 순환 표시
  'live'   : 실제 row 데이터 + 액션 핸들러 연결

지원 타입:
  text / badge / boolean / file / actions
```

---

## 7. 운영자 실전 가이드 (관리자방식)

### 권장 제작 순서

> Layer 팝업을 **먼저** 만들고, List 목록을 **나중에** 만드세요.
> Layer 필드의 Key → List 컬럼의 Key 순서로 확정해야 불일치를 방지합니다.

```
STEP 1: Layer Builder (등록/수정 팝업)
  → 필드 Key 확정
  → [저장/수정] → slug 지정

STEP 2: Layer Builder (상세 팝업, 필요 시)
  → 동일 필드 + 모든 필드 읽기 전용
  → 다른 slug로 저장 (예: board-detail)

STEP 3: List Builder (목록 화면)
  → STEP 1에서 확정한 Key로 컬럼 구성
  → Actions 컬럼에 팝업 slug 연결
  → [저장/수정] → Layer와 동일한 slug

STEP 4: 메뉴 연결
  → /admin/menus → [페이지 메이커 연동] → 저장
```

### STEP 1 — Layer Builder

경로: `/admin/templates/make/quick-detail` 또는 `/admin/templates/make/widget`

**팝업 기본 설정:**

| 설정 | 선택지 |
|---|---|
| 팝업 유형 | 중앙 팝업 / 우측 드로어 |
| 너비 | Small / Medium / Large / X-Large |
| 제목 | 팝업 상단에 표시될 텍스트 |

**폼 필드 추가:**

```
[+ 행 추가] → 행 컬럼 수 선택 → [+ 필드 추가] → 타입 선택 → 설정 패널에서 항목 입력
```

| 항목 | 설명 | 예시 |
|---|---|---|
| 라벨 | 필드 위에 표시 | 제목, 작성자 |
| **Key** | **반드시 영문** 으로 입력 | title, author |
| ColSpan | 가로 몇 칸 차지 | 4 |
| 필수 여부 | 저장 전 빈 값 검증 | ON/OFF |

**저장:**
```
[저장/수정] → 저장 모달
  Slug 선택 (DB slug 관리에서 미리 등록한 slug 선택)
  → 템플릿 이름 자동 입력
  → [저장]
```

### STEP 2 — List Builder

경로: `/admin/templates/make/quick-list`

**검색 탭:**

| 검색 방식 | 사용 타입 |
|---|---|
| 텍스트 입력 | Input |
| 드롭다운 선택 | Select |
| 날짜 단건 | Date |
| 날짜 범위 | DateRange (Key 영문 필수) |
| 라디오 단일 선택 | Radio |
| 체크박스 복수 선택 | Checkbox |
| 버튼 선택 | Button |

**테이블 탭:**

| 표시 내용 | 사용 타입 |
|---|---|
| 일반 텍스트 / 숫자 | Text |
| 색상 배지 | Badge |
| 공개/비공개 | Boolean |
| 수정/상세/삭제 버튼 | Actions → 팝업 slug 연결 |
| 첨부파일 수 | File |

**Actions 컬럼 설정:**
```
수정 버튼: ON → 팝업 slug: board (STEP 1의 slug)
상세 버튼: ON → 팝업 slug: board-detail (STEP 2의 slug, 선택)
삭제 버튼: ON
```

**버튼 탭:**
```
[+ 버튼 추가]
  → 이름: 등록
  → 타입: primary
  → 액션: 레이어 팝업 열기
  → 팝업 slug: board (STEP 1의 slug)
```

### STEP 3 — 메뉴 연결

경로: `/admin/menus`

```
[페이지 메이커 연동] 클릭
  → 저장된 LIST 템플릿 목록에서 선택
  → URL 자동 입력: /admin/generated/board
  → [저장]
```

---

## 8. 개발자 실전 가이드 (개발자방식)

### 파일 생성 2가지 방법

**방법 A — 빌더에서 [생성] 버튼**
```
빌더 → [생성] 버튼 클릭 → slug 입력
  → bo/src/app/admin/generated/{slug}/page.tsx 자동 생성
  → bo/src/app/admin/generated/{slug}/LayerPopup.tsx 자동 생성
```

**방법 B — 직접 파일 생성**
```
bo/src/app/admin/generated/{slug}/page.tsx 직접 작성
(기존 generated 폴더의 파일을 반드시 먼저 참조하여 패턴 통일)
```

### page.tsx 기본 구조

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SearchForm, SearchRow, SearchField } from '@/components/search';
import { TableRenderer } from '@/app/admin/templates/make/_shared/components/renderer/TableRenderer';
import api from '@/lib/api';
import LayerPopup from './LayerPopup';
import type { TableColumnConfig } from '@/app/admin/templates/make/_shared/types';

const SLUG = 'board'; // ← page-data API 식별자

// 테이블 컬럼 정의 (TableCellRenderer 타입 기반)
const COLUMNS: TableColumnConfig[] = [
    { id: 'c-title', header: '제목', accessor: 'title', align: 'left', sortable: true, cellType: 'text' },
    { id: 'c-status', header: '상태', accessor: 'status', align: 'center', sortable: false, cellType: 'badge',
      badgeShape: 'round', showIcon: true,
      cellOptions: [
          { value: 'active', text: '활성', color: 'emerald' },
          { value: 'inactive', text: '비활성', color: 'red' },
      ],
    },
    { id: 'c-actions', header: '관리', accessor: '_id', align: 'center', sortable: false, cellType: 'actions',
      actions: ['edit', 'delete'],
    },
];

export default function GeneratedPage() {
    // [1] 설정 영역 — state 선언
    const [searchKeyword, setSearchKeyword] = useState('');
    const [data, setData]                   = useState<Record<string, unknown>[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages]       = useState(0);
    const [currentPage, setCurrentPage]     = useState(0);
    const [layerOpen, setLayerOpen]         = useState(false);
    const [editId, setEditId]               = useState<number | null>(null);
    const [editData, setEditData]           = useState<Record<string, unknown> | null>(null);

    // [2] JS 로직 영역
    const fetchData = async (page: number) => {
        const params: Record<string, string | number> = { page, size: 10 };
        if (searchKeyword.trim()) params['keyword'] = searchKeyword;

        const res = await api.get(`/page-data/${SLUG}`, { params });
        const rows = (res.data.content as { id: number; dataJson: Record<string, unknown> }[])
            .map(item => ({ _id: item.id, ...item.dataJson }));
        setData(rows);
        setTotalElements(res.data.totalElements ?? 0);
        setTotalPages(res.data.totalPages ?? 0);
        setCurrentPage(page);
    };

    const handleRegister = () => { setEditId(null); setEditData(null); setLayerOpen(true); };
    const handleEdit     = (row: Record<string, unknown>) => { setEditId(row._id as number); setEditData(row); setLayerOpen(true); };
    const handleDelete   = async (id: number) => {
        if (!confirm('삭제하시겠습니까?')) return;
        await api.delete(`/page-data/${SLUG}/${id}`);
        fetchData(currentPage);
    };

    useEffect(() => { fetchData(0); }, []);

    // [3] 화면 영역
    return (
        <>
            <SearchForm onSearch={() => fetchData(0)} onReset={() => { setSearchKeyword(''); fetchData(0); }}>
                <SearchRow cols={4}>
                    <SearchField label="검색어">
                        <input value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)}
                            placeholder="검색어 입력"
                            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all" />
                    </SearchField>
                </SearchRow>
            </SearchForm>

            <div className="flex justify-end mb-3">
                <button onClick={handleRegister}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-all">
                    등록
                </button>
            </div>

            {/* TableRenderer 공통 컴포넌트 사용 */}
            <TableRenderer
                mode="live"
                columns={COLUMNS}
                data={data}
                totalElements={totalElements}
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={fetchData}
                handlers={{ onEdit: handleEdit, onDelete: handleDelete }}
            />

            <LayerPopup
                isOpen={layerOpen}
                onClose={() => setLayerOpen(false)}
                editId={editId}
                initialData={editData}
                onSave={async (formData) => {
                    if (editId) {
                        await api.put(`/page-data/${SLUG}/${editId}`, { dataJson: formData });
                    } else {
                        await api.post(`/page-data/${SLUG}`, { dataJson: formData });
                    }
                    setLayerOpen(false);
                    fetchData(currentPage);
                }}
            />
        </>
    );
}
```

### LayerPopup.tsx 기본 구조

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { FieldRenderer } from '@/app/admin/templates/make/_shared/components/renderer/FieldRenderer';

interface LayerPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: Record<string, unknown>) => Promise<void>;
    editId?: number | null;
    initialData?: Record<string, unknown> | null;
}

export default function LayerPopup({ isOpen, onClose, onSave, editId, initialData }: LayerPopupProps) {
    // [1] 설정 영역 — 필드별 state
    const [title, setTitle] = useState('');

    // [2] JS 로직 영역
    const handleReset = () => { setTitle(''); };

    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(String(initialData.title ?? ''));
        } else if (isOpen) {
            handleReset();
        }
    }, [isOpen, initialData]);

    const handleSave = async () => {
        if (!title.trim()) { toast.error('[필수] 제목을 입력하세요'); return; }
        await onSave?.({ title });
    };

    if (!isOpen) return null;

    // [3] 화면 영역
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-900">{editId ? '수정' : '등록'}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-md hover:bg-slate-100 transition-all">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {/* FieldRenderer 공통 컴포넌트 사용 */}
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1.5 block">제목 <span className="text-red-500">*</span></label>
                        <FieldRenderer
                            mode="live"
                            field={{ id: 'title', type: 'input', label: '제목', colSpan: 12, required: true, placeholder: '제목을 입력하세요' }}
                            value={title}
                            onChange={setTitle}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200">
                    <button onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-100 transition-all">닫기</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-md hover:bg-slate-800 transition-all">저장</button>
                </div>
            </div>
        </div>
    );
}
```

### 개발자방식 메뉴 연결

개발자방식은 DB에 `page_template`을 저장하지 않으므로 [페이지 메이커 연동] 버튼을 사용할 수 없습니다.

```
/admin/menus → 메뉴 항목 클릭
  → URL 입력란에 직접 입력: /admin/generated/board
  → [저장]
```

### 공통(JSON) API — 별도 테이블 생성 없이 즉시 사용

메뉴에 slug를 등록하는 순간 `/api/v1/page-data/{slug}` API가 자동으로 활성화됩니다.
별도 테이블 생성, Controller/Service/Repository 개발이 필요 없습니다.

```
메뉴 관리에서 slug = "board" 등록
  → /api/v1/page-data/board 즉시 동작
  → page_data 테이블에 template_slug = "board" 로 저장
```

**API 목록:**

| 목적 | 메서드 | URL |
|---|---|---|
| 목록 조회 | GET | `/api/v1/page-data/{slug}?page=0&size=10&keyword=검색어` |
| 단건 조회 | GET | `/api/v1/page-data/{slug}/{id}` |
| 등록 | POST | `/api/v1/page-data/{slug}` → `{ dataJson: {...} }` |
| 수정 | PUT | `/api/v1/page-data/{slug}/{id}` → `{ dataJson: {...} }` |
| 삭제 | DELETE | `/api/v1/page-data/{slug}/{id}` (파일 함께 삭제) |
| 엑셀 다운로드 | GET | `/api/v1/page-data/{slug}/export` |

**검색 파라미터 처리 방식:**

| 값 형식 | BE 처리 |
|---|---|
| 일반 문자열 | `ILIKE '%값%'` 부분 일치 |
| `시작~종료` 형식 | `>= 시작 AND <= 종료` 범위 검색 |

> ⚠️ 파라미터 이름(fieldKey)은 **반드시 영문**이어야 합니다.

---

## 9. 핵심 규칙 및 자주 하는 실수

### 규칙 1 — Key는 반드시 영문

```
✅ title / regDate / user_name / attach1
❌ 제목 / 등록일 / 파일첨부
```

한글 Key를 사용하면:
- 데이터 저장은 되지만 목록에 표시되지 않음
- DateRange 검색이 동작하지 않음

### 규칙 2 — Layer Key = List Key (반드시 동일)

```
Layer 필드 Key: title
List 컬럼 Key:  title  ← 동일해야 함

Layer file Key: attach
List file Key:  attach ← 동일해야 함
```

불일치 시:
- 목록 컬럼이 비어 있음
- 파일 개수가 0으로 표시
- 수정 팝업에 기존 값이 채워지지 않음

### 규칙 3 — Layer 먼저, List 나중에 저장

```
❌ List 저장 → Layer 저장 (팝업 slug를 찾을 수 없어 팝업이 열리지 않음)
✅ Layer 저장 → List 저장
```

### 규칙 4 — Slug 형식

```
✅ board / notice-list / faq / user1
❌ 게시판 / board 1 (공백) / Board (대문자)
```

Layer와 List의 slug를 동일하게 맞춰야 팝업이 연결됩니다.

### 규칙 5 — 인라인 스타일 땜질 금지

특정 페이지에서만 레이아웃이 어긋난다면:
```
❌ 해당 page.tsx에 style={{ paddingTop: '4px' }} 추가
✅ 공통 Renderer 컴포넌트의 설계 결함으로 인식 → Renderer 수정
```

---

## 10. API 레퍼런스

### 페이지 템플릿 (page_template)

| 메서드 | URL | 설명 |
|---|---|---|
| GET | `/api/v1/page-templates` | 전체 목록 |
| GET | `/api/v1/page-templates/{id}` | ID로 단건 |
| GET | `/api/v1/page-templates/by-slug/{slug}?type=LIST\|LAYER` | slug + 타입으로 단건 |
| POST | `/api/v1/page-templates` | 신규 저장 |
| PUT | `/api/v1/page-templates/{id}` | 수정 |
| DELETE | `/api/v1/page-templates/{id}` | 삭제 |

### 페이지 데이터 (page_data)

| 메서드 | URL | 설명 |
|---|---|---|
| GET | `/api/v1/page-data/{slug}` | 목록 (검색 + 페이지네이션) |
| GET | `/api/v1/page-data/{slug}/{id}` | 단건 |
| POST | `/api/v1/page-data/{slug}` | 등록 |
| PUT | `/api/v1/page-data/{slug}/{id}` | 수정 |
| DELETE | `/api/v1/page-data/{slug}/{id}` | 삭제 (파일 함께) |
| GET | `/api/v1/page-data/{slug}/export` | 엑셀 다운로드 |

### 파일 (page_file)

| 메서드 | URL | 설명 |
|---|---|---|
| POST | `/api/page-files/upload` | 업로드 (임시 상태) |
| GET | `/api/page-files/{id}` | 다운로드 |
| GET | `/api/page-files/meta?ids=1,2,3` | 메타 일괄 조회 |
| PATCH | `/api/page-files/link` | page_data에 연결 |
| DELETE | `/api/page-files/{id}` | 삭제 |

---

## 11. 주요 파일 위치

### 빌더 페이지

| 경로 | 역할 |
|---|---|
| `bo/src/app/admin/templates/make/quick-list/page.tsx` | 검색폼+테이블 빌더 |
| `bo/src/app/admin/templates/make/quick-detail/page.tsx` | 폼 빌더 |
| `bo/src/app/admin/templates/make/widget/page.tsx` | 자유 조합 빌더 |

### 공통 컴포넌트 (make/_shared)

| 경로 | 역할 |
|---|---|
| `components/renderer/WidgetRenderer.tsx` | 컨텐츠 타입 분기 허브 |
| `components/renderer/PageGridRenderer.tsx` | 행×위젯 격자 배치 |
| `components/renderer/SearchRenderer.tsx` | 검색폼 렌더러 |
| `components/renderer/TableRenderer.tsx` | 테이블 렌더러 |
| `components/renderer/TableCellRenderer.tsx` | 테이블 셀 렌더러 |
| `components/renderer/FormRenderer.tsx` | 폼 렌더러 |
| `components/renderer/SpaceRenderer.tsx` | 공간 렌더러 |
| `components/renderer/FieldRenderer.tsx` | 필드(입력요소) 렌더러 |
| `components/builder/SearchWidgetBuilder.tsx` | 검색폼 빌더 설정 UI |
| `components/builder/TableBuilder.tsx` | 테이블 빌더 설정 UI |
| `components/builder/FormBuilder.tsx` | 폼 빌더 설정 UI |
| `components/builder/SpaceBuilder.tsx` | 공간 빌더 설정 UI |
| `components/builder/ContentRowHeader.tsx` | 행/위젯 헤더 (추가/삭제/이동) |
| `components/builder/SizeSettingPanel.tsx` | 크기 설정 패널 |
| `components/TemplateModals.tsx` | 저장/불러오기 모달 |
| `types.ts` | 전체 타입 정의 |

### 출력 페이지

| 경로 | 역할 |
|---|---|
| `bo/src/app/admin/generated/[slug]/page.tsx` | 관리자방식 공통 렌더러 |
| `bo/src/app/admin/generated/{slug}/page.tsx` | 개발자방식 생성 파일 |
| `bo/src/app/admin/generated/{slug}/LayerPopup.tsx` | 개발자방식 팝업 컴포넌트 |

### 레이아웃 참고 템플릿 (개발 가이드용)

| 경로 | 역할 |
|---|---|
| `bo/src/app/admin/templates/list-layout/page.tsx` | 목록형 레이아웃 패턴 참고 (TableCellRenderer 5종 표시) |
| `bo/src/app/admin/templates/form-layout/page.tsx` | 폼형 레이아웃 패턴 참고 (FieldRenderer 전 타입 표시) |
| `bo/src/app/admin/templates/search-layout/page.tsx` | 검색형 레이아웃 패턴 참고 |
