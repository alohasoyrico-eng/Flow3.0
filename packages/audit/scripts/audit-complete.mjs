#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const auditScriptsDir = path.join(root, "packages/audit/scripts");
const forbiddenPrefix = "fl" + "ow-";
const hasDocsApp = fs.existsSync(path.join(root, "apps/docs"));
const hasDocsConsumerApp = [
  path.join(root, "../FlowDocs/apps/docs"),
  path.join(root, "apps/docs"),
].some((dir) => fs.existsSync(dir));
const hasZipAuditRoot = fs.existsSync("/private/tmp/flow-zip-audit");
const hasFoundationDependencyMatrix = hasRepoFile("docs/audits/foundation-dependency-matrix.json");
const hasPrimitiveCascadeGate = hasFoundationDependencyMatrix
  && hasRepoFile("docs/audits/foundation-frame-cascade-audit.json")
  && hasRepoFile("docs/audits/primitive-density-cascade-audit.json")
  && hasRepoFile("docs/audits/primitive-spacing-cascade-audit.json");
const primitiveCascadeGovernance = readJsonIfExists(
  path.join(root, "packages/content/content/primitive-cascade-governance.json"),
  { activeCascadeReports: ["surface"], backlogCascadeReports: {} },
);

function hasRepoFile(file) {
  return fs.existsSync(path.join(root, file));
}

