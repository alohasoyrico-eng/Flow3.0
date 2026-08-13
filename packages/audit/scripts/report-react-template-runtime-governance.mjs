#!/usr/bin/env node

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "node:module";

import { AgentWorkspace } from "../../react/src/templates/AgentWorkspace.js";
import { ConfigurationConsole } from "../../react/src/templates/ConfigurationConsole.js";
import { DriverCardWallet } from "../../react/src/templates/DriverCardWallet.js";
import { DriverMobileApp } from "../../react/src/templates/DriverMobileApp.js";
import { FleetDashboardSuite } from "../../react/src/templates/FleetDashboardSuite.js";
import { FleetManagerDesktop } from "../../react/src/templates/FleetManagerDesktop.js";
import { InternalOperationsConsole } from "../../react/src/templates/InternalOperationsConsole.js";
import { RoutesAndStations } from "../../react/src/templates/RoutesAndStations.js";
import { SettingsWorkspace } from "../../react/src/templates/SettingsWorkspace.js";

const require = createRequire(import.meta.url);
const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-template-runtime-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-template-runtime-governance-audit.md");
const templateIndexFile = path.join(root, "packages/react/src/templates/index.js");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const rootPackageFile = path.join(root, "package.json");
const reactPackageFile = path.join(root, "packages/react/package.json");

const commonStates = ["loaded", "loading", "empty", "permission", "error", "offline", "disabled"];

