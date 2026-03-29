---
name: visual-artifact-auditor
type: Skill
phase: Plan
description: |
  기존 이미지 시안 및 퍼블리싱된 HTML 유산(Artifact)을 분석하여 비즈니스 로직과 시스템 구조를 역공학으로 추출하는 하이퍼-로직 복원 스킬.
  시각적 인지 물리와 구조적 엔트로피 분석을 통해 레거시를 현대적 기획 명세로 변환합니다.

  Tools:
  - Artifact Reverse Engineering Report: `assets/plan_templates/artifact_reverse_engineering_report.md`
---

# Visual & Structural Artifact Auditor (VAA): Reverse-Engineering

## 1. 시각적 인지 물리 분석 (Visual Perception Engineering)

VAA는 이미지를 단순한 그림이 아닌 **'데이터 간의 관계가 투영된 물리 체계'**로 분석합니다.

### 1.1 Gestalt-Based Decision Reconstruction
- **Proximity & Closure Logic**: 이미지 내 요소들의 근접성($Proximity$)과 폐쇄성($Closure$)을 수학적으로 계산하여, 시각적으로 그룹화된 항목들 간의 부모-자식 데이터 관계를 역추적합니다.
- **Visual Saliency Mapping**: 핵심 액션(CTA)과 보조 액션의 시각적 가중치를 분석하여, 이전 기획자가 의도했던 비즈니스 우선순위와 논리 경로를 복원합니다.

### 1.2 OCR-to-Constraint Calculus
- **Textual Invariant Extraction**: 이미지 내 텍스트 데이터(예: "0/1000자", "필수 입력")를 추출하여 도메인 제약 조건(Constraints)을 역산합니다.
- **UI Element Archetyping**: 버튼, 인풋, 드롭다운 등의 시각적 형상을 인식하여 각 요소가 가질 수 있는 유한 상태(Status)를 정의합니다.

## 2. 구조적 역공학 및 엔트로피 분석 (Structural Reverse-Engineering)

퍼블리싱된 HTML의 코드를 분석하여 보이지 않는 시스템 아키텍처를 시각화합니다.

### 2.1 DOM Tree Entropy Analysis
- **Node Density Physics**: 특정 영역의 DOM 노드 밀도와 깊이를 분석하여 기능적 핵심 오퍼레이션 영역(Core)과 래퍼 영역(Wrapper)을 분리합니다.
- **Semantic Consistency Audit**: 클래스 명명 규칙(BEM 등)과 HTML5 시맨틱 태그 사용 패턴을 분석하여 데이터 바인딩의 일관성 여부를 감사(Audit)합니다.

### 2.2 FSM Induction from Interaction Diffs
- **State Transition Discovery**: 페이지의 서로 다른 시점(Before/After) 이미지를 대조하여 상태 전이 진리표를 작성하고, 이를 `FLA`로 이식 가능한 FSM 모델로 변환합니다.
- **Asynchronous Logic Inference**: 로딩 스피너, 토스트 알림 등의 퍼블리싱 요소를 탐지하여 백엔드 비동기 통신 지점과 예외 처리 로직을 역설계합니다.

## 3. 하이퍼-디테일 리버스 엔드니어링 산출물 규격

1. **[Artifact Reverse Engineering Report]**: 이미지/HTML 분석 결과, 도출된 비즈니스 규칙, 신규 기획으로의 매핑 정보가 포함된 초정밀 복원 보고서.

---
> [!IMPORTANT]
> **"과거는 미래의 원시 데이터이다."** VAA는 파편화된 유산으로부터 살아있는 논리를 추출하여, 새로운 시스템이 과거의 실수를 반복하지 않고 더 높은 논리적 고점을 선점하도록 보장합니다.
