# Taxonomy Boundaries Audit

Status: pass

Component, primitive, pattern, and template boundaries must stay explicit so orchestration and business surfaces do not re-enter Flow as fake components. The actionable debt metric is taxonomyBoundaryDebt.

## Inventory

- Taxonomy file: packages/content/content/taxonomy-boundaries.json
- Rules: 5
- Decisions: 28
- Pattern decisions: 10
- Template decisions: 17
- Non-component decisions: 1
- Artifacts scanned: 186
- Cross-layer artifact ids: 1
- Unapproved cross-layer artifact ids: 0
- Artifact layer mismatches: 0
- Missing nested artifact records: 0
- Template artifacts without decisions: 0
- Template blueprints without artifacts: 0
- Template artifact/blueprint mismatches: 0
- Template dependency reference errors: 0
- Template catalog sync errors: 0
- Required boundary cases: 60
- Required boundary case violations: 0
- Foundation boundary cases: 7
- Primitive boundary cases: 14
- Component boundary cases: 10
- Pattern boundary cases: 21
- Template boundary cases: 7
- Non-component boundary cases: 1
- Duplicate ids: 0
- Audit errors: 0
- Taxonomy policy issues: 0
- Taxonomy boundary debt: 0
- Inventory baseline mismatches: 0
- Unexpected inventory metrics: 0

## Baseline Budget

Changing these numbers is a contract decision. Additions or removals must be reviewed as taxonomy changes, not component implementation churn.

| Metric | Expected | Actual |
| --- | ---: | ---: |
| rules | 5 | 5 |
| decisions | 28 | 28 |
| patternDecisions | 10 | 10 |
| templateDecisions | 17 | 17 |
| nonComponentDecisions | 1 | 1 |
| artifactsScanned | 186 | 186 |
| crossLayerArtifactIds | 1 | 1 |
| unapprovedCrossLayerArtifactIds | 0 | 0 |
| artifactLayerMismatches | 0 | 0 |
| missingNestedArtifactRecords | 0 | 0 |
| templateArtifactsWithoutDecisions | 0 | 0 |
| templateBlueprintsWithoutArtifacts | 0 | 0 |
| templateArtifactBlueprintMismatches | 0 | 0 |
| templateDependencyReferenceErrors | 0 | 0 |
| templateCatalogSyncErrors | 0 | 0 |
| requiredBoundaryCases | 60 | 60 |
| requiredBoundaryCaseViolations | 0 | 0 |
| foundationBoundaryCases | 7 | 7 |
| primitiveBoundaryCases | 14 | 14 |
| componentBoundaryCases | 10 | 10 |
| patternBoundaryCases | 21 | 21 |
| templateBoundaryCases | 7 | 7 |
| nonComponentBoundaryCases | 1 | 1 |
| duplicateIds | 0 | 0 |
| auditErrors | 0 | 0 |
| taxonomyPolicyIssues | 0 | 0 |
| taxonomyBoundaryDebt | 0 | 0 |

## Baseline Mismatches

| Metric | Expected | Actual |
| --- | ---: | ---: |
| None | None | None |

## Unexpected Inventory Metrics

| Metric | Actual |
| --- | ---: |
| None | None |

## Decisions