const templateContracts = [
  {
    id: "settings-workspace",
    componentName: "SettingsWorkspace",
    Component: SettingsWorkspace,
    controlledLabel: "selectedSection",
    controlledProp: "selectedSection",
    defaultProp: "defaultSelectedSection",
    callbackProp: "onSelectedSectionChange",
    selectedAttribute: "data-selected-section",
    controlledSelected: "notifications",
    uncontrolledSelected: "theme",
    requiredSlots: ["settings-navigation", "settings-workspace"],
    requiredModules: ["section-navigation", "preference-management"],
    requiredPatterns: ["preference-management"],
    requiredComponents: ["tabs"],
    allowedDirectComponentImports: ["Tabs"],
    requiresDrawer: false,
    requiredSharedTypeNeedles: ["TabsItem", "PreferenceManagementProps"],
    permissionStateNeedle: 'data-preference-state="permission-blocked"',
    errorStateNeedle: 'data-preference-state="invalid"',
    offlineStateNeedle: 'data-preference-state="invalid"',
    requiredSourceNeedles: [
      ["Tabs component", 'import { Tabs } from "../Tabs.js"'],
      ["PreferenceManagement pattern", 'import { PreferenceManagement } from "../patterns/PreferenceManagement.js"'],
      ["section navigation module", '"data-template-module": "section-navigation"'],
      ["preference management module", '"data-template-module": "preference-management"'],
    ],
    requiredTypeNeedles: [
      "SettingsWorkspaceState",
      "SettingsWorkspaceDensity",
      "selectedSection?",
      "defaultSelectedSection?",
      "onSelectedSectionChange?",
      "PreferenceManagementProps",
      "TabsItem",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          "data-product-hook": "settings-workspace",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "profile", props: { density: "md", state: "loading", [defaultProp]: "profile" } },
      { id: "empty-md", density: "md", selected: "profile", props: { density: "md", state: "loaded", [defaultProp]: "profile" } },
      { id: "permission-lg", density: "lg", selected: "profile", props: { density: "lg", state: "permission" } },
      { id: "error-sm", density: "sm", selected: "profile", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "profile", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "profile", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected, state: "dirty" } },
    ],
  },
  {
    id: "internal-operations-console",
    componentName: "InternalOperationsConsole",
    Component: InternalOperationsConsole,
    controlledLabel: "selectedModule",
    controlledProp: "selectedModule",
    defaultProp: "defaultSelectedModule",
    callbackProp: "onSelectedModuleChange",
    selectedAttribute: "data-selected-module",
    controlledSelected: "tickets",
    uncontrolledSelected: "pricing",
    requiredSlots: ["global-shell", "operations-navigation", "operations-workspace"],
    requiredModules: ["case-operations", "ticket-operations", "account-operations", "pricing-operations", "backoffice-approvals", "growth-operations"],
    requiredPatterns: ["topbar", "sidebar", "case-management", "ticket-queue", "account-operations", "pricing-operations", "backoffice-approval", "dense-operational-list"],
    requiresDrawer: true,
    requiredSharedTypeNeedles: ["TopbarProps", "SidebarProps", "CaseManagementProps", "TicketQueueProps", "PricingOperationsProps"],
    permissionStateNeedle: 'data-state="disabled"',
    offlineStateNeedle: 'data-state="error"',
    requiredSourceNeedles: [
      ["Topbar pattern", 'import { Topbar } from "../patterns/Topbar.js"'],
      ["Sidebar pattern", 'import { Sidebar } from "../patterns/Sidebar.js"'],
      ["CaseManagement pattern", 'import { CaseManagement } from "../patterns/CaseManagement.js"'],
      ["TicketQueue pattern", 'import { TicketQueue } from "../patterns/TicketQueue.js"'],
      ["AccountOperations pattern", 'import { AccountOperations } from "../patterns/AccountOperations.js"'],
      ["PricingOperations pattern", 'import { PricingOperations } from "../patterns/PricingOperations.js"'],
      ["BackofficeApproval pattern", 'import { BackofficeApproval } from "../patterns/BackofficeApproval.js"'],
      ["growth module", '"data-template-module": "growth-operations"'],
    ],
    requiredTypeNeedles: [
      "InternalOperationsConsoleState",
      "InternalOperationsConsoleDensity",
      "selectedModule?",
      "defaultSelectedModule?",
      "onSelectedModuleChange?",
      "CaseManagementProps",
      "TicketQueueProps",
      "DenseOperationalListProps",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          drawerOpen: true,
          "data-product-hook": "internal-operations-console",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "cases", props: { density: "md", state: "loading", [defaultProp]: "cases" } },
      { id: "empty-md", density: "md", selected: "cases", props: { density: "md", state: "empty", [defaultProp]: "cases" } },
      { id: "permission-lg", density: "lg", selected: "cases", props: { density: "lg", state: "permission" } },
      { id: "error-sm", density: "sm", selected: "cases", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "cases", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "cases", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected, defaultDrawerOpen: true } },
    ],
  },
  {
    id: "agent-workspace",
    componentName: "AgentWorkspace",
    Component: AgentWorkspace,
    controlledLabel: "selectedConversation",
    controlledProp: "selectedConversation",
    defaultProp: "defaultSelectedConversation",
    callbackProp: "onSelectedConversationChange",
    selectedAttribute: "data-selected-conversation",
    controlledSelected: "route-help",
    uncontrolledSelected: "receipt",
    requiredSlots: ["global-shell", "conversation-list", "conversation-workspace", "context-panel"],
    requiredModules: ["conversation-queue", "agent-conversation", "agent-state", "handoff-recovery", "workspace-context"],
    requiredPatterns: ["agent-conversation", "topbar", "status-feedback-view"],
    requiredComponents: ["badge", "button"],
    allowedDirectComponentImports: ["Badge", "Button"],
    requiresDrawer: false,
    requiredSharedTypeNeedles: ["TopbarProps", "AgentConversationProps", "StatusFeedbackViewProps"],
    permissionStateNeedle: 'data-state="permission"',
    offlineStateNeedle: 'data-feedback-kind="maintenance"',
    requiredSourceNeedles: [
      ["Topbar pattern", 'import { Topbar } from "../patterns/Topbar.js"'],
      ["AgentConversation pattern", 'import { AgentConversation } from "../patterns/AgentConversation.js"'],
      ["StatusFeedbackView pattern", 'import { StatusFeedbackView } from "../patterns/StatusFeedbackView.js"'],
      ["conversation queue module", '"data-template-module": "conversation-queue"'],
      ["agent conversation module", '"data-template-module": "agent-conversation"'],
      ["handoff recovery module", '"data-template-module": "handoff-recovery"'],
    ],
    requiredTypeNeedles: [
      "AgentWorkspaceState",
      "AgentWorkspaceDensity",
      "selectedConversation?",
      "defaultSelectedConversation?",
      "onSelectedConversationChange?",
      "AgentConversationProps",
      "StatusFeedbackViewProps",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          "data-product-hook": "agent-workspace",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "handoff", props: { density: "md", state: "loading", [defaultProp]: "handoff" } },
      { id: "empty-md", density: "md", selected: "handoff", props: { density: "md", state: "empty", [defaultProp]: "handoff" } },
      { id: "permission-lg", density: "lg", selected: "handoff", props: { density: "lg", state: "permission" } },
      { id: "error-sm", density: "sm", selected: "handoff", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "handoff", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "handoff", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected, state: "handoff" } },
    ],
  },
  {
    id: "configuration-console",
    componentName: "ConfigurationConsole",
    Component: ConfigurationConsole,
    controlledLabel: "selectedModule",
    controlledProp: "selectedModule",
    defaultProp: "defaultSelectedModule",
    callbackProp: "onSelectedModuleChange",
    selectedAttribute: "data-selected-module",
    controlledSelected: "drivers",
    uncontrolledSelected: "vehicles",
    requiredSlots: ["global-shell", "navigation-region", "workspace"],
    requiredModules: ["permission-matrix", "driver-lifecycle-table", "vehicle-lifecycle-table", "audit-trail"],
    requiredPatterns: [
      "topbar",
      "sidebar",
      "roles-and-permissions",
      "driver-and-vehicle-administration",
    ],
    requiresDrawer: true,
    requiredSharedTypeNeedles: ["TopbarProps", "SidebarProps", "RolesAndPermissionsProps"],
    permissionStateNeedle: 'data-state="permission-blocked"',
    offlineStateNeedle: 'data-state="error"',
    requiredSourceNeedles: [
      ["Topbar pattern", 'import { Topbar } from "../patterns/Topbar.js"'],
      ["Sidebar pattern", 'import { Sidebar } from "../patterns/Sidebar.js"'],
      ["RolesAndPermissions pattern", 'import { RolesAndPermissions } from "../patterns/RolesAndPermissions.js"'],
      ["DriverAndVehicleAdministration pattern", 'import { DriverAndVehicleAdministration } from "../patterns/DriverAndVehicleAdministration.js"'],
      ["Authentication pattern", 'import { AuthenticationLoginBiometricsAndOtp } from "../patterns/AuthenticationLoginBiometricsAndOtp.js"'],
    ],
    requiredTypeNeedles: [
      "ConfigurationConsoleState",
      "ConfigurationConsoleDensity",
      "selectedModule?",
      "defaultSelectedModule?",
      "onSelectedModuleChange?",
      "DriverAndVehicleAdministrationProps",
      "AuthenticationLoginBiometricsAndOtpProps",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          drawerOpen: true,
          "data-product-hook": "configuration-console",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "permissions", props: { density: "md", state: "loading", [defaultProp]: "permissions" } },
      { id: "empty-md", density: "md", selected: "permissions", props: { density: "md", state: "empty", [defaultProp]: "permissions" } },
      {
        id: "permission-lg-with-authentication",
        density: "lg",
        selected: "permissions",
        props: {
          density: "lg",
          state: "permission",
          authentication: { label: "Admin authentication", primaryAction: { label: "Continue" } },
        },
        extraNeedles: [
          ['data-flow-pattern="authentication-login-biometrics-and-otp"', "authentication pattern"],
          ['data-template-module="authentication-gate"', "authentication module"],
        ],
      },
      { id: "error-sm", density: "sm", selected: "permissions", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "permissions", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "permissions", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected, defaultDrawerOpen: true } },
    ],
  },
  {
    id: "driver-card-wallet",
    componentName: "DriverCardWallet",
    Component: DriverCardWallet,
    controlledLabel: "selectedSection",
    controlledProp: "selectedSection",
    defaultProp: "defaultSelectedSection",
    callbackProp: "onSelectedSectionChange",
    selectedAttribute: "data-selected-section",
    controlledSelected: "movements",
    uncontrolledSelected: "help",
    requiredSlots: ["wallet-shell", "workspace"],
    requiredModules: ["wallet-navigation", "card-status-block", "quick-actions", "movement-receipt-detail", "dispute-entry-point"],
    requiredPatterns: [],
    requiredComponents: ["card-summary", "quick-action", "movement-row"],
    allowedDirectComponentImports: ["CardSummary", "MovementRow", "QuickAction"],
    requiresDrawer: false,
    requiredSharedTypeNeedles: [],
    permissionStateNeedle: 'data-state="frozen"',
    offlineStateNeedle: 'data-state="frozen"',
    requiredSourceNeedles: [
      ["CardSummary component", 'import { CardSummary } from "../CardSummary.js"'],
      ["MovementRow component", 'import { MovementRow } from "../MovementRow.js"'],
      ["QuickAction component", 'import { QuickAction } from "../QuickAction.js"'],
      ["card module", '"data-template-module": "card-status-block"'],
      ["movement module", '"data-template-module": "movement-receipt-detail"'],
    ],
    requiredTypeNeedles: [
      "DriverCardWalletState",
      "DriverCardWalletDensity",
      "selectedSection?",
      "defaultSelectedSection?",
      "onSelectedSectionChange?",
      "CardSummaryProps",
      "MovementRowProps",
      "QuickActionProps",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          "data-product-hook": "driver-card-wallet",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "card", props: { density: "md", state: "loading", [defaultProp]: "card" } },
      { id: "empty-md", density: "md", selected: "card", props: { density: "md", state: "empty", [defaultProp]: "card" } },
      { id: "permission-lg", density: "lg", selected: "card", props: { density: "lg", state: "permission" } },
      { id: "error-sm", density: "sm", selected: "card", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "card", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "card", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected } },
    ],
  },
  {
    id: "driver-mobile-app",
    componentName: "DriverMobileApp",
    Component: DriverMobileApp,
    controlledLabel: "selectedTab",
    controlledProp: "selectedTab",
    defaultProp: "defaultSelectedTab",
    callbackProp: "onSelectedTabChange",
    selectedAttribute: "data-selected-tab",
    controlledSelected: "routes",
    uncontrolledSelected: "support",
    requiredSlots: ["mobile-shell", "workspace"],
    requiredModules: ["mobile-navigation", "mobile-card-overview", "driver-readiness-onboarding", "routes-and-nearby-stations-mobile", "recent-movement-feed", "support-and-dispute-path"],
    requiredPatterns: ["driver-onboarding-mobile", "station-discovery"],
    requiresDrawer: false,
    requiredSharedTypeNeedles: [],
    permissionStateNeedle: 'data-state="denied"',
    offlineStateNeedle: 'data-state="error"',
    requiredSourceNeedles: [
      ["DriverOnboardingMobile pattern", 'import { DriverOnboardingMobile } from "../patterns/DriverOnboardingMobile.js"'],
      ["StationDiscovery pattern", 'import { StationDiscovery } from "../patterns/StationDiscovery.js"'],
      ["mobile card module", '"data-template-module": "mobile-card-overview"'],
      ["station module", '"data-template-module": "routes-and-nearby-stations-mobile"'],
    ],
    requiredTypeNeedles: [
      "DriverMobileAppState",
      "DriverMobileAppDensity",
      "selectedTab?",
      "defaultSelectedTab?",
      "onSelectedTabChange?",
      "DriverOnboardingMobileProps",
      "StationDiscoveryProps",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          "data-product-hook": "driver-mobile-app",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "home", props: { density: "md", state: "loading", [defaultProp]: "home" } },
      { id: "empty-md", density: "md", selected: "home", props: { density: "md", state: "empty", [defaultProp]: "home" } },
      { id: "permission-lg", density: "lg", selected: "home", props: { density: "lg", state: "permission" } },
      { id: "error-sm", density: "sm", selected: "home", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "home", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "home", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected } },
    ],
  },
  {
    id: "routes-and-stations",
    componentName: "RoutesAndStations",
    Component: RoutesAndStations,
    controlledLabel: "selectedStationKey",
    controlledProp: "selectedStationKey",
    defaultProp: "defaultSelectedStationKey",
    callbackProp: "onSelectedStationChange",
    selectedAttribute: "data-selected-station",
    controlledSelected: "industrial",
    uncontrolledSelected: "poniente",
    requiredSlots: ["discovery-region", "decision-region"],
    requiredModules: ["routes-and-nearby-stations-mobile", "map-with-station-pins", "fallback-station-list", "station-services-panel", "route-handoff"],
    requiredPatterns: ["station-discovery"],
    requiresDrawer: false,
    requiredSharedTypeNeedles: [],
    permissionStateNeedle: 'data-state="denied"',
    offlineStateNeedle: 'data-state="offline"',
    requiredSourceNeedles: [
      ["StationDiscovery pattern", 'import { StationDiscovery } from "../patterns/StationDiscovery.js"'],
      ["routes module", '"data-template-module": "routes-and-nearby-stations-mobile"'],
      ["fallback module", '"data-template-module": "fallback-station-list"'],
      ["route handoff module", '"data-template-module": "route-handoff"'],
    ],
    requiredTypeNeedles: [
      "RoutesAndStationsState",
      "RoutesAndStationsDensity",
      "selectedStationKey?",
      "defaultSelectedStationKey?",
      "onSelectedStationChange?",
      "StationDiscoveryProps",
      "StationDiscoveryStation",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          "data-product-hook": "routes-and-stations",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "centro", props: { density: "md", state: "loading", [defaultProp]: "centro" } },
      { id: "empty-md", density: "md", selected: "centro", props: { density: "md", state: "empty", [defaultProp]: "centro" } },
      { id: "permission-lg", density: "lg", selected: "centro", props: { density: "lg", state: "permission" } },
      { id: "error-sm", density: "sm", selected: "centro", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "centro", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "centro", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected } },
    ],
  },
  {
    id: "fleet-dashboard-suite",
    componentName: "FleetDashboardSuite",
    Component: FleetDashboardSuite,
    controlledLabel: "selectedDashboard",
    controlledProp: "selectedDashboard",
    defaultProp: "defaultSelectedDashboard",
    callbackProp: "onSelectedDashboardChange",
    selectedAttribute: "data-selected-dashboard",
    controlledSelected: "finance",
    uncontrolledSelected: "ev",
    requiredSlots: ["global-shell", "navigation-region", "workspace"],
    requiredModules: ["dashboard-switcher", "shared-filter-bar", "domain-kpi-stack", "drill-down-table"],
    requiredPatterns: ["topbar", "sidebar"],
    requiresDrawer: true,
    requiredSharedTypeNeedles: ["TopbarProps", "SidebarProps"],
    permissionStateNeedle: 'data-state="raised"',
    offlineStateNeedle: 'data-state="raised"',
    requiredSourceNeedles: [
      ["Topbar pattern", 'import { Topbar } from "../patterns/Topbar.js"'],
      ["Sidebar pattern", 'import { Sidebar } from "../patterns/Sidebar.js"'],
      ["dashboard switcher module", '"data-template-module": "dashboard-switcher"'],
      ["shared filter module", '"data-template-module": "shared-filter-bar"'],
      ["domain KPI module", '"data-template-module": "domain-kpi-stack"'],
      ["drill down module", '"data-template-module": "drill-down-table"'],
      ["charts primitive", '"data-chart-primitive": "charts"'],
    ],
    requiredTypeNeedles: [
      "FleetDashboardSuiteState",
      "FleetDashboardSuiteDensity",
      "selectedDashboard?",
      "defaultSelectedDashboard?",
      "onSelectedDashboardChange?",
      "FleetDashboardSuiteFilter",
      "FleetDashboardSuiteKpi",
      "FleetDashboardSuiteDrillDownRow",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          drawerOpen: true,
          "data-product-hook": "fleet-dashboard-suite",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "overview", props: { density: "md", state: "loading", [defaultProp]: "overview" } },
      { id: "empty-md", density: "md", selected: "overview", props: { density: "md", state: "empty", [defaultProp]: "overview" } },
      { id: "permission-lg", density: "lg", selected: "overview", props: { density: "lg", state: "permission", financeVisible: false } },
      { id: "error-sm", density: "sm", selected: "overview", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "overview", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "overview", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected, defaultDrawerOpen: true } },
    ],
  },
  {
    id: "fleet-manager-desktop",
    componentName: "FleetManagerDesktop",
    Component: FleetManagerDesktop,
    controlledLabel: "selectedDashboard",
    controlledProp: "selectedDashboard",
    defaultProp: "defaultSelectedDashboard",
    callbackProp: "onSelectedDashboardChange",
    selectedAttribute: "data-selected-dashboard",
    controlledSelected: "fuel",
    uncontrolledSelected: "fleet",
    requiredSlots: ["global-shell", "navigation-region", "workspace"],
    requiredModules: ["executive-kpi-band", "exception-inbox", "cost-center-scope-permissions"],
    requiredPatterns: ["topbar", "sidebar", "roles-and-permissions"],
    requiresDrawer: true,
    requiredSharedTypeNeedles: ["TopbarProps", "SidebarProps", "RolesAndPermissionsProps"],
    permissionStateNeedle: 'data-state="permission-blocked"',
    offlineStateNeedle: 'data-state="error"',
    requiredSourceNeedles: [
      ["Topbar pattern", 'import { Topbar } from "../patterns/Topbar.js"'],
      ["Sidebar pattern", 'import { Sidebar } from "../patterns/Sidebar.js"'],
      ["RolesAndPermissions pattern", 'import { RolesAndPermissions } from "../patterns/RolesAndPermissions.js"'],
      ["executive KPI module", '"data-template-module": "executive-kpi-band"'],
      ["exception inbox module", '"data-template-module": "exception-inbox"'],
    ],
    requiredTypeNeedles: [
      "FleetManagerDesktopState",
      "FleetManagerDesktopDensity",
      "selectedDashboard?",
      "defaultSelectedDashboard?",
      "onSelectedDashboardChange?",
      "FleetManagerDesktopMetric",
      "FleetManagerDesktopException",
    ],
    cases: ({ controlledProp, defaultProp, controlledSelected, uncontrolledSelected }) => [
      {
        id: "loaded-sm-controlled",
        density: "sm",
        selected: controlledSelected,
        props: {
          density: "sm",
          state: "loaded",
          [controlledProp]: controlledSelected,
          drawerOpen: true,
          "data-product-hook": "fleet-manager-desktop",
          style: { color: "rgb(255, 0, 0)", marginTop: 77 },
          dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
        },
      },
      { id: "loading-md", density: "md", selected: "overview", props: { density: "md", state: "loading", [defaultProp]: "overview" } },
      { id: "empty-md", density: "md", selected: "overview", props: { density: "md", state: "empty", [defaultProp]: "overview" } },
      { id: "permission-lg", density: "lg", selected: "overview", props: { density: "lg", state: "permission" } },
      { id: "error-sm", density: "sm", selected: "overview", props: { density: "sm", state: "error" } },
      { id: "offline-md", density: "md", selected: "overview", props: { density: "md", state: "offline" } },
      { id: "disabled-lg", density: "lg", selected: "overview", props: { density: "lg", disabled: true } },
      { id: "uncontrolled-default", density: "md", selected: uncontrolledSelected, props: { density: "md", [defaultProp]: uncontrolledSelected, defaultDrawerOpen: true } },
    ],
  },
];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function countNeedle(source, needle) {
  return source.split(needle).length - 1;
}

