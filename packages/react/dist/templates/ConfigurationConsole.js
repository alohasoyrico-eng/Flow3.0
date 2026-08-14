import React, { forwardRef, useState } from "react";
import { Surface } from "../Surface.js";
import { AuthenticationLoginBiometricsAndOtp } from "../patterns/AuthenticationLoginBiometricsAndOtp.js";
import { DriverAndVehicleAdministration } from "../patterns/DriverAndVehicleAdministration.js";
import { RolesAndPermissions } from "../patterns/RolesAndPermissions.js";
import { Sidebar } from "../patterns/Sidebar.js";
import { Topbar } from "../patterns/Topbar.js";
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
function patternStateForAdmin(state) {
    if (state === "loading")
        return "loading";
    if (state === "error" || state === "offline")
        return "error";
    if (state === "permission")
        return "permission-blocked";
    if (state === "disabled")
        return "disabled";
    return undefined;
}
function patternStateForRoles(state) {
    if (state === "loading")
        return "saving";
    if (state === "error" || state === "offline")
        return "error";
    if (state === "permission" || state === "disabled")
        return "permission-blocked";
    return undefined;
}
function defaultRoutes(activeKey) {
    return [
        {
            title: "Administration",
            icon: "settings",
            routes: [
                { key: "permissions", label: "Roles and permissions", icon: "shield", active: activeKey === "permissions" },
                { key: "drivers", label: "Drivers", icon: "person", active: activeKey === "drivers" },
                { key: "vehicles", label: "Vehicles", icon: "directions_car", active: activeKey === "vehicles" },
                { key: "audit", label: "Audit trail", icon: "receipt_long", active: activeKey === "audit" },
            ],
        },
    ];
}
const defaultRoles = [
    { key: "admin", label: "Admin" },
    { key: "approver", label: "Approver" },
    { key: "audit-viewer", label: "Audit viewer" },
];
const defaultPermissions = [
    { key: "roles", label: "Manage roles", scope: "Access" },
    { key: "drivers", label: "Approve driver changes", scope: "Lifecycle" },
    { key: "vehicles", label: "Approve vehicle changes", scope: "Lifecycle" },
];
const defaultPermissionValues = {
    admin: { roles: true, drivers: true, vehicles: true },
    approver: { roles: false, drivers: true, vehicles: true },
    "audit-viewer": { roles: false, drivers: false, vehicles: false },
};
const defaultDriverRecords = [
    { key: "drv-001", name: "Alicia Gomez", vehicle: "MX-4821", type: "Driver", status: "active" },
    { key: "drv-002", name: "Rafael Perez", vehicle: "MX-8840", type: "Driver", status: "review" },
];
const defaultVehicleRecords = [
    { key: "veh-001", name: "Unit MX-4821", vehicle: "Truck", type: "Vehicle", status: "ready" },
    { key: "veh-002", name: "Unit MX-8840", vehicle: "Van", type: "Vehicle", status: "review" },
];
export const ConfigurationConsole = forwardRef(function ConfigurationConsole({ label = "Configuration console", description = "Manage roles, drivers, vehicles, and audit evidence.", density = "md", tone, state, disabled = false, loading = false, error = false, permissionBlocked = false, offline = false, selectedModule, defaultSelectedModule = "permissions", onSelectedModuleChange, drawerOpen, defaultDrawerOpen = false, onDrawerOpenChange, topbar, sidebar, rolesAndPermissions, driverAdministration, vehicleAdministration, authentication, auditTrail, className = "", ...rest }, ref) {
    const [internalSelectedModule, setInternalSelectedModule] = useState(defaultSelectedModule);
    const [internalDrawerOpen, setInternalDrawerOpen] = useState(defaultDrawerOpen);
    const resolvedSelectedModule = selectedModule ?? internalSelectedModule;
    const resolvedDrawerOpen = drawerOpen ?? internalDrawerOpen;
    const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const isBusy = resolvedState === "loading";
    const adminState = patternStateForAdmin(resolvedState);
    const rolesState = patternStateForRoles(resolvedState);
    const routes = sidebar?.groups ?? defaultRoutes(resolvedSelectedModule);
    const handleRouteSelect = (key, route, event) => {
        sidebar?.onRouteSelect?.(key, route, event);
        if (event.defaultPrevented)
            return;
        if (selectedModule === undefined)
            setInternalSelectedModule(key);
        onSelectedModuleChange?.(key, route, event);
    };
    const handleDrawerOpenChange = (open, event) => {
        sidebar?.onDrawerOpenChange?.(open, event);
        if (drawerOpen === undefined)
            setInternalDrawerOpen(open);
        onDrawerOpenChange?.(open, event);
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
        "aria-busy": isBusy ? "true" : undefined,
        "data-flow-template": "configuration-console",
        "data-template-state": resolvedState,
        "data-state": resolvedState,
        "data-density": density,
        "data-selected-module": resolvedSelectedModule,
        ...sanitizeRestProps(rest),
    }, React.createElement(Topbar, {
        ...(topbar ?? {}),
        label: topbar?.label ?? label,
        density: topbar?.density ?? density,
        state: topbar?.state ?? (isBusy ? "loading" : resolvedState === "permission" ? "permission-filtered" : undefined),
        loading: isBusy || topbar?.loading,
        disabled: isDisabled || topbar?.disabled,
        permissionFiltered: resolvedState === "permission" || topbar?.permissionFiltered,
        sidebar: {
            ...(sidebar ?? {}),
            groups: routes,
            drawerOpen: resolvedDrawerOpen,
            onDrawerOpenChange: handleDrawerOpenChange,
        },
        navigationAction: topbar?.navigationAction ?? { label: "Open navigation", icon: "menu" },
        "data-template-slot": "global-shell",
    }), React.createElement(Surface, {
        surfaceRole: "section",
        state: resolvedState === "permission" ? "raised" : "default",
        density,
        elevation: "raised",
        "data-template-slot": "navigation-region",
    }, React.createElement(Sidebar, {
        ...(sidebar ?? {}),
        label: sidebar?.label ?? "Configuration navigation",
        density: sidebar?.density ?? density,
        drawer: sidebar?.drawer === false ? false : {
            ...(sidebar?.drawer ?? {}),
            closeLabel: sidebar?.drawer?.closeLabel ?? "Close navigation panel",
            showCloseButton: sidebar?.drawer?.showCloseButton ?? true,
        },
        groups: routes,
        activeKey: resolvedSelectedModule,
        drawerOpen: resolvedDrawerOpen,
        loading: isBusy || sidebar?.loading,
        disabled: isDisabled || sidebar?.disabled,
        permissionFiltered: resolvedState === "permission" || sidebar?.permissionFiltered,
        onRouteSelect: handleRouteSelect,
        onDrawerOpenChange: handleDrawerOpenChange,
    })), React.createElement(Surface, {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        "data-template-slot": "workspace",
    }, React.createElement(RolesAndPermissions, {
        ...(rolesAndPermissions ?? {}),
        label: rolesAndPermissions?.label ?? "Permission matrix",
        description: rolesAndPermissions?.description ?? "Review role capabilities before saving changes.",
        density: rolesAndPermissions?.density ?? density,
        state: rolesAndPermissions?.state ?? rolesState,
        disabled: isDisabled || resolvedState === "permission" || rolesAndPermissions?.disabled,
        saving: isBusy || rolesAndPermissions?.saving,
        roles: rolesAndPermissions?.roles ?? defaultRoles,
        permissions: rolesAndPermissions?.permissions ?? defaultPermissions,
        values: rolesAndPermissions?.values ?? defaultPermissionValues,
        "data-template-module": "permission-matrix",
    }), React.createElement(DriverAndVehicleAdministration, {
        ...(driverAdministration ?? {}),
        label: driverAdministration?.label ?? "Driver lifecycle table",
        description: driverAdministration?.description ?? "Review driver lifecycle status and approvals.",
        density: driverAdministration?.density ?? density,
        state: driverAdministration?.state ?? adminState,
        loading: isBusy || driverAdministration?.loading,
        disabled: isDisabled || driverAdministration?.disabled,
        permissionBlocked: resolvedState === "permission" || driverAdministration?.permissionBlocked,
        error: resolvedState === "error" || resolvedState === "offline" || driverAdministration?.error,
        records: driverAdministration?.records ?? defaultDriverRecords,
        "data-template-module": "driver-lifecycle-table",
    }), React.createElement(DriverAndVehicleAdministration, {
        ...(vehicleAdministration ?? {}),
        label: vehicleAdministration?.label ?? "Vehicle lifecycle table",
        description: vehicleAdministration?.description ?? "Review vehicle lifecycle status and approvals.",
        density: vehicleAdministration?.density ?? density,
        state: vehicleAdministration?.state ?? adminState,
        loading: isBusy || vehicleAdministration?.loading,
        disabled: isDisabled || vehicleAdministration?.disabled,
        permissionBlocked: resolvedState === "permission" || vehicleAdministration?.permissionBlocked,
        error: resolvedState === "error" || resolvedState === "offline" || vehicleAdministration?.error,
        records: vehicleAdministration?.records ?? defaultVehicleRecords,
        "data-template-module": "vehicle-lifecycle-table",
    }), React.createElement(Surface, {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        "data-template-module": "audit-trail",
    }, auditTrail ?? React.createElement("p", null, "Audit trail context is available to approved audit viewers.")), authentication
        ? React.createElement(AuthenticationLoginBiometricsAndOtp, {
            ...authentication,
            label: authentication.label ?? "Authentication gate",
            density: authentication.density ?? density,
            state: authentication.state ?? (resolvedState === "permission" ? "locked" : undefined),
            "data-template-module": "authentication-gate",
        })
        : null));
});
ConfigurationConsole.displayName = "ConfigurationConsole";
