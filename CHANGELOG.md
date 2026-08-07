# Changelog

## 0.3.0-platform-mvp

- Added GitHub Packages metadata for `@alohasoyrico-eng/flow` with public package exports.
- Added React implementation exports for every accepted component through `flow/react` and `flow/react/*`.
- Added a React primary contract audit for refs, types, display names, platform contracts, and public export parity.
- Added an isolated consumer install audit that installs the packed package outside FlowDocs and renders a real React screen.
- Added anti-duplication governance so docs cannot create parallel visual implementations for package-owned components or shared patterns.
- Added release guidance for SemVer, changelog policy, package dry runs, consumer smoke tests, and normal push/tag flow.
- No breaking changes for public import paths in this release line.
- Moved the documentation app to `apps/docs`.
- Moved machine-readable contracts to `packages/specs`.
- Moved artifact inventory, component copy, i18n shell copy, and template blueprints to `packages/content`.
- Moved the Architecture Gate and quality audit to `packages/audit`.
- Added `system.manifest.json` as the platform ownership contract.
- Added prototype packages: `packages/tokens` and `packages/components`.
- Added `examples/prototyping/basic.html` for consuming Design System without opening the docs app.
- Added shared prototyping fixtures plus fleet dashboard and driver mobile examples.
- Added a prototype index and connected the basic prototype to shared fixtures.
- Added root README and dependency-free smoke tests for Button, Select, and Card.
- Added importable component contracts and a product-screen migration guide.
- Added Icon Button and Text Field to the prototype component package.

## 0.2.9

- Design System docs site with foundations, primitives, components, patterns, templates, stack decisions, and audit rules.
