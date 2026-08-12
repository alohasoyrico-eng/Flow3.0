# TypeScript Project Setup

Status: **pass**

TypeScript project setup debt: 0

## Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| `tsconfig-exists` | PASS | `{"file":"tsconfig.json","exists":true}` |
| `typecheck-script-owned` | PASS | `{"typecheckScript":"tsc --noEmit --project tsconfig.json"}` |
| `strict-no-emit-configuration` | PASS | `{"strict":true,"noEmit":true,"allowJs":false}` |
| `typed-source-included` | PASS | `{"include":["packages/tokens/src/**/*.ts","packages/tokens/src/**/*.tsx","packages/components/src/contracts.ts","packages/components/src/index.ts","packages/components/src/registry.ts","packages/components/src/platforms/**/*.ts","packages/components/src/primitives/**/*.ts","packages/react/src/internal/**/*.ts","packages/react/src/Surface.tsx","packages/react/src/Button.tsx","packages/react/src/Input.tsx","packages/react/src/Card.tsx","packages/react/src/Tabs.tsx","packages/react/src/Dialog.tsx","packages/react/src/Drawer.tsx","packages/react/src/Menu.tsx","packages/react/src/Popover.tsx","packages/react/src/IconButton.tsx","packages/react/src/Checkbox.tsx","packages/react/src/RadioButton.tsx","packages/react/src/Switch.tsx","packages/react/src/TextArea.tsx","packages/react/src/Avatar.tsx","packages/react/src/Badge.tsx","packages/react/src/ProgressIndicator.tsx","packages/react/src/Spinner.tsx","packages/react/src/Skeleton.tsx","packages/react/src/Tag.tsx","packages/react/src/Chip.tsx","packages/react/src/Breadcrumbs.tsx","packages/react/src/Pagination.tsx","packages/react/src/SegmentedControl.tsx","packages/react/src/Slider.tsx","packages/react/src/Select.tsx","packages/react/src/Combobox.tsx","packages/react/src/Table.tsx","packages/react/src/CardNumberInput.tsx","packages/react/src/CardExpiryInput.tsx","packages/react/src/CardSecurityCodeInput.tsx","packages/react/src/DatePicker.tsx","packages/react/src/DateRangePicker.tsx","packages/react/src/ChatComposer.tsx","packages/react/src/ChatMessage.tsx","packages/react/src/ChatThread.tsx","packages/react/src/EmptyState.tsx","packages/react/src/ErrorPanel.tsx","packages/react/src/InlineValidation.tsx","packages/react/src/Toast.tsx","packages/react/src/Accordion.tsx","packages/react/src/TreeView.tsx","packages/react/src/List.tsx","packages/react/src/Stepper.tsx","packages/react/src/AnimatedMoment.tsx","packages/react/src/MotionBoundary.tsx","packages/react/src/MovementRow.tsx","packages/react/src/AuditEvent.tsx","packages/react/src/CodeInput.tsx","packages/react/src/PhoneInput.tsx","packages/react/src/CountrySelector.tsx","packages/react/src/InputAmount.tsx","packages/react/src/BiometricPrompt.tsx","packages/react/src/FloatingActionButton.tsx","packages/react/src/StationPin.tsx","packages/react/src/Tooltip.tsx"]}` |
| `tsc-no-emit-passes` | PASS | `{"status":0,"stdout":"","stderr":""}` |

