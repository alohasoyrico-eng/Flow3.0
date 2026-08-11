import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { RouteMetric, RouteSummaryAction } from "../RouteSummary.js";
import type { SearchProps, SearchResult } from "./Search.js";

export type StationDiscoveryState =
  | "nearby"
  | "selected"
  | "route"
  | "denied"
  | "offline"
  | "error"
  | "runtimeUnavailable"
  | "providerMissing"
  | "loading"
  | "empty"
  | "disabled";

export type StationDiscoveryDensity = "sm" | "md" | "lg";
export type StationDiscoveryPermission = "granted" | "denied" | "prompt" | "unavailable";

export interface StationDiscoveryStation {
  id?: string;
  key?: string;
  label: string;
  value?: string;
  distance?: string;
  meta?: string;
  status?: string;
  route?: string;
  eta?: string;
  variant?: "fuel" | "ev" | "service" | "cluster";
  state?: "default" | "hover" | "focus" | "selected" | "unavailable" | "disabled";
  selected?: boolean;
  unavailable?: boolean;
  coordinates?: unknown;
  icon?: string;
}

export interface StationDiscoveryRoute {
  label?: string;
  eta?: string;
  distance?: string;
  metrics?: RouteMetric[];
  actions?: RouteSummaryAction[];
}

export interface StationDiscoveryFallbackList {
  reason?: string;
  action?: string;
  items?: Array<{ id?: string; key?: string; label: string; meta?: string; value?: string; icon?: string; state?: string; disabled?: boolean }>;
}

export interface StationDiscoveryProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: StationDiscoveryDensity;
  state?: StationDiscoveryState;
  disabled?: boolean;
  loading?: boolean;
  permission?: StationDiscoveryPermission;
  center?: unknown;
  stations?: StationDiscoveryStation[];
  selectedStation?: StationDiscoveryStation;
  selectedStationKey?: string;
  route?: StationDiscoveryRoute | null;
  fallbackList?: StationDiscoveryFallbackList;
  runtime?: unknown;
  mapStyle?: unknown;
  tileProvider?: { id?: string; name?: string; label?: string; attribution?: string };
  query?: string;
  search?: Partial<SearchProps> & { results?: SearchResult[] };
  emptyState?: Partial<EmptyStateProps>;
  error?: Error | string;
  errorPanel?: Partial<ErrorPanelProps>;
  action?: ButtonProps & { key?: string };
  className?: string;
  onStationSelect?: (key: string, station: StationDiscoveryStation | Record<string, unknown>, event: MouseEvent<HTMLElement>) => void;
  onRouteAction?: (key: string, action: RouteSummaryAction, event: MouseEvent<HTMLButtonElement>) => void;
  onQueryChange?: (value: string, event?: unknown) => void;
  onSubmit?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
  onAction?: (key: string, event: MouseEvent<HTMLElement>) => void;
}

export interface StationDiscoveryComponent extends ForwardRefExoticComponent<StationDiscoveryProps & RefAttributes<HTMLDivElement>> {
  displayName: "StationDiscovery";
}

export const StationDiscovery: StationDiscoveryComponent;
