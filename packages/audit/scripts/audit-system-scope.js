#!/usr/bin/env node

const { checkSystemArchitectureGate } = require("./audit-architecture-gate.js");
const { checkAdoptionReadiness } = require("./audit-adoption-readiness.js");
const { checkMachineReadableSpec } = require("./audit-spec.js");
const { checkComponentContracts } = require("./audit-component-contracts.js");
const { checkPatternContracts } = require("./audit-pattern-contracts.js");
const { checkTaxonomyBoundaries } = require("./audit-taxonomy-boundaries.js");
const { checkComponentBehaviorContracts } = require("./audit-component-behavior-contracts.js");
const { checkComponentModules } = require("./audit-component-modules.js");
const { checkPackageApiBoundary } = require("./audit-package-api.js");
const { checkPackageCssContracts } = require("./audit-package-css-contracts.js");
const { checkPlatformAdapters } = require("./audit-platform-adapters.js");
const { checkReactPrimaryContract } = require("./audit-react-primary-contract.js");
const { checkAntiDuplicationGovernance } = require("./audit-anti-duplication.js");
const { checkManualAccessibility } = require("./audit-manual-accessibility.js");
const { checkComponentVisualCascade } = require("./report-component-visual-cascade.js");
const { checkReactInteractionCoverage } = require("./report-react-interaction-coverage.js");
const { finishAudit } = require("./audit-result.js");

checkSystemArchitectureGate();
checkAdoptionReadiness();
checkMachineReadableSpec();
checkComponentContracts();
checkPatternContracts();
checkTaxonomyBoundaries();
checkComponentBehaviorContracts();
checkComponentModules();
checkPackageApiBoundary();
checkPackageCssContracts();
checkPlatformAdapters();
checkReactPrimaryContract();
checkAntiDuplicationGovernance();
checkManualAccessibility();
checkComponentVisualCascade();
checkReactInteractionCoverage();

finishAudit();
