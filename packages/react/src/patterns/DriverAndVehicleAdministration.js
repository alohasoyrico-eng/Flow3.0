/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
import { AuditEvent } from "../AuditEvent.js";
import { Avatar } from "../Avatar.js";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { CardSummary } from "../CardSummary.js";
import { Dialog } from "../Dialog.js";
import { EmptyState } from "../EmptyState.js";
import { IconButton } from "../IconButton.js";
import { Pagination } from "../Pagination.js";
import { Surface } from "../Surface.js";
import { Table } from "../Table.js";
import { Toast } from "../Toast.js";
import { Toolbar } from "./Toolbar.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeRecords(records) {
    return (Array.isArray(records) ? records : []).filter((record) => Boolean(record?.key || record?.id));
}
function iconButtonVariantForAction(variant) {
    return variant === "compact" ? "ghost" : "secondary";
}
function iconButtonStateForAction(state) {
    return state === "warning" ? "default" : state;
}
function resolveState({ disabled, loading, empty, selectedKey, actionRunning, permissionBlocked, error, state, records, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (permissionBlocked || state === "permission-blocked")
        return "permission-blocked";
    if (actionRunning || state === "action-running")
        return "action-running";
    if (loading || state === "loading")
        return "loading";
    if (empty || records.length === 0 || state === "empty")
        return "empty";
    if (selectedKey || state === "selected")
        return "selected";
    return state ?? "ready";
}
function recordTone(record) {
    if (record.tone)
        return record.tone;
    if (record.status === "blocked" || record.status === "expired")
        return "danger";
    if (record.status === "warning" || record.status === "review")
        return "warning";
    if (record.status === "active" || record.status === "ready")
        return "success";
    return "info";
}
function toTableRow(record, density, isDisabled) {
    const key = String(record.key ?? record.id);
    const owner = record.owner ?? record.driver ?? record.name ?? record.label;
    return {
        ...record,
        id: key,
        label: String(record.label ?? owner ?? key),
        identity: React.createElement(Avatar, {
            name: String(owner ?? record.label ?? key),
            src: record.avatarSrc,
            status: record.presence,
            density,
            state: isDisabled || record.disabled ? "disabled" : "default",
        }),
        statusCell: React.createElement(Badge, {
            label: record.statusLabel ?? record.status ?? "Ready",
            tone: recordTone(record),
            variant: "status",
            density,
            state: isDisabled || record.disabled ? "disabled" : "default",
        }),
        vehicle: record.vehicle ?? record.plate ?? record.unit ?? "",
        type: record.type ?? record.kind ?? "Record",
    };
}
export const DriverAndVehicleAdministration = forwardRef(function DriverAndVehicleAdministration({ label = "Driver and vehicle administration", description, density, state, disabled = false, loading = false, empty = false, selectedKey, actionRunning = false, permissionBlocked = false, error = false, toolbar, summary, records = [], columns, actions = [], primaryAction, secondaryAction, dialog, audit, pagination, emptyState, feedback, className = "", onRowSelect, onAction, onDialogAction, ...rest }, ref) {
    const normalizedRecords = normalizeRecords(records);
    const resolvedState = resolveState({
        disabled,
        loading,
        empty,
        selectedKey,
        actionRunning,
        permissionBlocked,
        error,
        state,
        records: normalizedRecords,
    });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
    const isBusy = resolvedState === "loading" || resolvedState === "action-running";
    const showEmpty = resolvedState === "empty" || resolvedState === "loading" || resolvedState === "error" || resolvedState === "permission-blocked";
    const tableRows = normalizedRecords.map((record) => toTableRow(record, density, isDisabled));
    const tableColumns = Array.isArray(columns) && columns.length
        ? columns
        : [
            { key: "identity", label: "Driver", priority: "primary" },
            { key: "vehicle", label: "Vehicle", priority: "secondary" },
            { key: "type", label: "Type", priority: "secondary" },
            { key: "statusCell", label: "Status", priority: "primary" },
        ];
    const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => Boolean(action?.label));
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": isBusy ? "true" : undefined,
        "aria-disabled": isDisabled ? "true" : undefined,
        "data-flow-pattern": "driver-and-vehicle-administration",
        "data-state": resolvedState,
        "data-density": density,
        "data-record-count": String(normalizedRecords.length),
        "data-action-count": String(normalizedActions.length),
        ...sanitizeRestProps(rest),
    }, React.createElement(Toolbar, {
        ...(toolbar ?? {}),
        label: toolbar?.label ?? `${label} toolbar`,
        density: toolbar?.density ?? density,
        state: toolbar?.state ?? (permissionBlocked ? "permission-blocked" : loading ? "loading" : undefined),
        loading,
        disabled: isDisabled || toolbar?.disabled,
        permissionBlocked: permissionBlocked || toolbar?.permissionBlocked,
        "data-admin-toolbar-boundary": "true",
    }), React.createElement(Surface, {
        surfaceRole: "section",
        state: isDisabled ? "disabled" : isBusy ? "raised" : resolvedState === "selected" ? "selected" : "default",
        density,
        "data-admin-surface": "true",
    }, React.createElement(CardSummary, {
        ...(summary ?? {}),
        label: summary?.label ?? label,
        meta: summary?.meta ?? description,
        number: summary?.number ?? `${normalizedRecords.length} records`,
        status: summary?.status ?? (permissionBlocked ? "Permission blocked" : error ? "Needs attention" : "Active"),
        metrics: summary?.metrics,
        variant: summary?.variant ?? "limit",
        state: summary?.state ?? (isDisabled ? "disabled" : error ? "warning" : "default"),
        density: summary?.density ?? density,
        fullWidth: summary?.fullWidth ?? true,
    }), showEmpty
        ? React.createElement(EmptyState, {
            title: emptyState?.title ?? (loading ? "Loading records" : permissionBlocked ? "Permission required" : error ? "Administration unavailable" : "No records"),
            description: emptyState?.description ?? description,
            icon: emptyState?.icon ?? (loading ? "sync" : permissionBlocked ? "lock" : error ? "error" : "inventory_2"),
            action: emptyState?.action,
            variant: emptyState?.variant ?? (permissionBlocked ? "permission" : error ? "error" : "search-empty"),
            state: emptyState?.state ?? (loading ? "loading" : permissionBlocked ? "permission" : error ? "error" : "search-empty"),
            density,
            fullWidth: true,
            onAction: emptyState?.onAction,
        })
        : React.createElement(Table, {
            label: `${label} records`,
            columns: tableColumns,
            rows: tableRows,
            rowKey: "id",
            variant: selectedKey || onRowSelect ? "selectable" : "standard",
            state: selectedKey ? "selected" : "default",
            density,
            selectedKey,
            onRowSelect,
        }), pagination
        ? React.createElement(Pagination, {
            label: pagination.label ?? `${label} pagination`,
            previousLabel: pagination.previousLabel ?? "Previous page",
            nextLabel: pagination.nextLabel ?? "Next page",
            getPageLabel: pagination.getPageLabel ?? ((page) => `Page ${page}`),
            page: pagination.page,
            pageCount: pagination.pageCount,
            density: pagination.density ?? density,
            disabled: isDisabled || pagination.disabled,
            fullWidth: pagination.fullWidth ?? true,
            onPageChange: pagination.onPageChange,
        })
        : null, normalizedActions.map((action) => {
        const actionState = isDisabled || action.disabled
            ? "disabled"
            : action.loading ?? (actionRunning && action.key === selectedKey)
                ? "loading"
                : action.state ?? "default";
        const variant = action.variant ?? "standard";
        const intent = action.intent === "danger" ? "danger" : action.intent === "warning" ? "warning" : "default";
        const meta = {
            label: action.label,
            variant,
            intent,
            state: actionState,
        };
        return React.createElement("div", {
            key: action.key ?? action.label,
            className: "quick-action",
            "data-variant": variant,
            "data-intent": intent,
            "data-state": actionState,
            "data-density": action.density ?? density,
        }, React.createElement(IconButton, {
            label: action.label,
            icon: action.icon,
            variant: iconButtonVariantForAction(variant),
            intent,
            state: iconButtonStateForAction(actionState),
            density: action.density ?? density,
            loading: action.loading ?? (actionRunning && action.key === selectedKey),
            disabled: isDisabled || action.disabled,
            className: "quick-action__control",
            onClick: (event) => {
                action.onAction?.(meta, event);
                if (event.defaultPrevented)
                    return;
                onAction?.(action.key ?? action.label, event);
            },
        }), action.label ? React.createElement("span", { className: "quick-action__label" }, action.label) : null, action.badge
            ? React.createElement(Badge, {
                label: action.badge,
                variant: "count",
                density: action.density ?? density,
            })
            : null);
    }), primaryAction?.label
        ? React.createElement(Button, {
            ...primaryAction,
            label: primaryAction.label,
            variant: primaryAction.variant ?? "primary",
            density: primaryAction.density ?? density,
            loading: primaryAction.loading ?? actionRunning,
            disabled: isDisabled || primaryAction.disabled,
        })
        : null, secondaryAction?.label
        ? React.createElement(Button, {
            ...secondaryAction,
            label: secondaryAction.label,
            variant: secondaryAction.variant ?? "secondary",
            density: secondaryAction.density ?? density,
            disabled: isDisabled || secondaryAction.disabled,
        })
        : null, dialog
        ? React.createElement(Dialog, {
            ...dialog,
            label: dialog.label ?? "Confirm administration action",
            description: dialog.description,
            triggerLabel: dialog.triggerLabel ?? "Review action",
            closeLabel: dialog.closeLabel ?? "Close",
            variant: dialog.variant ?? "review",
            density: dialog.density ?? density,
            actions: dialog.actions,
            fields: dialog.fields,
            open: dialog.open,
            onOpenChange: dialog.onOpenChange,
            onAction: (key, event) => {
                dialog.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onDialogAction?.(key, event);
            },
        })
        : null, audit
        ? React.createElement(AuditEvent, {
            ...audit,
            label: audit.label ?? "Administration audit",
            description: audit.description,
            meta: audit.meta,
            status: audit.status,
            tone: audit.tone ?? "info",
            state: audit.state ?? (permissionBlocked ? "warning" : error ? "critical" : "verified"),
            density: audit.density ?? density,
            timestamp: audit.timestamp,
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            label: feedback.label,
            description: feedback.description,
            tone: feedback.tone ?? (error ? "danger" : permissionBlocked ? "warning" : "info"),
            variant: feedback.variant ?? "status",
            state: feedback.state ?? "visible",
            density: feedback.density ?? density,
        })
        : null));
});
DriverAndVehicleAdministration.displayName = "DriverAndVehicleAdministration";
