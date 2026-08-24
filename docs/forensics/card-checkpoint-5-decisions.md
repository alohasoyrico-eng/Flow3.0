# Card Checkpoint 5 Decisions

Scope: checkpoint after iterations 1-5 of Card visual remediation analysis, updated with implementation status from iterations 6-8.

## Decisions

### 1. Surface Owns Generic Surface; Card Owns Object-Card Anatomy

Surface should own:

- generic surface frame
- generic surface padding/radius/elevation/tone
- layout surface roles: canvas, section, panel, overlay, inline
- focus mode and density for structural surfaces

Card should own:

- object-card anatomy: header, body, media, status, actions
- object-card interactive behavior
- selected/error/disabled/loading visual state
- variants: `default`, `minimal`, `elevated`, `ghost`
- compositions only when the anatomy is generic: compact, media, header/actions
- density-driven padding/gap/type/icon adjustments
- governed examples for table shell, empty state shell, and skeleton shell

Card should not own generic layout surfaces, product-specific KPI, payment, chart, table, or page-panel semantics.

### 2. KpiCard Owns KPI/Stat Cards

KPI/stat dashboard cards belong conceptually to the `KpiCard` pattern. `KpiTile` is the current React implementation surface for the metric visual when that separation remains useful.

Required follow-up before calling KPI parity done:

- Align KpiTile frame to card-like surface intent where appropriate: radius, rest depth, hover depth, padding, density.
- Verify overline, mono numeral, delta, trend icon, and compact mini metric density against reference.
- Treat `Card composition="stats"` as compatibility only; new KPI/stat work belongs to the `KpiCard` pattern with `KpiTile` as implementation surface.

### 3. Chart Wrapper Owns Chart Cards

Chart card composition belongs to the `Chart Wrapper` pattern, not Card. `ChartPanel` may remain the implementation surface if its API can support the pattern contract without becoming a dashboard-specific component.

Required follow-up before calling chart dashboard parity done:

- Align ChartPanel frame to card-like panel intent where appropriate.
- Add or expose a governed header action slot if dashboard parity needs Menu/IconButton in panel headers.
- Cover loading, empty, disabled, warning/error, dark mode, and density without local wrappers.

### 4. Payment/Fleet Pattern Owns Payment Card Visuals

Payment card is not a Card variant.

Required follow-up:

- Compare CardSummary against PaymentCard reference: 1.586 ratio, ink/accent/sand tone language, chip/contactless/logo, last4, holder, expiry, frozen overlay.
- Decide whether existing `physical | virtual | compact | limit` variants are enough for `CardSummary` as implementation, or whether a payment/fleet card pattern must own the public semantics.

### 5. Surface Owns Generic Layout Surfaces

Aside/detail panels, grouped forms, settings sections, non-object page surfaces, and generic grouped containers belong to `Surface`.

Rule: do not wrap arbitrary groups in Card just to get padding, radius, background, or depth. Use Card only when the surface represents a discrete object/content unit.

### 6. Table, EmptyState, And Skeleton Stay As Owners

- Table shell card is `Card` + `Table`, with a governed nested-table frame reset if needed.
- Empty-state card is `Card` + `EmptyState`.
- Skeleton card is `Card` + `Skeleton`.

These are composition recipes, not new Card variants.

## Implementation Guardrails For The Next Phase

- Do not add new foundations for Card unless a gap is proven after consuming existing frame/depth/voice/icon/momentum tokens.
- Do not add local CSS values to Card demos to force parity.
- Do not create another card-like component unless it has repeated evidence and unique semantics.
- Do not keep duplicate public concepts if one owner can cover the behavior cleanly.
- Do not proceed component-by-component without updating this decision set when ownership changes.

## Recommended Execution After Checkpoint

1. Remediate Card base frame and variants:
   - hover shadow should consume card hover depth
   - visual density should align to existing card padding and type roles
   - media/compact should be measured against reference

2. Decide Card slots/children:
   - Status: done for base Card.
   - Card now accepts `children` and preserves governed header/status/actions when provided.
   - Runtime demo covers custom container content and interactive custom content.

3. Resolve KPI ownership:
   - Move KPI visual parity into the `KpiCard` pattern.
   - Keep `KpiTile` as the metric visual implementation surface only when useful.
   - Status: decided for Card.
   - `Card composition="stats"` remains compatibility only.
   - New KPI/stat semantics belong to `KpiCard`.

