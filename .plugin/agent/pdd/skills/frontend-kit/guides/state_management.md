# State Management Strategy (Unified)

## 1. The Golden Rule
**"Do not treat Server State as Client State."**
(서버에서 가져온 데이터는 전역 스토어(Redux/Zustand)에 넣지 말고, 캐싱 라이브러리를 사용하라.)

## 2. State Classification & Tools

### 2.1 Server State (Remote Data)
*Data owned by the server (e.g., User Profile, Todo List).*
- **Tool**: `TanStack Query` (React Query) or `SWR`.
- **Why**: Handles caching, deduping, background updates.

### 2.2 Client State (UI State)
*Data owned by the browser (e.g., Modal Open, Dark Mode).*
- **Global**: `Zustand` or `Recoil`.
- **Local**: `useState` or `useReducer`.

## 3. Advanced Server Strategies (React Query)

### 3.1 Configuration (Stale vs GC)
*   **staleTime**: Data is fresh for this duration. No refetch.
*   **gcTime**: Data remains in memory (garbage collection) after component unmounts.

```tsx
const { data } = useQuery({
  queryKey: ['user', id],
  queryFn: fetchUser,
  staleTime: 1000 * 60 * 5, // 5 mins
});
```

### 3.2 Optimistic Updates (UX)
Update UI *before* the server responds.

```tsx
const mutation = useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: ['todos'] });
    const previousTodos = queryClient.getQueryData(['todos']);
    queryClient.setQueryData(['todos'], (old) => [...old, newTodo]);
    return { previousTodos };
  },
  onError: (err, newTodo, context) => {
    queryClient.setQueryData(['todos'], context.previousTodos);
  }
});
```

## 4. Advanced Client Strategies (Zustand)
### 4.1 Middleware (Persist & Immer)
Simplify immutable updates and local storage.

```tsx
export const useStore = create(
  persist(
    immer((set) => ({
      bears: 0,
      addBear: () => set((state) => { state.bears += 1 }),
    })),
    { name: 'bear-storage' }
  )
);
```

## 5. Data Fetching Pattern (Custom Hook)
Do not use `useQuery` directly in UI components. Encapsulate it.

```tsx
// Good: Encapsulated
export const useTodos = () => {
  return useQuery({ queryKey: ['todos'], queryFn: api.getTodos });
};
```
