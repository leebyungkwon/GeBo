# Stitch Component Mapping Spec

## 1. Theme Configuration
- **Primary Color**: `{{Design_Color_Primary}}`
- **Font Family**: `{{Design_Font}}`
- **Radius**: `{{Design_Radius}}`

## 2. Component Map
*(Map each Logical Element to a Stitch Component)*

| Logical Element | Stitch Component | Props / Attributes | Style Class |
| :--- | :--- | :--- | :--- |
| `Task Input` | `Input.Text` | `placeholder="Add a new task"`, `maxLength=50` | `w-full p-2 border rounded` |
| `Add Button` | `Button.Primary` | `label="Add"`, `icon="plus"` | `bg-primary text-white hover:opacity-90` |
| `Task List` | `List.Container` | `datasource="local_todos"` | `flex flex-col gap-2` |
| `Delete Action` | `Icon.Trash` | `onClick="removeTask()"` | `text-red-500 cursor-pointer` |

## 3. Layout Structure (Tree)
- `Page`
  - `Header`
    - `Title` ("My Tasks")
  - `Body` (Container)
    - `InputGroup` (Row)
      - `Input.Text`
      - `Button.Primary`
    - `List.Container` (Repeater)
      - `TaskItem` (Row)
        - `Checkbox`
        - `Label`
        - `Icon.Trash`

## 4. Stitch Command (Pseudo)
```bash
# Recommendation for User
stitch create project "TodoApp" --template "blank"
# Or if CLI is available
# stitch add component Input.Text --props ...
```
