# Technical Design Document (RFC)

## 1. Context & Scope
- **Feature**: [Feature Name]
- **Problem**: [What are we solving?]
- **Goals**: [Performance metrics, reliability goals]

## 2. Architecture & Design
### Data Flow
- `User` -> `Controller` -> `Service (Biz Logic)` -> `Repository` -> `DB`

### Database Schema (Modification)
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Interface
- `POST /api/todos`
    - Input: `{ title: string }`
    - Validation: `z.object({ title: z.string().min(1) })`

## 3. Detailed Implementation Plan
- **Class/Module Structure**:
    - `TodoController`: Handles HTTP req/res.
    - `TodoService`: Implements business rules (e.g., max 5 todos).
    - `PostgresTodoRepository`: SQL interactions.

## 4. Migration Strategy
- [ ] Create Migration Script `001_init_todos.sql`
- [ ] Update ORM models.

## 5. Security & Risk
- **Risk**: SQL Injection -> **Mitigation**: Use ORM / Parameterized Query.
- **Risk**: XSS in Title -> **Mitigation**: Sanitize output on frontend.
