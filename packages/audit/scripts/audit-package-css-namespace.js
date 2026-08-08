const { path, read, add, lineNumber } = require("./audit-context.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");
const allowedNamespace = /^--(?:comp|component|sys|ref)-/;

function checkPackageCssNamespace() {
  const text = read(packageCssFile);
  for (const match of text.matchAll(/(^|[;{]\s*)(--[a-z0-9-]+)\s*:/g)) {
    const token = match[2];
    if (allowedNamespace.test(token)) continue;
    add(
      "errors",
      packageCssFile,
      lineNumber(text, match.index + match[1].length),
      `Package CSS custom properties must use Flow namespaces (--comp, --component, --sys, --ref): ${token}.`,
    );
  }
}

module.exports = { checkPackageCssNamespace };
