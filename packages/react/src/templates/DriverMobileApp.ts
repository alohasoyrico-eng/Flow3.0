import React, { forwardRef, useState } from "react";
import { Surface, type SurfaceDensity, type SurfaceState, type SurfaceTone } from "../Surface.js";
import { DriverOnboardingMobile, type DriverOnboardingMobileProps } from "../patterns/DriverOnboardingMobile.js";
import { StationDiscovery, type StationDiscoveryProps } from "../patterns/StationDiscovery.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";

export type DriverMobileAppState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type DriverMobileAppDensity = SurfaceDensity;
export type DriverMobileAppTab = "home" | "card" | "routes" | "support" | (string & {});

export interface DriverMobileAppTabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export interface DriverMobileAppCard {
  status?: string;
  available?: string;
  limit?: string;
  detail?: string;
}

export interface DriverMobileAppMovement {
  key?: string;
  label: string;
  amount?: string;
  status?: string;
}

export interface DriverMobileAppProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DriverMobileAppDensity;
  tone?: SurfaceTone;
  state?: DriverMobileAppState | undefined;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedTab?: DriverMobileAppTab;
  defaultSelectedTab?: DriverMobileAppTab;
  onSelectedTabChange?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  driverOnboarding?: DriverOnboardingMobileProps;
  stationDiscovery?: StationDiscoveryProps;
  card?: DriverMobileAppCard;
  movements?: DriverMobileAppMovement[];
  tabs?: DriverMobileAppTabItem[];
  support?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DriverMobileAppComponent extends ForwardRefExoticComponent<DriverMobileAppProps & RefAttributes<HTMLDivElement>> {
  displayName: "DriverMobileApp";
}

type SanitizedRestProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
} & {
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SanitizedRestProps {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as SanitizedRestProps;
}

function resolveTemplateState({
  disabled,
  loading,
  error,
  permissionBlocked,
  offline,
  state,
}: {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  state?: DriverMobileAppState | undefined;
}): DriverMobileAppState {
  if (disabled || state === "disabled") return "disabled";
  if (offline || state === "offline") return "offline";
  if (error || state === "error") return "error";
  if (permissionBlocked || state === "permission") return "permission";
  if (loading || state === "loading") return "loading";
  return state ?? "loaded";
}

function surfaceStateForTemplate(state: DriverMobileAppState): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "permission" || state === "error" || state === "offline") return "raised";
  return "default";
}

function onboardingStateForTemplate(state: DriverMobileAppState): DriverOnboardingMobileProps["state"] {
  if (state === "loading") return "verifying";
  if (state === "permission") return "biometric";
  if (state === "error" || state === "offline") return "blocked";
  if (state === "disabled") return "disabled";
  return "complete";
}

function stationStateForTemplate(state: DriverMobileAppState): StationDiscoveryProps["state"] {
  if (state === "loading") return "loading";
  if (state === "permission") return "denied";
  if (state === "offline") return "offline";
  if (state === "error") return "error";
  if (state === "disabled") return "disabled";
  return "nearby";
}

const defaultTabs: DriverMobileAppTabItem[] = [
  { key: "home", label: "Inicio" },
  { key: "card", label: "Tarjeta" },
  { key: "routes", label: "Rutas" },
  { key: "support", label: "Soporte" },
];

const defaultCard: DriverMobileAppCard = {
  status: "Active",
  available: "$4,280",
  limit: "$8,000",
  detail: "Ready for fuel and route spend",
};

const defaultMovements: DriverMobileAppMovement[] = [
  { key: "fuel-01", label: "Fuel station Centro Norte", amount: "$820", status: "Approved" },
  { key: "service-01", label: "Service hold", amount: "$120", status: "Pending" },
];

const defaultStations: NonNullable<StationDiscoveryProps["stations"]> = [
  { id: "centro", label: "Centro Norte", value: "1.2 km", meta: "Open", route: "8 min", selected: true },
  { id: "sur", label: "Sur Poniente", value: "3.4 km", meta: "Diesel", route: "14 min" },
];

