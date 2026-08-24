const retiredActionSurfaceMarkers = [
  {
    id: "copy-button-component",
    test: /\bCopyButton\b/,
    message: "CopyButton is retired; use Button/IconButton copy affordances instead of a duplicate component.",
  },
  {
    id: "copy-button-slug",
    test: /copy-button/,
    message: "copy-button is retired; do not reintroduce copy-button files, exports, specs, or demos.",
  },
  {
    id: "quick-action-component",
    test: /\bQuickAction\b/,
    message: "QuickAction is retired as a standalone component; QuickActionsGrid owns the pattern and composes IconButton.",
  },
  {
    id: "quick-action-css-selector",
    test: /\.quick-action/,
    message: "quick-action CSS selectors are retired; pattern internals must use .pattern-action-item.",
  },
  {
    id: "quick-action-bem-selector",
    test: /quick-action__/,
    message: "quick-action BEM selectors are retired; pattern internals must use pattern-action-item__*.",
  },
  {
    id: "quick-action-component-token",
    test: /--comp-quick-action/,
    message: "component-scoped quick-action tokens are retired; use component.pattern-action-item governance for pattern internals.",
  },
  {
    id: "quick-action-token-dependency",
    test: /comp\.quick-action/,
    message: "component dependency tokens must not reference retired quick-action component namespace.",
  },
  {
    id: "pattern-action-item-component-namespace",
    test: /comp\.pattern-action-item/,
    message: "pattern action item tokens must stay in component.pattern-action-item namespace, not comp.*.",
  },
  {
    id: "quick-action-display-name",
    test: /"Quick Action"/,
    message: "Specs must not list Quick Action as a component dependency; compose IconButton inside the owning pattern.",
  },
];

function retiredSurfaceFindings(source) {
  return retiredActionSurfaceMarkers
    .filter(({ test }) => {
      test.lastIndex = 0;
      return test.test(source);
    })
    .map(({ id, message }) => ({ id, message }));
}

module.exports = {
  retiredActionSurfaceMarkers,
  retiredSurfaceFindings,
};
