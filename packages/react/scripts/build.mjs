import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

for (const file of ["Button.js", "Button.d.ts", "CardExpiryInput.js", "CardExpiryInput.d.ts", "CardNumberInput.js", "CardNumberInput.d.ts", "CardSecurityCodeInput.js", "CardSecurityCodeInput.d.ts", "Checkbox.js", "Checkbox.d.ts", "CodeInput.js", "CodeInput.d.ts", "DatePicker.js", "DatePicker.d.ts", "IconButton.js", "IconButton.d.ts", "Input.js", "Input.d.ts", "PhoneInput.js", "PhoneInput.d.ts", "RadioButton.js", "RadioButton.d.ts", "Select.js", "Select.d.ts", "Switch.js", "Switch.d.ts", "TextArea.js", "TextArea.d.ts", "index.js", "index.d.ts"]) {
  fs.copyFileSync(path.join(src, file), path.join(dist, file));
}

console.log(JSON.stringify({ status: "pass", package: "@design-system/react", outDir: "dist" }));
