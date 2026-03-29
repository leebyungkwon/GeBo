# Design Token Naming Specification

## 1. Naming Convention Principles
Uses **CTI (Category-Type-Item)** structure for consistency.
Format: `category-type-item-state`

- **Category**: `color`, `font`, `spacing`, `radius`, `shadow`
- **Type**: `brand`, `background`, `text`, `border`
- **Item**: `primary`, `secondary`, `warning`, `success`
- **State** (Optional): `hover`, `active`, `disabled`

## 2. Token Tiers

### Tier 1: Core Tokens (Primitive Values)
*Raw values, independent of context.*
```yaml
color-blue-500: #3B82F6
color-gray-100: #F3F4F6
spacing-4: 1rem (16px)
font-size-base: 1rem
```

### Tier 2: Semantic Tokens (Contextual Usage)
*How the value is used in the system.*
```yaml
color-bg-page: {color-gray-50}
color-text-primary: {color-gray-900}
color-action-primary: {color-blue-500}
spacing-layout-pad: {spacing-4}
```

### Tier 3: Component Tokens (Specific Overrides)
*Specific to a component.*
```yaml
btn-primary-bg: {color-action-primary}
btn-primary-bg-hover: {color-blue-600}
card-padding: {spacing-layout-pad}
```

## 3. Token Specification Template
*(Copy this table to `ui_guide.md`)*

| Token Name | Reference (Semantic) | Value (Core) | Usage Note |
| :--- | :--- | :--- | :--- |
| `color-surface-card` | `color-white` | `#FFFFFF` | Card background |
| `color-text-subtle` | `color-gray-500` | `#6B7280` | Helper text, placeholders |
| `radius-input` | `radius-md` | `0.375rem` | All form inputs |
| `animate-fade-in` | `transition-opacity` | `200ms ease-out` | Modal open |
