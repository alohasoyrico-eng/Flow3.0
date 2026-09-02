import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MovementRow, RouteSummary, StationPin, CardSummary, ChartPanel, AuditEvent, AnimatedMoment, BiometricPrompt } from "../dist/index.js";

const movementRowMarkup = renderToStaticMarkup(React.createElement(MovementRow, {
  label: "Fuel purchase",
  meta: "Today",
  amount: "-$842.00",
  status: "Pending",
  category: "fuel",
  variant: "standard",
  state: "pending",
  density: "sm",
  fullWidth: true,
}));
assert.match(movementRowMarkup, /^<article/);
assert.match(movementRowMarkup, /class="movement-row"/);
assert.match(movementRowMarkup, /data-variant="standard"/);
assert.match(movementRowMarkup, /data-state="pending"/);
assert.match(movementRowMarkup, /data-density="sm"/);
assert.match(movementRowMarkup, /data-category="fuel"/);
assert.match(movementRowMarkup, /data-full-width="true"/);
assert.match(movementRowMarkup, /class="movement-row__icon/);
assert.match(movementRowMarkup, /local_gas_station/);
assert.match(movementRowMarkup, /class="movement-row__content"/);
assert.match(movementRowMarkup, /Fuel purchase/);
assert.match(movementRowMarkup, /Today/);
assert.match(movementRowMarkup, /class="movement-row__amount">-\$842\.00<\/strong>/);
assert.match(movementRowMarkup, /class="movement-row__status">Pending<\/small>/);
assert.doesNotMatch(movementRowMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /type=|disabled=|role="button"/);

const interactiveMovementRowMarkup = renderToStaticMarkup(React.createElement(MovementRow, {
  label: "Fuel purchase",
  onSelect: () => {},
}));
assert.match(interactiveMovementRowMarkup, /^<button/);

const inheritedMovementRowMarkup = renderToStaticMarkup(React.createElement(MovementRow, {
  label: "Inherited movement density",
}));
assert.doesNotMatch(inheritedMovementRowMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);
const copyOnlyMovementRowMarkup = renderToStaticMarkup(React.createElement(MovementRow, {
  label: "Copy-only state",
  status: "Pending",
  state: "invalid-state",
}));
assert.match(copyOnlyMovementRowMarkup, /data-state="default"/);
assert.doesNotMatch(copyOnlyMovementRowMarkup, /data-state="pending"/);
const unlabeledMovementRowMarkup = renderToStaticMarkup(React.createElement(MovementRow, {
  amount: "-$842.00",
  status: "Pending",
}));
assert.doesNotMatch(unlabeledMovementRowMarkup, /movement-row|-\$842\.00|Pending/);

const routeSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Fast route",
  description: "Best option for current policy.",
  metrics: [{ key: "eta", label: "ETA", value: "18 min" }, { key: "distance", label: "Distance", value: "12.4 km" }],
  actions: [{ key: "start", label: "Start route" }, { key: "compare", label: "Compare", variant: "secondary" }],
  variant: "compare",
  state: "selected",
  density: "sm",
  tone: "info",
  fullWidth: true,
}));
assert.match(routeSummaryMarkup, /^<article/);
assert.match(routeSummaryMarkup, /class="route-summary"/);
assert.match(routeSummaryMarkup, /data-variant="compare"/);
assert.match(routeSummaryMarkup, /data-state="selected"/);
assert.match(routeSummaryMarkup, /data-density="sm"/);
assert.match(routeSummaryMarkup, /data-tone="info"/);
assert.match(routeSummaryMarkup, /data-full-width="true"/);
assert.match(routeSummaryMarkup, /aria-selected="true"/);
assert.match(routeSummaryMarkup, /class="route-summary__icon/);
assert.match(routeSummaryMarkup, /navigation/);
assert.match(routeSummaryMarkup, /class="route-summary__label"/);
assert.match(routeSummaryMarkup, /Fast route/);
assert.match(routeSummaryMarkup, /Best option for current policy/);
assert.match(routeSummaryMarkup, /class="route-summary__metrics"/);
assert.match(routeSummaryMarkup, /ETA/);
assert.match(routeSummaryMarkup, /18 min/);
assert.match(routeSummaryMarkup, /class="button button--primary"/);
assert.match(routeSummaryMarkup, /Start route/);

const inheritedRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Inherited route density",
  actions: [{ key: "start", label: "Start route" }],
}));
assert.doesNotMatch(inheritedRouteSummaryMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedRouteSummaryMarkup.match(/<button[^>]+>/)?.[0] ?? "", /data-density=/);
const visualFocusRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Visual focus route",
  state: "focus",
}));
assert.doesNotMatch(visualFocusRouteSummaryMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /tabindex/);
const focusableRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Focusable route",
  tabIndex: 0,
}));
assert.match(focusableRouteSummaryMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /tabindex="0"/);

const inheritedCompactRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Inherited compact route density",
  variant: "compact",
  actions: [{ key: "cancel", label: "Cancel route" }],
}));
assert.doesNotMatch(inheritedCompactRouteSummaryMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedCompactRouteSummaryMarkup.match(/<button[^>]+>/)?.[0] ?? "", /data-density=/);
const ariaCompactRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Compact route",
  variant: "compact",
  actions: [{ key: "cancel", label: "Cancel route", icon: "close" }],
}));
assert.match(ariaCompactRouteSummaryMarkup, /aria-label="Cancel route"/);
assert.doesNotMatch(ariaCompactRouteSummaryMarkup, /aria-label=""/);
const unnamedCompactRouteActionMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Route",
  variant: "compact",
  actions: [{ icon: "close" }],
}));
assert.doesNotMatch(unnamedCompactRouteActionMarkup, /Route action/);
assert.doesNotMatch(unnamedCompactRouteActionMarkup.match(/<button[^>]+>/)?.[0] ?? "", /aria-label=/);
assert.doesNotMatch(unnamedCompactRouteActionMarkup, /class="icon-button/);
const unstableRouteActionMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Route A",
  actions: [{ label: "Start route" }],
}));
assert.doesNotMatch(unstableRouteActionMarkup, /class="button/);

const incompleteMetricRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Airport run",
  metrics: [{ label: "Stops" }, { value: "18 min" }],
}));
assert.doesNotMatch(incompleteMetricRouteSummaryMarkup, /class="route-summary__metrics"/);
assert.doesNotMatch(incompleteMetricRouteSummaryMarkup, /<small><\/small>|<strong><\/strong>/);

const unstableMetricRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  label: "Airport run",
  metrics: [{ label: "ETA", value: "18 min" }],
}));
assert.doesNotMatch(unstableMetricRouteSummaryMarkup, /class="route-summary__metrics"/);
assert.doesNotMatch(unstableMetricRouteSummaryMarkup, /ETA|18 min/);
const unlabeledRouteSummaryMarkup = renderToStaticMarkup(React.createElement(RouteSummary, {
  description: "No route identity",
  metrics: [{ key: "eta", label: "ETA", value: "18 min" }],
  actions: [{ key: "start", label: "Start route" }],
}));
assert.doesNotMatch(unlabeledRouteSummaryMarkup, /route-summary|No route identity|ETA|Start route/);

const stationPinMarkup = renderToStaticMarkup(React.createElement(StationPin, {
  label: "Station 24",
  value: "Open",
  meta: "2.4 km",
  icon: "local_gas_station",
  variant: "fuel",
  state: "selected",
  density: "sm",
}));
assert.match(stationPinMarkup, /^<button/);
assert.match(stationPinMarkup, /class="station-pin"/);
assert.match(stationPinMarkup, /data-variant="fuel"/);
assert.match(stationPinMarkup, /data-state="selected"/);
assert.match(stationPinMarkup, /data-density="sm"/);
assert.match(stationPinMarkup, /data-map-primitive="maps"/);
assert.match(stationPinMarkup, /aria-pressed="true"/);
assert.match(stationPinMarkup, /aria-label="Station 24 Open 2\.4 km"/);
assert.match(stationPinMarkup, /class="station-pin__marker material-symbol"/);
assert.match(stationPinMarkup, /local_gas_station/);
assert.match(stationPinMarkup, /class="station-pin__value">Open<\/span>/);

