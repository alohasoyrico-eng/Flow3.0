function checkRuntimeDomMutationContract({ add, name, sourceFile, source }) {
  const approvedTabsIndicatorMutation = name === "Tabs"
    && source.includes('root.style.setProperty("--comp-tabs-indicator-left"')
    && source.includes('root.style.setProperty("--comp-tabs-indicator-width"')
    && source.includes('root.dataset.indicatorSynced = "true"');
  const blockedPatterns = [
    { pattern: /\.style\./, label: "DOM style mutation" },
    { pattern: /\.style\.setProperty\(/, label: "DOM style.setProperty mutation" },
    { pattern: /\.dataset\./, label: "DOM dataset mutation" },
    { pattern: /\.classList\./, label: "DOM classList mutation" },
  ];

  for (const { pattern, label } of blockedPatterns) {
    if (!pattern.test(source)) continue;
    if (approvedTabsIndicatorMutation && name === "Tabs" && (label === "DOM style mutation" || label === "DOM style.setProperty mutation" || label === "DOM dataset mutation")) continue;
    add("errors", sourceFile, 1, `${name} React source must not use ${label}; represent state through React props/data attributes or add a narrow audited exception.`);
  }
}

module.exports = { checkRuntimeDomMutationContract };
