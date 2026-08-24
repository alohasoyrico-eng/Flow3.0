# Card Surface Taxonomy And Ownership

Scope: Flow3.0 design system source of truth only. FlowDocs is out of scope for this checkpoint except as a consumer later.

Goal: decide what is actually `Surface`, what is the base `Card` component, and what belongs to a Card-family pattern before changing visuals.

## Boundary Decision: Surface vs Card

Surface is the primitive owner for generic surface behavior: frame, padding, radius, elevation, tone, focus mode, density, and layout roles.

Card is a component owner for a discrete object/content unit that consumes surface primitives and adds card-specific anatomy/behavior: header, body, media, status, actions, selected/interactivity, and object-level states.

Card-family is not a component layer. It is a governance taxonomy for artifacts that share card-like visual language. A Card-family artifact may be a primitive, a base component, or a pattern depending on its semantic responsibility.

Patterns own card-like compositions when meaning depends on product context, expected data, slots, recovery states, workflow rules, or dashboard/payment/route semantics. A React export may still exist as an implementation helper, but its conceptual owner can be a pattern.

## Decision Rules

- Surface owns generic layout surfaces: canvas, section, panel, overlay, and inline grouped surfaces.
- Card must not be used as a generic panel just to obtain padding, radius, background, or depth.
- Card variants are object-card treatments only: `default`, `minimal`, `elevated`, `ghost`.
- Card states are object-card feedback/interaction only: `default`, `hover`, `focus`, `selected`, `loading`, `error`, `disabled`, `muted`, `interactive`.
- Card compositions are reusable object-card anatomy, not product-specific content or generic layout.
- Product/domain visuals must belong to Card-family patterns, not inflate base Card.
- Dashboard semantics must keep pattern ownership: metrics in `KpiCard`, charts in `Chart Wrapper`, route summaries in route/admin patterns, payment/fleet summaries in a payment/fleet card pattern.
- Component exports such as `CardSummary`, `KpiTile`, `ChartPanel`, and `RouteSummary` are implementation surface today; their conceptual classification must be checked against pattern criteria before visual remediation.
- Demos may use layout wrappers, but they must not redefine visual anatomy with flat/manual HTML when a governed Flow artifact should own it.
- If an existing artifact cannot express a reference visual correctly, fix that artifact or make an explicit artifact decision; do not patch the demo.

## Taxonomy Matrix

