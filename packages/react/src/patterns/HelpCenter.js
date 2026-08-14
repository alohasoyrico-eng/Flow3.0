/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Accordion } from "../Accordion.js";
import { Drawer } from "../Drawer.js";
import { EmptyState } from "../EmptyState.js";
import { Input } from "../Input.js";
import { Surface } from "../Surface.js";
import { Tag } from "../Tag.js";
import { Search } from "./Search.js";
import { Sidebar } from "./Sidebar.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeTopics(topics) {
    return (Array.isArray(topics) ? topics : []).filter((topic) => topic?.key && topic?.label);
}
function normalizeArticles(articles) {
    return (Array.isArray(articles) ? articles : []).filter((article) => article?.id && article?.title);
}
function resolveState({ disabled, loading, error, empty, selectedTopicKey, results, open, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (empty || state === "empty")
        return "empty";
    if (selectedTopicKey || state === "topic-selected")
        return "topic-selected";
    if (results || state === "results")
        return "results";
    if (open || state === "open")
        return "open";
    return state ?? "closed";
}
function topicTone(topic, selected) {
    if (topic.tone)
        return topic.tone;
    if (selected)
        return "info";
    return "neutral";
}
export const HelpCenter = forwardRef(function HelpCenter({ label = "Help center", description, density, state, open = false, loading = false, empty = false, error = false, disabled = false, query = "", search, sidebar, topics = [], articles = [], selectedTopicKey, topicInput, recovery, drawer, className = "", onQueryChange, onTopicSelect, onDrawerOpenChange, onRecoveryAction, onRouteSelect, ...rest }, ref) {
    const normalizedTopics = normalizeTopics(topics);
    const normalizedArticles = normalizeArticles(articles);
    const resolvedState = resolveState({
        disabled,
        loading,
        error,
        empty: empty || (!loading && !error && normalizedArticles.length === 0),
        selectedTopicKey,
        results: normalizedArticles.length > 0,
        open,
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled";
    const showRecovery = resolvedState === "empty" || resolvedState === "error" || resolvedState === "loading";
    const selectedTopic = normalizedTopics.find((topic) => topic.key === selectedTopicKey);
    return React.createElement("div", {
        ref,
        className,
        role: "region",
        "aria-label": label,
        "aria-busy": loading ? "true" : undefined,
        "data-flow-pattern": "help-center",
        "data-state": resolvedState,
        "data-density": density,
        "data-topic-count": String(normalizedTopics.length),
        "data-article-count": String(normalizedArticles.length),
        "data-search-boundary": "true",
        "data-sidebar-boundary": "true",
        ...sanitizeRestProps(rest),
    }, React.createElement(Drawer, {
        label,
        description,
        triggerLabel: drawer?.triggerLabel ?? "Open help",
        closeLabel: drawer?.closeLabel ?? "Close help",
        variant: drawer?.variant ?? "side-sheet",
        state: resolvedState === "closed" ? "closed" : "open",
        open: resolvedState !== "closed" && open !== false,
        density,
        side: drawer?.side ?? "right",
        content: [
            { type: "text", key: "description", copy: description ?? selectedTopic?.label ?? "Support content" },
            { type: "badge", key: "status", label: loading ? "Loading" : `${normalizedArticles.length} answers`, tone: error ? "danger" : "info", live: true },
        ],
        fields: topicInput ? [{
                label: topicInput.label ?? "Topic filter",
                name: topicInput.name ?? "topic-filter",
                value: topicInput.value ?? query,
                helper: topicInput.helper,
                state: isDisabled ? "disabled" : topicInput.state,
                readOnly: topicInput.readOnly ?? true,
            }] : undefined,
        actions: drawer?.actions,
        onOpenChange: onDrawerOpenChange,
        "data-help-center-drawer": "true",
    }), React.createElement(Surface, {
        surfaceRole: "section",
        state: isDisabled ? "disabled" : "default",
        density,
        "data-help-center-surface": "true",
    }, React.createElement(Search, {
        label: search?.label ?? `${label} search`,
        query: search?.query ?? query,
        helper: search?.helper,
        placeholder: search?.placeholder ?? "Search help",
        density: search?.density ?? density,
        state: isDisabled ? "disabled" : loading ? "loading" : normalizedArticles.length ? "results" : "idle",
        disabled: isDisabled || search?.disabled,
        loading,
        results: search?.results ?? normalizedArticles.map((article) => ({
            key: article.id,
            label: article.title,
            meta: article.topic,
            value: article.summary,
        })),
        empty: search?.empty,
        submitAction: search?.submitAction,
        clearAction: search?.clearAction,
        onQueryChange: (value, meta, event) => {
            search?.onQueryChange?.(value, meta, event);
            if (event.defaultPrevented)
                return;
            onQueryChange?.(value, meta, event);
        },
        onResultSelect: search?.onResultSelect,
    }), React.createElement(Sidebar, {
        label: sidebar?.label ?? `${label} topics`,
        density: sidebar?.density ?? density,
        state: isDisabled ? "disabled" : "expanded",
        groups: sidebar?.groups ?? [{
                title: "Help topics",
                open: true,
                routes: normalizedTopics.map((topic) => ({
                    key: topic.key,
                    label: topic.label,
                    active: topic.key === selectedTopicKey,
                    badge: topic.count === undefined ? undefined : String(topic.count),
                })),
            }],
        activeKey: sidebar?.activeKey ?? selectedTopicKey,
        onRouteSelect: (key, route, event) => {
            sidebar?.onRouteSelect?.(key, route, event);
            if (event.defaultPrevented)
                return;
            onRouteSelect?.(key, route, event);
        },
    }), React.createElement(Input, {
        label: topicInput?.label ?? "Topic filter",
        value: topicInput?.value ?? query,
        placeholder: topicInput?.placeholder ?? "Filter topics",
        helper: topicInput?.helper,
        variant: topicInput?.variant ?? "search",
        density: topicInput?.density ?? density,
        state: isDisabled ? "disabled" : topicInput?.state ?? "default",
        disabled: isDisabled || topicInput?.disabled,
        readOnly: topicInput?.readOnly ?? true,
    }), normalizedTopics.map((topic) => React.createElement(Tag, {
        ...topic,
        key: topic.key,
        label: topic.label,
        density: topic.density ?? density,
        variant: topic.variant ?? "metadata",
        tone: topicTone(topic, topic.key === selectedTopicKey),
        state: isDisabled || topic.disabled ? "disabled" : topic.key === selectedTopicKey ? "pressed" : topic.state ?? "default",
        interactive: Boolean(onTopicSelect || topic.onClick),
        onClick: (event) => {
            topic.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onTopicSelect?.(topic.key, topic, event);
        },
    })), showRecovery
        ? React.createElement(EmptyState, {
            title: recovery?.title ?? (error ? `${label} unavailable` : loading ? `${label} loading` : "No help articles"),
            description: recovery?.description ?? description,
            icon: recovery?.icon ?? (error ? "error" : loading ? "progress_activity" : "help"),
            action: recovery?.action,
            variant: recovery?.variant ?? (error ? "error" : loading ? "loading" : "search-empty"),
            state: recovery?.state ?? (error ? "error" : loading ? "loading" : "search-empty"),
            density,
            fullWidth: true,
            onAction: (key, event) => {
                recovery?.onAction?.(key, event);
                if (event.defaultPrevented)
                    return;
                onRecoveryAction?.(key, event);
            },
        })
        : null, normalizedArticles.length && !showRecovery
        ? React.createElement(Accordion, {
            items: normalizedArticles.map((article) => ({
                id: article.id,
                title: article.title,
                content: article.content ?? article.summary ?? "",
                open: article.open ?? article.id === selectedTopicKey,
                icon: article.icon ?? "help",
                ...(article.topic ? { meta: article.topic } : {}),
            })),
            multiple: true,
            density,
            expandedIds: normalizedArticles.filter((article) => article.open).map((article) => article.id),
        })
        : null));
});
HelpCenter.displayName = "HelpCenter";
