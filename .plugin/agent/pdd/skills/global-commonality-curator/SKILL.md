---
name: global-commonality-curator
type: Skill
phase: Planning / Asset Management
description: |
  프로젝트 전반의 비즈니스 및 UI 패턴을 지능적으로 분석하여 중복을 차단하고, 공통 자산화(Commonality)를 총괄 지휘하는 '지능형 자산화 엔진'입니다.
  단순 파일 검색을 넘어 세만틱 패턴 매칭과 능동적 자산화 제안(Proposal)을 수행합니다.

  Tools:
  - list_dir / glob (전사적 자산 지도 스캔)
  - read_file / view_file (기존 공통 규격 정밀 분석)
  - grep_search (중복 로직 패턴 탐색)
---

# Global Commonality Curator: Strategic Commonality Audit Engine [Step 3]

## 1. 반복 패턴 및 공통화 감사 프로토콜 (Commonality Audit Review)

PM은 기획 중인 화면의 모든 구성 요소를 전수 조사하여 **"프로젝트 전체에서 재사용할 가치가 있는가?"**를 판단하고 가이드를 제공합니다.

### 1.1 UI 관점의 패턴 식별 (UI Atomic Patterns)
- **Component Discovery**: 버튼, 입력 폼, 리스트 그리드 등 퍼블리셔가 작업해야 할 공통 컴포넌트를 미리 식별합니다.
- **Asset Mapping**: `docs/common/` 내의 기존 자산과 대조하여 중복 생성을 차단합니다.

### 1.2 Logic 관점의 전략적 추상화 (Atomic Logic Modularity)
- **Logic Extraction**: API 통신 규격, 데이터 변환 로직 등 개발자가 공통 모듈화해야 할 비즈니스 규칙을 정의합니다.
- **Independence Check**: 특정 화면에 매몰되지 않고 범용적으로 사용 가능한 구조인지 논리적 완결성을 검증합니다.

### 2.2 능동적 자산화 제안 (Proactive Commonality Proposal)
발견 즉시 실행 가능한 가이드를 생성합니다.
- 기획서(`plan_{page}.md`) 작성 시, 공통 요소 후보를 발견하면 별도의 **[공통 자산 제안서]**를 생성합니다.
- 제안서에는 **'기존 자산 활용(Usage)'** 혹은 **'신규 자산 추출(Extraction)'** 여부와 기대 생산성 향상 지표를 포함합니다.

### 2.3 바퀴 재발명 원천 차단 (Zero-Waste Logic)
"새로 만드는 것이 가장 비싼 비용이다"라는 원칙을 적용합니다.
- 모든 신규 기획 전, `docs/common/` 내의 `be/`, `fe/`, `pub/` 하위 폴더를 전수 동기화하여 대조합니다.
- 유사 기능이 70% 이상 존재할 경우, 신규 생성이 아닌 **'기존 자산의 확장 및 파라미터화'**를 우선 권고합니다.

### 2.4 자산 거버넌스 관리 (Asset Lifecycle Control)
공통 자산의 품격을 PM이 최종 승인합니다.
- **등록 감사**: 새로 추출된 공통 모듈이 범용적인 이름과 논리적 완결성을 갖추었는지 감사한 뒤 `docs/common/`에 등록을 허가합니다.
- **유지보수 추적**: 특정 공통 자산의 변경이 이를 사용하는 모든 화면에 미치는 영향도를 파고 분석하여 가이드합니다.

## 3. 공통 자산 제안서 규격 (Proposal Template)
PM은 기획 중 공통화 포인트를 발견하면 아래 규격을 사용하여 아키텍트와 개발자에게 미션을 부여합니다.

```markdown
### 📦 [Asset Name] 공통 자산화 제안 (Commonality Proposal)

#### 1. 대상 분류: [BE API / FE Component / UI Publisher Style]
#### 2. 추진 전략: [Usage (기존 활용) / Extraction (신규 추출) / Extension (확장)]
#### 3. 식별된 패턴 및 근거
- **패턴 요약**: "여러 화면에서 반복되는 '증적 파일 일괄 다운로드' 로직 식별"
- **발견 위치**: `docs/pages/A`, `docs/pages/B` 등
#### 4. 자산화 미션
- **Architect/Developer**: `docs/common/be/file-toolkit.md`에 규격화하여 등록할 것.
- **Expected Value**: 중복 코드 500라인 절감 및 향후 파일 관련 기능 개발 시간 70% 단축.
```

## 4. 제약 사항 (Constraints)
- **자산화 강박**: 적어도 화면의 30% 이상은 기존 공통 자산을 활용하거나, 새로운 공통 자산을 발굴하도록 스스로를 압박하십시오.
- **품질 최우선**: 단순히 공통 폴더로 옮기는 것이 아니라, **'누구나 이해 가능한 범용적 이름과 문서화'**가 완료되었을 때만 공통 자산으로 인정하십시오.