| Reference type | Evidence source | Visual markers to preserve | Conceptual classification | Implementation owner today | Status for checkpoint |
| --- | --- | --- | --- | --- | --- |
| Object card | `components/Card.jsx`, `docs/demos/card.html`, `components/card.json` | white/surface card, radius-lg, subtle border, rest shadow, 24px default padding, object/card anatomy | Component: `Card` | `Card` | Confirmed |
| Interactive card | `components/Card.jsx`, `contracts/card.json` | hover lift, float shadow, keyboard focus, selected affordance | Component state: `Card` | `Card` | Confirmed |
| Selected card | `docs/demos/card.html`, `contracts/card.json` | selected must not rely on color only | Component state: `Card` | `Card` | Confirmed |
| Elevated card | `docs/demos/cards-extended.html` | stronger border/accent and float depth | Component variant: `Card` | `Card` | Confirmed |
| Minimal card | `docs/demos/cards-extended.html` | lower depth/no heavy chrome, still readable as surface | Component variant: `Card` | `Card` | Confirmed |
| Ghost card | `components/Card.jsx`, `docs/demos/cards-extended.html` | translucent surface, blur, light border | Component variant: `Card` | `Card` | Confirmed |
| Media object card | `components/CardMedia.jsx`, `contracts/card-media.json` | stable image frame, cover image, text block below, inner radius smaller than outer radius | Component composition if generic object/media; pattern if product-specific content rules appear | `Card` composition `media` | Needs classification evidence |
| Compact object/list card | `docs/demos/cards-extended.html` | tighter padding, icon/label/badge row, no dashboard metric semantics | Component composition if it remains object/list anatomy | `Card` composition `compact` | Needs visual decision |
| Header actions object card | dashboard references | title/caption/header actions such as Menu/IconButton, content below | Component composition only when actions operate on one object; otherwise pattern header slot | `Card` `actionPlacement="header"` | Needs pattern boundary check |
| Table shell card | dashboard references | `Card padding={0}` shell with table surface inside; table visual remains governed by `Table` | Pattern/recipe: `Card` + `Table` | `Card` + `Table` | Confirmed as recipe, not Card variant |
| Empty-state card | `docs/cards/display.card.html`, dashboard references | Card as container; empty state owns illustration/text/action | Pattern/recipe: `Card` + `EmptyState` | `Card` + `EmptyState` | Confirmed recipe |
| Skeleton/loading card | `docs/cards/display.card.html`, dashboard references | placeholder anatomy; not only spinner overlay | Pattern/recipe: `Card` + `Skeleton` | `Card` + `Skeleton` | Confirmed recipe |
| KPI/stat card | `StatTile.jsx`, dashboard references, `patterns/kpi-card.json`, current `KpiTile.tsx` | overline, mono numeric value, delta/trend, optional sparkline/icon, loading/empty/error/stale/drill-in | Pattern: `KpiCard`; base metric visual may be implemented by `KpiTile` | `KpiTile` + `KpiCard` pattern exists | Confirmed pattern owner; `Card composition="stats"` is compatibility only |
| Mini metric card | `ui_kits/fleet-dashboard/index.html` | compact overline/value in side panels, density tighter than KPI row | Pattern variant under `KpiCard` if context/status/recovery applies; otherwise `KpiTile` density | `KpiTile` today | Needs density/semantic decision |
| Chart card | dashboard references, current `ChartPanel.tsx`, `patterns/chart-wrapper.json` | card shell, title/caption/action, chart body, loading/empty, dashboard spacing | Pattern: `Chart Wrapper`; chart frame may be implemented by `ChartPanel` | `ChartPanel` + `Chart Wrapper` pattern exists | Confirmed pattern owner; needs visual remediation |
| Payment/fleet card | `components/PaymentCard.jsx`, `contracts/payment-card.json`, current `CardSummary.tsx`, `templates/driver-card-wallet.json` | 1.586 ratio, payment visual language, last4, logo/contactless, frozen overlay, wallet/header context | Pattern: payment/fleet card summary; `CardSummary` may be implementation helper | `CardSummary` today | Needs pattern spec decision |
| Route/admin summary card | `route-summary.json`, station/fleet references | route/status metrics, station context, navigation/recovery affordances | Pattern when it coordinates route/admin context | `RouteSummary` today | Needs pattern spec decision |
| Card detail / wallet detail | `contracts/card-detail.json`, `templates/driver-card-wallet.json` | product flow with payment/fleet card, transaction rows, switch, bottom sheet, quick actions | Template/pattern, not Card | `DriverCardWallet` template + components | Confirmed non-Card |
| Aside/detail panel surface | dashboard references | page shell/side panel, border-left, large layout surface | Primitive: `Surface` | `Surface` | Confirmed non-Card |

## Ownership Debt To Resolve Before Implementation

- `Card composition="stats"` is compatibility only; KPI/stat composition belongs conceptually to the `KpiCard` pattern, with `KpiTile` as the metric visual implementation.
- Decide whether `Card` needs real children/slots to avoid visual demos building product anatomy with manual HTML outside Flow ownership.
- Decide whether `ChartPanel` should remain a public component API or become the implementation helper beneath the `Chart Wrapper` pattern.
- Decide whether `CardSummary` should remain a public component API or become the implementation helper beneath a payment/fleet card pattern.
- Decide whether media and compact cards are Card compositions or examples built from Card plus existing primitives.

## Checkpoint 5 Exit Criteria

- Every detected card-like reference is assigned to exactly one owner.
- No reference type remains as "just HTML in the demo".
- Any needed new variant/composition/artifact is justified by repeated evidence, not by one screen.
- Card implementation work is limited to the visual contract Card actually owns.
- KpiCard, Chart Wrapper, payment/fleet card summary, Surface, Table, Skeleton, and EmptyState debt is explicitly separated from Card debt.

## Iteration 6 Boundary Status