4. Resolve Chart Wrapper ownership:
   - Align chart wrapper surface visuals.
   - Decide whether `ChartPanel` remains public implementation API or becomes pattern helper.
   - Add governed header actions if needed.
   - Status: `ChartWrapper` is now a governed pattern root and keeps chart card semantics outside `Card`.
   - `ChartPanel` remains the chart visual implementation surface inside the pattern.
   - `permission-blocked` renders `EmptyState` permission treatment instead of a normal chart.
   - Runtime demo exists for interactive review.

5. Resolve payment/fleet card ownership:
   - Audit `CardSummary` against PaymentCard reference before changing Card.
   - Decide whether public ownership is a payment/fleet pattern with `CardSummary` as implementation.
   - Status: `CardSummary` remains the payment/fleet summary implementation owner; `Card` does not gain payment variants.
   - `CardSummary` now enforces masked card numbers and visible frozen-state text.
   - Runtime demo exists for interactive review.

6. Resolve route/admin summary ownership:
   - Status: `RouteSummary` remains the route/admin summary implementation owner; `Card` does not gain route/admin variants.
   - Runtime demo exists for interactive review.

7. Resolve governed recipes:
   - Status: `Card + Table`, `Card + EmptyState`, and `Card + Skeleton` are recipes, not Card compositions.
   - Card runtime demo uses real Flow React components for these recipes.
   - P2 surface/display tests cover the recipes and reject new `table`, `empty`, or `skeleton` Card composition values.

## Checkpoint Result

The analysis supports continuing, but not with "Card fixes everything".

Card remediation is viable if it is scoped to object-card anatomy/behavior and paired with Surface/foundation review plus Card-family pattern remediation for KpiCard, Chart Wrapper, payment/fleet card summary, and route/admin summary.

## Iteration 6 Boundary Decision

- `Surface` is the primitive owner for generic surface behavior.
- `Card` consumes Surface/foundation roles but does not replace `Surface`.
- Card should be used for a discrete object/content unit: summary, media item, selectable object, action-bearing content block.
- Surface should be used for layout panels, page regions, settings sections, grouped forms, overlays, and non-object containers.
- Next checkpoint must audit whether Card's CSS/API consumes surface foundations consistently or duplicates them with Card-only semantics.

## Implementation Evidence

- `Card` now supports optional `children` and optional `title`.
- Custom content can be interactive with `actionKey`, click, Enter, and Space.
- Custom content can coexist with governed header/status/actions.
- Component contract now lists `children`, optional `title`, and keyboard-aware `onAction`.
- Selected Card no longer changes border width, avoiding layout shift.
- Minimal Card no longer uses `display: contents`, preserving component anatomy.
- Runtime demo no longer promotes `stats` as a normal Card composition; it appears only under legacy compatibility.
- Card CSS contract now blocks `display: contents` in minimal Card and selected-state border-width shifts.
- P2 surface/display tests cover compact Card with nested action and media Card with custom body content.
- Local runtime demo regenerated: `card-react-runtime-5`.
- Playwright runtime check passed: 23 Cards, 2 media Cards, 1 legacy stats Card, no console warnings.
- Validation passed: `npm run build:react`, `npm run typecheck`, `npm run test:react:fast`, `node packages/react/test/p2-surface-display.test.mjs`, `node packages/audit/scripts/audit-card-css-contract.js`, `node packages/audit/scripts/audit-card-summary-css-contract.js`.

## Iteration 7 Chart Wrapper Decision

- `ChartWrapper` owns chart card pattern composition.
- `ChartPanel` remains an implementation surface for the chart visual itself.
- `Card` must not gain chart, dashboard, metric, or panel variants to support chart screens.
- `ChartWrapper` now exposes a governed `.chart-wrapper` root and composes `Surface`, `KpiTile`, `Badge`, `Button`, `Menu`, `Skeleton`, `EmptyState`, `ErrorPanel`, `ChartPanel`, `Table`, and `List`.
- `permission-blocked` state is resolved from the final pattern state and renders permission recovery instead of a chart.
- Local runtime demo: `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/chart-wrapper-2026-08-24/interactive/react-runtime.html`.

