# Agent Starter Kit

Use this path when an AI agent changes Design System.

## Before Editing

1. Read `system.manifest.json`.
2. Identify the layer: foundation, primitive, component, pattern, template, or docs consumer.
3. Confirm whether the target is source truth or documentation.
4. Read the package contract before editing an adapter.
5. Check whether the change must cascade into React, docs, tests, and audits. Do not add idle Angular or Flutter code without a real consumer.

Reject work that moves source-of-truth files back into the docs app or workspace root.

## Package Boundaries

- `Flow3.0` owns foundations, primitives, specs, tokens, components, platform adapters, content, and audits.
- `FlowDocs` owns rendering, examples, routes, and documentation-specific UX.
- Docs consumes `flow`; it does not redefine component APIs, token values, copy contracts, or platform behavior.
- Consumers import public surfaces such as `flow/components`, `flow/react`, `flow/components/styles.css`, `flow/tokens/styles.css`, and `flow/specs/system`.
- Agents must not import or recommend `flow/packages/...` from a consuming app.

## Component Adapter Rule

When migrating a component, finish one component completely:

1. Update the canonical component contract in `packages/components/src/contracts.js`.
2. Update the DOM factory and shared CSS in `packages/components`.
3. Update the platform contract in `packages/components/src/platforms`.
4. Update React in `packages/react` when the consumer surface needs React.
5. Do not add Angular or Flutter adapters until there is a real consuming app, starter, and parity test.
7. Update docs only as a consumer.
8. Add or update audits so the same mistake cannot return.
9. Run `npm run validate`.

## Human Handoff

Leave a human-readable note with:

- what public import changed;
- which adapters are supported;
- which validation command passed;
- any platform still intentionally unsupported.
