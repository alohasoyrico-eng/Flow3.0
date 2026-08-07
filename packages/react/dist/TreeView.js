import React, { forwardRef, useMemo, useRef, useState } from "react";
import { treeViewPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";

const validDensities = new Set(["sm", "md", "lg"]);
const validStates = new Set(["default", "hover", "focus", "expanded", "selected", "disabled"]);

function normalize(value, valid, fallback) {
  return valid.has(value) ? value : fallback;
}

function nodeKey(node, index) {
  return String(node?.key ?? node?.id ?? node?.label ?? `tree-item-${index}`);
}

function normalizeNodes(nodes) {
  const source = Array.isArray(nodes) && nodes.length ? nodes : [
    { key: "root", label: "Fleet", level: 1, expanded: true, icon: "account_tree" },
    { key: "cards", label: "Cards", level: 2, selected: true },
    { key: "ending-4821", label: "Cards ending 4821", level: 3 },
  ];
  return source.map((node, index) => ({
    ...node,
    key: nodeKey(node, index),
    label: node?.label ?? `Tree item ${index + 1}`,
    level: Math.max(1, Math.min(5, Number(node?.level ?? 1))),
    expandable: node?.expanded != null,
    expanded: Boolean(node?.expanded),
    selected: Boolean(node?.selected),
  }));
}

function visibleKeys(nodes, expandedKeys) {
  const hiddenByLevel = [];
  return nodes.filter((node) => {
    while (hiddenByLevel.length && hiddenByLevel[hiddenByLevel.length - 1] >= node.level) hiddenByLevel.pop();
    const visible = hiddenByLevel.length === 0;
    if (node.expandable && !expandedKeys.includes(node.key)) hiddenByLevel.push(node.level);
    return visible;
  }).map((node) => node.key);
}

export const TreeView = forwardRef(function TreeView({
  label = "Tree view",
  nodes = [],
  state = "expanded",
  density,
  selectedKey = "",
  onSelect,
  onExpandedChange,
  className = "",
  ...rest
}, ref) {
  const normalizedNodes = useMemo(() => normalizeNodes(nodes), [nodes]);
  const [selected, setSelected] = useState(() => selectedKey || normalizedNodes.find((node) => node.selected)?.key || "");
  const [expanded, setExpanded] = useState(() => normalizedNodes.filter((node) => node.expanded).map((node) => node.key));
  const controlRefs = useRef(new Map());
  const resolvedDensity = validDensities.has(density) ? density : undefined;
  const resolvedState = normalize(state, validStates, "expanded");
  const visible = visibleKeys(normalizedNodes, expanded);

  const focusKey = (key) => requestAnimationFrame(() => controlRefs.current.get(key)?.focus());
  const commitSelected = (node) => {
    if (!node || node.disabled) return;
    setSelected(node.key);
    onSelect?.(node.key);
    focusKey(node.key);
  };
  const commitExpanded = (node, nextExpanded) => {
    if (!node?.expandable || node.disabled) return;
    setExpanded((current) => {
      const next = nextExpanded
        ? [...new Set([...current, node.key])]
        : current.filter((key) => key !== node.key);
      onExpandedChange?.(next);
      return next;
    });
  };
  const move = (node, direction) => {
    const enabled = visible
      .map((key) => normalizedNodes.find((candidate) => candidate.key === key))
      .filter((candidate) => candidate && !candidate.disabled);
    const index = Math.max(0, enabled.findIndex((candidate) => candidate.key === node.key));
    focusKey(enabled[Math.max(0, Math.min(enabled.length - 1, index + direction))]?.key);
  };
  const edge = (position) => {
    const enabled = visible
      .map((key) => normalizedNodes.find((candidate) => candidate.key === key))
      .filter((candidate) => candidate && !candidate.disabled);
    focusKey(position === "first" ? enabled[0]?.key : enabled[enabled.length - 1]?.key);
  };

  return React.createElement(
    "ul",
    {
      ...rest,
      ref,
      className: ["tree-view", className].filter(Boolean).join(" "),
      role: "tree",
      "aria-label": label,
      "data-state": resolvedState,
      "data-density": resolvedDensity,
    },
    normalizedNodes.map((node) => {
      const isExpanded = expanded.includes(node.key);
      const isSelected = selected === node.key;
      const isVisible = visible.includes(node.key);
      return React.createElement(
        "li",
        {
          key: node.key,
          className: "tree-view__item",
          "data-tree-item": "",
          "data-key": node.key,
          "data-level": String(node.level),
          role: "none",
          hidden: !isVisible,
          style: { "--comp-tree-view-depth-offset": String(node.level - 1) },
        },
        React.createElement(Button, {
          ref: (control) => {
            if (control) controlRefs.current.set(node.key, control);
            else controlRefs.current.delete(node.key);
          },
          label: node.label,
          variant: "secondary",
          disabled: Boolean(node.disabled),
          icon: node.expandable ? node.icon ?? "folder" : node.icon ?? "",
          trailingIcon: node.expandable ? "expand_more" : "",
          density: resolvedDensity,
          className: "tree-view__control",
          "data-tree-control": "",
          role: "treeitem",
          "aria-level": String(node.level),
          "aria-expanded": node.expandable ? String(isExpanded) : undefined,
          "aria-selected": String(isSelected),
          tabIndex: isSelected || (!selected && visible[0] === node.key) ? 0 : -1,
          onClick: () => {
            commitSelected(node);
            if (node.expandable) commitExpanded(node, !isExpanded);
          },
          onKeyDown: (event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              move(node, 1);
            } else if (event.key === "ArrowUp") {
              event.preventDefault();
              move(node, -1);
            } else if (event.key === "Home") {
              event.preventDefault();
              edge("first");
            } else if (event.key === "End") {
              event.preventDefault();
              edge("last");
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              commitExpanded(node, true);
            } else if (event.key === "ArrowLeft") {
              event.preventDefault();
              commitExpanded(node, false);
            }
          },
        }),
      );
    }),
  );
});

TreeView.displayName = "TreeView";
TreeView.platformContract = treeViewPlatformContract;