| Id | Layer | Replacement | Reason |
| --- | --- | --- | --- |
| alert-strip | non-component | notification-panel | Persistent alert aggregation is feedback orchestration; Toast, Error Panel, Badge, Button, and Notification Panel own the reusable parts. |
| bottom-sheet | pattern | bottom-sheet | Bottom Sheet is a 100% mobile overlay pattern with focus, dismissal, drag/state, and responsive orchestration beyond a bounded component. |
| checkbox-group | pattern | checkbox-group | Checkbox remains atomic; group label, select-all, mixed state, shared validation, and analytics are pattern-owned. |
| radio-group | pattern | radio-group | Radio Button remains atomic; exclusive group question, shared name, arrow navigation, validation, and layout are pattern-owned. |
| avatar-group | pattern | avatar-group | Avatar remains atomic; overflow, stacking, disclosure, permissions, and member detail are pattern-owned. |
| data-table | pattern | virtual-data-table | Table remains the component; sorting, filtering, pagination, column config, remote loading, and bulk actions belong to data-table patterns. |
| dashboard-filter-bar | pattern | advanced-filters | Filter bars coordinate query state, dependencies, saved views, refresh, and dashboard feedback. |
| driver-management-table | pattern | driver-and-vehicle-administration | Driver table behavior includes invite, suspend, edit, audit, permissions, and remote data operations. |
| vehicle-management-table | pattern | driver-and-vehicle-administration | Vehicle table behavior includes assignment, maintenance metadata, document state, grouping, and lifecycle. |
| sort-control | pattern | toolbar | Sorting usually belongs to table/list state, persistence, refresh, and result feedback. |
| chart-legend-item | pattern | chart-legend-item | Legend items are chart interaction patterns; they must not be promoted as standalone components. |
| configuration-console | template | configuration-console | Configuration Console is an administrative product surface that composes Topbar, Sidebar, Roles and Permissions, Driver and Vehicle Administration, and Authentication patterns with data, permissions, audit, and recovery ownership. |
| driver-card-wallet | template | driver-card-wallet | Driver Card Wallet is a focused product surface for card status, movement evidence, limits, quick actions, and support recovery; it must compose modules and patterns rather than becoming a component. |
| driver-mobile-app | template | driver-mobile-app | Driver Mobile App is a complete mobile product shell that proves onboarding, card readiness, nearby stations, and support recovery across mobile states and permissions. |
| fleet-dashboard-suite | template | fleet-dashboard-suite | Fleet Dashboard Suite is a multi-domain dashboard product surface that preserves shared filters, navigation, thresholds, drill-downs, and accountability across operational domains. |
| fleet-manager-desktop | template | fleet-manager-desktop | Fleet Manager Desktop is a desktop operating console that coordinates overview, exceptions, activity, filters, permissions, and follow-up across multiple patterns. |
| routes-and-stations | template | routes-and-stations | Routes and Stations is a mobile workspace that proves map/list station discovery, selected station detail, permissions, fallback, and route handoff through approved pattern and primitive dependencies. |
| agent-workspace | template | agent-workspace | Agent Workspace is a complete service workspace template that coordinates queue, thread, composer, context evidence, handoff, and recovery through governed chat components and feedback patterns. |
| internal-operations-console | template | internal-operations-console | Internal Operations Console is a desktop operations shell that proves case, ticket, account, pricing, approval, and growth workflows across governed patterns. |
| settings-workspace | template | settings-workspace | Settings Workspace is a complete product settings surface that coordinates sections, preferences, validation, theme, and danger-zone confirmation through governed patterns. |
| docs-shell-template | template | docs-shell-template | Docs Shell Template is the documentation product shell and must compose Topbar, Sidebar, Search, Command Palette, and Documentation Page Shell through Flow instead of owning shell behavior locally. |
| docs-home-template | template | docs-home-template | Docs Home Template is the documentation landing surface and must compose documentation patterns, primitives, and foundations instead of recreating editorial layout locally. |
| docs-collection-template | template | docs-collection-template | Docs Collection Template is the collection index surface for foundations, primitives, components, patterns, and templates; filtering, metadata, and section structure must stay governed. |
| component-detail-template | template | component-detail-template | Component Detail Template is the repeated component documentation surface and must compose Documentation Section, Demo Preview Frame, metadata, and navigation patterns through Flow. |
| pattern-detail-template | template | pattern-detail-template | Pattern Detail Template is the repeated pattern documentation surface and must keep demos, sections, metadata, and navigation inside governed Flow documentation patterns. |
| reference-detail-template | template | reference-detail-template | Reference Detail Template is the shared foundation and primitive reference surface and must keep research, measurement, sections, hero, and navigation governed by Flow. |
| template-detail-template | template | template-detail-template | Template Detail Template is the repeated product-template documentation surface and must compose Flow documentation patterns instead of defining bespoke page shells. |
| docs-artifact-detail-template | template | docs-artifact-detail-template | Docs Artifact Detail Template is the generic documentation artifact detail fallback and must stay a governed template boundary rather than becoming local page chrome in FlowDocs. |

## Artifact Layer Scan

Approved cross-layer artifact ids: iconography. Policy issues: 0.

| Id | Artifact Layers | Approved |
| --- | --- | --- |
| iconography | foundations, primitives | yes |

## Artifact Errors

| File | Id | Artifact Layer | Error |
| --- | --- | --- | --- |
| None | None | None | None |

## Template Dependency Scan

