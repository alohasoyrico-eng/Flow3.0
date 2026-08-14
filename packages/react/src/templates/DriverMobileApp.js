/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useState } from "react";
import { Surface } from "../Surface.js";
import { DriverOnboardingMobile } from "../patterns/DriverOnboardingMobile.js";
import { StationDiscovery } from "../patterns/StationDiscovery.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (offline || state === "offline")
        return "offline";
    if (error || state === "error")
        return "error";
    if (permissionBlocked || state === "permission")
        return "permission";
    if (loading || state === "loading")
        return "loading";
    return state ?? "loaded";
}
function surfaceStateForTemplate(state) {
    if (state === "disabled")
        return "disabled";
    if (state === "permission" || state === "error" || state === "offline")
        return "raised";
    return "default";
}
function onboardingStateForTemplate(state) {
    if (state === "loading")
        return "verifying";
    if (state === "permission")
        return "biometric";
    if (state === "error" || state === "offline")
        return "blocked";
    if (state === "disabled")
        return "disabled";
    return "complete";
}
function stationStateForTemplate(state) {
    if (state === "loading")
        return "loading";
    if (state === "permission")
        return "denied";
    if (state === "offline")
        return "offline";
    if (state === "error")
        return "error";
    if (state === "disabled")
        return "disabled";
    return "nearby";
}
const defaultTabs = [
    { key: "home", label: "Inicio" },
    { key: "card", label: "Tarjeta" },
    { key: "routes", label: "Rutas" },
    { key: "support", label: "Soporte" },
];
const defaultCard = {
    status: "Active",
    available: "$4,280",
    limit: "$8,000",
    detail: "Ready for fuel and route spend",
};
const defaultMovements = [
    { key: "fuel-01", label: "Fuel station Centro Norte", amount: "$820", status: "Approved" },
    { key: "service-01", label: "Service hold", amount: "$120", status: "Pending" },
];
const defaultStations = [
    { id: "centro", label: "Centro Norte", value: "1.2 km", meta: "Open", route: "8 min", selected: true },
    { id: "sur", label: "Sur Poniente", value: "3.4 km", meta: "Diesel", route: "14 min" },
];
export const DriverMobileApp = forwardRef(function DriverMobileApp({ label = "Driver mobile app", description = "Card readiness, route access, nearby stations, and support recovery.", density = "md", tone, state, disabled = false, loading = false, error = false, permissionBlocked = false, offline = false, selectedTab, defaultSelectedTab = "home", onSelectedTabChange, driverOnboarding, stationDiscovery, card = defaultCard, movements = defaultMovements, tabs = defaultTabs, support, className = "", ...rest }, ref) {
    const [internalSelectedTab, setInternalSelectedTab] = useState(defaultSelectedTab);
    const resolvedSelectedTab = selectedTab ?? internalSelectedTab;
    const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
    const isBusy = resolvedState === "loading";
    const isDisabled = disabled || resolvedState === "disabled";
    const handleTabSelect = (key, event) => {
        if (selectedTab === undefined)
            setInternalSelectedTab(key);
        onSelectedTabChange?.(key, event);
    };
    return React.createElement(Surface, {
        ref,
        className,
        surfaceRole: "canvas",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        tone: tone ?? (resolvedState === "permission" ? "warning" : resolvedState === "error" || resolvedState === "offline" ? "danger" : "default"),
        focusMode: "within",
        role: "region",
        "aria-label": label,
        "aria-description": description,
        "aria-busy": isBusy ? "true" : undefined,
        "data-flow-template": "driver-mobile-app",
        "data-template-state": resolvedState,
        "data-density": density,
        "data-selected-tab": resolvedSelectedTab,
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        "data-template-slot": "mobile-shell",
        "data-template-module": "mobile-navigation",
        "data-template-tab-count": String(tabs.length),
    }, tabs.map((tab) => React.createElement("button", {
        key: tab.key,
        type: "button",
        disabled: isDisabled || tab.disabled,
        "aria-current": resolvedSelectedTab === tab.key ? "page" : undefined,
        "data-template-tab": tab.key,
        "data-selected": String(resolvedSelectedTab === tab.key),
        onClick: (event) => handleTabSelect(tab.key, event),
    }, tab.label))), React.createElement(Surface, {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        "data-template-slot": "workspace",
    }, React.createElement(Surface, {
        surfaceRole: "panel",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        tone: resolvedState === "error" || resolvedState === "offline" ? "danger" : "default",
        "data-template-module": "mobile-card-overview",
        "data-card-status": card.status,
    }, React.createElement("span", { "data-template-card-available": "true" }, `${card.available} available`), React.createElement("span", { "data-template-card-limit": "true" }, `${card.limit} limit`), React.createElement("span", { "data-template-card-detail": "true" }, card.detail)), React.createElement(DriverOnboardingMobile, {
        ...(driverOnboarding ?? {}),
        label: driverOnboarding?.label ?? "Driver readiness",
        description: driverOnboarding?.description ?? "Identity, consent, card readiness, and recovery.",
        density: driverOnboarding?.density ?? density,
        state: driverOnboarding?.state ?? onboardingStateForTemplate(resolvedState),
        disabled: isDisabled || driverOnboarding?.disabled,
        verifying: isBusy || driverOnboarding?.verifying,
        biometric: resolvedState === "permission" || driverOnboarding?.biometric,
        blocked: resolvedState === "error" || resolvedState === "offline" || driverOnboarding?.blocked,
        complete: resolvedState === "loaded" || driverOnboarding?.complete,
        reducedMotion: driverOnboarding?.reducedMotion,
        "data-template-module": "driver-readiness-onboarding",
    }), React.createElement(StationDiscovery, {
        ...(stationDiscovery ?? {}),
        label: stationDiscovery?.label ?? "Nearby stations",
        description: stationDiscovery?.description ?? "Choose a station or search manually.",
        density: stationDiscovery?.density ?? density,
        state: stationDiscovery?.state ?? stationStateForTemplate(resolvedState),
        disabled: isDisabled || stationDiscovery?.disabled,
        loading: isBusy || stationDiscovery?.loading,
        permission: stationDiscovery?.permission ?? (resolvedState === "permission" ? "denied" : "granted"),
        stations: stationDiscovery?.stations ?? defaultStations,
        selectedStationKey: stationDiscovery?.selectedStationKey ?? "centro",
        route: stationDiscovery?.route ?? { label: "Route to Centro Norte", eta: "8 min", distance: "1.2 km", actions: [{ key: "start", label: "Start route" }] },
        fallbackList: stationDiscovery?.fallbackList ?? {
            reason: "Location fallback keeps route access available.",
            items: defaultStations,
        },
        "data-template-module": "routes-and-nearby-stations-mobile",
    }), React.createElement(Surface, {
        surfaceRole: "panel",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        "data-template-module": "recent-movement-feed",
        "data-module-item-count": String(movements.length),
    }, movements.map((movement) => React.createElement("span", {
        key: movement.key ?? movement.label,
        "data-template-movement": movement.key ?? movement.label,
        "data-template-movement-status": movement.status ?? "Unknown",
    }, `${movement.label}: ${movement.amount ?? ""} ${movement.status ?? ""}`))), React.createElement(Surface, {
        surfaceRole: "panel",
        state: resolvedState === "permission" ? "raised" : surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        tone: resolvedState === "permission" || resolvedState === "error" || resolvedState === "offline" ? "warning" : "default",
        "data-template-module": "support-and-dispute-path",
    }, support ?? "Support path keeps blocked cards, suspicious movements, and failed payments recoverable.")));
});
DriverMobileApp.displayName = "DriverMobileApp";
