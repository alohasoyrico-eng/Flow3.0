# React Composition Governance Audit

Status: **pass**

React components may compose other Flow React components only through an explicit allowlist, so visual reuse is intentional and duplicate implementations cannot drift silently.

## Inventory

- React components scanned: 56
- Components with declared composition: 23
- Composition edges: 39
- Allowlist entries: 23
- Unexpected imports: 0
- Missing expected imports: 0

## Components

| Component | Status | Allowed | Actual | Unexpected | Missing |
| --- | --- | --- | --- | --- | --- |
| BiometricPrompt | pass | Button | Button | None | None |
| Button | pass | Spinner | Spinner | None | None |
| Card | pass | Button, IconButton, Spinner | Button, IconButton, Spinner | None | None |
| CardExpiryInput | pass | Spinner | Spinner | None | None |
| CardNumberInput | pass | Spinner | Spinner | None | None |
| CardSecurityCodeInput | pass | Spinner | Spinner | None | None |
| CardSummary | pass | Badge | Badge | None | None |
| Dialog | pass | Button, IconButton, Input | Button, IconButton, Input | None | None |
| Drawer | pass | Badge, Button, IconButton, Input, ProgressIndicator | Badge, Button, IconButton, Input, ProgressIndicator | None | None |
| EmptyState | pass | Button, Spinner | Button, Spinner | None | None |
| ErrorPanel | pass | Button, Spinner | Button, Spinner | None | None |
| FloatingActionButton | pass | Spinner | Spinner | None | None |
| InlineValidation | pass | Input | Input | None | None |
| Input | pass | Spinner | Spinner | None | None |
| Menu | pass | Avatar, Button, IconButton | Avatar, Button, IconButton | None | None |
| PhoneInput | pass | CountrySelector | CountrySelector | None | None |
| Popover | pass | Button, Input | Button, Input | None | None |
| QuickAction | pass | Badge, Spinner | Badge, Spinner | None | None |
| RouteSummary | pass | Button, IconButton | Button, IconButton | None | None |
| Table | pass | Badge | Badge | None | None |
| Tabs | pass | Badge | Badge | None | None |
| Toast | pass | Button, IconButton | Button, IconButton | None | None |
| TreeView | pass | Button | Button | None | None |

## Edges

| From | To |
| --- | --- |
| BiometricPrompt | Button |
| Button | Spinner |
| Card | Button |
| Card | IconButton |
| Card | Spinner |
| CardExpiryInput | Spinner |
| CardNumberInput | Spinner |
| CardSecurityCodeInput | Spinner |
| CardSummary | Badge |
| Dialog | Button |
| Dialog | IconButton |
| Dialog | Input |
| Drawer | Badge |
| Drawer | Button |
| Drawer | IconButton |
| Drawer | Input |
| Drawer | ProgressIndicator |
| EmptyState | Button |
| EmptyState | Spinner |
| ErrorPanel | Button |
| ErrorPanel | Spinner |
| FloatingActionButton | Spinner |
| InlineValidation | Input |
| Input | Spinner |
| Menu | Avatar |
| Menu | Button |
| Menu | IconButton |
| PhoneInput | CountrySelector |
| Popover | Button |
| Popover | Input |
| QuickAction | Badge |
| QuickAction | Spinner |
| RouteSummary | Button |
| RouteSummary | IconButton |
| Table | Badge |
| Tabs | Badge |
| Toast | Button |
| Toast | IconButton |
| TreeView | Button |

