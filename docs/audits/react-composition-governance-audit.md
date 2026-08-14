# React Composition Governance Audit

Status: **pass**

React components may compose other Flow React components only through an explicit allowlist, so visual reuse is intentional and duplicate implementations cannot drift silently. The actionable debt metric is compositionDebt.

## Inventory

- React components scanned: 62
- Composition debt: 0
- Components with declared composition: 29
- Composition edges: 53
- Allowlist entries: 29
- Unexpected imports: 0
- Missing expected imports: 0
- Missing composition reasons: 0
- Duplicate allowed edges: 0
- Unknown allowed targets: 0
- Unknown contract owners: 0

## Components

| Component | Status | Allowed | Actual | Unexpected | Missing | Missing reasons | Duplicate allowed | Unknown targets |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BiometricPrompt | pass | Button | Button | None | None | None | None | None |
| Button | pass | Spinner | Spinner | None | None | None | None | None |
| Card | pass | Button, IconButton, Spinner | Button, IconButton, Spinner | None | None | None | None | None |
| CardExpiryInput | pass | Spinner | Spinner | None | None | None | None | None |
| CardNumberInput | pass | Spinner | Spinner | None | None | None | None | None |
| CardSecurityCodeInput | pass | Spinner | Spinner | None | None | None | None | None |
| CardSummary | pass | Badge | Badge | None | None | None | None | None |
| ChatComposer | pass | Button, IconButton, Surface, TextArea | Button, IconButton, Surface, TextArea | None | None | None | None | None |
| ChatMessage | pass | Avatar, Button, Surface | Avatar, Button, Surface | None | None | None | None | None |
| ChatThread | pass | ChatMessage, EmptyState, Surface | ChatMessage, EmptyState, Surface | None | None | None | None | None |
| CodeBlock | pass | CopyButton | CopyButton | None | None | None | None | None |
| CopyButton | pass | Button, IconButton | Button, IconButton | None | None | None | None | None |
| Dialog | pass | Button, IconButton, Input | Button, IconButton, Input | None | None | None | None | None |
| Drawer | pass | Badge, Button, IconButton, Input, ProgressIndicator | Badge, Button, IconButton, Input, ProgressIndicator | None | None | None | None | None |
| EmptyState | pass | Button, Spinner | Button, Spinner | None | None | None | None | None |
| ErrorPanel | pass | Button, Spinner | Button, Spinner | None | None | None | None | None |
| FloatingActionButton | pass | Spinner | Spinner | None | None | None | None | None |
| InlineValidation | pass | Input | Input | None | None | None | None | None |
| Input | pass | Spinner | Spinner | None | None | None | None | None |
| InputAmount | pass | Spinner | Spinner | None | None | None | None | None |
| Menu | pass | Avatar, Button, IconButton | Avatar, Button, IconButton | None | None | None | None | None |
| PhoneInput | pass | CountrySelector | CountrySelector | None | None | None | None | None |
| Popover | pass | Button, Input | Button, Input | None | None | None | None | None |
| QuickAction | pass | Badge, Spinner | Badge, Spinner | None | None | None | None | None |
| RouteSummary | pass | Button, IconButton | Button, IconButton | None | None | None | None | None |
| Table | pass | Badge | Badge | None | None | None | None | None |
| Tabs | pass | Badge | Badge | None | None | None | None | None |
| Toast | pass | Button, IconButton | Button, IconButton | None | None | None | None | None |
| TreeView | pass | Button | Button | None | None | None | None | None |

## Unknown Contract Owners

- None

## Edges

| From | To | Reason |
| --- | --- | --- |
| BiometricPrompt | Button | primary fallback action |
| Button | Spinner | loading indicator slot |
| Card | Button | declared action slot |
| Card | IconButton | declared icon action slot |
| Card | Spinner | loading indicator slot |
| CardExpiryInput | Spinner | field loading indicator slot |
| CardNumberInput | Spinner | field loading indicator slot |
| CardSecurityCodeInput | Spinner | field loading indicator slot |
| CardSummary | Badge | status badge slot |
| ChatComposer | Button | send action slot |
| ChatComposer | IconButton | attachment action slot |
| ChatComposer | Surface | composer structural primitive boundary |
| ChatComposer | TextArea | message field slot |
| ChatMessage | Avatar | author identity slot |
| ChatMessage | Button | recovery action slot |
| ChatMessage | Surface | message bubble structural primitive boundary |
| ChatThread | ChatMessage | governed message row slot |
| ChatThread | EmptyState | unavailable conversation state slot |
| ChatThread | Surface | thread log structural primitive boundary |
| CodeBlock | CopyButton | governed copy action slot |
| CopyButton | Button | visible text copy action |
| CopyButton | IconButton | compact icon copy action |
| Dialog | Button | dialog action slot |
| Dialog | IconButton | dismiss control |
| Dialog | Input | form field slot |
| Drawer | Badge | status badge slot |
| Drawer | Button | drawer action slot |
| Drawer | IconButton | dismiss control |
| Drawer | Input | form field slot |
| Drawer | ProgressIndicator | progress row slot |
| EmptyState | Button | recovery action slot |
| EmptyState | Spinner | loading state slot |
| ErrorPanel | Button | recovery action slot |
| ErrorPanel | Spinner | loading state slot |
| FloatingActionButton | Spinner | loading indicator slot |
| InlineValidation | Input | field validation composition |
| Input | Spinner | field loading indicator slot |
| InputAmount | Spinner | field loading indicator slot |
| Menu | Avatar | avatar trigger slot |
| Menu | Button | button trigger slot |
| Menu | IconButton | icon trigger slot |
| PhoneInput | CountrySelector | country code selector slot |
| Popover | Button | popover action slot |
| Popover | Input | form field slot |
| QuickAction | Badge | counter badge slot |
| QuickAction | Spinner | loading indicator slot |
| RouteSummary | Button | route action slot |
| RouteSummary | IconButton | compact action slot |
| Table | Badge | cell status badge slot |
| Tabs | Badge | tab badge slot |
| Toast | Button | toast action slot |
| Toast | IconButton | dismiss control |
| TreeView | Button | node action slot |

