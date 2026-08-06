# Release Checklist

Use this checklist before calling a Design System package or docs build ready.

## Required

- Run `npm run audit`.
- Run `npm test`.
- Run `npm run validate`.
- Confirm `package.json` is publishable as `@alohasoyrico-eng/flow`.
- Confirm `package.json` has `publishConfig.registry` set to `https://npm.pkg.github.com`.
- Confirm product installs use the alias `flow` for `@alohasoyrico-eng/flow`.
- Confirm public artifacts are exported: tokens, token CSS, components, component CSS, contracts, platforms, React, content, and specs.
- Confirm `system.manifest.json` ownership matches the current platform shape.
- Confirm `apps/docs` only consumes package-owned truth.
- Confirm `packages/specs/specs/unison.system.json` is valid JSON.
- Confirm `packages/content/content/catalog.json` has expected inventory counts.
- Confirm `packages/tokens` exports semantic tokens.
- Confirm `packages/components` exports Button, Icon Button, Text Field, Select, and Card.
- Confirm `packages/components/src/contracts.js` documents Button, Icon Button, Text Field, Select, and Card public contracts.
- Confirm `packages/components/test/smoke.test.mjs` covers Button, Icon Button, Text Field, Select, and Card.
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
npm publish
```

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