const inheritedStationPinMarkup = renderToStaticMarkup(React.createElement(StationPin, {
  label: "Inherited station density",
}));
assert.doesNotMatch(inheritedStationPinMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedStationPinMarkup = renderToStaticMarkup(React.createElement(StationPin, {
  value: "",
}));
assert.equal(unnamedStationPinMarkup, "");
const valueOnlyStationPinMarkup = renderToStaticMarkup(React.createElement(StationPin, {
  value: "Open",
}));
assert.equal(valueOnlyStationPinMarkup, "");
const clusterOnlyStationPinMarkup = renderToStaticMarkup(React.createElement(StationPin, {
  variant: "cluster",
  count: 6,
}));
assert.equal(clusterOnlyStationPinMarkup, "");

const cardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  label: "Fleet",
  meta: "ANA SOSA",
  number: "**** 4821",
  expires: "12/28",
  status: "Frozen",
  metrics: [{ key: "available", label: "Available", value: "$2,480" }],
  variant: "limit",
  state: "frozen",
  density: "sm",
  fullWidth: true,
}));
assert.match(cardSummaryMarkup, /^<article/);
assert.match(cardSummaryMarkup, /class="card-summary"/);
assert.match(cardSummaryMarkup, /data-variant="limit"/);
assert.match(cardSummaryMarkup, /data-state="frozen"/);
assert.match(cardSummaryMarkup, /data-density="sm"/);
assert.match(cardSummaryMarkup, /data-full-width="true"/);
assert.doesNotMatch(cardSummaryMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /tabIndex=/);
assert.match(cardSummaryMarkup, /class="badge/);
assert.match(cardSummaryMarkup, /class="card-summary__number">\*\*\*\* 4821<\/span>/);
assert.match(cardSummaryMarkup, /class="card-summary__expires">12\/28<\/span>/);
assert.match(cardSummaryMarkup, /class="card-summary__metrics"/);
assert.match(cardSummaryMarkup, /Available/);
assert.match(cardSummaryMarkup, /class="card-summary__frost"/);

const inheritedCardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  label: "Inherited card density",
}));
assert.doesNotMatch(inheritedCardSummaryMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedCardSummaryMarkup, /class="badge/);

const panCardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  label: "Masked card",
  number: "4242 4242 4242 1234",
}));
assert.match(panCardSummaryMarkup, /class="card-summary__number">\*\*\*\* 1234<\/span>/);
assert.doesNotMatch(panCardSummaryMarkup, /4242 4242 4242 1234|4242424242421234/);

const frozenStatusCardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  label: "Frozen without status",
  state: "frozen",
}));
assert.match(frozenStatusCardSummaryMarkup, /class="card-summary__frost"/);
assert.match(frozenStatusCardSummaryMarkup, />Frozen</);

const explicitlyFocusableCardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  label: "Focusable by product",
  tabIndex: 0,
}));
assert.match(explicitlyFocusableCardSummaryMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /tabindex="0"/);

const incompleteMetricCardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  label: "Fleet",
  metrics: [{ label: "Available" }, { value: "$2,480" }],
  variant: "limit",
}));
assert.doesNotMatch(incompleteMetricCardSummaryMarkup, /class="card-summary__metrics"/);
assert.doesNotMatch(incompleteMetricCardSummaryMarkup, /<small><\/small>|<strong><\/strong>/);

const unstableMetricCardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  label: "Fleet",
  metrics: [{ label: "Available", value: "$2,480" }],
  variant: "limit",
}));
assert.doesNotMatch(unstableMetricCardSummaryMarkup, /class="card-summary__metrics"/);
assert.doesNotMatch(unstableMetricCardSummaryMarkup, /Available|\$2,480/);
const unlabeledCardSummaryMarkup = renderToStaticMarkup(React.createElement(CardSummary, {
  number: "**** 4821",
  status: "Active",
}));
assert.doesNotMatch(unlabeledCardSummaryMarkup, /card-summary|Active|\*\*\*\* 4821/);

const chartPanelMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Spend",
  value: "$12k",
  caption: "Last 7 days",
  values: [3, 6, 9],
  valueLabels: ["Mon", "Tue", "Wed"],
  variant: "bars",
  state: "warning",
  tone: "info",
  density: "sm",
  fullWidth: true,
}));
assert.match(chartPanelMarkup, /^<article/);
assert.match(chartPanelMarkup, /class="chart-panel"/);
assert.match(chartPanelMarkup, /data-chart-primitive="charts"/);
assert.match(chartPanelMarkup, /data-chart-engine="echarts-option"/);
assert.match(chartPanelMarkup, /data-variant="bars"/);
assert.match(chartPanelMarkup, /data-state="warning"/);
assert.match(chartPanelMarkup, /data-tone="info"/);
assert.match(chartPanelMarkup, /data-density="sm"/);
assert.match(chartPanelMarkup, /data-full-width="true"/);
assert.match(chartPanelMarkup, /<output>\$12k<\/output>/);
assert.match(chartPanelMarkup, /<figure role="group" aria-label="Spend\. \$12k\. Last 7 days\. bars chart/);
assert.match(chartPanelMarkup, /class="chart-panel__plot" role="list"/);
assert.match(chartPanelMarkup, /class="chart-panel__bar-group"/);
assert.match(chartPanelMarkup, /style="--comp-chart-panel-stagger-delay:calc\(var\(--sys-momentum-stagger-chart\) \* 1\)"/);
assert.match(chartPanelMarkup, /class="chart-panel__tooltip" role="status" aria-live="polite"/);
assert.match(chartPanelMarkup, /class="chart-panel__echarts" aria-hidden="true"/);
assert.match(chartPanelMarkup, /class="chart-panel__option">/);
assert.match(chartPanelMarkup, /&quot;engine&quot;:&quot;apache-echarts&quot;/);
assert.match(chartPanelMarkup, /&quot;type&quot;:&quot;bars&quot;/);
assert.match(chartPanelMarkup, /&quot;tableFallback&quot;:\[/);

const inheritedChartPanelMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Inherited chart density",
  values: [1, 2, 3],
}));
assert.doesNotMatch(inheritedChartPanelMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedChartPanelMarkup, /Value 1|Series 1|Current|Previous/);
const unlabeledBarsChartMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Unlabeled bars",
  values: [1, 2, 3],
  variant: "bars",
}));
assert.doesNotMatch(unlabeledBarsChartMarkup, /class="chart-panel__bar-group"/);
assert.doesNotMatch(unlabeledBarsChartMarkup, /role="listitem"|tabindex="0"|data-tooltip="1"|data-tooltip="2"|data-tooltip="3"/);
const emptyChartPanelMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Empty chart",
}));
assert.equal(emptyChartPanelMarkup, "");
assert.doesNotMatch(emptyChartPanelMarkup, /Value 1|Series 1|Current|Previous/);
assert.doesNotMatch(emptyChartPanelMarkup, /32|54|48|70|62|84/);
const unstableSeriesChartMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Series chart",
  values: [1, 2, 3],
  variant: "line",
  series: [{ label: "Projected", values: [2, 4, 6] }],
}));
assert.doesNotMatch(unstableSeriesChartMarkup, /Projected/);
assert.doesNotMatch(unstableSeriesChartMarkup, /key="Projected"|key="0"/);
const multiSeriesChartMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Multi series chart",
  variant: "line",
  series: [
    { id: "actual", values: [1, 2, 3] },
    { id: "forecast", values: [2, 3, 4] },
    { id: "budget", values: [3, 4, 5] },
    { id: "risk", values: [4, 5, 6] },
  ],
}));
assert.match(multiSeriesChartMarkup, /data-series="4"/);
assert.match(multiSeriesChartMarkup, /style="--comp-chart-panel-current-series:var\(--comp-chart-panel-series-4\)"/);
const comparisonChartMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Comparison chart",
  values: [1, 2],
  labels: ["Current", "Previous"],
  variant: "comparison",
  comparisons: [
    { id: "projected", label: "Projected", values: [2, 4] },
    { id: "actual", label: "Actual", values: [1, 3] },
  ],
}));
assert.match(comparisonChartMarkup, /data-variant="comparison"/);
assert.match(comparisonChartMarkup, /data-series="1"/);
assert.match(comparisonChartMarkup, /--comp-chart-panel-current-series:var\(--comp-chart-panel-comparison-reference-fill\)/);
assert.match(comparisonChartMarkup, /--comp-chart-panel-stagger-delay:calc\(var\(--sys-momentum-stagger-chart-compact\) \* 1\)/);

const auditEventMarkup = renderToStaticMarkup(React.createElement(AuditEvent, {
  label: "Document rejected",
  description: "Ana updated card evidence.",
  meta: "Ana Sosa - Operations",
  timestamp: "10:21",
  icon: "warning",
  status: "Critical",
  state: "critical",
  density: "sm",
}));
assert.match(auditEventMarkup, /^<article/);
assert.match(auditEventMarkup, /class="audit-event"/);
assert.match(auditEventMarkup, /data-tone="danger"/);
assert.match(auditEventMarkup, /data-state="critical"/);
assert.match(auditEventMarkup, /data-density="sm"/);
assert.match(auditEventMarkup, /class="audit-event__icon material-symbol"/);
assert.match(auditEventMarkup, /warning/);
assert.match(auditEventMarkup, /class="audit-event__content"/);
assert.match(auditEventMarkup, /Document rejected/);
assert.match(auditEventMarkup, /class="audit-event__meta"/);
assert.match(auditEventMarkup, /class="audit-event__time">10:21<\/time>/);
assert.match(auditEventMarkup, /<em>Critical<\/em>/);

const inheritedAuditEventMarkup = renderToStaticMarkup(React.createElement(AuditEvent, {
  label: "Inherited audit density",
}));
assert.doesNotMatch(inheritedAuditEventMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);
const unlabeledAuditEventMarkup = renderToStaticMarkup(React.createElement(AuditEvent, {
  description: "Missing event label",
  meta: "Ana Sosa",
  status: "Critical",
}));
assert.doesNotMatch(unlabeledAuditEventMarkup, /audit-event|Missing event label|Ana Sosa|Critical/);

