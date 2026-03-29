# Database Engineering & Optimization Guide

## 1. Schema Design Principles
- **Normalization**: 3정규화(3NF)를 기본으로 하되, 읽기 성능이 핵심인 경우 역정규화(Denormalization)를 고려한다.
- **Foreign Keys**: 데이터 무결성(Integrity)을 위해 FK 제약조건을 반드시 설정한다.
- **Data Types**: `UUID` vs `Serial` (분산 환경이면 UUID 권장), `Timestamp` (Timezone 포함 `timestamptz`).

## 2. Indexing Strategy
- **Rule of Thumb**: `WHERE`, `JOIN`, `ORDER BY`에 사용되는 컬럼은 인덱스를 고려한다.
- **Composite Index**: 카디널리티(Cardinality)가 높은 컬럼을 선행(Left-most)으로 둔다.
- **Avoid Over-indexing**: 쓰기 성능 저하를 막기 위해 불필요한 인덱스는 생성하지 않는다.

## 3. Migration Rules
- **Non-blocking**: 대용량 테이블 변경 시 락(Table Lock)을 최소화하는 전략을 사용한다.
- **Idempotency**: 마이그레이션 스크립트는 여러 번 실행해도 결과가 동일해야 한다. (`IF NOT EXISTS`)
- **Rollback Plan**: 모든 마이그레이션은 `down` 스크립트(원복)를 포함해야 한다.

## 4. Query Optimization (N+1)
- ORM 사용 시 `Lazy Loading`으로 인한 N+1 문제를 경계한다.
- 반드시 `Eager Loading` (`include`, `join`)이나 `Batch Fetching`을 사용한다.
