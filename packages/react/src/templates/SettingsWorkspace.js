/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useState } from "react";
import { Surface } from "../Surface.js";
import { Tabs } from "../Tabs.js";
import { PreferenceManagement } from "../patterns/PreferenceManagement.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, dirty, saving, dangerConfirming, state, }) {
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
    if (dangerConfirming || state === "danger-confirming")
        return "danger-confirming";
    if (saving || state === "saving")
        return "saving";
    if (dirty || state === "dirty")
        return "dirty";
    return state ?? "loaded";
}
function surfaceStateForTemplate(state) {
    if (state === "disabled" || state === "permission")
        return "disabled";
    if (state === "error" || state === "offline" || state === "danger-confirming")
        return "raised";
    if (state === "loading" || state === "saving")
        return "sunken";
    if (state === "dirty")
        return "selected";
    return "default";
}
function preferenceStateForTemplate(state) {
    if (state === "disabled")
        return "disabled";
    if (state === "permission")
        return "permission-blocked";
    if (state === "loading" || state === "saving")
        return "saving";
    if (state === "error" || state === "offline")
        return "invalid";
    if (state === "danger-confirming")
        return "danger-confirming";
    if (state === "dirty")
        return "dirty";
    return undefined;
}
const defaultSections = [
    { key: "profile", label: "Profile", icon: "person" },
    { key: "notifications", label: "Notifications", icon: "notifications" },
    { key: "theme", label: "Theme", icon: "contrast" },
    { key: "danger", label: "Danger zone", icon: "warning", badge: { label: "!", tone: "danger" } },
];
const defaultSettingsGroups = [
    {
        key: "profile",
        title: "Profile preferences",
        description: "Identity and workspace defaults.",
        controls: [
            { key: "display-name", label: "Display name", value: "Ana Gomez" },
            { key: "language", kind: "select", label: "Language", value: "es", options: [{ value: "es", label: "Spanish" }, { value: "en", label: "English" }] },
        ],
    },
    {
        key: "notifications",
        title: "Notification preferences",
        description: "Operational alerts and delivery channels.",
        controls: [
            { key: "push", kind: "switch", label: "Push notifications", checked: true },
            { key: "weekly-summary", kind: "switch", label: "Weekly summary", checked: false },
        ],
    },
    {
        key: "theme",
        title: "Theme preferences",
        description: "Theme mode stays inside the Flow theme contract.",
        controls: [
            { key: "mode", kind: "select", label: "Mode", value: "system", options: [{ value: "system", label: "System" }, { value: "light", label: "Light" }, { value: "dark", label: "Dark" }] },
        ],
    },
];
const defaultFormSections = [
    {
        key: "security",
        title: "Security details",
        description: "Recovery contact and account evidence.",
        fields: [
            { key: "recovery-email", label: "Recovery email", value: "ana@example.com" },
        ],
        primaryAction: { key: "verify", label: "Verify" },
    },
];
const defaultDangerZone = {
    label: "Delete workspace data",
    description: "This action requires confirmation and cannot be represented as a local button.",
    triggerLabel: "Open danger zone",
    closeLabel: "Close danger zone",
    destructive: true,
    confirm: { key: "delete", label: "Delete data" },
    cancel: { key: "cancel", label: "Cancel" },
};
export const SettingsWorkspace = forwardRef(function SettingsWorkspace({ label = "Settings workspace", description = "Manage profile, notification, theme, and danger-zone preferences.", density = "md", tone, state, disabled = false, loading = false, error = false, permissionBlocked = false, offline = false, dirty = false, saving = false, dangerConfirming = false, selectedSection, defaultSelectedSection = "profile", onSelectedSectionChange, sections = defaultSections, preferences, className = "", ...rest }, ref) {
    const [internalSelectedSection, setInternalSelectedSection] = useState(defaultSelectedSection);
    const resolvedSelectedSection = selectedSection ?? internalSelectedSection;
    const resolvedState = resolveTemplateState({ disabled, loading, error, permissionBlocked, offline, dirty, saving, dangerConfirming, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const isBusy = loading || saving || resolvedState === "loading" || resolvedState === "saving";
    const preferenceState = preferenceStateForTemplate(resolvedState);
    const tabItems = (Array.isArray(sections) ? sections : defaultSections).filter((section) => section?.label);
    const handleSectionSelect = (key, event) => {
        const section = tabItems.find((item) => item.key === key || item.value === key);
        if (!section || event.defaultPrevented || isDisabled)
            return;
        if (selectedSection === undefined)
            setInternalSelectedSection(key);
        onSelectedSectionChange?.(key, section, event);
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
        "data-flow-template": "settings-workspace",
        "data-template-state": resolvedState,
        "data-state": resolvedState,
        "data-density": density,
        "data-selected-section": resolvedSelectedSection,
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "raised",
        "data-template-slot": "settings-navigation",
    }, React.createElement(Tabs, {
        label: `${label} sections`,
        items: tabItems.map((item) => ({
            ...item,
            key: item.key ?? item.value,
            disabled: isDisabled || item.disabled,
            "data-template-section": item.key ?? item.value,
        })),
        selectedKey: resolvedSelectedSection,
        variant: "underline",
        density,
        onValueChange: handleSectionSelect,
        "data-template-module": "section-navigation",
    })), React.createElement(Surface, {
        surfaceRole: "section",
        state: surfaceStateForTemplate(resolvedState),
        density,
        elevation: "none",
        "data-template-slot": "settings-workspace",
    }, React.createElement(PreferenceManagement, {
        ...(preferences ?? {}),
        label: preferences?.label ?? "Preference management",
        description: preferences?.description ?? description,
        density: preferences?.density ?? density,
        state: preferences?.state ?? preferenceState,
        dirty: preferences?.dirty ?? dirty,
        saving: preferences?.saving ?? (saving || isBusy),
        disabled: isDisabled || preferences?.disabled,
        permissionBlocked: resolvedState === "permission" || preferences?.permissionBlocked,
        summary: preferences?.summary ?? { label: resolvedState === "dirty" ? "Unsaved changes" : "Preferences" },
        settings: preferences?.settings ?? {
            label: "Workspace preferences",
            groups: defaultSettingsGroups,
            dirty,
            saveAction: { label: "Save preferences" },
            resetAction: { label: "Reset" },
        },
        sections: preferences?.sections ?? defaultFormSections,
        dangerZone: preferences?.dangerZone ?? {
            ...defaultDangerZone,
            open: resolvedState === "danger-confirming",
        },
        "data-template-module": "preference-management",
    })));
});
SettingsWorkspace.displayName = "SettingsWorkspace";