const animatedMomentMarkup = renderToStaticMarkup(React.createElement(AnimatedMoment, {
  label: "Action complete",
  description: "Static success",
  variant: "celebration",
  state: "complete",
  density: "sm",
  fullWidth: true,
  reducedMotionFallback: "Reduced motion fallback",
  stateLabel: "Complete",
}));
assert.match(animatedMomentMarkup, /^<div/);
assert.match(animatedMomentMarkup, /class="animated-moment"/);
assert.match(animatedMomentMarkup, /data-variant="celebration"/);
assert.match(animatedMomentMarkup, /data-state="complete"/);
assert.match(animatedMomentMarkup, /data-density="sm"/);
assert.match(animatedMomentMarkup, /data-full-width="true"/);
assert.match(animatedMomentMarkup, /role="img"/);
assert.match(animatedMomentMarkup, /aria-label="Action complete: Complete"/);
assert.match(animatedMomentMarkup, /class="animated-moment__icon material-symbol"/);
assert.doesNotMatch(animatedMomentMarkup, /class="animated-moment__stage"/);
assert.doesNotMatch(animatedMomentMarkup, /class="animation-asset animated-moment__asset"/);
assert.match(animatedMomentMarkup, /class="animated-moment__state" hidden="">Complete<\/span>/);
assert.match(animatedMomentMarkup, /data-animated-moment-cue=""/);
const unnamedAnimatedMomentMarkup = renderToStaticMarkup(React.createElement(AnimatedMoment, {
  label: "Consumer moment",
  state: "complete",
}));
assert.doesNotMatch(unnamedAnimatedMomentMarkup, /Idle|Playing|Paused|Complete|Reduced motion|Disabled/);
const unlabeledAnimatedMomentMarkup = renderToStaticMarkup(React.createElement(AnimatedMoment, {
  description: "No accessible label",
  reducedMotionFallback: "Fallback",
}));
assert.doesNotMatch(unlabeledAnimatedMomentMarkup, /animated-moment|role="img"|aria-label=""|No accessible label|Fallback/);

const biometricPromptMarkup = renderToStaticMarkup(React.createElement(BiometricPrompt, {
  label: "Confirm it is you",
  description: "Look at the camera.",
  variant: "face",
  state: "authenticating",
  actionLabel: "Use face ID",
  fallback: "Use passcode instead",
  onAction: () => {},
  onFallback: () => {},
  density: "sm",
  fullWidth: true,
}));
assert.match(biometricPromptMarkup, /^<section/);
assert.match(biometricPromptMarkup, /class="biometric-prompt"/);
assert.match(biometricPromptMarkup, /data-variant="face"/);
assert.match(biometricPromptMarkup, /data-state="authenticating"/);
assert.match(biometricPromptMarkup, /data-density="sm"/);
assert.match(biometricPromptMarkup, /data-full-width="true"/);
assert.match(biometricPromptMarkup, /role="group"/);
assert.match(biometricPromptMarkup, /aria-label="Confirm it is you"/);
assert.match(biometricPromptMarkup, /class="biometric-prompt__icon material-symbol"/);
assert.match(biometricPromptMarkup, /face/);
assert.match(biometricPromptMarkup, /class="biometric-prompt__content"/);
assert.match(biometricPromptMarkup, /role="status"/);
assert.match(biometricPromptMarkup, /Look at the camera/);
assert.match(biometricPromptMarkup, /class="button button--primary biometric-prompt__action"/);
assert.match(biometricPromptMarkup, /aria-busy="true"/);
assert.match(biometricPromptMarkup, /data-state="loading"/);
assert.match(biometricPromptMarkup, /data-biometric-action=""/);
assert.match(biometricPromptMarkup, /class="button button--tertiary biometric-prompt__fallback"/);
assert.match(biometricPromptMarkup, /data-biometric-fallback=""/);
const inertBiometricPromptMarkup = renderToStaticMarkup(React.createElement(BiometricPrompt, {
  label: "Confirm it is you",
  actionLabel: "Use face ID",
  fallback: "Use passcode instead",
}));
assert.doesNotMatch(inertBiometricPromptMarkup, /data-biometric-action/);
assert.doesNotMatch(inertBiometricPromptMarkup, /data-biometric-fallback/);
const unnamedBiometricPromptMarkup = renderToStaticMarkup(React.createElement(BiometricPrompt));
assert.doesNotMatch(unnamedBiometricPromptMarkup, /biometric-prompt|role="group"|fingerprint|Biometric authentication/);


console.log("react domain display render tests passed");
