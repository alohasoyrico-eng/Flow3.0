# Flow system baseline master

Generated: 2026-08-11  
Mode: forensic baseline only. No implementation changes.

## Executive finding

Flow is not ready to be treated as a fully consumable multi-platform design system yet.

The inventory exists, and React JS runtimes exist for components, patterns, and templates, but the cascade is not structurally complete:

- TypeScript source is not present in Flow or FlowDocs. Current React runtime is JS plus `.d.ts`.
- Style Dictionary is not actually installed/configured. The repo has a JSON token contract marked compatible with Style Dictionary, but CSS is still the practical source direction.
- Primitives are not implemented as a real React/runtime layer. This breaks the claimed cascade before components, patterns, templates, and docs.
- FlowDocs still contains duplicated visual systems and docs-only behavior, so documentation cannot be used as proof of system quality yet.

## Inventory baseline

| Layer | Flow spec count | Runtime state | Immediate risk |
| --- | ---: | --- | --- |
| Foundations | 11 | Spec/content only | No executable foundation contract. |
| Primitives | 24 | 8 JS runtime files, 0 React primitive files | Cascade is not real at primitive layer. |
| Components | 60 | 60 spec-matched React JS + 60 `.d.ts` | React exists, but not TS-authored. |
| Patterns | 63 | 63 spec-matched React JS + 63 `.d.ts` | React exists, but not TS-authored; duplication risk remains high. |
| Templates | 9 | 9 spec-matched React JS + 9 `.d.ts` | React exists, but not TS-authored; depends on immature lower layers. |

FlowDocs generated runtime baseline:

| Layer | Generated JS files in FlowDocs |
| --- | ---: |
| Components | 62 |
| Patterns | 64 |
| Templates | 10 |

The generated counts exceed the strict spec counts because indexes/extras are present. This must be normalized during the 1:1 matrix.

## Primitive cascade gap

Primitive specs missing runtime JS:

`breakpoints`, `color`, `density`, `disabled`, `duration`, `elevation`, `field-action`, `focus`, `loading`, `measurement`, `message`, `motion-curves`, `radius`, `research`, `spacing`, `surface`, `typography`.

Primitive specs missing React primitive runtime:

`animation-assets`, `breakpoints`, `charts`, `color`, `country-flags`, `density`, `disabled`, `duration`, `elevation`, `field-action`, `focus`, `iconography`, `illustration-assets`, `library-sources`, `loading`, `maps`, `measurement`, `message`, `motion-curves`, `radius`, `research`, `spacing`, `surface`, `typography`.

Runtime primitive without spec:

`country-options`.

This is the first hard blocker. If primitives are not real, then components, patterns, templates, and docs cannot honestly prove full cascade compliance.

## Token pipeline finding

Original forensic state:

- `packages/tokens/tokens.json` exists.
- Format is `flow-token-contract@1`.
- It declares compatibility with `style-dictionary`.
- There is no Style Dictionary dependency/config in the Flow package manifest.
- The current source direction is effectively CSS to JSON contract.

Required state:

- Style Dictionary must be an actual dependency and build pipeline.
- Token source must be canonical JSON token files, not derived from CSS.
- Generated outputs must include CSS variables and typed JS/TS exports first.
- Flutter/Angular adapters are not credible until the source pipeline is real.

Post-remediation update after Phase 1:

- Style Dictionary dependency/config exists and `npm run build:tokens` is the token build path.
- Token source is canonical JSON under `packages/tokens/source`.
- Source gate PASS: 36 source files, 1131 source tokens, 1131 output tokens.
- Outputs PASS: CSS variables, JSON contract, TypeScript, Flutter Dart, Android XML, iOS Swift.
- Generated output governance PASS: 7 generated outputs match manifest, including email inline token values.
- Raw value governance PASS: 0 raw visual value violations across scanned public Flow source.
- Email channel has a governed token source and generated inline values because email clients cannot rely on CSS custom properties.

## TypeScript finding

Measured source files:

| Repo | `.ts/.tsx` source files excluding `.d.ts` |
| --- | ---: |
| Flow3.0 | 0 |
| FlowDocs | 0 |

This means `.d.ts` files currently describe JS behavior but do not enforce implementation correctness. A real TS migration is required before we can claim typed React architecture.

## Known duplication debt

The duplication issue is broader than patterns/templates:

- Shell patterns: `topbar`, `sidebar`, `search` appear as Flow pattern runtimes, docs generated runtimes, docs shell code, docs CSS, hand demos, and DOM behavior.
- FlowDocs contains docs-only visual primitives: background gradients, grid texture, docs-only cards, docs-only tabs, docs-only panels/surfaces, and handcrafted demo wrappers.
- Some entities appear only in docs/catalog surfaces and must be classified before remediation.

Known doc-only pattern candidates from previous strict audit:

`date-picker`, `date-range-picker`, `electromobility-dashboard`, `finance-dashboard`, `fleet-dashboard`, `fleet-dashboard-overview`, `fuel-dashboard`, `maintenance-dashboard`, `mobile-card-detail-and-quick-actions`, `mobile-card-overview`, `mobile-movement-detail`, `mobile-recent-movements`, `phone-input`, `routes-and-nearby-stations-mobile`, `station-detail-and-route-guidance`, `toll-dashboard`.

These must not be deleted blindly. Each needs a 1:1 owner decision: promote to Flow, merge into an existing entity, reclassify, or remove from docs.

## Remediation order implied by this baseline

1. Freeze implementation remediation until the 1:1 matrix has gates.
2. Define non-negotiable gates for Style Dictionary, TS source, primitive cascade, and docs/system ownership.
3. Complete per-entity matrix across foundations, primitives, components, patterns, templates.
4. Only then start code changes, starting with token source and primitives.
5. Rebuild docs consumption after Flow lower layers are trustworthy.

## Next iteration

Iteration 2 must convert this baseline into an executable audit/gate model:

- Per-entity matrix fields.
- Duplicate-surface taxonomy.
- Allowed source locations by layer.
- Banned docs-only CSS/JS patterns.
- TypeScript gate.
- Real Style Dictionary gate.
- Owner decision enum for every docs-only or duplicated entity.
