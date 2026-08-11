# Station Discovery

Generated portable agent contract for Design System.

Pattern copy remains the editable editorial source of truth. Formal states come from the pattern artifact. Regenerate this file with `npm run build:pattern-contracts` after changing either source.

Source content:

- `packages/content/content/pattern-copy/patterns/station-discovery/all.json`
- `packages/specs/specs/unison-system/artifacts/patterns/station-discovery.json`

## Purpose

Let drivers find stations through map pins, manual search, fallback lists, selected station detail, and route handoff while keeping location denial and map provider failure recoverable.

## Use When

- A route, fuel, EV, toll, or service task needs nearby station discovery.
- Map and fallback list must stay equivalent.
- Location permission, provider readiness, offline recovery, or route handoff is part of the experience.

## Do Not Use Without Review

- The station source, provider, or permission policy is unclear.
- The experience cannot provide a non-map fallback list.
- The map is decorative and does not support station selection or route handoff.

## Foundations

| Foundation | Contract |
| --- | --- |
| Accessibility | Requires list equivalence, text-backed pins, route summary copy, keyboard selection, and no map-only meaning. |
| Frame | Defines map/list balance, selected station placement, route handoff position, and responsive stacking. |
| Voice | Owns permission recovery, station labels, fallback reasons, ETA copy, provider missing copy, and route action language. |
| State | Nearby, selected, route, denied, offline, error, runtime unavailable, provider missing, loading, empty, and disabled states are explicit. |
| Depth | Uses Surface to own structural grouping and map/list layering instead of Card. |
| Momentum | Preserves focus and selected station context when switching between map, list, and route. |
| Energy | Controls station selection, route handoff priority, warning emphasis, and recovery action hierarchy. |
| Tone | Keeps provider, permission, offline, selected, and route recovery messages aligned to system severity. |

## Formal Purpose

Coordinate map-based station discovery with manual search, equivalent fallback list, selected station state, route handoff, permission recovery, and provider readiness without letting templates own map behavior.

## Formal Scope

| Field | Value |
| --- | --- |
| Layer | Pattern |
| Platform | Mobile |
| Audiences | `Product Designers`, `Developers`, `Content Designers`, `Researchers`, `Agents` |
| Density Context | `smartphones + phablets`, `tablets + laptops`, `reduced motion` |
| Template Dependencies | `Driver Mobile App`, `Routes and Stations` |

## Formal States

- `nearby`
- `selected`
- `route`
- `denied`
- `offline`
- `error`
- `runtimeUnavailable`
- `providerMissing`
- `loading`
- `empty`
- `disabled`

## Formal Dependencies

### Foundations

- `Energy`
- `Accessibility`
- `Frame`
- `Voice`
- `Momentum`
- `Depth`
- `State`
- `Tone`

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

- `Maps`
- `Surface`
- `Color`
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
- `Typography`
- `Breakpoints`
- `Density`

### Components

- `Button`
- `Empty State`
- `Error Panel`
- `Inline Validation`
- `List`
- `Route Summary`
- `Skeleton`
- `Station Pin`

### Patterns

- `Search`

### Tokens

- `map.*`
- `comp.station-pin.*`
- `comp.route-summary.*`
- `comp.list.*`
- `comp.empty-state.*`
- `comp.error-panel.*`
- `comp.inline-validation.*`
- `comp.skeleton.*`
- `comp.button.*`
- `sys.energy.*`
- `sys.voice.*`
- `sys.frame.*`
- `sys.state.*`
- `sys.depth.*`
- `sys.momentum.*`
- `sys.accessibility.*`
- `sys.tone.*`

## Formal Slots

| Slot | Owner | Uses |
| --- | --- | --- |
| `surface` | `primitive` | `Surface` |
| `mapLayer` | `primitive` | `Maps` |
| `search` | `pattern` | `Search` |
| `stationPins` | `component` | `Station Pin` |
| `fallbackList` | `component` | `List` |
| `routeSummary` | `component` | `Route Summary` |
| `state` | `component` | `Skeleton`, `Empty State`, `Error Panel`, `Inline Validation` |
| `actions` | `component` | `Button` |

## Formal Governance

### Entry Conditions

- Users need to discover nearby stations, compare stations, or hand a station into route guidance.
- Location permission, map provider readiness, offline state, or fallback list equivalence is part of the task.
- Station pins, list rows, selected station, and route summary must share the same source model.

### Decision Tree

- Use Station Discovery when map, fallback list, selected station, and route handoff must stay equivalent.
- Use Search alone when the task only filters a known station list and no map, permission, or route handoff exists.
- Use Route Summary alone when the station has already been chosen and the task is only route comparison.
- Use a template only to arrange Station Discovery with surrounding product modules, never to own map behavior.

### Failure Modes

- Map pins and fallback list disagree on labels, distance, status, or selected station.
- Location denial blocks discovery instead of exposing manual search and fallback list.
- Map runtime or provider setup is mounted directly by a component, demo, or template.
- Route handoff lacks text equivalent, ETA, or selected station context.
- A Card, docs wrapper, or template module owns structural surface behavior instead of Surface.

### Success Metrics

- Users can choose a station with or without map permission.
- Map and list present equivalent station information.
- Selected station and route action remain clear to keyboard and screen reader users.
- Templates consume the pattern and Maps primitive instead of defining parallel behavior.