export const DriverMobileApp = forwardRef<HTMLDivElement, DriverMobileAppProps>(function DriverMobileApp(
  {
    label = "Driver mobile app",
    description = "Card readiness, route access, nearby stations, and support recovery.",
    density = "md",
    tone,
    state,
    disabled = false,
    loading = false,
    error = false,
    permissionBlocked = false,
    offline = false,
    selectedTab,
    defaultSelectedTab = "home",
    onSelectedTabChange,
    driverOnboarding,
    stationDiscovery,
    card = defaultCard,
    movements = defaultMovements,
    tabs = defaultTabs,
    support,
    className = "",
    ...rest
  },
  ref,
) {
  const [internalSelectedTab, setInternalSelectedTab] = useState<DriverMobileAppTab>(defaultSelectedTab);
  const resolvedSelectedTab = selectedTab ?? internalSelectedTab;
  const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
  const isBusy = resolvedState === "loading";
  const isDisabled = disabled || resolvedState === "disabled";

  const handleTabSelect = (key: DriverMobileAppTab, event: MouseEvent<HTMLButtonElement>) => {
    if (selectedTab === undefined) setInternalSelectedTab(key);
    onSelectedTabChange?.(key, event);
  };

  return React.createElement(
    Surface,
    {
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
    },
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        "data-template-slot": "mobile-shell",
        "data-template-module": "mobile-navigation",
        "data-template-tab-count": String(tabs.length),
      },
      tabs.map((tab) =>
        React.createElement(
          "button",
          {
            key: tab.key,
            type: "button",
            disabled: isDisabled || tab.disabled,
            "aria-current": resolvedSelectedTab === tab.key ? "page" : undefined,
            "data-template-tab": tab.key,
            "data-selected": String(resolvedSelectedTab === tab.key),
            onClick: (event: MouseEvent<HTMLButtonElement>) => handleTabSelect(tab.key as DriverMobileAppTab, event),
          },
          tab.label,
        ),
      ),
    ),
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        "data-template-slot": "workspace",
      },
      React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: surfaceStateForTemplate(resolvedState),
          density,
          elevation: "raised",
          tone: resolvedState === "error" || resolvedState === "offline" ? "danger" : "default",
          "data-template-module": "mobile-card-overview",
          "data-card-status": card.status,
        },
        React.createElement("span", { "data-template-card-available": "true" }, `${card.available} available`),
        React.createElement("span", { "data-template-card-limit": "true" }, `${card.limit} limit`),
        React.createElement("span", { "data-template-card-detail": "true" }, card.detail),
      ),
      React.createElement(DriverOnboardingMobile, {
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
      } as DriverOnboardingMobileProps),
      React.createElement(StationDiscovery, {
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
      } as StationDiscoveryProps),
      React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: surfaceStateForTemplate(resolvedState),
          density,
          elevation: "none",
          "data-template-module": "recent-movement-feed",
          "data-module-item-count": String(movements.length),
        },
        movements.map((movement) =>
          React.createElement(
            "span",
            {
              key: movement.key ?? movement.label,
              "data-template-movement": movement.key ?? movement.label,
              "data-template-movement-status": movement.status ?? "Unknown",
            },
            `${movement.label}: ${movement.amount ?? ""} ${movement.status ?? ""}`,
          ),
        ),
      ),
      React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: resolvedState === "permission" ? "raised" : surfaceStateForTemplate(resolvedState),
          density,
          elevation: "none",
          tone: resolvedState === "permission" || resolvedState === "error" || resolvedState === "offline" ? "warning" : "default",
          "data-template-module": "support-and-dispute-path",
        },
        support ?? "Support path keeps blocked cards, suspicious movements, and failed payments recoverable.",
      ),
    ),
  );
}) as DriverMobileAppComponent;

DriverMobileApp.displayName = "DriverMobileApp";
