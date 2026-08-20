# Select current light/dark review

Status: pass

## What changed
- Promoted option-row text and disabled affordances to shared Flow roles.
- Select, Combobox, and Menu now consume the same option-row color/disabled contracts.
- Disabled options no longer depend on opacity-only signaling.

## Evidence
- Keyboard: ArrowDown skips the disabled row, Enter commits, Escape closes and clears aria-activedescendant.
- Density: trigger 38/44/52, option row 50.96/62.72/74.48, check icon 16/20/24.
- Light contrast: normal option 14.63, disabled option 7.58.
- Dark colors: option #f8fafc, disabled #cbd5e1, opacity 1 on dark overlay.

## Gates
- node packages/audit/scripts/audit-select-css-contract.js
- node packages/audit/scripts/audit-combobox-css-contract.js
- node packages/audit/scripts/audit-menu-css-contract.js
- node packages/audit/scripts/audit-dark-mode-css-contract.js
- npm run test:fast --workspace @design-system/react
