# Card Flow Coverage Map

Scope: map card-like reference visuals to Flow conceptual owners and current React implementation artifacts. Analysis only.

Card-family is a governance taxonomy, not a component family. `Surface` owns primitive surface behavior, `Card` owns the generic object-card component, and patterns own product/context card compositions. Existing React exports can remain as implementation helpers while their conceptual ownership moves to patterns.

## Coverage Summary

| Reference need | Conceptual owner | Current implementation surface | Coverage | Reason |
| --- | --- | --- | --- |
| Object card surface | Component: `Card` consuming `Surface` | `Card` | Improved | Variant names exist, surface radius is correct, and Card now accepts governed `children` without requiring generated anatomy. This is object-card behavior, not generic layout Surface ownership. |
| Interactive Card | Component state: `Card` | `Card` | Improved | Click, Enter, Space, disabled gating, and custom children are covered by React runtime tests; visual selected affordance still needs review. |
| Selected Card | Component state: `Card` | `Card` | Partial | Selected state exists, but selected affordance must be visually checked against non-color-only contract. |
| Elevated Card | Component variant: `Card` | `Card` | Partial | Elevated variant exists and uses hover depth, but reference expects stronger/accent border behavior. |
| Minimal Card | Component variant: `Card` | `Card` | Partial | Minimal variant exists, but current CSS changes anatomy with `display: contents`; needs visual review. |
| Ghost Card | Component variant: `Card` | `Card` | Partial | Ghost variant exists with blur/translucency; needs dark/context contrast review. |
| Media Card | Component composition if generic; pattern if content rules become contextual | `Card` composition `media` | Partial | Composition exists, but API is `media` URL plus fixed anatomy; reference CardMedia is a distinct children-style visual with image + title + description. |
| Compact list card | Component composition if object/list anatomy stays generic | `Card` composition `compact` | Partial | Composition exists, but must be measured against reference 10px padding, icon 20px, label 13.5px, Badge alignment. |
| KPI/stat card | Pattern: `KpiCard` | `KpiTile` + `KpiCard` pattern | Partial | `patterns/kpi-card.json` already owns metric context, status, recovery, drill-in, and comparison behavior; `KpiTile` is the base visual implementation. |
| Card stats composition | Deprecated compatibility only | `Card composition="stats"` | Legacy compatibility | Duplicates KPI semantics; keep only for compatibility while new KPI/stat work uses `KpiCard` + `KpiTile`. |
| Mini metric card | Pattern variant under `KpiCard` or `KpiTile` density if purely atomic | `KpiTile` today | Unknown | Need to decide whether compact metrics carry dashboard context/recovery; if yes, pattern, if not, density variant. |
| Chart card | Pattern: `Chart Wrapper` | `ChartPanel` + `Chart Wrapper` pattern | Partial | `patterns/chart-wrapper.json` owns chart context and composition; `ChartPanel` currently carries component implementation and needs header action/card-surface parity. |
| Table shell card | Pattern/recipe | `Card` + `Table` | Partial | Both owners exist, but nested Table needs a governed border/shadow reset contract, not ad hoc local styles. |
| Empty-state card | Pattern/recipe | `Card` + `EmptyState` | Covered composition | EmptyState owns content and Card owns shell; needs demo composition, not new component. |
| Skeleton card | Pattern/recipe | `Card` + `Skeleton` | Covered composition | Skeleton has card/media/chart/table variants; Card can wrap it as a loading composition. |
| Header actions card | Component composition only for object actions; otherwise pattern slot | `Card` + Flow actions, or `ChartPanel`/pattern implementation | Improved | Card keeps governed header/status/actions for object cards; dashboards need pattern-owned header action slots. |
| Payment/fleet card | Pattern candidate: payment/fleet card summary | `CardSummary` today | Partial | Ratio and frozen state exist, but variants do not match reference `ink/accent/sand`; likely pattern ownership with `CardSummary` as implementation helper. |
| Route/admin summary card | Pattern candidate: route/admin summary | `RouteSummary` today | Partial | Existing component may implement the view, but route/station meaning, status, and navigation affordances point to pattern ownership. |
| Aside/detail panel surface | Primitive: `Surface` | `Surface` | Covered primitive | Surface has roles/elevation/tone/density and is the right owner for grouped layout surfaces and non-object containers. |

## Component API Notes

### Card

Current API accepts either generated fields (`title`, `value`, `detail`, `status`, `icon`, `media`, `actions`) or custom `children`.

