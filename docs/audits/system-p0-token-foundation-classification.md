# P0.1 Token/Foundation Classification

This is the first remaining P0.1 pass. It does not rename or move tokens. It classifies the current Style Dictionary source against the 11 real Flow foundations so the next pass can curate source ownership without inventing a generic token taxonomy.

## Totals

- Foundations from spec: 11
- Tokens in current source: 1139
- Source files: 36
- Legacy flat source present: no
- Duplicate token names: 0
- Foundation-owned tokens by namespace: 787
- Aliases that reference foundations but are not foundation-owned: 214
- Docs-only candidates: 12
- Primitive/semantic candidates outside foundation namespace: 109
- Unclassified tokens: 17
- Tokens requiring owner decision before curated source split: 392

## Real Foundations

| Foundation | Reference tokens | System tokens | Aliases referencing it | Cross-foundation refs | Artifact |
| --- | ---: | ---: | ---: | ---: | --- |
| Energy | 90 | 26 | 51 | 0 | `packages/specs/specs/unison-system/artifacts/foundations/energy.json` |
| Voice | 47 | 113 | 21 | 0 | `packages/specs/specs/unison-system/artifacts/foundations/voice.json` |
| Frame | 89 | 172 | 44 | 0 | `packages/specs/specs/unison-system/artifacts/foundations/frame.json` |
| Depth | 12 | 25 | 9 | 0 | `packages/specs/specs/unison-system/artifacts/foundations/depth.json` |
| Momentum | 25 | 63 | 34 | 0 | `packages/specs/specs/unison-system/artifacts/foundations/momentum.json` |
| State | 19 | 12 | 6 | 1 | `packages/specs/specs/unison-system/artifacts/foundations/state.json` |
| Tone | 4 | 9 | 18 | 9 | `packages/specs/specs/unison-system/artifacts/foundations/tone.json` |
| Growth | 4 | 5 | 3 | 5 | `packages/specs/specs/unison-system/artifacts/foundations/growth.json` |
| Symbol | 19 | 19 | 0 | 5 | `packages/specs/specs/unison-system/artifacts/foundations/symbol.json` |
| Iconography | 0 | 24 | 24 | 20 | `packages/specs/specs/unison-system/artifacts/foundations/iconography.json` |
| Accessibility | 0 | 10 | 4 | 0 | `packages/specs/specs/unison-system/artifacts/foundations/accessibility.json` |

## Largest Prefix Buckets

| Prefix | Tokens |
| --- | ---: |
| `sys-frame` | 172 |
| `sys-voice` | 113 |
| `ref-energy` | 90 |
| `ref-frame` | 89 |
| `sys-momentum` | 63 |
| `sys-email` | 53 |
| `ref-voice` | 47 |
| `sys-space` | 29 |
| `sys-energy` | 26 |
| `ref-momentum` | 25 |
| `sys-depth` | 25 |
| `sys-icon` | 24 |
| `sys-iconography` | 24 |
| `sys-density` | 22 |
| `ref-state` | 19 |
| `ref-symbol` | 19 |
| `sys-chart` | 19 |
| `sys-symbol` | 19 |
| `sys-map` | 18 |
| `sys-duration` | 17 |
| `sys-message` | 16 |
| `sys-color` | 15 |
| `sys-loading` | 14 |
| `sys-elevation` | 13 |
| `ref-depth` | 12 |
| `sys-state` | 12 |
| `sys-radius` | 11 |
| `sys-research` | 11 |
| `density-doc` | 10 |
| `sys-a11y` | 10 |

## Decision Queues

These are the queues for the next P0.1 iteration. They are not safe to move into foundation files until owner decisions are explicit.

- Alias-to-foundation queue: 214
- Docs-only queue: 12
- Primitive/semantic queue: 109
- Unclassified queue: 17
- Cross-foundation reference queue: 40

## First 40 Owner Decisions

