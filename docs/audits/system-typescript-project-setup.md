# TypeScript Project Setup

Status: **pass**

TypeScript project setup debt: 0

## Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| `tsconfig-exists` | PASS | `{"file":"tsconfig.json","exists":true}` |
| `typecheck-script-owned` | PASS | `{"typecheckScript":"tsc --noEmit --project tsconfig.json"}` |
| `strict-no-emit-configuration` | PASS | `{"strict":true,"noEmit":true,"allowJs":false}` |
| `typed-source-included` | PASS | `{"include":["packages/tokens/src/**/*.ts","packages/tokens/src/**/*.tsx"]}` |
| `tsc-no-emit-passes` | PASS | `{"status":0,"stdout":"","stderr":""}` |

