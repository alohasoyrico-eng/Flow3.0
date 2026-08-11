const core = require("./anti-duplication-governance-core.js");

module.exports = {
  allowedClassRootsForReactComponent: core.allowedClassRootsForReactComponent,
  checkAntiDuplicationGovernance: core.checkAntiDuplicationGovernance,
  antiDuplicationCoverage: core.antiDuplicationCoverage,
  classRootTokensFromClassExpression: core.classRootTokensFromClassExpression,
  classRootsFromClassExpression: core.classRootsFromClassExpression,
  componentClassRootRegistryCoverage: core.componentClassRootRegistryCoverage,
  componentClassRoots: core.componentClassRoots,
  knownDuplicateConceptViolations: core.knownDuplicateConceptViolations,
  ownerClassRootForReactComponent: core.ownerClassRootForReactComponent,
  packageCssClassRoots: core.packageCssClassRoots,
  protectedComponentRoots: core.protectedComponentRoots,
  reactSupportClassRoots: core.reactSupportClassRoots,
};
