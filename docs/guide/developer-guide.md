# 개발자방식 가이드

> 마지막 업데이트: 2026-04-14

---

## 목차

1. [개발자방식이란?](#1-개발자방식이란)
2. [폴더 구조](#2-폴더-구조)
3. [STEP 1 — Layer 생성 (LayerPopup.tsx)](#3-step-1--layer-생성-layerpopuptsx)
4. [STEP 2 — List 생성 (page.tsx)](#4-step-2--list-생성-pagetsx)
5. [STEP 3 — 메뉴 연결](#5-step-3--메뉴-연결)
6. [공통(JSON) 방식 API](#6-공통json-방식-api)
7. [직접 파일 생성 방식](#7-직접-파일-생성-방식)
8. [커스터마이징 포인트](#8-커스터마이징-포인트)

---

## 1. 개발자방식이란?

빌더에서 구성한 화면을 **TSX 파일로 생성**한 뒤, 개발자가 직접 코드를 수정하여 비즈니스 로직을 추가하는 방식입니다.

```
┌──────────────────────────────────────────────────────────┐
│                     개발자방식 흐름                        │
│                                                           │
│  Layer Builder → [생성] → LayerPopup.tsx                 │
│  List  Builder → [생성] → page.tsx                       │
│                              ↓                            │
│               개발자가 코드 직접 수정                      │
│               (API 변경, 로직 추가 등)                    │
│                              ↓                            │
│          메뉴 관리 → URL 직접 입력 → 사이드바 표시          │
└──────────────────────────────────────────────────────────┘
```

**관리자방식과의 차이:**

| 항목 | 관리자방식 (DB 저장) | 개발자방식 (파일 생성) |
|---|---|---|
| 반영 방법 | DB 저장 즉시 반영 | 파일 생성 후 코드 수정 + 빌드 필요 |
| 커스터마이징 | 빌더 설정 범위 내 | 코드 수준 완전 자유 |
| 데이터 CRUD | 공통(JSON) page-data API 사용 | 동일 — page-data API 또는 별도 API |
| Layer 팝업 | LayerPopupRenderer (런타임 DB 조회) | LayerPopup.tsx 직접 import |
| 대상 | 운영자 / 기획자 | 개발자 |

---

## 2. 폴더 구조

생성된 파일은 모두 다음 경로에 위치합니다.

```
bo/src/app/admin/generated/
└── {slug}/                   ← slug 이름으로 폴더 자동 생성
    ├── page.tsx               ← List 목록 페이지 (List Builder [생성])
    └── LayerPopup.tsx         ← 레이어 팝업 컴포넌트 (Layer Builder [생성])
```

예시 (`board1` slug):

```
bo/src/app/admin/generated/
└── board1/
    ├── page.tsx               ← 게시판1 목록 페이지
    └── LayerPopup.tsx         ← 게시판1 등록/수정 팝업
```

> Next.js App Router 구조입니다. `board1/page.tsx`가 존재하면
> 공통 렌더러(`[slug]/page.tsx`)보다 **우선 실행**됩니다.

직접 파일을 생성하는 경우도 동일한 경로 규칙을 따릅니다. ([7. 직접 파일 생성 방식](#7-직접-파일-생성-방식) 참조)

---

## 3. STEP 1 — Layer 생성 (LayerPopup.tsx)

등록/수정 팝업 컴포넌트를 먼저 생성합니다.

### 빌더에서 생성

```
1. /admin/templates/make/layer 접속
2. 팝업 유형 선택 (center / right)
3. 폼 필드 구성 (Input, Select, Editor 등)
   - 각 필드에 Key 입력 (영문, 반드시)
   - 예: title, type, content
4. 하단 버튼 구성 (닫기 + 저장)
5. 우측 상단 [생성] 버튼 클릭
6. slug 입력 → board1
7. [생성] 클릭
```

생성 결과:

```
bo/src/app/admin/generated/board1/LayerPopup.tsx
```

### 생성된 LayerPopup.tsx 구조

```tsx
'use client';

interface LayerPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: Record<string, unknown>) => Promise<void>;
    // 수정 시 사용: 기존 데이터를 주입받아 폼에 채워줌
    editId?: number | null;
    initialData?: Record<string, unknown> | null;
}

export default function LayerPopup({ isOpen, onClose, onSave, editId, initialData }: LayerPopupProps) {

    // [1] 설정 영역 — 폼 입력값 state
    const [title, setTitle] = useState('');
    const [type, setType] = useState('');

    // [2] JS 로직 영역 — 저장, 닫기, 유효성 검사

    // [3] 화면 영역 — 팝업 HTML (헤더 + 본문 + 푸터)
}
```

**Props 설명:**

| Props | 타입 | 설명 |
|---|---|---|
| `isOpen` | `boolean` | 팝업 열림/닫힘 상태 |
| `onClose` | `() => void` | 팝업 닫기 콜백 |
| `onSave` | `(data) => Promise<void>` | 저장 버튼 클릭 시 호출. 부모(page.tsx)에서 API 호출 |
| `editId` | `number \| null` | 수정 대상 ID. null이면 등록 모드 |
| `initialData` | `Record<string, unknown> \| null` | 수정 시 폼에 채울 기존 데이터 |

---

## 4. STEP 2 — List 생성 (page.tsx)

목록 페이지를 생성합니다. 앞서 생성한 `LayerPopup.tsx`가 자동으로 연결됩니다.

### 빌더에서 생성

```
1. /admin/templates/make/list 접속
2. 검색 필드 구성 (Input, Select, DateRange 등)
3. 테이블 컬럼 구성 (text, badge, actions 등)
   - actions 컬럼 → 수정 팝업 slug: board1 입력
4. 버튼 구성 (등록 버튼 → 팝업 slug: board1)
5. 우측 상단 [생성] 버튼 클릭
6. slug 입력 → board1 (Layer와 동일한 slug)
7. [생성] 클릭
```

생성 결과:

```
bo/src/app/admin/generated/board1/page.tsx
```

### 생성된 page.tsx 구조

```tsx
'use client';

import LayerPopup from './LayerPopup';  // ← 동일 폴더의 LayerPopup 직접 import

const SLUG = 'board1';  // ← page-data API 식별자

export default function GeneratedPage() {

    // [1] 설정 영역 — 검색 조건 state, 데이터 state
    const [title, setTitle] = useState('');
    const [data, setData] = useState([]);
    const [layerOpen, setLayerOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Record<string, unknown> | null>(null);

    // [2] JS 로직 영역
    const fetchData = async (page: number) => {
        const res = await api.get(`/page-data/${SLUG}`, { params: { page, size: 10 } });
        // 응답: { content: [{ id, dataJson }], totalElements, totalPages }
        const rows = res.data.content.map(item => ({ _id: item.id, ...item.dataJson }));
        setData(rows);
    };

    // [3] 화면 영역
    return (
        <>
            {/* 검색폼 */}
            {/* 테이블 */}
            {/* 페이지네이션 */}

            {/* Layer 팝업 연결 */}
            <LayerPopup
                isOpen={layerOpen}
                onClose={() => setLayerOpen(false)}
                editId={editId}
                initialData={editData}
                onSave={async (data) => {
                    if (editId) {
                        await api.put(`/page-data/${SLUG}/${editId}`, { dataJson: data });
                    } else {
                        await api.post(`/page-data/${SLUG}`, { dataJson: data });
                    }
                    setLayerOpen(false);
                    fetchData(0);
                }}
            />
        </>
    );
}
```

### Layer 팝업 연결 흐름

```
[등록 버튼 클릭]
  setEditId(null)
  setEditData(null)
  setLayerOpen(true)
    → LayerPopup(isOpen=true, editId=null)
    → 빈 폼 표시
    → [저장] → onSave(data) → POST /page-data/board1

[수정 아이콘 클릭]
  setEditId(행._id)
  setEditData(행 데이터)
  setLayerOpen(true)
    → LayerPopup(isOpen=true, editId=행ID, initialData=행데이터)
    → 기존 값이 채워진 폼 표시
    → [저장] → onSave(data) → PUT /page-data/board1/{id}

[삭제 아이콘 클릭]
  confirm → DELETE /page-data/board1/{id}
  → fetchData(0) 재조회
```

---

## 5. STEP 3 — 메뉴 연결

개발자방식은 DB에 템플릿을 저장하지 않으므로 **[페이지 메이커 연동] 버튼을 사용할 수 없습니다.**
메뉴 URL 입력란에 직접 입력합니다.

```
1. /admin/menus 접속 (메뉴 관리)
2. 연결할 메뉴 항목 클릭 (또는 [+ 메뉴 추가])
3. URL 입력란에 직접 입력:
   /admin/generated/board1
4. [저장] 클릭
```

연결 후:
- 사이드바에 메뉴가 표시됩니다
- 클릭 시 `/admin/generated/board1` 접근
- Next.js가 `board1/page.tsx`를 공통 렌더러보다 **우선 실행**합니다

---

## 6. 공통(JSON) 방식 API

### API 개발 없이 바로 쓸 수 있는 이유

공통(JSON) 방식이 가능한 핵심은 **메뉴 관리 화면의 slug 입력**에 있습니다.

```
메뉴 관리 (/admin/menus)
  → 메뉴 항목에 slug 입력 (예: board1)
  → 저장
  → 끝. 별도 테이블 생성 / BE API 개발 불필요
```

메뉴에 slug를 입력하는 순간, 그 slug를 경로로 사용하는 `/api/v1/page-data/board1` API가 **즉시 동작**합니다.
데이터 등록 / 조회 / 수정 / 삭제 모두 해당 slug 아래 자동으로 저장됩니다.

> ⚠️ **slug는 [생성] 버튼의 폴더명과 별개입니다.**
> [생성] 시 입력하는 폴더명은 파일 경로를 결정하는 값입니다.
> slug는 **메뉴 관리에서 별도로 입력**하며, 이 값이 데이터 저장 기준이 됩니다.

```
메뉴 관리에서 slug = "board1" 입력
  ↓
/api/v1/page-data/board1  자동 동작
  ↓
page_data 테이블에 template_slug = "board1" 로 데이터 저장
```

**일반 방식과 비교:**

```
일반 방식
  DB 테이블 생성 (DDL)
  → BE Controller / Service / Repository 개발
  → FE에서 API 호출 코드 작성

공통(JSON) 방식
  메뉴 관리에서 slug 입력 한 번
  → 즉시 CRUD 가능 (이미 구축된 공통 API가 처리)
```

**data_json — 어떤 구조든 자유롭게 저장:**

`data_json`은 JSONB 타입이라 스키마 정의 없이 원하는 키/값 구조를 바로 저장할 수 있습니다.

```json
// 게시판 데이터
{ "title": "첫 글", "type": "notice", "content": "<p>내용</p>" }

// FAQ 데이터 (완전히 다른 구조도 같은 테이블에 저장 가능)
{ "question": "질문입니다", "answer": "답변입니다", "category": "사용법" }
```

---

### 데이터 저장 구조

```
page_data 테이블
┌─────┬───────────────┬──────────────────────────────────────────┐
│ id  │ template_slug │ data_json                                │
├─────┼───────────────┼──────────────────────────────────────────┤
│ 1   │ board1        │ {"title":"첫 글","type":"notice"}         │
│ 2   │ board1        │ {"title":"두 번째 글","type":"general"}   │
└─────┴───────────────┴──────────────────────────────────────────┘
```

`data_json`은 JSONB 타입으로, 어떤 구조든 자유롭게 저장할 수 있습니다.

### API 사용법

| 목적 | 메서드 | URL | 설명 |
|---|---|---|---|
| 목록 조회 | GET | `/api/v1/page-data/{slug}` | 검색 + 페이지네이션 |
| 단건 조회 | GET | `/api/v1/page-data/{slug}/{id}` | id로 단건 조회 |
| 등록 | POST | `/api/v1/page-data/{slug}` | `{ dataJson: {...} }` |
| 수정 | PUT | `/api/v1/page-data/{slug}/{id}` | `{ dataJson: {...} }` |
| 삭제 | DELETE | `/api/v1/page-data/{slug}/{id}` | 연관 파일 함께 삭제 |
| 엑셀 다운로드 | GET | `/api/v1/page-data/{slug}/export` | 전체 데이터 엑셀 |

### 목록 조회 응답 구조

```ts
// GET /api/v1/page-data/board1?page=0&size=10
{
  content: [
    { id: 1, dataJson: { title: "첫 글", type: "notice" } },
    { id: 2, dataJson: { title: "두 번째 글", type: "general" } }
  ],
  totalElements: 2,
  totalPages: 1
}
```

생성된 `page.tsx`에서는 `id`를 `_id`로 펼쳐 사용합니다:

```ts
const rows = res.data.content.map(item => ({ _id: item.id, ...item.dataJson }));
// rows[0] = { _id: 1, title: "첫 글", type: "notice" }
```

### 검색 파라미터

검색 조건은 쿼리 파라미터로 전달됩니다.

```ts
// q, status 등 fieldKey가 파라미터명이 됨
const params = { page: 0, size: 10 };
if (q.trim())      params['q']      = q;
if (status.trim()) params['status'] = status;

api.get(`/page-data/${SLUG}`, { params });
// → GET /api/v1/page-data/board1?page=0&size=10&q=공지&status=Y
```

**검색 조건별 동작:**

| 값 형식 | BE 처리 방식 | 예시 |
|---|---|---|
| 일반 문자열 | `ILIKE '%값%'` (부분 일치) | `q=공지` → 제목에 "공지" 포함 검색 |
| 쉼표 구분 문자열 | `ILIKE '%값%'` 동일 | `status=Y,N` → 문자열로 ILIKE 검색 |
| `시작~종료` 형식 | `>= 시작 AND <= 종료` | `date=2026-01-01~2026-12-31` → 범위 검색 |

> ⚠️ **fieldKey(파라미터 이름)는 반드시 영문이어야 합니다.**
> BE에서 `[a-zA-Z0-9_]+` 정규식으로 검증하며, 한글 키는 검색에서 제외됩니다.

---

## 7. 직접 파일 생성 방식

빌더를 거치지 않고 파일을 직접 만들어 개발하는 방식입니다.

### 1단계 — 폴더 및 파일 생성

```
bo/src/app/admin/generated/{slug}/
  ├── page.tsx
  └── LayerPopup.tsx   (팝업이 필요한 경우)
```

> 기존 slug의 생성 파일을 반드시 먼저 참조하여 구조와 패턴을 통일합니다.
> (`bo/src/app/admin/generated/makerTest1/` 등)

### 2단계 — page.tsx 기본 템플릿

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SearchForm, SearchRow, SearchField } from '@/components/search';
import api from '@/lib/api';
import LayerPopup from './LayerPopup';  // 팝업이 있는 경우

const SLUG = 'my-page';  // ← slug 변경

export default function GeneratedPage() {
    // [1] 설정 영역
    const [searchKeyword, setSearchKeyword] = useState('');
    const [data, setData] = useState<Record<string, unknown>[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [layerOpen, setLayerOpen] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Record<string, unknown> | null>(null);

    // [2] JS 로직 영역
    const fetchData = async (page: number) => {
        try {
            const params: Record<string, string | number> = { page, size: 10 };
            if (searchKeyword.trim()) params['keyword'] = searchKeyword;

            const res = await api.get(`/page-data/${SLUG}`, { params });
            const rows = (res.data.content as { id: number; dataJson: Record<string, unknown> }[])
                .map(item => ({ _id: item.id, ...item.dataJson }));
            setData(rows);
            setTotalElements(res.data.totalElements ?? 0);
            setTotalPages(res.data.totalPages ?? 0);
            setCurrentPage(page);
        } catch (err) {
            console.error('데이터 조회 실패:', err);
        }
    };

    const handleReset = () => { setSearchKeyword(''); };
    const handleSearch = () => fetchData(0);
    const handlePageChange = (page: number) => fetchData(page);

    // 등록 팝업 열기
    const handleRegister = () => {
        setEditId(null);
        setEditData(null);
        setLayerOpen(true);
    };

    // 수정 팝업 열기
    const handleEdit = (row: Record<string, unknown>) => {
        setEditId(row._id as number);
        setEditData(row);
        setLayerOpen(true);
    };

    // 삭제
    const handleDelete = async (id: number) => {
        if (!confirm('삭제하시겠습니까?')) return;
        await api.delete(`/page-data/${SLUG}/${id}`);
        fetchData(currentPage);
    };

    useEffect(() => { fetchData(0); }, []);

    // [3] 화면 영역
    return (
        <>
            <div className="space-y-5">
                {/* 검색폼 */}
                <SearchForm onSearch={handleSearch} onReset={handleReset}>
                    <SearchRow cols={4}>
                        <SearchField label="검색어">
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)}
                                placeholder="검색어를 입력하세요"
                                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                            />
                        </SearchField>
                    </SearchRow>
                </SearchForm>

                {/* 버튼 바 */}
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={handleRegister}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white hover:bg-slate-800 transition-all"
                    >
                        등록
                    </button>
                </div>

                {/* 테이블 */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">제목</th>
                                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 w-24">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.map(row => (
                                <tr key={row._id as number} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-4 py-3 text-slate-700">{String(row.title ?? '-')}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button onClick={() => handleEdit(row)} className="text-xs text-slate-500 hover:text-slate-900 mr-2">수정</button>
                                        <button onClick={() => handleDelete(row._id as number)} className="text-xs text-red-400 hover:text-red-600">삭제</button>
                                    </td>
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={2} className="px-4 py-10 text-center text-sm text-slate-400">데이터가 없습니다.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handlePageChange(i)}
                                className={`px-3 py-1.5 text-xs rounded-md transition-all ${currentPage === i ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Layer 팝업 */}
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

### 3단계 — LayerPopup.tsx 기본 템플릿

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface LayerPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (data: Record<string, unknown>) => Promise<void>;
    editId?: number | null;
    initialData?: Record<string, unknown> | null;
}

export default function LayerPopup({ isOpen, onClose, onSave, editId, initialData }: LayerPopupProps) {
    // [1] 설정 영역 — 각 필드 state
    const [title, setTitle] = useState('');

    // [2] JS 로직 영역
    const handleReset = () => { setTitle(''); };

    // 수정 모드: initialData로 폼 채우기
    useEffect(() => {
        if (isOpen && initialData) {
            setTitle(String(initialData.title ?? ''));
        } else if (isOpen) {
            handleReset();
        }
    }, [isOpen, initialData]);

    const handleClose = () => { handleReset(); onClose(); };

    const handleSave = async () => {
        const errors: string[] = [];
        if (!title.trim()) errors.push('[필수] 제목');

        if (errors.length > 0) {
            toast.error(errors.join('\n'));
            return;
        }

        await onSave?.({ title });
    };

    if (!isOpen) return null;

    // [3] 화면 영역
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
                {/* 헤더 */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-900">
                        {editId ? '수정' : '등록'}
                    </h2>
                    <button onClick={handleClose} className="p-1.5 rounded-md hover:bg-slate-100 transition-all">
                        <X className="w-4 h-4 text-slate-500" />
                    </button>
                </div>

                {/* 본문 */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div>
                        <label className="text-xs font-medium text-slate-700 mb-1.5 block">
                            제목 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                        />
                    </div>
                </div>

                {/* 푸터 */}
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
                    <button type="button" onClick={handleClose} className="px-4 py-2 border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-all">닫기</button>
                    <button type="button" onClick={handleSave} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-md shadow-sm transition-all">저장</button>
                </div>
            </div>
        </div>
    );
}
```

---

## 8. 커스터마이징 포인트

빌더로 생성된 파일 또는 직접 작성한 파일에서 자주 수정하는 부분입니다.

### API 경로 변경

공통(JSON) API 대신 별도 비즈니스 API를 사용하는 경우 `fetchData` 내 URL만 교체합니다.

```ts
// 공통(JSON) API (기본 생성)
const res = await api.get(`/page-data/${SLUG}`, { params });

// 별도 비즈니스 API로 교체
const res = await api.get('/api/v1/boards', { params });
```

### 검색 조건 추가

```ts
// 검색 state 추가
const [category, setCategory] = useState('');

// fetchData의 params에 추가
if (category.trim()) params['category'] = category;

// handleReset에 추가
const handleReset = () => {
    setSearchKeyword('');
    setCategory('');     // ← 추가
};
```

### 수정 시 초기값 채우기 (LayerPopup)

`useEffect`에서 `initialData`를 읽어 각 state에 주입합니다.

```ts
useEffect(() => {
    if (isOpen && initialData) {
        setTitle(String(initialData.title ?? ''));
        setCategory(String(initialData.category ?? ''));
        setContent(String(initialData.content ?? ''));
    } else if (isOpen) {
        handleReset();
    }
}, [isOpen, initialData]);
```

### 저장 후 추가 처리

```ts
// page.tsx의 onSave 콜백에서 처리
onSave={async (formData) => {
    if (editId) {
        await api.put(`/page-data/${SLUG}/${editId}`, { dataJson: formData });
    } else {
        await api.post(`/page-data/${SLUG}`, { dataJson: formData });
    }
    setLayerOpen(false);
    fetchData(currentPage);   // 목록 새로고침
    // toast.success('저장되었습니다.');  // 추가 가능
}}
```

### 테이블 컬럼 추가

```tsx
// thead에 컬럼 헤더 추가
<th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">카테고리</th>

// tbody 행에 셀 추가
<td className="px-4 py-3 text-slate-700">{String(row.category ?? '-')}</td>
```
