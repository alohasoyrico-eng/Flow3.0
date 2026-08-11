# Configuration Console Template Deep Dive

Status: **first runtime slice implemented**

This audit treats `configuration-console` as the first template migration candidate because it covers the widest combined surface across foundations, primitives, components, and patterns.

## Selection

| Template | Foundations | Primitives | Direct patterns | Transitive patterns | Components | Total surface |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| configuration-console | 11 | 20 | 5 | 12 | 31 | 79 |
| fleet-manager-desktop | 11 | 19 | 3 | 9 | 23 | 65 |
| fleet-dashboard-suite | 11 | 19 | 2 | 8 | 19 | 59 |
| driver-mobile-app | 8 | 20 | 2 | 4 | 19 | 53 |
| routes-and-stations | 8 | 17 | 1 | 2 | 10 | 38 |
| driver-card-wallet | 8 | 10 | 0 | 0 | 0 | 18 |

## Template Contract

Source: `packages/specs/specs/unison-system/artifacts/templates/configuration-console.json`

Direct foundations:

| Foundation | Declared directly | Reached transitively |
| --- | --- | --- |
| Accessibility | yes | yes |
| Depth | yes | yes |
| Energy | yes | yes |
| Frame | yes | yes |
| Momentum | yes | yes |
| State | yes | yes |
| Tone | yes | yes |
| Voice | yes | yes |
| Growth | no | via Topbar, Sidebar |
| Iconography | no | via Topbar, Sidebar |
| Symbol | no | via Topbar, Sidebar |

Direct primitives:

| Primitive | Declared directly | Reached transitively | Notes |
| --- | --- | --- | --- |
| Surface | yes | yes | Required for template-level structural grouping and cascade ownership. |
| Density | yes | yes | Required because the template declares Laptop/Desktop density context. |
| Color | yes | yes | Required by all direct patterns. |
| Typography | yes | yes | Required by all direct patterns. |
| Spacing | yes | yes | Required by all direct patterns. |
| Iconography | yes | yes | Required by shell and admin actions. |
| Focus | yes | yes | Required by shell, forms, tables, dialogs, menus. |
| Loading | yes | yes | Required by loading and async states. |
| Disabled | yes | yes | Required by permission and disabled states. |
| Breakpoints | yes | yes | Required by desktop shell and responsive overlays. |
| Charts | yes | yes | Declared directly, but not consumed by direct pattern dependencies today. Needs review. |
| Duration | no | yes | Introduced by patterns. |
| Elevation | no | yes | Introduced by patterns and overlays. |
| Field Action | no | yes | Introduced by Topbar, Toolbar, auth/settings paths. |
| Measurement | no | yes | Introduced by patterns. |
| Message | no | yes | Introduced by validation/recovery patterns. |
| Motion Curves | no | yes | Introduced by interactive patterns. |
| Radius | no | yes | Introduced by patterns. |
| Research | no | yes | Introduced by Topbar/Sidebar. |
| Country Flags | no | yes | Introduced by authentication flow. |

Template tokens are now explicit for template-owned cascade: `sys.energy.*`, `sys.voice.*`, `sys.frame.*`, `sys.depth.*`, `sys.state.*`, `sys.tone.*`, `sys.accessibility.*`, `sys.momentum.*`, `surface.*`, `sys.charts.*`.

## Direct Pattern Dependencies

| Pattern | React source | Types | Export | `data-flow-pattern` | Surface contract | Imports Surface | Components |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Topbar | yes | yes | yes | yes | no | no | Avatar, Badge, Drawer, Icon Button, Input, Menu |
| Sidebar | yes | yes | yes | yes | yes | yes | Accordion, Badge, Breadcrumbs, Drawer, Icon Button |
| Roles and Permissions | yes | yes | yes | yes | no | no | Audit Event, Badge, Button, Checkbox, Dialog, Inline Validation, Switch, Table, Toast, Tooltip |
| Driver and Vehicle Administration | yes | yes | yes | yes | yes | yes | Audit Event, Avatar, Badge, Button, Card Summary, Dialog, Empty State, Pagination, Quick Action, Table, Toast |
| Authentication, Login, Biometrics and OTP | yes | yes | yes | yes | yes | yes | Biometric Prompt, Button, Code Input, Error Panel, Inline Validation, Input, Phone Input, Toast |