| Template | Decision | Blueprint | Pattern Dependencies | Template Modules | Primitive Dependencies | Foundations | Reference Errors | Catalog Sync Errors |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| agent-workspace | yes | yes | Agent Conversation, Topbar, Status Feedback View | Conversation queue, Agent Conversation, Agent state, Handoff recovery, Workspace context | Color, Density, Focus, Iconography, Message, Spacing, Surface, Typography | Accessibility, Frame, State, Tone, Voice | - | - |
| component-detail-template | yes | yes | Section Header, Documentation Section, Demo Preview Frame, On This Page Nav, Artifact Metadata Bar | - | Surface, Typography, Spacing, Breakpoints, Density, Focus, Loading, Disabled | Voice, Frame, Depth, State, Tone, Accessibility | - | - |
| configuration-console | yes | yes | Topbar, Sidebar, Roles and Permissions, Driver and Vehicle Administration, Authentication, Login, Biometrics and OTP | - | Color, Typography, Spacing, Surface, Density, Iconography, Focus, Loading, Disabled, Breakpoints, Charts | Energy, Voice, Frame, Depth, Momentum, State, Tone, Accessibility | - | - |
| docs-artifact-detail-template | yes | yes | Documentation Hero, Artifact Metadata Bar | - | Surface, Typography, Spacing, Breakpoints, Density, Focus, Loading, Disabled | Voice, Frame, Depth, State, Tone, Accessibility | - | - |
| docs-collection-template | yes | yes | Section Header, Search, Toolbar, Artifact Metadata Bar, Documentation Section | - | Surface, Spacing, Breakpoints, Density, Focus | Voice, Frame, Depth, State, Accessibility | - | - |
| docs-home-template | yes | yes | Section Header, Documentation Hero, Documentation Section, Artifact Metadata Bar | - | Surface, Typography, Spacing, Breakpoints, Density, Iconography | Voice, Frame, Depth, Growth, Accessibility | - | - |
| docs-shell-template | yes | yes | Topbar, Sidebar, Search, Command Palette, Documentation Page Shell | - | Surface, Spacing, Breakpoints, Density, Focus, Color, Typography | Frame, Depth, State, Accessibility, Voice | - | - |
| driver-card-wallet | yes | yes | - | Mobile Card Overview, Mobile Card Detail and Quick Actions, Mobile Movement Detail | Color, Typography, Spacing, Surface, Density, Iconography, Focus, Loading, Disabled, Breakpoints | Energy, Voice, Frame, Depth, Momentum, State, Tone, Accessibility | - | - |
| driver-mobile-app | yes | yes | Driver Onboarding Mobile, Station Discovery | Mobile Card Overview, Routes and Nearby Stations Mobile | Color, Typography, Spacing, Surface, Density, Iconography, Focus, Loading, Disabled, Breakpoints, Maps | Energy, Voice, Frame, Depth, Momentum, State, Tone, Accessibility | - | - |
| fleet-dashboard-suite | yes | yes | Topbar, Sidebar | Fleet Dashboard Overview, Fuel Dashboard, Maintenance Dashboard, Electromobility Dashboard, Toll Dashboard, Fleet Dashboard, Finance Dashboard | Color, Typography, Spacing, Surface, Density, Iconography, Focus, Loading, Disabled, Breakpoints, Charts | Energy, Voice, Frame, Depth, Momentum, State, Tone, Accessibility | - | - |
| fleet-manager-desktop | yes | yes | Topbar, Sidebar, Roles and Permissions | Fleet Dashboard Overview, Fuel Dashboard | Color, Typography, Spacing, Surface, Density, Iconography, Focus, Loading, Disabled, Breakpoints, Charts | Energy, Voice, Frame, Depth, Momentum, State, Tone, Accessibility | - | - |
| internal-operations-console | yes | yes | Topbar, Sidebar, Case Management, Ticket Queue, Account Operations, Pricing Operations, Backoffice Approval, Dense Operational List | Case operations, Ticket operations, Account operations, Pricing operations, Backoffice approvals, Growth operations | Color, Density, Focus, Iconography, Measurement, Message, Spacing, Surface, Typography | Accessibility, Frame, State, Tone, Voice | - | - |
| pattern-detail-template | yes | yes | Section Header, Documentation Section, Demo Preview Frame, On This Page Nav, Artifact Metadata Bar | - | Surface, Typography, Spacing, Breakpoints, Density, Focus, Message | Voice, Frame, Depth, State, Growth, Accessibility | - | - |
| reference-detail-template | yes | yes | Section Header, Documentation Hero, Documentation Section, On This Page Nav, Demo Preview Frame | - | Surface, Typography, Spacing, Breakpoints, Density, Message, Research, Measurement | Voice, Frame, Depth, State, Symbol, Accessibility | - | - |
| routes-and-stations | yes | yes | Station Discovery | Routes and Nearby Stations Mobile, Station Detail and Route Guidance | Color, Typography, Spacing, Surface, Density, Iconography, Focus, Loading, Disabled, Breakpoints, Maps | Energy, Voice, Frame, Depth, Momentum, State, Tone, Accessibility | - | - |
| settings-workspace | yes | yes | Preference Management | Section navigation, Preference management | Color, Density, Field Action, Focus, Iconography, Spacing, Surface, Typography | Accessibility, Frame, State, Tone, Voice | - | - |
| template-detail-template | yes | yes | Section Header, Documentation Section, Demo Preview Frame, Artifact Metadata Bar | - | Surface, Typography, Spacing, Breakpoints, Density, Focus, Loading | Voice, Frame, Depth, State, Tone, Accessibility | - | - |