| Token | Queue | Reference | Referenced foundation | Reason |
| --- | --- | --- | --- | --- |
| `sys-density-doc-body-line-height` | alias-to-foundation | `sys-voice-line-height-relaxed` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-density-doc-body-size` | alias-to-foundation | `sys-voice-size-6` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-density-doc-card-body-size` | alias-to-foundation | `sys-voice-size-6` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-density-doc-card-title-size` | alias-to-foundation | `sys-voice-size-6` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-density-doc-heading-line-height` | alias-to-foundation | `sys-voice-line-height-tight` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-density-doc-heading-size` | alias-to-foundation | `sys-voice-size-10` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-density-doc-label-size` | alias-to-foundation | `sys-voice-size-3` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-density-doc-subheading-size` | alias-to-foundation | `sys-voice-size-9` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-a11y-contrast-surface` | alias-to-foundation | `sys-energy-surface-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-a11y-contrast-text` | alias-to-foundation | `sys-energy-text-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-a11y-focus-offset` | alias-to-foundation | `sys-state-focus-offset` | State | Alias references State; needs primitive/component/docs ownership decision. |
| `sys-a11y-focus-ring` | alias-to-foundation | `sys-state-focus-ring` | State | Alias references State; needs primitive/component/docs ownership decision. |
| `sys-a11y-motion-duration` | alias-to-foundation | `sys-momentum-duration-default` | Momentum | Alias references Momentum; needs primitive/component/docs ownership decision. |
| `sys-a11y-overlay-depth` | alias-to-foundation | `sys-depth-elevation-2` | Depth | Alias references Depth; needs primitive/component/docs ownership decision. |
| `sys-a11y-readable-line-height` | alias-to-foundation | `sys-voice-line-height-body` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-border-width-thin` | alias-to-foundation | `sys-frame-border-thin` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-breakpoint-desktop` | alias-to-foundation | `sys-frame-breakpoint-lg` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-breakpoint-laptop` | alias-to-foundation | `sys-frame-breakpoint-md` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-breakpoint-tablet` | alias-to-foundation | `sys-frame-breakpoint-sm` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-breakpoint-wide` | alias-to-foundation | `sys-frame-breakpoint-xl` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-chart-axis-color` | alias-to-foundation | `sys-energy-text-secondary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-grid-color` | alias-to-foundation | `sys-energy-border-default` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-legend-text-color` | alias-to-foundation | `sys-energy-text-secondary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-motion-duration-enter` | alias-to-foundation | `sys-momentum-duration-reveal` | Momentum | Alias references Momentum; needs primitive/component/docs ownership decision. |
| `sys-chart-motion-duration-update` | alias-to-foundation | `sys-momentum-duration-default` | Momentum | Alias references Momentum; needs primitive/component/docs ownership decision. |
| `sys-chart-motion-easing-enter` | alias-to-foundation | `sys-momentum-easing-enter` | Momentum | Alias references Momentum; needs primitive/component/docs ownership decision. |
| `sys-chart-motion-easing-update` | alias-to-foundation | `sys-momentum-easing-move` | Momentum | Alias references Momentum; needs primitive/component/docs ownership decision. |
| `sys-chart-series-primary` | alias-to-foundation | `sys-energy-action-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-series-quaternary` | alias-to-foundation | `sys-energy-status-warning` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-series-secondary` | alias-to-foundation | `sys-energy-text-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-series-tertiary` | alias-to-foundation | `sys-energy-status-success` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-summary-font` | alias-to-foundation | `sys-voice-family-body` | Voice | Alias references Voice; needs primitive/component/docs ownership decision. |
| `sys-chart-threshold-danger` | alias-to-foundation | `sys-energy-status-error` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-threshold-warning` | alias-to-foundation | `sys-energy-status-warning` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-tooltip-background` | alias-to-foundation | `sys-energy-text-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-chart-tooltip-foreground` | alias-to-foundation | `sys-energy-surface-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-action` | alias-to-foundation | `sys-energy-action-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-action-hover` | alias-to-foundation | `sys-energy-action-hover` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-action-text` | alias-to-foundation | `sys-energy-text-on-action` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-border` | alias-to-foundation | `sys-energy-border-default` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |

