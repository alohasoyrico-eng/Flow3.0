# Email Template Layout

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/email-template-layout/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/email-template-layout.json`

## Purpose

Render Flow transactional and lifecycle emails as portable HTML-email markup while preserving Flow foundations through explicit, email-safe inline values.

## Use When

- A Flow message must render inside email clients with limited CSS and no JavaScript.
- The message needs preheader, brand shell, content card, CTA link, data rows, KPIs, OTP/security block, invite copy, onboarding steps, or legal footer.
- A product or lifecycle flow needs a package-owned email renderer before ESP handoff.

## Do Not Use Without Review

- The surface is an in-product notification, toast, dialog, or dashboard.
- The message includes regulated, legal, financial, unsubscribe, or security language that needs approval.
- The target ESP requires a custom merge-tag language or VML button treatment.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Document language, title, preheader, presentation tables, visible CTA text, and text-backed warnings keep email readable across clients. |
| Depth | The email card and shell use explicit border and background values because email clients cannot depend on runtime depth primitives. |
| Energy | Brand, success, warning, danger, muted, border, and page colors are translated to fixed email-safe values. |
| Frame | A 600px table shell, responsive class hooks, and padding cells own email layout. |
| Growth | Receipt, summary, security, invite, welcome, and base layouts share one renderer instead of cloning shell markup. |
| Iconography | Icon-like security signals are optional text-backed content, never the only meaning. |
| Momentum | Email has no motion or JavaScript; delivery state is represented by static copy. |
| State | Draft, ready, sent, and error are production lifecycle states, not interactive UI states. |
| Symbol | Amounts, OTP codes, card fragments, warning labels, and step numbers remain textual. |
| Tone | Email copy stays short, direct, and channel-appropriate. |
| Voice | Preheader, headline, CTA, note, and footer are explicit content slots. |

## Formal Purpose

Render Flow transactional and lifecycle emails as portable HTML-email markup while preserving Flow foundations through explicit, email-safe inline values.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Email channel |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Lifecycle Marketers`, `Agents` |
| Density Context | `email clients`, `mobile inboxes`, `desktop inboxes` |

## Formal States

- `default`
- `draft`
- `ready`
- `sent`
- `error`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `Growth`
- `Iconography`
- `Momentum`
- `State`
- `Symbol`
- `Tone`
- `Voice`

### Foundation Dependencies

- `Accessibility`
- `Depth`
- `Energy`
- `Frame`
- `Growth`
- `Iconography`
- `Momentum`
- `State`
- `Symbol`
- `Tone`
- `Voice`

### Primitives

- `Breakpoints`
- `Color`
- `Density`
- `Duration`
- `Iconography`
- `Message`
- `Radius`
- `Spacing`
- `Typography`

### Tokens