## Template Blueprints Without Artifacts

| Blueprint | Expected Id |
| --- | --- |
| None | None |

## Required Boundary Cases

These are explicit guardrails for names that commonly drift between foundations, primitives, components, patterns, and templates. Surface is intentionally primitive; Card is intentionally component.

| Id | Expected Layer | Source | Actual Layer | Actual Replacement | File | Errors | Reason |
| --- | --- | --- | --- | --- | --- | --- | --- |
| avatar | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/avatar.json | - | Avatar remains atomic; disclosure and overflow are pattern-owned. |
| card | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/card.json | - | Card remains a bounded component, not a generic pattern container. |
| checkbox | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/checkbox.json | - | Checkbox remains atomic; group semantics are pattern-owned. |
| dialog | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/dialog.json | - | Dialog owns the modal primitive behavior that overlay patterns compose. |
| drawer | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/drawer.json | - | Drawer owns base panel behavior; adapters and sheets remain patterns. |
| menu | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/menu.json | - | Menu owns command list behavior used by pattern menus. |
| popover | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/popover.json | - | Popover owns anchored overlay behavior. |
| radio-button | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/radio-button.json | - | Radio Button remains atomic; group semantics are pattern-owned. |
| table | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/table.json | - | Table remains the base component; remote state and tools belong to patterns. |
| toast | component | artifact | component | - | packages/specs/specs/unison-system/artifacts/components/toast.json | - | Toast is a bounded feedback component; providers and panels are patterns. |
| accessibility | foundation | artifact | foundation | - | packages/specs/specs/unison-system/artifacts/foundations/accessibility.json | - | Accessibility is a governing foundation, not a component prop bundle. |
| depth | foundation | artifact | foundation | - | packages/specs/specs/unison-system/artifacts/foundations/depth.json | - | Depth is a foundation for hierarchy and elevation semantics. |
| frame | foundation | artifact | foundation | - | packages/specs/specs/unison-system/artifacts/foundations/frame.json | - | Frame governs composition and layout rhythm. |
| momentum | foundation | artifact | foundation | - | packages/specs/specs/unison-system/artifacts/foundations/momentum.json | - | Momentum governs motion intent before primitive curves implement it. |
| state | foundation | artifact | foundation | - | packages/specs/specs/unison-system/artifacts/foundations/state.json | - | State defines semantic behavior across components and patterns. |
| tone | foundation | artifact | foundation | - | packages/specs/specs/unison-system/artifacts/foundations/tone.json | - | Tone governs feedback language before primitives render it. |
| voice | foundation | artifact | foundation | - | packages/specs/specs/unison-system/artifacts/foundations/voice.json | - | Voice governs content decisions across UI layers. |
| alert-strip | non-component | taxonomy-decision | non-component | notification-panel | packages/content/content/taxonomy-boundaries.json | - | Alert strip must resolve to feedback orchestration instead of becoming another component. |
| action-sheet | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/action-sheet.json | - | Action sheet is a mobile interaction pattern over overlay components. |
| autocomplete | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/autocomplete.json | - | Autocomplete coordinates async suggestions, filtering, and input behavior. |
| avatar-menu | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/avatar-menu.json | - | Avatar menu composes Avatar, Menu, permissions, and account actions. |
| bottom-sheet | pattern | taxonomy-decision | pattern | bottom-sheet | packages/content/content/taxonomy-boundaries.json | - | Bottom sheet remains mobile overlay orchestration. |
| chart-legend-item | pattern | taxonomy-decision | pattern | chart-legend-item | packages/content/content/taxonomy-boundaries.json | - | Chart legend item remains chart interaction pattern. |
| checkbox-group | pattern | taxonomy-decision | pattern | checkbox-group | packages/content/content/taxonomy-boundaries.json | - | Checkbox group is pattern state around atomic Checkbox. |
| confirmation-dialog | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/confirmation-dialog.json | - | Confirmation dialog composes Dialog with destructive action workflow. |
| data-table | pattern | taxonomy-decision | pattern | virtual-data-table | packages/content/content/taxonomy-boundaries.json | - | Data table resolves to the Virtual Data Table pattern, not Table component inflation. |
| drawer-adapter | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/drawer-adapter.json | - | Drawer adapter maps responsive workflow behavior onto Drawer. |
| filter-chip-group | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/filter-chip-group.json | - | Filter chip group coordinates query state and removable filters. |
| fullscreen-sheet | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/fullscreen-sheet.json | - | Fullscreen sheet is responsive overlay orchestration. |
| multi-select | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/multi-select.json | - | Multi-select coordinates selection state across components. |
| notification-panel | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/notification-panel.json | - | Notification panel orchestrates feedback components and persistent alert state. |
| radio-group | pattern | taxonomy-decision | pattern | radio-group | packages/content/content/taxonomy-boundaries.json | - | Radio group is pattern state around atomic Radio Button. |
| roles-and-permissions | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/roles-and-permissions.json | - | Roles and permissions is business/state orchestration, not a table component. |
| search | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/search.json | - | Search coordinates input, results, empty states, shortcuts, and async behavior. |
| snackbar-provider | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/snackbar-provider.json | - | Provider behavior belongs above Toast as a pattern. |
| sort-control | pattern | taxonomy-decision | pattern | toolbar | packages/content/content/taxonomy-boundaries.json | - | Sort control belongs to toolbar/list state orchestration. |
| toolbar | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/toolbar.json | - | Toolbar coordinates command groups, filters, selection, and layout priority. |
| topbar | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/topbar.json | - | Topbar coordinates navigation, search, account menu, notifications, and responsive shell state. |
| virtual-data-table | pattern | artifact | pattern | - | packages/specs/specs/unison-system/artifacts/patterns/virtual-data-table.json | - | Virtual data table owns remote data, virtualization, selection, and table tooling. |
| breakpoints | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/breakpoints.json | - | Breakpoints are responsive primitives, not docs CSS behavior. |
| charts | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/charts.json | - | Charts are primitive visualization infrastructure for chart patterns and templates. |
| color | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/color.json | - | Color is a primitive token contract. |
| density | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/density.json | - | Density must cascade through Flow primitives before pattern layout adapts. |
| disabled | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/disabled.json | - | Disabled is a primitive state vocabulary. |
| elevation | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/elevation.json | - | Elevation implements depth decisions as a primitive. |
| field-action | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/field-action.json | - | Field action is the primitive affordance inside field-like components and patterns. |
| focus | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/focus.json | - | Focus is a primitive interaction affordance shared by components and patterns. |
| loading | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/loading.json | - | Loading is a primitive state vocabulary, not a one-off pattern style. |
| maps | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/maps.json | - | Maps are primitive infrastructure for station and route patterns. |
| radius | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/radius.json | - | Radius is a primitive token contract, not per-demo styling. |
| spacing | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/spacing.json | - | Spacing is a primitive consumed by components and patterns through cascade. |
| surface | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/surface.json | - | Surface is the grouping primitive; Card must not become the default wrapper for pattern groups. |
| typography | primitive | artifact | primitive | - | packages/specs/specs/unison-system/artifacts/primitives/typography.json | - | Typography is a primitive contract for text rendering. |
| configuration-console | template | artifact | template | - | packages/specs/specs/unison-system/artifacts/templates/configuration-console.json | - | Configuration Console is a product surface template. |
| docs-artifact-detail-template | template | artifact | template | - | packages/specs/specs/unison-system/artifacts/templates/docs-artifact-detail-template.json | - | Docs Artifact Detail Template is a documentation artifact detail fallback template, not reusable local docs markup. |
| driver-card-wallet | template | artifact | template | - | packages/specs/specs/unison-system/artifacts/templates/driver-card-wallet.json | - | Driver Card Wallet is a product surface template. |
| driver-mobile-app | template | artifact | template | - | packages/specs/specs/unison-system/artifacts/templates/driver-mobile-app.json | - | Driver Mobile App is a product surface template. |
| fleet-dashboard-suite | template | artifact | template | - | packages/specs/specs/unison-system/artifacts/templates/fleet-dashboard-suite.json | - | Fleet Dashboard Suite is a product surface template. |
| fleet-manager-desktop | template | artifact | template | - | packages/specs/specs/unison-system/artifacts/templates/fleet-manager-desktop.json | - | Fleet Manager Desktop is a product surface template. |
| routes-and-stations | template | artifact | template | - | packages/specs/specs/unison-system/artifacts/templates/routes-and-stations.json | - | Routes and Stations is a product surface template. |

## Errors

| Location | Message |
| --- | --- |
| None | None |

