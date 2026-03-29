---
name: policy-integrity-checker
type: Skill
phase: Planning / Quality Assurance
description: |
  작성된 기획서의 비즈니스 로직 결함을 탐지하고, 필수 엣지 케이스(Edge Case)가 누락되지 않았는지 전수 검사하는 '논리 방패' 스킬입니다.
  개발 단계에서 발생할 수 있는 '기획 미비'로 인한 재작업을 원천 차단합니다.

  Tools:
  - read_file / view_file (기획서 내용 정밀 검독)
  - edit_file (누락된 정책 보완 제안)
---

# Policy Integrity Checker: Logical Fortification

## 1. 사용 시점 (Triggers)
- **비즈니스 로직 설계 중 (Step 01. Phase 3)**: 상태 전이 모델이나 입력 검증 정책을 수립할 때.
- **기획서 최종 완성 전 (Step 01. Phase 5)**: 디자이너/개발자에게 핸드오버하기 전 마지막 자가 검수 시.

## 2. 8대 필수 에지 케이스 체크리스트 (8-Point Audit)
에이전트는 기획서(`plan_{page}.md`)의 "5. 비즈니스 로직 및 예외 정책" 섹션에서 다음 항목이 포함되었는지 검수합니다.

1. **Empty State**: 데이터가 0건일 때 화면은 어떻게 표현되는가?
2. **Loading/Pending State**: 대량 데이터 처리 중 사용자에게 어떤 피드백을 주는가?
3. **Authorization Failure**: 권한이 없는 사용자가 접근하거나 위조된 요청을 보낼 때의 대응 정책.
4. **Validation Error**: 모든 입력 필드가 비정상적일 때(XSS 공격, 길이 초과 등)의 상세 에러 메시지 규격.
5. **Network Interruption**: 오프라인 상태 혹은 통신 타임아웃 발생 시의 복구 시나리오.
6. **Concurrency Issue**: 동일 데이터를 두 명이 동시에 수정하려 할 때의 처리(낙관적/비관적 락).
7. **Boundary Values**: 날짜 검색 시 '조회 시작일 > 종료일'인 경우 등 경계값 처리 로직.
8. **Deletion Policy**: 데이터 삭제 시 연관 데이터 처리(Cascade, Soft Delete 등) 및 복구 가능 여부.

## 3. 정책 보완 프로토콜 (Correction Protocol)
누락 발견 시 에이전트는 아래와 같이 기획서에 즉시 보완 의견을 추가합니다.

```markdown
> [!CAUTION]
> **[무결성 검수 결과]**: '대량 데이터 로딩 지연'에 대한 예외 정책이 누락되었습니다.
> **[보완 제안]**: 스켈레톤 UI를 도입하고, 5초 이상 지연 시 '재시도 버튼' 노출 정책을 추가하십시오.
```

## 4. 제약 사항 (Constraints)
- **No Ambiguity**: "적절히 처리한다"와 같은 모호한 정책은 결함으로 간주합니다.
- **Audit-First**: 기획서 내용이 80% 이상 완성되었을 때 이 스킬을 가동하여 전체적인 일관성을 체크하십시오.
