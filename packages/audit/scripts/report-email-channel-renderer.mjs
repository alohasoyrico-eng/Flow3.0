#!/usr/bin/env node

import crypto from "node:crypto";
import { createRequire } from "node:module";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { EmailTemplateLayout } from "../../react/src/patterns/EmailTemplateLayout.js";

const require = createRequire(import.meta.url);
const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "email-channel-renderer-audit.json");
const markdownOutput = path.join(outputDir, "email-channel-renderer-audit.md");
const governanceFile = path.join(root, "packages/content/content/email-channel-governance.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function htmlSignals(source) {
  const lower = source.toLowerCase();
  return {
    doctype: /^<!doctype html>/i.test(source),
    htmlRoot: /<html\b[^>]*\blang=/.test(source) && /<\/html>\s*$/i.test(source),
    head: /<head[\s>]/i.test(source),
    title: /<title>[^<]+<\/title>/i.test(source),
    viewport: /name="viewport"/i.test(source),
    body: /<body[\s>]/i.test(source),
    hiddenPreheader: /display\s*:\s*none/i.test(source) && /mso-hide\s*:\s*all/i.test(source),
    presentationTable: /<table[^>]+role="presentation"/i.test(source),
    container600: /width="600"|width\s*:\s*600px|max-width\s*:\s*600px/i.test(source),
    contentCard: /background-color\s*:\s*#ffffff/i.test(source) && /border-radius\s*:\s*20px/i.test(source),
    footer: /Flow Mobility S\.A\. de C\.V\.|Preferencias|Darse de baja|© 2026 Flow Mobility/i.test(source),
    dataRows: /Tarjeta|Categoria|Consumo|Conductor/i.test(source),
    metricsGrid: /Viajes|Ingreso|Gasto en combustible|Alertas abiertas/i.test(source),
    otpBlock: /Verification code|482 917|Válido por 10 minutos/i.test(source),
    securityCopy: /dispositivo nuevo|protege tu cuenta|inicio de sesión/i.test(source),
    expiryCopy: /expira en 7 días/i.test(source),
    steps: /siguientes pasos|Activa notificaciones|Configura Face ID|Explora Rutas/i.test(source),
    cta: /<a\b[^>]+href=/i.test(source),
    script: /<script\b|javascript:/i.test(source),
    cssCustomProperties: /--[a-z0-9-]+\s*:|var\(--/i.test(source),
    flexbox: /display\s*:\s*flex|flex-direction|align-items|justify-content/i.test(source),
    grid: /display\s*:\s*grid|grid-template|grid-column/i.test(source),
    flowWebComponents: /\b(flow-button|flow-card|flow-table|flow-toast|flow-dialog|flow-drawer|data-flow-component)\b/i.test(lower),
    dangerousHtml: /innerHTML|dangerouslySetInnerHTML/i.test(source),
    formControls: /<(button|input|select|textarea|form)\b/i.test(source),
    reactMount: /createRoot|hydrateRoot|data-reactroot|<script[^>]+react/i.test(source),
  };
}

function renderVariant(variant) {
  const markup = renderToStaticMarkup(React.createElement(EmailTemplateLayout, { variant }));
  return `<!doctype html>${markup}`;
}

function createReport() {
  const governance = readJson(governanceFile);
  const variants = governance.expectedVariants ?? [];
  const rows = variants.map((variant) => {
    let html = "";
    let renderError = null;
    try {
      html = renderVariant(variant);
    } catch (error) {
      renderError = error.message;
    }
    const signals = htmlSignals(html);
    const missingRequired = [
      ["doctype", signals.doctype],
      ["htmlRoot", signals.htmlRoot],
      ["head", signals.head],
      ["title", signals.title],
      ["viewport", signals.viewport],
      ["body", signals.body],
      ["hiddenPreheader", signals.hiddenPreheader],
      ["presentationTable", signals.presentationTable],
      ["container600", signals.container600],
      ["contentCard", signals.contentCard],
      ["footer", signals.footer],
    ].filter(([, value]) => !value).map(([signal]) => signal);
    const missingConditional = (governance.conditionalVariantSignals?.[variant] ?? [])
      .filter((signal) => !signals[signal]);
    const forbiddenSignals = (governance.forbiddenHtmlSignals ?? [])
      .filter((signal) => signals[signal]);
    return {
      variant,
      renderError,
      bytes: Buffer.byteLength(html),
      sha256: sha256(html),
      signals,
      missingRequired,
      missingConditional,
      forbiddenSignals,
    };
  });
  const issues = [
    ...rows.filter((row) => row.renderError).map((row) => `${row.variant}: render failed: ${row.renderError}`),
    ...rows.flatMap((row) => row.missingRequired.map((signal) => `${row.variant}: missing rendered email signal ${signal}.`)),
    ...rows.flatMap((row) => row.missingConditional.map((signal) => `${row.variant}: missing rendered conditional signal ${signal}.`)),
    ...rows.flatMap((row) => row.forbiddenSignals.map((signal) => `${row.variant}: rendered forbidden signal ${signal}.`)),
  ];
  const inventory = {
    renderCases: rows.length,
    passingRenderCases: rows.filter((row) => !row.renderError && !row.missingRequired.length && !row.missingConditional.length && !row.forbiddenSignals.length).length,
    renderedDoctypes: rows.filter((row) => row.signals.doctype).length,
    htmlRoots: rows.filter((row) => row.signals.htmlRoot).length,
    headBlocks: rows.filter((row) => row.signals.head).length,
    bodyBlocks: rows.filter((row) => row.signals.body).length,
    hiddenPreheaders: rows.filter((row) => row.signals.hiddenPreheader).length,
    presentationTableCases: rows.filter((row) => row.signals.presentationTable).length,
    container600Cases: rows.filter((row) => row.signals.container600).length,
    contentCardCases: rows.filter((row) => row.signals.contentCard).length,
    footerCases: rows.filter((row) => row.signals.footer).length,
    conditionalSignalGaps: rows.reduce((sum, row) => sum + row.missingConditional.length, 0),
    forbiddenRenderedSignals: rows.reduce((sum, row) => sum + row.forbiddenSignals.length, 0),
    emailRendererDebt: issues.length,
  };
  const expectedIssues = Object.entries(governance.rendererExpectedInventory ?? {})
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => `rendererExpectedInventory.${key}: expected ${expected}, got ${inventory[key]}.`);
  const allIssues = [...expectedIssues, ...issues];
  return {
    status: allIssues.length ? "fail" : "pass",
    audit: "email channel renderer",
    principle: "Email React authoring must emit static, table-safe HTML output per channel variant without depending on the web runtime cascade.",
    generatedAt: new Date().toISOString(),
    inventory,
    variants: rows,
    issues: allIssues,
  };
}

function markdown(report) {
  return [
    "# Email channel renderer audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Rendered variants",
    "",
    "| Variant | Bytes | SHA-256 | Required gaps | Conditional gaps | Forbidden |",
    "| --- | ---: | --- | ---: | ---: | ---: |",
    ...report.variants.map((row) => `| ${row.variant} | ${row.bytes} | ${row.sha256.slice(0, 16)} | ${row.missingRequired.length} | ${row.missingConditional.length} | ${row.forbiddenSignals.length} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ].join("\n");
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-email-channel-renderer.mjs.`);
  }
}
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, `${markdown(report)}\n`);

if (report.status !== "pass") {
  throw new Error(`Email channel renderer failed with ${report.issues.length} issue(s).`);
}
