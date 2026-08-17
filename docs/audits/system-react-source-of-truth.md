# System React source of truth

Generated: 2026-08-14

## Decision

- Source of truth: `packages/react/src/**/*.ts and packages/react/src/**/*.tsx`
- Temporary runtime mirror: `packages/react/src/**/*.js exists only as generated compatibility runtime for current tests/audits`
- Publication runtime: `packages/react/dist/**/*.js`
- Publication types: `packages/react/dist/**/*.d.ts`
- Next required decision: remove or quarantine src runtime mirrors after tests/audits stop importing ../src/*.js

## Summary

- Status: pass
- TS/TSX source files: 157
- Runtime JS files in src: 158
- Declaration files in src: 156
- Runtime JS files in dist: 158
- Declaration files in dist: 156
- Generated src runtime without TS source: 1
- src runtime mirrors missing generated header: 0
- Source truth debt: 0
- Temporary src runtime mirror count: 157

## Blocking Debt

- Public runtime targets outside dist: 0
- Public declaration targets outside dist: 0
- src JS without TS/TSX source: 0
- src declarations without TS/TSX source: 0
- src runtime mirrors missing generated header: 0

## Temporary Runtime Mirror Samples

| File |
| --- |
| packages/react/src/Accordion.js |
| packages/react/src/AnimatedMoment.js |
| packages/react/src/AuditEvent.js |
| packages/react/src/Avatar.js |
| packages/react/src/Badge.js |
| packages/react/src/BiometricPrompt.js |
| packages/react/src/Breadcrumbs.js |
| packages/react/src/Button.js |
| packages/react/src/Card.js |
| packages/react/src/CardExpiryInput.js |
| packages/react/src/CardNumberInput.js |
| packages/react/src/CardSecurityCodeInput.js |
| packages/react/src/CardSummary.js |
| packages/react/src/ChartPanel.js |
| packages/react/src/ChatComposer.js |
| packages/react/src/ChatMessage.js |
| packages/react/src/ChatThread.js |
| packages/react/src/Checkbox.js |
| packages/react/src/Chip.js |
| packages/react/src/CodeBlock.js |
| packages/react/src/CodeInput.js |
| packages/react/src/Combobox.js |
| packages/react/src/CopyButton.js |
| packages/react/src/CountrySelector.js |
| packages/react/src/DatePicker.js |
| packages/react/src/DateRangePicker.js |
| packages/react/src/Dialog.js |
| packages/react/src/Drawer.js |
| packages/react/src/EmptyState.js |
| packages/react/src/ErrorPanel.js |
| packages/react/src/FloatingActionButton.js |
| packages/react/src/IconButton.js |
| packages/react/src/InlineValidation.js |
| packages/react/src/Input.js |
| packages/react/src/InputAmount.js |
| packages/react/src/KpiTile.js |
| packages/react/src/List.js |
| packages/react/src/Menu.js |
| packages/react/src/MotionBoundary.js |
| packages/react/src/MovementRow.js |

## Notes

- This report does not claim src JS is authored source.
- Generated token outputs under packages/react/src are governed by the token output manifest, not by React source authorship.
- The current compatibility mirror is allowed only when every mirrored src JS file carries the generated compatibility header.
- Iteration 8 must reduce or quarantine the mirror by moving internal tests/audits to dist/package imports or by making the compatibility mirror explicit outside source.
