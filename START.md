# Start With Design System

Design System is now split into packages. Start with the package that matches the job.

## Install From Repos

The split target is two repos:

- `alohasoyrico-eng/Flow3.0`: foundations, primitives, tokens, components, platform adapters, specs, content, audits, and agent guidance.
- `alohasoyrico-eng/FlowDocs`: documentation app that consumes `flow`.

Local setup:

```sh
git clone git@github.com:alohasoyrico-eng/Flow3.0.git
git clone git@github.com:alohasoyrico-eng/FlowDocs.git
cd Flow3.0
npm install
npm run validate:system
cd ../FlowDocs
npm install
npm run validate:docs
```

Product dependency from GitHub:

```json
{
  "dependencies": {
    "flow": "github:alohasoyrico-eng/Flow3.0#main"
  }
}
```

Product dependency from Azure Repos:

```json
{
  "dependencies": {
    "flow": "git+ssh://git@ssh.dev.azure.com:v3/{org}/{project}/Flow3.0#main"
  }
}
```

Use only public package surfaces:

```js
import { Button } from "flow/react";
import "flow/components/styles.css";
import "flow/tokens/styles.css";
```

## Build a Prototype

Use:

- `packages/tokens`
- `packages/components`
- `packages/content/content/fixtures/prototyping.json`
- `examples/prototyping/index.html`
- `examples/prototyping/basic.html`
- `examples/prototyping/fleet-dashboard.html`
- `examples/prototyping/driver-mobile.html`

Run:

```sh
npm run serve
```

Open:

```txt
http://127.0.0.1:53118/examples/prototyping/basic.html
```

Other starter surfaces:

```txt
http://127.0.0.1:53118/examples/prototyping/index.html
http://127.0.0.1:53118/examples/prototyping/fleet-dashboard.html
http://127.0.0.1:53118/examples/prototyping/driver-mobile.html
```

## Read the System

Use:

- `apps/docs`
- `packages/content/content/catalog.json`
- `packages/specs/specs/unison.system.json`

Open:

```txt
http://127.0.0.1:53118/apps/docs/index.html
```

## Change Design System

1. Update the canonical package first.
2. Update the docs app only as a consumer.
3. Run `npm run validate`.
4. Update `CHANGELOG.md` when behavior, package shape, or public usage changes.

For product-screen migrations, use `MIGRATE_PRODUCT_SCREEN.md`.

## What To Edit

| Need | Edit |
| --- | --- |
| Add or change a system rule | `packages/specs/specs/unison.system.json` |
| Add an artifact to navigation | `packages/content/content/catalog.json` |
| Change component documentation copy | `packages/content/content/component-copy.json` |
| Change component tab structure | `packages/content/content/component-docs.json` |
| Change prototype data | `packages/content/content/fixtures/prototyping.json` |
| Change shell labels | `packages/content/content/i18n/ui.json` |
| Change reusable prototype tokens | `packages/tokens` |
| Change reusable prototype UI | `packages/components` |
| Change React implementation | `packages/react` after the component contract exists |
| Add Angular or Flutter implementation | Only after a real consumer, starter, and parity test exist |
| Change component public API | `packages/components/src/contracts.js` |
| Change component behavior | `packages/components/src/index.js` and `packages/components/test/smoke.test.mjs` |
| Change the docs rendering | `apps/docs` |
| Change validation rules | the relevant `packages/audit/scripts/audit-*.js` module |
| Add release guidance | `RELEASE.md` and `CHANGELOG.md` |

## Package Map

- `apps/docs`: rendered documentation consumer.
- `packages/specs`: machine-readable system contracts.
- `packages/content`: catalog, copy, fixtures, i18n, and template blueprints.
- `packages/audit`: Architecture Gate and quality checks.
- `packages/tokens`: prototype-ready semantic tokens.
- `packages/components`: prototype-ready component contracts, DOM factories, and shared CSS.
- `packages/react`: React adapters that consume component contracts.
- Future Angular/Flutter adapters are not kept as idle source. They must be generated from contracts once real consumer coverage exists.

## Guardrails

- Keep canonical rules and copy out of `apps/docs`.
- Keep docs modules, audit modules, style modules, and source JSON shards below 400 lines.
- Add validation rules to the matching audit module, not to the runner.
- Treat `audit-system.js` as orchestration only.
- Consuming apps import from public package exports, never from `flow/packages/...`.
- React, Angular, and Flutter adapters must derive API from the component contract, not recreate it.

## Validation

```sh
npm run audit
npm test
npm run validate
```