function templateFile(contract, extension) {
  return path.join(root, `packages/react/src/templates/${contract.componentName}.${extension}`);
}

function createSourceChecks(contract) {
  const sourceFile = templateFile(contract, "js");
  const typesFile = templateFile(contract, "d.ts");
  const source = read(sourceFile);
  const types = read(typesFile);
  const templateIndex = read(templateIndexFile);
  const reactIndex = read(reactIndexFile);
  const rootPackage = fs.existsSync(rootPackageFile) ? readJson(rootPackageFile) : {};
  const reactPackage = fs.existsSync(reactPackageFile) ? readJson(reactPackageFile) : {};
  const allowedDirectComponentImports = new Set(contract.allowedDirectComponentImports ?? []);
  const directComponentImports = [...source.matchAll(/import\s+\{\s*([A-Z][A-Za-z0-9]+)\s*\}\s+from\s+"(?:\.\.\/)(?!Surface\.js)(?!patterns\/)([^"]+)"/g)]
    .map((match) => `${match[1]} from ${match[2]}`);
  const forbiddenDirectComponentImports = directComponentImports.filter((entry) => !allowedDirectComponentImports.has(entry.split(" from ")[0]));
  const forbiddenSourceMatches = [
    ...(/apps\/docs|docs-demo|gold-/.test(source) ? ["Docs runtime reference"] : []),
    ...(/document\.createElement|querySelector|innerHTML/.test(source) ? ["vanilla DOM or raw HTML API"] : []),
    ...forbiddenDirectComponentImports.map((entry) => `direct component import: ${entry}`),
  ];
  const requiredSourceNeedles = [
    ["forwardRef", `forwardRef(function ${contract.componentName}`],
    ["Surface root", "React.createElement(Surface"],
    ["Surface import", 'import { Surface } from "../Surface.js"'],
    ["data-flow-template", `"data-flow-template": "${contract.id}"`],
    ["data-template-state", '"data-template-state": resolvedState'],
    [`${contract.controlledLabel} default`, contract.defaultProp],
    [`${contract.controlledLabel} callback`, contract.callbackProp],
    ...(contract.requiresDrawer ? [
      ["drawer controlled/uncontrolled", "defaultDrawerOpen"],
      ["drawer callback", "onDrawerOpenChange"],
    ] : []),
    ["escape prop filter", "sanitizeRestProps"],
    ...contract.requiredSourceNeedles,
  ];
  const requiredTypeNeedles = [
    "ForwardRefExoticComponent",
    "RefAttributes<HTMLDivElement>",
    ...(contract.requiresDrawer ? ["drawerOpen?", "defaultDrawerOpen?", "onDrawerOpenChange?"] : []),
    ...contract.requiredSharedTypeNeedles,
    ...contract.requiredTypeNeedles,
  ];
  const missingSourceNeedles = requiredSourceNeedles.filter(([, needle]) => !source.includes(needle)).map(([label]) => label);
  const missingTypeNeedles = requiredTypeNeedles.filter((needle) => !types.includes(needle));
  const exportGaps = [
    ...(!templateIndex.includes(`export { ${contract.componentName} } from "./${contract.componentName}.js";`) ? ["template index export"] : []),
    ...(!reactIndex.includes(`export { ${contract.componentName} } from "./templates/${contract.componentName}.js";`) ? ["react barrel export"] : []),
    ...(!rootPackage.exports?.[`./react/templates/${contract.id}`] ? ["root package template subpath"] : []),
    ...(!reactPackage.exports?.[`./templates/${contract.id}`] ? ["react package template subpath"] : []),
  ];

  return {
    template: contract.id,
    source: rel(sourceFile),
    types: rel(typesFile),
    sourceExists: fs.existsSync(sourceFile),
    typesExist: fs.existsSync(typesFile),
    requiredSourceChecks: requiredSourceNeedles.length,
    requiredTypeChecks: requiredTypeNeedles.length,
    directComponentImports,
    forbiddenDirectComponentImports,
    forbiddenSourceMatches,
    missingSourceNeedles,
    missingTypeNeedles,
    exportGaps,
  };
}

