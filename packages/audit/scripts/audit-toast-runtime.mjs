#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/toast-2026-09-05/interactive/react-runtime.html?fresh=toast-reference-runtime-2";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/toast-2026-09-05/interactive/react-runtime.html");
const browserCandidates = [
  "/Users/r1c0/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Users/r1c0/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
];

function browserLaunchOptions() {
  const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
  return executablePath ? { executablePath } : {};
}

function mimeType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function createStaticServer(root) {
  return http.createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    const decodedPath = decodeURIComponent(url.pathname);
    const filePath = path.normalize(path.join(root, decodedPath));
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "content-type": mimeType(filePath) });
      response.end(content);
    });
  });
}

if (!fs.existsSync(demoFile)) {
  console.error("Missing Toast runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=toast");
  process.exit(1);
}

const server = createStaticServer(workspaceRoot);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const url = `http://127.0.0.1:${port}${demoPath}`;

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const logs = [];
const pageErrors = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") logs.push({ type: message.type(), text: message.text() });
});
page.on("pageerror", (error) => pageErrors.push(error.message));

await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(300);

const before = await page.evaluate(() => {
  const inspectToast = (toast) => {
    const style = getComputedStyle(toast);
    const icon = toast.querySelector(".toast__icon");
    const iconStyle = icon ? getComputedStyle(icon) : null;
    const title = toast.querySelector(".toast__content strong");
    const titleStyle = title ? getComputedStyle(title) : null;
    const body = toast.querySelector(".toast__content p");
    const bodyStyle = body ? getComputedStyle(body) : null;
    const action = toast.querySelector("[data-toast-action]");
    const dismiss = toast.querySelector("[data-toast-dismiss]");
    const rect = toast.getBoundingClientRect();
    const actionRect = action?.getBoundingClientRect();
    const dismissRect = dismiss?.getBoundingClientRect();
    return {
      label: title?.textContent || "",
      hidden: toast.hidden,
      role: toast.getAttribute("role"),
      live: toast.getAttribute("aria-live"),
      tone: toast.getAttribute("data-tone"),
      variant: toast.getAttribute("data-variant"),
      state: toast.getAttribute("data-state"),
      density: toast.getAttribute("data-density") || "md",
      duration: toast.getAttribute("data-duration"),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      paddingLeft: Number.parseFloat(style.paddingLeft),
      paddingRight: Number.parseFloat(style.paddingRight),
      iconSize: iconStyle ? Number.parseFloat(iconStyle.fontSize) : null,
      titleSize: titleStyle ? Number.parseFloat(titleStyle.fontSize) : null,
      bodySize: bodyStyle ? Number.parseFloat(bodyStyle.fontSize) : null,
      columns: style.gridTemplateColumns,
      shadow: style.boxShadow,
      action: action ? { label: action.textContent.trim(), width: Math.round(actionRect.width), height: Math.round(actionRect.height), tabIndex: action.tabIndex } : null,
      dismiss: dismiss ? { label: dismiss.getAttribute("aria-label"), width: Math.round(dismissRect.width), height: Math.round(dismissRect.height), tabIndex: dismiss.tabIndex } : null,
    };
  };
  return {
    h1: document.querySelector("h1")?.textContent || "",
    active: [...document.querySelectorAll(".toast:not([hidden])")].map(inspectToast),
    hidden: [...document.querySelectorAll(".toast[hidden]")].map(inspectToast),
    stackCount: document.querySelector('.audit-toast-stack[role="region"]')?.querySelectorAll(".toast:not([hidden])").length || 0,
    activeElement: document.activeElement?.tagName || "",
  };
});

await page.getByRole("button", { name: "Reintentar", exact: true }).first().click();
await page.waitForTimeout(100);
const afterAction = await page.evaluate(() => document.querySelector("[data-audit-log]")?.textContent || "");

await page.locator('[data-audit-toast-controlled="true"] [data-toast-dismiss]').click();
await page.waitForTimeout(100);
const afterDismiss = await page.evaluate(() => ({
  log: document.querySelector("[data-audit-log]")?.textContent || "",
  visibleUnidad: [...document.querySelectorAll(".toast:not([hidden]) strong")].some((item) => item.textContent === "Unidad asignada"),
}));

await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(200);
await page.locator('[data-audit-toast-controlled="true"] [data-toast-action]').focus();
await page.waitForTimeout(9300);
const pausedByFocus = await page.evaluate(() => ({
  focusedLabel: document.activeElement?.textContent?.trim() || "",
  visibleUnidad: [...document.querySelectorAll(".toast:not([hidden]) strong")].some((item) => item.textContent === "Unidad asignada"),
  log: document.querySelector("[data-audit-log]")?.textContent || "",
}));

