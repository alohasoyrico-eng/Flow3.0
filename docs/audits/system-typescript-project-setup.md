# TypeScript Project Setup

Status: **pass**

TypeScript project setup debt: 0

## Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| `tsconfig-exists` | PASS | `{"file":"tsconfig.json","exists":true}` |
| `typecheck-script-owned` | PASS | `{"typecheckScript":"tsc --noEmit --project tsconfig.json"}` |
| `strict-no-emit-configuration` | PASS | `{"strict":true,"noEmit":true,"allowJs":false}` |
| `typed-source-included` | PASS | `{"include":["packages/tokens/src/**/*.ts","packages/tokens/src/**/*.tsx","packages/components/src/contracts.ts","packages/components/src/index.ts","packages/components/src/registry.ts","packages/components/src/platforms/**/*.ts","packages/components/src/primitives/**/*.ts","packages/react/src/internal/**/*.ts","packages/react/src/Surface.tsx","packages/react/src/Button.tsx","packages/react/src/Input.tsx","packages/react/src/Card.tsx","packages/react/src/Tabs.tsx","packages/react/src/Dialog.tsx","packages/react/src/Drawer.tsx","packages/react/src/Menu.tsx","packages/react/src/Popover.tsx","packages/react/src/IconButton.tsx","packages/react/src/Checkbox.tsx","packages/react/src/RadioButton.tsx","packages/react/src/Switch.tsx","packages/react/src/TextArea.tsx","packages/react/src/Avatar.tsx","packages/react/src/Badge.tsx","packages/react/src/ProgressIndicator.tsx","packages/react/src/Spinner.tsx","packages/react/src/Skeleton.tsx","packages/react/src/Tag.tsx","packages/react/src/Chip.tsx","packages/react/src/Breadcrumbs.tsx","packages/react/src/Pagination.tsx","packages/react/src/SegmentedControl.tsx","packages/react/src/Slider.tsx"]}` |
| `tsc-no-emit-passes` | PASS | `{"status":0,"stdout":"","stderr":""}` |

