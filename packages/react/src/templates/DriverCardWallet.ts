import React, { forwardRef, useState } from "react";
import { CardSummary, type CardSummaryProps } from "../CardSummary.js";
import { MovementRow, type MovementRowProps } from "../MovementRow.js";
import { QuickActionsGrid, type QuickActionsGridAction, type QuickActionsGridActionIntent, type QuickActionsGridActionMeta, type QuickActionsGridActionState, type QuickActionsGridActionVariant } from "../patterns/QuickActionsGrid.js";
import { Surface, type SurfaceDensity, type SurfaceState, type SurfaceTone } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";

export type DriverCardWalletState = "loaded" | "loading" | "empty" | "error" | "permission" | "offline" | "disabled";
export type DriverCardWalletDensity = SurfaceDensity;
export type DriverCardWalletSection = "card" | "movements" | "limits" | "help" | (string & {});
export type DriverCardWalletActionVariant = QuickActionsGridActionVariant;
export type DriverCardWalletActionState = QuickActionsGridActionState;
export type DriverCardWalletActionIntent = QuickActionsGridActionIntent;

export interface DriverCardWalletSectionItem {
  key: string;
  label: string;
  disabled?: boolean;
}

export type DriverCardWalletActionMeta = QuickActionsGridActionMeta;

export interface DriverCardWalletAction extends QuickActionsGridAction {
  key?: string;
}

export interface DriverCardWalletMovement extends MovementRowProps {
  key?: string;
}

export interface DriverCardWalletProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DriverCardWalletDensity;
  tone?: SurfaceTone;
  state?: DriverCardWalletState | undefined;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  offline?: boolean;
  selectedSection?: DriverCardWalletSection;
  defaultSelectedSection?: DriverCardWalletSection;
  onSelectedSectionChange?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  card?: Partial<CardSummaryProps>;
  actions?: DriverCardWalletAction[];
  movements?: DriverCardWalletMovement[];
  sections?: DriverCardWalletSectionItem[];
  dispute?: ReactNode;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DriverCardWalletComponent extends ForwardRefExoticComponent<DriverCardWalletProps & RefAttributes<HTMLDivElement>> {
  displayName: "DriverCardWallet";
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
  state?: DriverCardWalletState | undefined;
}): DriverCardWalletState {
  if (disabled || state === "disabled") return "disabled";
  if (offline || state === "offline") return "offline";
  if (error || state === "error") return "error";
  if (permissionBlocked || state === "permission") return "permission";
  if (loading || state === "loading") return "loading";
  if (state === "empty") return "empty";
  return state ?? "loaded";
}

function surfaceStateForTemplate(state: DriverCardWalletState): SurfaceState {
  if (state === "disabled") return "disabled";
  if (state === "permission" || state === "error" || state === "offline") return "raised";
  if (state === "empty" || state === "loading") return "sunken";
  return "default";
}

function cardStateForTemplate(state: DriverCardWalletState): CardSummaryProps["state"] {
  if (state === "disabled") return "disabled";
  if (state === "permission" || state === "offline") return "frozen";
  if (state === "error") return "warning";
  return "active";
}

function actionStateForTemplate(state: DriverCardWalletState): DriverCardWalletActionState {
  if (state === "loading") return "loading";
  if (state === "permission" || state === "error" || state === "offline") return "warning";
  if (state === "disabled") return "disabled";
  return "default";
}

function movementStateForTemplate(state: DriverCardWalletState, movement: DriverCardWalletMovement): MovementRowProps["state"] {
  if (state === "disabled") return "disabled";
  if (state === "error" || movement.state === "error") return "error";
  if (state === "loading" || movement.state === "pending") return "pending";
  return movement.state ?? "default";
}

const defaultSections: DriverCardWalletSectionItem[] = [
  { key: "card", label: "Card" },
  { key: "movements", label: "Movements" },
  { key: "limits", label: "Limits" },
  { key: "help", label: "Help" },
];

const defaultCard: Partial<CardSummaryProps> = {
  label: "Driver fuel card",
  meta: "Alicia Gomez",
  number: "•••• 4821",
  expires: "08/28",
  status: "Active",
  metrics: [
    { key: "available", label: "Available", value: "$4,280" },
    { key: "today", label: "Today spent", value: "$820" },
  ],
};

const defaultActions: DriverCardWalletAction[] = [
  { key: "freeze", label: "Freeze card", icon: "ac_unit", intent: "danger" },
  { key: "limits", label: "Adjust limits", icon: "tune" },
  { key: "support", label: "Get help", icon: "support_agent" },
];

const defaultMovements: DriverCardWalletMovement[] = [
  { key: "fuel-01", label: "Centro Norte", meta: "Authorization MX-4821", amount: "$820", status: "Approved", category: "fuel" },
  { key: "hold-01", label: "Service hold", meta: "Pending capture", amount: "$120", status: "Pending", category: "transfer", state: "pending" },
];

