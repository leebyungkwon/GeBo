# 렌더러 구조 이슈 & 버그 목록

> 작성일: 2026-05-03
> 분석 대상: 빌더 미리보기 / 빌더 템플릿 / 운영 메뉴 페이지 렌더링 파이프라인 전체
> 관련 문서: `01.input_builder_leftpanel.md`

---

## 전체 렌더링 파이프라인 (기준)

```
[공통 상수] GridCell.tsx
  ROW_HEIGHT = 80px, GAP_SIZE = 8px

Layer 1. PageLayout
  └─ 12col CSS grid (gridAutoRows=72px, rowGap=8px)

Layer 2. PageGridRenderer
  └─ widgetItems[] → GridCell(outer) + inner sub-grid → WidgetRenderer
     inner sub-grid: gridAutoRows=72px, rowGap=8px
     content height: rowSpan × 80 − 8

Layer 3. WidgetRenderer
  └─ widget.type 분기 → 각 Renderer + 팝업 state 소유

Layer 4. 각 Renderer (SearchRenderer / FormRenderer / SpaceRenderer / TableRenderer / ...)
  └─ RendererContainer + FieldRenderer

Layer 5. RendererContainer
  └─ h-full w-full + 선택적 CSS grid (Form/Space 전용)

Layer 6. FieldRenderer
  └─ 단일 필드 (input / select / date / file 등)
```

---

## 이슈 목록

---

### [ISSUE-01] ⛔ Critical — RendererContainer gridAutoRows 오류

| 항목 | 내용 |
|---|---|
| **파일** | `make/_shared/components/renderer/RendererContainer.tsx` |
| **위치** | line 63~69 |
| **영향 위젯** | Form, Space (contentColSpan grid 사용하는 렌더러 전체) |
| **영향 범위** | 빌더 미리보기 + 운영 페이지 **모두** |

#### 증상

Form / Space 위젯 내부 필드의 **하단 8px가 항상 잘려서 보이지 않음** (`overflow:clip` 클리핑).

#### 원인

```
PageGridRenderer inner content height = rowSpan × 80 − 8

RendererContainer (h-full = 위 height)
  └─ internal CSS grid: gridAutoRows = 80px  ← 컨테이너보다 8px 큼
```

rowSpan=1 기준:

| | 값 |
|---|---|
| 컨테이너 높이 | 72px |
| 내부 grid 1행 | **80px** |
| 잘리는 영역 | **8px (하단 패딩/테두리)** |

rowSpan=N이어도 마지막 8px는 항상 잘림 (N×80 vs N×80−8).

#### 현재 코드

```typescript
// RendererContainer.tsx line 63~69
const gridStyle = contentColSpan ? {
    display: 'grid' as const,
    gridTemplateColumns: `repeat(${contentColSpan}, 1fr)`,
    gridAutoRows: `${ROW_HEIGHT}px`,          // ← 80px (잘못됨)
    rowGap: 0,
    columnGap: '8px',
} : {};
```

#### 수정 코드

```typescript
// 수정: GAP_SIZE import 추가 후 PageLayout/PageGridRenderer와 동일한 방식으로 통일
import { ROW_HEIGHT, GAP_SIZE } from '@/components/layout/GridCell';

const gridStyle = contentColSpan ? {
    display: 'grid' as const,
    gridTemplateColumns: `repeat(${contentColSpan}, 1fr)`,
    gridAutoRows: `${ROW_HEIGHT - GAP_SIZE}px`,  // 72px — PageGridRenderer inner와 동일
    rowGap: `${GAP_SIZE}px`,                      // 8px — 행 간 gap 추가
    columnGap: '8px',
} : {};
```

#### 수정 후 높이 검증

| rowSpan | 컨테이너 height | 수정 후 grid N행 합계 | 일치 |
|---|---|---|---|
| 1 | 72px | 1×72 = 72px | ✅ |
| 2 | 152px | 2×72 + 1×8 = 152px | ✅ |
| 3 | 232px | 3×72 + 2×8 = 232px | ✅ |
| N | N×80−8 | N×72 + (N−1)×8 = N×80−8 | ✅ |

#### 주의사항

수정 후 Form 필드 행 사이에 **8px 간격**이 생김 (현재 rowGap=0 → 8px 변경).  
시각적으로 필드 행 간 여백이 추가되므로 UI 확인 필요.

---

