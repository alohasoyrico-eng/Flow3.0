# P0.2 Primitive Runtime Matrix

This report maps each real Flow primitive 1:1 against spec, JS runtime, typed runtime, token candidates, and P0 runtime requirement.

## Totals

- Primitives: 24
- P0 runtime required: 18
- Typed runtime: 18
- Typed policy contract: 6
- JS runtime only: 0
- Missing P0 runtime: 0
- Policy/non-runtime decision needed: 0

## Matrix

| Primitive | Status | P0 runtime | JS runtime | TS runtime | Token candidates | Foundations |
| --- | --- | --- | --- | --- | ---: | --- |
| Color | typed-runtime | yes |  | `packages/tokens/src/primitives/color.ts` | 15 | Energy, State, Tone, Accessibility |
| Typography | typed-runtime | yes |  | `packages/tokens/src/primitives/typography.ts` | 0 | Voice, Tone, Frame, Accessibility |
| Spacing | typed-runtime | yes |  | `packages/tokens/src/primitives/spacing.ts` | 36 | Frame, Depth, State, Accessibility |
| Radius | typed-runtime | yes |  | `packages/tokens/src/primitives/radius.ts` | 11 | Frame, Depth, State |
| Elevation | typed-runtime | yes |  | `packages/tokens/src/primitives/elevation.ts` | 13 | Depth, Frame, State, Accessibility |
| Iconography | typed-policy-contract | no | `packages/components/src/primitives/iconography.js` | `packages/tokens/src/primitives/iconography.ts` | 48 | Iconography, Symbol, Accessibility, State, Energy |
| Library Sources | typed-policy-contract | no | `packages/components/src/primitives/library-sources.js` | `packages/tokens/src/primitives/library-sources.ts` | 0 | Symbol, Iconography, Accessibility, Momentum, Energy, Frame |
| Country Flags | typed-policy-contract | no | `packages/components/src/primitives/country-flags.js` | `packages/tokens/src/primitives/country-flags.ts` | 0 | Iconography, Symbol, Accessibility, Energy, Frame |
| Animation Assets | typed-policy-contract | no | `packages/components/src/primitives/animation-assets.js` | `packages/tokens/src/primitives/animation-assets.ts` | 0 | Momentum, Accessibility, Symbol, Energy, Frame |
| Illustration Assets | typed-policy-contract | no | `packages/components/src/primitives/illustration-assets.js` | `packages/tokens/src/primitives/illustration-assets.ts` | 0 | Symbol, Accessibility, Energy, Frame, Voice |
| Motion Curves | typed-runtime | yes |  | `packages/tokens/src/primitives/motion-curves.ts` | 6 | Momentum, State, Accessibility |
| Duration | typed-runtime | yes |  | `packages/tokens/src/primitives/duration.ts` | 17 | Momentum, State, Accessibility |
| Breakpoints | typed-runtime | yes |  | `packages/tokens/src/primitives/breakpoints.ts` | 5 | Frame, Accessibility |
| Density | typed-runtime | yes |  | `packages/tokens/src/primitives/density.ts` | 44 | Frame, Accessibility, Voice |
| Focus | typed-runtime | yes |  | `packages/tokens/src/primitives/focus.ts` | 8 | Accessibility, State, Frame |
| Loading | typed-runtime | yes |  | `packages/tokens/src/primitives/loading.ts` | 14 | State, Momentum, Tone, Accessibility |
| Disabled | typed-runtime | yes |  | `packages/tokens/src/primitives/disabled.ts` | 8 | State, Tone, Accessibility, Energy |
| Charts | typed-runtime | yes | `packages/components/src/primitives/charts.js` | `packages/tokens/src/primitives/charts.ts` | 0 | Energy, Accessibility, Momentum, Voice, State |
| Maps | typed-runtime | yes | `packages/components/src/primitives/maps.js` | `packages/tokens/src/primitives/maps.ts` | 0 | Energy, Accessibility, Frame, Voice, Momentum, Depth, State |
| Message | typed-runtime | yes |  | `packages/tokens/src/primitives/message.ts` | 16 | Tone, Voice, State, Accessibility |
| Measurement | typed-runtime | yes |  | `packages/tokens/src/primitives/measurement.ts` | 10 | Growth, State, Accessibility, Tone |
| Research | typed-policy-contract | no |  | `packages/tokens/src/primitives/research.ts` | 11 | Growth, Tone, Accessibility, Voice |
| Surface | typed-runtime | yes |  | `packages/tokens/src/primitives/surface.ts` | 0 | Frame, Depth, Energy, State, Accessibility |
| Field Action | typed-runtime | yes |  | `packages/tokens/src/primitives/field-action.ts` | 0 | Accessibility, State, Frame, Tone, Energy |

## Missing P0 Runtime Queue