export const DriverCardWallet = forwardRef<HTMLDivElement, DriverCardWalletProps>(function DriverCardWallet(
  {
    label = "Driver card wallet",
    description = "Card status, quick actions, movement evidence, and dispute recovery.",
    density = "md",
    tone,
    state,
    disabled = false,
    loading = false,
    error = false,
    permissionBlocked = false,
    offline = false,
    selectedSection,
    defaultSelectedSection = "card",
    onSelectedSectionChange,
    card = defaultCard,
    actions = defaultActions,
    movements = defaultMovements,
    sections = defaultSections,
    dispute,
    className = "",
    ...rest
  },
  ref,
) {
  const [internalSelectedSection, setInternalSelectedSection] = useState<DriverCardWalletSection>(defaultSelectedSection);
  const resolvedSelectedSection = selectedSection ?? internalSelectedSection;
  const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
  const isBusy = resolvedState === "loading";
  const isDisabled = disabled || resolvedState === "disabled";

  const handleSectionSelect = (key: DriverCardWalletSection, event: MouseEvent<HTMLButtonElement>) => {
    if (selectedSection === undefined) setInternalSelectedSection(key);
    onSelectedSectionChange?.(key, event);
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
      "data-flow-template": "driver-card-wallet",
      "data-template-state": resolvedState,
      "data-density": density,
      "data-selected-section": resolvedSelectedSection,
      ...sanitizeRestProps(rest),
    },
    React.createElement(
      Surface,
      {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        "data-template-slot": "wallet-shell",
        "data-template-module": "wallet-navigation",
        "data-template-section-count": String(sections.length),
      },
      sections.map((section) =>
        React.createElement(
          "button",
          {
            key: section.key,
            type: "button",
            disabled: isDisabled || section.disabled,
            "aria-current": resolvedSelectedSection === section.key ? "page" : undefined,
            "data-template-section": section.key,
            "data-selected": String(resolvedSelectedSection === section.key),
            onClick: (event: MouseEvent<HTMLButtonElement>) => handleSectionSelect(section.key as DriverCardWalletSection, event),
          },
          section.label,
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
          tone: resolvedState === "permission" || resolvedState === "offline" ? "warning" : "default",
          "data-template-module": "card-status-block",
        },
        React.createElement(CardSummary, {
          ...card,
          label: card.label ?? defaultCard.label,
          meta: card.meta ?? defaultCard.meta,
          number: card.number ?? defaultCard.number,
          expires: card.expires ?? defaultCard.expires,
          status: card.status ?? defaultCard.status,
          metrics: card.metrics ?? defaultCard.metrics,
          variant: card.variant ?? "limit",
          state: card.state ?? cardStateForTemplate(resolvedState),
          density,
          fullWidth: true,
          disabled: isDisabled || card.disabled,
          "data-template-component": "card-summary",
        } as CardSummaryProps),
      ),
      React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: surfaceStateForTemplate(resolvedState),
          density,
          elevation: "none",
          "data-template-module": "quick-actions",
          "data-module-item-count": String(actions.length),
        },
        React.createElement(QuickActionsGrid, {
          label: `${label} actions`,
          density,
          state: isBusy ? "loading" : isDisabled || resolvedState === "permission" ? "disabled" : "default",
          actions: actions.map((action) => ({
            ...action,
            density: action.density ?? density,
            state: action.state ?? actionStateForTemplate(resolvedState),
            disabled: isDisabled || action.disabled || resolvedState === "permission",
            loading: isBusy || action.loading,
          })),
          "data-template-component": "quick-actions-grid",
        } as React.ComponentProps<typeof QuickActionsGrid>),
      ),
      React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: surfaceStateForTemplate(resolvedState),
          density,
          elevation: "raised",
          "data-template-module": "movement-receipt-detail",
          "data-module-item-count": String(movements.length),
        },
        movements.map((movement) =>
          React.createElement(MovementRow, {
            ...movement,
            key: movement.key ?? movement.label,
            label: movement.label,
            meta: movement.meta,
            amount: movement.amount,
            status: movement.status,
            category: movement.category,
            variant: movement.variant ?? (movement.state === "error" ? "declined" : "standard"),
            state: movementStateForTemplate(resolvedState, movement),
            density: movement.density ?? density,
            fullWidth: true,
            disabled: isDisabled || movement.disabled,
            "data-template-movement": movement.key ?? movement.label,
          } as DriverCardWalletMovement),
        ),
      ),
      React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state:
            resolvedState === "permission" || resolvedState === "error" || resolvedState === "offline"
              ? "raised"
              : surfaceStateForTemplate(resolvedState),
          density,
          elevation: "none",
          tone: resolvedState === "error" || resolvedState === "offline" ? "warning" : "default",
          "data-template-module": "dispute-entry-point",
        },
        dispute ?? "Dispute entry keeps eligibility, evidence, timing, and audit context visible.",
      ),
    ),
  );
}) as DriverCardWalletComponent;

DriverCardWallet.displayName = "DriverCardWallet";