const geometryChecks = [];
for (const theme of ["Light", "Dark"]) {
  await page.getByRole("button", { name: theme, exact: true }).click();
  for (const width of [360, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    const dismiss = page.getByRole("button", { name: "Cerrar error", exact: true });
    await dismiss.hover();
    await page.waitForTimeout(250);
    geometryChecks.push(await page.evaluate(({ theme, width }) => {
      const close = document.querySelector('[data-toast-dismiss][aria-label="Cerrar error"]');
      const toast = close.closest('.toast');
      const cs = getComputedStyle(close);
      const ts = getComputedStyle(toast);
      const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
      function rgba(value) {
        ctx.clearRect(0,0,1,1); ctx.fillStyle=value; ctx.fillRect(0,0,1,1);
        return [...ctx.getImageData(0,0,1,1).data];
      }
      function over(a,b) { const alpha=a[3]/255; return a.slice(0,3).map((v,i)=>v*alpha+b[i]*(1-alpha)); }
      function luminance(a) { return a.slice(0,3).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0); }
      const bg=over(rgba(cs.backgroundColor),rgba(ts.backgroundColor));
      const fg=over(rgba(cs.color),bg);
      const l=[luminance(fg),luminance(bg)].sort((a,b)=>b-a);
      const ratio=(l[0]+.05)/(l[1]+.05);
      const rect=close.getBoundingClientRect();
      const issues=[];
      if (Math.abs(rect.width-rect.height)>.5) issues.push('dismiss is not square');
      if (ratio<4.5) issues.push('dismiss hover contrast below 4.5:1');
      for (const t of document.querySelectorAll('.toast:not([hidden])')) {
        const tr=t.getBoundingClientRect();
        if (tr.right>innerWidth+1 || tr.left<0 || t.scrollWidth>t.clientWidth+1) issues.push('toast overflows');
        const action=t.querySelector('[data-toast-action]');
        const content=t.querySelector('.toast__content');
        if(action) {
          const ar=action.getBoundingClientRect(), cr=content.getBoundingClientRect();
          if(ar.left<cr.right-1 || ar.top>=cr.bottom) issues.push('action left horizontal message row');
        }
      }
      return { theme,width,closeWidth:rect.width,closeHeight:rect.height,hoverContrast:ratio,issues };
    }, { theme, width }));
  }
}

await browser.close();
server.close();

const errors = geometryChecks.flatMap(check => check.issues.map(issue => `${check.theme}/${check.width}: ${issue}`));
if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (before.h1 !== "Toast") errors.push(`Expected Toast demo title, got ${before.h1 || "missing"}.`);
if (before.active.length < 13) errors.push(`Expected broad Toast fixtures, got ${before.active.length}.`);
if (before.hidden.length !== 1) errors.push(`Expected one hidden default-state toast, got ${before.hidden.length}.`);
if (before.activeElement !== "BODY") errors.push(`Toast must not steal focus on mount, active element is ${before.activeElement}.`);
if (before.stackCount !== 3) errors.push(`Expected host/stack fixture with 3 visible toasts, got ${before.stackCount}.`);
for (const toast of before.active) {
  if (!["status", "alert"].includes(toast.role)) errors.push(`${toast.label} must expose status or alert role.`);
  if (toast.role === "alert" && toast.live !== "assertive") errors.push(`${toast.label} alert toast must be assertive.`);
  if (toast.role === "status" && toast.live !== "polite") errors.push(`${toast.label} status toast must be polite.`);
  if (toast.action && (toast.action.height < 32 || toast.action.tabIndex < 0)) errors.push(`${toast.label} action must remain keyboard-reachable with a usable target.`);
  if (toast.dismiss && (toast.dismiss.height < 32 || toast.dismiss.width < 32 || !toast.dismiss.label)) errors.push(`${toast.label} dismiss must remain named and at least 32px in demo density.`);
  if (!toast.shadow || toast.shadow === "none") errors.push(`${toast.label} must use overlay depth to float above content.`);
}
const density = Object.fromEntries(before.active.filter((toast) => ["Small toast", "Medium toast", "Large toast"].includes(toast.label)).map((toast) => [toast.density, toast]));

if (!(density.sm?.iconSize < density.md?.iconSize && density.md?.iconSize < density.lg?.iconSize)) errors.push(`Toast density icons must scale sm < md < lg: ${JSON.stringify(density)}.`);
if (!(density.sm?.titleSize < density.md?.titleSize && density.md?.titleSize < density.lg?.titleSize)) errors.push(`Toast title typography must scale sm < md < lg: ${JSON.stringify(density)}.`);
if (!/Reintentar unidad/.test(afterAction)) errors.push("Toast action did not write to runtime log.");
if (!afterDismiss.log.includes("dismissed=true") || afterDismiss.visibleUnidad) errors.push(`Controlled dismiss did not hide the toast: ${JSON.stringify(afterDismiss)}.`);
if (!pausedByFocus.visibleUnidad || pausedByFocus.focusedLabel !== "Deshacer") errors.push(`Toast duration must pause while focus is inside: ${JSON.stringify(pausedByFocus)}.`);

const payload = { status: errors.length ? "fail" : "pass", url, geometryChecks, before, interactions: { afterAction, afterDismiss, pausedByFocus }, errors };
console.log(JSON.stringify(payload, null, 2));
if (errors.length) process.exit(1);
