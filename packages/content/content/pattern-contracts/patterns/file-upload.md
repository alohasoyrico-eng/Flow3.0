# File Upload

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/file-upload/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/file-upload.json`

## Purpose

Upload documents, invoices, vehicle files, or evidence with progress, validation, retry, removal, and completion feedback.

## Use When

- A process needs evidence, invoices, documents, or vehicle files.
- File type, size, progress, and retry policy must be visible.
- Users need to remove or replace a selected file before submitting.

## Do Not Use Without Review

- Upload destination, file policy, or retention rules are unclear.
- The upload contains regulated, legal, identity, or payment data without review.
- A simple link or existing document selector would be sufficient.

## Foundations

| Foundation | Contract |
| --- | --- |
| Frame | Defines upload surface, progress placement, file summary, and mobile stacking. |
| Voice | Owns file policy, validation, retry, remove, and success copy. |
| Energy | Controls focus, progress, error, success, and destructive remove states. |
| State | Empty, selected, uploading, invalid, retry, complete, and removed states are explicit. |
| Accessibility | Requires labelled trigger, validation text, progress announcement, and keyboard removal. |

## Formal Purpose

Coordinate file selection, validation, upload progress, empty guidance, status tags, and recovery actions without custom upload surfaces.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Cross-platform |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `desktops + TV` |

## Formal States

- `empty`
- `selected`
- `validating`
- `uploading`
- `complete`
- `invalid`
- `error`
- `disabled`

## Formal Dependencies

### Foundations

- `Accessibility`
- `Energy`
- `Frame`
- `State`
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

- `Button`
- `Empty State`
- `Inline Validation`
- `Progress Indicator`
- `Tag`
- `Toast`

### Tokens

- `comp.button.*`
- `comp.empty-state.*`
- `comp.inline-validation.*`
- `comp.progress-indicator.*`
- `comp.tag.*`
- `comp.toast.*`
- `sys.accessibility.*`
- `sys.energy.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.voice.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `surface` | `primitive` | `Surface` |
| `actions` | `component` | `Button` |
| `status` | `component` | `Progress Indicator`, `Tag`, `Inline Validation`, `Toast` |
| `emptyState` | `component` | `Empty State` |

## Formal Governance

### Entry Conditions

- Users must attach one or more files to a form, entity, or workflow.
- File type, size, count, permission, or network state needs visible handling.
- Upload progress or retry can occur after selection.

### Decision Tree

- Use Button with native file input only for a trivial attachment action.
- Use File Upload when guidance, validation, preview metadata, progress, or recovery is needed.
- Use a template when upload is part of a domain-specific onboarding or compliance flow.

### Failure Modes

- Dropzone or preview styling bypasses Surface, Tag, and Progress Indicator.
- Invalid file reasons are not visible.
- Upload progress has no text alternative.
- Retry and cancel are custom actions.

### Success Metrics

- Users can select, review, retry, and remove files predictably.
- Validation and progress are accessible.
- Upload visuals stay tokenized and component-owned.

### Accessibility

- Expose accepted type, size, and count guidance in text.
- Announce validation and progress changes.
- Keep keyboard access to select, retry, remove, and cancel actions.

### Tests

- Composes Surface, Button, Tag, Progress Indicator, Empty State, Inline Validation, and Toast.
- Covers empty, selected, validating, uploading, complete, invalid, and error states.
- Does not define custom dropzone visuals outside Flow components.

### Agent Instructions

- Compose from Flow components and keep storage/provider logic outside the pattern.
- Keep domain-specific file requirements in templates or app code.
- Ask before handling regulated, identity, payment, or health documents.

### Reject If

- Upload UI is a custom card/dropzone outside Surface.
- Progress is visual-only.
- Invalid reasons are hidden.
- Actions bypass Button.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| surface | Surface | yes | Structural owner for upload state, density, and recovery copy. |
| trigger | Button | yes | Starts file selection after user action. |
| summary | Tag | conditional | Selected file name or policy summary. |
| progress | ProgressIndicator | conditional | Upload progress. |
| validation | InlineValidation | conditional | File type, size, or upload error. |
| emptyState | EmptyState | conditional | Shown before a file is selected. |
| feedback | Toast | conditional | Reports upload completion or removal. |

## Components Used

- Button
- Progress Indicator
- Inline Validation
- Tag
- Empty State
- Toast

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| surface | Surface | yes | Structural owner for upload state, density, and recovery copy. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Empty upload | Current candidate | Button and policy copy before selection. |
| Uploading | Required state | Progress indicator appears after user action. |
| Invalid file | Required state | Inline validation explains policy. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Progress update | Progress changes without layout jump. |
| Completion | Toast reports success and keeps file summary visible. |
| Remove | Removing a file returns to empty state. |

## Accessibility

- Upload trigger has clear label.
- File restrictions are text-backed.
- Progress is visible and announced.
- Invalid files provide recovery copy.
- Remove action is keyboard reachable.

## Implementation Checklist

- Declare `surface`: Structural owner for upload state, density, and recovery copy.
- Declare `trigger`: Starts file selection after user action.
- Choose file shows file summary and progress.
- Invalid file shows Inline Validation.
- Remove returns to Empty State.
- Completion shows Toast.
- Progress remains readable on mobile.

## Tests And Rejection Rules

Must test:

- Choose file shows file summary and progress.
- Invalid file shows Inline Validation.
- Remove returns to Empty State.
- Completion shows Toast.
- Progress remains readable on mobile.

Reject if:

- File restrictions are missing.
- Progress or completion feedback is missing.
- Remove or retry behavior is undefined.

## MIEL

Agents can decide:

- Use File Upload when a process needs user-provided files.
- Use Progress Indicator for upload state.
- Use Inline Validation for file policy errors.

Agents must ask:

- Destination, retention, accepted file types, file size, privacy, or legal policy is unclear.

Agents must reject:

- File restrictions are missing.
- Progress or completion feedback is missing.
- Remove or retry behavior is undefined.

Handoff language:

> Confirm destination, file policy, retention, progress behavior, retry/remove behavior, and validation.