### Agent Instructions

- Compose Station Discovery from Maps primitive, Surface, Search, Station Pin, List, Route Summary, Empty State, Error Panel, Skeleton, Inline Validation, and Button.
- Always provide fallback list data even when map runtime and provider are ready.
- Permission denied, provider missing, and runtime unavailable are first-class states, not blockers.
- Never mount MapLibre, tile providers, or route runtime directly from components, docs, demos, or templates.
- Use Surface for structural grouping; do not use Card as a generic station-discovery wrapper.

### Reject If

- Map has no fallback list.
- Permission denial prevents manual search or station selection.
- Station pin meaning exists only visually.
- Route summary lacks a text equivalent.
- A template or demo duplicates map/list/route behavior outside this pattern.
- Card is used as the structural owner for the group.

## Slot Contract

| Slot | Type | Required | Notes |
| --- | --- | --- | --- |
| surface | Surface | yes | Structural owner for background, density cascade, and station-discovery state. |
| mapLayer | Maps | yes | Permission, runtime, selected station, pins, clusters, route, and fallback-list model. |
| search | Search | dependency | Manual station lookup and permission/provider recovery path. |
| stationPins | Station Pin | yes | Station markers generated from the Maps primitive model. |
| fallbackList | List | yes | Equivalent station rows when map interaction is unavailable or secondary. |
| routeSummary | Route Summary | conditional | Selected station ETA, distance, and route handoff. |
| state | Skeleton \| Empty State \| Error Panel \| Inline Validation | yes | Loading, denied, provider missing, runtime unavailable, empty, offline, and error recovery. |
| actions | Button | conditional | Retry, refresh, manual search, or route handoff command. |

## Components Used

- Button
- Empty State
- Error Panel
- Inline Validation
- List
- Route Summary
- Skeleton
- Station Pin

## Primitive Slot Ownership

| Slot | Primitive | Required | Notes |
| --- | --- | --- | --- |
| surface | Surface | yes | Structural owner for background, density cascade, and station-discovery state. |
| mapLayer | Maps | yes | Permission, runtime, selected station, pins, clusters, route, and fallback-list model. |

## Variants

| Variant | Status | Rule |
| --- | --- | --- |
| Nearby | Required | Map/list station discovery with granted or prompt permission. |
| Permission denied | Required state | Manual search and fallback list continue the task without location. |
| Provider missing | Required state | The Maps primitive reports provider readiness while list fallback remains usable. |
| Selected station | Required | Selected pin/list row and route summary share station context. |
| Route handoff | Candidate | Selected station produces ETA, distance, action, and recovery copy. |

## Motion Contract

| Behavior | Rule |
| --- | --- |
| Selection | Pin/list selection updates context without moving focus unexpectedly. |
| Fallback transition | Denied or provider-missing state reveals search/list recovery without decorative motion. |
| Route handoff | Route summary appears in place and respects reduced motion. |

## Accessibility

- Every station pin has an accessible label matching fallback list content.
- Fallback list remains present for denied, unavailable, provider missing, and runtime unavailable states.
- Permission and provider failures are text-backed and actionable.
- Route summary includes station, ETA, distance, and action meaning without relying on the map.
- Keyboard users can search, select a station, and start route handoff.

## Implementation Checklist

- Declare `surface`: Structural owner for background, density cascade, and station-discovery state.
- Declare `mapLayer`: Permission, runtime, selected station, pins, clusters, route, and fallback-list model.
- Declare `stationPins`: Station markers generated from the Maps primitive model.
- Declare `fallbackList`: Equivalent station rows when map interaction is unavailable or secondary.
- Declare `state`: Loading, denied, provider missing, runtime unavailable, empty, offline, and error recovery.
- Denied location renders manual search and fallback list.
- Provider missing keeps fallback list visible.
- Selecting a pin or list row calls the same station select callback.
- Route handoff preserves selected station context.
- No Card wrapper is used for structural grouping.
- Map runtime is only accessed through the Maps primitive.

## Tests And Rejection Rules

Must test:

- Denied location renders manual search and fallback list.
- Provider missing keeps fallback list visible.
- Selecting a pin or list row calls the same station select callback.
- Route handoff preserves selected station context.
- No Card wrapper is used for structural grouping.
- Map runtime is only accessed through the Maps primitive.

Reject if:

- There is no fallback list.
- Permission denial blocks discovery.
- The map is mounted directly outside the Maps primitive.
- Card is used as the structural wrapper.

## MIEL

Agents can decide:

- Use Station Discovery for nearby station, route, fuel, EV, toll, or service discovery.
- Choose default copy from permission, provider, offline, and route states.
- Use fallback list whenever map state is degraded.

Agents must ask:

- Provider, tile source, geolocation permissions, routing service, telemetry, or station data ownership is unclear.
- Station results cross tenant, region, policy, or regulated data boundaries.

Agents must reject:

- There is no fallback list.
- Permission denial blocks discovery.
- The map is mounted directly outside the Maps primitive.
- Card is used as the structural wrapper.

Handoff language:

> Confirm station source, map provider, permission policy, fallback list, selected station model, route handoff, offline behavior, and telemetry boundaries.
