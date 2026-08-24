# Card Foundation And Primitive Crosscheck

Scope: compare Card reference visuals against current Flow foundations/primitives and component CSS. Analysis only.

## Existing Flow Foundations That Should Govern Card-Like Surfaces

Boundary note: `Surface` owns generic surface behavior. `Card` should consume the same surface foundations for an object-card, but Card should not become the generic Surface primitive.

| Need | Flow token/foundation exists | Current risk |
| --- | --- | --- |
| Card radius | `--sys-radius-surface` -> `--sys-frame-radius-surface` | Card consumes it correctly; other card-like owners do not consistently do so. |
| Card padding | `--sys-density-card-padding` = `--sys-space-6` | Card has local `--comp-card-padding-*` aliases; needs alignment with density/card padding roles. |
| Card elevation rest | `--sys-elevation-card` | Card consumes rest elevation through `--component-depth-card-rest`. |
| Card elevation hover | `--sys-elevation-card-hover` | Card defines it through `--component-depth-card-hover`, but `--comp-card-shadow-hover` currently points to rest depth. |
| Hover lift | `--sys-momentum-lift-hover` | Card has `--comp-card-hover-transform`, but hover depth is neutralized, so the motion reads incomplete. |
| Card title role | `--sys-voice-heading-sm-*` and component title tokens | Current Card title sizes vary by density and may not preserve the reference 16px card-title role consistently. |
| KPI numeral role | `--sys-voice-numeral-lg-size` and data-lg component tokens | KpiTile uses data-lg; Card `composition="stats"` is compatibility only. |
| Overline role | `--sys-voice-overline-*` | New overline/KPI work belongs to the `KpiCard` pattern rather than Card stats. |
| Icon scale | `--sys-icon-size-sm/md/lg` and density icon aliases | Card-like owners need anatomy-specific icon sizing; no single Card icon size should override KPI/payment/media needs. |

## Component-Level Findings

### Card

Confirmed alignment:

- Uses `--component-radius-surface`, which maps to surface/card radius.
- Uses surface background, border, text, focus, disabled, and motion tokens.
- Provides variants matching the reference names: `default`, `minimal`, `elevated`, `ghost`.

Gaps:

- `--comp-card-shadow-hover` is set to `--component-depth-card-rest` instead of `--component-depth-card-hover`.
- `composition="stats"` repeats KPI semantics and is compatibility only; new work belongs in the `KpiCard` pattern, with `KpiTile` as implementation surface.
- Card now accepts `children`, but this makes Card an object-card container, not the generic Surface primitive.
- Compact/media compositions exist, but need verification against reference sizes instead of assuming they are correct.

### KpiTile

Confirmed alignment:

- Owns KPI-specific semantics: label, value, delta, trend, icon, sparkline, drill-in.
- Uses mono value, overline-like label, trend icons, tones, and interaction states.

Gaps:

- Radius currently uses `--component-radius-control`, not surface/card radius.
- Depth uses `--component-depth-panel`, not card rest elevation.
- Hover transform uses `--component-transform-lift-sm`, while reference StatTile/Card interaction uses full card lift.
- Padding/density values need comparison with reference: 18px base, 20px dashboard row, 14px mini metric.

Decision implication: `KpiTile` is probably the correct owner, but it may need Card-surface visual alignment.

### ChartPanel

Confirmed alignment:

- Owns chart-specific rendering and chart tones.
- Has variants for chart types used in dashboards.
- Has title/caption-like header and density behavior.

Gaps:

- Radius currently uses `--component-radius-control`, not surface/card radius.
- Depth uses panel/action depth, not clearly Card panel rest/hover depth.
- Hover border and transform behave like action focus more than passive dashboard chart panels.
- Header action slot is not visible in current prop surface, but the reference dashboard uses Menu/IconButton in chart card headers.

Decision implication: `ChartPanel` should own chart card visuals only if its panel frame is aligned to card-like surfaces and it supports header actions without local wrappers.

### CardSummary

Confirmed alignment:

