const { fs, path, root, read, add } = require("./audit-context.js");

const reactSrcDir = path.join(root, "packages/react/src");
const localeSpecificTerms = ["Selecciona", "Rango de fechas", " dias", "días"];

function checkReactCopyContract() {
  if (!fs.existsSync(reactSrcDir)) return;

  for (const fileName of fs.readdirSync(reactSrcDir).filter((file) => /^[A-Z].*\.js$/.test(file))) {
    const file = path.join(reactSrcDir, fileName);
    const lines = read(file).split("\n");

    lines.forEach((line, index) => {
      if (!/["'`]/.test(line)) return;
      const matchedTerm = localeSpecificTerms.find((term) => line.includes(term));
      if (!matchedTerm) return;

      add(
        "errors",
        file,
        index + 1,
        `React Copy Contract: locale-specific copy "${matchedTerm.trim()}" cannot live in the React component package. Pass it from content/docs/consumer props instead.`
      );
    });
  }
}

module.exports = { checkReactCopyContract };
