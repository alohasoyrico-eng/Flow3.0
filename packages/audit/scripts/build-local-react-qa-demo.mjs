#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const localQaRoot = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa");
const runtimeHtml = "react-runtime.html";

const requestedComponent = process.argv.find((arg) => arg.startsWith("--component="))?.split("=")[1] ?? "button";

const components = {
  button: {
    title: "Button",
    directory: "button-2026-08-17",
    module: "Button.js",
    exportName: "Button",
    buildId: "button-warning-secondary-runtime-1",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes de accion"),
          e("div", { className: "audit-row" },
            action({ label: "Primary", variant: "primary" }),
            action({ label: "Secondary", variant: "secondary" }),
            action({ label: "Tertiary", variant: "tertiary" }),
            action({ label: "Outlined", variant: "outlined" }),
            action({ label: "Ghost", variant: "ghost" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Intents"),
          e("div", { className: "audit-row" },
            action({ label: "Danger", intent: "danger" }),
            action({ label: "Warning", intent: "warning" }),
            action({ label: "Secondary danger", variant: "secondary", intent: "danger" }),
            action({ label: "Secondary warning", variant: "secondary", intent: "warning" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-row" },
            action({ label: "Small", icon: "add", density: "sm" }),
            action({ label: "Medium", icon: "add", density: "md" }),
            action({ label: "Large", icon: "add", density: "lg" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-row" },
            action({ label: "Hover", state: "hover" }),
            action({ label: "Focus", state: "focus" }),
            action({ label: "Pressed", state: "pressed" }),
            action({ label: "Saving", loading: true }),
            e(Component, { label: "Disabled", disabled: true, onClick: onAction("Disabled") })
          )
        )`,
  },
  "icon-button": {
    title: "IconButton",
    directory: "icon-button-2026-08-20",
    module: "IconButton.js",
    exportName: "IconButton",
    buildId: "icon-button-1to1-runtime-2",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-row audit-row--toolbar" },
            action({ label: "Switch language", icon: "language", variant: "ghost", density: "md" }),
            action({ label: "Show grid", icon: "grid_view", variant: "secondary", selected: true, density: "md" }),
            action({ label: "Toggle contrast", icon: "contrast", variant: "ghost", selected: true, badge: true, density: "md" }),
            action({ label: "Open actions", icon: "more_vert", variant: "outlined", density: "md" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes de accion"),
          e("div", { className: "audit-row" },
            action({ label: "Primary add", icon: "add", variant: "primary" }),
            action({ label: "Secondary edit", icon: "edit", variant: "secondary" }),
            action({ label: "Tertiary search", icon: "search", variant: "tertiary" }),
            action({ label: "Outlined more", icon: "more_vert", variant: "outlined" }),
            action({ label: "Ghost close", icon: "close", variant: "ghost" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Intents"),
          e("div", { className: "audit-row" },
            action({ label: "Danger secondary", icon: "delete", variant: "secondary", intent: "danger" }),
            action({ label: "Warning secondary", icon: "priority_high", variant: "secondary", intent: "warning" }),
            action({ label: "Danger primary", icon: "delete", variant: "primary", intent: "danger" }),
            action({ label: "Warning primary", icon: "priority_high", variant: "primary", intent: "warning" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-row" },
            action({ label: "Small icon", icon: "add", density: "sm" }),
            action({ label: "Medium icon", icon: "add", density: "md" }),
            action({ label: "Large icon", icon: "add", density: "lg" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados publicos"),
          e("div", { className: "audit-row" },
            action({ label: "Hover", icon: "language", variant: "ghost", state: "hover" }),
            action({ label: "Focus", icon: "contrast", variant: "ghost", state: "focus" }),
            action({ label: "Pressed", icon: "contrast", variant: "secondary", state: "pressed" }),
            action({ label: "Selected", icon: "check", variant: "secondary", selected: true }),
            action({ label: "Badge", icon: "notifications", variant: "secondary", badge: true }),
            action({ label: "Loading", icon: "sync", variant: "secondary", loading: true }),
            e(Component, { label: "Disabled", icon: "block", disabled: true, onClick: onAction("Disabled") })
          )
        )`,
  },
  "inline-validation": {
    title: "InlineValidation",
    directory: "inline-validation-2026-09-04",
    module: "InlineValidation.js",
    exportName: "InlineValidation",
    buildId: "inline-validation-runtime-3",
    runtimeInstruction: "InlineValidation no roba foco; conecta mensaje con el campo mediante aria-describedby y solo anuncia cuando live=true.",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Driver email", value: "ana@", message: "Enter a complete email address.", state: "error", fullWidth: true, live: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Monthly card limit", value: "$12,000", message: "Limit is above the recommended range.", state: "warning", fullWidth: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Vehicle ID", value: "MX-4832", message: "Vehicle ID is available.", state: "success", fullWidth: true }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Mensajes sin duplicar field"),
          e("div", { className: "audit-row" },
            action({ label: "Info message", message: "Used for reporting and approvals.", state: "info", field: false }),
            action({ label: "Success message", message: "Saved for this route.", state: "success", field: false }),
            action({ label: "Warning message", message: "Review before dispatch.", state: "warning", field: false }),
            action({ label: "Error message", message: "Required before continuing.", state: "error", field: false, live: true })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Small field", value: "OPS", message: "Compact filter feedback.", state: "info", density: "sm", fullWidth: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Medium field", value: "MX-4832", message: "Default form feedback.", state: "success", density: "md", fullWidth: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Large field", value: "$12,000", message: "Touch review feedback.", state: "warning", density: "lg", fullWidth: true }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Default field", value: "North Fleet", state: "default", fullWidth: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Info field", value: "Operations", message: "Used for reporting and approvals.", state: "info", fullWidth: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Success field", value: "MX-4832", message: "Vehicle ID is available.", state: "success", fullWidth: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Warning field", value: "$12,000", message: "Limit is above the recommended range.", state: "warning", fullWidth: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Error field", value: "ana@", message: "Enter a complete email address.", state: "error", fullWidth: true, live: true })),
            e("div", { className: "audit-card audit-card--compact" }, action({ label: "Disabled field", value: "Locked", message: "Only fleet admins can edit this value.", state: "disabled", fullWidth: true }))
          )
        )`,
  },
  "progress": {
    title: "ProgressIndicator",
    directory: "progress-2026-08-25",
    module: "ProgressIndicator.js",
    exportName: "ProgressIndicator",
    buildId: "progress-react-runtime-1",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Upload progress", value: 42, showValue: true })),
            e("div", { className: "audit-card" }, e(Component, { label: "Syncing routes", indeterminate: true })),
            e("div", { className: "audit-card" }, e(Component, { label: "Complete", value: 100, showValue: true, state: "complete" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", value: 36, showValue: true, state: "disabled" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Tonos"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Success", value: 72, showValue: true, tone: "success" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Warning", value: 52, showValue: true, tone: "warning" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Danger", value: 24, showValue: true, tone: "danger" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Small progress", value: 35, showValue: true, density: "sm" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Medium progress", value: 55, showValue: true, density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Large progress", value: 75, showValue: true, density: "lg" }))
          )
        )`,
  },
  "animated-moment": {
    title: "AnimatedMoment",
    directory: "animated-moment-2026-08-31",
    module: "AnimatedMoment.js",
    exportName: "AnimatedMoment",
    buildId: "animated-moment-grid-visual-2",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" },
              e(Component, {
                label: "Pago aprobado",
                description: "Recibo listo para enviar.",
                variant: "celebration",
                state: "playing",
                animationSource: "/animations/payment-approved.json",
                reducedMotionFallback: "Confirmacion estatica",
                stateLabel: "Reproduciendo",
                fullWidth: true
              })
            )
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Success", description: "Operacion completada.", variant: "success", state: "playing", reducedMotionFallback: "Success fallback" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Empty", description: "Sin actividad disponible.", variant: "empty", state: "idle", reducedMotionFallback: "Empty fallback" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Loading", description: "Sincronizando cambios.", variant: "loading", state: "playing", reducedMotionFallback: "Loading fallback" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Celebration", description: "Meta alcanzada.", variant: "celebration", state: "complete", reducedMotionFallback: "Celebration fallback" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Idle", variant: "success", state: "idle", reducedMotionFallback: "Idle fallback", stateLabel: "Idle" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Playing", variant: "success", state: "playing", animationData: { v: "5.7.0", layers: [] }, reducedMotionFallback: "Playing fallback", stateLabel: "Playing" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Paused", variant: "loading", state: "paused", animationData: { v: "5.7.0", layers: [] }, reducedMotionFallback: "Paused fallback", stateLabel: "Paused" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Complete", variant: "celebration", state: "complete", reducedMotionFallback: "Complete fallback", stateLabel: "Complete" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Reduced motion", variant: "success", state: "reduced-motion", animationData: { v: "5.7.0", layers: [] }, reducedMotionFallback: "Static motion fallback", stateLabel: "Reduced motion" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", variant: "success", state: "disabled", reducedMotionFallback: "Animation disabled", stateLabel: "Disabled" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Small moment", description: "Compact cue.", density: "sm", variant: "success", state: "playing", reducedMotionFallback: "Small fallback" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Medium moment", description: "Default cue.", density: "md", variant: "loading", state: "playing", reducedMotionFallback: "Medium fallback" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Large moment", description: "Prominent cue.", density: "lg", variant: "celebration", state: "complete", reducedMotionFallback: "Large fallback" }))
          )
        )`,
  },
  "audit-event": {
    title: "AuditEvent",
    directory: "audit-event-2026-09-02",
    module: "AuditEvent.js",
    exportName: "AuditEvent",
    buildId: "audit-event-runtime-2",
    runtimeInstruction: "AuditEvent no abre, filtra ni secuencia eventos; el patrón padre decide la interacción.",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid audit-grid--charts" },
            e("div", { className: "audit-card audit-card--chart" }, e(Component, {
              label: "Fuel limit changed",
              description: "Ana Sosa updated MX-4821 policy.",
              meta: "Ana Sosa - Operations",
              timestamp: "09:42",
              status: "Logged",
              icon: "manage_history",
              tone: "neutral"
            })),
            e("div", { className: "audit-card audit-card--chart" }, e(Component, {
              label: "Document verified",
              description: "Driver license was approved after review.",
              meta: "Fleet admin",
              timestamp: "10:16",
              status: "Verified",
              icon: "check",
              tone: "success",
              state: "verified"
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Tonos y estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Logged", description: "Single audit record.", meta: "Operations", timestamp: "09:42", status: "Logged", icon: "manage_history", tone: "neutral" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Verified", description: "License approved.", meta: "Fleet admin", timestamp: "10:16", status: "Verified", icon: "check", tone: "success", state: "verified" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Review", description: "Policy change is waiting.", meta: "Risk rules", timestamp: "11:03", status: "Review", icon: "priority_high", tone: "warning", state: "warning" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Critical", description: "Document evidence failed review.", meta: "Risk rules", timestamp: "11:21", status: "Critical", icon: "warning", tone: "danger", state: "critical" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Focus", description: "Parent workflow owns interaction.", meta: "Accessibility", timestamp: "12:10", status: "Focused", icon: "tab", state: "focus" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", description: "Archived event remains visible.", meta: "System", timestamp: "12:44", status: "Archived", icon: "block", state: "disabled" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Small event", description: "Compact side panel record.", meta: "Admin", timestamp: "08:10", status: "Logged", icon: "manage_history", density: "sm" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Medium event", description: "Default audit record rhythm.", meta: "Admin", timestamp: "09:42", status: "Logged", icon: "manage_history", density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Large event", description: "Touch review surface.", meta: "Admin", timestamp: "10:16", status: "Review", icon: "priority_high", tone: "warning", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Límite de patrón"),
          e("div", { className: "audit-grid audit-grid--charts" },
            e("div", { className: "audit-card audit-card--chart" }, e(Component, {
              label: "Audit sequence",
              description: "More than one event requires Timeline, Table, or workflow pattern.",
              meta: "Pattern boundary",
              timestamp: "--",
              status: "Escalate",
              icon: "timeline",
              tone: "warning",
              state: "warning"
            }))
          )
        )`,
  },
  "breadcrumbs": {
    title: "Breadcrumbs",
    directory: "breadcrumbs-2026-08-29",
    module: "Breadcrumbs.js",
    exportName: "Breadcrumbs",
    buildId: "breadcrumbs-padding-home-runtime-1",
    eventPropName: "onClick",
    supportPreamble: `const fleetPath = [
      { label: "Flota", href: "#/fleet" },
      { label: "Unidades", href: "#/fleet/units" },
      { label: "JMX-214-B", current: true }
    ];
    const homePath = [
      { label: "Inicio", icon: "home", iconOnly: true, href: "#/" },
      { label: "Flota", href: "#/fleet" },
      { label: "Unidades", href: "#/fleet/units" },
      { label: "JMX-214-B", current: true }
    ];
    const longPath = [
      { label: "Operaciones", href: "#/ops" },
      { label: "Norte", href: "#/ops/north" },
      { label: "Flota", href: "#/ops/north/fleet" },
      { label: "Unidades", href: "#/ops/north/fleet/units" },
      { label: "JMX-214-B", current: true }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta", variant: "standard" })),
            e("div", { className: "audit-card" }, e(Component, { items: homePath, label: "Ruta con inicio", variant: "standard" })),
            e("div", { className: "audit-card" }, e(Component, { items: longPath, label: "Ruta larga", variant: "overflow", maxItems: 4 })),
            e("div", { className: "audit-card" }, e(Component, { items: longPath, label: "Ruta movil", variant: "mobile" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta small", density: "sm" })),
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta medium", density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta large", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta hover", state: "hover" })),
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta focus", state: "focus" })),
            e("div", { className: "audit-card" }, e(Component, { items: longPath, label: "Ruta collapsed", variant: "overflow", maxItems: 4, state: "collapsed" })),
            e("div", { className: "audit-card" }, e(Component, { items: fleetPath, label: "Ruta disabled", disabled: true }))
          )
        )`,
  },
  "pagination": {
    title: "Pagination",
    directory: "pagination-2026-08-29",
    module: "Pagination.js",
    exportName: "Pagination",
    buildId: "pagination-keyboard-runtime-1",
    eventPropName: "onPageChange",
    actionHandler: "(page, event) => onAction('Page=' + page)(event)",
    statefulValueProp: "page",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ page: 4, pages: 12 }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Rangos"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ page: 1, pages: 12, label: "Inicio de páginas" })),
            e("div", { className: "audit-card" }, action({ page: 6, pages: 12, label: "Páginas medias" })),
            e("div", { className: "audit-card" }, action({ page: 12, pages: 12, label: "Final de páginas" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Saltos"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ page: 14, pages: 42, variant: "jump", jumpSize: 10, label: "Saltos de 10 páginas" })),
            e("div", { className: "audit-card" }, action({ page: 37, pages: 42, variant: "jump", jumpSize: 5, label: "Saltos de 5 páginas" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ page: 4, pages: 12, density: "sm", label: "Pagination small" })),
            e("div", { className: "audit-card" }, action({ page: 4, pages: 12, density: "md", label: "Pagination medium" })),
            e("div", { className: "audit-card" }, action({ page: 4, pages: 12, density: "lg", label: "Pagination large" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ page: 4, pages: 12, state: "hover", label: "Pagination hover" })),
            e("div", { className: "audit-card" }, action({ page: 4, pages: 12, state: "focus", label: "Pagination focus" })),
            e("div", { className: "audit-card" }, action({ page: 4, pages: 12, state: "selected", label: "Pagination selected" })),
            e("div", { className: "audit-card" }, e(Component, { page: 4, pages: 12, disabled: true, label: "Pagination disabled", "data-runtime-action": "true" }))
          )
        )`,
  },
  "accordion": {
    title: "Accordion",
    directory: "accordion-2026-08-25",
    module: "Accordion.js",
    exportName: "Accordion",
    buildId: "accordion-dashboard-runtime-3",
    indexImports: ["ProgressIndicator", "FileUpload"],
    eventPropName: "onExpandedChange",
    actionHandler: "(ids, event) => onAction('Accordion=' + ids.join(','))(event)",
    statefulValueProp: "expandedIds",
    supportPreamble: `const documentUploadFiles = [{ key: "license", name: "licencia-conducir.pdf", size: "668 KB", type: "PDF", status: "Revisado", tone: "success" }];
    function DashboardDocumentsPanel({ density }) {
      const [files, setFiles] = React.useState(documentUploadFiles);
      return e("div", { className: "audit-stack", "data-flow-slot": "accordion-dashboard-documents" },
      e(ProgressIndicator, { label: "Verificación", value: 3, max: 4, showValue: true, fullWidth: true, tone: "danger", density }),
      e(FileUpload, {
        label: "Sube un documento",
        description: "PDF o foto · máx 10 MB",
        files,
        accept: ".pdf,image/*",
        multiple: true,
        chooseAction: { key: "choose", label: "Sube un documento", icon: "upload_file" },
        removeAction: { key: "remove", label: "Quitar", icon: "close", variant: "ghost" },
        onChange: setFiles,
        density
      }));
    }
    const documentPanel = (density) => e(DashboardDocumentsPanel, { density });
    const accordionItems = [
      { id: "docs", title: "Documentos", meta: "3 de 4", icon: "description", content: documentPanel() },
      { id: "hist", title: "Historial de viajes", meta: "128", icon: "history", content: "128 viajes este mes. Último: hoy 14:32." },
      { id: "pagos", title: "Pagos", meta: "Activos", icon: "payments", content: "Depósito semanal a cuenta terminación 4821." },
      { id: "disabled", title: "Archive disabled", meta: "Blocked", icon: "block", disabled: true, content: "Disabled rows stay visible but cannot be toggled." }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ items: accordionItems, defaultOpen: "docs" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ items: accordionItems, expandedIds: ["docs"] })),
            e("div", { className: "audit-card" }, action({ items: accordionItems, expandedIds: ["docs", "hist"], variant: "multiple" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ items: accordionItems, defaultOpen: "docs", density: "sm" })),
            e("div", { className: "audit-card" }, action({ items: [
              { id: "docs", title: "Documentos", meta: "3 de 4", icon: "description", content: documentPanel("md") },
              { id: "hist", title: "Historial de viajes", meta: "128", icon: "history", content: "128 viajes este mes. Último: hoy 14:32." },
              { id: "pagos", title: "Pagos", meta: "Activos", icon: "payments", content: "Depósito semanal a cuenta terminación 4821." }
            ], defaultOpen: "docs", density: "md" })),
            e("div", { className: "audit-card" }, action({ items: [
              { id: "docs", title: "Documentos", meta: "3 de 4", icon: "description", content: documentPanel("lg") },
              { id: "hist", title: "Historial de viajes", meta: "128", icon: "history", content: "128 viajes este mes. Último: hoy 14:32." },
              { id: "pagos", title: "Pagos", meta: "Activos", icon: "payments", content: "Depósito semanal a cuenta terminación 4821." }
            ], defaultOpen: "docs", density: "lg" }))
          )
        )`,
  },
  "stepper": {
    title: "Stepper",
    directory: "stepper-2026-08-25",
    module: "Stepper.js",
    exportName: "Stepper",
    buildId: "stepper-react-runtime-1",
    supportPreamble: `const steps = [
      { id: "vehicle", label: "Vehicle", description: "Confirm asset" },
      { id: "driver", label: "Driver", description: "Assign operator" },
      { id: "dispatch", label: "Dispatch", description: "Ready to send" }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Orientacion"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Horizontal steps", steps, current: 1 })),
            e("div", { className: "audit-card" }, e(Component, { label: "Vertical steps", steps, current: 2, orientation: "vertical" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Small steps", steps, current: 1, density: "sm" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Medium steps", steps, current: 1, density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Large steps", steps, current: 1, density: "lg" }))
          )
        )`,
  },
  card: {
    title: "Card",
    directory: "card-2026-08-20",
    module: "Card.js",
    exportName: "Card",
    buildId: "card-pressed-surface-runtime-1",
    indexImports: ["Table", "EmptyState", "Skeleton"],
    referenceAssets: [
      {
        source: path.join(workspaceRoot, "../../Desktop/Ilustracion Flow/System vision gallery/Escenario 1.jpeg"),
        target: "media-card-reference.jpeg",
      },
    ],
    eventPropName: "onAction",
    actionHandler: "(key, action, event) => onAction(key || props.actionKey || props.title)(event || { type: 'action' })",
    supportPreamble: `const baseCard = {
      title: "Wallet health",
      value: "98%",
      detail: "3 cards active - 1 review pending",
      status: "Stable",
      icon: "credit_card",
    };
    const mediaAsset = "./media-card-reference.jpeg";`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Superficie contenedora"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({
              title: "Shipment exception",
              status: "Review",
              icon: "local_shipping",
              density: "md",
              actions: [
                { key: "resolve", label: "Resolve", variant: "primary" },
                { key: "more", label: "More actions", icon: "more_horiz", iconOnly: true },
              ],
              children: e("p", null, "Custom body content uses the Card surface without creating a parallel card anatomy."),
            })),
            e("div", { className: "audit-card" }, action({
              title: "Header actions",
              detail: "Actions are governed by Card header anatomy.",
              icon: "space_dashboard",
              density: "md",
              actionPlacement: "header",
              actions: [
                { key: "share", label: "Share", icon: "share", iconOnly: true },
                { key: "archive", label: "Archive", variant: "secondary" },
              ],
            })),
            e("div", { className: "audit-card" }, action({
              interactive: true,
              actionKey: "open-custom-card",
              density: "sm",
              children: e("div", null,
                e("strong", null, "Interactive custom content"),
                e("p", null, "Enter, Space and click should activate the Card.")
              ),
            }))
            ,
            e("div", { className: "audit-card" }, action({
              title: "Media custom body",
              media: mediaAsset,
              mediaAlt: "EV charging reference image",
              composition: "media",
              children: e("p", null, "Custom media body keeps image and governed body frame.")
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Default", variant: "default" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Minimal", variant: "minimal" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Elevated", variant: "elevated" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Ghost", variant: "ghost" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Composiciones"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Standard", composition: "standard" })),
            e("div", { className: "audit-card" }, action({ title: "Tarjeta ****4102", icon: "credit_card", composition: "compact", status: "Activa" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Media", composition: "media", media: mediaAsset, mediaAlt: "EV charging reference image" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Small", density: "sm" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Medium", density: "md" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Large", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Hover", state: "hover" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Focus", state: "focus" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Selected", selected: true, interactive: true, actionKey: "selected-card" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Loading", loading: true, value: "Syncing" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Error", state: "error", status: "Failed" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Disabled", disabled: true, interactive: true, actionKey: "disabled-card" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Muted", state: "muted" })),
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Interactive", interactive: true, actionKey: "interactive-card" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Acciones internas"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({
              ...baseCard,
              title: "Actions",
              actions: [
                { key: "details", label: "Details", variant: "secondary" },
                { key: "freeze", label: "Freeze", variant: "danger" },
                { key: "more", label: "More actions", icon: "more_horiz", iconOnly: true },
              ],
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Recipes gobernados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { title: "Table shell", detail: "Card owns the object frame; Table owns tabular data." },
              e(Table, {
                label: "Card table recipe",
                columns: [{ key: "driver", label: "Driver" }, { key: "status", label: "Status" }],
                rows: [{ id: "ana", driver: "Ana Sosa", status: "Active" }, { id: "luis", driver: "Luis Perez", status: "Review" }],
                density: "sm"
              })
            )),
            e("div", { className: "audit-card" }, e(Component, { title: "Empty state shell" },
              e(EmptyState, {
                title: "No cards yet",
                description: "Create a card to start tracking fleet spend.",
                icon: "credit_card",
                action: { key: "create-card", label: "Create card" },
                variant: "search-empty",
                fullWidth: true
              })
            )),
            e("div", { className: "audit-card" }, e(Component, { title: "Skeleton shell", state: "loading" },
              e(Skeleton, {
                label: "Card content loading",
                variant: "card",
                rows: 3,
                fullWidth: true
              })
            ))
          )
        )`,
  },
  "kpi-card": {
    title: "KpiCard",
    directory: "kpi-card-2026-08-24",
    module: "patterns/KpiCard.js",
    exportName: "KpiCard",
    buildId: "kpi-card-react-runtime-1",
    eventPropName: "onSelect",
    actionHandler: "(metric, event) => onAction(props.label)(event)",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Metrica base"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Fleet availability", value: 96, unit: "%", delta: "+4%", trend: "up", tone: "success", status: { label: "Healthy", tone: "success" }, tag: { label: "Live", tone: "info" } })),
            e("div", { className: "audit-card" }, action({ label: "Risk exposure", value: "$18k", delta: "+12%", trend: "up", tone: "warning", state: "stale", status: { label: "Review", tone: "warning" } })),
            e("div", { className: "audit-card" }, action({ label: "Open incidents", value: 7, delta: "-2", trend: "down", tone: "danger", action: { key: "review-incidents", label: "Review" }, onAction: (key, event) => onAction("Review incidents")(event) }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small metric", value: "42", density: "sm", delta: "+1", trend: "up", tone: "info" })),
            e("div", { className: "audit-card" }, action({ label: "Medium metric", value: "42", density: "md", delta: "+1", trend: "up", tone: "info" })),
            e("div", { className: "audit-card" }, action({ label: "Large metric", value: "42", density: "lg", delta: "+1", trend: "up", tone: "info" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados de patron"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Loading metric", loading: true, density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Empty metric", value: 96, state: "empty", empty: { title: "No metric yet", description: "Waiting for the first data point." }, density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Permission metric", value: 96, state: "permission-blocked", empty: { title: "Permission needed", description: "Ask an admin for access." }, density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Error metric", state: "error", error: { label: "Metric unavailable", description: "Retry later." }, density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled metric", value: "88", disabled: true, density: "md" }))
          )
        )`,
  },
  "chart-wrapper": {
    title: "ChartWrapper",
    directory: "chart-wrapper-2026-08-24",
    module: "patterns/ChartWrapper.js",
    exportName: "ChartWrapper",
    buildId: "chart-wrapper-react-runtime-1",
    eventPropName: "onAction",
    actionHandler: "(key, event) => onAction(props.label + ':' + key)(event)",
    supportPreamble: `const routeTable = {
      columns: [{ key: "day", label: "Day" }, { key: "routes", label: "Routes" }],
      rows: [{ id: "mon", day: "Mon", routes: "12" }, { id: "tue", day: "Tue", routes: "18" }]
    };
    const insightList = {
      items: [{ key: "best", label: "Best day", value: "Wed" }, { key: "risk", label: "Late risk", value: "Low" }]
    };
    const overflow = {
      triggerLabel: "Chart actions",
      items: [{ key: "compare", label: "Compare" }, { key: "download", label: "Download" }]
    };
    const baseChart = {
      label: "Route completion chart",
      value: "92%",
      caption: "Completed routes by day.",
      variant: "line",
      values: [12, 18, 22, 19],
      labels: ["Mon", "Tue", "Wed", "Thu"],
      fullWidth: true
    };`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Chart card pattern"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({
              label: "Route completion",
              description: "Completed routes by day.",
              filtered: true,
              chart: baseChart,
              summary: { label: "Completed", value: "92%", tone: "success" },
              status: { label: "Filtered", tone: "warning" },
              primaryAction: { key: "export", label: "Export", variant: "secondary" },
              overflow,
              table: routeTable,
              list: insightList
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small chart", density: "sm", chart: { ...baseChart, label: "Small chart", variant: "bars" }, summary: { label: "Small", value: "42", tone: "info" } })),
            e("div", { className: "audit-card" }, action({ label: "Medium chart", density: "md", chart: { ...baseChart, label: "Medium chart", variant: "line" }, summary: { label: "Medium", value: "42", tone: "info" } })),
            e("div", { className: "audit-card" }, action({ label: "Large chart", density: "lg", chart: { ...baseChart, label: "Large chart", variant: "area" }, summary: { label: "Large", value: "42", tone: "info" } }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Loading chart", loading: true, chart: baseChart })),
            e("div", { className: "audit-card" }, e(Component, { label: "Empty chart", state: "empty", description: "Waiting for the first route data point.", chart: baseChart })),
            e("div", { className: "audit-card" }, e(Component, { label: "Permission chart", state: "permission-blocked", description: "Ask an admin for analytics access.", chart: baseChart })),
            e("div", { className: "audit-card" }, e(Component, { label: "Error chart", error: { label: "Chart unavailable", description: "Retry later." }, chart: baseChart })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled chart", disabled: true, chart: baseChart, primaryAction: { key: "disabled", label: "Disabled action" } }))
          )
        )`,
  },
  "card-summary": {
    title: "CardSummary",
    directory: "card-summary-2026-08-24",
    module: "CardSummary.js",
    exportName: "CardSummary",
    buildId: "card-summary-react-runtime-1",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Payment/fleet summary"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Flota", meta: "DIEGO VERA", number: "4242 4242 4242 4821", expires: "12/28", status: "Active", variant: "physical" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Digital", meta: "ANA SOSA", number: "**** 0937", expires: "03/27", status: "Active", variant: "virtual" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Viaticos", meta: "LUIS PEREZ", number: "**** 1105", expires: "08/29", status: "Review", state: "warning" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Small", meta: "ANA SOSA", number: "**** 4821", expires: "12/28", density: "sm" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Medium", meta: "ANA SOSA", number: "**** 4821", expires: "12/28", density: "md" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Large", meta: "ANA SOSA", number: "**** 4821", expires: "12/28", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados y layouts"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Frozen default text", meta: "ANA SOSA", number: "**** 4821", expires: "12/28", state: "frozen" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Limit", meta: "ANA SOSA", number: "**** 4821", expires: "12/28", variant: "limit", metrics: [{ key: "available", label: "Available", value: "$2,480" }, { key: "limit", label: "Limit", value: "$5,000" }] })),
            e("div", { className: "audit-card" }, e(Component, { label: "Compact", meta: "ANA SOSA", number: "**** 4821", variant: "compact" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", meta: "ANA SOSA", number: "**** 4821", disabled: true }))
          )
        )`,
  },
  "route-summary": {
    title: "RouteSummary",
    directory: "route-summary-2026-08-24",
    module: "RouteSummary.js",
    exportName: "RouteSummary",
    buildId: "route-summary-react-runtime-1",
    eventPropName: "onClick",
    actionHandler: "onAction(props.label)",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Route/admin summary"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card audit-card--chart" }, e(Component, {
              label: "Fast route",
              description: "Best option for current policy and station availability.",
              metrics: [{ key: "eta", label: "ETA", value: "18 min" }, { key: "distance", label: "Distance", value: "12.4 km" }, { key: "fuel", label: "Fuel", value: "$842" }],
              actions: [{ key: "start", label: "Start route" }, { key: "compare", label: "Compare", variant: "secondary" }]
            })),
            e("div", { className: "audit-card" }, e(Component, {
              label: "Policy route",
              description: "Requires manager review before dispatch.",
              variant: "policy",
              state: "warning",
              tone: "warning",
              metrics: [{ key: "risk", label: "Risk", value: "High" }, { key: "window", label: "Window", value: "42 min" }],
              actions: [{ key: "review", label: "Review", intent: "warning" }]
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Small route", description: "6 min", density: "sm", metrics: [{ key: "eta", label: "ETA", value: "6 min" }] })),
            e("div", { className: "audit-card" }, e(Component, { label: "Medium route", description: "12 min", density: "md", metrics: [{ key: "eta", label: "ETA", value: "12 min" }] })),
            e("div", { className: "audit-card" }, e(Component, { label: "Large route", description: "18 min", density: "lg", metrics: [{ key: "eta", label: "ETA", value: "18 min" }] }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados y variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(Component, { label: "Selected route", selected: true, metrics: [{ key: "eta", label: "ETA", value: "18 min" }] })),
            e("div", { className: "audit-card" }, e(Component, { label: "Compact route", variant: "compact", description: "0.9 km - llegas en 4 min", actions: [{ key: "cancel", label: "Cancel route", icon: "close", variant: "ghost" }] })),
            e("div", { className: "audit-card" }, e(Component, { label: "Compare route", variant: "compare", metrics: [{ key: "eta", label: "ETA", value: "18 min" }, { key: "distance", label: "Distance", value: "12.4 km" }] })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled route", disabled: true, metrics: [{ key: "eta", label: "ETA", value: "18 min" }], actions: [{ key: "start", label: "Start route" }] }))
          )
        )`,
  },
  input: {
    title: "Input",
    directory: "input-2026-08-17",
    module: "Input.js",
    exportName: "Input",
    buildId: "input-placeholder-contract-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "value",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Text", placeholder: "Driver name", variant: "text" })),
            e("div", { className: "audit-card" }, action({ label: "Email", placeholder: "driver@flow.test", variant: "email" })),
            e("div", { className: "audit-card" }, action({ label: "Search", placeholder: "Search driver", variant: "search", icon: "search" })),
            e("div", { className: "audit-card" }, action({ label: "Currency", value: "1234.50", variant: "currency", prefix: "$" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", placeholder: "Driver name", density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", placeholder: "Driver name", density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", placeholder: "Driver name", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Success", state: "success", placeholder: "Driver name", helper: "Saved" })),
            e("div", { className: "audit-card" }, action({ label: "Warning", state: "warning", placeholder: "Driver name", helper: "Review format" })),
            e("div", { className: "audit-card" }, action({ label: "Error", placeholder: "Driver name", error: "Required field" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, value: "Disabled value", "data-runtime-action": "true" })),
            e("div", { className: "audit-card" }, action({ label: "Loading", loading: true, value: "Loading" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Password"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Password", value: "secret", variant: "password", revealable: true, revealLabel: "Show password", hideLabel: "Hide password" }))
          )
        )`,
  },
  "input-amount": {
    title: "InputAmount",
    directory: "input-amount-2026-08-25",
    module: "InputAmount.js",
    exportName: "InputAmount",
    buildId: "input-amount-locale-draft-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + meta.formatted)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "value",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Formato"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Transfer amount", value: "1250.50", helper: "Maximum $5,000.", prefix: "$", suffix: "MXN", currency: "MXN", locale: "es-MX" })),
            e("div", { className: "audit-card" }, action({ label: "Fuel budget", value: "840", helper: "Aligned right with currency context", prefix: "$", suffix: "USD", currency: "USD", locale: "en-US" })),
            e("div", { className: "audit-card" }, action({ label: "Empty amount", placeholder: "0.00", helper: "Decimal keyboard and native paste" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", value: "120.00", prefix: "$", suffix: "MXN" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", value: "240.00", prefix: "$", suffix: "MXN" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", value: "480.00", prefix: "$", suffix: "MXN" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Filled", value: "320.75", prefix: "$", suffix: "MXN" })),
            e("div", { className: "audit-card" }, action({ label: "Loading", loading: true, value: "120.00", prefix: "$", suffix: "USD" })),
            e("div", { className: "audit-card" }, action({ label: "Error", value: "0", error: "Enter a larger amount.", prefix: "$", suffix: "MXN" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, value: "500.00", prefix: "$", suffix: "MXN", helper: "Locked by policy", "data-runtime-action": "true" }))
          )
        )`,
  },
  "card-number-input": {
    title: "CardNumberInput",
    directory: "card-number-input-2026-08-25",
    module: "CardNumberInput.js",
    exportName: "CardNumberInput",
    buildId: "card-number-input-brand-assets-runtime-2",
    paymentBrandAssets: ["visa", "mastercard", "amex", "discover", "generic"],
    eventPropName: "onValueChange",
    actionHandler: "(digits, meta, event) => onAction(props.label + '=' + meta.formatted + ':' + meta.validity)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "value",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Formato"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Card number", helper: "Paste or type a card number", placeholder: "0000 0000 0000 0000", validationMessage: "Invalid card number" })),
            e("div", { className: "audit-card" }, action({ label: "Visa", value: "4111111111111111", helper: "Valid test number", validationMessage: "Invalid card number" })),
            e("div", { className: "audit-card" }, action({ label: "Mastercard", value: "5555555555554444", helper: "Brand is detected locally", validationMessage: "Invalid card number" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", value: "4111111111111111" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", value: "4111111111111111" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", value: "4111111111111111" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Filled", value: "4242424242424242", validationMessage: "Invalid card number" })),
            e("div", { className: "audit-card" }, action({ label: "Invalid", value: "4111111111111112", validationMessage: "Invalid card number" })),
            e("div", { className: "audit-card" }, action({ label: "Loading", loading: true, value: "4111111111111111" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, value: "4111111111111111", helper: "Locked by issuer", "data-runtime-action": "true" }))
          )
        )`,
  },
  "card-expiry-input": {
    title: "CardExpiryInput",
    directory: "card-expiry-input-2026-08-25",
    module: "CardExpiryInput.js",
    exportName: "CardExpiryInput",
    buildId: "card-expiry-input-1to1-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value + ':' + meta.validity)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "value",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Formato"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Expiry date", helper: "Use MM/YY", placeholder: "MM/YY", validationMessage: "Invalid expiry", expiredMessage: "Expired" })),
            e("div", { className: "audit-card" }, action({ label: "Valid expiry", value: "1299", helper: "Valid future date", validationMessage: "Invalid expiry", expiredMessage: "Expired" })),
            e("div", { className: "audit-card" }, action({ label: "Partial expiry", value: "12", helper: "Keeps native correction", validationMessage: "Invalid expiry", expiredMessage: "Expired" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", value: "1299" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", value: "1299" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", value: "1299" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Invalid month", value: "1399", validationMessage: "Invalid expiry", expiredMessage: "Expired" })),
            e("div", { className: "audit-card" }, action({ label: "Expired", value: "0120", validationMessage: "Invalid expiry", expiredMessage: "Expired" })),
            e("div", { className: "audit-card" }, action({ label: "Loading", loading: true, value: "1299" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, value: "1299", helper: "Locked by issuer", "data-runtime-action": "true" }))
          )
        )`,
  },
  "card-security-code-input": {
    title: "CardSecurityCodeInput",
    directory: "card-security-code-input-2026-08-25",
    module: "CardSecurityCodeInput.js",
    exportName: "CardSecurityCodeInput",
    buildId: "card-security-code-input-mask-voice-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(digits, meta, event) => onAction(props.label + '=' + digits + ':' + meta.validity)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "value",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Formato"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Security code", helper: "3 digits", placeholder: "CVC", revealLabel: "Show security code", hideLabel: "Hide security code" })),
            e("div", { className: "audit-card" }, action({ label: "Amex security code", expectedLength: 4, value: "1234", helper: "4 digits", revealLabel: "Show security code", hideLabel: "Hide security code" })),
            e("div", { className: "audit-card" }, action({ label: "Plain CVV", value: "999", revealable: false, helper: "Reveal disabled by product policy" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", value: "123", revealLabel: "Show security code", hideLabel: "Hide security code" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", value: "123", revealLabel: "Show security code", hideLabel: "Hide security code" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", value: "123", revealLabel: "Show security code", hideLabel: "Hide security code" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Incomplete", value: "12", helper: "Needs one more digit", revealLabel: "Show security code", hideLabel: "Hide security code" })),
            e("div", { className: "audit-card" }, action({ label: "Error", value: "12", error: "Invalid security code", revealLabel: "Show security code", hideLabel: "Hide security code" })),
            e("div", { className: "audit-card" }, action({ label: "Loading", loading: true, value: "123", revealLabel: "Show security code", hideLabel: "Hide security code" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, value: "123", helper: "Locked by issuer", revealLabel: "Show security code", hideLabel: "Hide security code", "data-runtime-action": "true" }))
          )
        )`,
  },
  "text-area": {
    title: "TextArea",
    directory: "text-area-2026-08-24",
    module: "TextArea.js",
    exportName: "TextArea",
    buildId: "text-area-density-counter-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "textarea[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Notes", maxLength: 140, placeholder: "Write driver notes", helper: "Visible to operations" })),
            e("div", { className: "audit-card" }, action({ label: "Limited notes", maxLength: 80, value: "Confirm charger status before departure.", placeholder: "Max 80 characters" })),
            e("div", { className: "audit-card" }, action({ label: "Filled", maxLength: 140, value: "Inspection completed before dispatch." }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", maxLength: 120, value: "Small density" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", maxLength: 120, value: "Medium density" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", maxLength: 120, value: "Large density" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Success", state: "success", maxLength: 120, value: "Saved route notes", helper: "Saved" })),
            e("div", { className: "audit-card" }, action({ label: "Warning", state: "warning", maxLength: 80, value: "Review wording before assigning final dispatch note to operations desk now.", helper: "Review wording" })),
            e("div", { className: "audit-card" }, action({ label: "Error", error: "Notes are required", maxLength: 80, value: "Missing dispatch justification at final route stop. Confirm before departure now." })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, maxLength: 120, value: "Disabled notes", "data-runtime-action": "true" }))
          )
        )`,
  },
  slider: {
    title: "Slider",
    directory: "slider-2026-08-24",
    module: "Slider.js",
    exportName: "Slider",
    buildId: "slider-momentum-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "value",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Rangos"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Search radius", min: 0, max: 20, step: 1, unit: " km", value: 8 })),
            e("div", { className: "audit-card" }, action({ label: "Battery threshold", min: 0, max: 100, step: 5, unit: "%", value: 45 })),
            e("div", { className: "audit-card" }, action({ label: "Controlled value", min: 0, max: 20, step: 2, unit: " km", value: 12 }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", min: 0, max: 10, value: 3 })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", min: 0, max: 10, value: 5 })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", min: 0, max: 10, value: 7 }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Hover", state: "hover", min: 0, max: 10, value: 5 })),
            e("div", { className: "audit-card" }, action({ label: "Focus", state: "focus", min: 0, max: 10, value: 5 })),
            e("div", { className: "audit-card" }, action({ label: "Pressed", state: "pressed", min: 0, max: 10, value: 5 })),
            e("div", { className: "audit-card" }, action({ label: "Dragging", state: "dragging", min: 0, max: 10, value: 5 })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, min: 0, max: 10, value: 5, "data-runtime-action": "true" }))
          )
        )`,
  },
  avatar: {
    title: "Avatar",
    directory: "avatar-2026-09-03",
    module: "Avatar.js",
    exportName: "Avatar",
    buildId: "avatar-runtime-1",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP"),
          e("div", { className: "audit-row" },
            e(Component, { name: "Ana Sosa", status: "online" }),
            e(Component, { name: "Luis Prieto", status: "busy" }),
            e(Component, { name: "Rosa Duarte", density: "lg" }),
            e(Component, { name: "Marco Gil", density: "xl", status: "online" }),
            e(Component, { name: "M G", density: "sm", status: "offline" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-row" },
            e(Component, { name: "Ana Sosa", density: "sm", status: "online" }),
            e(Component, { name: "Luis Vera", density: "md", status: "busy" }),
            e(Component, { name: "Rosa Duarte", density: "lg", status: "offline" }),
            e(Component, { name: "Marco Gil", density: "xl", status: "online" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Imagen y fallback"),
          e("div", { className: "audit-row" },
            e(Component, { name: "Imagen valida", src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='32' fill='%231667e8'/%3E%3Ctext x='32' y='39' text-anchor='middle' font-size='22' font-family='Arial' font-weight='700' fill='white'%3EIV%3C/text%3E%3C/svg%3E", density: "xl", status: "online" }),
            e(Component, { name: "Fallback visible", src: "/avatars/missing-avatar.png", density: "xl", status: "offline" }),
            e(Component, { name: "Rosa Duarte", identityTone: "warning", status: "busy" }),
            e(Component, { name: "Luis Prieto", identityTone: "teal", status: "online" }),
            e(Component, { name: "M G", identityTone: "purple", status: "offline" })
          )
        )`,
  },
  "biometric-prompt": {
    title: "BiometricPrompt",
    directory: "biometric-prompt-2026-09-03",
    module: "BiometricPrompt.js",
    exportName: "BiometricPrompt",
    buildId: "biometric-prompt-runtime-1",
    eventPropName: "onUse",
    actionHandler: "(event) => onAction(props.title || props.label || props.method || 'biometric')(event)",
    actionSelector: "[data-biometric-action], [data-biometric-fallback]",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ method: "face", state: "idle", title: "Face ID", onFallback: onAction("Face ID=passcode") })),
            e("div", { className: "audit-card" }, action({ method: "face", state: "scanning", title: "Face ID", fallbackLabel: "Usar passcode", onFallback: onAction("Scanning=passcode") })),
            e("div", { className: "audit-card" }, action({ method: "fingerprint", state: "success", title: "Huella digital", onFallback: onAction("Success=passcode") })),
            e("div", { className: "audit-card" }, action({ method: "fingerprint", state: "error", title: "Huella digital", fallbackLabel: "Usar passcode", onFallback: onAction("Error=passcode") }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ method: "face", title: "Small prompt", description: "Compact biometric copy.", density: "sm", onFallback: onAction("Small=passcode") })),
            e("div", { className: "audit-card" }, action({ method: "face", title: "Medium prompt", description: "Default biometric copy.", density: "md", onFallback: onAction("Medium=passcode") })),
            e("div", { className: "audit-card" }, action({ method: "face", title: "Large prompt", description: "Expanded biometric copy.", density: "lg", onFallback: onAction("Large=passcode") }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Compatibilidad Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Confirm it is you", description: "Look at the camera.", variant: "face", state: "authenticating", actionLabel: "Use Face ID", fallback: "Use passcode instead", onFallback: onAction("Confirm it is you=passcode") })),
            e("div", { className: "audit-card" }, action({ label: "Passcode fallback", variant: "passcode", state: "warning", actionLabel: "Continue", fallback: "Use another method", onFallback: onAction("Fallback=another") })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled biometrics", variant: "fingerprint", state: "disabled", actionLabel: "Verify", fallback: "Use passcode", onFallback: onAction("Disabled=passcode") }))
          )
        )`,
  },
  "code-input": {
    title: "CodeInput",
    directory: "code-input-2026-08-24",
    module: "CodeInput.js",
    exportName: "CodeInput",
    buildId: "code-input-success-motion-runtime-3",
    indexImports: ["Button"],
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "input[data-runtime-action]",
    supportPreamble: `function CodeInputMotionDemo() {
      const [value, setValue] = React.useState("9876");
      const [feedback, setFeedback] = React.useState("default");
      const [nonce, setNonce] = React.useState(0);
      const trigger = (nextFeedback) => {
        setFeedback("default");
        setValue(nextFeedback === "error" ? "12" : "9876");
        window.setTimeout(() => {
          setFeedback(nextFeedback);
          setNonce((current) => current + 1);
        }, 48);
      };
      return e("div", { className: "audit-motion-demo" },
        e(Component, {
          key: feedback + "-" + nonce,
          label: "Motion feedback",
          length: 4,
          value,
          state: feedback === "default" ? undefined : feedback,
          error: feedback === "error" ? "Invalid security code" : "",
          helper: feedback === "success" ? "Code accepted" : "Trigger semantic feedback"
        }),
        e("div", { className: "audit-row" },
          e(Button, { label: "Trigger success", variant: "secondary", onClick: () => trigger("success") }),
          e(Button, { label: "Trigger error", variant: "secondary", intent: "danger", onClick: () => trigger("error") })
        )
      );
    }`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Longitudes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Security code", length: 4, helper: "Numbers only" })),
            e("div", { className: "audit-card" }, action({ label: "Six digit code", length: 6, value: "123456" })),
            e("div", { className: "audit-card" }, action({ label: "Partial code", length: 4, value: "12" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", length: 4, value: "1234" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", length: 4, value: "1234" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", length: 4, value: "1234" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(CodeInputMotionDemo)),
            e("div", { className: "audit-card" }, action({ label: "Complete", length: 4, value: "9876" })),
            e("div", { className: "audit-card" }, action({ label: "Success", length: 4, value: "9876", state: "success", helper: "Code accepted" })),
            e("div", { className: "audit-card" }, action({ label: "Masked", length: 4, value: "1234", variant: "masked" })),
            e("div", { className: "audit-card" }, action({ label: "Error", length: 4, value: "12", error: "Invalid security code" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", length: 4, value: "1234", disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  select: {
    title: "Select",
    directory: "select-2026-08-17",
    module: "Select.js",
    exportName: "Select",
    buildId: "select-searchable-clearable-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + meta.label)(event)",
    actionSelector: "[data-runtime-action]",
    statefulValueProp: "value",
    supportPreamble: `const options = [
      { label: "Priority", value: "priority", meta: "Ops" },
      { label: "Driver", value: "driver", meta: "People", disabled: true },
      { label: "Dispatch", value: "dispatch", meta: "Team" },
      { label: "Route", value: "route", meta: "Fleet" }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Default select", options, placeholder: "Choose team", helper: "ArrowDown/ArrowUp skip disabled options." })),
            e("div", { className: "audit-card" }, action({ label: "Selected select", options, value: "dispatch", helper: "Click, Escape, ArrowDown/ArrowUp and Enter are stateful." })),
            e("div", { className: "audit-card" }, action({ label: "Searchable select", options, placeholder: "Search option", searchable: true, clearable: true, clearSelectionLabel: "Clear selection", emptyText: "No options found", helper: "Select owns searchable/clearable behavior." })),
            e("div", { className: "audit-card" }, action({ label: "Inline select", options, value: "route", variant: "inline" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", options, value: "priority", density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", options, value: "priority", density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", options, value: "priority", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Loading", options, placeholder: "Choose team", loading: true })),
            e("div", { className: "audit-card" }, action({ label: "Error", options, placeholder: "Choose team", state: "error", helper: "Selection required" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", options, value: "priority", disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  combobox: {
    title: "Combobox",
    directory: "combobox-2026-08-17",
    module: "Combobox.js",
    exportName: "Combobox",
    buildId: "combobox-select-wrapper-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + (meta.label || value))(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "value",
    supportPreamble: `const options = [
      { label: "Ana Sosa", value: "ana", meta: "Driver" },
      { label: "Luis Perez", value: "luis", meta: "Dispatch" },
      { label: "Maria Torres", value: "maria", meta: "Ops" },
      { label: "Disabled Driver", value: "disabled", meta: "Blocked", disabled: true }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Driver", options, placeholder: "Search driver", clearSelectionLabel: "Clear selection", emptyText: "No results" })),
            e("div", { className: "audit-card" }, action({ label: "Selected driver", options, value: "luis", clearSelectionLabel: "Clear selection" })),
            e("div", { className: "audit-card" }, action({ label: "Filtered driver", options, placeholder: "Search driver", helper: "Type to filter, ArrowDown/ArrowUp, Enter, Escape, and click outside are stateful.", clearSelectionLabel: "Clear selection" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small driver", options, value: "ana", density: "sm", clearSelectionLabel: "Clear selection" })),
            e("div", { className: "audit-card" }, action({ label: "Medium driver", options, value: "ana", density: "md", clearSelectionLabel: "Clear selection" })),
            e("div", { className: "audit-card" }, action({ label: "Large driver", options, value: "ana", density: "lg", clearSelectionLabel: "Clear selection" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Loading", options, placeholder: "Search driver", loading: true, loadingText: "Loading drivers" })),
            e("div", { className: "audit-card" }, action({ label: "Error", options, placeholder: "Search driver", state: "error", helper: "Select a driver" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", options, value: "ana", disabled: true, clearSelectionLabel: "Clear selection", "data-runtime-action": "true" }))
          )
        )`,
  },
  "country-selector": {
    title: "CountrySelector",
    directory: "country-selector-2026-08-24",
    module: "CountrySelector.js",
    exportName: "CountrySelector",
    buildId: "country-selector-search-tab-runtime-1",
    flagAssets: ["MX", "US", "CO", "BR"],
    eventPropName: "onValueChange",
    actionHandler: "(countryCode, country, event) => onAction(props.label + '=' + countryCode)(event)",
    actionSelector: "button[data-runtime-action]",
    statefulValueProp: "country",
    supportPreamble: `const countries = [
      { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
      { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
      { country: "CO", label: "Colombia", callingCode: "+57", nationalLength: 10 },
      { country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Country code", countries, country: "MX", searchPlaceholder: "Search country or code" })),
            e("div", { className: "audit-card" }, action({ label: "Selected country", countries, country: "US", searchPlaceholder: "Search country or code" })),
            e("div", { className: "audit-card" }, action({ label: "Search country", countries, searchable: true, searchPlaceholder: "Search country or code", country: "CO" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", countries, country: "MX", density: "sm", searchPlaceholder: "Search country or code" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", countries, country: "MX", density: "md", searchPlaceholder: "Search country or code" })),
            e("div", { className: "audit-card" }, action({ label: "Large", countries, country: "MX", density: "lg", searchPlaceholder: "Search country or code" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Error", countries, country: "MX", state: "error", helper: "Country required", searchPlaceholder: "Search country or code" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", countries, country: "MX", disabled: true, searchPlaceholder: "Search country or code", "data-runtime-action": "true" }))
          )
        )`,
  },
  "phone-input": {
    title: "PhoneInput",
    directory: "phone-input-2026-08-24",
    module: "PhoneInput.js",
    exportName: "PhoneInput",
    buildId: "phone-input-placeholder-contract-runtime-1",
    flagAssets: ["MX", "US", "CO"],
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "input[data-runtime-action]",
    supportPreamble: `const countries = [
      { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
      { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
      { country: "CO", label: "Colombia", callingCode: "+57", nationalLength: 10 }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Formato"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Mobile phone", countries, country: "MX", placeholder: "55 1234 5678" })),
            e("div", { className: "audit-card" }, action({ label: "US phone", countries, country: "US", value: "+15512345678" })),
            e("div", { className: "audit-card" }, action({ label: "With helper", countries, country: "CO", placeholder: "300 111 2233", helper: "Include area code" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", countries, country: "MX", density: "sm", value: "+525512345678" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", countries, country: "MX", density: "md", value: "+525512345678" })),
            e("div", { className: "audit-card" }, action({ label: "Large", countries, country: "MX", density: "lg", value: "+525512345678" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Country code", countries, country: "MX", value: "+525512345678", variant: "country-code" })),
            e("div", { className: "audit-card" }, action({ label: "Compact", countries, country: "US", value: "+15512345678", variant: "compact", helper: "Embedded field rhythm" })),
            e("div", { className: "audit-card" }, action({ label: "OTP handoff", countries, country: "CO", value: "+573001112233", variant: "otp-handoff", helper: "Ready for verification" })),
            e("div", { className: "audit-card" }, action({ label: "Readonly", countries, country: "MX", value: "+525512345678", variant: "readonly", state: "valid", helper: "Verified phone" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Focus", countries, country: "MX", value: "+525512345678", state: "focus" })),
            e("div", { className: "audit-card" }, action({ label: "Valid", countries, country: "MX", value: "+525512345678", state: "valid", helper: "Number can receive OTP." })),
            e("div", { className: "audit-card" }, action({ label: "Warning", countries, country: "US", value: "+1555123", state: "warning", helper: "Confirm this number before inviting." })),
            e("div", { className: "audit-card" }, action({ label: "Error", countries, country: "MX", placeholder: "55 1234 5678", error: "Invalid phone number" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", countries, country: "MX", value: "+525512345678", disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  "date-picker": {
    title: "DatePicker",
    directory: "date-picker-2026-08-24",
    module: "DatePicker.js",
    exportName: "DatePicker",
    buildId: "date-picker-selector-keyboard-runtime-1",
    eventPropName: "onValueChange",
    statefulValueProp: "value",
    actionHandler: "(value, event) => onAction(props.label + '=' + (typeof value === 'object' ? [value.from, value.to].filter(Boolean).join('/') : value))(event)",
    actionSelector: "button[data-runtime-action]",
    supportPreamble: `const dateLocaleProps = {
      locale: "es-MX",
      weekdays: ["L", "M", "X", "J", "V", "S", "D"],
      monthSelectLabel: "Seleccionar mes",
      yearSelectLabel: "Seleccionar año"
    };`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Service date", value: "2026-01-15" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Empty date", placeholder: "Select date" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Constrained date", value: "2026-01-15", min: "2026-01-10", max: "2026-01-25" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Reporting range", mode: "range", value: { from: "2026-02-10", to: "2026-02-15" }, presets: true, presetItems: [{ key: "last-7", label: "Last 7 days", days: 7 }, { key: "last-30", label: "Last 30 days", days: 30 }] })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Partial range", mode: "range", value: { from: "2026-02-10", to: "" }, placeholder: "Select date range" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Small", value: "2026-01-15", density: "sm" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Medium", value: "2026-01-15", density: "md" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Large", value: "2026-01-15", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Error", value: "2026-01-15", error: "Choose a valid date" })),
            e("div", { className: "audit-card" }, e(Component, { ...dateLocaleProps, label: "Disabled", value: "2026-01-15", disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  "date-range-picker": {
    title: "DateRangePicker",
    directory: "date-range-picker-2026-08-24",
    module: "DateRangePicker.js",
    exportName: "DateRangePicker",
    buildId: "date-range-picker-selector-keyboard-runtime-1",
    eventPropName: "onValueChange",
    statefulValueProp: "value",
    actionHandler: "(value, event) => onAction(props.label + '=' + [value.from, value.to].filter(Boolean).join('/'))(event)",
    actionSelector: "button[data-runtime-action]",
    supportPreamble: `const dateLocaleProps = {
      locale: "es-MX",
      weekdays: ["L", "M", "X", "J", "V", "S", "D"],
      monthSelectLabel: "Seleccionar mes",
      yearSelectLabel: "Seleccionar año"
    };`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Billing window", value: { from: "2026-02-10", to: "2026-02-15" } })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Empty range", placeholder: "Select date range" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Partial range", value: { from: "2026-02-10", to: "" }, placeholder: "Select date range" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "With presets", value: { from: "2026-02-10", to: "2026-02-15" }, presets: true, presetItems: [{ key: "last-7", label: "Last 7 days", days: 7 }] }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Small", value: { from: "2026-02-10", to: "2026-02-15" }, density: "sm" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Medium", value: { from: "2026-02-10", to: "2026-02-15" }, density: "md" })),
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Large", value: { from: "2026-02-10", to: "2026-02-15" }, density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ ...dateLocaleProps, label: "Error", value: { from: "2026-02-10", to: "" }, error: "Choose an end date" })),
            e("div", { className: "audit-card" }, e(Component, { ...dateLocaleProps, label: "Disabled", value: { from: "2026-02-10", to: "2026-02-15" }, disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  checkbox: {
    title: "Checkbox",
    directory: "checkbox-2026-08-18",
    module: "Checkbox.js",
    exportName: "Checkbox",
    buildId: "checkbox-1to1-runtime-1",
    eventPropName: "onCheckedChange",
    actionHandler: "(checked, meta, event) => onAction(props.label + '=' + checked)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "checked",
    runtimeInstruction: "Click o Space sobre un Checkbox interactivo.",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Recordarme", checked: true, value: "remember" })),
            e("div", { className: "audit-card" }, action({ label: "Seleccionar todo", description: "3 de 12 seleccionados", indeterminate: true, value: "select-all-reference" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Default", value: "default" })),
            e("div", { className: "audit-card" }, action({ label: "Descriptive", description: "Description text", variant: "descriptive", value: "descriptive" })),
            e("div", { className: "audit-card" }, action({ label: "Select all", description: "3 of 8 selected", variant: "select-all", indeterminate: true, value: "select-all" })),
            e("div", { className: "audit-card" }, action({ label: "Compact", variant: "compact", value: "compact" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", checked: true, value: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", checked: true, value: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", checked: true, value: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Checked", checked: true, value: "checked" })),
            e("div", { className: "audit-card" }, action({ label: "Focus", state: "focus", value: "focus" })),
            e("div", { className: "audit-card" }, action({ label: "Error", error: "Required", value: "error" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, checked: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  chip: {
    title: "Chip",
    directory: "chip-2026-08-31",
    module: "Chip.js",
    exportName: "Chip",
    buildId: "chip-pruned-runtime-1",
    eventPropName: "onSelectedChange",
    actionHandler: "(selected, event) => onAction(props.label + '=' + selected)(event)",
    statefulValueProp: "selected",
    runtimeInstruction: "Click o Space selecciona chips interactivos; el botón close quita el valor sin activar selección.",
    supportPreamble: `function RemovableChipDemo() {
      const [items, setItems] = React.useState(["Sedan", "Van", "CDMX"]);
      const [selected, setSelected] = React.useState("Sedan");
      const removeItem = (label, event) => {
        setItems((current) => current.filter((item) => item !== label));
        onAction("remove=" + label)(event);
      };
      return e("div", { className: "audit-row" },
        items.map((item) => e(Component, {
          key: item,
          label: item,
          icon: item === "CDMX" ? "" : "local_taxi",
          selected: selected === item,
          removable: true,
          interactive: true,
          onRemoveLabel: "Quitar " + item,
          onRemove: removeItem,
          onSelectedChange: (nextSelected, event) => {
            setSelected(nextSelected ? item : "");
            onAction(item + "=" + nextSelected)(event);
          },
          "data-runtime-action": "true"
        }))
      );
    }`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-card audit-card--compact" }, e(RemovableChipDemo))
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-row" },
            action({ label: "Filter", variant: "filter", icon: "local_taxi", selected: true }),
            action({ label: "Route", variant: "filter", icon: "route", interactive: true }),
            action({ label: "Input", variant: "input", removable: true, onRemoveLabel: "Quitar Input", onRemove: (label, event) => onAction("remove=" + label)(event) }),
            action({ label: "CDMX", variant: "input", removable: true, onRemoveLabel: "Quitar CDMX", onRemove: (label, event) => onAction("remove=" + label)(event) })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Sizing"),
          e("div", { className: "audit-row audit-row--chip-sizing" },
            e("div", { className: "audit-chip-sizing-sample" },
              action({ label: "Small", density: "sm", selected: true }),
              action({ label: "Remove", density: "sm", removable: true, onRemoveLabel: "Quitar Remove small", onRemove: (label, event) => onAction("remove-sm=" + label)(event) })
            ),
            e("div", { className: "audit-chip-sizing-sample" },
              action({ label: "Medium", density: "md", selected: true }),
              action({ label: "Remove", density: "md", removable: true, onRemoveLabel: "Quitar Remove medium", onRemove: (label, event) => onAction("remove-md=" + label)(event) })
            ),
            e("div", { className: "audit-chip-sizing-sample" },
              action({ label: "Large", density: "lg", selected: true }),
              action({ label: "Remove", density: "lg", removable: true, onRemoveLabel: "Quitar Remove large", onRemove: (label, event) => onAction("remove-lg=" + label)(event) })
            )
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-row" },
            action({ label: "Hover", state: "hover", interactive: true }),
            action({ label: "Pressed", state: "pressed", selected: true }),
            action({ label: "Focus", state: "focus", interactive: true }),
            action({ label: "Warning", tone: "warning", interactive: true }),
            action({ label: "Danger", tone: "danger", interactive: true }),
            e(Component, { label: "Disabled", disabled: true, interactive: true, "data-runtime-action": "true" })
          )
        )`,
  },
  "empty-state": {
    title: "EmptyState",
    directory: "empty-state-2026-09-03",
    module: "EmptyState.js",
    exportName: "EmptyState",
    buildId: "empty-state-runtime-1",
    indexImports: ["Button"],
    eventPropName: "onAction",
    actionHandler: "(key, event) => onAction(key || props.title)(event)",
    actionSelector: ".empty-state button, .empty-state__action button",
    runtimeInstruction: "Click, Enter o Space sobre la accion de EmptyState.",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP"),
          e("div", { className: "audit-grid audit-grid--charts" },
            e("div", { className: "audit-card audit-card--chart" }, e(Component, {
              icon: "local_taxi",
              title: "Sin unidades activas",
              description: "Cuando una unidad se conecte aparecera aqui.",
              action: e(Button, { label: "Agregar unidad", icon: "add", variant: "primary", density: "sm", onClick: onAction("zip-add-unit") })
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Condiciones vacias"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({
              icon: "inbox",
              title: "No hay movimientos",
              description: "Los pagos y ajustes apareceran aqui cuando se registren.",
              variant: "first-use",
              action: { key: "create-first", label: "Crear movimiento", icon: "add" }
            })),
            e("div", { className: "audit-card" }, action({
              icon: "search_off",
              title: "No hay resultados",
              description: "Ajusta la busqueda o limpia los filtros para ver mas datos.",
              variant: "search-empty",
              state: "search-empty",
              action: { key: "clear-filters", label: "Limpiar filtros", variant: "secondary", icon: "filter_alt_off" }
            })),
            e("div", { className: "audit-card" }, action({
              icon: "lock",
              title: "Sin permisos",
              description: "Solicita acceso para consultar esta informacion.",
              variant: "permission",
              state: "permission",
              action: { key: "request-access", label: "Solicitar acceso", variant: "secondary" }
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card audit-card--chart" }, e(Component, {
              icon: "sync",
              title: "Cargando informacion",
              description: "Estamos preparando los datos.",
              state: "loading"
            })),
            e("div", { className: "audit-card" }, action({
              icon: "error",
              title: "No se pudo cargar",
              description: "Intenta de nuevo o revisa la conexion.",
              variant: "error",
              state: "error",
              action: { key: "retry", label: "Reintentar", intent: "danger" }
            })),
            e("div", { className: "audit-card" }, action({
              icon: "build",
              title: "Mantenimiento",
              description: "Esta seccion volvera a estar disponible pronto.",
              variant: "maintenance",
              action: { key: "notify", label: "Avisarme", variant: "ghost" }
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ icon: "inbox", title: "Small empty", description: "Compact empty state copy.", density: "sm", action: { key: "small", label: "Small action" } })),
            e("div", { className: "audit-card" }, action({ icon: "inbox", title: "Medium empty", description: "Default empty state copy.", density: "md", action: { key: "medium", label: "Medium action" } })),
            e("div", { className: "audit-card" }, action({ icon: "inbox", title: "Large empty", description: "Expanded empty state copy.", density: "lg", action: { key: "large", label: "Large action" } }))
          )
        )`,
  },
  "chart-panel": {
    title: "ChartPanel",
    directory: "chart-panel-2026-09-03",
    module: "ChartPanel.js",
    exportName: "ChartPanel",
    buildId: "chart-panel-tooltip-label-runtime-15",
    runtimeInstruction: "ChartPanel muestra un chart compacto con datos reales; patrones especializados manejan leyendas, filtros, drill-down y decisiones analiticas como Bullet, Pareto o Gantt.",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid audit-grid--charts" },
            e("div", { className: "audit-chart-shell" }, e(Component, {
              label: "Last-mile revenue",
              value: "$18.7M",
              caption: "30-day routed revenue",
              variant: "line",
              values: [420, 438, 452, 471, 463, 498, 516, 509, 534, 558, 574, 591, 612, 629, 641, 666, 659, 681, 704, 729, 748, 766, 792, 815, 838, 861, 884, 902, 927, 951],
              labels: ["Aug 01", "Aug 02", "Aug 03", "Aug 04", "Aug 05", "Aug 06", "Aug 07", "Aug 08", "Aug 09", "Aug 10", "Aug 11", "Aug 12", "Aug 13", "Aug 14", "Aug 15", "Aug 16", "Aug 17", "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30"],
              fullWidth: true
            })),
            e("div", { className: "audit-chart-shell" }, e(Component, {
              label: "Fleet energy mix",
              value: "1,284",
              caption: "Heavy, middle-mile, last-mile and support units",
              variant: "donut",
              segments: [
                { id: "heavy-diesel", label: "Heavy diesel", value: 312 },
                { id: "middle-ev", label: "Middle-mile EV", value: 246 },
                { id: "last-mile-van", label: "Last-mile van", value: 421 },
                { id: "cargo-bike", label: "Cargo bike", value: 164 },
                { id: "hybrid", label: "Hybrid", value: 98 },
                { id: "yard-truck", label: "Yard truck", value: 43 }
              ],
              fullWidth: true
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes genericas"),
          e("div", { className: "audit-grid audit-grid--charts" },
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Stops completed", value: "38,642", caption: "24-hour scan volume", variant: "sparkline", values: [820, 760, 690, 640, 710, 1040, 1580, 2140, 2460, 2380, 2510, 2680, 2860, 2790, 3020, 3180, 3360, 3290, 2960, 2710, 2440, 2190, 1780, 1260], labels: ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Active fleet by hub", value: "1,284", caption: "Units online across 14 hubs", variant: "bars", values: [214, 168, 146, 121, 104, 98, 87, 76, 68, 57, 49, 38, 32, 26], labels: ["CDMX", "GDL", "MTY", "QRO", "PUE", "BJX", "TIJ", "MER", "TOL", "CUN", "SLP", "CUL", "LAP", "VER"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Energy spend", value: "$8.4M", caption: "Fuel and charging, 26 weeks", variant: "area", values: [342, 358, 371, 349, 386, 402, 398, 417, 436, 429, 451, 462, 488, 477, 504, 518, 531, 526, 552, 571, 586, 602, 618, 611, 637, 654], labels: ["W01", "W02", "W03", "W04", "W05", "W06", "W07", "W08", "W09", "W10", "W11", "W12", "W13", "W14", "W15", "W16", "W17", "W18", "W19", "W20", "W21", "W22", "W23", "W24", "W25", "W26"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "On-time routes", value: "91%", caption: "Heavy vs last-mile SLA, 14 days", variant: "line", chartType: "line", legend: true, min: 70, max: 100, labels: ["Aug 17", "Aug 18", "Aug 19", "Aug 20", "Aug 21", "Aug 22", "Aug 23", "Aug 24", "Aug 25", "Aug 26", "Aug 27", "Aug 28", "Aug 29", "Aug 30"], series: [{ id: "heavy", label: "Heavy freight", values: [76, 79, 81, 80, 83, 84, 86, 85, 88, 89, 90, 88, 91, 92] }, { id: "last-mile", label: "Last-mile", values: [91, 89, 93, 92, 95, 94, 96, 95, 97, 96, 98, 97, 96, 98] }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, {
              label: "Capacity by segment",
              value: "91%",
              caption: "Planned vs used cubic capacity",
              variant: "comparison",
              values: [82, 69, 74, 58, 63, 71, 67, 54],
              labels: ["Heavy", "Rigid", "Van", "Cold", "Express", "Reverse", "B2B", "B2C"],
              comparisons: [
                { id: "used", label: "Used", values: [82, 69, 74, 58, 63, 71, 67, 54] },
                { id: "planned", label: "Planned", values: [78, 72, 70, 62, 66, 68, 64, 59] }
              ]
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Cobertura Charts primitive"),
          e("div", { className: "audit-grid audit-grid--charts audit-grid--charts-coverage" },
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Middle-mile stacked load", value: "94%", caption: "Cubic capacity by segment", variant: "bars", chartType: "stackedBar", labels: ["Heavy", "Rigid", "Van", "Cold", "Reverse", "Express", "B2B", "B2C", "Returns", "Overflow"], series: [{ id: "used", label: "Used", values: [82, 69, 74, 58, 38, 46, 61, 72, 34, 29] }, { id: "reserved", label: "Reserved", values: [8, 14, 12, 22, 18, 16, 13, 9, 21, 17] }, { id: "open", label: "Open", values: [10, 17, 14, 20, 44, 38, 26, 19, 45, 54] }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Fleet energy share", value: "100%", caption: "Normalized by fleet class", variant: "bars", chartType: "stacked100", labels: ["Tractor", "Rigid", "Van", "Bike", "Yard", "Cold", "Reverse", "Shuttle"], series: [{ id: "diesel", label: "Diesel", values: [78, 46, 18, 0, 62, 71, 38, 54] }, { id: "electric", label: "Electric", values: [8, 34, 57, 92, 22, 11, 44, 26] }, { id: "hybrid", label: "Hybrid", values: [14, 20, 25, 8, 16, 18, 18, 20] }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Depot dwell scatter", value: "18 min", caption: "Stops versus dwell minutes", variant: "line", chartType: "scatter", series: [{ id: "depots", label: "Depots", data: [{ label: "CDMX", value: 142, y: 18 }, { label: "GDL", value: 96, y: 24 }, { label: "MTY", value: 84, y: 31 }, { label: "QRO", value: 62, y: 14 }, { label: "PUE", value: 58, y: 21 }, { label: "BJX", value: 74, y: 28 }, { label: "TIJ", value: 44, y: 33 }, { label: "MER", value: 39, y: 17 }, { label: "TOL", value: 118, y: 23 }, { label: "CUN", value: 76, y: 19 }, { label: "SLP", value: 88, y: 27 }, { label: "CUL", value: 52, y: 16 }, { label: "LAP", value: 31, y: 38 }, { label: "VER", value: 69, y: 22 }, { label: "HMO", value: 47, y: 35 }, { label: "MID", value: 55, y: 26 }, { label: "OAX", value: 36, y: 29 }, { label: "AGS", value: 64, y: 20 }] }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Dock congestion", value: "37", caption: "Hourly heatmap by shift", variant: "bars", chartType: "heatmap", matrix: { cols: ["00", "03", "06", "09", "12", "15", "18", "21"], rows: ["Inbound", "Outbound", "Crossdock", "Returns", "Cold", "Yard"], values: [[0, 0, 8], [1, 0, 10], [2, 0, 18], [3, 0, 31], [4, 0, 37], [5, 0, 34], [6, 0, 22], [7, 0, 14], [0, 1, 12], [1, 1, 16], [2, 1, 20], [3, 1, 28], [4, 1, 34], [5, 1, 30], [6, 1, 25], [7, 1, 18], [0, 2, 9], [1, 2, 11], [2, 2, 14], [3, 2, 22], [4, 2, 29], [5, 2, 33], [6, 2, 24], [7, 2, 16], [0, 3, 4], [1, 3, 5], [2, 3, 6], [3, 3, 9], [4, 3, 14], [5, 3, 17], [6, 3, 11], [7, 3, 7], [0, 4, 6], [1, 4, 8], [2, 4, 13], [3, 4, 19], [4, 4, 26], [5, 4, 32], [6, 4, 21], [7, 4, 12], [0, 5, 15], [1, 5, 18], [2, 5, 24], [3, 5, 27], [4, 5, 30], [5, 5, 25], [6, 5, 20], [7, 5, 16]] }, fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Route quality radar", value: "86", caption: "Safety, SLA, cost, energy, load and returns", variant: "line", chartType: "radar", indicators: [{ name: "Safety", max: 100 }, { name: "SLA", max: 100 }, { name: "Cost", max: 100 }, { name: "Energy", max: 100 }, { name: "Load", max: 100 }, { name: "Returns", max: 100 }], series: [{ id: "current", label: "Current", values: [92, 86, 74, 81, 88, 69] }, { id: "target", label: "Target", values: [95, 90, 82, 88, 91, 78] }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Margin waterfall", value: "$1.45M", caption: "Revenue minus route costs", variant: "bars", chartType: "waterfall", values: [1880, -312, -184, -92, -74, 236, -88, 1450], labels: ["Revenue", "Fuel", "Driver", "Tolls", "Claims", "SLA bonus", "Returns", "Margin"], totals: [7], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Delay Pareto", value: "87%", caption: "Top causes explain most delays", variant: "bars", chartType: "pareto", values: [420, 268, 181, 96, 74, 51, 39, 26], labels: ["Traffic", "Dock", "Docs", "No show", "Weather", "Routing", "Customs", "Other"], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "SLA gauge", value: "82%", caption: "Delivered inside promise", variant: "compact", chartType: "gauge", target: 82, max: 100, fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Dispatch funnel", value: "198", caption: "Quote to delivered load", variant: "bars", chartType: "funnel", segments: [{ id: "quoted", label: "Quoted", value: 400 }, { id: "priced", label: "Priced", value: 332 }, { id: "assigned", label: "Assigned", value: 244 }, { id: "loaded", label: "Loaded", value: 216 }, { id: "delivered", label: "Delivered", value: 198 }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Fleet footprint", value: "1,284", caption: "Units by hub and route class", variant: "donut", chartType: "treemap", segments: [{ id: "cdmx", label: "CDMX", value: 214 }, { id: "gdl", label: "GDL", value: 168 }, { id: "mty", label: "MTY", value: 146 }, { id: "qro", label: "QRO", value: 121 }, { id: "pue", label: "PUE", value: 104 }, { id: "bjx", label: "BJX", value: 98 }, { id: "tij", label: "TIJ", value: 87 }, { id: "mer", label: "MER", value: 76 }, { id: "tol", label: "TOL", value: 68 }, { id: "cancun", label: "CUN", value: 57 }, { id: "slp", label: "SLP", value: 49 }, { id: "cul", label: "CUL", value: 38 }, { id: "lap", label: "LAP", value: 32 }, { id: "ver", label: "VER", value: 26 }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Dock dwell distribution", value: "24 min", caption: "Boxplot by depot", variant: "line", chartType: "boxplot", series: [{ id: "dwell", label: "Dwell", data: [{ label: "CDMX", values: [12, 18, 24, 31, 42] }, { label: "GDL", values: [9, 14, 19, 25, 33] }, { label: "MTY", values: [16, 22, 29, 38, 48] }, { label: "QRO", values: [11, 17, 23, 28, 36] }, { label: "PUE", values: [18, 24, 32, 41, 56] }, { label: "BJX", values: [13, 19, 26, 34, 45] }, { label: "TIJ", values: [20, 28, 36, 48, 64] }, { label: "MER", values: [10, 16, 22, 30, 39] }] }], fullWidth: true })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Payment method share", value: "64%", caption: "Fuel and charging spend by provider", variant: "donut", chartType: "pie", segments: [{ id: "fleet-card", label: "Fleet card", value: 640 }, { id: "wallet", label: "Wallet", value: 244 }, { id: "invoice", label: "Invoice", value: 128 }, { id: "charge-pass", label: "Charge pass", value: 96 }, { id: "cash", label: "Cash", value: 43 }, { id: "credit-line", label: "Credit line", value: 31 }, { id: "reimbursement", label: "Reimbursement", value: 18 }], fullWidth: true }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades y estados"),
          e("div", { className: "audit-grid audit-grid--charts" },
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Small chart", value: "64", caption: "Compact depot view", density: "sm", variant: "bars", values: [12, 18, 24, 19, 28, 22], labels: ["M", "T", "W", "T", "F", "S"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Medium chart", value: "72", caption: "Default route trend", density: "md", variant: "line", values: [54, 59, 63, 61, 68, 72], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Large chart", value: "91", caption: "Expanded SLA trend", density: "lg", variant: "area", values: [78, 81, 84, 82, 88, 91], labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Delay risk", value: "-4%", caption: "Routes under threshold", state: "warning", tone: "warning", variant: "bars", values: [22, 19, 17, 15, 12, 10], labels: ["N1", "N2", "N3", "N4", "N5", "N6"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Critical alerts", value: "3", caption: "Open route blockers", state: "error", tone: "danger", variant: "sparkline", values: [1, 2, 2, 3, 4, 3], labels: ["08", "10", "12", "14", "16", "18"] })),
            e("div", { className: "audit-chart-shell" }, e(Component, { label: "Offline telemetry", value: "0", caption: "Unavailable feed", state: "disabled", variant: "compact", values: [4, 4, 4, 4, 4, 4], labels: ["M", "T", "W", "T", "F", "S"] }))
          )
        )`,
  },
  "error-panel": {
    title: "ErrorPanel",
    directory: "error-panel-2026-09-03",
    module: "ErrorPanel.js",
    exportName: "ErrorPanel",
    buildId: "error-panel-runtime-1",
    eventPropName: "onAction",
    actionHandler: "(key, event) => onAction(key || props.label)(event)",
    actionSelector: ".error-panel .button",
    runtimeInstruction: "Click, Enter o Space sobre las acciones de ErrorPanel.",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia StatusView"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({
              icon: "error",
              label: "No pudimos conectar con el servidor",
              description: "Revisa tu conexion e intenta de nuevo.",
              variant: "blocking",
              state: "error",
              tone: "error",
              action: { key: "retry-server", label: "Reintentar", icon: "refresh" },
              secondaryAction: { key: "cancel-server", label: "Cancelar", variant: "ghost" }
            })),
            e("div", { className: "audit-card" }, action({
              icon: "cloud_off",
              label: "Sin conexion",
              description: "Reconectate para seguir usando Flow.",
              variant: "blocking",
              state: "critical",
              tone: "critical",
              action: { key: "retry-offline", label: "Reintentar", icon: "refresh" }
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({
              label: "No se pudo guardar",
              description: "Conservamos los cambios locales para que intentes de nuevo.",
              variant: "panel",
              action: { key: "retry-save", label: "Intentar de nuevo" }
            })),
            e("div", { className: "audit-card" }, action({
              label: "Revisa los permisos",
              description: "Esta accion necesita un rol con acceso de administrador.",
              variant: "inline",
              tone: "warning",
              state: "warning",
              action: { key: "request-role", label: "Solicitar acceso", variant: "secondary" }
            })),
            e("div", { className: "audit-card" }, action({
              label: "No se pudo cargar la lista",
              description: "El servicio respondio con un error temporal.",
              variant: "empty-recovery",
              action: { key: "reload-list", label: "Recargar lista", icon: "sync" }
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({
              label: "Sincronizando recuperacion",
              description: "Estamos preparando una nueva lectura.",
              state: "loading",
              action: { key: "wait", label: "Esperar" }
            })),
            e("div", { className: "audit-card" }, action({
              label: "Pago en revision",
              description: "El banco aun no confirma la operacion.",
              tone: "warning",
              state: "warning",
              action: { key: "review-payment", label: "Ver detalle", variant: "secondary" }
            })),
            e("div", { className: "audit-card" }, action({
              label: "Accion bloqueada",
              description: "Este flujo no esta disponible para tu cuenta.",
              state: "disabled",
              action: { key: "disabled-action", label: "Reintentar" }
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small error", description: "Compact recovery copy.", density: "sm", action: { key: "small", label: "Small action" } })),
            e("div", { className: "audit-card" }, action({ label: "Medium error", description: "Default recovery copy.", density: "md", action: { key: "medium", label: "Medium action" } })),
            e("div", { className: "audit-card" }, action({ label: "Large error", description: "Expanded recovery copy.", density: "lg", action: { key: "large", label: "Large action" } }))
          )
        )`,
  },
  "kpi-tile": {
    title: "KpiTile",
    directory: "kpi-tile-2026-08-25",
    module: "KpiTile.js",
    exportName: "KpiTile",
    buildId: "kpi-tile-density-runtime-1",
    eventPropName: "onSelect",
    actionHandler: "(meta, event) => onAction(meta.label || props.label)(event)",
    actionSelector: ".kpi-tile[role='button']",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            action({ label: "Revenue", value: "$42.8k", delta: "+12%", trend: "up", tone: "success", variant: "delta" }),
            action({ label: "Risk", value: "7", delta: "2 alerts", trend: "down", tone: "danger", variant: "threshold", state: "risk" }),
            action({ label: "Routes", value: "128", tone: "info", variant: "sparkline", values: [8, 12, 10, 18, 24, 22] }),
            action({ label: "Drill in", value: "24", delta: "Open report", tone: "neutral", variant: "drill-in" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            action({ label: "Small KPI", value: "16", delta: "+4%", trend: "up", density: "sm", variant: "delta" }),
            action({ label: "Medium KPI", value: "24", delta: "+8%", trend: "up", density: "md", variant: "delta" }),
            action({ label: "Large KPI", value: "32", delta: "+12%", trend: "up", density: "lg", variant: "delta" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            action({ label: "Selected", value: "88", selected: true }),
            action({ label: "Hover", value: "64", state: "hover" }),
            action({ label: "Loading", value: "42", loading: true }),
            action({ label: "Disabled", value: "11", disabled: true })
          )
        )`,
  },
  "movement-row": {
    title: "MovementRow",
    directory: "movement-row-2026-08-25",
    module: "MovementRow.js",
    exportName: "MovementRow",
    buildId: "movement-row-density-runtime-1",
    eventPropName: "onSelect",
    actionHandler: "(meta, event) => onAction(meta.label || props.label)(event)",
    actionSelector: "button.movement-row",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Categorias"),
          e("div", { className: "audit-grid" },
            action({ label: "Fuel stop", meta: "Shell Reforma", amount: "-$840", status: "Pending", category: "fuel", state: "pending" }),
            action({ label: "Charge session", meta: "EV station", amount: "-$120", status: "Completed", category: "charge" }),
            action({ label: "Toll road", meta: "MEX-57", amount: "-$96", status: "Posted", category: "toll" }),
            action({ label: "Refund", meta: "Adjustment", amount: "+$320", status: "Approved", category: "income", variant: "refund" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            action({ label: "Small row", meta: "Compact metadata", amount: "$12", status: "Small", density: "sm", category: "transfer" }),
            action({ label: "Medium row", meta: "Default metadata", amount: "$24", status: "Medium", density: "md", category: "transfer" }),
            action({ label: "Large row", meta: "Expanded metadata", amount: "$48", status: "Large", density: "lg", category: "transfer" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            action({ label: "Hover", meta: "Interactive", amount: "$40", status: "Hover", state: "hover" }),
            action({ label: "Error", meta: "Declined card", amount: "-$58", status: "Declined", state: "error", variant: "declined" }),
            e(Component, { label: "Disabled", meta: "Unavailable", amount: "$0", status: "Disabled", disabled: true, onSelect: onAction("Disabled") })
          )
        )`,
  },
  "radio-button": {
    title: "RadioButton",
    directory: "radio-button-2026-08-18",
    module: "RadioButton.js",
    exportName: "RadioButton",
    buildId: "radio-button-optical-center-runtime-1",
    eventPropName: "onCheckedChange",
    actionHandler: "(checked, meta, event) => onAction(props.label + '=' + checked)(event)",
    actionSelector: "input[data-runtime-action]",
    runtimeInstruction: "Click o Space sobre un RadioButton interactivo.",
    supportPreamble: `function ReferenceRadioSet() {
      const [plan, setPlan] = React.useState("pro");
      const selectPlan = (value, label) => (checked, meta, event) => {
        if (checked) setPlan(value);
        onAction(label + "=" + checked)(event);
      };
      return e("div", { className: "audit-stack" },
        e(Component, { label: "Basico", name: "reference-plan", value: "basic", checked: plan === "basic", onCheckedChange: selectPlan("basic", "Basico"), "data-runtime-action": "true" }),
        e(Component, { label: "Pro", description: "Flotas de 10+ unidades", name: "reference-plan", value: "pro", checked: plan === "pro", onCheckedChange: selectPlan("pro", "Pro"), "data-runtime-action": "true" })
      );
    }`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, e(ReferenceRadioSet))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Default", name: "radio-variant", value: "default" })),
            e("div", { className: "audit-card" }, action({ label: "Descriptive", description: "Description text", variant: "descriptive", name: "radio-variant", value: "descriptive" })),
            e("div", { className: "audit-card" }, action({ label: "Compact", variant: "compact", name: "radio-variant", value: "compact" })),
            e("div", { className: "audit-card" }, action({ label: "Critical", variant: "critical", name: "radio-variant", value: "critical" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", checked: true, name: "radio-density-sm", value: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", checked: true, name: "radio-density-md", value: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", checked: true, name: "radio-density-lg", value: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Selected", checked: true, name: "radio-state", value: "selected" })),
            e("div", { className: "audit-card" }, action({ label: "Focus", state: "focus", name: "radio-state", value: "focus" })),
            e("div", { className: "audit-card" }, action({ label: "Error", error: "Choose one", name: "radio-state", value: "error" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, checked: true, name: "radio-state-disabled", value: "disabled", "data-runtime-action": "true" }))
          )
        )`,
  },
  switch: {
    title: "Switch",
    directory: "switch-2026-08-18",
    module: "Switch.js",
    exportName: "Switch",
    buildId: "switch-stateful-runtime-1",
    eventPropName: "onCheckedChange",
    actionHandler: "(checked, meta, event) => onAction(props.label + '=' + checked)(event)",
    actionSelector: "input[data-runtime-action]",
    statefulValueProp: "checked",
    runtimeInstruction: "Click o Space sobre un Switch interactivo.",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Notificaciones push", checked: true, name: "reference-push" })),
            e("div", { className: "audit-card" }, action({ label: "Modo silencioso", name: "reference-silent" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Deshabilitado", disabled: true, name: "reference-disabled", "data-runtime-action": "true" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Off", name: "switch-off" })),
            e("div", { className: "audit-card" }, action({ label: "On", checked: true, name: "switch-on" })),
            e("div", { className: "audit-card" }, action({ label: "Focus", state: "focus", name: "switch-focus" })),
            e("div", { className: "audit-card" }, action({ label: "Pressed", state: "pressed", name: "switch-pressed" })),
            e("div", { className: "audit-card" }, action({ label: "Error", error: "Required", name: "switch-error" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, checked: true, name: "switch-disabled", "data-runtime-action": "true" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", checked: true, name: "switch-sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", checked: true, name: "switch-md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", checked: true, name: "switch-lg" }))
          )
        )`,
  },
  tabs: {
    title: "Tabs",
    directory: "tabs-2026-08-18",
    module: "Tabs.js",
    exportName: "Tabs",
    buildId: "tabs-react-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(key, event) => onAction(props.label + '=' + key)(event)",
    actionSelector: "button[data-tabs-item]:not(:disabled)",
    supportPreamble: `const tabItems = [
      { key: "overview", label: "Overview", icon: "dashboard" },
      { key: "details", label: "Details", badge: { label: "2" } },
      { key: "disabled", label: "Disabled", disabled: true },
      { key: "settings", label: "Settings", icon: "settings" }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Default tabs", items: tabItems, selectedKey: "overview" })),
            e("div", { className: "audit-card" }, action({ label: "Underline tabs", items: tabItems, selectedKey: "details", variant: "underline" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small tabs", items: tabItems, selectedKey: "overview", density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium tabs", items: tabItems, selectedKey: "overview", density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large tabs", items: tabItems, selectedKey: "overview", density: "lg" }))
          )
        )`,
  },
  table: {
    title: "Table",
    directory: "table-2026-08-27",
    module: "Table.js",
    exportName: "Table",
    buildId: "table-datagrid-runtime-1",
    eventPropName: "onRowClick",
    actionHandler: "(row, event) => onAction((row && (row.label || row.driver || row.plate || row.id)) || props.label)(event)",
    actionSelector: "tr[data-key]",
    supportPreamble: `const tableColumns = [
      { key: "plate", label: "Plate", mono: true, sortable: true, width: 132 },
      { key: "driver", label: "Driver", sortable: true, width: 184 },
      { key: "region", label: "Region", sortable: true, width: 132 },
      { key: "route", label: "Route", width: 144 },
      { key: "trips", label: "Trips", align: "right", mono: true, sortable: true, sortValue: (row) => row.trips, width: 88 },
      { key: "utilization", label: "Use", align: "right", mono: true, sortable: true, sortValue: (row) => row.utilization, width: 88 },
      { key: "updated", label: "Updated", mono: true, sortable: true, width: 116 },
      { key: "status", label: "Status", width: 132 }
    ];
    const tableRows = [
      { id: "u2", plate: "KTR-882-A", driver: "Luis Perez", region: "CDMX", route: "Centro", trips: 42, utilization: "86%", updated: "10:24", status: { label: "Ready", tone: "success" } },
      { id: "u1", plate: "JMX-214-B", driver: "Ana Sosa", region: "CDMX", route: "Norte", trips: 18, utilization: "64%", updated: "09:48", status: { label: "Review", tone: "warning" } },
      { id: "u4", plate: "PLQ-472-D", driver: "Mario Ruiz", region: "QRO", route: "Industrial", trips: 31, utilization: "72%", updated: "09:12", status: { label: "Ready", tone: "success" } },
      { id: "u3", plate: "MVD-101-C", driver: "Maria Torres", region: "GDL", route: "Poniente", trips: 8, utilization: "28%", updated: "08:31", status: { label: "Blocked", tone: "danger" } }
    ];
    const centeredTableColumns = tableColumns.map((column) => column.key === "driver" ? { ...column, align: "center" } : column);
    const editableTableColumns = tableColumns.map((column) => column.key === "driver" ? { ...column, editable: true } : column);
    const densityTableColumns = tableColumns.filter((column) => ["plate", "driver", "trips", "status"].includes(column.key));
    const treeTableRows = [
      { id: "cdmx", plate: "CDMX", driver: "Central", region: "CDMX", route: "All routes", trips: 12, utilization: "71%", updated: "10:24", status: { label: "Ready", tone: "success" }, children: [
        { id: "cdmx-a", plate: "JMX-214-B", driver: "Ana Sosa", region: "CDMX", route: "Norte", trips: 8, utilization: "64%", updated: "09:48", status: { label: "Ready", tone: "success" } },
        { id: "cdmx-b", plate: "KTR-882-A", driver: "Luis Perez", region: "CDMX", route: "Centro", trips: 4, utilization: "86%", updated: "10:24", status: { label: "Review", tone: "warning" } }
      ] },
      { id: "gdl", plate: "GDL", driver: "West", region: "GDL", route: "Poniente", trips: 9, utilization: "31%", updated: "08:31", status: { label: "Blocked", tone: "danger" } }
    ];
    function TableDataGridCoverage() {
      const [selection, setSelection] = React.useState(["u2"]);
      const [rows, setRows] = React.useState(tableRows);
      const onCellEdit = (key, columnKey, value) => {
        setRows((currentRows) => currentRows.map((row) => row.id === key ? { ...row, [columnKey]: value } : row));
        onAction(key + ":" + columnKey + "=" + value)({ type: "edit" });
      };
      return e("div", { className: "audit-grid" },
        e("div", { className: "audit-card audit-card--wide" }, e(Component, {
          label: "Bulk selectable table",
          columns: tableColumns,
          rows: tableRows,
          rowKey: "id",
          selection,
          onSelectionChange: setSelection,
          zebra: true,
          stickyHeader: true
        })),
        e("div", { className: "audit-card audit-card--wide" }, e(Component, {
          label: "Embedded editable table",
          columns: editableTableColumns,
          rows,
          rowKey: "id",
          surface: "embedded",
          onCellEdit
        })),
        e("div", { className: "audit-card audit-card--wide" }, e(Component, {
          label: "Tree rows",
          columns: tableColumns,
          rows: treeTableRows,
          rowKey: "id",
          tree: true,
          defaultExpandedKey: "cdmx"
        })),
        e("div", { className: "audit-card audit-card--wide" }, e(Component, {
          label: "Empty filtered table",
          columns: tableColumns,
          rows: [],
          rowKey: "id",
          emptyLabel: "No vehicles match the filter"
        }))
      );
    }`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia DataGrid"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card audit-card--wide" }, action({
              label: "Fleet vehicles",
              columns: tableColumns,
              rows: tableRows,
              rowKey: "id",
              selectedKey: "u2",
              defaultSort: { key: "trips", dir: -1 }
            })),
            e("div", { className: "audit-card audit-card--wide" }, action({
              label: "Dense vehicles",
              columns: tableColumns,
              rows: tableRows,
              rowKey: "id",
              dense: true,
              defaultSort: { key: "driver", direction: "ascending" }
            })),
            e("div", { className: "audit-card audit-card--wide" }, action({
              label: "Center alignment capability",
              columns: centeredTableColumns,
              rows: tableRows,
              rowKey: "id"
            }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Cobertura DataGrid"),
          e(TableDataGridCoverage)
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small table", columns: densityTableColumns, rows: tableRows, rowKey: "id", density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium table", columns: densityTableColumns, rows: tableRows, rowKey: "id", density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large table", columns: densityTableColumns, rows: tableRows, rowKey: "id", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Hover table", columns: tableColumns, rows: tableRows, rowKey: "id", state: "hover" })),
            e("div", { className: "audit-card" }, action({ label: "Focus table", columns: tableColumns, rows: tableRows, rowKey: "id", state: "focus" })),
            e("div", { className: "audit-card" }, action({ label: "Selected table", columns: tableColumns, rows: tableRows, rowKey: "id", selectedKey: "u1" }))
          )
        )`,
  },
  menu: {
    title: "Menu",
    directory: "menu-2026-08-18",
    module: "Menu.js",
    exportName: "Menu",
    buildId: "menu-1to1-runtime-1",
    eventPropName: "onSelect",
    actionHandler: "(item, event) => onAction(props.triggerLabel + '=' + item.label)(event)",
    actionSelector: "[data-menu-trigger]:not(:disabled)",
    supportPreamble: `const menuItems = [
      { key: "edit", label: "Editar", icon: "edit" },
      { key: "duplicate", label: "Duplicar", icon: "content_copy" },
      "divider",
      { key: "archive", label: "Archive disabled", disabled: true },
      { key: "delete", label: "Eliminar", icon: "delete", tone: "danger" }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ triggerLabel: "Acciones", label: "Actions menu", items: menuItems, variant: "actions" })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "More actions", label: "Icon menu", items: menuItems, variant: "icon-trigger", align: "end" })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Avatar actions", label: "Avatar menu", items: menuItems, variant: "avatar-trigger", avatarName: "Rico" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ triggerLabel: "Small", label: "Small menu", items: menuItems, density: "sm" })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Medium", label: "Medium menu", items: menuItems, density: "md" })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Large", label: "Large menu", items: menuItems, density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ triggerLabel: "Open", label: "Open menu", items: menuItems, state: "open" })),
            e("div", { className: "audit-card" }, e(Component, { triggerLabel: "Disabled", label: "Disabled menu", items: menuItems, disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  dialog: {
    title: "Dialog",
    directory: "dialog-2026-08-19",
    module: "Dialog.js",
    exportName: "Dialog",
    buildId: "dialog-reference-runtime-3",
    indexImports: ["Input", "Select", "TextArea"],
    eventPropName: "onAction",
    actionHandler: "(key, event) => onAction(props.label + '=' + key)(event)",
    actionSelector: "[data-overlay-open]:not(:disabled)",
    supportPreamble: `const actions = [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "confirm", label: "Confirm", variant: "primary" }
    ];
    const destructiveActions = [
      { key: "cancel", label: "Cancel", variant: "ghost" },
      { key: "delete", label: "Delete", variant: "danger" }
    ];
    const reasonBody = e(TextArea, { id: "dialog-reason", label: "Motivo de la baja", rows: 2, helper: "Alimenta el analisis de rotacion.", placeholder: "Ej. renuncia voluntaria, fin de contrato..." });
    const inviteBody = e("div", { className: "audit-stack" },
      e(Input, { id: "dialog-email", label: "Correo", type: "email", icon: "mail", placeholder: "persona@flota.mx" }),
      e(Select, { label: "Rol", value: "driver", options: [
          { value: "driver", label: "Driver" },
          { value: "ops", label: "Operaciones" },
          { value: "finanzas", label: "Finanzas" }
        ] })
    );`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Confirmation", description: "Confirm this route change.", triggerLabel: "Open confirmation", closeLabel: "Close dialog", actions })),
            e("div", { className: "audit-card" }, action({ label: "Destructive", description: "This action cannot be undone.", triggerLabel: "Open destructive", closeLabel: "Close dialog", variant: "destructive", tone: "danger", actions: destructiveActions })),
            e("div", { className: "audit-card" }, action({ label: "Success", description: "The operation finished.", triggerLabel: "Open success", closeLabel: "Close dialog", variant: "success", actions }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Composiciones del ZIP"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Dar de baja a Ana Sosa?", description: "Se archiva con su historial y pierde acceso. Puedes reactivar despues.", triggerLabel: "Open reason dialog", closeLabel: "Close dialog", variant: "destructive", tone: "danger", actions: destructiveActions, children: reasonBody })),
            e("div", { className: "audit-card" }, action({ label: "Invitar al equipo", description: "Recibira un correo con su codigo de activacion.", triggerLabel: "Open invite dialog", closeLabel: "Close dialog", actions: [
              { key: "cancel", label: "Cancel", variant: "ghost" },
              { key: "send", label: "Send invite", variant: "primary" }
            ], children: inviteBody }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small dialog", triggerLabel: "Open small", closeLabel: "Close dialog", density: "sm", actions })),
            e("div", { className: "audit-card" }, action({ label: "Medium dialog", triggerLabel: "Open medium", closeLabel: "Close dialog", density: "md", actions })),
            e("div", { className: "audit-card" }, action({ label: "Large dialog", triggerLabel: "Open large", closeLabel: "Close dialog", density: "lg", actions }))
          )
        )`,
  },
  drawer: {
    title: "Drawer",
    directory: "drawer-2026-08-25",
    module: "Drawer.js",
    exportName: "Drawer",
    buildId: "drawer-reference-header-runtime-6",
    indexImports: ["Accordion", "Avatar", "Badge", "FileUpload", "KpiTile", "ProgressIndicator"],
    eventPropName: "onAction",
    actionHandler: "(key, event) => onAction(props.label + '=' + key)(event)",
    actionSelector: "[data-overlay-open]:not(:disabled)",
    supportPreamble: `const fields = [
      { label: "Route", name: "route", value: "MX-45", state: "filled" },
      { label: "Driver", name: "driver", value: "Ana Sosa", state: "filled" }
    ];
    const content = [
      { type: "badge", key: "status", label: "Active", tone: "success" },
      { type: "progress", key: "progress", label: "Inspection", value: 68, showValue: true },
      { type: "text", key: "copy", copy: "Operational detail belongs inside the sheet body and keeps the footer actions stable." }
    ];
    const referenceActions = [
      { key: "close", label: "Cerrar", variant: "ghost" },
      { key: "save", label: "Guardar", variant: "primary" }
    ];
    const drawerHeaderSummary = (density) => e("div", { className: "drawer-demo__header-summary" },
      e(Avatar, { name: "Ana Sosa", identityTone: "action", status: "busy", density: "lg" }),
      e("div", { className: "drawer-demo__identity-copy" },
        e(Badge, { label: "En ruta", tone: "success", variant: "status", live: true, density }),
        e("p", { className: "drawer__supporting-copy" }, "Desde 2024 · unidad JMX-214-B")
      )
    );
    const drawerMetrics = (density) => e("div", { className: "drawer-demo__metrics" },
      e(KpiTile, { label: "RATING", value: "4.96", tone: "neutral", variant: "compact", density }),
      e(KpiTile, { label: "VIAJES", value: "1240", tone: "neutral", variant: "compact", density }),
      e(KpiTile, { label: "DOCS", value: "3/4", tone: "neutral", variant: "compact", density })
    );
    const drawerReferenceBody = (density) => e("div", { className: "audit-stack audit-stack--drawer" },
      drawerMetrics(density),
      e(Accordion, { expandedIds: ["docs"], items: [
        { id: "docs", title: "Documentos", icon: "description", meta: "3 de 4", content: e("div", { className: "audit-stack", "data-flow-slot": "drawer-documents" },
          e(ProgressIndicator, { label: "Verificación", value: 3, max: 4, showValue: true, fullWidth: true, tone: "danger", density }),
          e(FileUpload, {
            label: "Sube un documento",
            description: "PDF o foto · máx 10 MB",
            files: [{ key: "license", name: "licencia-conducir.pdf", size: "668 KB" }],
            chooseAction: { key: "choose", label: "Sube un documento", icon: "upload_file" },
            removeAction: { key: "remove", label: "Quitar", icon: "close", variant: "ghost" },
            density
          })
        ) },
        { id: "hist", title: "Historial de viajes", icon: "history", content: "128 viajes este mes. Último: hoy 14:32, Roma Norte → Polanco." },
        { id: "pagos", title: "Métodos de pago", icon: "payments", content: "Depósito semanal a cuenta terminación 4821." }
      ] })
    );
    const actions = [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "save", label: "Save", variant: "primary" }
    ];
    const destructiveActions = [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "delete", label: "Delete", variant: "danger" }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Referencia ZIP aplicada a Flow"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Ana Sosa", triggerLabel: "Abrir drawer", closeLabel: "Cerrar", summary: drawerHeaderSummary(), children: drawerReferenceBody(), actions: referenceActions }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Detail drawer", description: "Review vehicle details.", triggerLabel: "Open detail", closeLabel: "Close drawer", variant: "detail", content, fields, actions })),
            e("div", { className: "audit-card" }, action({ label: "Filter drawer", description: "Adjust filters before applying.", triggerLabel: "Open filters", closeLabel: "Close drawer", variant: "filter", fields, actions })),
            e("div", { className: "audit-card" }, action({ label: "Danger drawer", description: "This action changes the route state.", triggerLabel: "Open danger", closeLabel: "Close drawer", variant: "review", tone: "danger", content, actions: destructiveActions }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Lados / densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Ana Sosa", triggerLabel: "Open left", closeLabel: "Close drawer", side: "left", summary: drawerHeaderSummary(), children: drawerReferenceBody(), actions: referenceActions })),
            e("div", { className: "audit-card" }, action({ label: "Ana Sosa", triggerLabel: "Open small", closeLabel: "Close drawer", density: "sm", summary: drawerHeaderSummary("sm"), children: drawerReferenceBody("sm"), actions: referenceActions })),
            e("div", { className: "audit-card" }, action({ label: "Ana Sosa", triggerLabel: "Open medium", closeLabel: "Close drawer", density: "md", summary: drawerHeaderSummary("md"), children: drawerReferenceBody("md"), actions: referenceActions })),
            e("div", { className: "audit-card" }, action({ label: "Ana Sosa", triggerLabel: "Open large", closeLabel: "Close drawer", density: "lg", summary: drawerHeaderSummary("lg"), children: drawerReferenceBody("lg"), actions: referenceActions }))
          )
        )`,
  },
  popover: {
    title: "Popover",
    directory: "popover-2026-08-25",
    module: "Popover.js",
    exportName: "Popover",
    buildId: "popover-keyboard-runtime-3",
    eventPropName: "onAction",
    actionHandler: "(key, event) => onAction(props.title + '=' + key)(event)",
    actionSelector: "[data-popover-trigger]:not(:disabled)",
    supportPreamble: `const actions = [
      { key: "dismiss", label: "Dismiss", variant: "secondary" },
      { key: "apply", label: "Apply", variant: "primary" }
    ];
    const dangerActions = [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "remove", label: "Remove", variant: "danger" }
    ];
    const field = { label: "Driver note", value: "Requires review", helper: "Read-only in this popover." };`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ triggerLabel: "Info", title: "Route details", description: "Lightweight context without leaving the current workflow." })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Actions", title: "Quick actions", description: "Use actions only when the popover owns a small local decision.", variant: "action", actions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Form", title: "Review note", description: "Composes Field/Input instead of local HTML.", variant: "form", field, actions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Metric", title: "Fleet utilization", description: "82% active this hour.", variant: "metric" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Placement / density"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ triggerLabel: "Top", title: "Top placement", placement: "top", actions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Right", title: "Right placement", placement: "right", actions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Left", title: "Left placement", placement: "left", actions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Small", title: "Small popover", density: "sm", actions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Medium", title: "Medium popover", density: "md", actions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Large", title: "Large popover", density: "lg", actions }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ triggerLabel: "Warning", title: "Warning popover", description: "Border should show warning state without dark-mode override.", state: "warning", actions: dangerActions })),
            e("div", { className: "audit-card" }, action({ triggerLabel: "Disabled", title: "Disabled popover", disabled: true }))
          )
        )`,
  },
};

const requestedComponents = requestedComponent === "all-actions"
  ? ["button", "icon-button"]
  : requestedComponent === "all-fields"
    ? ["input", "select", "combobox"]
  : requestedComponent === "all-p0-forms"
    ? ["text-area", "slider", "code-input", "phone-input", "country-selector", "input-amount", "card-number-input", "card-expiry-input", "card-security-code-input", "date-picker", "date-range-picker"]
  : requestedComponent === "all-choice-nav"
    ? ["checkbox", "radio-button", "switch", "tabs", "menu"]
  : requestedComponent === "all-overlays"
    ? ["dialog", "drawer", "popover"]
  : requestedComponent === "all"
    ? Object.keys(components)
  : [requestedComponent];

const invalidComponent = requestedComponents.find((component) => !components[component]);
if (invalidComponent) {
  console.error(`Unsupported component: ${invalidComponent}`);
  process.exit(1);
}

const mustStartClosedInRuntimeDemo = new Set(["date-picker", "date-range-picker"]);
for (const component of requestedComponents) {
  if (mustStartClosedInRuntimeDemo.has(component) && /\bopen:\s*true\b/.test(components[component].demoBody)) {
    console.error(`${component} runtime demo must start closed; validate open state through keyboard/pointer interaction instead of forced-open fixtures.`);
    process.exit(1);
  }
  if (component === "dialog" && /Densidades\s*\/\s*estados|label:\s*"Default state"|state:\s*"default"/.test(components[component].demoBody)) {
    console.error("dialog runtime demo must not present default state as a density or user-context variant.");
    process.exit(1);
  }
}

function copyFlagAssets(config, outDir) {
  if (!Array.isArray(config.flagAssets) || !config.flagAssets.length) return;

  const sourceDir = path.join(repoRoot, "node_modules/country-flag-icons/3x2");
  const targetDir = path.join(outDir, "vendor/country-flag-icons/3x2");
  fs.mkdirSync(targetDir, { recursive: true });

  for (const code of config.flagAssets) {
    const source = path.join(sourceDir, `${code}.svg`);
    if (!fs.existsSync(source)) {
      console.error(`Missing flag asset: ${source}`);
      process.exit(1);
    }
    fs.copyFileSync(source, path.join(targetDir, `${code}.svg`));
  }
}

function copyPaymentBrandAssets(config, outDir) {
  if (!Array.isArray(config.paymentBrandAssets) || !config.paymentBrandAssets.length) return;

  const sourceDir = path.join(repoRoot, "packages/components/src/vendor/payment-card-icons");
  const targetDir = path.join(outDir, "vendor/payment-card-icons");
  const sourceLogoDir = path.join(sourceDir, "logo");
  const targetLogoDir = path.join(targetDir, "logo");
  if (!fs.existsSync(sourceLogoDir)) {
    console.error(`Missing payment brand asset directory: ${sourceLogoDir}`);
    process.exit(1);
  }

  fs.mkdirSync(targetLogoDir, { recursive: true });
  fs.copyFileSync(path.join(sourceDir, "LICENSE"), path.join(targetDir, "LICENSE"));
  for (const brand of config.paymentBrandAssets) {
    const source = path.join(sourceLogoDir, `${brand}.svg`);
    if (!fs.existsSync(source)) {
      console.error(`Missing payment brand asset: ${source}`);
      process.exit(1);
    }
    fs.copyFileSync(source, path.join(targetLogoDir, `${brand}.svg`));
  }
}

function copyMaterialSymbolsAssets(outDir) {
  const sourceDir = path.join(workspaceRoot, "apps/docs/vendor/material-symbols");
  const targetDir = path.join(outDir, "vendor/material-symbols");
  if (!fs.existsSync(sourceDir)) {
    console.error(`Missing Material Symbols asset directory: ${sourceDir}`);
    process.exit(1);
  }
  fs.mkdirSync(targetDir, { recursive: true });
  for (const file of fs.readdirSync(sourceDir)) {
    fs.copyFileSync(path.join(sourceDir, file), path.join(targetDir, file));
  }
}

function copyReferenceAssets(config, outDir) {
  if (!Array.isArray(config.referenceAssets) || !config.referenceAssets.length) return;

  for (const asset of config.referenceAssets) {
    if (!fs.existsSync(asset.source)) {
      console.error(`Missing reference asset: ${asset.source}`);
      process.exit(1);
    }
    fs.copyFileSync(asset.source, path.join(outDir, asset.target));
  }
}

const outputs = [];

for (const component of requestedComponents) {
const config = components[component];
const outDir = path.join(localQaRoot, config.directory, "interactive");
fs.mkdirSync(outDir, { recursive: true });
copyFlagAssets(config, outDir);
copyPaymentBrandAssets(config, outDir);
copyMaterialSymbolsAssets(outDir);
copyReferenceAssets(config, outDir);

const relToRepo = path.relative(outDir, repoRoot).replaceAll(path.sep, "/");

const indexImportLine = Array.isArray(config.indexImports) && config.indexImports.length
  ? `\n    import { ${config.indexImports.join(", ")} } from "${relToRepo}/packages/react/dist/index.js?v=${config.buildId}";`
  : "";

const html = `<!doctype html>
<html lang="es" data-theme="light" data-flow-react-runtime="true" data-flow-react-source="packages/react/dist/${config.module}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Flow ${config.title} React Runtime QA</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="./vendor/material-symbols/material-symbols-rounded.css?v=${config.buildId}">
  <link rel="stylesheet" href="${relToRepo}/packages/tokens/styles/tokens.css?v=${config.buildId}">
  <link rel="stylesheet" href="${relToRepo}/packages/tokens/styles/token-contexts.css?v=${config.buildId}">
  <link rel="stylesheet" href="${relToRepo}/packages/components/styles/components.css?v=${config.buildId}">
  <style>
    body {
      margin: 0;
      background: var(--component-color-surface-raised);
      color: var(--component-color-text);
      font-family: var(--component-font-family-body);
    }

    .audit-shell {
      display: grid;
      gap: var(--component-space-lg);
      padding: var(--component-space-xl);
    }

    .audit-section {
      display: grid;
      gap: var(--component-space-md);
    }

    .audit-toolbar,
    .audit-row {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: var(--component-space-md);
    }

    .audit-grid {
      display: grid;
      gap: var(--component-space-md);
      grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
    }

    .audit-grid--charts {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 28rem), 1fr));
    }

    .audit-grid--charts-coverage {
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 34rem), 1fr));
    }

    .audit-card {
      align-items: center;
      border: var(--component-border-width) solid var(--component-color-border);
      border-radius: var(--component-radius-md);
      display: grid;
      gap: var(--component-space-md);
      min-block-size: 11rem;
      padding: var(--component-space-lg);
    }

    .audit-card--compact {
      justify-items: start;
      min-block-size: auto;
      padding: var(--component-space-md);
    }

    .audit-card--wide {
      align-items: stretch;
      grid-column: 1 / -1;
      min-block-size: auto;
      overflow-x: auto;
    }

    .audit-card--chart {
      align-items: stretch;
      justify-items: stretch;
      min-block-size: auto;
      padding: var(--component-space-md);
    }

    .audit-card--chart .chart-panel {
      inline-size: 100%;
      max-inline-size: none;
    }

    .audit-chart-shell {
      align-items: stretch;
      display: grid;
      justify-items: stretch;
      min-block-size: auto;
      min-inline-size: 0;
    }

    .audit-chart-shell .chart-panel {
      inline-size: 100%;
      max-inline-size: none;
    }

    .audit-row--chip-sizing {
      align-items: center;
    }

    .audit-chip-sizing-sample {
      align-items: center;
      display: inline-flex;
      gap: var(--component-space-sm);
    }

    .audit-motion-demo {
      display: grid;
      gap: var(--component-space-md);
      inline-size: 100%;
    }

    .audit-stack {
      display: grid;
      gap: var(--component-space-md);
    }

    .audit-stack--drawer {
      align-content: start;
      gap: var(--component-space-xl);
    }

    .drawer-demo__header-summary {
      align-items: center;
      display: flex;
      gap: var(--component-space-md);
    }

    .drawer-demo__identity-copy {
      align-items: start;
      display: grid;
      gap: var(--component-space-xs);
      min-inline-size: 0;
    }

    .drawer-demo__identity-copy .badge {
      justify-self: start;
    }

    .drawer-demo__metrics {
      display: grid;
      gap: var(--component-space-sm);
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }

    h1,
    h2,
    h3,
    p {
      margin: 0;
    }

    h2 {
      color: var(--component-color-text-muted);
      font-size: var(--component-font-size-label);
      text-transform: uppercase;
    }

    .audit-log {
      border: var(--component-border-width) solid var(--component-color-border);
      border-radius: var(--component-radius-sm);
      color: var(--component-color-text-muted);
      font-family: var(--component-font-family-mono);
      min-block-size: 3rem;
      padding: var(--component-space-sm);
    }
  </style>
  <script src="${relToRepo}/node_modules/react/umd/react.development.js"></script>
  <script src="${relToRepo}/node_modules/react-dom/umd/react-dom.development.js"></script>
  <script type="importmap">
    {
      "imports": {
        "react": "${relToRepo}/packages/audit/local-react-qa/react-shim.mjs?v=${config.buildId}",
        "react-dom": "${relToRepo}/packages/audit/local-react-qa/react-dom-shim.mjs?v=${config.buildId}",
        "react-dom/client": "${relToRepo}/packages/audit/local-react-qa/react-dom-client-shim.mjs?v=${config.buildId}",
        "echarts": "${relToRepo}/node_modules/echarts/dist/echarts.esm.min.mjs",
        "#flow/components": "${relToRepo}/packages/components/src/index.js?v=${config.buildId}",
        "#flow/platforms": "${relToRepo}/packages/components/src/platforms/index.js?v=${config.buildId}"
      }
    }
  </script>
</head>
<body>
  <main id="root"></main>
  <script type="module">
    import React from "react";
    import { createRoot } from "react-dom/client";
    import { ${config.exportName} as Component } from "${relToRepo}/packages/react/dist/${config.module}?v=${config.buildId}";${indexImportLine}

    const e = React.createElement;
    const log = [];
    const onAction = (label) => (event) => {
      log.push(label + ":" + event.type);
      document.querySelector("[data-audit-log]").textContent = log.slice(-6).join(" | ");
    };
    ${config.supportPreamble ?? ""}

    const action = (props) => e(RuntimeAction, { props });

    function RuntimeAction({ props }) {
      const statefulValueProp = ${JSON.stringify(config.statefulValueProp ?? "")};
      const shouldRuntimeOpen = props.state === "open" || props.open === true;
      const [runtimeOpen, setRuntimeOpen] = React.useState(shouldRuntimeOpen);
      const [runtimeValue, setRuntimeValue] = React.useState(statefulValueProp ? props[statefulValueProp] : undefined);
      const runtimeProps = {
        ...props,
        "data-runtime-action": "true",
      };
      const runtimeActionHandler = ${config.actionHandler ?? "onAction(props.label)"};

      if (statefulValueProp) {
        runtimeProps[statefulValueProp] = runtimeValue;
      }

      if (shouldRuntimeOpen) {
        Object.assign(runtimeProps, { open: runtimeOpen });
        runtimeProps.onOpenChange = (open) => {
          setRuntimeOpen(open);
        };
      }

      runtimeProps.${config.eventPropName ?? "onClick"} = (...args) => {
        if (statefulValueProp && args[0] !== undefined) {
          setRuntimeValue(args[0]);
        }
        return runtimeActionHandler(...args);
      };

      return e(Component, runtimeProps);
    }

    function Demo() {
      const [theme, setTheme] = React.useState("light");
      React.useEffect(() => {
        document.documentElement.dataset.theme = theme;
      }, [theme]);

      return e("div", { className: "audit-shell" },
        e("section", { className: "audit-section" },
          e("h1", null, "${config.title}"),
          e("p", null, "Demo React real: importa packages/react/dist, monta createRoot y conserva CSS/tokens de Flow. Build: ${config.buildId}."),
          e("div", { className: "audit-toolbar" },
            e("button", { className: "button button--secondary", type: "button", "aria-pressed": theme === "light", onClick: () => setTheme("light") }, "Light"),
            e("button", { className: "button button--secondary", type: "button", "aria-pressed": theme === "dark", onClick: () => setTheme("dark") }, "Dark")
          )
        ),
        ${config.demoBody},
        e("section", { className: "audit-section" },
          e("h2", null, "Runtime log"),
          e("div", { className: "audit-log", "data-audit-log": "" }, "${config.runtimeInstruction ?? `Click, Enter o Space sobre un ${config.title} interactivo.`}")
        )
      );
    }

    createRoot(document.getElementById("root")).render(e(Demo));
  </script>
</body>
</html>
`;

const htmlPath = path.join(outDir, runtimeHtml);
fs.writeFileSync(htmlPath, html);
outputs.push({
  status: "written",
  component,
  html: htmlPath,
  runtime: true,
});
}

console.log(JSON.stringify(outputs.length === 1 ? outputs[0] : {
  status: "written",
  count: outputs.length,
  outputs,
}, null, 2));
