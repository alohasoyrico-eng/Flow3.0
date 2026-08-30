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
    buildId: "icon-button-react-runtime-1",
    demoBody: `e("section", { className: "audit-section" },
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
            action({ label: "Selected", icon: "check", selected: true }),
            action({ label: "Badge", icon: "notifications", badge: true }),
            e(Component, { label: "Disabled", icon: "block", disabled: true, onClick: onAction("Disabled") })
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
            e("div", { className: "audit-card" }, e(Component, {
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
    buildId: "select-placeholder-contract-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + meta.label)(event)",
    actionSelector: "button[data-runtime-action]",
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
            e("div", { className: "audit-card" }, action({ label: "Open select", options, value: "dispatch", state: "open" })),
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
    buildId: "combobox-placeholder-contract-runtime-1",
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
            e("div", { className: "audit-card" }, action({ label: "Open driver", options, placeholder: "Search driver", state: "open", clearSelectionLabel: "Clear selection" }))
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
    buildId: "country-selector-placeholder-contract-runtime-1",
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
            e("div", { className: "audit-card" }, action({ label: "Open country", countries, country: "US", state: "open", searchPlaceholder: "Search country or code" })),
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
    buildId: "date-picker-react-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "button[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Service date", value: "2026-01-15" })),
            e("div", { className: "audit-card" }, action({ label: "Empty date", placeholder: "Select date" })),
            e("div", { className: "audit-card" }, action({ label: "Constrained date", value: "2026-01-15", min: "2026-01-10", max: "2026-01-25" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", value: "2026-01-15", density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", value: "2026-01-15", density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", value: "2026-01-15", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Error", value: "2026-01-15", error: "Choose a valid date" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", value: "2026-01-15", disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  "date-range-picker": {
    title: "DateRangePicker",
    directory: "date-range-picker-2026-08-24",
    module: "DateRangePicker.js",
    exportName: "DateRangePicker",
    buildId: "date-range-picker-placeholder-contract-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, event) => onAction(props.label + '=' + [value.from, value.to].filter(Boolean).join('/'))(event)",
    actionSelector: "button[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Billing window", value: { from: "2026-02-10", to: "2026-02-15" } })),
            e("div", { className: "audit-card" }, action({ label: "Empty range", placeholder: "Select date range" })),
            e("div", { className: "audit-card" }, action({ label: "Partial range", value: { from: "2026-02-10", to: "" }, placeholder: "Select date range" })),
            e("div", { className: "audit-card" }, action({ label: "With presets", value: { from: "2026-02-10", to: "2026-02-15" }, presets: true, presetItems: [{ key: "last-7", label: "Last 7 days", days: 7 }] }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", value: { from: "2026-02-10", to: "2026-02-15" }, density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", value: { from: "2026-02-10", to: "2026-02-15" }, density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", value: { from: "2026-02-10", to: "2026-02-15" }, density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Error", value: { from: "2026-02-10", to: "" }, error: "Choose an end date" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", value: { from: "2026-02-10", to: "2026-02-15" }, disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  checkbox: {
    title: "Checkbox",
    directory: "checkbox-2026-08-18",
    module: "Checkbox.js",
    exportName: "Checkbox",
    buildId: "checkbox-react-runtime-1",
    eventPropName: "onCheckedChange",
    actionHandler: "(checked, meta, event) => onAction(props.label + '=' + checked)(event)",
    actionSelector: "input[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
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
    buildId: "radio-button-react-runtime-1",
    eventPropName: "onCheckedChange",
    actionHandler: "(checked, meta, event) => onAction(props.label + '=' + checked)(event)",
    actionSelector: "input[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
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
    buildId: "switch-react-runtime-1",
    eventPropName: "onCheckedChange",
    actionHandler: "(checked, meta, event) => onAction(props.label + '=' + checked)(event)",
    actionSelector: "input[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
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
    buildId: "menu-anchor-layout-runtime-1",
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
    buildId: "dialog-react-runtime-1",
    eventPropName: "onAction",
    actionHandler: "(key, event) => onAction(props.label + '=' + key)(event)",
    actionSelector: "[data-overlay-open]:not(:disabled)",
    supportPreamble: `const fields = [
      { label: "Driver", name: "driver", value: "Ana Sosa", state: "filled" },
      { label: "Reason", name: "reason", placeholder: "Reason", helper: "Required before confirming" }
    ];
    const actions = [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "confirm", label: "Confirm", variant: "primary" }
    ];
    const destructiveActions = [
      { key: "cancel", label: "Cancel", variant: "secondary" },
      { key: "delete", label: "Delete", variant: "danger" }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Confirmation", description: "Confirm this route change.", triggerLabel: "Open confirmation", closeLabel: "Close dialog", actions })),
            e("div", { className: "audit-card" }, action({ label: "Destructive", description: "This action cannot be undone.", triggerLabel: "Open destructive", closeLabel: "Close dialog", variant: "destructive", tone: "danger", actions: destructiveActions })),
            e("div", { className: "audit-card" }, action({ label: "Success", description: "The operation finished.", triggerLabel: "Open success", closeLabel: "Close dialog", variant: "success", actions }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Form / review"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Form dialog", description: "Review fields before saving.", triggerLabel: "Open form", closeLabel: "Close dialog", variant: "form", fields, actions })),
            e("div", { className: "audit-card" }, action({ label: "Review dialog", description: "Validate the final payload.", triggerLabel: "Open review", closeLabel: "Close dialog", variant: "review", fields, actions }))
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
      e(Accordion, { items: [
        { id: "docs", title: "Documentos", icon: "description", meta: "3 de 4", open: true, content: e("div", { className: "audit-stack", "data-flow-slot": "drawer-documents" },
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
    buildId: "popover-react-runtime-1",
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

    .audit-card {
      align-items: center;
      border: var(--component-border-width) solid var(--component-color-border);
      border-radius: var(--component-radius-md);
      display: grid;
      gap: var(--component-space-md);
      min-block-size: 11rem;
      padding: var(--component-space-lg);
    }

    .audit-card--wide {
      align-items: stretch;
      grid-column: 1 / -1;
      min-block-size: auto;
      overflow-x: auto;
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
        "react": "${relToRepo}/packages/audit/local-react-qa/react-shim.mjs",
        "react-dom/client": "${relToRepo}/packages/audit/local-react-qa/react-dom-client-shim.mjs",
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
          e("div", { className: "audit-log", "data-audit-log": "" }, "Click, Enter o Space sobre un ${config.title} interactivo.")
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
