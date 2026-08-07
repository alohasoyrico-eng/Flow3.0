# Design System OS

Design System is a distributed design system platform for fleet, driver mobile, fleet manager desktop, cards, movements, routes, stations, dashboards, authentication, and configuration work.

The docs app is a consumer. Source of truth lives in packages.

## Start

Run the Architecture Gate:

```sh
npm run validate
```

Start the local server:

```sh
npm run serve
```

Open:

- `http://127.0.0.1:53118/apps/docs/index.html`
- `http://127.0.0.1:53118/examples/prototyping/index.html`

## Package Map

| Area | Path |
| --- | --- |
| Docs consumer | `apps/docs` |
| Machine contracts | `packages/specs` |
| Catalog, copy, fixtures, i18n | `packages/content` |
| Architecture Gate | `packages/audit` |
| Prototype tokens | `packages/tokens` |
| Prototype components | `packages/components` |
| React implementation | `packages/react` |
| Future platform adapters | Generated only when a real Angular or Flutter consumer exists |
| Runnable prototypes | `examples/prototyping` |

## Real Installation

Use two repos after the split:

- Design System source: `alohasoyrico-eng/Flow3.0`
- Docs consumer: `alohasoyrico-eng/FlowDocs`

For a local product or docs checkout:

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

For GitHub Packages, configure the organization registry:

```ini
@alohasoyrico-eng:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Install the package with the product-facing alias `flow`:

```json
{
  "dependencies": {
    "flow": "npm:@alohasoyrico-eng/flow@0.3.0-platform-mvp"
  }
}
```

For local development before publishing a new release, keep the same alias:

```json
{
  "dependencies": {
    "flow": "file:../Flow3.0"
  }
}
```

The package root exposes public install surfaces:

```js
import { Button } from "flow/react";
import "flow/components/styles.css";
import "flow/tokens/styles.css";
```

Do not import from `flow/packages/...` in consuming products. That bypasses the public contract and makes future platform, token, and docs splits brittle.

Public package artifacts are intentionally explicit:

- `flow/tokens` and `flow/tokens/styles.css`
- `flow/components`, `flow/components/contracts`, `flow/components/platforms`, and `flow/components/styles.css`
- `flow/react` and `flow/react/*` subpaths
- `flow/content/*` for catalog, copy, implementation status, templates, and i18n
- `flow/specs/system` for machine-readable system contracts

Release policy starts on SemVer pre-release discipline: patch for fixes, minor for new public components or tokens, and major only when public API or token semantics break. Run `npm run validate` before any release.

## Architecture Boundaries

Design System is organized so the documentation site can be replaced without taking the design system with it.

- Canonical rules live in `packages/specs`.
- Canonical copy, catalog data, fixtures, and i18n live in `packages/content`.
- Reusable prototype primitives live in `packages/tokens` and `packages/components`.
- `apps/docs` renders and demonstrates Design System, but does not own system truth.
- `apps/docs/generated/docs-content.bundle.json` is generated distribution content; source shards remain canonical.
- `packages/audit/scripts/audit-system.js` is only the runner; audit rules are split by domain.

The audit blocks new monoliths: docs modules, audit modules, style modules, and source JSON shards must stay below 400 lines.

## Core Commands

```sh
npm run audit
npm test
npm run validate
```

`npm run validate` runs both the Architecture Gate and component smoke tests.

## Current Status

Design System is at `0.3.0-platform-mvp`.

It includes the repo split, manifest, Architecture Gate, starter tokens, starter components, React implementation coverage for active components, shared prototype fixtures, release checklist, starter kits, and runnable prototype examples.

React coverage currently exposes every registered component through `flow/react` and `flow/react/*`.

See `START.md` for what to edit and where.

Use `MIGRATE_PRODUCT_SCREEN.md` when turning an existing product screen into Design System artifacts.
