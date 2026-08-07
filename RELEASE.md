# Release And Publication

Use this checklist before calling a Flow package or docs build ready. A release is valid only when a product can install Flow from GitHub Packages, import React components and CSS from public exports, and run without depending on FlowDocs internals.

## Release Principles

- Flow is public to the organization through GitHub Packages as `@alohasoyrico-eng/flow`.
- Product apps may alias the package as `flow`, but package metadata must stay scoped.
- FlowDocs is a consumer. It can demonstrate behavior, but it must not own component, token, content, or spec truth.
- React is the primary implementation currently shipped. Angular and Flutter wait until real consumers and parity gates exist.
- Foundations and primitives remain platform-ready artifacts: CSS vars, JSON/source modules, contracts, and generated reports.

## Required Gates

- Run `npm run audit`.
- Run `npm test`.
- Run `npm run validate`.
- Run `npm run validate:system` in the Flow3.0 split repo.
- Run `npm run validate:docs` in the FlowDocs split repo.
- Run `npm pack --dry-run` and inspect that only public artifacts are included.
- Confirm `package.json` is publishable as `@alohasoyrico-eng/flow`.
- Confirm `package.json` has `publishConfig.registry` set to `https://npm.pkg.github.com`.
- Confirm product installs use the alias `flow` for `@alohasoyrico-eng/flow`.
- Confirm public artifacts are exported: tokens, token CSS, components, component CSS, contracts, platforms, React, content, and specs.
- Confirm `system.manifest.json` ownership matches the current platform shape.
- Confirm `apps/docs` only consumes package-owned truth.
- Confirm `packages/specs/specs/unison.system.json` is valid JSON.
- Confirm `packages/content/content/catalog.json` has expected inventory counts.
- Confirm `packages/tokens` exports semantic tokens.
- Confirm `packages/react/dist` exposes every accepted component through `flow/react` and `flow/react/*`.
- Confirm React components expose real refs, events, types, density, theme, state, and accessibility through the public contract.
- Confirm the isolated consumer install gate passes without FlowDocs, workspace globals, copied assets, or deep imports.
- Confirm `MIGRATE_PRODUCT_SCREEN.md` reflects the current package ownership model.
- Confirm `packages/content/content/fixtures/prototyping.json` powers the prototype examples.
- Confirm `examples/prototyping/index.html` opens from the local server.
- Confirm `examples/prototyping/basic.html` opens from the local server.
- Confirm `examples/prototyping/fleet-dashboard.html` opens from the local server.
- Confirm `examples/prototyping/driver-mobile.html` opens from the local server.
- Update `CHANGELOG.md`.

## Version Policy

- Use SemVer.
- Use `patch` for fixes that do not add or remove public API.
- Use `minor` for new components, tokens, patterns, or public package exports.
- Use `major` when a public component API, token semantic, import path, or contract changes incompatibly.
- Keep prerelease identifiers while the package is still platform MVP, for example `0.3.0-platform-mvp`.
- Treat changes to token semantics, component prop names, import paths, package exports, density behavior, theming behavior, accessibility semantics, or generated contracts as breaking unless a migration path is documented.

## Changelog Policy

- Every release updates `CHANGELOG.md`.
- The changelog entry must call out package shape, public exports, component coverage, foundations/primitives changes, audit gates, migration notes, and breaking changes.
- If there are no breaking changes, say so explicitly.
- Never publish a package whose `package.json` version and latest changelog heading disagree.

## GitHub Packages

Configure npm for the organization registry:

```ini
@alohasoyrico-eng:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Consumers install Flow with the package alias:

```json
{
  "dependencies": {
    "flow": "npm:@alohasoyrico-eng/flow@0.3.0-platform-mvp"
  }
}
```

Consumers import only public package surfaces:

```js
import { Button } from "flow/react";
import "flow/components/styles.css";
import "flow/tokens/styles.css";
```

Publish manually after validation:

```sh
npm pack --dry-run
npm publish
```

Then tag the release and push normally:

```sh
git tag v0.3.0-platform-mvp
git push origin main --tags
```

Do not force-push release commits or tags.

## Consumer Smoke Test

After publishing, create or reuse a product sandbox with the organization registry configured:

```json
{
  "dependencies": {
    "flow": "npm:@alohasoyrico-eng/flow@0.3.0-platform-mvp",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

Render a real screen:

```js
import { Button, Card, Input } from "flow/react";
import "flow/tokens/styles.css";
import "flow/components/styles.css";
```

The smoke test fails if it needs `apps/docs`, `../../packages`, workspace aliases, copied generated docs assets, or unpublished files.

## Manual Smoke Test

Start the local server:

```sh
npm run serve
```

Open:

- `http://127.0.0.1:53118/apps/docs/index.html`
- `http://127.0.0.1:53118/examples/prototyping/index.html`
- `http://127.0.0.1:53118/examples/prototyping/basic.html`
- `http://127.0.0.1:53118/examples/prototyping/fleet-dashboard.html`
- `http://127.0.0.1:53118/examples/prototyping/driver-mobile.html`

## Release Rule

If the Architecture Gate fails, the release does not ship.

If the isolated consumer install gate fails, the release does not ship.

If FlowDocs is the only place a component works, the release does not ship.
