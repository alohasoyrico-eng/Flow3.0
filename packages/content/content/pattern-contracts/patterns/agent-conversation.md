# Agent Conversation

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/agent-conversation/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/agent-conversation.json`

## Purpose

Coordinate Chat Thread, Chat Composer, and handoff/status feedback as one reusable conversational workflow without creating a parallel chat shell.

## Use When

- A template needs reusable conversation behavior.
- Thread, composer, send, attach, handoff, offline, and error states must act as one flow.
- Agent Workspace is necessary but not ready to own product navigation or tooling.

## Do Not Use Without Review

- The experience is a static message transcript.
- The flow includes regulated identity, finance, safety, health, legal, or compliance operations.
- A product template is trying to redefine Chat Thread, Chat Composer, or Status Feedback View behavior.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | The conversation group, log semantics, form semantics, busy state, and feedback stay announced through formal owners. |
| Depth | Surface owns the conversation structure and focus-within grouping without Card wrapping. |
| Energy | Composing, sending, handoff, offline, error, disabled, and recovery states cascade to child owners. |
| Frame | Responsive message rhythm and composer placement remain token-driven. |
| Growth | Agent handoff stays observable for templates without moving behavior into the template layer. |
| Iconography | Attach and recovery icons remain owned by Chat Composer and child components. |
| Momentum | Sending and handoff motion use existing child owners. |
| State | Pattern state maps to thread, feedback, and composer states. |
| Symbol | Handoff and recovery symbols remain semantic through feedback owners. |
| Tone | Assistant, system, error, offline, and handoff tone stay in Flow contracts. |
| Voice | Message, empty, offline, composer, and handoff copy remains explicit and recoverable. |

## Formal Purpose

Coordinate a governed conversational workspace from Chat Thread, Chat Composer, and handoff feedback without creating a parallel chat shell in templates.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `mobile`, `tablets + laptops`, `desktops + TV` |
| Template Dependencies | `Agent Workspace` |

## Formal States

- `default`
- `active`
- `composing`
- `sending`
- `handoff`
- `offline`
- `error`
- `disabled`

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
- `Disabled`
- `Duration`
- `Elevation`
- `Field Action`
- `Focus`
- `Iconography`
- `Loading`
- `Measurement`
- `Message`
- `Motion Curves`
- `Radius`
- `Spacing`
- `Surface`
- `Typography`

### Components

- `Chat Composer`
- `Chat Thread`

### Patterns

- `Status Feedback View`

### Tokens

- `comp.chat-composer.*`
- `comp.chat-thread.*`
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
| `conversationSurface` | `primitive` | `Surface` |
| `thread` | `component` | `Chat Thread` |
| `handoffFeedback` | `pattern` | `Status Feedback View` |
| `composer` | `component` | `Chat Composer` |

## Formal Governance

### Entry Conditions

- A product surface needs a reusable conversational workflow.
- Thread, compose, send, attach, offline, error, and handoff states must move together.
- The product template must not own chat bubbles, composer fields, or handoff feedback.

### Decision Tree

- Use Chat Thread when only a read-only message log is needed.
- Use Chat Composer when only a message input is needed.
- Use Agent Conversation when thread, composer, and handoff/feedback need one coordinated contract.
- Use a product template only after navigation, workspace modules, or agent tooling extend beyond the conversation pattern.

### Failure Modes

- Templates render custom message bubbles or textarea shells.
- Handoff status appears as local copy instead of Status Feedback View.
- Composer send/attach callbacks bypass Chat Composer.
- Thread state and composer state diverge during sending, offline, or disabled flows.

### Success Metrics

- Users can read messages, recover failed message actions, compose, send, attach, and understand handoff state from one predictable flow.
- Density and state cascade from Surface to thread, feedback, and composer.
- Agent Workspace templates can reuse the pattern without redefining conversation behavior.

### Accessibility

- Expose the conversation as a labelled group with busy state.
- Delegate log semantics to Chat Thread.
- Delegate form semantics to Chat Composer.
- Keep handoff and recovery feedback in Status Feedback View.

### Tests

- Composes Surface, Chat Thread, Chat Composer, and Status Feedback View.
- Covers default, active, composing, sending, handoff, offline, error, and disabled states.
- Forwards message action, composer change, send, attach, handoff action, and feedback action callbacks.
- Rejects local chat bubbles, local composers, card wrappers, raw message shells, and Docs-owned chat UI.

### Agent Instructions

- Do not create custom message bubble visuals.
- Do not create custom composer inputs.
- Use Surface for structural grouping; do not wrap this pattern in Card to create chat panels.
- Ask before using agent handoff for regulated financial, identity, health, legal, or safety operations.

### Reject If

- Messages bypass Chat Thread or Chat Message.
- Composer bypasses Chat Composer.
- Handoff feedback bypasses Status Feedback View.
- Card wraps the conversation group.
- Density or state stops cascading to the thread, feedback, or composer.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| conversationSurface | Surface | required | Structural conversation group. |
| thread | Chat Thread | required | Message log, selected message, and message actions. |
| handoffFeedback | Status Feedback View | conditional | Handoff, offline, status, or recovery feedback. |
| composer | Chat Composer | conditional | Message entry, send, attach, and sending state. |

## Components Used

- Chat Composer
- Chat Thread

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| conversationSurface | Surface | required | Structural conversation group. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Read/write | Default | Includes thread and composer. |
| Read-only | Conditional | Omits composer for audit or closed conversations. |
| Handoff | Conditional | Uses Status Feedback View for human or agent handoff. |
| Offline | State | Delegates unavailable log state to Chat Thread and recovery to feedback. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Sending | Surface marks busy while Chat Composer owns send loading. |
| Handoff | Surface marks selected state while Status Feedback View owns handoff feedback. |
| Offline or error | Thread and feedback own recovery states. |

## Accessibility

- Expose the whole conversation as a labelled group.
- Delegate log semantics to Chat Thread.
- Delegate message input semantics to Chat Composer.
- Keep handoff and recovery feedback in Status Feedback View.

## Implementation Checklist

- Composes Surface plus Chat Thread, Chat Composer, and Status Feedback View.
- Density and state cascade through child owners.
- Callbacks preserve event context.
- No Card wrapper, raw message shell, local composer, fake bubble, or local handoff notice is emitted.

## Tests And Rejection Rules

Must test:

- Composes Surface plus Chat Thread, Chat Composer, and Status Feedback View.
- Density and state cascade through child owners.
- Callbacks preserve event context.
- No Card wrapper, raw message shell, local composer, fake bubble, or local handoff notice is emitted.

Reject if:

- Messages are rendered outside Chat Thread.
- Composer bypasses Chat Composer.
- Card wraps the conversation group.
- Handoff feedback bypasses Status Feedback View.

## MIEL

Agents can decide:

- Use Agent Conversation for reusable chat workflows.
- Omit composer for read-only transcripts.
- Keep product-specific tools and permissions outside the pattern.

Agents must ask:

- The agent can perform regulated, destructive, identity, finance, legal, health, or safety actions.
- A template wants custom message bubbles instead of Chat Thread semantics.
- The flow needs multi-agent routing, transcript export, or tool execution.

Agents must reject:

- Messages are rendered outside Chat Thread.
- Composer bypasses Chat Composer.
- Card wraps the conversation group.
- Handoff feedback bypasses Status Feedback View.

Handoff language:

> Confirm message source, author model, composer policy, attachment policy, handoff rules, offline behavior, recovery feedback, and regulatory risk before shipping Agent Conversation.