## Iteration 8 Domain Summary Decision

- `CardSummary` owns payment/fleet card summary visuals; it is not a generic `Card` variant.
- `RouteSummary` owns route/admin summary visuals; it is not a generic `Card` variant.
- Payment-card safety belongs in `CardSummary`: any supplied number is rendered as `**** last4`.
- Frozen state must include visible text even when status is omitted.
- Local runtime demos:
  - `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-summary-2026-08-24/interactive/react-runtime.html`
  - `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/route-summary-2026-08-24/interactive/react-runtime.html`

## Iteration 9 Recipe Decision

- `Card + Table` is a governed recipe: Card frames the object/container, Table owns rows, columns, captions, density, and table semantics.
- `Card + EmptyState` is a governed recipe: Card frames the object/container, EmptyState owns empty/recovery anatomy and action.
- `Card + Skeleton` is a governed recipe: Card frames the object/container, Skeleton owns loading anatomy.
- Do not add `table`, `empty`, or `skeleton` to Card `composition`.
- Do not build these examples with manual HTML inside demos when governed React components are available.
- Local runtime demo updated: `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-2026-08-20/interactive/react-runtime.html`.

## Iteration 7 Foundation Decision

Card is not hardcoding visual values directly, but its governance contract is incomplete.

Required contract changes before implementation continues:

- Add `surface` as a declared primitive dependency for Card, because Card consumes surface frame/radius/depth/tone semantics for object-card surfaces.
- Update Card purpose from generic grouping/product summary to discrete object-card anatomy.
- Mark generic layout containers as a rejection rule in Card contract, not just in forensic notes.
- Keep Card object anatomy variables, but map frame/radius/depth/background/state variables to Surface/Foundation ownership.
- Keep `composition="stats"` as deprecated compatibility only; do not expand it.

Decision: the next iteration must finalize Card scope before any new visual work, otherwise Card will keep absorbing KPI, chart, payment, and layout-surface problems.

## Iteration 8 Scope Decision

Card implementation work is now limited to object-card anatomy and behavior.

Approved Card scope:

- base object card
- interactive object card
- selected object card
- elevated/minimal/ghost object-card treatments
- media object-card composition
- compact object-card composition
- header actions that operate on the card object

Excluded from Card scope:

- generic layout surfaces: `Surface`
- KPI/stat/mini metric cards: `KpiCard` pattern with `KpiTile` as implementation surface
- chart cards and chart panel headers/actions: `Chart Wrapper` pattern with `ChartPanel` as implementation surface
- payment card visuals: payment/fleet card pattern with `CardSummary` as implementation surface if it remains valuable
- table/empty/skeleton internals: `Table`, `EmptyState`, `Skeleton`
- product flows/card detail/wallet screens: pattern/template

API decision:

- Keep `standard`, `compact`, and `media` as Card compositions.
- Keep `stats` deprecated and compatibility-only.
- Do not add dashboard/chart/metric/payment/panel/surface variants to Card.

## Iteration 9 Remediation Plan By Owner

### Gate Before More Visual Work

Before changing visuals, update the source contracts so future work cannot re-expand Card:

- Card contract declares `surface` primitive dependency.
- Card purpose says object-card, not generic grouping.
- Card accessibility/usage notes reject Card as generic layout panel.
- Card docs/forensics keep `stats` deprecated and compatibility-only.

### Owner Workstreams

| Owner | Remediation scope | Validation |
| --- | --- | --- |
| `Card` | Object-card base, selected, interactive, density, media, compact, header/actions. Map frame/radius/depth/state to Surface/Foundation roles. | Card CSS contract, React tests, runtime demo with light/dark/density/states. |
| `Surface` | Ensure generic panel/section/overlay/inline roles cover layout surfaces that were being pushed into Card. | Surface primitive contract and rejection rule against Card-as-panel. |
| `KpiCard` pattern + `KpiTile` implementation | Align KPI/stat/mini metric frame, radius, depth, padding, typography, icon scale, hover/selected/disabled/dark. | KpiCard pattern contract, KpiTile runtime demo and component tests; no Card stats expansion. |
| `Chart Wrapper` pattern + `ChartPanel` implementation | Align chart card frame and add/verify governed header action slot, loading/empty/error/dark/density. | Chart Wrapper pattern contract, ChartPanel runtime demo and interaction tests for action slot. |
| Payment/fleet card pattern + `CardSummary` implementation | Compare payment visual contract: 1.586 ratio, ink/accent/sand mapping, chip/contactless/logo/last4/frozen. | Payment/fleet pattern decision, CardSummary runtime demo and visual/accessibility checks. |
| Recipes | Table shell, EmptyState shell, Skeleton shell. Keep internals owned by their components. | Runtime recipe demos without manual visual wrappers. |