function assertRenderCase(contract, renderCase) {
  const markup = renderToStaticMarkup(React.createElement(contract.Component, renderCase.props));
  const rootTag = markup.match(/^<[^>]+>/)?.[0] ?? "";
  const failures = [];
  const addMissingNeedle = (label, needle) => {
    if (!markup.includes(needle)) failures.push(`missing ${label}`);
  };

  addMissingNeedle("template marker", `data-flow-template="${contract.id}"`);
  addMissingNeedle("Surface primitive marker", 'data-flow-primitive="surface"');
  addMissingNeedle("canvas surface role", 'data-surface-role="canvas"');
  addMissingNeedle(contract.controlledLabel, `${contract.selectedAttribute}="${renderCase.selected}"`);
  addMissingNeedle("root density", `data-density="${renderCase.density}"`);

  for (const slot of contract.requiredSlots) addMissingNeedle(`slot ${slot}`, `data-template-slot="${slot}"`);
  for (const module of contract.requiredModules) addMissingNeedle(`module ${module}`, `data-template-module="${module}"`);
  for (const pattern of contract.requiredPatterns) addMissingNeedle(`pattern ${pattern}`, `data-flow-pattern="${pattern}"`);
  for (const component of contract.requiredComponents ?? []) addMissingNeedle(`component ${component}`, component === "card-summary" ? 'class="card-summary' : component === "quick-action" ? 'class="quick-action' : component === "movement-row" ? 'class="movement-row' : component);
  for (const [needle, label] of renderCase.extraNeedles ?? []) addMissingNeedle(label, needle);

  const densityCount = countNeedle(markup, `data-density="${renderCase.density}"`);
  if (densityCount < 6) failures.push(`density did not cascade through enough surfaces/patterns (${densityCount}/6)`);
  if (!rootTag.includes('role="region"')) failures.push("root does not expose region role");
  if (!rootTag.includes('aria-label="')) failures.push("root does not expose accessible label");

  const expectedState = renderCase.props.disabled ? "disabled" : (renderCase.props.state ?? "loaded");
  addMissingNeedle(`template state ${expectedState}`, `data-template-state="${expectedState}"`);
  if (expectedState === "loading") {
    addMissingNeedle("loading busy state", 'aria-busy="true"');
    addMissingNeedle("loading child state", 'data-state="loading"');
  }
  if (expectedState === "permission") addMissingNeedle("permission child state", contract.permissionStateNeedle);
  if (expectedState === "error") addMissingNeedle("error child state", contract.errorStateNeedle ?? 'data-state="error"');
  if (expectedState === "offline") addMissingNeedle("offline child state", contract.offlineStateNeedle);
  if (expectedState === "disabled") addMissingNeedle("disabled child state", 'data-state="disabled"');

  for (const pattern of [
    /apps\/docs|docs-demo|gold-/i,
    /rgb\(255,\s*0,\s*0\)|margin-top:\s*77px/i,
    /Injected markup/i,
    /contenteditable=/i,
    /dangerouslySetInnerHTML/i,
    /data-reactroot/i,
  ]) {
    if (pattern.test(markup)) failures.push(`forbidden markup matched ${pattern}`);
  }

  return {
    template: contract.id,
    id: renderCase.id,
    status: failures.length ? "fail" : "pass",
    density: renderCase.density,
    state: expectedState,
    selected: renderCase.selected,
    markupBytes: markup.length,
    densityMarkers: densityCount,
    failures,
  };
}