function readJsonIfExists(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

const expectedAuditFiles = new Set([
  "audit-adoption-readiness.js",
  "audit-anti-duplication.js",
  "audit-accessibility-contracts.js",
  "audit-accordion-css-contract.js",
  "audit-architecture-gate.js",
  "audit-animated-moment-css-contract.js",
  "audit-audit-event-css-contract.js",
  "audit-avatar-css-contract.js",
  "audit-batch-zip-parity.js",
  "audit-badge-css-contract.js",
  "audit-biometric-prompt-css-contract.js",
  "audit-breadcrumbs-css-contract.js",
  "audit-breakpoint-contracts.js",
  "audit-button-css-contract.js",
  "audit-card-css-contract.js",
  "audit-card-summary-css-contract.js",
  "audit-chart-panel-css-contract.js",
  "audit-chat-composer-css-contract.js",
  "audit-chat-message-css-contract.js",
  "audit-chat-thread-css-contract.js",
  "audit-checkbox-css-contract.js",
  "audit-chip-css-contract.js",
  "audit-choice-css-contract.js",
  "audit-code-input-css-contract.js",
  "audit-combobox-css-contract.js",
  "audit-complete.mjs",
  "audit-component-1to1-quality-matrix.js",
  "audit-component-alias-literals.js",
  "audit-component-api-prop-alignment.js",
  "audit-component-behavior-contracts.js",
  "audit-component-catalog-classification.mjs",
  "audit-component-contract-alignment.js",
  "audit-component-contracts.js",
  "audit-component-cross-aliases.js",
  "audit-component-css-contracts.js",
  "audit-component-demo-interactions.mjs",
  "audit-component-demo-registry.mjs",
  "audit-consumer-install.mjs",
  "audit-component-implementation-status.js",
  "audit-component-modules.js",
  "audit-component-motion-role-coverage.js",
  "audit-component-registry.js",
  "audit-component-remediation-coverage.js",
  "audit-component-var-fallbacks.js",
  "audit-content-ownership.js",
  "audit-context.js",
  "audit-country-selector-css-contract.js",
  "audit-css-ownership.js",
  "audit-css.js",
  "audit-date-range-picker-css-contract.js",
  "audit-date-picker-css-contract.js",
  "audit-demo-layout-contracts.js",
  "audit-density-contracts.js",
  "audit-dialog-css-contract.js",
  "audit-docs-component-demo-ownership.js",
  "audit-docs-content.js",
  "audit-docs-runtime.mjs",
  "audit-docs.js",
  "audit-drawer-css-contract.js",
  "audit-empty-state-css-contract.js",
  "audit-energy-contracts.js",
  "audit-error-panel-css-contract.js",
  "report-email-channel-governance.js",
  "report-email-channel-renderer.mjs",
  "audit-field-css-contract.js",
  "audit-floating-action-button-css-contract.js",
  "audit-frame-contracts.js",
  "audit-foundation-cascade-contracts.js",
  "audit-foundation-contracts.js",
  "audit-gold-components.js",
  "audit-gold-copy.js",
  "audit-gold-demo-quality.js",
  "audit-gold-docs.js",
  "audit-gold-page-parity.js",
  "audit-icon-button-css-contract.js",
  "audit-inline-validation-css-contract.js",
  "audit-integration.js",
  "audit-kpi-tile-css-contract.js",
  "audit-layout-contracts.js",
  "audit-list-css-contract.js",
  "audit-manual-accessibility.js",
  "audit-menu-css-contract.js",
  "audit-motion-boundary-css-contract.js",
  "audit-motion-contracts.js",
  "audit-movement-row-css-contract.js",
  "audit-package-api.js",
  "audit-platform-adapters.js",
  "audit-package-css-contracts.js",
  "audit-package-css-namespace.js",
  "audit-pagination-css-contract.js",
  "audit-phone-input-css-contract.js",
  "audit-pattern-contracts.js",
  "audit-platform.js",
  "audit-popover-css-contract.js",
  "audit-primitive-contracts.js",
  "audit-progress-indicator-css-contract.js",
  "audit-quick-action-css-contract.js",
  "audit-radio-button-css-contract.js",
  "audit-react-contract-triangle.js",
  "audit-react-copy-contract.js",
  "audit-repo-boundary-runner.js",
  "audit-repo-boundary.js",
  "audit-react-primary-contract.js",
  "audit-react-primary-inventory.js",
  "audit-result.js",
  "audit-route-summary-css-contract.js",
  "audit-routes.js",
  "audit-segmented-control-css-contract.js",
  "audit-select-css-contract.js",
  "audit-skeleton-css-contract.js",
  "audit-slider-css-contract.js",
  "audit-spec.js",
  "audit-spinner-css-contract.js",
  "audit-state-contracts.js",
  "audit-station-pin-css-contract.js",
  "audit-stepper-css-contract.js",
  "audit-switch-css-contract.js",
  "audit-system-scope.js",
  "audit-system.js",
  "audit-table-contracts.js",
  "audit-table-css-contract.js",
  "audit-tabs-css-contract.js",
  "audit-tag-css-contract.js",
  "audit-taxonomy-boundaries.js",
  "audit-template-composition.js",
  "audit-text-area-css-contract.js",
  "audit-toast-css-contract.js",
  "audit-tokenized-css-properties.js",
  "audit-tooltip-css-contract.js",
  "audit-tree-view-css-contract.js",
  "audit-voice-contracts.js",
  "report-foundation-accessibility-cascade.js",
  "report-foundation-primitive-export-contract.js",
  "report-legacy-dom-source-governance.js",
  "report-package-css-root-governance.js",
  "report-pattern-1to1-architecture.js",
  "report-pattern-contract-governance.js",
  "report-pattern-foundation-primitive-1to1.js",
  "report-pattern-readiness.js",
  "report-pattern-react-migration-audit.js",
  "report-pattern-react-migration-plan.js",
  "report-template-cascade-governance.js",
  "report-zip-foundation-primitive-validation.js",
  "report-zip-flow-gap-audit.js",
  "report-zip-kit-cascade-matrix.js",
  "report-zip-kit-runtime-coverage.js",
  "report-zip-owner-export-matrix.js",
  "report-zip-system-intake.js",
  "report-zip-template-parity.js",
  "report-react-accessibility-governance.js",
  "report-anti-duplication-coverage.js",
  "report-component-css-contract-coverage.js",
  "report-family-css-contract-maturity.js",
  "report-component-visual-cascade.js",
  "report-system-debt-ledger.js",
  "report-system-component-contract-typescript-surface.js",
  "report-system-component-index-typescript-surface.js",
  "report-system-component-platform-typescript-surface.js",
  "report-system-component-primitive-typescript-surface.js",
  "report-system-component-registry-typescript-surface.js",
  "report-system-forensic-gates.js",
  "report-system-generated-token-output-governance.js",
  "report-system-p0-forensic-detail.js",
  "report-system-p0-owner-decision-matrix.js",
  "report-system-p0-primitive-runtime-matrix.js",
  "report-system-p0-remediation-sequence.js",
  "report-system-p0-token-foundation-classification.js",
  "report-system-p0-token-source-gates.js",
  "report-flowdocs-p0-shell-cleanup-evidence.js",
  "report-shell-pattern-contract-governance.js",
  "report-system-phase1-style-dictionary-checkpoint.js",
  "report-system-raw-token-value-decision-matrix.js",
  "report-system-raw-token-value-governance.js",
  "report-system-react-base-components-typescript-surface.js",
  "report-system-react-form-controls-typescript-surface.js",
  "report-system-react-internal-props-typescript-surface.js",
  "report-system-react-leaf-components-typescript-surface.js",
  "report-system-react-navigation-controls-typescript-surface.js",
  "report-system-react-data-selection-typescript-surface.js",
  "report-system-react-payment-inputs-typescript-surface.js",
  "report-system-react-date-inputs-typescript-surface.js",
  "report-system-react-chat-components-typescript-surface.js",
  "report-system-react-feedback-components-typescript-surface.js",
  "report-system-react-navigation-structure-typescript-surface.js",
  "report-system-react-motion-event-typescript-surface.js",
  "report-system-react-input-localization-typescript-surface.js",
  "report-system-react-affordance-typescript-surface.js",
  "report-system-react-summary-action-typescript-surface.js",
  "report-system-react-root-index-typescript-surface.js",
  "report-system-react-section-indexes-typescript-surface.js",
  "report-system-react-overlay-components-typescript-surface.js",
  "report-system-remediation-matrix.js",
  "report-system-token-ownership-matrix.js",
  "report-system-token-output-gates.js",
  "report-system-token-typescript-surface.js",
  "report-system-typescript-project-setup.js",
  "report-system-typescript-public-surface.js",
  "report-docs-component-demo-ownership.js",
  "report-docs-system-boundary.js",
  "report-taxonomy-boundaries.js",
  "report-react-class-ownership.js",
  "report-react-composition-governance.js",
  "report-react-contract-prop-alignment.js",
  "report-react-controlled-governance.js",
  "report-react-default-governance.js",
  "report-react-primary-coverage.js",
  "report-react-style-governance.js",
  "report-foundation-depth-cascade.js",
  "report-foundation-energy-cascade.js",
  "report-foundation-frame-cascade.js",
  "report-foundation-growth-cascade.js",
  "report-foundation-iconography-cascade.js",
  "report-foundation-momentum-cascade.js",
  "report-foundation-state-cascade.js",
  "report-foundation-symbol-cascade.js",
  "report-foundation-tone-cascade.js",
  "report-foundation-voice-cascade.js",
  "report-primitive-breakpoints-cascade.js",
  "report-primitive-charts-cascade.js",
  "report-primitive-cascade-activation-plan.js",
  "report-primitive-cascade-governance.js",
  "report-primitive-country-flags-cascade.js",
  "report-primitive-animation-assets-cascade.js",
  "report-primitive-illustration-assets-cascade.js",
  "report-primitive-library-sources-cascade.js",
  "report-primitive-color-cascade.js",
  "report-primitive-density-cascade.js",
  "report-primitive-disabled-cascade.js",
  "report-primitive-duration-cascade.js",
  "report-primitive-elevation-cascade.js",
  "report-primitive-field-action-cascade.js",
  "report-primitive-focus-cascade.js",
  "report-primitive-iconography-cascade.js",
  "report-primitive-loading-cascade.js",
  "report-primitive-maps-cascade.js",
  "report-primitive-measurement-cascade.js",
  "report-primitive-message-cascade.js",
  "report-primitive-motion-curves-cascade.js",
  "report-primitive-radius-cascade.js",
  "report-primitive-research-cascade.js",
  "report-primitive-spacing-cascade.js",
  "report-primitive-surface-cascade.js",
  "report-primitive-typography-cascade.js",
  "report-foundation-quality.js",
  "report-react-interaction-coverage.js",
  "report-react-pattern-behavior-governance.js",
  "report-react-pattern-composition-governance.js",
  "report-react-template-composition-governance.mjs",
  "report-react-template-interaction-governance.mjs",
  "report-react-template-runtime-governance.mjs",
  "report-react-template-visual-governance.mjs",
]);

const primitiveCascadeCheckRegistry = new Map([
  ["animation-assets", ["animation assets primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-animation-assets-cascade.js", "--check"])]],
  ["breakpoints", ["breakpoints primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-breakpoints-cascade.js", "--check"])]],
  ["charts", ["charts primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-charts-cascade.js", "--check"])]],
  ["color", ["color primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-color-cascade.js", "--check"])]],
  ["country-flags", ["country flags primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-country-flags-cascade.js", "--check"])]],
  ["density", ["density primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-density-cascade.js", "--check"])]],
  ["disabled", ["disabled primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-disabled-cascade.js", "--check"])]],
  ["duration", ["duration primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-duration-cascade.js", "--check"])]],
  ["elevation", ["elevation primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-elevation-cascade.js", "--check"])]],
  ["field-action", ["field action primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-field-action-cascade.js", "--check"])]],
  ["focus", ["focus primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-focus-cascade.js", "--check"])]],
  ["iconography", ["iconography primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-iconography-cascade.js", "--check"])]],
  ["illustration-assets", ["illustration assets primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-illustration-assets-cascade.js", "--check"])]],
  ["library-sources", ["library sources primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-library-sources-cascade.js", "--check"])]],
  ["loading", ["loading primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-loading-cascade.js", "--check"])]],
  ["maps", ["maps primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-maps-cascade.js", "--check"])]],
  ["measurement", ["measurement primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-measurement-cascade.js", "--check"])]],
  ["message", ["message primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-message-cascade.js", "--check"])]],
  ["motion-curves", ["motion curves primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-motion-curves-cascade.js", "--check"])]],
  ["radius", ["radius primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-radius-cascade.js", "--check"])]],
  ["research", ["research primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-research-cascade.js", "--check"])]],
  ["spacing", ["spacing primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-spacing-cascade.js", "--check"])]],
  ["surface", ["surface primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-surface-cascade.js", "--check"])]],
  ["typography", ["typography primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-typography-cascade.js", "--check"])]],
]);