## Transitive Pattern Dependencies

| Pattern | Reached from | React source | Surface declared | Imports Surface | Risk |
| --- | --- | --- | --- | --- | --- |
| Autocomplete | Topbar | yes | no | no | Lower risk, component-scoped. |
| Avatar Menu | Topbar | yes | no | no | Lower risk, Menu owns overlay semantics. |
| Command Palette | Topbar | yes | yes | no | Risk: declares Surface but currently delegates overlay structure to Dialog/Input/Menu without direct Surface. Needs classification: either add Surface runtime or remove Surface from contract if Dialog fully owns it. |
| Notification Panel | Topbar | yes | yes | no | Risk: declares Surface but currently delegates to Drawer/List/Button without direct Surface. Needs classification. |
| Search | Topbar, Toolbar, Command Palette | yes | no | no | Key anti-duplication risk: topbar search must route to Search pattern, not invent local behavior. |
| Settings | Topbar, Avatar Menu | yes | yes | yes | Uses Card twice; must confirm Card is object content, not structural grouping. |
| Toolbar | Driver and Vehicle Administration | yes | no | no | Local action bar, should stay pattern-owned. |
| Sidebar | Topbar | yes | yes | yes | Creates Topbar/Sidebar cycle; allowed only as trigger boundary, not mutual behavior ownership. |
| Topbar | Sidebar, Toolbar, Command Palette, Notification Panel | yes | no | no | Creates shell trigger cycles; must be represented as boundary triggers, not rendered recursively. |

## Component Surface

Unique components touched by the template dependency graph:

Accordion, Audit Event, Avatar, Badge, Biometric Prompt, Breadcrumbs, Button, Card, Card Summary, Checkbox, Chip, Code Input, Combobox, Dialog, Drawer, Empty State, Error Panel, Icon Button, Inline Validation, Input, List, Menu, Pagination, Phone Input, Quick Action, Select, Skeleton, Switch, Table, Toast, Tooltip.

Important distinction:

- `Surface` owns structural grouping, panel, section, and canvas cascade.
- `Card` is permitted only for object content. The `Settings` transitive pattern currently uses Card twice and needs manual review before template promotion.
- `Dialog`, `Drawer`, `Menu`, and `Popover`-style owners keep overlay semantics. Templates must not implement overlay shells directly.

## Critical Findings

1. A formal React template runtime layer now exists for the first template.
   `packages/react/src/templates/ConfigurationConsole.js` exports a typed `ConfigurationConsole` template root with `Surface` ownership, `forwardRef`, controlled/uncontrolled shell state, governed slots, and package subpath exports.

2. The current template cascade is runtime-proven for `configuration-console`, not yet for all templates.
   `template-cascade-governance-audit` now requires the `configuration-console` runtime and reports five remaining templates as runtime backlog.

3. Shell pattern cycles must be modeled as boundary triggers.
   Topbar references Sidebar/Search/Command Palette/Notification Panel/Settings, and several of those reference Topbar. That is acceptable only if the React template composes a shell boundary and passes trigger props; it must not recursively render owned internals.

4. Surface declaration is now correct at template level, but transitive Surface debt remains classification-sensitive.
   Command Palette and Notification Panel declare Surface in their formal pattern contracts but do not import the Surface runtime. Either their contract is too broad, or their React implementation is not yet proving direct surface cascade.

5. Configuration Console declares Charts directly, but the direct pattern graph does not currently consume chart behavior.
   This may be legitimate if audit views include dashboard panels later. For the first React template slice, Charts should be excluded unless an actual chart module is rendered.