### Estimated Implementation Iterations

This replanteamiento adds implementation work, but it prevents Card from becoming a dumping ground.

1. Card contract/foundation mapping gate.
2. Card base/interactive/selected/density visual remediation.
3. Card media/compact/header-actions remediation.
4. Surface rejection/generic surface guard for Card-as-panel.
5. KpiCard pattern plus KpiTile frame/density/type/icon remediation.
6. Chart Wrapper pattern plus ChartPanel frame/header-action/state remediation.
7. Payment/fleet card pattern plus CardSummary ownership decision and remediation.
8. Recipe demos for Table, EmptyState, Skeleton using governed owners.
9. Consolidated runtime demo QA for Card family owners.
10. Final audit/cleanup/commit checkpoint.

Minimum: 8 implementation iterations if the KpiCard, Chart Wrapper, and payment/fleet pattern implementation surfaces are already close.

Likely: 10 implementation iterations because each Card-family pattern or recipe needs its own runtime demo and validation.

Do not continue with Card-only fixes if the issue belongs to `Surface`, `KpiCard`, `Chart Wrapper`, payment/fleet card summary, or route/admin summary.

## Implementation Iteration 1 Status

Closed contract gate:

- Card contract purpose now defines Card as a discrete object-card, not a generic grouping surface.
- Card contract explicitly rejects generic layout panels, grouped forms, overlays, and page sections; those belong to `Surface`.
- Card contract explicitly rejects KPI/stat, chart panel, and payment-card semantics; those belong to Card-family patterns, not base Card.
- Card platform contract now declares `surface` as a primitive dependency and `surface.*` as token dependency.
- Versioned TS/JS contract sources are aligned for Card `children`, optional `title`, and keyboard-aware `onAction`.
- Card CSS contract audit now fails if the object-card purpose, Surface dependency, or Card-family rejection rules disappear.

Validation:

- `node packages/audit/scripts/audit-component-css-contracts.js`
- `npm run typecheck`

Next implementation iteration:

- Card-only remediation: base object-card frame/state/density selected affordance, without absorbing Surface or Card-family pattern work.

## Implementation Iteration 2 Status

Closed Card-only frame/state gate:

- Card now maps object-card surface aliases through Surface/Foundation-owned roles before consuming Card aliases.
- Card background and radius consume mapped surface aliases instead of behaving like an unrelated surface cascade.
- Selected Card now includes an inset structural indicator through `--comp-card-selected-indicator`, so selected affordance is not only a background/border color change.
- Selected state still avoids border-width changes, so it does not cause layout shift.
- Card CSS contract now fails if mapped surface aliases or selected structural indicator are removed.
- Local Card runtime demo regenerated with build id `card-react-runtime-6`.

Validation:

- `node packages/audit/scripts/audit-component-css-contracts.js`
- `node packages/react/test/p2-surface-display.test.mjs`
- `npm run typecheck`

Demo:

- `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-2026-08-20/interactive/react-runtime.html`

Next implementation iteration:

- Card media/compact/header-actions review and remediation, still limited to object-card anatomy.

## Implementation Iteration 3 Status

Closed Card media/compact/header-actions gate:

- Card now exposes `actionPlacement?: "footer" | "header"` so header actions are governed Card anatomy instead of demo/consumer layout.
- Header actions render inside `.card__header` with `.card__actions[data-placement="header"]`.
- Footer actions remain the default, preserving existing behavior.
- Card root exposes `data-action-placement` when actions exist, making runtime/audit checks possible.
- React tests verify header actions render once, live inside the header, remain clickable, and do not duplicate as footer actions.
- Card contract now lists `actionPlacement`.
- Card CSS contract now fails if the governed header-action placement rule disappears.
- Local Card runtime demo regenerated with build id `card-react-runtime-7` and includes a Header actions card.

