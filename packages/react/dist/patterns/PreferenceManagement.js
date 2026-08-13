import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { ConfirmationDialog } from "./ConfirmationDialog.js";
import { FormSection } from "./FormSection.js";
import { Settings } from "./Settings.js";
const validStates = new Set(["idle", "dirty", "saving", "saved", "invalid", "danger-confirming", "permission-blocked", "disabled"]);
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}
function normalizeState({ state, disabled, permissionBlocked, saving, dirty, dangerZone, sections, settings, }) {
    if (disabled)
        return "disabled";
    if (permissionBlocked || settings?.permissionBlocked)
        return "permission-blocked";
    if (dangerZone?.open || state === "danger-confirming")
        return "danger-confirming";
    if (saving || settings?.saving || sections.some((section) => section.loading || section.state === "saving"))
        return "saving";
    if (state === "invalid" || settings?.state === "invalid" || sections.some((section) => section.state === "invalid"))
        return "invalid";
    if (state && validStates.has(state))
        return state;
    if (dirty || settings?.dirty || sections.some((section) => section.state === "dirty"))
        return "dirty";
    return "idle";
}
function surfaceStateFor(state) {
    if (state === "disabled" || state === "permission-blocked")
        return "disabled";
    if (state === "invalid" || state === "danger-confirming")
        return "selected";
    if (state === "saving")
        return "raised";
    return "default";
}
function badgeToneFor(state) {
    if (state === "invalid" || state === "danger-confirming")
        return "danger";
    if (state === "dirty" || state === "permission-blocked")
        return "warning";
    if (state === "saved")
        return "success";
    return "neutral";
}
function badgeStateFor(state) {
    return state === "disabled" || state === "permission-blocked" ? "disabled" : "default";
}
export const PreferenceManagement = forwardRef(function PreferenceManagement({ label = "Preference management", description, density = "md", state, dirty = false, saving = false, disabled = false, permissionBlocked = false, summary, settings, sections = [], dangerZone, className = "", onSettingsControlChange, onSettingsSave, onSettingsReset, onSectionFieldValueChange, onSectionAction, onDangerOpenChange, onDangerConfirm, onDangerCancel, onDangerRecoveryAction, ...rest }, ref) {
    const normalizedSections = normalizeArray(sections).filter((section) => Boolean(section?.title));
    const resolvedState = normalizeState({ state, disabled, permissionBlocked, saving, dirty, dangerZone, sections: normalizedSections, settings });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
    const settingsGroups = normalizeArray(settings?.groups);
    const controlCount = settingsGroups.reduce((total, group) => total + normalizeArray(group.controls).length, 0);
    const sectionFieldCount = normalizedSections.reduce((total, section) => total + normalizeArray(section.fields).length, 0);
    return React.createElement(Surface, {
        ref,
        className,
        surfaceRole: "section",
        state: surfaceStateFor(resolvedState),
        density,
        elevation: "none",
        focusMode: "within",
        role: "group",
        "aria-label": label,
        "aria-description": description,
        "aria-busy": resolvedState === "saving" ? "true" : undefined,
        "data-flow-pattern": "preference-management",
        "data-flow-slot": "preferenceSurface",
        "data-preference-state": resolvedState,
        "data-density": density,
        "data-settings-group-count": String(settingsGroups.length),
        "data-form-section-count": String(normalizedSections.length),
        "data-control-count": String(controlCount + sectionFieldCount),
        ...sanitizeRestProps(rest),
    }, summary?.label
        ? React.createElement(Badge, {
            label: summary.label,
            tone: summary.tone ?? badgeToneFor(resolvedState),
            state: summary.state ?? badgeStateFor(resolvedState),
            density: summary.density ?? density,
            "data-flow-slot": "preferenceSummary",
        })
        : null, settings
        ? React.createElement(Settings, {
            ...settings,
            label: settings.label ?? label,
            description: settings.description ?? description,
            density: settings.density ?? density,
            state: settings.state ?? (resolvedState === "danger-confirming" ? "dirty" : resolvedState),
            dirty: settings.dirty ?? dirty,
            saving: settings.saving ?? saving,
            disabled: isDisabled || settings.disabled,
            permissionBlocked: permissionBlocked || settings.permissionBlocked,
            onControlChange: (key, value, meta, event) => {
                settings.onControlChange?.(key, value, meta, event);
                if (event.defaultPrevented)
                    return;
                onSettingsControlChange?.(key, value, meta, event);
            },
            onSave: (event) => {
                settings.onSave?.(event);
                if (event.defaultPrevented)
                    return;
                onSettingsSave?.(event);
            },
            onReset: (event) => {
                settings.onReset?.(event);
                if (event.defaultPrevented)
                    return;
                onSettingsReset?.(event);
            },
            "data-flow-slot": "settingsBoundary",
            "data-flow-pattern-boundary": "settings",
        })
        : null, normalizedSections.map((section) => {
        const key = String(section.key ?? section.title);
        return React.createElement(FormSection, {
            ...section,
            key,
            density: section.density ?? density,
            disabled: isDisabled || section.disabled,
            onFieldValueChange: (fieldKey, value, meta, event) => {
                section.onFieldValueChange?.(fieldKey, value, meta, event);
                if (event.defaultPrevented)
                    return;
                onSectionFieldValueChange?.(key, fieldKey, value, meta, event);
            },
            onAction: (actionKey, event) => {
                section.onAction?.(actionKey, event);
                if (event.defaultPrevented)
                    return;
                onSectionAction?.(key, actionKey, event);
            },
            "data-flow-slot": "preferenceBlocks",
            "data-flow-pattern-boundary": "form-section",
            "data-preference-section": key,
        });
    }), dangerZone?.label
        ? React.createElement(ConfirmationDialog, {
            ...dangerZone,
            density: dangerZone.density ?? density,
            destructive: dangerZone.destructive ?? true,
            disabled: isDisabled || dangerZone.disabled,
            state: dangerZone.state ?? (dangerZone.open ? "open" : "closed"),
            onOpenChange: (open, event) => {
                dangerZone.onOpenChange?.(open, event);
                onDangerOpenChange?.(open, event);
            },
            onConfirm: (event) => {
                dangerZone.onConfirm?.(event);
                if (event.defaultPrevented)
                    return;
                onDangerConfirm?.(event);
            },
            onCancel: (event) => {
                dangerZone.onCancel?.(event);
                if (event.defaultPrevented)
                    return;
                onDangerCancel?.(event);
            },
            onRecoveryAction: (key, event) => {
                dangerZone.onRecoveryAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onDangerRecoveryAction?.(key, event);
            },
            "data-flow-slot": "dangerConfirmation",
            "data-flow-pattern-boundary": "confirmation-dialog",
        })
        : null);
});
PreferenceManagement.displayName = "PreferenceManagement";