- `sys.accessibility.*`
- `sys.depth.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.growth.*`
- `sys.iconography.*`
- `sys.momentum.*`
- `sys.state.*`
- `sys.symbol.*`
- `sys.tone.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `emailDocument` | `channel` | `HTML Email` |
| `emailHead` | `channel` | `Meta`, `Media Query` |
| `emailPreheader` | `primitive` | `Message` |
| `emailShell` | `channel` | `Presentation Table` |
| `emailContentCard` | `channel` | `Presentation Table` |
| `emailCta` | `channel` | `Anchor Table` |
| `emailDataRows` | `channel` | `Presentation Table` |
| `emailMetricsGrid` | `channel` | `Presentation Table` |
| `emailOtpBlock` | `channel` | `Presentation Table` |
| `emailSteps` | `channel` | `Presentation Table` |
| `emailFooter` | `primitive` | `Message` |

## Formal Governance

### Entry Conditions

- A Flow message must render inside email clients that do not reliably support React runtime, CSS custom properties, flexbox, grid, or JavaScript.
- The message uses Flow brand shell, preheader, primary content card, CTA link, tabular detail, KPI summary, OTP/security block, invitation copy, onboarding steps, or legal footer.
- The content must be generated from Flow React for consistency but emitted as HTML email-safe markup.

### Decision Tree

- Use web patterns for in-product notification centers, toasts, dialogs, or dashboards.
- Use Email Template Layout for outbound email markup, including receipt, summary, security alert, invite, welcome, and base layout variants.
- Use a downstream ESP template only after this pattern has produced the portable HTML contract.

### Failure Modes

- A product template owns email shell, footer, CTA table, or preheader markup directly.
- Email content uses Flow web components such as Button, Card, Table, Toast, Dialog, Drawer, or Surface.
- Email markup relies on CSS custom properties, flexbox, grid, client-side JavaScript, or web fonts.
- Legal footer, preheader, alt/fallback text, or text-backed security copy is missing.

### Success Metrics

- Base, transactional, operational-summary, security-alert, team-invite, and welcome variants render as static HTML email-safe markup.
- Foundation decisions are translated into inline color, type, spacing, radius, state, and tone values with no docs or product shell ownership.
- The renderer emits presentation tables, hidden preheader, 600px container, responsive class hooks, CTA anchor table, and legal footer.

### Accessibility

- Use semantic document language and title.
- Use hidden preheader text for inbox context.
- Use role=presentation tables for layout tables.
- Keep CTA as an anchor with visible text, never a button.
- Represent OTP, warning, transactional, invite, and onboarding copy with text, not icon or color alone.

### Tests

- Renders base, transactional, operational-summary, security-alert, team-invite, and welcome variants.
- Emits html/head/body, hidden preheader, presentation tables, CTA anchors, responsive class hooks, and footer.
- Rejects Flow web components, local web Button/Card/Table/Toast/Dialog/Drawer/Surface usage, CSS custom properties, flex/grid, JavaScript, and injected markup.
- Confirms no interactive callbacks are required for email channel markup.

### Agent Instructions

- Use this pattern for outbound email families only.
- Do not compose Flow web components inside email markup; translate foundation decisions into email-safe inline styles.
- Keep all actions as links and assume the ESP/client owns tracking and delivery.
- Ask before adding legal, regulated, financial, security, or unsubscribe copy.

### Reject If

- The email layout uses Flow web components.
- The email uses flex, grid, CSS custom properties, JavaScript, or web fonts.
- The pattern becomes a docs-only preview instead of package-owned renderer.
- A product template clones the email shell or footer.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| emailDocument | HTML Email | required | Root html document with language and Flow channel marker. |
| emailHead | Meta \| Media Query | required | Email-safe head metadata and narrow-screen class hooks. |
| emailPreheader | Message | required | Hidden inbox summary. |
| emailShell | Presentation Table | required | Page background, centered 600px shell, brand and footer. |
| emailContentCard | Presentation Table | required | Main white content card. |
| emailCta | Anchor Table | conditional | Primary action rendered as an anchor in a table cell. |
| emailDataRows | Presentation Table | conditional | Receipt/security key-value rows. |
| emailMetricsGrid | Presentation Table | conditional | Operational summary KPI grid. |
| emailOtpBlock | Presentation Table | conditional | Security code block. |
| emailSteps | Presentation Table | conditional | Welcome/onboarding checklist. |
| emailFooter | Message | required | Legal, preference, and unsubscribe footer copy. |

## Components Used

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| emailPreheader | Message | required | Hidden inbox summary. |
| emailFooter | Message | required | Legal, preference, and unsubscribe footer copy. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Base | Default | Reusable shell with preheader, content card, CTA, and footer. |
| Transactional | Receipt | Amount, merchant/time, card/category/consumption/driver rows, dispute note, and detail CTA. |
| Operational summary | Weekly summary | KPI grid, attention list, and dashboard CTA. |
| Security alert | OTP/login | Device metadata, verification code, expiry, and account protection note. |
| Team invite | Invite | Inviter, organization, role scope, expiry, and accept CTA. |
| Welcome | Onboarding | Verification confirmation, next-step checklist, and open Flow CTA. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Static | Email clients do not run motion; no animation or JavaScript is allowed. |
| Responsive | Only minimal media-query class hooks are allowed for padding/container width. |
| Fallback | All meaning remains visible if images or styles are partially blocked. |

## Accessibility

- Use html lang and title.
- Use hidden preheader text.
- Use role=presentation on layout tables.
- Use anchors for CTAs.
- Keep OTP, warnings, amounts, and footers textual.

## Implementation Checklist

- Renders all six ZIP email concepts through one channel pattern.
- Verifies hidden preheader, presentation tables, CTA anchors, OTP/code block, KPI grid, rows, steps, and footer.
- Verifies no Flow web component class roots, flex/grid/CSS variables, script tags, or injected markup.
- Verifies no interaction callbacks are required.

## Tests And Rejection Rules

Must test:

- Renders all six ZIP email concepts through one channel pattern.
- Verifies hidden preheader, presentation tables, CTA anchors, OTP/code block, KPI grid, rows, steps, and footer.
- Verifies no Flow web component class roots, flex/grid/CSS variables, script tags, or injected markup.
- Verifies no interaction callbacks are required.

Reject if:

- Email markup imports Flow web UI components.
- Email layout uses CSS variables, flex, grid, scripts, or web fonts.
- The shell or footer is cloned inside a product template.

## MIEL

Agents can decide:

- Use Email Template Layout for outbound email shell and variants.
- Use anchors for CTAs and presentation tables for layout.
- Keep content short and text-backed.

Agents must ask:

- Before legal, unsubscribe, financial, security, or compliance copy changes.
- Before adding ESP-specific merge tags, tracking, VML, or localization rules.
- Before treating an in-product notification as email.

Agents must reject:

- Email markup imports Flow web UI components.
- Email layout uses CSS variables, flex, grid, scripts, or web fonts.
- The shell or footer is cloned inside a product template.

Handoff language:

> Confirm channel, variant, preheader, headline, CTA URL, data rows, legal footer, localization, ESP merge tags, and render QA requirements.
