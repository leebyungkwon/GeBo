---
name: market-trend-scanner
type: Skill
phase: Pre-Plan / Discovery
description: |
  경쟁 서비스의 실제 사용자 불만(Pain-points)과 시장 트렌드를 분석하여 '혁신적 기획 제안'의 데이터 근거를 마련하는 스킬입니다.
  단순한 기능 리서치를 넘어, '사용자의 결핍'을 찾아내어 우리 제품의 차별화 포인트(Unique Selling Point)로 치환합니다.

  Tools:
  - search_web (사용자 리뷰, 커뮤니티 고충 검색)
  - read_url_content (심층 리테일/IT 트렌드 리포트 분석)
---

# Market Trend Scanner: Insight-Driven Innovation

## 1. 사용 시점 (Triggers)
- **요구사항 정의 단계 (Step 01. Phase 1)**: 사용자가 "이런 기능 필요해"라고 할 때, 유사 서비스의 사용자 반응을 확인하고 싶을 때.
- **혁신 제안 작성 시 (Step 01. Phase 2)**: `plan_{page}.md`의 "4. 혁신 및 개선 제안" 섹션을 채우기 위한 객체적 근거가 필요할 때.

## 2. 페인 포인트 사냥 프로세스 (Pain-point Hunting)

### Step 1: 입체적 쿼리 실행
에이전트는 단순히 제품명만 검색하지 않고, 아래와 같은 **'고충 중심'**의 쿼리를 수행합니다.
- `"[경쟁사 서비스] 불편한 점"`, `"[서비스 카테고리] 앱 리뷰 최악"`, `"[서비스 명] CS 사례"`
- `site:reddit.com "[Service Name] problem"`, `site:blind.co.kr "[서비스 명] 단점"`

### Step 2: 결핍의 기회화 (Conversion to Opportunity)
발견된 불만을 아래의 로직으로 치환합니다.
- **불만**: "복잡한 필터 때문에 원하는 데이터를 찾기 힘들어요."
- **우리 제품의 대응**: "AI 기반 자연어 검색 및 개인화된 스마트 필터 환경 제공 (혁신 제안 반영)"

### Step 3: ROI 기반 제안서 반영
수집된 데이터 중 비즈니스 임팩트가 가장 큰 1~2개를 선별하여 기획서에 반영합니다.

## 3. 기획서 반영 규격 (Standardized Output)
스킬 실행 결과는 반드시 `plan_{page}.md`의 개선 제안 섹션에 아래와 같은 형식을 포함해야 합니다.

```markdown
### [제안된 혁신 포인트]
- **시장 고충(Pain-point)**: (예: 경쟁사 A의 사용자들이 '결제 단계의 수동 입력을 가장 번거로워함'을 식별)
- **우리의 대안**: (예: 카드 스캔 OCR 도입 및 1-Tap 결제 프로세스 구축)
- **기대 지표**: 결제 이탈률 15% 감소 예상.
```

## 4. 제약 사항 (Constraints)
- **데이터 출처 명시**: 추측이 아닌 실제 검색 결과나 리뷰 내용을 기반으로 해야 합니다.
- **구현 가능성 고려**: 아무리 혁신적이라도 현재의 기술 스택(Standard Tech Stack) 범위를 크게 벗어나는 제안은 '대안'으로만 남겨두십시오.
