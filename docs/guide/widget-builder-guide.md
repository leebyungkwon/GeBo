# Widget Builder 가이드

> 빌더 경로: `/admin/templates/make/widget`
> 렌더러 경로: `/admin/templates/widget/{slug}`
> 마지막 업데이트: 2026-04-16

---

## 목차

1. [개요 및 목적](#1-개요-및-목적)
2. [핵심 개념 — 2계층 구조](#2-핵심-개념--2계층-구조)
3. [화면 구성](#3-화면-구성)
4. [위젯 셀 관리](#4-위젯-셀-관리)
5. [컨텐츠(위젯) 타입별 상세](#5-컨텐츠위젯-타입별-상세)
   - [Text — 텍스트 표시](#text--텍스트-표시)
   - [Search — 검색폼](#search--검색폼)
   - [Table — 데이터 테이블](#table--데이터-테이블)
   - [Form — 폼 입력](#form--폼-입력)
   - [Space — 공간영역 (텍스트/버튼)](#space--공간영역-텍스트버튼)
6. [Search ↔ Table 연결 방법](#6-search--table-연결-방법)
7. [Slug 연동 — DB Slug 등록 및 활용](#7-slug-연동--db-slug-등록-및-활용)
8. [API 연동 — API 등록 및 활용](#8-api-연동--api-등록-및-활용)
9. [저장 및 불러오기](#9-저장-및-불러오기)
10. [메뉴 연결 및 실제 화면 노출](#10-메뉴-연결-및-실제-화면-노출)
11. [렌더러 동작 방식](#11-렌더러-동작-방식)
12. [실전 시나리오 예시](#12-실전-시나리오-예시)
13. [현재 제약사항](#13-현재-제약사항)
14. [공통 영역 수정 금지 원칙 (개발자 전용)](#14-공통-영역-수정-금지-원칙-개발자-전용)

---

## 1. 개요 및 목적

Widget Builder는 **검색 · 테이블 · 폼 · 버튼 · 텍스트를 자유롭게 배치한 커스텀 페이지**를
코드 없이 구성하는 No-Code 도구입니다.

| 빌더 | 레이아웃 | 적합한 화면 |
|---|---|---|
| **List Builder** | 검색폼 + 테이블 고정 | 단순 목록 조회 |
| **Layer Builder** | 팝업 폼 고정 | 등록/수정/상세 팝업 |
| **Widget Builder** | 사용자가 직접 설계 | 대시보드, 복합 조회, 자유 레이아웃 |

Widget Builder로 만든 화면은 **DB에 저장**되어 렌더러(`/admin/templates/widget/{slug}`)가
실시간으로 렌더링합니다. **코드 배포 없이** 화면 구성이 가능합니다.

---

## 2. 핵심 개념 — 2계층 구조

Widget Builder는 **위젯 셀(PageWidgetItem)** 안에 **컨텐츠(PageContentItem)** 를 배치하는
2단계 중첩 구조를 사용합니다.

```
전체 페이지 (12칸 메인 그리드)
└── 위젯 셀 (PageWidgetItem)   ← 12칸 중 몇 칸, 몇 행을 차지할지 지정
      └── 컨텐츠 (PageContentItem) ← 위젯 셀 안에서 서브 그리드로 배치
            └── 실제 위젯        ← Text / Search / Table / Form / Space
```

### 위젯 셀 (PageWidgetItem)

전체 12칸 메인 그리드에서 자리를 차지하는 컨테이너입니다.

| 속성 | 설명 |
|---|---|
| **colSpan** | 가로로 차지할 칸 수 (1 ~ 12) |
| **rowSpan** | 세로 높이 배수 (1 = 기준 높이 80px) |
| **contents** | 이 셀 안에 배치된 컨텐츠 목록 |

### 컨텐츠 (PageContentItem)

위젯 셀 내부 서브 그리드에서 배치되는 실제 위젯 컨테이너입니다.

| 속성 | 설명 |
|---|---|
| **colSpan** | 서브 그리드에서 차지할 칸 수 (1 ~ 부모 위젯 셀의 colSpan) |
| **rowSpan** | 세로 높이 배수 (1 = 80px 단위) |
| **widget** | 실제 위젯 데이터 (Text / Search / Table / Form / Space) |

### 그림으로 이해하기

```
┌─────────────────────────────────────────────────────┐
│  메인 그리드 (12칸)                                   │
│                                                      │
│  ┌────────────────────────┐  ┌────────────────────┐  │
│  │ 위젯 셀 A (col=8)       │  │ 위젯 셀 B (col=4) │  │
│  │                        │  │                   │  │
│  │ ┌──────────┬─────────┐ │  │ ┌────────────────┐│  │
│  │ │컨텐츠1   │컨텐츠2  │ │  │ │컨텐츠3         ││  │
│  │ │(Search)  │(Space)  │ │  │ │(Text)          ││  │
│  │ │col=5     │col=3    │ │  │ └────────────────┘│  │
│  │ └──────────┴─────────┘ │  └────────────────────┘  │
│  └────────────────────────┘                          │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ 위젯 셀 C (col=12, row=3)                         ││
│  │                                                  ││
│  │  컨텐츠4 (Table) — col=12                        ││
│  └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## 3. 화면 구성

```
┌──────────────────────────────────────────────────────────────────────┐
│  위젯 만들기              [현재 템플릿명]             [💾 저장/수정]    │
├──────────────────────────────────────────────────────────────────────┤
│  [ 불러오기 ▼ ]                                                       │
├────────────────────────┬─────────────────────────────────────────────┤
│  좌측 설정 패널         │  우측 미리보기 (12칸 그리드)                  │
│                        │                                              │
│  ▼ 위젯 셀 #1 (12×1)  │  ┌──────────────────────────────────────┐   │
│    └ Search 5×2        │  │  위젯 셀 #1 (Search 렌더링)           │   │
│    └ Space 7×2         │  │  ┌──────────┐ ┌──────────────────┐  │   │
│                        │  │  │ Search   │ │ Space            │  │   │
│  ▼ 위젯 셀 #2 (12×3)  │  │  └──────────┘ └──────────────────┘  │   │
│    └ Table 12×3        │  └──────────────────────────────────────┘   │
│                        │                                              │
│  [+ 컨텐츠 추가]       │  ┌──────────────────────────────────────┐   │
│  [+ 위젯 추가]         │  │  위젯 셀 #2 (Table 렌더링)            │   │
│                        │  └──────────────────────────────────────┘   │
└────────────────────────┴─────────────────────────────────────────────┘
```

### 좌측 패널 구성 요소

| 구성 요소 | 설명 |
|---|---|
| **불러오기 드롭다운** | 저장된 PAGE 타입 템플릿 목록 → 선택 시 해당 설정 로드 |
| **위젯 셀 목록** | 아코디언 형태. 클릭하면 펼쳐져 설정 패널 표시 |
| **크기 설정** | 선택된 위젯 셀의 Col / Row 수치 변경 |
| **컨텐츠 목록** | 위젯 셀 내부의 컨텐츠 목록 (각 컨텐츠 타입 + 크기 표시) |
| **[+ 컨텐츠 추가]** | 현재 위젯 셀에 새 컨텐츠(위젯) 추가 |
| **[+ 위젯 추가]** | 새로운 위젯 셀 추가 |

---

## 4. 위젯 셀 관리

### 위젯 셀 추가

1. **[+ 위젯 추가]** 버튼 클릭
2. 팝업에서 **Col (가로 칸, 1~12)** 과 **Row (세로 높이, 1~N)** 입력
3. **[추가]** 클릭 → 빈 위젯 셀이 생성되고 바로 설정 패널이 열림

> ⚠️ **col 설정 기준**: 전체 12칸 기준입니다.
> - col=12 → 전체 너비
> - col=6 → 절반 너비
> - col=4 → 1/3 너비
>
> ⚠️ **row 설정 기준**: 1 단위 = 약 80px 높이입니다.
> 내용이 많은 테이블은 row를 크게 설정하세요 (예: row=5~10).

### 위젯 셀 순서 변경 (드래그 앤 드롭)

좌측 패널의 위젯 셀 목록에서 **`⠿` 핸들**을 잡고 드래그하면 순서를 변경할 수 있습니다.
미리보기에 실시간으로 반영됩니다.

### 위젯 셀 삭제

위젯 셀 헤더 우측의 **🗑️** 버튼 클릭 → 삭제됩니다.
삭제 시 해당 셀의 모든 컨텐츠도 함께 삭제됩니다.

### 위젯 셀 크기 변경

위젯 셀을 선택(클릭)하면 **Col** 과 **Row** 입력란이 나타납니다.
값을 변경하면 즉시 미리보기에 반영됩니다.

### 컨텐츠 추가

1. 대상 위젯 셀을 클릭하여 펼친다.
2. **[+ 컨텐츠 추가]** 버튼 클릭
3. **위젯 타입 선택** 팝업에서 원하는 타입 선택 (Search / Table / Form / Space)
4. 추가된 컨텐츠의 **Col × Row** 를 설정한다.
5. 해당 컨텐츠 설정 패널에서 세부 내용 구성

> **컨텐츠 Col 범위**: 컨텐츠의 colSpan은 부모 위젯 셀의 colSpan 범위 내에서 지정합니다.
> 예: 위젯 셀이 col=8이면, 내부 컨텐츠는 최대 col=8까지 설정 가능합니다.

---

## 5. 컨텐츠(위젯) 타입별 상세

---

### Text — 텍스트 표시

단순 텍스트를 표시하는 위젯입니다.

#### 설정 항목

| 항목 | 설명 |
|---|---|
| **내용** | 표시할 텍스트 내용. 줄바꿈 포함 가능 (`whitespace-pre-wrap`) |

#### 사용 예시

- 섹션 제목 또는 안내 문구 표시
- 공지사항 내용 표시
- 설명 텍스트 블록

---

### Search — 검색폼

검색폼을 구성하는 위젯입니다. **Table 위젯과 연결**하여 검색 기능을 구현합니다.

#### 설정 항목

| 항목 | 설명 |
|---|---|
| **Key** | 이 Search 위젯의 고유 식별자 (영문, 예: `boardSearch`). Table 연결 시 사용 |
| **연결 slug** | 검색 API 엔드포인트. 드롭다운에서 선택. Table과 동일한 slug 입력 권장 |
| **검색 행 구성** | SearchBuilder 컴포넌트로 Row(행) 단위로 검색 필드 구성 |

#### 검색 필드 타입 (SearchBuilder)

| 타입 | 설명 |
|---|---|
| **Input** | 텍스트 입력창 |
| **Select** | 드롭다운 선택. 옵션 직접 입력 또는 공통코드 연동 가능 |
| **Date** | 날짜 선택 (단일) |
| **DateRange** | 날짜 범위 선택 (시작~종료) |
| **Radio** | 라디오 버튼. 옵션 직접 입력 또는 공통코드 연동 가능 |
| **Checkbox** | 체크박스 그룹 |

#### 검색 행 추가 방법

1. **[+ 행 추가]** 클릭
2. 행의 컬럼 수(1~5칸) 선택
3. 행 안의 **[+ 필드 추가]** 버튼으로 필드 타입 선택

#### 각 필드 공통 설정

| 항목 | 설명 |
|---|---|
| **라벨** | 필드 위에 표시되는 이름 |
| **fieldKey** | API 파라미터 키. **반드시 영문** 입력 (예: `keyword`, `status`) |
| **Placeholder** | 입력창 안내 문구 |
| **ColSpan** | 행 내에서 차지할 칸 수 |
| **필수 여부** | 검색 전 빈 값 검증 |

---

### Table — 데이터 테이블

데이터를 테이블 형태로 표시하는 위젯입니다.

#### 설정 항목

| 항목 | 설명 |
|---|---|
| **Key** | 이 Table 위젯의 고유 식별자 (영문) |
| **페이지당 건수** | 한 페이지에 표시할 데이터 건수 (기본값: 10) |
| **표시 방식** | `pagination` (페이지 번호 방식) 또는 `scroll` (무한 스크롤) |
| **연결된 Search** | 데이터를 불러올 Search 위젯 선택 (체크박스) |
| **컬럼 목록** | 표시할 컬럼 구성 |

#### 컬럼 타입

| 타입 | 설명 | 추가 설정 |
|---|---|---|
| **Text** | 일반 텍스트 표시 | 공통코드 연동 시 코드값을 이름으로 변환 |
| **Badge** | 배지(뱃지) 형태로 색상 구분 표시 | 값별 색상 매핑 (`값:라벨:색상`) |
| **Boolean** | `true`/`false` 값을 텍스트로 표시 | True 텍스트, False 텍스트 설정 |
| **Actions** | 수정·상세·삭제 버튼 표시 | 표시할 버튼 체크박스 선택 |

#### 컬럼 추가 방법

1. **[컬럼 추가]** 버튼 클릭
2. 셀 타입 선택 (Text / Badge / Boolean / Actions)
3. **헤더명** (컬럼 표시 이름), **Key** (API 응답 필드명) 입력
4. 너비, 정렬, 정렬 활성화 여부 설정
5. 타입별 추가 옵션 설정 후 **[추가]** 클릭

> ⚠️ **Key 규칙**: Key는 BE API 응답의 `dataJson` 내 필드명과 **정확히 일치**해야 합니다.
> 예: API 응답이 `{ "title": "공지사항", "status": "active" }` 이면, Key는 `title`, `status`

#### Badge 컬럼 옵션 설정

Badge 타입 선택 시 값마다 라벨과 색상을 지정합니다.

| 설정 | 설명 |
|---|---|
| **텍스트** | 배지에 표시될 텍스트 (예: `활성`) |
| **Value** | API 응답 데이터값 (예: `active`) |
| **색상** | 배지 색상 (초록/파랑/노랑/빨강/보라/회색/분홍/하늘) |
| **모양** | 둥근(round) 또는 각진(square) |
| **아이콘 표시** | 배지 앞에 ● 아이콘 표시 여부 |

#### Text 컬럼 — 공통코드 연동

Text 타입 컬럼에서 공통코드 그룹을 선택하면 API 응답의 코드값을 코드 이름으로 자동 변환합니다.

- **이름 표시**: `active` → `활성`
- **코드값 표시**: 원본 코드값 그대로 표시

---

### Form — 폼 입력

폼 입력 영역을 구성하는 위젯입니다.
Search와 달리 **Row(행) 개념 없이 필드를 플랫하게 나열**하며,
각 필드마다 **col(가로 크기)** 과 **row(세로 크기)** 를 개별 지정합니다.

#### Form 내부 그리드

Form은 **5칸 기준 내부 그리드**를 사용합니다.
- 각 필드: `col=1~5` (최대 5칸), `row=1~N` (세로 높이)

```
Form 위젯 내부 (5칸 기준 그리드):
┌────────┬────────┬────────┬────────┬────────┐
│ 필드A  │ 필드B (col=2)    │ 필드C  │        │
│ col=1  │ ← 2칸 차지 →   │ col=1  │        │
│ row=1  │                 │ row=2  │        │
│        │                 │ ↕2행   │        │
└────────┴────────┴────────┴────────┴────────┘
```

#### Form 필드 타입

Search의 검색 필드와 동일한 타입을 지원합니다:

| 타입 | 설명 |
|---|---|
| **Input** | 텍스트 입력 |
| **Select** | 드롭다운 선택 |
| **Date** | 날짜 선택 |
| **DateRange** | 날짜 범위 |
| **Radio** | 라디오 버튼 |
| **Checkbox** | 체크박스 그룹 |
| **Button** | 버튼 (단일 선택 또는 다중 선택) |

#### 필드 추가 방법

1. **[+ 필드 추가]** 클릭 → 타입 선택
2. 라벨, fieldKey, placeholder 입력
3. **col** (가로 칸 수, 1~5), **row** (세로 높이, 1~N) 설정
4. 옵션이 필요한 타입(Select/Radio/Checkbox/Button)은 옵션 입력
   - 형식: `라벨:값` 줄바꿈 입력 (예: `공지:notice`)
   - 또는 공통코드 그룹 연동
5. Validation 설정 (필수 여부, 최소/최대 글자 수, 정규식 패턴 등)
6. **[추가]** 클릭

#### 필드 편집 및 순서 변경

- **편집**: 필드 옆 **✏️** 아이콘 클릭 → 기존 값이 수정 패널에 로드됨
- **순서 변경**: **⠿** 핸들 드래그

---

### Space — 공간영역 (텍스트/버튼)

**Text(텍스트)** 와 **Button(버튼)** 아이템을 자유롭게 배치하는 위젯입니다.
안내 문구 + 액션 버튼을 조합할 때 주로 사용합니다.

#### 아이템 추가

- **[Text 추가]**: 텍스트 입력 영역 추가
- **[Button 추가]**: 버튼 추가

#### Text 아이템 설정

| 항목 | 설명 |
|---|---|
| **내용** | 표시할 텍스트. 줄바꿈 포함 가능 |

#### Button 아이템 설정

| 항목 | 설명 |
|---|---|
| **라벨** | 버튼에 표시되는 텍스트 |
| **색상** | 버튼 색상 선택 |

##### 버튼 색상 옵션

| 색상값 | 표시 |
|---|---|
| `black` (기본) | 검정 배경 |
| `green` | 초록 배경 |
| `blue` | 파랑 배경 |
| `yellow` | 노랑 배경 (어두운 텍스트) |
| `red` | 빨강 배경 |
| `gray` | 회색 배경 |
| `pink` | 분홍 배경 |

#### Button 연결 (connType) 설정

버튼 클릭 시 동작을 지정합니다. **연결** 드롭다운에서 선택합니다.

| 연결 타입 | 설명 | 추가 입력 |
|---|---|---|
| **없음** | 클릭 시 아무 동작 없음 | — |
| **팝업 (관리자)** | Layer 빌더로 만든 팝업을 엶 | LAYER 템플릿 선택 (slug 기준) |
| **경로 (개발자)** | 로컬 컴포넌트 파일명 지정 | 컴포넌트명 직접 입력 (예: `MyPopup`) |
| **DB Slug** | Slug 레지스트리에 등록된 slug 연결 | slug 선택 |
| **API** | 등록된 API 직접 호출 | API 선택 |

> **팝업 (관리자)**: Layer Builder에서 저장된 LAYER 타입 템플릿 목록에서 선택합니다.
> 버튼 클릭 시 해당 팝업이 열립니다.

> **API**: API 관리에서 등록된 활성 API 목록에서 선택합니다.
> 선택된 API의 Method, URL 패턴, 이름이 드롭다운에 표시됩니다.

---

## 6. Search ↔ Table 연결 방법

Search 위젯과 Table 위젯을 연결하면 검색 조건이 테이블 데이터 조회에 반영됩니다.

### 설정 순서

**Step 1. Search 위젯에 연결 slug 설정**

Search 위젯의 **연결 slug**를 설정합니다.
이 slug는 데이터를 가져올 BE API 엔드포인트 슬러그입니다.

```
예시:
- 게시판 데이터가 /api/v1/page-data/board1 로 서비스될 경우
- Search 위젯의 연결 slug = "board1"
```

**Step 2. Table 위젯에 연결된 Search 체크박스 설정**

Table 위젯 설정 패널에서 **연결된 Search** 목록이 표시됩니다.
연결할 Search 위젯의 **Key**에 체크합니다.

**Step 3. 검색 동작 확인**

렌더러(`/admin/templates/widget/{slug}`)에서:
1. 검색폼에 조건 입력
2. **검색** 버튼 클릭
3. Table 위젯에 데이터 자동 업데이트

### 동작 원리

```
사용자 검색 실행
    ↓
Search 위젯의 fieldKey → 값 수집
    ↓
Table의 connectedSearchIds → 연결된 Search 위젯 찾기
    ↓
Search의 connectedSlug → API 엔드포인트 결정
    ↓
GET /api/v1/page-data/{connectedSlug}?{fieldKey1}={값1}&{fieldKey2}={값2}&page=0&size=10
    ↓
응답 데이터 → Table 위젯에 렌더링
```

### Search와 Table의 필드키 관계

Search 필드의 **fieldKey**가 API 파라미터 키가 됩니다.
Table 컬럼의 **accessor(Key)** 가 API 응답 데이터의 필드명이 됩니다.

```
검색 파라미터: ?keyword=공지&status=active
                 ↑ fieldKey       ↑ fieldKey

API 응답:
{
  "content": [
    { "id": 1, "dataJson": { "title": "공지사항", "status": "active" } }
  ]
}

Table 컬럼 Key:               title          status
```

### 초기화(Reset)

검색폼의 **초기화** 버튼 클릭 시:
- 모든 검색값이 비워짐
- 연결된 Table 위젯이 조건 없이 데이터를 다시 조회함

---

## 7. Slug 연동 — DB Slug 등록 및 활용

위젯 빌더에서 사용하는 **연결 slug**는 `slug_registry` 테이블에 사전 등록된 값만 사용할 수 있습니다.
빌더에서 드롭다운으로 표시되는 slug 목록이 바로 이 레지스트리에서 불러온 것입니다.

---

### 7-1. Slug 레지스트리란?

Slug 레지스트리는 위젯 빌더에서 사용할 **slug 값을 사전에 등록·관리**하는 마스터 테이블입니다.

| 속성 | 설명 |
|---|---|
| **slug** | URL·파라미터에 사용되는 영문 식별자 (등록 후 변경 불가) |
| **name** | slug의 용도를 알 수 있는 이름 (예: `게시판 1`) |
| **type** | slug 용도 분류 (`PAGE_DATA` / `PAGE_TEMPLATE` / `ETC`) |
| **description** | 상세 설명 (선택) |
| **active** | 활성 여부. **비활성 시 빌더 드롭다운에 표시되지 않음** |

#### type 분류 기준

| type | 설명 | 주요 사용처 |
|---|---|---|
| `PAGE_DATA` | 페이지 데이터 API 연동용 slug | Search 위젯 연결 slug, Table 데이터 fetch |
| `PAGE_TEMPLATE` | 페이지 템플릿 연결용 slug | 향후 확장 용도 |
| `ETC` | 기타 용도 slug | Space 버튼 DB Slug 연결 등 |

---

### 7-2. Slug 관리 페이지

> 경로: `/admin/settings/slug-registry`

#### slug 등록

1. **[+ 등록]** 버튼 클릭
2. 폼 입력:
   - **slug**: 영문 소문자·하이픈·언더스코어 권장 (예: `board-notice`, `user_list`)
   - **이름**: 식별 가능한 이름 (예: `공지사항 게시판`)
   - **type**: 용도에 맞는 분류 선택
   - **설명**: 선택 항목. 담당자·연동 API 등 메모 목적
   - **활성 여부**: 기본값 ON. OFF 시 빌더 드롭다운에서 숨김
3. **[저장]** 클릭

> ⚠️ **slug는 등록 후 변경 불가**입니다. 오타 없이 신중하게 입력하세요.
> 잘못 등록한 경우 삭제 후 재등록해야 합니다.

#### slug 수정

- **이름, type, 설명, 활성 여부**만 수정 가능
- **slug 값은 수정 불가** (시스템 전반에 참조되는 키이기 때문)

#### slug 삭제

- 삭제 시 해당 slug를 참조 중인 위젯 설정에 영향을 줄 수 있으니 주의
- 사용 중단이 목적이라면 삭제보다 **비활성(active=OFF)** 처리 권장

---

### 7-3. 위젯 빌더에서 slug 연동

등록된 활성 slug는 빌더의 여러 위젯 설정에서 드롭다운으로 표시됩니다.

#### (A) Search 위젯 — 연결 slug

Search 위젯의 **연결 slug** 드롭다운에서 선택합니다.

```
Search 위젯 연결 slug 설정
    ↓
렌더러에서 검색 실행
    ↓
GET /api/v1/page-data/{connectedSlug}?{searchParams}
    ↓
Table 위젯에 데이터 렌더링
```

> **연결 slug와 Table 위젯의 데이터 fetch**:
> Search 위젯에 `connectedSlug = board-notice` 설정 →
> 실제 API 호출: `GET /api/v1/page-data/board-notice?keyword=공지&page=0&size=10`

#### (B) Form 위젯 — 연결 slug

Form 위젯의 **연결 slug** 드롭다운에서 선택합니다.

> 현재는 설정값 저장 목적으로만 사용됩니다.
> 실제 폼 제출 API 연동은 향후 구현 예정입니다.

#### (C) Space 버튼 — DB Slug 연결 타입

Space 위젯의 버튼 **연결** 드롭다운에서 `DB Slug`를 선택하면 나타나는 slug 드롭다운입니다.

> 현재는 설정값 저장 목적으로만 사용됩니다.
> 클릭 액션(예: 해당 slug 페이지로 이동)은 향후 구현 예정입니다.

---

### 7-4. slug 연동 전체 흐름 정리

```
사전 준비 (1회)
  1. /admin/settings/slug-registry 에서 slug 등록
     예) slug: "board-notice", name: "공지사항", type: PAGE_DATA

위젯 빌더에서 사용
  2. Widget Builder 진입
  3. Search 위젯 설정 → 연결 slug 드롭다운에서 "board-notice" 선택
  4. Table 위젯 설정 → 연결된 Search 체크박스 선택
  5. 저장

실제 동작 (렌더러)
  6. /admin/templates/widget/{pageSlug} 접속
  7. Table 위젯 초기 데이터 → GET /api/v1/page-data/board-notice?page=0&size=10
  8. 사용자 검색 → 검색 파라미터 추가하여 동일 API 재호출
```

---

## 8. API 연동 — API 등록 및 활용

위젯 빌더의 Space 버튼에서 **API 직접 호출** 기능을 사용하려면,
호출할 API를 `api_info` 테이블에 사전 등록해야 합니다.

---

### 8-1. API 정보란?

API 정보는 시스템에서 사용하는 **BE API 엔드포인트를 등록·관리**하는 마스터 테이블입니다.

| 속성 | 설명 |
|---|---|
| **name** | API 식별 이름 (예: `공지사항 목록 조회`) |
| **method** | HTTP 메서드 (`GET` / `POST` / `PUT` / `PATCH` / `DELETE`) |
| **urlPattern** | URL 패턴 (예: `/api/v1/page-data/{slug}`) |
| **category** | 카테고리 분류 (공통코드 `API_CATEGORY` 그룹에서 관리) |
| **description** | 상세 설명 (선택) |
| **active** | 활성 여부. **비활성 시 빌더 드롭다운에 표시되지 않음** |

---

### 8-2. API 관리 페이지

> 경로: `/admin/system/api`

#### API 수동 등록

1. **[+ 등록]** 버튼 클릭
2. 폼 입력:
   - **이름**: 알아보기 쉬운 이름 (예: `게시글 삭제`)
   - **메서드**: GET / POST / PUT / PATCH / DELETE 중 선택
   - **URL 패턴**: 실제 API URL 입력 (예: `/api/v1/posts/{id}`)
   - **카테고리**: 선택 항목. 공통코드 `API_CATEGORY`에 등록된 분류
   - **설명**: 파라미터, 응답 형식 등 메모
   - **활성 여부**: 기본값 ON
3. **[저장]** 클릭

#### API 자동 동기화 (Sync) ⭐

BE에 이미 구현된 API를 자동으로 스캔하여 DB에 등록하는 기능입니다.

1. **[🔄 동기화]** 버튼 클릭
2. Spring MVC에 등록된 `/api/v1/` 경로의 모든 엔드포인트를 스캔
3. DB에 없는 항목만 자동 추가 (기존 항목 삭제·변경 없음)
4. 완료 후 추가된 건수와 건너뛴 건수 토스트 알림 표시

> 동기화 후 자동 등록된 API의 **이름은 URL 패턴으로 임시 설정**됩니다.
> 추가 후 이름·카테고리·설명을 직접 수정하여 의미 있는 정보로 채워주세요.

#### URL 패턴 입력 예시

| 패턴 | 설명 |
|---|---|
| `/api/v1/page-data/{slug}` | slug 파라미터를 받는 패턴 |
| `/api/v1/posts` | 목록 조회 (POST: 등록) |
| `/api/v1/posts/{id}` | 단건 조회/수정/삭제 |
| `/api/v1/files/download/{fileId}` | 파일 다운로드 |

---

### 8-3. 위젯 빌더에서 API 연동

등록된 활성 API는 Space 위젯의 버튼 **연결 타입 = API** 선택 시 드롭다운에 표시됩니다.

#### 빌더에서 API 버튼 설정 방법

1. Space 위젯에 Button 아이템 추가
2. **연결** 드롭다운에서 **`API`** 선택
3. 우측 드롭다운에서 호출할 API 선택
   - 드롭다운 표시 형식: `[메서드] API이름 (URL패턴)`
   - 예: `[POST] 게시글 삭제 (/api/v1/posts/{id})`
4. 저장

#### API 드롭다운에 표시 조건

- `active = true` 인 API만 표시됩니다.
- API 관리 페이지에서 비활성 처리한 항목은 목록에서 자동으로 제외됩니다.

---

### 8-4. API 연동 현재 구현 상태

| 기능 | 상태 |
|---|---|
| API 등록 및 목록 조회 | ✅ 완료 |
| 빌더에서 API 선택 및 `apiId` 저장 | ✅ 완료 |
| 렌더러에서 버튼 클릭 시 API 실제 호출 | 🔲 미구현 (향후 개발 예정) |
| API 호출 결과 처리 (성공/실패 피드백) | 🔲 미구현 (향후 개발 예정) |

> 현재는 빌더에서 API를 선택하고 저장하는 것까지만 동작합니다.
> 렌더러에서 버튼을 클릭해도 실제 API가 호출되지는 않습니다.
> 이 기능은 향후 렌더러 개선 시 구현될 예정입니다.

---

### 8-5. API 연동 전체 흐름 정리 (현재 + 목표)

```
현재 구현된 흐름 (빌더 설정까지)
  1. /admin/system/api 에서 API 등록
     예) name: "공지 삭제", method: DELETE, urlPattern: /api/v1/notice/{id}

  2. Widget Builder → Space 위젯 → Button 추가
  3. 연결 = API → "공지 삭제" 선택 → apiId 저장
  4. 템플릿 저장

향후 구현될 흐름 (렌더러 실행)
  5. /admin/templates/widget/{slug} 에서 버튼 클릭
  6. 저장된 apiId로 API 정보 조회
  7. DELETE /api/v1/notice/{id} 호출
  8. 성공 → 토스트 알림 + 화면 갱신 / 실패 → 오류 알림
```

---

## 9. 저장 및 불러오기

### 저장 (새 템플릿)

1. 우측 상단 **[저장/수정]** 버튼 클릭
2. 저장 모달에서:
   - **이름**: 템플릿 표시 이름 (예: `대시보드 메인`)
   - **Slug**: URL에 사용될 고유 식별자 (영문, 예: `dashboard-main`)
3. **[저장]** 클릭

저장 후 렌더러 URL: `/admin/templates/widget/dashboard-main`

### 수정 (기존 템플릿)

불러온 템플릿을 수정한 뒤 **[저장/수정]** 버튼을 누르면 기존 slug로 덮어씁니다.

### 불러오기

1. 좌측 상단 **[불러오기 ▼]** 버튼 클릭
2. 저장된 PAGE 타입 템플릿 목록 표시
3. 원하는 템플릿 선택 → 현재 편집 상태가 해당 템플릿으로 교체됨

> ⚠️ 불러오기 시 현재 미저장 작업은 덮어씌워집니다. 먼저 저장하고 불러오세요.

### 저장 데이터 구조

위젯 설정은 `PageTemplate.configJson` 필드에 아래 형식으로 저장됩니다.

```json
{
  "widgetItems": [
    {
      "id": "pg-xxx",
      "colSpan": 12,
      "rowSpan": 1,
      "contents": [
        {
          "id": "pg-yyy",
          "colSpan": 12,
          "rowSpan": 2,
          "widget": {
            "type": "search",
            "widgetId": "w-zzz",
            "contentKey": "mySearch",
            "connectedSlug": "board1",
            "rows": [ ... ]
          }
        }
      ]
    }
  ]
}
```

---

## 10. 메뉴 연결 및 실제 화면 노출

Widget Builder로 만든 화면을 실제 관리자 메뉴에 연결하는 방법입니다.

### 연결 경로

```
저장된 템플릿 slug: my-dashboard
렌더러 URL: /admin/templates/widget/my-dashboard
```

### 메뉴 관리에서 연결

1. **[메뉴 관리]** 페이지 이동
2. 원하는 메뉴 선택 또는 신규 메뉴 생성
3. **페이지 URL**에 `/admin/templates/widget/{slug}` 입력
4. 저장

이후 해당 메뉴 클릭 시 Widget 렌더러 페이지가 표시됩니다.

---

## 11. 렌더러 동작 방식

렌더러(`/admin/templates/widget/{slug}`)가 실행되는 흐름입니다.

### 초기 로딩

```
1. URL slug 추출 (/admin/templates/widget/{slug})
2. GET /api/v1/page-templates/by-slug/{slug}?type=PAGE 호출
   → configJson 파싱 → widgetItems 구성
3. 공통코드 로딩 (useCodeStore)
4. Table 위젯 초기 데이터 자동 fetch
   - Table.connectedSearchIds → 연결된 Search 찾기
   - Search.connectedSlug → GET /api/v1/page-data/{slug} 호출
```

> ⚠️ BE API 호출 시 `?type=PAGE` 파라미터가 **반드시 필요**합니다.
> 누락 시 LIST 타입으로 잘못 조회되어 데이터를 불러오지 못합니다.

### 검색 실행 흐름

```
1. 사용자가 Search 위젯의 검색 버튼 클릭
2. 해당 Search의 widgetId를 가진 모든 Table 위젯 탐색
3. 각 Table 위젯에 대해:
   a. 연결된 Search의 connectedSlug 확인
   b. 검색 필드값(fieldKey → value) 수집
   c. GET /api/v1/page-data/{connectedSlug}?{params}&page=0 호출
4. Table 위젯 데이터 업데이트 및 렌더링
```

### 정렬

Table 컬럼 헤더 클릭 시 정렬이 동작합니다.

- 1회 클릭: 오름차순 (`asc`)
- 2회 클릭: 내림차순 (`desc`)
- 정렬 파라미터: `sort={accessor},{direction}` (예: `sort=title,asc`)

### 페이지네이션

Table 하단의 페이지 번호를 클릭하면 해당 페이지 데이터를 가져옵니다.

---

## 12. 실전 시나리오 예시

### 시나리오 A — 대시보드형 (텍스트 + 검색 + 테이블)

```
목표: 상단에 제목, 중간에 검색폼, 하단에 데이터 테이블

구성:
  위젯 셀 #1 (col=12, row=1)
    └── 컨텐츠: Text (col=12, row=1) — "게시판 관리"

  위젯 셀 #2 (col=12, row=2)
    └── 컨텐츠: Search (col=12, row=2)
        - Key: "boardSearch"
        - 연결 slug: "board1"
        - 필드: 제목(keyword), 상태(status)

  위젯 셀 #3 (col=12, row=5)
    └── 컨텐츠: Table (col=12, row=5)
        - Key: "boardTable"
        - 연결된 Search: boardSearch 체크
        - 컬럼: 제목(title), 상태(status/Badge), 등록일(createdAt), 액션(Actions)
```

### 시나리오 B — 사이드 패널형 (검색/버튼 좌측 + 테이블 우측)

```
목표: 좌측에 검색폼 + 버튼, 우측에 테이블

구성:
  위젯 셀 #1 (col=12, row=6)
    └── 컨텐츠: Search (col=4, row=4) — 좌측 검색폼
        - Key: "sideSearch"
        - 연결 slug: "items"

    └── 컨텐츠: Space (col=4, row=2) — 좌측 하단 버튼 영역
        - Button: [등록] → 연결: 팝업(관리자) → item-register LAYER 선택
        - Button: [엑셀 다운] → 연결: API → 엑셀 다운로드 API 선택

    └── 컨텐츠: Table (col=8, row=6) — 우측 테이블
        - 연결된 Search: sideSearch 체크
```

### 시나리오 C — 안내 + 폼형 (공지 텍스트 + 입력 폼)

```
목표: 안내 텍스트와 입력 폼을 같은 화면에 배치

구성:
  위젯 셀 #1 (col=12, row=1)
    └── 컨텐츠: Space (col=12, row=1)
        - Text: "아래 정보를 입력하여 신청하세요."
        - Button: [제출] → 연결: API → 신청 저장 API 선택

  위젯 셀 #2 (col=12, row=4)
    └── 컨텐츠: Form (col=12, row=4)
        - 신청자 (Input, col=3)
        - 신청 유형 (Select, col=3)
        - 신청일 (Date, col=3)
        - 내용 (Input, col=5, row=2)
```

---

## 13. 현재 제약사항

### 1. CSS 자동 배치 한계

동일 위젯 셀 내에 **colSpan이 다른 여러 컨텐츠**가 있을 경우, CSS Grid의 자동 배치 알고리즘으로 인해 예상치 못한 위치에 배치될 수 있습니다.

**권장 회피 방법**:
- 하나의 위젯 셀에는 가능하면 **동일한 colSpan**의 컨텐츠만 배치하세요.
- 복잡한 레이아웃은 위젯 셀을 여러 개로 분리하여 구성하세요.

### 2. Form 위젯 미리보기 크기 불일치

Form 위젯의 필드 col/row 설정값이 빌더 미리보기에 정확히 반영되지 않습니다.
렌더러에서는 올바르게 동작하므로 저장 후 렌더러 URL에서 최종 확인하세요.

### 3. Space 버튼 클릭 미동작 (빌더 내)

빌더의 **미리보기** 영역에서는 버튼 클릭 시 동작하지 않습니다.
실제 연결 동작은 렌더러(`/admin/templates/widget/{slug}`)에서만 확인 가능합니다.

### 4. Space 버튼 팝업·API 동작은 렌더러에서 확인

Space 버튼의 연결 타입(팝업/API 등)은 설정만 저장되며,
실제 동작 구현은 렌더러에서 별도 처리됩니다.
현재는 버튼 렌더링 및 설정 저장까지만 동작하며, 클릭 액션은 향후 개발 예정입니다.

---

## 14. 공통 컴포넌트 원칙 (개발자 필독 ★★★)

---

> # ⛔ 절대 원칙 ⛔
>
> ## Input(빌더) 또는 Output(렌더러)에 무언가를 추가하거나 변경할 때
> ## **반드시 공통 컴포넌트에서 작업해야 합니다.**
>
> ### ❌ 절대 금지
> - 빌더 페이지(`widget/page.tsx`) 내부에 UI 로직을 인라인으로 새로 작성하는 것
> - 렌더러가 사용되는 어느 곳에서도 (`generated/[slug]/page.tsx`, `widget/[slug]/page.tsx` 등) 렌더링 로직을 직접 작성하는 것
> - 파일 내부에 `ContentRenderer` 같은 서브컴포넌트를 인라인 정의하여 위젯 타입 분기를 대신하는 것
> - 공통 컴포넌트를 복사해서 별도로 만드는 것 (중복 금지)
>
> ### ✅ 반드시 이렇게
> - **Input 추가/변경** → `_shared/components/builder/` 하위 공통 컴포넌트에서 작업
> - **Output 추가/변경** → `_shared/components/renderer/` 하위 공통 렌더러에서 작업
> - **렌더링이 필요한 모든 곳** (빌더 미리보기 / 생성파일 / 빌더연동 메뉴페이지) → `WidgetRenderer` 단 하나만 사용
> - 공통 컴포넌트가 없으면 → 새로 만들고 공통 폴더에 배치
>
> **이 원칙을 어기면 List Builder, Layer Builder 등 다른 빌더 전체에 영향을 미치거나,**
> **빌더 미리보기 ↔ 생성파일 ↔ 메뉴페이지 사이에 디자인/동작 불일치가 발생합니다.**

---

> ### ⚠️ Output(렌더러) 적용 대상 3곳 — 전부 동일 원칙
>
> | 구분 | 파일 경로 |
> |---|---|
> | **① 빌더 미리보기** | `make/widget/page.tsx` (미리보기 패널) |
> | **② 생성파일** | `app/admin/generated/[slug]/page.tsx` |
> | **③ 빌더연동 메뉴페이지** | `app/admin/templates/widget/[slug]/page.tsx` |
>
> 세 곳 모두 `WidgetRenderer` 를 경유해야 합니다.
> 위젯 타입 분기(`if type === 'search'`, `if type === 'table'` 등)를 페이지 파일에서 직접 처리하는 것은 금지입니다.
> → 상세: [output-component-guide.md 2섹션](./output-component-guide.md)

---

### Input / Output 가이드 문서 (반드시 정독)

| 구분 | 문서 | 설명 |
|---|---|---|
| **Input** (빌더 설정 영역) | [input-component-guide.md](./input-component-guide.md) | 컨텐츠 컴포넌트(SearchBuilder/FormBuilder/TableBuilder/SpaceBuilder)와 필드 컴포넌트(InputField/SelectField 등) 구조·역할·재활용 현황 |
| **Output** (렌더러 영역) | [output-component-guide.md](./output-component-guide.md) | 렌더러 계층 구조(WidgetRenderer/SearchRenderer/TableRenderer/FormRenderer/SpaceRenderer/FieldRenderer/TableCellRenderer) 구조·역할·설계 원칙 |

---

### 공통 컴포넌트 목록

#### Input 공통 컴포넌트 (`_shared/components/`)

| 파일 | 역할 | 사용처 |
|---|---|---|
| `SearchBuilder.tsx` | 검색폼 행/필드 구성 빌더 | List Builder, Widget Builder |
| `builder/FormBuilder.tsx` | 폼 위젯 필드 구성 빌더 | Widget Builder, Layer Builder |
| `builder/TableBuilder.tsx` | 테이블 컬럼 구성 빌더 | Widget Builder, List Builder |
| `builder/SpaceBuilder.tsx` | 공간영역 Text/Button 구성 빌더 | Widget Builder |
| `builder/fields/InputField.tsx` | 텍스트 입력 필드 설정 | SearchBuilder, FormBuilder |
| `builder/fields/SelectField.tsx` | 드롭다운 필드 설정 | SearchBuilder, FormBuilder |
| `builder/fields/DateField.tsx` | 날짜 필드 설정 | SearchBuilder, FormBuilder |
| `builder/fields/DateRangeField.tsx` | 날짜 범위 필드 설정 | SearchBuilder, FormBuilder |
| `builder/fields/RadioField.tsx` | 라디오 필드 설정 | SearchBuilder, FormBuilder |
| `builder/fields/CheckboxField.tsx` | 체크박스 필드 설정 | SearchBuilder, FormBuilder |
| `builder/fields/ButtonField.tsx` | 버튼 선택 필드 설정 | SearchBuilder, FormBuilder |
| `FieldPickerTypeList.tsx` | 필드 타입 선택 목록 UI | SearchBuilder, FormBuilder |
| `OptionInputRows.tsx` | 옵션 줄바꿈 입력 textarea | 필드 컴포넌트 내부 |
| `CodeGroupSelector.tsx` | 공통코드 그룹 선택 UI | 모든 빌더 |
| `ValidationSection.tsx` | 유효성 검사 설정 UI | 필드 컴포넌트 내부 |
| `TemplateModals.tsx` | 저장/확인 모달 | 모든 빌더 |
| `_shared/styles.ts` | 공통 CSS 클래스 (`inputCls`, `selectCls`) | 모든 빌더 |
| `_shared/types.ts` | 공통 타입 정의 | 모든 빌더 |

#### Output 공통 컴포넌트 (`_shared/components/renderer/`)

| 파일 | 역할 | 사용처 |
|---|---|---|
| `WidgetRenderer.tsx` | 위젯 타입별 최상위 Dispatcher | 빌더 미리보기, 실제 서비스 페이지 |
| `SearchRenderer.tsx` | 검색폼 전체 렌더러 | WidgetRenderer |
| `FieldRenderer.tsx` | 단일 필드 렌더러 (Search+Form 공통) | SearchRenderer, FormRenderer |
| `TableRenderer.tsx` | 테이블 전체 렌더러 | WidgetRenderer |
| `TableCellRenderer.tsx` | 단일 셀 렌더러 | TableRenderer |
| `FormRenderer.tsx` | 폼 위젯 렌더러 (CSS Grid) | WidgetRenderer |
| `SpaceRenderer.tsx` | 공간영역 렌더러 | WidgetRenderer |

---

### 올바른 작업 방법

```
Input(빌더)에 새 필드 타입 추가 시
  ① builder/fields/ 에 NewField.tsx 생성
  ② builder/fields/index.ts 에 export 추가
  ③ SearchBuilder / FormBuilder 에 case 추가
  ④ (렌더러) FieldRenderer 에 case 추가
  → 상세 절차: input-component-guide.md 7섹션 참조

Output(렌더러)에 새 위젯 타입 추가 시
  ① renderer/ 에 NewRenderer.tsx 생성
  ② renderer/index.ts 에 export 추가
  ③ WidgetRenderer 에 분기 추가
  ④ (빌더) builder/ 에 NewBuilder.tsx 생성
  → 상세 절차: output-component-guide.md 13섹션 참조
```

---

### 주요 파일 위치

| 파일 | 경로 |
|---|---|
| **빌더 페이지** | `bo/src/app/admin/templates/make/widget/page.tsx` |
| **렌더러 페이지** | `bo/src/app/admin/templates/widget/[slug]/page.tsx` |
| **Input 공통 컴포넌트** | `bo/src/app/admin/templates/make/_shared/components/builder/` |
| **Output 공통 컴포넌트** | `bo/src/app/admin/templates/make/_shared/components/renderer/` |
| **BE 컨트롤러** | `bo-api/src/main/java/com/ge/bo/controller/PageTemplateController.java` |
| **BE 데이터 서비스** | `bo-api/src/main/java/com/ge/bo/service/PageDataService.java` |