Boundary: Card owns object-card anatomy and whole-card behavior. It should consume Surface/foundation roles but not replace the Surface primitive for generic panels.

Remaining risk: media/table/dashboard recipes still need visual review against the reference; KPI/stat work is explicitly moved to the `KpiCard` pattern with `KpiTile` as implementation surface.

### KpiCard / KpiTile

`KpiCard` is the conceptual pattern owner when a metric needs context, status, loading, empty, error, stale, permission, drill-in, or comparison rules.

`KpiTile` is the current React implementation surface for the metric visual: label, value, delta, trend, tone, icon, values/sparkline, href, selected, disabled, loading, and onSelect.

Risk: `KpiTile` can remain a component, but KPI/stat cards should be remediated through the `KpiCard` pattern contract so dashboard semantics do not leak into base `Card`.

### Chart Wrapper / ChartPanel

`Chart Wrapper` is the conceptual pattern owner for chart context, caption, empty/loading/error states, density, and dashboard composition.

`ChartPanel` is the current React implementation surface for label, value, caption, values, labels, segments, series, comparisons, variants, state, tone, density, and fullWidth.

Risk: no visible header action API, while dashboard chart cards repeatedly use Menu/IconButton in the header. Fixing that through `Card` would be wrong; it belongs to the chart pattern/component boundary.

### Payment/Fleet Card Pattern / CardSummary

The payment/fleet card summary is conceptually a pattern candidate because it depends on payment/fleet meaning: masked identifier, status, limit/balance metrics, frozen/warning states, wallet/header context, and privacy rules.

`CardSummary` is the current React implementation surface for label, meta, number, expires, status, metrics, variant, state, density, icon, fullWidth, and disabled.

Risk: public variants are `physical`, `virtual`, `compact`, `limit`; reference variants are `ink`, `accent`, `sand`. The next decision is whether to add a pattern spec above `CardSummary`, rename/reframe it, or keep it as component implementation while patterns own usage.

### Surface

Current API has children and layout roles. It owns generic surfaces: non-object panels, sections, overlays, inline groups, and page grouping surfaces.

Risk: using Card for any layout panel that is not an object/summary/decision card violates the Surface primitive contract.

## Iteration 4 Exit Notes

- Flow already has enough artifacts to avoid inventing flat/manual card visuals.
- The biggest remaining coverage gap is visual ownership across Card-family patterns and their current React implementation surfaces.
- Card now has a real `children` model for governed container use.
- KpiCard, Chart Wrapper, payment/fleet card summary, and route/admin summary should be treated as Card-family pattern remediation targets, not as Card subvariants.

## Iteration 8 Scope Update

Card is approved only for object-card concerns: base, interactive, selected, elevated, minimal, ghost, media, compact, and card-owned header actions.

The following are not Card gaps anymore; they are Card-family pattern or recipe remediation:

| Reference need | Owner | Next action |
| --- | --- | --- |
| KPI/stat and mini metric visuals | `KpiCard` pattern + `KpiTile` implementation | Align to card-like surface intent without moving semantics into Card. |
| Chart cards and chart header actions | `Chart Wrapper` pattern + `ChartPanel` implementation | Add/verify governed panel frame and action slot. |
| Payment/fleet card visuals | payment/fleet card pattern + `CardSummary` implementation | Audit against payment/fleet reference before changing base Card. |
| Route/admin summary visuals | route/admin summary pattern + `RouteSummary` implementation | Verify whether current component should remain public API or be pattern implementation. |
| Layout panels and grouped sections | `Surface` | Use Surface roles; block Card-as-panel usage. |
| Table shell | `Card` + `Table` recipe | Govern nested Table border/shadow reset through owner contracts. |
| Empty/skeleton cards | `Card` + `EmptyState`/`Skeleton` recipe | Keep internals owned by feedback components. |

## Iteration 9 Execution Order

1. Contract gate: Card must declare Surface dependency and reject generic layout ownership.
2. Card-only remediation: base object-card, selected, interactive, density, media, compact, header actions.
3. Surface guard: generic panels/sections/overlays remain Surface-owned.
4. Pattern owner remediation: KpiCard, Chart Wrapper, payment/fleet card summary, route/admin summary.
5. Recipe remediation: Table shell, EmptyState shell, Skeleton shell.
6. Consolidated QA: one runtime entry per owner plus recipe demos, no manual visual wrappers.