### [ISSUE-02] ⚠️ Structural — 팝업 진입점에서 PageLayout 우회

| 항목 | 내용 |
|---|---|
| **파일** | `make/_shared/components/renderer/WidgetRenderer.tsx` |
| **위치** | line 572~623 (`_popupBody`) |
| **영향 범위** | 팝업 내부 렌더링 (live 모드, 팝업 오픈 시) |

#### 증상

팝업 내부 렌더링이 `PageLayout` 없이 raw `div`로 그리드를 직접 구성.  
현재는 기능상 문제없으나, **PageLayout 그리드 설정 변경 시 팝업 코드도 수동으로 함께 변경해야** 하는 강결합.

#### 현재 코드

```tsx
// WidgetRenderer.tsx line 572~623
const _popupBody = popupCfg ? (
    <div className="px-4 pb-4">
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(12, 1fr)',
                gridAutoRows: `${ROW_HEIGHT - GAP_SIZE}px`,  // PageLayout 설정 중복 구현
                rowGap: `${GAP_SIZE}px`,
                columnGap: 0,
            }}
        >
            <PageGridRenderer mode="live" ... />
        </div>
    </div>
) : null;
```

#### 원인

팝업 내부에서 `PageLayout`을 사용하면 불필요한 요소가 포함되기 때문에 우회:
- `title` / `description` 텍스트 UI
- `g` 키 격자 토글 keyboard listener
- `border border-slate-200 rounded-lg bg-slate-50` 배경 스타일

그래서 PageLayout 대신 그리드 div만 직접 구성함.

#### 개선 방향

PageLayout에서 그리드 컨테이너 부분을 별도 컴포넌트로 분리:

```tsx
// 제안: PageGridContainer 컴포넌트 추출
// bo/src/components/layout/PageGridContainer.tsx
export function PageGridContainer({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gridAutoRows: `${ROW_HEIGHT - GAP_SIZE}px`,
            rowGap: `${GAP_SIZE}px`,
            columnGap: 0,
        }}>
            {children}
        </div>
    );
}

// PageLayout 내부에서 PageGridContainer 재사용
// WidgetRenderer 팝업에서도 PageGridContainer 재사용
```

#### 현재 영향

- `gridAutoRows`, `rowGap` 값은 PageLayout과 동일하게 맞춰져 있어 **렌더 결과는 정상**
- 단, 미래 유지보수 시 PageLayout 그리드 설정 변경을 팝업 코드에도 반영해야 하는 의존성 존재

---

### [ISSUE-03] ⚠️ Minor — builder-contents-layout의 PageGridRenderer 우회

| 항목 | 내용 |
|---|---|
| **파일** | `app/admin/templates/builder-contents-layout/page.tsx` |
| **위치** | line 280~292 |
| **영향 범위** | 빌더 템플릿 가이드 페이지 (샘플 미리보기) |

#### 현재 코드

```tsx
// builder-contents-layout/page.tsx
<PageLayout mode="preview">
    {TAB_CONFIG[activeTab].map((item, idx) => (
        <GridCell key={idx} colSpan={item.colSpan} rowSpan={item.rowSpan}>
            <WidgetRenderer
                mode="preview"
                widget={item.widget}
                contentColSpan={item.colSpan}
            />
        </GridCell>
    ))}
</PageLayout>
```

#### 빌더 미리보기 / 운영 페이지 패턴과의 차이

| | builder-contents-layout | 빌더 미리보기 / 운영 페이지 |
|---|---|---|
| 그리드 컨테이너 | `PageLayout` | `PageLayout` |
| 위젯 배치 | `GridCell` 직접 | `PageGridRenderer` → `GridCell` |
| inner sub-grid | 없음 | 있음 |
| Category dbSlug 상속 | 없음 | `PageGridRenderer` 내부 처리 |
| 핸들러 라우팅 | 없음 | widgetId 기반 라우팅 |

#### 현재 영향

가이드 페이지는 단순 샘플 미리보기 목적이므로 **현재는 문제없음**.  
inner sub-grid가 없어도 단일 컨텐츠 위젯은 동일하게 렌더링됨.

#### 주의 조건

이 페이지를 단순 가이드가 아닌 **실제 기능 테스트 또는 다중 컨텐츠 위젯 확인 용도로 확장**할 경우 `PageGridRenderer`로 통일 필요.

---

### [ISSUE-04] 🔵 Legacy — LIST 타입의 별도 렌더 경로