Validation:

- `npm run build:react`
- `npm run typecheck`
- `node packages/audit/scripts/audit-component-css-contracts.js`
- `node packages/react/test/p2-surface-display.test.mjs`

Demo:

- `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-2026-08-20/interactive/react-runtime.html`

Next implementation iteration:

- Surface guard: prevent Card-as-panel usage in contracts/audits and prepare Card-family pattern handoff for `KpiCard`, `Chart Wrapper`, payment/fleet card summary, and route/admin summary.

Iteration 4 result:

- `Surface` owns canvas, section, panel, overlay, inline groups, settings sections, grouped forms, and page shells.
- `Card` is limited to object-card anatomy and may not act as a settings/grouped-form header just to obtain card styling.
- `Settings` group headers were moved out of `Card` and into pattern anatomy inside a `Surface`.
- `report-primitive-surface-cascade.js` now detects this structural Card misuse without creating a new audit file.

Iteration 5 checkpoint:

- Component visual cascade gate is green: 60 components pass, 0 review, 0 fail, `visualCascadeDebt: 0`.
- Primitive Surface cascade gate is green: 0 missing roles/states/API mappings, 0 raw Surface CSS, 0 structural Card context issues.
- Card CSS contract gate is green for base object-card aliases, selected affordance, media/compact aliases, header actions, Surface dependency, and Card-family rejection rules.
- This closes the base cascade support checkpoint for Card and Surface.
- This does not close Card-family visual parity for `KpiCard`, `Chart Wrapper`, payment/fleet card summaries, or route/admin summaries; those remain later owner-specific remediation, not base Card work.

Iteration 6 result:

- `KpiCard` now has a governed pattern root class (`kpi-card`) and pattern-level spacing/layout CSS.
- `KpiCard` no longer treats `empty` or `permission-blocked` as ordinary metric render states when a value happens to exist.
- `KpiCard` uses `KpiTile` only for metric display states; loading, error, empty, and permission states route through `Skeleton`, `ErrorPanel`, and `EmptyState`.
- `KpiTile` remains the metric visual implementation; `Card composition="stats"` remains compatibility only.
- Local React runtime demo added for review: `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/kpi-card-2026-08-24/interactive/react-runtime.html`.

Iteration 7 result:

- `ChartWrapper` owns chart-card pattern composition and keeps chart/dashboard semantics outside base `Card`.
- `ChartPanel` remains the chart visual implementation surface inside the pattern.
- `ChartWrapper` exposes a governed `.chart-wrapper` root and pattern-level layout CSS.
- `permission-blocked` resolves through the final pattern state and renders permission recovery instead of a normal chart.
- Local React runtime demo added for review: `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/chart-wrapper-2026-08-24/interactive/react-runtime.html`.

Iteration 8 result:

- `CardSummary` remains the payment/fleet card summary implementation owner; base `Card` does not gain payment variants.
- `CardSummary` masks any supplied number to `**** last4`, preserving the payment-card safety rule.
- `CardSummary` frozen state renders visible default status text when the consumer omits `status`.
- `RouteSummary` remains the route/admin summary implementation owner; base `Card` does not gain route/admin variants.
- Local React runtime demos added for review:
  - `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/card-summary-2026-08-24/interactive/react-runtime.html`
  - `/Users/r1c0/Documents/Un DS/local-visual-snapshots/Flow3-component-qa/route-summary-2026-08-24/interactive/react-runtime.html`

Iteration 9 result:

- `Card + Table`, `Card + EmptyState`, and `Card + Skeleton` are governed recipes.
- `Table`, `EmptyState`, and `Skeleton` own their internal semantics, states, and anatomy.
- `Card` did not gain `table`, `empty`, or `skeleton` compositions.
- The Card runtime demo uses React components for those recipes instead of manual HTML.
- `p2-surface-display` covers all three recipes and rejects those composition values in base `Card`.

Iteration 10 closure:

- Base `Card` remediation is closed at the taxonomy/contract level.
- `Surface` remains the primitive owner for generic surfaces.
- Contextual card-like owners are explicitly outside base `Card`: `KpiCard`, `Chart Wrapper`, payment/fleet summary, route/admin summary, and governed recipes.
- Remaining work is owner-specific visual/product review through runtime demos, not more Card scope expansion.
