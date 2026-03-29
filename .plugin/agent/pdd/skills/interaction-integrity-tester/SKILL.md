---
name: interaction-integrity-tester
3: type: Skill
4: phase: Design
5: description: |
6:   디자인의 모든 동적 상태와 핸드오버 무결성을 '제로 디펙트(Zero-Defect)' 수준으로 검사하는 하버 엔진.
7:   150개 초정밀 체크리스트와 24대 극한 디자인 리스크 관리를 통해 '질문 없는 디자인 이관'을 실현합니다.
8: 
9:   Tools:
10:   - 150-Item Design Integrity Checklist: `assets/design_templates/design_integrity_checklist_150.md`
11:   - Micro-Interaction Specifier: `assets/design_templates/micro_interaction_spec.md`
12:   - Visual Handoff Certification: `assets/design_templates/visual_handoff_certification.md`
13: ---
14: 
15: # Interaction Integrity Tester: The Infallible Design Auditor [Hyper-Level]
16: 
17: ## 1. 150개 초정밀 디자인 무결성 거버넌스 (The 150-Item Governance)
18: 
19: 디자이너는 퍼블리셔/개발자에게 자산을 넘기기 전, **'시스템의 언어'**가 아닌 **'물리적 수학'**으로 디자인을 전수 검사합니다.
20: 
21: ### 1.1 Full-State UI Infallibility (8-State Matrix)
22: - **The 8-State Component Matrix**: 모든 상호작용 요소는 반드시 **8가지 전이 상태(Normal, Hover, Active, Focus, Disabled, Loading, Selected, Error)**에 대한 시각적 명세와 함께 전달되어야 합니다.
23: - **Skeleton Mastery**: 데이터 로딩 시의 CLS(Cumulative Layout Shift)를 0으로 고정하는 '고정밀 스켈레톤 가이드' 100% 일치를 감독합니다.
24: - **Edge Case States**: 데이터가 0건일 때(Empty), 1건일 때(Partial), 혹은 수만 건일 때(Bulk)의 특수 상태 디자인을 전수 검증합니다.
25: 
26: ### 1.2 The Unhappy Design 24: 극한 상황 시뮬레이션 (Extented Design Logic)
27: PM OS에서 정의한 20대 리스크를 UI/UX 관점으로 확장하여 24가지 극한 상황을 방어합니다.
28: - **Visual Thrashing Attack**: 복잡한 애니메이션이 저사양 CPU 환경에서 프레임 드랍이나 정적 깨짐(Lattice)을 유발하지 않는지 스트레스 테스트합니다.
29: - **Extreme Font Explosion**: 사용자 브라우저의 '최소 폰트 크기' 설정이 UI의 논리적 레이아웃을 파괴하지 않도록 유연한 방어막을 구축합니다.
30: - **Asset Integrity Failure Flow**: 아이콘/이미지 서버 장애 시의 컬러 플레이스홀더 및 텍스트 대체(Alt) 디자인의 정갈함을 검수합니다.
31: - **Contrast Bleeding Safeguard**: 다크모드/고대비 모드 자동 전환 시 주요 텍스트와 배경의 대비값이 APCA 기준 안전권 하한선을 침범하지 않는지 확인합니다.
32: 
33: ### 1.3 Atomic Design Contract (원자 단위 핸드오버 계약)
34: - **Token Accuracy (0.01px)**: 모든 스타일 토큰이 실제 JSON 규격과 0.01px의 오차 없이 일치하는지 자동 감사 도구로 확인합니다.
35: - **Interaction Physics Spec**: Cubic-Bezier 수치와 Elastic 계수가 포함된 **'움직임의 수식'**을 이관 패키지에 동봉합니다.
36: 
37: ## 2. Infallible Handoff Protocol: 질문 없는 이관 (The Zero-Question Rule)
38: 
39: 1. **98% Mandatory Success**: `design_integrity_checklist_150.md`의 준수 점수가 98점(147개/150개) 미만인 경우, '이관 금지' 태그를 강제 부여합니다.
40: 2. **Immediate Popup Rule**: 시안 확정 즉시 `run_command`를 통해 사진 뷰어가 팝업되어야 하며, 이를 위해 상대 경로 `./` 무결성을 매 초마다 자가 진단합니다.
41: 3. **Certification Ritual**: `visual_handoff_certification.md` 발부를 통해 디자인이 논리적으로 '결정형(Deterministic)'임을 확언합니다.
42: 
43: ---
44: > [!CAUTION]
45: > **"모호한 디자인은 개발 단계의 독이 된다."** 디자이너는 자신의 시안이 코드로 변환될 때 발생할 수 있는 모든 오차를 기획 단계에서 봉쇄해야 합니다.
46: 
