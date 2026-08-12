# P0.1 Token/Foundation Classification

This is the first remaining P0.1 pass. It does not rename or move tokens. It classifies the current Style Dictionary source against the 11 real Flow foundations so the next pass can curate source ownership without inventing a generic token taxonomy.

## Totals

- Foundations from spec: 11
- Tokens in current source: 1078
- Source files: 15
- Legacy flat source present: no
- Duplicate token names: 0
- Foundation-owned tokens by namespace: 779
- Aliases that reference foundations but are not foundation-owned: 214
- Docs-only candidates: 12
- Primitive/semantic candidates outside foundation namespace: 56
- Unclassified tokens: 17
- Tokens requiring owner decision before curated source split: 339

## Real Foundations

| Foundation | Reference tokens | System tokens | Aliases referencing it | Cross-foundation refs | Artifact |
| --- | ---: | ---: | ---: | ---: | --- |
| Energy | 90 | 18 | 51 | 0 | `packages/specs/specs/unison-system/artifacts/foundations/energy.json` |
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
| `ref-voice` | 47 |
| `sys-space` | 29 |
| `ref-momentum` | 25 |
| `sys-depth` | 25 |
| `sys-icon` | 24 |
| `sys-iconography` | 24 |
| `sys-density` | 22 |
| `ref-state` | 19 |
| `ref-symbol` | 19 |
| `sys-chart` | 19 |
| `sys-symbol` | 19 |
| `sys-energy` | 18 |
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
| `sys-accessibility` | 10 |

## Decision Queues

These are the queues for the next P0.1 iteration. They are not safe to move into foundation files until owner decisions are explicit.

- Alias-to-foundation queue: 214
- Docs-only queue: 12
- Primitive/semantic queue: 56
- Unclassified queue: 17
- Cross-foundation reference queue: 40

## First 40 Owner Decisions

| Token | Queue | Reference | Referenced foundation | Reason |
| --- | --- | --- | --- | --- |
| `sys-color-surface` | alias-to-foundation | `sys-energy-surface-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-surface-raised` | alias-to-foundation | `sys-energy-surface-secondary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-text` | alias-to-foundation | `sys-energy-text-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-text-muted` | alias-to-foundation | `sys-energy-text-secondary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-text-subtle` | alias-to-foundation | `sys-energy-text-tertiary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-border` | alias-to-foundation | `sys-energy-border-default` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-border-strong` | alias-to-foundation | `sys-energy-border-strong` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-surface-muted` | alias-to-foundation | `sys-energy-surface-sunken` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-action` | alias-to-foundation | `sys-energy-action-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-action-hover` | alias-to-foundation | `sys-energy-action-hover` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-action-text` | alias-to-foundation | `sys-energy-text-on-action` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-focus` | alias-to-foundation | `sys-energy-action-primary` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-success` | alias-to-foundation | `sys-energy-status-success` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-warning` | alias-to-foundation | `sys-energy-status-warning` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-color-danger` | alias-to-foundation | `sys-energy-status-error` | Energy | Alias references Energy; needs primitive/component/docs ownership decision. |
| `sys-space-0` | alias-to-foundation | `ref-frame-space-0` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-micro` | alias-to-foundation | `ref-frame-space-micro` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-2xs` | alias-to-foundation | `ref-frame-space-micro` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-1` | alias-to-foundation | `ref-frame-space-1` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-2` | alias-to-foundation | `ref-frame-space-2` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-3` | alias-to-foundation | `ref-frame-space-3` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-4` | alias-to-foundation | `ref-frame-space-4` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-5` | alias-to-foundation | `ref-frame-space-5` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-6` | alias-to-foundation | `ref-frame-space-6` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-7` | alias-to-foundation | `ref-frame-space-7` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-8` | alias-to-foundation | `ref-frame-space-8` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-9` | alias-to-foundation | `ref-frame-space-9` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-10` | alias-to-foundation | `ref-frame-space-10` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-11` | alias-to-foundation | `ref-frame-space-11` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-12` | alias-to-foundation | `ref-frame-space-12` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-16` | alias-to-foundation | `ref-frame-space-16` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-20` | alias-to-foundation | `ref-frame-space-20` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-24` | alias-to-foundation | `ref-frame-space-24` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-32` | alias-to-foundation | `ref-frame-space-32` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-space-40` | alias-to-foundation | `ref-frame-space-40` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-spacing-component-sm` | alias-to-foundation | `sys-frame-gap-element` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-spacing-component-md` | alias-to-foundation | `sys-frame-gap-component` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-spacing-component-lg` | alias-to-foundation | `sys-frame-gap-component-lg` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-spacing-section` | alias-to-foundation | `sys-frame-gap-section` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |
| `sys-spacing-page` | alias-to-foundation | `sys-frame-gap-page` | Frame | Alias references Frame; needs primitive/component/docs ownership decision. |

