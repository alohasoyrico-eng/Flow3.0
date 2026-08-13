import React, { forwardRef } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Accordion } from "../Accordion.js";
import type { AccordionProps } from "../Accordion.js";
import type { ButtonProps } from "../Button.js";
import { Drawer } from "../Drawer.js";
import type { DrawerProps } from "../Drawer.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { Input } from "../Input.js";
import type { InputProps, InputValueMeta } from "../Input.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Tag } from "../Tag.js";
import type { TagProps, TagTone } from "../Tag.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Search } from "./Search.js";
import type { SearchProps } from "./Search.js";
import { Sidebar } from "./Sidebar.js";
import type { SidebarProps, SidebarRoute } from "./Sidebar.js";

export type HelpCenterState = "closed" | "open" | "loading" | "results" | "empty" | "topic-selected" | "error" | "disabled";
export type HelpCenterDensity = InputProps["density"];

export interface HelpCenterTopic extends Omit<TagProps, "children"> {
  key: string;
  label: string;
  count?: number;
}

export interface HelpCenterArticle extends Omit<AccordionProps["items"][number], "content"> {
  id: string;
  title: string;
  topic?: string;
  summary?: string;
  content?: AccordionProps["items"][number]["content"];
  open?: boolean;
}

export interface HelpCenterProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: HelpCenterDensity;
  state?: HelpCenterState;
  open?: boolean;
  loading?: boolean;
  empty?: boolean;
  error?: boolean;
  disabled?: boolean;
  query?: string;
  search?: Partial<SearchProps>;
  sidebar?: Partial<SidebarProps>;
  topics?: HelpCenterTopic[];
  articles?: HelpCenterArticle[];
  selectedTopicKey?: string;
  topicInput?: Partial<InputProps>;
  recovery?: Partial<EmptyStateProps> & { action?: Partial<ButtonProps> & { label: string } };
  drawer?: Partial<DrawerProps>;
  className?: string;
  onQueryChange?: (value: string, meta: InputValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onTopicSelect?: (key: string, topic: HelpCenterTopic, event: MouseEvent<HTMLButtonElement>) => void;
  onDrawerOpenChange?: DrawerProps["onOpenChange"];
  onRecoveryAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onRouteSelect?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface HelpCenterComponent extends ForwardRefExoticComponent<HelpCenterProps & RefAttributes<HTMLDivElement>> {
  displayName: "HelpCenter";
}

type SafeRootProps = FlowDataAttributes & Record<`aria-${string}`, string | number | boolean | undefined>;

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeTopics(topics: HelpCenterTopic[] | undefined): HelpCenterTopic[] {
  return (Array.isArray(topics) ? topics : []).filter((topic) => topic?.key && topic?.label);
}

function normalizeArticles(articles: HelpCenterArticle[] | undefined): HelpCenterArticle[] {
  return (Array.isArray(articles) ? articles : []).filter((article) => article?.id && article?.title);
}

function resolveState({
  disabled,
  loading,
  error,
  empty,
  selectedTopicKey,
  results,
  open,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  error: boolean;
  empty: boolean;
  selectedTopicKey?: string | undefined;
  results: boolean;
  open: boolean;
  state?: HelpCenterState | undefined;
}): HelpCenterState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (empty || state === "empty") return "empty";
  if (selectedTopicKey || state === "topic-selected") return "topic-selected";
  if (results || state === "results") return "results";
  if (open || state === "open") return "open";
  return state ?? "closed";
}

function topicTone(topic: HelpCenterTopic, selected: boolean): TagTone {
  if (topic.tone) return topic.tone;
  if (selected) return "info";
  return "neutral";
}

export const HelpCenter = forwardRef<HTMLDivElement, HelpCenterProps>(function HelpCenter({
  label = "Help center",
  description,
  density,
  state,
  open = false,
  loading = false,
  empty = false,
  error = false,
  disabled = false,
  query = "",
  search,
  sidebar,
  topics = [],
  articles = [],
  selectedTopicKey,
  topicInput,
  recovery,
  drawer,
  className = "",
  onQueryChange,
  onTopicSelect,
  onDrawerOpenChange,
  onRecoveryAction,
  onRouteSelect,
  ...rest
}, ref) {
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

  return React.createElement(
    "div",
    {
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
    },
    React.createElement(Drawer, {
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
    } as DrawerProps),
    React.createElement(Surface, {
      surfaceRole: "section",
      state: isDisabled ? "disabled" : "default",
      density,
      "data-help-center-surface": "true",
    } as SurfaceProps,
      React.createElement(Search, {
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
          if (event.defaultPrevented) return;
          onQueryChange?.(value, meta, event);
        },
        onResultSelect: search?.onResultSelect,
      } as SearchProps),
      React.createElement(Sidebar, {
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
          if (event.defaultPrevented) return;
          onRouteSelect?.(key, route, event);
        },
      } as SidebarProps),
      React.createElement(Input, {
        label: topicInput?.label ?? "Topic filter",
        value: topicInput?.value ?? query,
        placeholder: topicInput?.placeholder ?? "Filter topics",
        helper: topicInput?.helper,
        variant: topicInput?.variant ?? "search",
        density: topicInput?.density ?? density,
        state: isDisabled ? "disabled" : topicInput?.state ?? "default",
        disabled: isDisabled || topicInput?.disabled,
        readOnly: topicInput?.readOnly ?? true,
      } as InputProps),
      normalizedTopics.map((topic) => React.createElement(Tag, {
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
          if (event.defaultPrevented) return;
          onTopicSelect?.(topic.key, topic, event as MouseEvent<HTMLButtonElement>);
        },
      } as TagProps)),
      showRecovery
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
            if (event.defaultPrevented) return;
            onRecoveryAction?.(key, event);
          },
        } as EmptyStateProps)
        : null,
      normalizedArticles.length && !showRecovery
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
        } as AccordionProps)
        : null,
    ),
  );
}) as HelpCenterComponent;

HelpCenter.displayName = "HelpCenter";