- Has the 1.586 aspect ratio required by payment card reference.
- Has frozen/disabled/focus/hover state tokens.
- Uses CardSummary-specific radius, chip, number, icon, metrics, and frost tokens.

Gaps:

- Reference variants are `ink`, `accent`, `sand`; current public variants need comparison before declaring parity.
- Visual language may already be close, but must be audited separately from base Card.

Decision implication: PaymentCard should not become a Card variant. It belongs to CardSummary or a named payment/domain artifact.

### Surface

Confirmed alignment:

- Surface primitive exists for layout/panel/overlay/inline roles.
- Surface owns generic surface behavior and should be used for grouped layout, panels, page regions, forms/settings sections, and non-object containers.

Decision implication: aside/detail panels and grouped settings/form surfaces should use Surface, not Card.

## Systemic Issues To Carry Into Iteration 4

- Card-like visual owners do not all consume the same surface/card frame intent.
- KpiCard/KpiTile, Chart Wrapper/ChartPanel, and Card stats overlap visually and semantically unless pattern ownership is enforced.
- Existing primitives are sufficient for radius, depth, spacing, voice, iconography, state, and motion; the gap is ownership and consumption, not missing foundations.
- Iteration 6 closes the Surface/Card boundary: Surface owns generic surfaces; Card owns object-card anatomy/behavior.
- Any remediation must align owners to existing tokens instead of adding local Card-only values.

## Iteration 3 Exit Notes

- No new foundation appears necessary for Card parity at this stage.
- The major unresolved question is not "what values should Card use?" but "which artifact owns each card-like visual and which token intent should it consume?"
- Iteration 4 must map current Flow component coverage and identify which owners need remediation before Card implementation begins.

## Iteration 7 Foundation Usage Audit

### What Is Consistent

- Card visual values are mostly token-derived: spacing, radius, color, depth, focus, motion, typography, and iconography route through `--component-*` / `--sys-*` variables.
- Card does not currently rely on raw hex, raw px, or direct inline visual styles in the React implementation.
- Card actions compose governed `Button` and `IconButton`, and loading composes governed `Spinner`.
- Card radius and depth already derive from shared surface/depth roles: `--component-radius-surface`, `--component-depth-card-rest`, and `--component-depth-card-hover`.
- Surface primitive has an explicit governance purpose that rejects using Card as a generic layout container.

### What Is Inconsistent Or Under-Specified

- Card does not expose `Surface` as a primitive dependency in `cardPlatformContract.primitives`, even though its frame/radius/depth semantics depend on surface roles.
- Card contract purpose says "Group a product summary..." but does not state the stronger boundary: object-card only, not generic layout surface.
- `--comp-card-padding-*` is derived from spacing tokens, but not clearly from the surface/frame density aliases that Surface uses. This can cause Card density to drift from generic surface density.
- `--comp-card-bg`, `--comp-card-border`, `--comp-card-bg-selected`, and related state surface colors duplicate surface-state ideas without a documented mapping to Surface tone/state roles.
- `composition="stats"` remains in the public contract as compatibility; this is a known ownership smell because KPI/stat semantics belong to the `KpiCard` pattern.

### Reframed Debt

This is not primarily "Card looks wrong". The deeper debt is that Card has a local object-card cascade but the system has not formally mapped that cascade to Surface/Foundation ownership.

Card may keep object-card-specific variables, but each variable group needs an owner:

- frame/radius/depth/background: Surface/Foundation mapped
- object anatomy spacing: Card-owned
- title/value/detail/status typography: Voice/Foundation mapped, Card-applied
- selected/error/disabled/loading: State/Foundation mapped, Card-applied
- media/compact/header-actions: Card composition only when generic and reusable

### Iteration 7 Decision

Do not implement more Card visuals until the next scope decision separates:

- Card-owned object anatomy
- Surface-owned generic surface roles
- KpiTile-owned metrics
- ChartPanel-owned chart panels
- CardSummary-owned payment cards
- composition recipes that should stay as examples instead of variants