function createReport() {
  const sourceChecks = templateContracts.map(createSourceChecks);
  const renderRows = templateContracts.flatMap((contract) => contract.cases(contract).map((renderCase) => assertRenderCase(contract, renderCase)));
  const gaps = [
    ...sourceChecks.flatMap((checks) => [
      ...(!checks.sourceExists ? [`${checks.template}: missing source ${checks.source}`] : []),
      ...(!checks.typesExist ? [`${checks.template}: missing types ${checks.types}`] : []),
      ...checks.missingSourceNeedles.map((gap) => `${checks.template}: missing source evidence ${gap}`),
      ...checks.missingTypeNeedles.map((gap) => `${checks.template}: missing type evidence ${gap}`),
      ...checks.exportGaps.map((gap) => `${checks.template}: missing export ${gap}`),
      ...checks.forbiddenSourceMatches.map((gap) => `${checks.template}: forbidden source ${gap}`),
    ]),
    ...renderRows.flatMap((row) => row.failures.map((failure) => `${row.template}/${row.id}: ${failure}`)),
  ];
  const allModules = templateContracts.flatMap((contract) => contract.requiredModules);
  const allPatterns = templateContracts.flatMap((contract) => contract.requiredPatterns);
  const allComponents = templateContracts.flatMap((contract) => contract.requiredComponents ?? []);
  const allSlots = templateContracts.flatMap((contract) => contract.requiredSlots);
  const inventory = {
    templatesAudited: templateContracts.length,
    renderCases: renderRows.length,
    passingRenderCases: renderRows.filter((row) => row.status === "pass").length,
    sourceFiles: sourceChecks.filter((checks) => checks.sourceExists).length,
    typeFiles: sourceChecks.filter((checks) => checks.typesExist).length,
    sourceContractChecks: sourceChecks.reduce((total, checks) => total + checks.requiredSourceChecks, 0),
    typeContractChecks: sourceChecks.reduce((total, checks) => total + checks.requiredTypeChecks, 0),
    surfaceRootTemplates: sourceChecks.filter((checks) => !checks.missingSourceNeedles.includes("Surface root")).length,
    templatesWithControlledPrimarySelection: sourceChecks.filter((checks) => !checks.missingSourceNeedles.some((gap) => gap.includes("callback") || gap.includes("default"))).length,
    templatesWithControlledDrawer: sourceChecks.filter((checks) => {
      const contract = templateContracts.find((item) => item.id === checks.template);
      return contract?.requiresDrawer && !checks.missingSourceNeedles.some((gap) => gap.includes("drawer"));
    }).length,
    templateSlotAssertions: allSlots.length,
    templateModuleAssertions: allModules.length,
    childPatternAssertions: allPatterns.length,
    uniqueChildPatternAssertions: new Set(allPatterns).size,
    childComponentAssertions: allComponents.length,
    uniqueChildComponentAssertions: new Set(allComponents).size,
    densityCases: new Set(renderRows.map((row) => row.density)).size,
    stateCases: commonStates.length,
    docsRuntimeReferences: sourceChecks.reduce((total, checks) => total + checks.forbiddenSourceMatches.filter((gap) => gap.includes("Docs")).length, 0),
    vanillaDomReferences: sourceChecks.reduce((total, checks) => total + checks.forbiddenSourceMatches.filter((gap) => gap.includes("vanilla DOM")).length, 0),
    forbiddenDirectComponentImports: sourceChecks.reduce((total, checks) => total + checks.forbiddenDirectComponentImports.length, 0),
    forbiddenMarkupFindings: renderRows.reduce((total, row) => total + row.failures.filter((failure) => failure.includes("forbidden markup")).length, 0),
    exportGaps: sourceChecks.reduce((total, checks) => total + checks.exportGaps.length, 0),
    typeContractGaps: sourceChecks.reduce((total, checks) => total + checks.missingTypeNeedles.length, 0),
    reactTemplateRuntimeGovernanceDebt: gaps.length,
  };

  return {
    status: gaps.length ? "fail" : "pass",
    principle: "React templates must prove runtime cascade from Surface roots through governed pattern slots without FlowDocs, DOM vanilla, direct component reimplementation, or escaped style/HTML props.",
    scope: {
      templates: templateContracts.map((contract) => contract.id),
    },
    inventory,
    sourceChecks,
    renderRows,
    gaps,
  };
}