const activePrimitiveCascadeChecks = primitiveCascadeGovernance.activeCascadeReports.map((id) => (
  primitiveCascadeCheckRegistry.get(id)
  ?? [`${id} primitive cascade report`, () => { throw new Error(`Unknown active primitive cascade report: ${id}.`); }]
));

const checks = [
  ["audit registry", auditRegistry],
  ["audit entrypoints", auditEntrypoints],
  ["audit debt metrics", auditDebtMetrics],
  ["public prefix", auditPublicPrefix],
  ["P0 token source gates", () => run("node", ["packages/audit/scripts/report-system-p0-token-source-gates.js", "--check"])],
  ["token ownership matrix", () => run("node", ["packages/audit/scripts/report-system-token-ownership-matrix.js", "--check"])],
  ["token output gates", () => run("node", ["packages/audit/scripts/report-system-token-output-gates.js", "--check"])],
  ["token TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-token-typescript-surface.js", "--check"])],
  ["generated token output governance", () => run("node", ["packages/audit/scripts/report-system-generated-token-output-governance.js", "--check"])],
  ["raw token value governance", () => run("node", ["packages/audit/scripts/report-system-raw-token-value-governance.js", "--check"])],
  ["phase 1 Style Dictionary checkpoint", () => run("node", ["packages/audit/scripts/report-system-phase1-style-dictionary-checkpoint.js", "--check"])],
  ["TypeScript project setup", () => run("node", ["packages/audit/scripts/report-system-typescript-project-setup.js", "--check"])],
  ["component contract TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-component-contract-typescript-surface.js", "--check"])],
  ["component index TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-component-index-typescript-surface.js", "--check"])],
  ["component platform TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-component-platform-typescript-surface.js", "--check"])],
  ["component primitive TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-component-primitive-typescript-surface.js", "--check"])],
  ["component registry TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-component-registry-typescript-surface.js", "--check"])],
  ["React internal props TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-internal-props-typescript-surface.js", "--check"])],
  ["React base components TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-base-components-typescript-surface.js", "--check"])],
  ["React overlay components TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-overlay-components-typescript-surface.js", "--check"])],
  ["React form controls TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-form-controls-typescript-surface.js", "--check"])],
  ["React leaf components TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-leaf-components-typescript-surface.js", "--check"])],
  ["React navigation controls TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-navigation-controls-typescript-surface.js", "--check"])],
  ["React data selection TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-data-selection-typescript-surface.js", "--check"])],
  ["React payment inputs TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-payment-inputs-typescript-surface.js", "--check"])],
  ["React date inputs TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-date-inputs-typescript-surface.js", "--check"])],
  ["React chat components TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-chat-components-typescript-surface.js", "--check"])],
  ["React feedback components TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-feedback-components-typescript-surface.js", "--check"])],
  ["React navigation structure TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-navigation-structure-typescript-surface.js", "--check"])],
  ["React motion/event TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-motion-event-typescript-surface.js", "--check"])],
  ["React input/localization TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-input-localization-typescript-surface.js", "--check"])],
  ["React affordance TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-affordance-typescript-surface.js", "--check"])],
  ["React summary/action TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-summary-action-typescript-surface.js", "--check"])],
  ["React root index TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-root-index-typescript-surface.js", "--check"])],
  ["React section indexes TypeScript surface", () => run("node", ["packages/audit/scripts/report-system-react-section-indexes-typescript-surface.js", "--check"])],
  ...(hasRepoFile("scripts/generate-pattern-contracts.mjs")
    ? [["pattern contract freshness", () => run("node", ["scripts/generate-pattern-contracts.mjs", "--check"])]]
    : []),
  ...(hasRepoFile("packages/react/scripts/build.mjs")
    ? [["react dist freshness", () => run("node", ["packages/react/scripts/build.mjs", "--check"])]]
    : []),
  ...(hasRepoFile("scripts/generate-foundation-contracts.mjs")
    ? [["foundation contracts", () => run("node", ["scripts/generate-foundation-contracts.mjs", "--check"])]]
    : []),
  ...(hasFoundationDependencyMatrix ? [
    ["accessibility cascade report", () => run("node", ["packages/audit/scripts/report-foundation-accessibility-cascade.js", "--check"])],
    ["depth cascade report", () => run("node", ["packages/audit/scripts/report-foundation-depth-cascade.js", "--check"])],
    ["energy cascade report", () => run("node", ["packages/audit/scripts/report-foundation-energy-cascade.js", "--check"])],
    ["frame cascade report", () => run("node", ["packages/audit/scripts/report-foundation-frame-cascade.js", "--check"])],
    ["growth cascade report", () => run("node", ["packages/audit/scripts/report-foundation-growth-cascade.js", "--check"])],
    ["iconography cascade report", () => run("node", ["packages/audit/scripts/report-foundation-iconography-cascade.js", "--check"])],
    ["momentum cascade report", () => run("node", ["packages/audit/scripts/report-foundation-momentum-cascade.js", "--check"])],
    ["state cascade report", () => run("node", ["packages/audit/scripts/report-foundation-state-cascade.js", "--check"])],
    ["symbol cascade report", () => run("node", ["packages/audit/scripts/report-foundation-symbol-cascade.js", "--check"])],
    ["tone cascade report", () => run("node", ["packages/audit/scripts/report-foundation-tone-cascade.js", "--check"])],
    ["voice cascade report", () => run("node", ["packages/audit/scripts/report-foundation-voice-cascade.js", "--check"])],
    ["foundation cascade readiness", auditFoundationCascadeReadiness],
  ] : []),
  ...(hasRepoFile("scripts/generate-primitive-contracts.mjs")
    ? [["primitive contracts", () => run("node", ["scripts/generate-primitive-contracts.mjs", "--check"])]]
    : []),
  ["primitive cascade governance", auditPrimitiveCascadeGovernance],
  ...(hasPrimitiveCascadeGate ? activePrimitiveCascadeChecks : []),
  ...(!hasPrimitiveCascadeGate && hasRepoFile("packages/audit/scripts/report-primitive-surface-cascade.js")
    ? [["surface primitive cascade report", () => run("node", ["packages/audit/scripts/report-primitive-surface-cascade.js", "--check"])]]
    : []),
  ...(hasDocsApp ? [["docs build", () => run("npm", ["run", "build:docs"])]] : []),
  ...(hasDocsApp ? [["static system/docs/integration", () => run("node", ["packages/audit/scripts/audit-system.js"])]] : []),
  ["platform adapters", () => run("node", ["packages/audit/scripts/audit-system-scope.js"])],
  ["component smoke tests", () => run("npm", ["test"])],
  ...(hasDocsApp ? [["docs runtime", () => run("node", ["packages/audit/scripts/audit-docs-runtime.mjs"])]] : []),
  ["repo boundary", () => run("node", ["packages/audit/scripts/audit-repo-boundary-runner.js"])],
  ["consumer install", () => run("node", ["packages/audit/scripts/audit-consumer-install.mjs"])],
  ...(hasRepoFile("scripts/audit-system-split.mjs")
    ? [["system split", () => run("node", ["scripts/audit-system-split.mjs"])]]
    : []),
  ...(hasRepoFile("scripts/audit-docs-split.mjs")
    ? [["docs split", () => run("node", ["scripts/audit-docs-split.mjs"])]]
    : []),
  ...(hasDocsConsumerApp ? [["component demo registry", () => run("node", ["packages/audit/scripts/audit-component-demo-registry.mjs"])]] : []),
  ...(hasDocsConsumerApp ? [["component catalog classification", () => run("node", ["packages/audit/scripts/audit-component-catalog-classification.mjs"])]] : []),
  ...(hasDocsConsumerApp ? [["component demo interactions", () => run("node", ["packages/audit/scripts/audit-component-demo-interactions.mjs"])]] : []),
  ["docs component demo ownership report", () => run("node", ["packages/audit/scripts/report-docs-component-demo-ownership.js", "--check"])],
  ...(hasDocsConsumerApp ? [["docs system boundary report", () => run("node", ["packages/audit/scripts/report-docs-system-boundary.js", "--check"])]] : []),
  ["taxonomy boundaries report", () => run("node", ["packages/audit/scripts/report-taxonomy-boundaries.js", "--check"])],
  ["foundation primitive export contract report", () => run("node", ["packages/audit/scripts/report-foundation-primitive-export-contract.js", "--check"])],
  ["primitive cascade governance report", () => run("node", ["packages/audit/scripts/report-primitive-cascade-governance.js", "--check"])],
  ["primitive cascade activation plan", () => run("node", ["packages/audit/scripts/report-primitive-cascade-activation-plan.js", "--check"])],
  ...(hasZipAuditRoot ? [["email channel governance report", () => run("node", ["packages/audit/scripts/report-email-channel-governance.js", "--check"])]] : []),
  ["email channel renderer report", () => run("node", ["packages/audit/scripts/report-email-channel-renderer.mjs", "--check"])],
  ["legacy DOM source governance report", () => run("node", ["packages/audit/scripts/report-legacy-dom-source-governance.js", "--check"])],
  ...(hasDocsConsumerApp ? [["anti duplication coverage report", () => run("node", ["packages/audit/scripts/report-anti-duplication-coverage.js", "--check"])]] : []),
  ["react accessibility governance report", () => run("node", ["packages/audit/scripts/report-react-accessibility-governance.js", "--check"])],
  ["react class ownership report", () => run("node", ["packages/audit/scripts/report-react-class-ownership.js", "--check"])],
  ["react composition governance report", () => run("node", ["packages/audit/scripts/report-react-composition-governance.js", "--check"])],
  ["react contract prop alignment report", () => run("node", ["packages/audit/scripts/report-react-contract-prop-alignment.js", "--check"])],
  ["react controlled governance report", () => run("node", ["packages/audit/scripts/report-react-controlled-governance.js", "--check"])],
  ["react default governance report", () => run("node", ["packages/audit/scripts/report-react-default-governance.js", "--check"])],
  ["react primary coverage report", () => run("node", ["packages/audit/scripts/report-react-primary-coverage.js", "--check"])],
  ["react style governance report", () => run("node", ["packages/audit/scripts/report-react-style-governance.js", "--check"])],
  ["react interaction coverage report", () => run("node", ["packages/audit/scripts/report-react-interaction-coverage.js", "--check"])],
  ["react pattern behavior governance report", () => run("node", ["packages/audit/scripts/report-react-pattern-behavior-governance.js", "--check"])],
  ["react pattern composition governance report", () => run("node", ["packages/audit/scripts/report-react-pattern-composition-governance.js", "--check"])],
  ["shell pattern contract governance report", () => run("node", ["packages/audit/scripts/report-shell-pattern-contract-governance.js", "--check"])],
  ...(hasDocsConsumerApp ? [["FlowDocs P0 shell cleanup evidence", () => run("node", ["packages/audit/scripts/report-flowdocs-p0-shell-cleanup-evidence.js", "--check"])]] : []),
  ["react template composition governance report", () => run("node", ["packages/audit/scripts/report-react-template-composition-governance.mjs", "--check"])],
  ["react template interaction governance report", () => run("node", ["packages/audit/scripts/report-react-template-interaction-governance.mjs", "--check"])],
  ["react template runtime governance report", () => run("node", ["packages/audit/scripts/report-react-template-runtime-governance.mjs", "--check"])],
  ["react template visual governance report", () => run("node", ["packages/audit/scripts/report-react-template-visual-governance.mjs", "--check"])],
  ...(hasZipAuditRoot ? [
    ["zip foundation primitive validation report", () => run("node", ["packages/audit/scripts/report-zip-foundation-primitive-validation.js", "--check"])],
    ["zip flow gap report", () => run("node", ["packages/audit/scripts/report-zip-flow-gap-audit.js", "--check"])],
    ["zip kit cascade matrix report", () => run("node", ["packages/audit/scripts/report-zip-kit-cascade-matrix.js", "--check"])],
    ["zip kit runtime coverage report", () => run("node", ["packages/audit/scripts/report-zip-kit-runtime-coverage.js", "--check"])],
    ["zip owner export matrix report", () => run("node", ["packages/audit/scripts/report-zip-owner-export-matrix.js", "--check"])],
    ["zip template parity report", () => run("node", ["packages/audit/scripts/report-zip-template-parity.js", "--check"])],
    ["zip system intake report", () => run("node", ["packages/audit/scripts/report-zip-system-intake.js", "--check"])],
  ] : []),
  ["component css contract coverage report", () => run("node", ["packages/audit/scripts/report-component-css-contract-coverage.js", "--check"])],
  ["family css contract maturity report", () => run("node", ["packages/audit/scripts/report-family-css-contract-maturity.js", "--check"])],
  ["package css root governance report", () => run("node", ["packages/audit/scripts/report-package-css-root-governance.js", "--check"])],
  ...(hasDocsConsumerApp ? [["component visual cascade report", () => run("node", ["packages/audit/scripts/report-component-visual-cascade.js", "--check"])]] : []),
  ...(hasDocsConsumerApp ? [["pattern 1:1 architecture report", () => run("node", ["packages/audit/scripts/report-pattern-1to1-architecture.js", "--check"])]] : []),
  ...(hasDocsConsumerApp ? [["pattern contract governance report", () => run("node", ["packages/audit/scripts/report-pattern-contract-governance.js", "--check"])]] : []),
  ["pattern foundation primitive 1:1 report", () => run("node", ["packages/audit/scripts/report-pattern-foundation-primitive-1to1.js", "--check"])],
  ["pattern readiness report", () => run("node", ["packages/audit/scripts/report-pattern-readiness.js", "--check"])],
  ["pattern react migration audit", () => run("node", ["packages/audit/scripts/report-pattern-react-migration-audit.js", "--check"])],
  ...(hasDocsConsumerApp ? [["pattern react migration plan", () => run("node", ["packages/audit/scripts/report-pattern-react-migration-plan.js", "--check"])]] : []),
  ["template cascade governance report", () => run("node", ["packages/audit/scripts/report-template-cascade-governance.js", "--check"])],
  ["system TypeScript public surface baseline", () => run("node", ["packages/audit/scripts/report-system-typescript-public-surface.js", "--check"])],
  ["system debt ledger", () => run("node", ["packages/audit/scripts/report-system-debt-ledger.js", "--check"])],
];

