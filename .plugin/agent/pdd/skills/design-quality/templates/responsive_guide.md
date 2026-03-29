# Responsive Design Strategy Guide

## 1. Breakpoint System (Tailwind Standard)
| Prefix | Min-Width | Device Example |
| :--- | :--- | :--- |
| `base` | 0px ~ | Mobile (Portrait) **(Primary Design Target)** |
| `sm` | 640px ~ | Mobile (Landscape) / Small Tablet |
| `md` | 768px ~ | Tablet (Portrait) |
| `lg` | 1024px ~ | Laptop / Tablet (Landscape) |
| `xl` | 1280px ~ | Desktop |

## 2. Layout Behavior Rule
### Mobile (Base) -> Desktop (LG)
1.  **Grid System**: 
    - Mobile: 1 Column (Stack vertically)
    - Desktop: 12 Column Grid
2.  **Navigation**:
    - Mobile: Hamburger Menu or Bottom Tab
    - Desktop: Top Horizontal Bar or Sidebar
3.  **Typography**:
    - Mobile Base Size: 16px
    - Desktop Base Size: 18px (Scaled up)

## 3. Component Adaptation Examples
- **Card List**:
    - Mobile: `w-full` (1 card per row)
    - Desktop: `grid-cols-3` (3 cards per row)
- **Modal**:
    - Mobile: Bottom Sheet (Slide up)
    - Desktop: Center Modal (Dialog)