- Closed: Surface owns generic surface primitives and layout roles.
- Closed: Card owns object-card anatomy and behavior only.
- Open for Iteration 7: verify whether Card consumes Surface/foundation roles consistently without duplicating generic surface ownership.

## Iteration 7 Foundation Status

- Closed: Card should consume Surface/Foundation roles for frame, radius, depth, tone, focus, density, and state.
- Closed: Card may own object-card anatomy variables for header, body, media, status, actions, selected affordance, and interactive object behavior.
- Debt: Card's platform contract does not yet declare `surface` as a primitive dependency.
- Debt: Card's public purpose still reads too broadly and can be interpreted as generic grouping.
- Debt: Card state/tone variables duplicate Surface ideas without a documented mapping.
- Decision needed in Iteration 8: which Card compositions remain public after removing generic layout, KPI/stat, chart, and payment ownership from Card.

## Iteration 8 Final Card Scope

### Card Owns

- Base object card: a bounded object/content unit with title/body/detail/status/actions.
- Interactive object card: whole-card activation only when it has a stable `actionKey` and real action semantics.
- Selected object card: selection affordance for discrete objects, not generic highlighted panels.
- Elevated/minimal/ghost treatments: visual treatments for object cards only.
- Media composition: allowed only for generic object-card media anatomy: media frame plus governed body content.
- Compact composition: allowed only for dense object rows/cards, not KPI mini metrics.
- Header actions composition: allowed when actions operate on the object card and use governed Flow actions.

### Card Does Not Own

- Generic page sections, panels, grouped forms, settings groups, aside/detail panels, or overlays. Owner: `Surface`.
- KPI/stat/mini metric compositions. Owner: `KpiCard` pattern, with `KpiTile` as implementation only when needed.
- Chart panel compositions, chart headers, chart empty/loading/error states, and chart header actions. Owner: `Chart Wrapper` pattern, with `ChartPanel` as implementation only when needed.
- Payment/fleet card compositions. Owner: payment/fleet card pattern, with `CardSummary` as implementation only if it remains valuable.
- Table, empty, or skeleton internals. Owners: `Table`, `EmptyState`, `Skeleton`.
- Wallet/detail flows or card management screens. Owner: pattern/template.

### Public API Decision

- Keep variants: `default`, `minimal`, `elevated`, `ghost`.
- Keep compositions: `standard`, `compact`, `media`.
- Keep `stats` only as deprecated compatibility until a future breaking cleanup removes it.
- Do not add `dashboard`, `chart`, `metric`, `payment`, `panel`, or `surface` as Card variants/compositions.
- Do not add new foundations or primitives for Card; fix mappings to existing Surface/Foundation owners.

### Rejection Rules For Card Work

- Reject any Card change that makes Card a generic layout container.
- Reject any Card demo that builds missing Card anatomy with plain manual HTML instead of governed Flow artifacts.
- Reject any Card variant that duplicates a Card-family pattern or another governed Flow artifact.
- Reject visual parity changes that require raw values in demos or component CSS outside the token cascade.

## Iteration 9 Owner Remediation Boundary

Card work can resume only after the contract gate is updated. The owner order is:

1. `Card`: object-card anatomy and behavior.
2. `Surface`: generic structural surfaces.
3. `KpiCard`: metric/stat card pattern.
4. `Chart Wrapper`: chart card pattern.
5. Payment/fleet card pattern: payment card summaries.
6. Recipes: `Card` + `Table`, `Card` + `EmptyState`, `Card` + `Skeleton`.

Any issue discovered during Card remediation must be reassigned to the correct owner instead of patched in Card.

## Iteration 4 Surface Guard Status

- Closed: `Surface` remains the primitive owner for settings sections, grouped forms, page shells, panels, overlays, inline groups, and generic structural surfaces.
- Closed: `Card` contract now includes the explicit Surface ownership boundary instead of only the broad "do not use Card as panel" rule.
- Closed: the existing primitive Surface cascade report now counts structural Card context issues; it fails when a settings group Surface uses Card as its section/header structure.
- Closed: `Settings` no longer uses `Card` for each group header. The settings group is a `Surface`; its title/description are pattern anatomy.
- Still valid: a `Settings` summary may use `Card` only when it represents a discrete object/content summary, not the grouped form section itself.

