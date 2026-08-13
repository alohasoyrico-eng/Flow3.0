# System Debt Ledger

Status: **pass**

Every audit report must expose numeric actionable debt, and the aggregate system debt must stay at 0 before Flow is considered product-ready.

## Inventory

- Reports scanned: 121
- Category mappings: 111
- System debt governance issues: 0
- Stale category mappings: 0
- Reports with debt metrics: 121
- Debt metrics: 144
- Categories: 9
- Category minimums: 9
- Category principles: 9
- Category minimum debt: 0
- Status debt: 0
- Non-pass reports: 0
- Categories missing minimums: 0
- Unexpected category minimums: 0
- Categories missing principles: 0
- Unexpected category principles: 0
- Categories with debt: 0
- Undercovered strategic categories: 0
- Uncategorized reports: 0
- Unexpected categories: 0
- Missing strategic categories: 0
- Empty strategic categories: 0
- Non-numeric debt metrics: 0
- Total numeric debt: 0
- Category debt: 0
- Category coverage debt: 0
- System debt: 0

## Categories

| Category | Principle | Reports | Minimum reports | Coverage gap | Debt metrics | Total debt |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| anti-duplication | One visual or conceptual source per system concept. | 4 | 1 | 0 | 4 | 0 |
| cascade | Component styling must cascade from exported system contracts. | 15 | 4 | 0 | 16 | 0 |
| docs-system-boundary | FlowDocs must consume Flow instead of owning system behavior. | 3 | 2 | 0 | 3 | 0 |
| foundations-primitives | Foundations and primitives must be exportable beyond CSS. | 31 | 1 | 0 | 33 | 0 |
| patterns | Patterns must compose components through governed contracts before template promotion. | 20 | 1 | 0 | 36 | 0 |
| quality | Component coverage must prove production readiness, not just presence. | 6 | 1 | 0 | 6 | 0 |
| react-primary | React must be the primary implementation with real contracts. | 39 | 10 | 0 | 41 | 0 |
| taxonomy | Components, primitives, patterns, and templates must stay separated. | 1 | 1 | 0 | 1 | 0 |
| templates | Templates must compose governed patterns and components instead of owning parallel product UI. | 2 | 1 | 0 | 4 | 0 |

## Non-Pass Reports

| Report | Status |
| --- | --- |
| None | None |

## Uncategorized Reports

| Report |
| --- |
| None |

## Stale Category Mappings

| Report |
| --- |
| None |

## Category Contract Gaps

| Gap | Value |
| --- | --- |
| None | None |

## Missing Debt Reports

| Report |
| --- |
| None |

## Non-Numeric Debt Metrics

| Report | Metric | Value |
| --- | --- | --- |
| None | None | None |

## Reports

