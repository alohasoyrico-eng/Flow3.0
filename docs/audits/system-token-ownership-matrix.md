# Token Ownership Matrix

Status: **pass**

This report defines token ownership for phase 1: family token JSON files are source, Style Dictionary outputs are generated artifacts, and package exports expose generated outputs.

## Totals

- Source files: 36
- Source tokens: 1152
- Required source families: 30
- Required outputs: 7
- Matching outputs: 7
- Ownership debt: 0

## Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| `required-source-families-owned` | PASS | `{"missingRequiredSources":[]}` |
| `no-legacy-flat-source` | PASS | `{"file":"packages/tokens/source/flow.tokens.json","exists":false}` |
| `no-unowned-token-source-files` | PASS | `{"unownedSourceFiles":[]}` |
| `source-manifest-current` | PASS | `{"manifestTotal":1152,"currentTotal":1152}` |
| `style-dictionary-build-script-owned` | PASS | `{"buildScript":"node scripts/build-tokens.mjs"}` |
| `output-manifest-present` | PASS | `{"file":"packages/tokens/dist/token-output-manifest.json","exists":true}` |
| `required-outputs-match-manifest` | PASS | `{"failingOutputs":[]}` |
| `tokens-package-exports-outputs` | PASS | `{"missingExports":[],"exports":["./tokens.json","./styles.css","./flutter","./android","./ios"]}` |

## Source Ownership

| Layer | Family | Status | Tokens | File |
| --- | --- | --- | ---: | --- |
| foundation | accessibility | PASS | 26 | `packages/tokens/source/foundations/accessibility.tokens.json` |
| foundation | depth | PASS | 37 | `packages/tokens/source/foundations/depth.tokens.json` |
| foundation | energy | PASS | 119 | `packages/tokens/source/foundations/energy.tokens.json` |
| foundation | frame | PASS | 262 | `packages/tokens/source/foundations/frame.tokens.json` |
| foundation | growth | PASS | 9 | `packages/tokens/source/foundations/growth.tokens.json` |
| foundation | iconography | PASS | 24 | `packages/tokens/source/foundations/iconography.tokens.json` |
| foundation | momentum | PASS | 88 | `packages/tokens/source/foundations/momentum.tokens.json` |
| foundation | state | PASS | 31 | `packages/tokens/source/foundations/state.tokens.json` |
| foundation | symbol | PASS | 38 | `packages/tokens/source/foundations/symbol.tokens.json` |
| foundation | tone | PASS | 13 | `packages/tokens/source/foundations/tone.tokens.json` |
| foundation | voice | PASS | 160 | `packages/tokens/source/foundations/voice.tokens.json` |
| primitive | breakpoints | PASS | 5 | `packages/tokens/source/primitives/breakpoints.tokens.json` |
| primitive | charts | PASS | 19 | `packages/tokens/source/primitives/charts.tokens.json` |
| primitive | color | PASS | 24 | `packages/tokens/source/primitives/color.tokens.json` |
| primitive | density | PASS | 24 | `packages/tokens/source/primitives/density.tokens.json` |
| primitive | disabled | PASS | 9 | `packages/tokens/source/primitives/disabled.tokens.json` |
| primitive | duration | PASS | 17 | `packages/tokens/source/primitives/duration.tokens.json` |
| primitive | elevation | PASS | 13 | `packages/tokens/source/primitives/elevation.tokens.json` |
| primitive | email-channel | PASS | 53 | `packages/tokens/source/primitives/email-channel.tokens.json` |
| primitive | focus | PASS | 8 | `packages/tokens/source/primitives/focus.tokens.json` |
| primitive | iconography | PASS | 24 | `packages/tokens/source/primitives/iconography.tokens.json` |
| primitive | loading | PASS | 14 | `packages/tokens/source/primitives/loading.tokens.json` |
| primitive | maps | PASS | 18 | `packages/tokens/source/primitives/maps.tokens.json` |
| primitive | measurement | PASS | 10 | `packages/tokens/source/primitives/measurement.tokens.json` |
| primitive | message | PASS | 16 | `packages/tokens/source/primitives/message.tokens.json` |
| primitive | motion-curves | PASS | 6 | `packages/tokens/source/primitives/motion-curves.tokens.json` |
| primitive | radius | PASS | 11 | `packages/tokens/source/primitives/radius.tokens.json` |
| primitive | research | PASS | 11 | `packages/tokens/source/primitives/research.tokens.json` |
| primitive | spacing | PASS | 36 | `packages/tokens/source/primitives/spacing.tokens.json` |
| primitive | typography | PASS | 7 | `packages/tokens/source/primitives/typography.tokens.json` |

## Output Ownership

| Output | Status | Owner |
| --- | --- | --- |
| `packages/tokens/styles/tokens.css` | PASS | Style Dictionary build output |
| `packages/tokens/tokens.json` | PASS | Style Dictionary build output |
| `packages/tokens/src/generated/tokens.ts` | PASS | Style Dictionary build output |
| `packages/tokens/dist/flutter/flow_tokens.dart` | PASS | Style Dictionary build output |
| `packages/tokens/dist/android/flow_tokens.xml` | PASS | Style Dictionary build output |
| `packages/tokens/dist/ios/FlowTokens.swift` | PASS | Style Dictionary build output |
| `packages/react/src/internal/email-token-values.js` | PASS | Style Dictionary build output |

