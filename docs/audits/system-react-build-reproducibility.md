# System React build reproducibility

Generated: 2026-08-14

## Summary

- Status: pass
- Build check status: 0
- src runtime mirrors: 157
- src runtime mirrors missing generated header: 0
- dist runtime files: 158
- dist declaration files: 156
- React build reproducibility debt: 0

## Observed Idempotence

- Command: `npm run build:react`
- Git status delta lines: 0
- Git diff delta lines: 0
- Note: Measured during iteration 09 by comparing git status and git diff before and after npm run build:react.

## Policy

- Authored source: `packages/react/src/**/*.ts and packages/react/src/**/*.tsx`
- Compatibility runtime: `packages/react/src/**/*.js with generated header`
- Publication runtime: `packages/react/dist/**/*.js`
- Gate: `node packages/react/scripts/build.mjs --check`

## Missing Headers

| File |
| --- |
| None |