| 항목 | 내용 |
|---|---|
| **파일** | `app/admin/generated/[slug]/page.tsx` |
| **위치** | line 791~860 |
| **영향 범위** | templateType='LIST' 페이지 |

#### 두 렌더 경로 공존

```
QUICK_LIST / QUICK_DETAIL / PAGE
  → PageLayout > PageGridRenderer (widgetItems 구조) ✅ 신규

LIST
  → PageLayout > GridCell > WidgetRenderer 개별 호출 ⚠️ 구버전 유지
```

#### 현재 영향

LIST 타입은 구버전 `fieldRows / tableColumns` 구조를 사용하며, `widgetItems` 구조와 별도로 관리됨.  
두 경로가 공존하여 운영되고 있으며 기능상 문제는 없음.

#### 향후 고려사항

LIST 타입을 `widgetItems` 구조로 마이그레이션하면 단일 렌더 경로로 통일 가능.  
현재는 구버전 데이터 호환성 유지가 필요하므로 즉시 수정 대상 아님.

---

## 이슈 우선순위 요약

| 번호 | 이슈 | 심각도 | 수정 여부 | 파일 |
|---|---|---|---|---|
| ISSUE-01 | RendererContainer gridAutoRows 오류 | ⛔ Critical | **즉시 수정 필요** | `RendererContainer.tsx` |
| ISSUE-02 | 팝업 PageLayout 우회 | ⚠️ Structural | 리팩토링 권장 | `WidgetRenderer.tsx` |
| ISSUE-03 | builder-contents-layout PageGridRenderer 우회 | ⚠️ Minor | 확장 시 수정 | `builder-contents-layout/page.tsx` |
| ISSUE-04 | LIST 별도 렌더 경로 | 🔵 Legacy | 마이그레이션 시 수정 | `generated/[slug]/page.tsx` |

---

## 컴포넌트 독립성 평가

| 컴포넌트 | 파일 | 독립성 | 비고 |
|---|---|---|---|
| `PageLayout` | `components/layout/PageLayout.tsx` | ✅ 완전 독립 | 12col grid 컨테이너 |
| `PageGridRenderer` | `renderer/PageGridRenderer.tsx` | ✅ 독립 | 12col grid 안에서만 동작 |
| `WidgetRenderer` | `renderer/WidgetRenderer.tsx` | ✅ 독립 | 팝업 state 내부 소유 |
| `FormRenderer` | `renderer/FormRenderer.tsx` | ✅ 독립 | contentColSpan → RendererContainer |
| `SpaceRenderer` | `renderer/SpaceRenderer.tsx` | ✅ 독립 | contentColSpan → RendererContainer |
| `SearchRenderer` | `renderer/SearchRenderer.tsx` | ✅ 독립 | standard/simple 자체 처리 |
| `TableRenderer` | `renderer/TableRenderer.tsx` | ✅ 독립 | RendererContainer 자체 사용 |
| `CategoryRenderer` | `renderer/CategoryRenderer.tsx` | ✅ 독립 | — |
| `SubListRenderer` | `renderer/SubListRenderer.tsx` | ✅ 독립 | flex layout 자체 처리 |
| `RendererContainer` | `renderer/RendererContainer.tsx` | ⚠️ 버그 | **ISSUE-01 수정 필요** |
| `FieldRenderer` | `renderer/FieldRenderer.tsx` | ✅ 완전 독립 | 최하위, 의존성 없음 |

---

## 단일 호출 조립 확인 (3개 진입점)

```tsx
/* ── 빌더 미리보기 ── */
<PageLayout mode="preview">
    <PageGridRenderer mode="preview" widgetItems={previewItems} />
</PageLayout>

/* ── 운영 메뉴 페이지 ── */
<PageLayout mode="live" title={menuName}>
    <PageGridRenderer mode="live" widgetItems={widgetItems} {...handlers} />
</PageLayout>

/* ── 빌더 템플릿 가이드 (현재 방식) ── */
<PageLayout mode="preview">
    <GridCell colSpan={N} rowSpan={M}>
        <WidgetRenderer mode="preview" widget={widget} contentColSpan={N} />
    </GridCell>
</PageLayout>
```

mode 파라미터 하나로 **UI 구조는 동일**, 데이터·인터랙션만 분기.  
세 진입점 모두 `PageLayout → (GridCell) → WidgetRenderer` 공통 파이프라인 사용.
