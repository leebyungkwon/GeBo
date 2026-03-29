# Component Design Patterns & Best Practices (Unified)

## 1. Design Philosophy
- **Composition over Inheritance**: 상속보다는 합성(Composition)을 통해 유연한 컴포넌트를 만든다.
- **Single Responsibility**: 컴포넌트는 오직 한 가지 역할(레이아웃, 로직, 뷰)만 수행한다.

## 2. Standard Patterns

### 2.1 Compound Component Pattern (Concept)
*Use when multiple components work together with shared state (e.g., Select, Dropdown).*
```tsx
// Usage
<Select>
  <Select.Trigger>Choose option</Select.Trigger>
  <Select.List>
    <Select.Item value="1">Option 1</Select.Item>
  </Select.List>
</Select>
```

### 2.2 Container / Presenter Pattern (Modern Hooks)
*Separate Logic (Hook) from UI (Component).*
- `useTodoList()`: Fetches data, handles sorting.
- `TodoListUI`: Renders the list. It takes data as props only.

### 2.3 Atomic Design Structure
Organize `src/components` by granularity:
- **Atoms**: Button, Input, Icon (No logic).
- **Molecules**: SearchBar (Input + Button).
- **Organisms**: Header, Footer (Complex layout).
- **Templates**: Page Layouts.

## 3. Advanced Patterns (Deep Dive)

### 3.1 Compound Component Implementation (Context API)
*How to implement the Compound Pattern using Context.*

```tsx
const SelectContext = createContext<SelectContextType | null>(null);

export function Select({ children, onChange }: SelectProps) {
  const [value, setValue] = useState("");
  const contextValue = useMemo(() => ({ value, setValue, onChange }), [value, onChange]);

  return (
    <SelectContext.Provider value={contextValue}>
      <div className="select-root">{children}</div>
    </SelectContext.Provider>
  );
}
```

### 3.2 Headless UI Pattern
*Separate Logic (Hook) from UI (JSX).*

```tsx
// useToggle.ts (Logic)
export function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((prev) => !prev);
  return { on, toggle, setOn };
}
```

### 3.3 Polymorphic Components (`as` prop)
Allow components to render as different HTML tags.

```tsx
type TextProps<C extends React.ElementType> = {
  as?: C;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<C>;

export const Text = <C extends React.ElementType = "span">({ 
  as, children, ...props 
}: TextProps<C>) => {
  const Component = as || "span";
  return <Component {...props}>{children}</Component>;
};
```

## 4. Anti-Patterns (Avoid these)
- **Huge Props Object**: Don't pass `{...props}` blindly. Define an explicit Interface.
- **Logic inside JSX**: Avoid extensive ternary operators in render. Extract to helper functions.
