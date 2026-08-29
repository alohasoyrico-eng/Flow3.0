const {
  add,
  fs,
  path,
  readJson,
  root,
  result,
} = require("./audit-context.js");
const { finishAudit } = require("./audit-result.js");

const matrixFile = path.join(root, "docs/audits/component-1to1-quality-matrix.json");

const requiredStepIds = [
  "zip-reference",
  "system-architecture",
  "package-source",
  "docs-source",
  "foundations-primitives",
  "states-variants",
  "interaction-logic",
  "motion",
  "density-layout",
  "typography-iconography",
  "accessibility",
  "visual-qa",
  "validation",
];

const validStepStatuses = new Set(["pass", "partial", "fail", "not-applicable"]);
const validComponentStatuses = new Set(["pass", "partial", "fail"]);

function evidenceExists(evidencePath) {
  if (path.isAbsolute(evidencePath)) {
    return fs.existsSync(evidencePath);
  }
  return fs.existsSync(path.join(root, evidencePath));
}

function hasDarkEvidence(evidence) {
  return evidence.some((evidencePath) => {
    if (/dark/i.test(evidencePath)) return true;
    const file = path.join(root, evidencePath);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return false;
    return /["'`]dark["'`]|data-theme=["'`]dark["'`]|theme.*dark/i.test(fs.readFileSync(file, "utf8"));
  });
}

function checkComponent1to1QualityMatrix() {
  const matrix = readJson(matrixFile);
  if (!matrix) {
    add("errors", matrixFile, 1, "Component 1:1 quality matrix is required.");
    return;
  }

  const stepIds = (matrix.steps ?? []).map((step) => step.id);
  for (const requiredStep of requiredStepIds) {
    if (!stepIds.includes(requiredStep)) {
      add("errors", matrixFile, 1, `Component 1:1 quality matrix missing step: ${requiredStep}.`);
    }
  }
  if (stepIds.length !== requiredStepIds.length) {
    add("errors", matrixFile, 1, "Component 1:1 quality matrix must keep exactly 13 review steps.");
  }

  let passCount = 0;
  let partialCount = 0;
  let failCount = 0;
  let staleEvidenceCount = 0;
  const currentReviewScope = new Set(matrix.currentReview?.scope ?? []);

  for (const component of matrix.components ?? []) {
    if (!validComponentStatuses.has(component.status)) {
      add("errors", matrixFile, 1, `${component.id} has invalid component status: ${component.status}.`);
    }

    const componentStepIds = Object.keys(component.steps ?? {});
    for (const requiredStep of requiredStepIds) {
      const status = component.steps?.[requiredStep];
      if (!status) {
        add("errors", matrixFile, 1, `${component.id} is missing 13-step status for: ${requiredStep}.`);
      } else if (!validStepStatuses.has(status)) {
        add("errors", matrixFile, 1, `${component.id} has invalid status for ${requiredStep}: ${status}.`);
      }
    }
    for (const step of componentStepIds) {
      if (!requiredStepIds.includes(step)) {
        add("errors", matrixFile, 1, `${component.id} uses an unknown 13-step id: ${step}.`);
      }
    }

    const evidence = component.evidence ?? [];
    if (!Array.isArray(evidence) || evidence.length === 0) {
      add("errors", matrixFile, 1, `${component.id} must list evidence files.`);
    } else {
      for (const evidencePath of evidence) {
        const evidenceIsMissing = !evidenceExists(evidencePath);
        if (evidenceIsMissing && currentReviewScope.has(component.id) && component.status === "pass") {
          add("errors", matrixFile, 1, `${component.id} references missing evidence: ${evidencePath}.`);
        } else if (evidenceIsMissing) {
          staleEvidenceCount += 1;
        }
      }
    }

    const stepStatuses = requiredStepIds.map((step) => component.steps?.[step]);
    const allClosed = stepStatuses.every((status) => status === "pass" || status === "not-applicable");
    if (component.status === "pass" && !allClosed) {
      add("errors", matrixFile, 1, `${component.id} cannot be pass while one or more 13-step checks are partial or fail.`);
    }
    if (component.status === "pass" && evidence.length < 3) {
      add("errors", matrixFile, 1, `${component.id} cannot be pass without enough evidence sources.`);
    }
    if (component.status === "pass" && Array.isArray(component.openIssues) && component.openIssues.length > 0) {
      add("errors", matrixFile, 1, `${component.id} cannot be pass while openIssues are still listed.`);
    }
    if ((component.status === "pass" || component.steps?.["visual-qa"] === "pass") && !hasDarkEvidence(evidence)) {
      add("errors", matrixFile, 1, `${component.id} cannot close visual QA without dark-mode evidence.`);
    }
    if (component.status !== "pass" && (!Array.isArray(component.openIssues) || component.openIssues.length === 0)) {
      add("errors", matrixFile, 1, `${component.id} is ${component.status} and must list open issues.`);
    }

    if (component.status === "pass") passCount += 1;
    if (component.status === "partial") partialCount += 1;
    if (component.status === "fail") failCount += 1;
  }

  result.inventory.component1to1Quality = {
    total: (matrix.components ?? []).length,
    pass: passCount,
    partial: partialCount,
    fail: failCount,
    qualityDebt: partialCount + failCount,
    staleEvidence: staleEvidenceCount,
  };

  const summary = matrix.summary ?? {};
  const expectedSummary = {
    total: (matrix.components ?? []).length,
    pass: passCount,
    partial: partialCount,
    fail: failCount,
    qualityDebt: partialCount + failCount,
  };
  for (const [key, expected] of Object.entries(expectedSummary)) {
    if (summary[key] !== expected) {
      add("errors", matrixFile, 1, `Component 1:1 quality matrix summary.${key} must be ${expected}; got ${summary[key]}.`);
    }
  }

  const expectedMatrixStatus = expectedSummary.qualityDebt === 0 && currentReviewScope.size === 0 ? "pass" : "partial";
  if (matrix.status !== expectedMatrixStatus) {
    add(
      "errors",
      matrixFile,
      1,
      `Component 1:1 quality matrix status must be ${expectedMatrixStatus} when qualityDebt is ${expectedSummary.qualityDebt} and currentReview.scope has ${currentReviewScope.size} item(s).`,
    );
  }

  if (partialCount || failCount) {
    result.status = "partial";
    add("warnings", matrixFile, 1, `Component 1:1 quality matrix is not closed: ${partialCount} partial, ${failCount} fail.`);
  }
}

if (require.main === module) {
  checkComponent1to1QualityMatrix();
  finishAudit();
}

module.exports = { checkComponent1to1QualityMatrix };