const summary = {
  status: "pass",
  checks: [],
};

for (const [name, check] of checks) {
  try {
    const started = Date.now();
    check();
    summary.checks.push({ name, status: "pass", ms: Date.now() - started });
  } catch (error) {
    summary.status = "fail";
    summary.checks.push({ name, status: "fail", message: error.message });
    break;
  }
}

console.log(JSON.stringify(summary, null, 2));
if (summary.status !== "pass") {
  if (process.env.GITHUB_ACTIONS === "true") {
    const failed = summary.checks.find((check) => check.status === "fail");
    const message = `${failed?.name ?? "unknown check"}: ${failed?.message ?? "unknown failure"}`;
    console.error(`::error title=Flow audit complete failed::${escapeGitHubAnnotation(message)}`);
  }
  process.exitCode = 1;
}

function escapeGitHubAnnotation(value) {
  return String(value)
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);
    const details = [result.stdout, result.stderr]
      .filter(Boolean)
      .join("\n")
      .trim()
      .split("\n")
      .slice(-20)
      .join("\n");
    throw new Error(`${command} ${args.join(" ")} failed${details ? `:\n${details}` : ""}`);
  }
}

function auditRegistry() {
  const actual = fs.readdirSync(auditScriptsDir)
    .filter((file) => /^(audit-|report-).*\.(?:js|mjs)$/.test(file))
    .sort();
  const missing = [...expectedAuditFiles].filter((file) => !actual.includes(file));
  const unregistered = actual.filter((file) => !expectedAuditFiles.has(file));
  if (missing.length || unregistered.length) {
    throw new Error(`Audit registry mismatch. Missing: ${missing.join(", ") || "none"}. Unregistered: ${unregistered.join(", ") || "none"}.`);
  }
}

