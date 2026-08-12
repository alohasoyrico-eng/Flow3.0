# System React input/localization TypeScript surface

Generated: 2026-08-12

This report governs the React input and localization component TSX batch. TypeScript is the maintained source, JavaScript is generated runtime, and declaration files remain compatible during incremental migration.

## Summary

- Status: pass
- Components audited: 4
- Runtime files: 4
- TSX source files: 4
- Declaration files: 4
- Stale runtime files: 0
- React input/localization TypeScript surface debt: 0

## Components

- CodeInput: source=yes, runtime=yes, declaration=yes, stale=no
- PhoneInput: source=yes, runtime=yes, declaration=yes, stale=no
- CountrySelector: source=yes, runtime=yes, declaration=yes, stale=no
- InputAmount: source=yes, runtime=yes, declaration=yes, stale=no

## Gates

| Gate | Status | Detail |
| --- | --- | --- |
| input-localization-have-tsx-source-runtime-and-declarations | PASS | OK |
| component-contracts-owned-in-tsx-source | PASS | OK |
| declarations-remain-compatible | PASS | OK |
| runtime-generated-from-tsx | PASS | OK |
