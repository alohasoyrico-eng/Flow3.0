import React, { forwardRef } from "react";
import { AuditEvent } from "../AuditEvent.js";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import { Dialog } from "../Dialog.js";
import { InlineValidation } from "../InlineValidation.js";
import { Switch } from "../Switch.js";
import { Table } from "../Table.js";
import { Toast } from "../Toast.js";
import { Tooltip } from "../Tooltip.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeRoles(roles) {
    return (Array.isArray(roles) ? roles : []).filter((role) => Boolean(role?.label));
}
function normalizePermissions(permissions) {
    return (Array.isArray(permissions) ? permissions : []).filter((permission) => Boolean(permission?.label));
}
function permissionKey(permission) {
    return String(permission.key ?? permission.value ?? permission.label);
}
function roleKey(role) {
    return String(role.key ?? role.value ?? role.label);
}
function resolveState({ disabled, saving, state }) {
    if (disabled)
        return "permission-blocked";
    if (saving || state === "saving")
        return "saving";
    return state ?? "read-only";
}
function tableCellNode(row, key) {
    return row[key];
}
function actionKey(action) {
    return String(action.key ?? action.label);
}
function cellControl({ mode, checked, disabled, density, role, permission, onPermissionChange }) {
    const label = `${role.label}: ${permission.label}`;
    const roleKeyValue = roleKey(role);
    const permissionKeyValue = permissionKey(permission);
    const shared = {
        label,
        density,
        checked,
        disabled,
        name: `${roleKeyValue}-${permissionKeyValue}`,
        "data-role-key": roleKeyValue,
        "data-permission-key": permissionKeyValue,
    };
    const onCheckedChange = (nextChecked, meta, event) => {
        onPermissionChange?.(roleKeyValue, permissionKeyValue, nextChecked, { role, permission, meta }, event);
    };
    return mode === "checkbox"
        ? React.createElement(Checkbox, {
            ...shared,
            variant: "compact",
            state: disabled ? "disabled" : checked ? "checked" : "unchecked",
            onCheckedChange,
        })
        : React.createElement(Switch, {
            ...shared,
            state: disabled ? "disabled" : checked ? "on" : "off",
            onCheckedChange,
        });
}
export const RolesAndPermissions = forwardRef(function RolesAndPermissions({ label = "Roles and permissions", description, density, state, disabled = false, saving = false, mode = "switch", roles = [], permissions = [], values = {}, validation, confirmation, audit, feedback, actions = [], onPermissionChange, onAction, className = "", ...rest }, ref) {
    const normalizedRoles = normalizeRoles(roles);
    const normalizedPermissions = normalizePermissions(permissions);
    const resolvedState = resolveState({ disabled, saving, state });
    const isDisabled = disabled || resolvedState === "permission-blocked";
    const roleColumns = normalizedRoles.map((role) => ({
        key: roleKey(role),
        label: role.label,
        render: (row) => tableCellNode(row, roleKey(role)),
    }));
    const columns = [
        {
            key: "permission",
            label: "Permission",
            priority: "primary",
            render: (row) => tableCellNode(row, "permission"),
        },
        ...roleColumns,
    ];
    const rows = normalizedPermissions.map((permission) => {
        const key = permissionKey(permission);
        const disabledReason = permission.disabledReason ?? permission.reason;
        const row = {
            id: key,
            permission: React.createElement(React.Fragment, null, React.createElement(Badge, {
                label: permission.badge ?? permission.scope ?? "Permission",
                tone: permission.tone ?? "neutral",
                variant: "status",
                density,
                state: isDisabled || permission.disabled ? "disabled" : "default",
            }), permission.label, disabledReason
                ? React.createElement(Tooltip, {
                    triggerLabel: `${permission.label} reason`,
                    content: disabledReason,
                    variant: "disabled-help",
                    density,
                    state: permission.disabled ? "disabled" : "default",
                })
                : null),
        };
        for (const role of normalizedRoles) {
            const keyForRole = roleKey(role);
            const roleValues = values[keyForRole] ?? {};
            const checked = Boolean(roleValues[key]);
            const controlDisabled = isDisabled || role.disabled || permission.disabled;
            row[keyForRole] = cellControl({
                mode,
                checked,
                disabled: controlDisabled,
                density,
                role,
                permission,
                onPermissionChange,
            });
        }
        return row;
    });
    if (!normalizedRoles.length || !normalizedPermissions.length)
        return null;
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "saving" ? "true" : undefined,
        "data-flow-pattern": "roles-and-permissions",
        "data-state": resolvedState,
        "data-density": density,
        "data-role-count": String(normalizedRoles.length),
        "data-permission-count": String(normalizedPermissions.length),
        ...sanitizeRestProps(rest),
    }, React.createElement(Table, {
        label,
        columns,
        rows,
        rowKey: "id",
        variant: "selectable",
        state: resolvedState === "dirty" ? "selected" : "default",
        density,
        "aria-description": description,
    }), validation?.message
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            message: validation.message,
            state: validation.state ?? (resolvedState === "error" ? "error" : "warning"),
            density,
            live: validation.live,
        })
        : null, audit?.label
        ? React.createElement(AuditEvent, {
            label: audit.label,
            description: audit.description,
            meta: audit.meta,
            status: audit.status,
            icon: audit.icon,
            tone: audit.tone ?? "info",
            state: audit.state ?? "default",
            density,
            timestamp: audit.timestamp,
        })
        : null, confirmation?.label
        ? React.createElement(Dialog, {
            label: confirmation.label,
            description: confirmation.description,
            open: confirmation.open,
            tone: confirmation.tone ?? "danger",
            variant: confirmation.variant ?? "confirmation",
            state: confirmation.open ? "open" : "closed",
            density,
            actions: confirmation.actions,
            onOpenChange: confirmation.onOpenChange,
            onAction: confirmation.onAction,
        })
        : null, actions.filter((action) => action?.label).map((action) => React.createElement(Button, {
        ...action,
        key: action.key ?? action.label,
        label: action.label,
        variant: action.variant ?? "secondary",
        density: action.density ?? density,
        disabled: isDisabled || action.disabled,
        loading: saving || action.loading,
        onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onAction?.(actionKey(action), event);
        },
    })), feedback?.label
        ? React.createElement(Toast, {
            label: feedback.label,
            description: feedback.description,
            tone: feedback.tone ?? (resolvedState === "saved" ? "success" : resolvedState === "error" ? "danger" : "info"),
            variant: feedback.variant ?? "status",
            state: feedback.state ?? "visible",
            density,
            actionLabel: feedback.actionLabel,
            dismissible: feedback.dismissible,
            dismissLabel: feedback.dismissLabel,
            onAction: feedback.onAction,
            onDismiss: feedback.onDismiss,
        })
        : null);
});
RolesAndPermissions.displayName = "RolesAndPermissions";