function auditEntrypoints() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (hasDocsApp) {
    if (packageJson.scripts?.audit !== "node packages/audit/scripts/audit-complete.mjs") {
      throw new Error("npm run audit must point at audit-complete.mjs.");
    }
    if (packageJson.scripts?.validate !== "npm run audit") {
      throw new Error("npm run validate must delegate to the single complete audit.");
    }
  } else {
    if (packageJson.scripts?.["audit:system"] !== "node packages/audit/scripts/audit-system-scope.js") {
      throw new Error("split system package must expose audit:system through audit-system-scope.js.");
    }
    if (packageJson.scripts?.["audit:complete"] !== "node packages/audit/scripts/audit-complete.mjs") {
      throw new Error("split system package must expose audit:complete through audit-complete.mjs.");
    }
    if (packageJson.scripts?.["build:tokens"] !== "node scripts/build-tokens.mjs") {
      throw new Error("split system package must expose build:tokens through build-tokens.mjs.");
    }
    if (packageJson.scripts?.["validate:system"] !== "npm run build:tokens && npm run build:react && npm run test:react && npm run audit:complete") {
      throw new Error("split system package must run build:tokens, build:react, test:react, and audit:complete as the full system gate.");
    }
  }

  for (const file of ["audit-system.js", "audit-docs.js", "audit-integration.js", "audit-system-scope.js"]) {
    const source = fs.readFileSync(path.join(auditScriptsDir, file), "utf8");
    const calls = [...source.matchAll(/\b(check[A-Z][A-Za-z0-9]+)\(\);/g)].map((match) => match[1]);
    const duplicates = calls.filter((call, index) => calls.indexOf(call) !== index);
    if (duplicates.length) {
      throw new Error(`${file} invokes duplicate checks: ${[...new Set(duplicates)].join(", ")}.`);
    }
  }
}