## Iteration 5 Cascade Support Checkpoint

- Closed: base Card/Surface cascade gates pass without adding a new audit file.
- Closed: Card contract rejects generic structural surfaces and Card-family semantic owners.
- Closed: Surface audit detects structural Card context misuse in patterns.
- Closed: component visual cascade reports 60 passing components and 0 visual cascade debt after the Settings/Card boundary fix.
- Remaining work moves to owner-specific Card-family remediation: `KpiCard`, `Chart Wrapper`, payment/fleet card summary, and route/admin summary.

## Iteration 6 KpiCard/KpiTile Status

- Closed: `KpiCard` owns KPI/stat card pattern composition.
- Closed: `KpiTile` remains the metric visual implementation and is not replaced by `Card composition="stats"`.
- Closed: `KpiCard` root is now governed by `.kpi-card` CSS using Flow spacing/component tokens.
- Closed: `empty` and `permission-blocked` states render recovery/empty surfaces instead of showing a normal metric tile.
- Closed: local React runtime demo exists for interactive review.
- Remaining visual review: compare KPI row and mini metric references against `KpiCard`/`KpiTile` density, typography, icon scale, status placement, and dark mode.

## Iteration 7 ChartWrapper/ChartPanel Status

- Closed: `ChartWrapper` owns chart card pattern composition; `Card` remains out of chart/dashboard semantics.
- Closed: `ChartPanel` remains the chart visual implementation surface inside the pattern.
- Closed: `ChartWrapper` root is now governed by `.chart-wrapper` CSS using Flow spacing/component tokens.
- Closed: `permission-blocked` state resolves through the pattern state and renders `EmptyState` permission treatment instead of a chart panel.
- Closed: local React runtime demo exists for interactive review.
- Remaining visual review: compare dashboard chart references against `ChartWrapper`/`ChartPanel` density, title/value hierarchy, chart geometry, action placement, and dark mode.

## Iteration 8 Payment/Fleet And Route/Admin Status

- Closed: `CardSummary` remains the implementation owner for payment/fleet card summary visuals; `Card` must not add payment-card variants.
- Closed: `CardSummary` now masks any supplied card number to `**** last4`, preserving the payment-card safety rule from the reference contract.
- Closed: `CardSummary` frozen state now renders visible default text even when a consumer omits `status`.
- Closed: `RouteSummary` remains the implementation owner for route/admin summary visuals; `Card` must not add route/admin variants.
- Closed: local React runtime demos exist for `CardSummary` and `RouteSummary`.
- Remaining visual review: compare `CardSummary` against PaymentCard reference for ink/accent/sand treatment, ratio, chip/contactless scale, holder/number hierarchy, frost overlay, and dark mode. Compare `RouteSummary` against route/admin references for selected/warning contrast, metric hierarchy, compact geometry, and action placement.

## Iteration 9 Governed Recipe Status

- Closed: `Card + Table` is a recipe; `Card` owns the object frame while `Table` owns tabular data semantics.
- Closed: `Card + EmptyState` is a recipe; `EmptyState` owns recovery/empty anatomy and action.
- Closed: `Card + Skeleton` is a recipe; `Skeleton` owns loading placeholder anatomy.
- Closed: `Card` does not gain `table`, `empty`, or `skeleton` compositions.
- Closed: Card runtime demo now includes governed recipe examples using React components, not flat/manual HTML anatomy.
- Closed: `p2-surface-display` covers the three recipes and rejects new Card composition values for those cases.

## Iteration 10 Closure Status

- Closed: base `Card` scope is limited to object-card anatomy and behavior.
- Closed: `Surface` owns generic panels, sections, overlays, grouped forms, settings groups, and page shells.
- Closed: `KpiCard`, `Chart Wrapper`, payment/fleet card summary, and route/admin summary own their contextual card-like semantics outside base `Card`.
- Closed: `Card + Table`, `Card + EmptyState`, and `Card + Skeleton` remain governed recipes instead of new Card compositions.
- Closed: contract checks still allow `composition="stats"` only as deprecated compatibility; new KPI/stat work must use `KpiCard` with `KpiTile` where useful.
- Remaining work is visual/product review in each owner demo, not further Card taxonomy work.
