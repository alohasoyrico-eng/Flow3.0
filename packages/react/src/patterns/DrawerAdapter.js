import React, { forwardRef, } from "react";
import { Button } from "../Button.js";
import { Card } from "../Card.js";
import { Dialog } from "../Dialog.js";
import { Drawer } from "../Drawer.js";
import { List } from "../List.js";
import { Menu } from "../Menu.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
import { Sidebar } from "./Sidebar.js";
import { Topbar } from "./Topbar.js";
import { MultiStepForm } from "./MultiStepForm.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ open, modal, nonModal, responsive, loading, error, disabled, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (responsive || state === "responsive")
        return "responsive";
    if (modal || state === "modal")
        return "modal";
    if (nonModal || state === "non-modal")
        return "non-modal";
    if (open || state === "open")
        return "open";
    return state ?? "closed";
}
function itemKey(item, index) {
    return item.key ?? item.id ?? `${item.label}-${index}`;
}
function cardKey(card, index) {
    return card.key ?? (typeof card.title === "string" ? card.title : undefined) ?? `card-${index}`;
}
export const DrawerAdapter = forwardRef(function DrawerAdapter({ label = "Drawer adapter", description, density, state, open = false, modal = false, nonModal = false, responsive = false, loading = false, disabled = false, error, drawer, dialog, content, list, cards = [], menu, actions = [], feedback, topbar, sidebar, multiStepForm, className = "", onOpenChange, onAction, ...rest }, ref) {
    const normalizedCards = (Array.isArray(cards) ? cards : []).filter((card) => Boolean(card?.title));
    const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => Boolean(action?.label));
    const listItems = (Array.isArray(list?.items) ? list.items : []).filter((item) => Boolean(item?.label));
    const resolvedState = resolveState({
        open,
        modal,
        nonModal,
        responsive,
        loading,
        error: Boolean(error || feedback?.tone === "danger"),
        disabled,
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";
    const isModal = modal || resolvedState === "modal";
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "drawer-adapter",
        "data-state": resolvedState,
        "data-density": density,
        "data-card-count": String(normalizedCards.length),
        "data-list-count": String(listItems.length),
        "data-multi-step-form-boundary": multiStepForm ? "true" : "false",
        ...sanitizeRestProps(rest),
    }, topbar
        ? React.createElement(Topbar, {
            ...topbar,
            density: topbar.density ?? density,
            sidebar: topbar.sidebar ?? sidebar,
        })
        : null, sidebar
        ? React.createElement(Sidebar, {
            ...sidebar,
            density: sidebar.density ?? density,
            drawerOpen: sidebar.drawerOpen ?? open,
            onDrawerOpenChange: sidebar.onDrawerOpenChange ?? onOpenChange,
        })
        : null, React.createElement(Drawer, {
        label,
        description,
        triggerLabel: drawer?.triggerLabel ?? "Open drawer",
        closeLabel: drawer?.closeLabel ?? "Close drawer",
        variant: drawer?.variant ?? (responsive ? "side-sheet" : "detail"),
        state: open ? "open" : "closed",
        tone: error ? "danger" : drawer?.tone ?? "neutral",
        density: drawer?.density ?? density,
        side: drawer?.side ?? "right",
        fields: drawer?.fields,
        content: drawer?.content ?? content?.drawerContent,
        actions: drawer?.actions ?? normalizedActions,
        open,
        onOpenChange: drawer?.onOpenChange ?? onOpenChange,
        onAction: drawer?.onAction ?? onAction,
    }), isModal || dialog
        ? React.createElement(Dialog, {
            label: dialog?.label ?? `${label} modal review`,
            description: dialog?.description ?? description,
            triggerLabel: dialog?.triggerLabel ?? "Review drawer",
            closeLabel: dialog?.closeLabel ?? "Close review",
            open: dialog?.open ?? isModal,
            state: dialog?.open || isModal ? "open" : "closed",
            tone: error ? "danger" : dialog?.tone ?? "neutral",
            variant: dialog?.variant ?? "review",
            density: dialog?.density ?? density,
            actions: dialog?.actions,
            onOpenChange: dialog?.onOpenChange,
            onAction: dialog?.onAction,
        })
        : null, React.createElement(Surface, {
        surfaceRole: "panel",
        state: isDisabled ? "disabled" : open ? "raised" : "default",
        density,
        "data-flow-slot": "content",
        "data-responsive": responsive ? "true" : "false",
    }, listItems.length
        ? React.createElement(List, {
            label: list?.label ?? `${label} content`,
            items: listItems.map((item, index) => ({
                ...item,
                key: itemKey(item, index),
                disabled: Boolean(isDisabled || item.disabled),
            })),
            variant: list?.variant ?? "standard",
            interactive: list?.interactive ?? true,
            selectedKey: list?.selectedKey,
            density: list?.density ?? density,
            state: isDisabled ? "disabled" : list?.state ?? "default",
            onSelect: list?.onSelect,
        })
        : null, normalizedCards.map((card, index) => React.createElement(Card, {
        ...card,
        key: cardKey(card, index),
        density: card.density ?? density,
        state: isDisabled ? "disabled" : card.state ?? "default",
        fullWidth: card.fullWidth ?? true,
    })), menu?.items?.length
        ? React.createElement(Menu, {
            triggerLabel: menu.triggerLabel ?? "Drawer options",
            label: menu.label ?? `${label} menu`,
            items: menu.items,
            open: menu.open,
            variant: menu.variant ?? "actions",
            density: menu.density ?? density,
            state: isDisabled ? "disabled" : menu.open ? "open" : "closed",
            align: menu.align ?? "end",
            disabled: isDisabled || menu.disabled,
            onOpenChange: menu.onOpenChange,
            onSelect: menu.onSelect,
        })
        : null, normalizedActions.map((action) => React.createElement(Button, {
        ...action,
        key: action.key ?? action.label,
        label: action.label,
        variant: action.variant ?? "secondary",
        density: action.density ?? density,
        disabled: isDisabled || action.disabled,
        loading: resolvedState === "loading" || action.loading,
        onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onAction?.(action.key ?? action.label ?? "", event);
        },
    })), multiStepForm
        ? React.createElement(MultiStepForm, {
            ...multiStepForm,
            density: multiStepForm.density ?? density,
            "data-flow-pattern-boundary": "multi-step-form",
        })
        : null), error
        ? React.createElement(Toast, {
            label: error.label ?? "Drawer unavailable",
            description: error.description,
            tone: "danger",
            variant: "recovery",
            state: "visible",
            density,
            actionLabel: error.actionLabel,
            dismissible: error.dismissible ?? true,
            onAction: error.onAction,
            onDismiss: error.onDismiss,
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            density: feedback.density ?? density,
            state: feedback.state ?? "visible",
        })
        : null);
});
DrawerAdapter.displayName = "DrawerAdapter";