function auditDebtMetrics() {
  const auditsDir = path.join(root, "docs/audits");
  const governance = JSON.parse(fs.readFileSync(path.join(root, "packages/content/content/system-debt-governance.json"), "utf8"));
  const contractArtifactFiles = new Set(Array.isArray(governance.contractArtifactFiles) ? governance.contractArtifactFiles : []);
  if (!fs.existsSync(auditsDir)) return;
  const trackedResult = spawnSync("git", ["ls-files", "docs/audits/*.json"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  const trackedAuditFiles = trackedResult.status === 0
    ? trackedResult.stdout
      .split("\n")
      .filter(Boolean)
      .map((file) => path.basename(file))
    : fs.readdirSync(auditsDir).filter((item) => item.endsWith(".json"));
  const missing = [];
  const nonNumeric = [];
  for (const file of trackedAuditFiles.filter((item) => item.endsWith(".json") && !contractArtifactFiles.has(item)).sort()) {
    const report = JSON.parse(fs.readFileSync(path.join(auditsDir, file), "utf8"));
    const entries = [
      ...Object.entries(report),
      ...Object.entries(report.inventory ?? {}),
      ...Object.entries(report.summary ?? {}),
    ].filter(([key]) => /(?:debt|debtMetrics)$/i.test(key));
    if (!entries.length && Array.isArray(report.gaps)) entries.push(["gapsDebt", report.gaps.length]);
    if (!entries.length) missing.push(file);
    nonNumeric.push(...entries
      .filter(([, value]) => typeof value !== "number")
      .map(([key]) => `${file}:${key}`));
  }
  if (missing.length) {
    throw new Error(`Audit reports must expose an actionable debt metric: ${missing.join(", ")}.`);
  }
  if (nonNumeric.length) {
    throw new Error(`Audit debt metrics must be numeric: ${nonNumeric.join(", ")}.`);
  }
}

function auditPublicPrefix() {
  const roots = ["packages", "apps", "docs"];
  const offenders = [];
  for (const entry of roots) scan(path.join(root, entry), offenders);
  if (offenders.length) {
    throw new Error(`Forbidden public prefix found: ${offenders.slice(0, 20).join(", ")}`);
  }
}

function auditFoundationCascadeReadiness() {
  const auditDir = path.join(root, "docs/audits");
  const reports = fs.readdirSync(auditDir)
    .filter((file) => /^foundation-.*-cascade-audit\.json$/.test(file))
    .sort();
  const blockers = [];
  for (const reportFile of reports) {
    const report = JSON.parse(fs.readFileSync(path.join(auditDir, reportFile), "utf8"));
    if (report.status !== "pass") {
      blockers.push(`${report.foundation ?? reportFile}: ${report.status} (${(report.gaps ?? []).length} gaps)`);
    }
  }
  if (blockers.length) {
    throw new Error(`Foundation cascade is not ready for primitives. Blocking reports: ${blockers.join("; ")}.`);
  }
}

function auditPrimitiveCascadeGovernance() {
  const active = primitiveCascadeGovernance.activeCascadeReports;
  const backlog = primitiveCascadeGovernance.backlogCascadeReports ?? {};
  const issues = [];
  if (!Array.isArray(active) || !active.length) {
    issues.push("activeCascadeReports must list at least one primitive gate");
  }
  const duplicateActive = active.filter((id, index) => active.indexOf(id) !== index);
  if (duplicateActive.length) {
    issues.push(`duplicate active primitive gates: ${[...new Set(duplicateActive)].join(", ")}`);
  }
  const activeSet = new Set(active);
  const backlogIds = Object.keys(backlog);
  const duplicateBacklog = backlogIds.filter((id) => activeSet.has(id));
  if (duplicateBacklog.length) {
    issues.push(`active primitive gates cannot also be backlog: ${duplicateBacklog.join(", ")}`);
  }
  for (const id of active) {
    if (!primitiveCascadeCheckRegistry.has(id)) issues.push(`unknown active primitive gate: ${id}`);
    const reportFile = `primitive-${id}-cascade-audit.json`;
    const governance = readJsonIfExists(path.join(root, "packages/content/content/system-debt-governance.json"), {});
    if (governance.reportCategories?.[reportFile] !== "foundations-primitives") {
      issues.push(`active primitive gate is missing foundations-primitives ledger category: ${reportFile}`);
    }
  }
  for (const [id, reason] of Object.entries(backlog)) {
    if (!primitiveCascadeCheckRegistry.has(id)) issues.push(`unknown backlog primitive gate: ${id}`);
    if (!reason || typeof reason !== "object" || Array.isArray(reason)) {
      issues.push(`backlog primitive gate must be structured: ${id}`);
    } else {
      if (typeof reason.reason !== "string" || !reason.reason.trim()) issues.push(`backlog primitive gate needs reason: ${id}`);
      if (!Array.isArray(reason.blockerTypes) || !reason.blockerTypes.length) issues.push(`backlog primitive gate needs blockerTypes: ${id}`);
      if (!Array.isArray(reason.activationEvidence) || !reason.activationEvidence.length) issues.push(`backlog primitive gate needs activationEvidence: ${id}`);
    }
  }
  if (issues.length) {
    throw new Error(`Primitive cascade governance contract failed: ${issues.join("; ")}.`);
  }
}

function scan(target, offenders) {
  if (!fs.existsSync(target)) return;
  const relativeTarget = path.relative(root, target);
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    const relativeParts = relativeTarget.split(path.sep);
    if (relativeParts.includes("repo-split-output")) return;
    if (isAuditEvidenceDirectory(relativeTarget)) return;
    for (const entry of fs.readdirSync(target)) scan(path.join(target, entry), offenders);
    return;
  }
  if (!/\.(?:css|html|js|mjs|json|md)$/.test(target)) return;
  const text = fs.readFileSync(target, "utf8");
  if (hasPublicPrefixEscape(text)) offenders.push(relativeTarget);
}

function isAuditEvidenceDirectory(relativeTarget) {
  return [
    path.join("packages", "audit"),
    path.join("packages", "react", "test"),
  ].some((excluded) => relativeTarget === excluded || relativeTarget.startsWith(`${excluded}${path.sep}`));
}

function hasPublicPrefixEscape(text) {
  const escapedPrefix = forbiddenPrefix.replaceAll("-", "\\-");
  return [
    new RegExp(`<${escapedPrefix}[a-z0-9-]+`, "i"),
    new RegExp(`\\.[a-z0-9_-]*${escapedPrefix}[a-z0-9_-]+`, "i"),
    new RegExp(`(?:class|className)\\s*[:=]\\s*["'\`][^"'\`]*\\b${escapedPrefix}[a-z0-9_-]+`, "i"),
  ].some((pattern) => pattern.test(text));
}
