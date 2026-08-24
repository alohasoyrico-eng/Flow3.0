#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const localQaRoot = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa");
const runtimeHtml = "react-runtime.html";

const requestedComponent = process.argv.find((arg) => arg.startsWith("--component="))?.split("=")[1] ?? "floating-action-button";

const components = {
  button: {
    title: "Button",
    directory: "button-2026-08-17",
    module: "Button.js",
    exportName: "Button",
    buildId: "button-depth-dark-runtime-1",
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
            action({ label: "Small", density: "sm" }),
            action({ label: "Medium", density: "md" }),
            action({ label: "Large", density: "lg" })
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
  "floating-action-button": {
    title: "FloatingActionButton",
    directory: "floating-action-button-2026-08-20",
    module: "FloatingActionButton.js",
    exportName: "FloatingActionButton",
    buildId: "fab-depth-dark-runtime-1",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Tratamientos FAB"),
          e("div", { className: "audit-row" },
            action({ label: "Create route primary", icon: "add", variant: "primary" }),
            action({ label: "Create route extended", icon: "add", variant: "extended" }),
            action({ label: "Create route mini", icon: "add", variant: "mini" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Intents"),
          e("div", { className: "audit-row" },
            action({ label: "Danger action", icon: "delete", intent: "danger" }),
            action({ label: "Warning action", icon: "warning", intent: "warning" }),
            action({ label: "Extended danger action", icon: "delete", variant: "extended", intent: "danger" }),
            action({ label: "Mini warning action", icon: "warning", variant: "mini", intent: "warning" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-row" },
            action({ label: "Small create", icon: "add", density: "sm" }),
            action({ label: "Medium create", icon: "add", density: "md" }),
            action({ label: "Large create", icon: "add", density: "lg" })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-row" },
            action({ label: "Hover state", icon: "touch_app", state: "hover" }),
            action({ label: "Focus state", icon: "center_focus_strong", state: "focus" }),
            action({ label: "Pressed state", icon: "ads_click", state: "pressed" }),
            action({ label: "Saving", icon: "save", loading: true }),
            e(Component, { label: "Disabled create", icon: "block", disabled: true, onClick: onAction("Disabled create") })
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Compatibilidad extended prop"),
          e("div", { className: "audit-row" },
            action({ label: "Create route", icon: "add", extended: true }),
            action({ label: "Delete route", icon: "delete", extended: true, intent: "danger" }),
            action({ label: "Review warning", icon: "warning", extended: true, intent: "warning" })
          )
        )`,
  },
  card: {
    title: "Card",
    directory: "card-2026-08-20",
    module: "Card.js",
    exportName: "Card",
    buildId: "card-depth-dark-runtime-1",
    indexImports: ["Table", "EmptyState", "Skeleton"],
    eventPropName: "onAction",
    actionHandler: "(key, action, event) => onAction(key || props.actionKey || props.title)(event || { type: 'action' })",
    supportPreamble: `const baseCard = {
      title: "Wallet health",
      value: "98%",
      detail: "3 cards active - 1 review pending",
      status: "Stable",
      icon: "credit_card",
    };
    const mediaAsset = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 160'%3E%3Crect width='320' height='160' fill='%230060df'/%3E%3Ccircle cx='250' cy='52' r='58' fill='%23fbbf24'/%3E%3C/svg%3E";`,
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
              mediaAlt: "Abstract card media",
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
            e("div", { className: "audit-card" }, action({ ...baseCard, title: "Media", composition: "media", media: mediaAsset, mediaAlt: "Abstract card media" }))
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
    buildId: "input-react-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "input[data-runtime-action]",
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
            e("div", { className: "audit-card" }, action({ label: "Small", placeholder: "sm", density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", placeholder: "md", density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", placeholder: "lg", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Success", state: "success", helper: "Saved" })),
            e("div", { className: "audit-card" }, action({ label: "Warning", state: "warning", helper: "Review format" })),
            e("div", { className: "audit-card" }, action({ label: "Error", error: "Required field" })),
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
  "text-area": {
    title: "TextArea",
    directory: "text-area-2026-08-24",
    module: "TextArea.js",
    exportName: "TextArea",
    buildId: "text-area-react-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "textarea[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Variantes"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Notes", placeholder: "Write driver notes", helper: "Visible to operations" })),
            e("div", { className: "audit-card" }, action({ label: "Limited notes", maxLength: 80, placeholder: "Max 80 characters" })),
            e("div", { className: "audit-card" }, action({ label: "Filled", value: "Inspection completed before dispatch." }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", density: "sm", value: "Small density" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", density: "md", value: "Medium density" })),
            e("div", { className: "audit-card" }, action({ label: "Large", density: "lg", value: "Large density" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Success", state: "success", helper: "Saved" })),
            e("div", { className: "audit-card" }, action({ label: "Warning", state: "warning", helper: "Review wording" })),
            e("div", { className: "audit-card" }, action({ label: "Error", error: "Notes are required" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", disabled: true, value: "Disabled notes", "data-runtime-action": "true" }))
          )
        )`,
  },
  slider: {
    title: "Slider",
    directory: "slider-2026-08-24",
    module: "Slider.js",
    exportName: "Slider",
    buildId: "slider-react-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "input[data-runtime-action]",
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
            e("div", { className: "audit-card" }, action({ label: "Focus", state: "focus", min: 0, max: 10, value: 5 })),
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
    buildId: "code-input-react-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + value)(event)",
    actionSelector: "input[data-runtime-action]",
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
            e("div", { className: "audit-card" }, action({ label: "Complete", length: 4, value: "9876" })),
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
    buildId: "select-depth-dark-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + meta.label)(event)",
    actionSelector: "button[data-runtime-action]",
    supportPreamble: `const options = [
      { label: "Priority", value: "priority", meta: "Ops" },
      { label: "Driver", value: "driver", meta: "People", disabled: true },
      { label: "Dispatch", value: "dispatch", meta: "Team" },
      { label: "Route", value: "route", meta: "Fleet" }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Default select", options, value: "priority", helper: "ArrowDown/ArrowUp skip disabled options." })),
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
            e("div", { className: "audit-card" }, action({ label: "Loading", options, loading: true })),
            e("div", { className: "audit-card" }, action({ label: "Error", options, state: "error", helper: "Selection required" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", options, value: "priority", disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  combobox: {
    title: "Combobox",
    directory: "combobox-2026-08-17",
    module: "Combobox.js",
    exportName: "Combobox",
    buildId: "combobox-depth-dark-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, meta, event) => onAction(props.label + '=' + (meta.label || value))(event)",
    actionSelector: "input[data-runtime-action]",
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
            e("div", { className: "audit-card" }, action({ label: "Open driver", options, state: "open", clearSelectionLabel: "Clear selection" }))
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
            e("div", { className: "audit-card" }, action({ label: "Loading", options, loading: true, loadingText: "Loading drivers" })),
            e("div", { className: "audit-card" }, action({ label: "Error", options, state: "error", helper: "Select a driver" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", options, value: "ana", disabled: true, clearSelectionLabel: "Clear selection", "data-runtime-action": "true" }))
          )
        )`,
  },
  "country-selector": {
    title: "CountrySelector",
    directory: "country-selector-2026-08-24",
    module: "CountrySelector.js",
    exportName: "CountrySelector",
    buildId: "country-selector-react-runtime-1",
    flagAssets: ["MX", "US", "CO", "BR"],
    eventPropName: "onValueChange",
    actionHandler: "(countryCode, country, event) => onAction(props.label + '=' + countryCode)(event)",
    actionSelector: "button[data-runtime-action]",
    supportPreamble: `const countries = [
      { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
      { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
      { country: "CO", label: "Colombia", callingCode: "+57", nationalLength: 10 },
      { country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 }
    ];`,
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Country code", countries, country: "MX" })),
            e("div", { className: "audit-card" }, action({ label: "Open country", countries, country: "US", state: "open" })),
            e("div", { className: "audit-card" }, action({ label: "Search country", countries, searchable: true, country: "CO" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Densidades"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small", countries, country: "MX", density: "sm" })),
            e("div", { className: "audit-card" }, action({ label: "Medium", countries, country: "MX", density: "md" })),
            e("div", { className: "audit-card" }, action({ label: "Large", countries, country: "MX", density: "lg" }))
          )
        ),
        e("section", { className: "audit-section" },
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Error", countries, country: "MX", state: "error", helper: "Country required" })),
            e("div", { className: "audit-card" }, e(Component, { label: "Disabled", countries, country: "MX", disabled: true, "data-runtime-action": "true" }))
          )
        )`,
  },
  "phone-input": {
    title: "PhoneInput",
    directory: "phone-input-2026-08-24",
    module: "PhoneInput.js",
    exportName: "PhoneInput",
    buildId: "phone-input-react-runtime-1",
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
            e("div", { className: "audit-card" }, action({ label: "With helper", countries, country: "CO", helper: "Include area code" }))
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
          e("h2", null, "Estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Error", countries, country: "MX", error: "Invalid phone number" })),
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
            e("div", { className: "audit-card" }, action({ label: "Open date", value: "2026-01-15", open: true })),
            e("div", { className: "audit-card" }, action({ label: "Constrained date", value: "2026-01-15", min: "2026-01-10", max: "2026-01-25", open: true }))
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
    buildId: "date-range-picker-react-runtime-1",
    eventPropName: "onValueChange",
    actionHandler: "(value, event) => onAction(props.label + '=' + [value.from, value.to].filter(Boolean).join('/'))(event)",
    actionSelector: "button[data-runtime-action]",
    demoBody: `e("section", { className: "audit-section" },
          e("h2", null, "Interactivo"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Billing window", value: { from: "2026-02-10", to: "2026-02-15" } })),
            e("div", { className: "audit-card" }, action({ label: "Open range", value: { from: "2026-02-10", to: "" }, open: true })),
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
          e("h2", null, "Densidades / estados"),
          e("div", { className: "audit-grid" },
            e("div", { className: "audit-card" }, action({ label: "Small dialog", triggerLabel: "Open small", closeLabel: "Close dialog", density: "sm", actions })),
            e("div", { className: "audit-card" }, action({ label: "Medium dialog", triggerLabel: "Open medium", closeLabel: "Close dialog", density: "md", actions })),
            e("div", { className: "audit-card" }, action({ label: "Large dialog", triggerLabel: "Open large", closeLabel: "Close dialog", density: "lg", actions })),
            e("div", { className: "audit-card" }, action({ label: "Default state", description: "Opens through the trigger for interaction testing.", triggerLabel: "Open default state", closeLabel: "Close dialog", state: "default", actions }))
          )
        )`,
  },
};

const requestedComponents = requestedComponent === "all-actions"
  ? ["button", "icon-button", "floating-action-button"]
  : requestedComponent === "all-fields"
    ? ["input", "select", "combobox"]
  : requestedComponent === "all-p0-forms"
    ? ["text-area", "slider", "code-input", "phone-input", "country-selector", "date-picker", "date-range-picker"]
  : requestedComponent === "all-choice-nav"
    ? ["checkbox", "radio-button", "switch", "tabs", "menu"]
  : requestedComponent === "all-overlays"
    ? ["dialog"]
  : requestedComponent === "all"
    ? Object.keys(components)
  : [requestedComponent];

const invalidComponent = requestedComponents.find((component) => !components[component]);
if (invalidComponent) {
  console.error(`Unsupported component: ${invalidComponent}`);
  process.exit(1);
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

const outputs = [];

for (const component of requestedComponents) {
const config = components[component];
const outDir = path.join(localQaRoot, config.directory, "interactive");
fs.mkdirSync(outDir, { recursive: true });
copyFlagAssets(config, outDir);
copyMaterialSymbolsAssets(outDir);

const relToRepo = path.relative(outDir, repoRoot).replaceAll(path.sep, "/");

const indexImportLine = Array.isArray(config.indexImports) && config.indexImports.length
  ? `\n    import { ${config.indexImports.join(", ")} } from "${relToRepo}/packages/react/dist/index.js";`
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
        "#flow/components": "${relToRepo}/packages/components/src/index.js",
        "#flow/platforms": "${relToRepo}/packages/components/src/platforms/index.js"
      }
    }
  </script>
</head>
<body>
  <main id="root"></main>
  <script type="module">
    import React from "react";
    import { createRoot } from "react-dom/client";
    import { ${config.exportName} as Component } from "${relToRepo}/packages/react/dist/${config.module}";${indexImportLine}

    const e = React.createElement;
    const log = [];
    const onAction = (label) => (event) => {
      log.push(label + ":" + event.type);
      document.querySelector("[data-audit-log]").textContent = log.slice(-6).join(" | ");
    };
    ${config.supportPreamble ?? ""}

    const action = (props) => e(Component, {
      ...props,
      "data-runtime-action": "true",
      ${config.eventPropName ?? "onClick"}: ${config.actionHandler ?? "onAction(props.label)"},
    });

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
