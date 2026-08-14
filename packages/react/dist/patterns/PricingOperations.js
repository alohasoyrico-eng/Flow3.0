import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { AdvancedFilters } from "./AdvancedFilters.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import { RolesAndPermissions } from "./RolesAndPermissions.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import { VirtualDataTable } from "./VirtualDataTable.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
}
function resolveState({ disabled, loading, error, submitting, selectedRuleKey, editorOpen, pendingCount, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (submitting || state === "submitting")
        return "submitting";
    if (editorOpen || state === "editing")
        return "editing";
    if (selectedRuleKey || state === "rule-selected")
        return "rule-selected";
    if (pendingCount > 0 || state === "pending-approval")
        return "pending-approval";
    return state ?? "default";
}
function surfaceStateFor(resolvedState) {
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "error")
        return "critical";
    if (resolvedState === "loading")
        return "sunken";
    if (resolvedState === "editing" || resolvedState === "rule-selected" || resolvedState === "pending-approval" || resolvedState === "submitting")
        return "selected";
    return "default";
}
function summaryTone(summary, resolvedState) {
    if (summary?.tone)
        return summary.tone;
    if (resolvedState === "error")
        return "danger";
    if (resolvedState === "pending-approval" || resolvedState === "submitting")
        return "warning";
    if (resolvedState === "editing" || resolvedState === "rule-selected")
        return "info";
    return "neutral";
}
function ruleKey(rule) {
    return String(rule.key ?? rule.id ?? rule.name);
}
function normalizeRuleRows(rules) {
    return rules.map((rule) => ({
        id: ruleKey(rule),
        name: rule.name,
        scope: rule.scope,
        type: rule.type,
        value: rule.value,
        status: rule.status,
        owner: rule.owner ?? rule.by,
    }));
}
function defaultColumns() {
    return [
        { key: "id", label: "ID" },
        { key: "name", label: "Rule", priority: "primary" },
        { key: "scope", label: "Scope" },
        { key: "type", label: "Type" },
        { key: "value", label: "Value", align: "right" },
        { key: "status", label: "Status" },
        { key: "owner", label: "Updated by" },
    ];
}
function isPricingOperationsRule(rule) {
    return Boolean(rule?.name);
}
function isPricingOperationsSummary(summary) {
    return Boolean(summary?.label);
}
export const PricingOperations = forwardRef(function PricingOperations({ label = "Pricing operations", description, density = "sm", state, disabled = false, loading = false, submitting = false, error, selectedRuleKey, editorOpen = false, summaries = [], rules = [], queue = {}, editor, rolePolicy, feedback, className = "", onRuleFiltersReset, onRuleSortChange, onRuleSelect, onRulePageChange, onRuleBulkAction, onRuleSubmitForApproval, onEditorOpenChange, onEditorAction, onPermissionChange, onPermissionAction, onFeedbackAction, ...rest }, ref) {
    const normalizedRules = normalizeArray(rules).filter(isPricingOperationsRule);
    const normalizedSummaries = normalizeArray(summaries).filter(isPricingOperationsSummary);
    const pendingCount = normalizedRules.filter((rule) => String(rule.status ?? "").toLowerCase().includes("pending")).length;
    const rows = queue.table?.rows ?? normalizeRuleRows(normalizedRules);
    const resolvedEditor = editor ?? queue.editor;
    const resolvedState = resolveState({ disabled, loading, error, submitting, selectedRuleKey, editorOpen, pendingCount, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const isLoading = loading || resolvedState === "loading" || submitting;
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
        "aria-busy": isLoading ? "true" : undefined,
        "data-flow-pattern": "pricing-operations",
        "data-flow-slot": "pricingOperationsSurface",
        "data-pricing-operations-state": resolvedState,
        "data-density": density,
        "data-rule-count": String(normalizedRules.length || rows.length),
        "data-pending-rule-count": String(pendingCount),
        "data-editor-open": String(Boolean(editorOpen)),
        ...sanitizeRestProps(rest),
    }, description
        ? React.createElement(Badge, {
            label: description,
            tone: summaryTone(undefined, resolvedState),
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            "data-flow-slot": "pricingSummary",
        })
        : null, normalizedSummaries.map((summary) => React.createElement(Badge, {
        ...summary,
        key: summary.key ?? summary.label,
        label: summary.label,
        tone: summaryTone(summary, resolvedState),
        variant: summary.variant ?? "status",
        density: summary.density ?? density,
        state: isDisabled ? "disabled" : summary.state ?? "default",
        live: summary.live ?? true,
        "data-flow-slot": "pricingMetric",
    })), rolePolicy
        ? React.createElement(RolesAndPermissions, {
            ...rolePolicy,
            label: rolePolicy.label ?? `${label} access`,
            description: rolePolicy.description,
            density: rolePolicy.density ?? density,
            state: rolePolicy.state ?? (isDisabled ? "permission-blocked" : submitting ? "saving" : "read-only"),
            disabled: isDisabled || rolePolicy.disabled,
            saving: submitting || rolePolicy.saving,
            onPermissionChange: (roleKeyValue, permissionKey, checked, meta, event) => {
                rolePolicy.onPermissionChange?.(roleKeyValue, permissionKey, checked, meta, event);
                if (event.defaultPrevented)
                    return;
                onPermissionChange?.(roleKeyValue, permissionKey, checked, meta, event);
            },
            onAction: (key, event) => {
                rolePolicy.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onPermissionAction?.(key, event);
            },
            "data-flow-pattern-boundary": "roles-and-permissions",
            "data-flow-slot": "pricingPermissionBoundary",
        })
        : null, queue.filters
        ? React.createElement(AdvancedFilters, {
            ...queue.filters,
            label: queue.filters.label ?? `${label} filters`,
            density: queue.filters.density ?? density,
            disabled: isDisabled || queue.filters.disabled,
            applying: isLoading || queue.filters.applying,
            resetAction: queue.filters.resetAction
                ? {
                    ...queue.filters.resetAction,
                    onClick: (event) => {
                        queue.filters?.resetAction?.onClick?.(event);
                        if (event.defaultPrevented)
                            return;
                        onRuleFiltersReset?.(event);
                    },
                }
                : queue.filters.resetAction,
            "data-flow-pattern-boundary": "advanced-filters",
            "data-flow-slot": "pricingFiltersBoundary",
        })
        : null, React.createElement(VirtualDataTable, {
        ...queue,
        ...queue.table,
        label: queue.table?.label ?? queue.label ?? `${label} queue`,
        description: queue.table?.description ?? queue.description,
        density: queue.table?.density ?? queue.density ?? density,
        state: queue.table?.state ?? queue.state ?? (editorOpen ? "editing" : selectedRuleKey ? "selected" : resolvedState),
        disabled: isDisabled || queue.disabled || queue.table?.disabled,
        loading: isLoading || queue.loading || queue.table?.loading,
        error: queue.table?.error ?? queue.error ?? error,
        columns: queue.table?.columns ?? queue.columns ?? defaultColumns(),
        rows,
        rowKey: queue.table?.rowKey ?? queue.rowKey ?? "id",
        selectedKey: queue.table?.selectedKey ?? queue.selectedKey ?? selectedRuleKey,
        sortKey: queue.table?.sortKey ?? queue.sortKey,
        sortDir: queue.table?.sortDir ?? queue.sortDir,
        page: queue.table?.page ?? queue.page,
        pageCount: queue.table?.pageCount ?? queue.pageCount,
        pagination: queue.table?.pagination ?? queue.pagination,
        empty: queue.table?.empty ?? queue.empty,
        selection: queue.table?.selection ?? queue.selection ?? { enabled: Boolean(onRuleSelect) || Boolean(selectedRuleKey) },
        bulkActions: queue.table?.bulkActions ?? queue.bulkActions ?? [{ key: "submit-approval", label: "Submit for approval" }],
        virtualized: queue.table?.virtualized ?? queue.virtualized ?? false,
        onSortChange: (sort, event) => {
            queue.onSortChange?.(sort, event);
            if (event.defaultPrevented)
                return;
            onRuleSortChange?.(sort, event);
        },
        onRowSelect: (key, event) => {
            queue.onRowSelect?.(key, event);
            if (event.defaultPrevented)
                return;
            onRuleSelect?.(key, event);
        },
        onPageChange: (page, event) => {
            queue.onPageChange?.(page, event);
            if (event.defaultPrevented)
                return;
            onRulePageChange?.(page, event);
        },
        onBulkAction: (key, event) => {
            queue.onBulkAction?.(key, event);
            if (event.defaultPrevented)
                return;
            onRuleBulkAction?.(key, event);
            if (key === "submit-approval")
                onRuleSubmitForApproval?.(key, event);
        },
        "data-flow-pattern-boundary": "virtual-data-table",
        "data-flow-slot": "pricingRulesBoundary",
    }), resolvedEditor
        ? React.createElement(DrawerAdapter, {
            ...resolvedEditor,
            label: resolvedEditor.label ?? `${label} editor`,
            density: resolvedEditor.density ?? density,
            open: resolvedEditor.open ?? editorOpen,
            state: resolvedEditor.state ?? (editorOpen ? "open" : "closed"),
            disabled: isDisabled || resolvedEditor.disabled,
            loading: isLoading || resolvedEditor.loading,
            error: resolvedEditor.error ?? error,
            onOpenChange: (open, event) => {
                resolvedEditor.onOpenChange?.(open, event);
                if (event?.defaultPrevented)
                    return;
                onEditorOpenChange?.(open, event);
            },
            onAction: (key, event) => {
                resolvedEditor.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onEditorAction?.(key, event);
                if (key === "submit-approval")
                    onRuleSubmitForApproval?.(key, event);
            },
            "data-flow-pattern-boundary": "drawer-adapter",
            "data-flow-slot": "pricingEditorBoundary",
        })
        : null, feedback
        ? React.createElement(StatusFeedbackView, {
            ...feedback,
            label: feedback.label ?? `${label} status`,
            density: feedback.density ?? density,
            state: feedback.state ?? (error ? "error" : submitting ? "loading" : resolvedState === "pending-approval" ? "warning" : "success"),
            onAction: (key, event) => {
                feedback.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onFeedbackAction?.(key, event);
            },
            "data-flow-pattern-boundary": "status-feedback-view",
            "data-flow-slot": "pricingFeedbackBoundary",
        })
        : null);
});
PricingOperations.displayName = "PricingOperations";
