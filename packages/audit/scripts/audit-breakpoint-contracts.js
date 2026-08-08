const { path, read, add, lineNumber } = require("./audit-context.js");
const { approvedBreakpointValues } = require("./breakpoint-registry.js");

const componentCssFile = path.join(process.cwd(), "packages/components/styles/components.css");

function collectResponsiveQueries(source) {
  const queries = [];
  const pattern = /@(?<kind>media|container)\s*(?<query>[^{]+)/g;
  for (const match of source.matchAll(pattern)) {
    queries.push({
      kind: match.groups.kind,
      query: match.groups.query.trim(),
      index: match.index,
      values: [...match.groups.query.matchAll(/\b\d+(?:\.\d+)?(?:px|rem)\b/g)].map((value) => value[0]),
    });
  }
  return queries;
}

function checkBreakpointContracts() {
  const source = read(componentCssFile);
  const queries = collectResponsiveQueries(source);
  for (const entry of queries) {
    for (const value of entry.values) {
      if (approvedBreakpointValues.has(value)) continue;
      add(
        "errors",
        componentCssFile,
        lineNumber(source, entry.index),
        `Component ${entry.kind} query value ${value} is not in the approved Breakpoints registry.`,
      );
    }
  }
}

module.exports = { checkBreakpointContracts, collectResponsiveQueries };