6. The template has product modules but no module-to-pattern slot contract.
   `Permission matrix`, `Driver lifecycle table`, `Vehicle lifecycle table`, and `Audit trail` are named modules, but there is no typed slot map that says which pattern owns each module and what state/data each receives.

## Migration Plan

### Phase 1: Template Runtime Contract

Create `packages/react/src/templates/ConfigurationConsole.js` and `.d.ts`.

Required contract:

| Area | Requirement |
| --- | --- |
| Root | `forwardRef`, `data-flow-template="configuration-console"`, `data-flow-primitive="surface"` via Surface root |
| Props | `density`, `state`, `tone`, `permissions`, `modules`, `topbar`, `sidebar`, `roles`, `administration`, `auth`, callbacks |
| Controlled state | Shell open/closed, selected route/module, permission mutation handoff, lifecycle action handoff |
| Uncontrolled fallback | Safe defaults for selected module and shell state |
| Accessibility | Template `role`, label, busy/error/permission/offline state mapping |
| Cascade | Root Surface passes density/theme/state down; child patterns do not invent structural wrappers |
| Exports | root package export, pattern/template subpath export, dist artifacts |

### Phase 2: Slot Map

Define a template slot map before implementation grows:

| Template module | Owning pattern | Notes |
| --- | --- | --- |
| Permission matrix | Roles and Permissions | Pattern owns table, dialogs, dependency warnings. |
| Driver lifecycle table | Driver and Vehicle Administration | Pattern owns table, row actions, dialogs, pagination. |
| Vehicle lifecycle table | Driver and Vehicle Administration | Same pattern, different dataset/labels. |
| Audit trail | Roles and Permissions or Driver and Vehicle Administration | Needs ownership decision; do not create a local audit list in template. |
| Global shell | Topbar + Sidebar | Template owns placement and route inventory only. |
| Authentication gate | Authentication, Login, Biometrics and OTP | Template owns when auth is required, pattern owns auth behavior. |

### Phase 3: Cascade Proof

Add a runtime audit that renders the template, not Docs:

| Check | Expected |
| --- | --- |
| Template root | `data-flow-template="configuration-console"` |
| Surface root | direct `Surface` with `data-flow-primitive="surface"` |
| Density propagation | root density reaches Topbar, Sidebar, Roles, Administration, Auth |
| State propagation | loading, empty, error, permission, offline map into pattern states |
| No DOM vanilla parallel | no local `document.createElement`, no ad hoc overlay DOM |
| No fake components | Button/Dialog/Drawer/Menu/Card come from Flow React exports |
| No Card-as-layout | Card only appears inside object content patterns |

### Phase 4: Cycle Governance

Convert shell cycles into explicit boundary props:

| Cycle | Allowed form | Disallowed form |
| --- | --- | --- |
| Topbar -> Sidebar -> Topbar | route trigger and drawer open callback | nested Topbar render inside Sidebar |
| Topbar -> Search -> Command Palette -> Topbar | query/command handoff | parallel search UI in template |
| Toolbar -> Search -> Topbar | local search callback | global shell search duplicated in toolbar |

### Phase 5: Promote to Template Family

After `ConfigurationConsole` passes:

1. Extract shared template helpers only if repeated by a second template.
2. Migrate `fleet-manager-desktop` next because it shares Topbar, Sidebar, Roles and Permissions.
3. Migrate `driver-mobile-app` third because it tests mobile Surface/Maps/Auth/Station Discovery.
4. Leave `driver-card-wallet` until modules gain real pattern dependencies.

## Immediate Next Gate

The next audit should fail when a required React template runtime regresses:

- `templatesWithoutReactRuntime`
- `templatesWithoutSurfaceRoot`
- `templatesWithoutTypedSlotMap`
- `templatesWithUnclassifiedModules`
- `templatePatternCycleBoundaryDebt`
- `templateCascadeRuntimeDebt`

This avoids repeating the components/patterns mistake: a template is not migrated because docs render something, and not even because all child patterns exist. It is migrated only when Flow exports a typed React template root that proves the cascade through foundations, primitives, components, and patterns.