| Report | Category | Status | Debt metrics |
| --- | --- | --- | --- |
| anti-duplication-coverage.json | anti-duplication | pass | antiDuplicationDebt: 0 |
| component-1to1-quality-matrix.json | quality | pass | qualityDebt: 0 |
| component-css-contract-coverage.json | cascade | pass | cssContractDebt: 0 |
| component-visual-cascade-audit.json | cascade | pass | visualCascadeDebt: 0 |
| docs-component-demo-ownership.json | docs-system-boundary | pass | docsDemoOwnershipDebt: 0 |
| docs-system-boundary-audit.json | docs-system-boundary | pass | docsSystemBoundaryDebt: 0 |
| email-channel-governance-audit.json | patterns | pass | emailChannelDebt: 0 |
| email-channel-renderer-audit.json | patterns | pass | emailRendererDebt: 0 |
| family-css-contract-maturity.json | cascade | pass | familyCssMaturityDebt: 0 |
| flowdocs-p0-shell-cleanup-evidence.json | docs-system-boundary | pass | flowDocsP0ShellCleanupDebt: 0 |
| foundation-accessibility-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-depth-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-energy-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-frame-cascade-audit.json | cascade | pass | frameCascadeDebt: 0<br>gapsDebt: 0 |
| foundation-growth-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-iconography-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-momentum-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-primitive-export-contract-audit.json | foundations-primitives | pass | foundationPrimitiveExportDebt: 0 |
| foundation-state-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-symbol-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-tone-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| foundation-voice-cascade-audit.json | cascade | pass | gapsDebt: 0 |
| legacy-dom-source-governance-audit.json | react-primary | pass | legacyDomSourceDebt: 0 |
| package-css-root-governance-audit.json | cascade | pass | packageCssRootDebt: 0 |
| pattern-1to1-architecture-audit.json | patterns | pass | patternArchitectureDebt: 0<br>patternArchitectureBlockingDebt: 0 |
| pattern-contract-governance-audit.json | patterns | pass | patternContractGovernanceDebt: 0 |
| pattern-foundation-primitive-1to1-audit.json | patterns | pass | debt: 0<br>patternsWithStructuralSurfaceDebt: 0<br>implementedReactPatternsWithArchitectureDebt: 0<br>foundationPrimitiveBlockingDebt: 0 |
| pattern-react-migration-audit.json | patterns | pass | reactBehaviorDebt: 0<br>migrationAuditDebt: 0 |
| pattern-react-migration-plan.json | patterns | pass | reactBehaviorDebt: 0<br>migrationAuditDebt: 0<br>docsReactPatternDemoCoverageDebt: 0<br>migrationPlanValidationDebt: 0 |
| pattern-readiness-audit.json | patterns | pass | patternReadinessDebt: 0 |
| primitive-animation-assets-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-breakpoints-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-cascade-activation-plan.json | foundations-primitives | pass | primitiveCascadeActivationPlanDebt: 0 |
| primitive-cascade-governance-audit.json | foundations-primitives | pass | primitiveCascadeGovernanceDebt: 0 |
| primitive-charts-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-color-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-country-flags-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-density-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-disabled-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-duration-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-elevation-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-field-action-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-focus-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-iconography-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-illustration-assets-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-library-sources-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-loading-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-maps-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-measurement-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-message-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-motion-curves-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-radius-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-research-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-spacing-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| primitive-surface-cascade-audit.json | foundations-primitives | pass | surfaceCascadeDebt: 0<br>gapsDebt: 0 |
| primitive-typography-cascade-audit.json | foundations-primitives | pass | gapsDebt: 0 |
| react-accessibility-governance-audit.json | react-primary | pass | accessibilityDebt: 0 |
| react-class-ownership-audit.json | react-primary | pass | classOwnershipDebt: 0 |
| react-composition-governance-audit.json | react-primary | pass | compositionDebt: 0 |
| react-contract-prop-alignment-audit.json | react-primary | pass | propAlignmentDebt: 0 |
| react-controlled-governance-audit.json | react-primary | pass | controlledDebt: 0 |
| react-default-governance-audit.json | react-primary | pass | defaultDebt: 0 |
| react-interaction-coverage-audit.json | react-primary | pass | interactionDebt: 0 |
| react-pattern-behavior-governance-audit.json | patterns | pass | patternsWithBehaviorDebt: 0<br>reactPatternBehaviorDebt: 0 |
| react-pattern-composition-governance-audit.json | patterns | pass | reactPatternCompositionDebt: 0 |
| react-primary-coverage-audit.json | react-primary | pass | primaryImplementationDebt: 0 |
| react-style-governance-audit.json | react-primary | pass | styleEscapeDebt: 0 |
| react-template-composition-governance-audit.json | react-primary | pass | reactTemplateCompositionGovernanceDebt: 0 |
| react-template-interaction-governance-audit.json | react-primary | pass | reactTemplateInteractionGovernanceDebt: 0 |
| react-template-runtime-governance-audit.json | react-primary | pass | reactTemplateRuntimeGovernanceDebt: 0<br>gapsDebt: 0 |
| react-template-visual-governance-audit.json | react-primary | pass | reactTemplateVisualGovernanceDebt: 0<br>gapsDebt: 0 |
| shell-pattern-contract-governance-audit.json | patterns | pass | shellPatternContractDebt: 0 |
| system-component-contract-typescript-surface.json | react-primary | pass | componentContractTypescriptSurfaceDebt: 0 |
| system-component-index-typescript-surface.json | react-primary | pass | componentIndexTypescriptSurfaceDebt: 0 |
| system-component-platform-typescript-surface.json | react-primary | pass | componentPlatformTypescriptSurfaceDebt: 0 |
| system-component-primitive-typescript-surface.json | react-primary | pass | componentPrimitiveTypescriptSurfaceDebt: 0 |
| system-component-registry-typescript-surface.json | react-primary | pass | componentRegistryTypescriptSurfaceDebt: 0 |
| system-phase1-style-dictionary-checkpoint.json | foundations-primitives | pass | phase1Debt: 0 |
| system-phase3-foundations-primitives-checkpoint.json | foundations-primitives | pass | foundationPrimitiveExportDebt: 0<br>phase3FoundationsPrimitivesDebt: 0 |
| system-phase4-component-cascade-checkpoint.json | quality | pass | componentCascadeAuditDebt: 0 |
| system-phase4-component-qa-checkpoint.json | quality | pass | componentQaDebt: 0 |
| system-phase4-core-controls-checkpoint.json | quality | pass | coreControlsFormsDebt: 0 |
| system-phase4-domain-complex-checkpoint.json | quality | pass | domainComplexDebt: 0 |
| system-phase4-overlays-navigation-data-checkpoint.json | quality | pass | overlaysNavigationDataDebt: 0 |
| system-phase5-data-domain-mobile-patterns-checkpoint.json | patterns | pass | reportDebt: 0<br>dataDomainMobilePatternDebt: 0 |
| system-phase5-interaction-patterns-checkpoint.json | patterns | pass | reportDebt: 0<br>interactionPatternDebt: 0 |
| system-phase5-pattern-1to1-checkpoint.json | patterns | pass | patternAuditDebt: 0 |
| system-phase5-pattern-governance-checkpoint.json | patterns | pass | checkpointDebt: 0<br>globalDebt: 0<br>patternGovernanceDebt: 0 |
| system-phase5-shell-patterns-checkpoint.json | patterns | pass | shellPatternDebt: 0 |
| system-phase6-template-audit-fixes-checkpoint.json | templates | pass | reportDebt: 0<br>templateAuditFixesDebt: 0 |
| system-phase6-template-qa-checkpoint.json | templates | pass | reportDebt: 0<br>templateQaDebt: 0 |
| system-react-affordance-typescript-surface.json | react-primary | pass | reactAffordanceTypescriptSurfaceDebt: 0 |
| system-react-base-components-typescript-surface.json | react-primary | pass | reactBaseComponentTypescriptSurfaceDebt: 0 |
| system-react-chat-components-typescript-surface.json | react-primary | pass | reactChatComponentsTypescriptSurfaceDebt: 0 |
| system-react-data-selection-typescript-surface.json | react-primary | pass | reactDataSelectionTypescriptSurfaceDebt: 0 |
| system-react-date-inputs-typescript-surface.json | react-primary | pass | reactDateInputsTypescriptSurfaceDebt: 0 |
| system-react-feedback-components-typescript-surface.json | react-primary | pass | reactFeedbackComponentsTypescriptSurfaceDebt: 0 |
| system-react-form-controls-typescript-surface.json | react-primary | pass | reactFormControlComponentTypescriptSurfaceDebt: 0 |
| system-react-input-localization-typescript-surface.json | react-primary | pass | reactInputLocalizationTypescriptSurfaceDebt: 0 |
| system-react-internal-props-typescript-surface.json | react-primary | pass | reactInternalPropsTypescriptSurfaceDebt: 0 |
| system-react-leaf-components-typescript-surface.json | react-primary | pass | reactLeafComponentTypescriptSurfaceDebt: 0 |
| system-react-motion-event-typescript-surface.json | react-primary | pass | reactMotionEventTypescriptSurfaceDebt: 0 |
| system-react-navigation-controls-typescript-surface.json | react-primary | pass | reactNavigationControlTypescriptSurfaceDebt: 0 |
| system-react-navigation-structure-typescript-surface.json | react-primary | pass | reactNavigationStructureTypescriptSurfaceDebt: 0 |
| system-react-overlay-components-typescript-surface.json | react-primary | pass | reactOverlayComponentTypescriptSurfaceDebt: 0 |
| system-react-payment-inputs-typescript-surface.json | react-primary | pass | reactPaymentInputsTypescriptSurfaceDebt: 0 |
| system-react-root-index-typescript-surface.json | react-primary | pass | reactRootIndexTypescriptSurfaceDebt: 0 |
| system-react-section-indexes-typescript-surface.json | react-primary | pass | reactSectionIndexTypescriptSurfaceDebt: 0 |
| system-react-summary-action-typescript-surface.json | react-primary | pass | reactSummaryActionTypescriptSurfaceDebt: 0 |
| system-token-ownership-matrix.json | foundations-primitives | pass | ownershipDebt: 0 |
| system-token-typescript-surface.json | react-primary | pass | tokenTypescriptSurfaceDebt: 0 |
| system-typescript-project-setup.json | react-primary | pass | typescriptProjectSetupDebt: 0 |
| taxonomy-boundaries-audit.json | taxonomy | pass | taxonomyBoundaryDebt: 0 |
| template-cascade-governance-audit.json | patterns | pass | templateCascadeGovernanceDebt: 0<br>gapsDebt: 0 |
| zip-flow-gap-audit.json | anti-duplication | pass | auditDebt: 0 |
| zip-foundation-primitive-validation-audit.json | foundations-primitives | pass | zipFoundationPrimitiveValidationDebt: 0 |
| zip-kit-cascade-matrix-audit.json | patterns | pass | layerCoverageDebt: 0<br>signalMappingDebt: 0<br>zipKitCascadeDebt: 0 |
| zip-kit-runtime-coverage-audit.json | patterns | pass | runtimeCoverageDebt: 0 |
| zip-owner-export-matrix-audit.json | patterns | pass | zipOwnerExportDebt: 0 |
| zip-system-intake-audit.json | anti-duplication | pass | intakeDebt: 0 |
| zip-template-parity-audit.json | anti-duplication | pass | parityGovernanceDebt: 0 |