function renderMarkdown(report) {
  const lines = [
    "# React Template Runtime Governance Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Render Cases",
    "",
    "| Template | Case | Status | State | Density | Selection | Density markers |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...report.renderRows.map((row) => `| ${row.template} | ${row.id} | ${row.status} | ${row.state} | ${row.density} | ${row.selected} | ${row.densityMarkers} |`),
    "",
    "## Gates",
    "",
    "- Surface root: required on every template root.",
    "- Slots: global-shell, navigation-region, workspace.",
    "- Modules: every promoted template module must render with data-template-module.",
    "- Patterns: child behavior must come from React patterns, not direct component reimplementation.",
    "- Escape props: style, dangerous HTML, contenteditable, Docs markers, and direct DOM APIs are forbidden.",
    "",
    "## Gaps",
    "",
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${gap}`) : ["- None"]),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

const report = createReport();
const json = `${JSON.stringify(report, null, 2)}\n`;
const markdown = renderMarkdown(report);

if (checkMode) {
  const previousJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
  const previousMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
  const stale = previousJson !== json || previousMarkdown !== markdown;
  if (stale || report.status !== "pass") {
    console.error(`React template runtime governance audit is ${report.status}${stale ? " and outputs are stale" : ""}. Run node ${rel(import.meta.url.replace("file://", ""))}.`);
    if (report.gaps.length) console.error(report.gaps.join("\n"));
    process.exitCode = 1;
  }
} else {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
}

console.log(JSON.stringify({
  status: report.status,
  output: rel(jsonOutput),
  inventory: report.inventory,
}, null, 2));
