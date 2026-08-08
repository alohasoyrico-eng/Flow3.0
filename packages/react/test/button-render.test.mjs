import assert from "node:assert/strict";
import React, { createRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion, AnimatedMoment, AuditEvent, Avatar, Badge, BiometricPrompt, Breadcrumbs, Button, Card, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, CardSummary, ChartPanel, Checkbox, Chip, CodeInput, Combobox, CountrySelector, DatePicker, DateRangePicker, Dialog, Drawer, EmptyState, ErrorPanel, FloatingActionButton, IconButton, InlineValidation, Input, KpiTile, List, Menu, MotionBoundary, MovementRow, Pagination, PhoneInput, Popover, ProgressIndicator, QuickAction, RadioButton, RouteSummary, SegmentedControl, Select, Skeleton, Slider, Spinner, StationPin, Stepper, Switch, Tabs, Table, Tag, TextArea, Toast, Tooltip, TreeView } from "../src/index.js";
import { accordionPlatformContract, animatedMomentPlatformContract, auditEventPlatformContract, avatarPlatformContract, badgePlatformContract, biometricPromptPlatformContract, breadcrumbsPlatformContract, buttonPlatformContract, cardExpiryInputPlatformContract, cardNumberInputPlatformContract, cardPlatformContract, cardSecurityCodeInputPlatformContract, cardSummaryPlatformContract, chartPanelPlatformContract, checkboxPlatformContract, chipPlatformContract, codeInputPlatformContract, comboboxPlatformContract, countrySelectorPlatformContract, datePickerPlatformContract, dateRangePickerPlatformContract, dialogPlatformContract, drawerPlatformContract, emptyStatePlatformContract, errorPanelPlatformContract, floatingActionButtonPlatformContract, iconButtonPlatformContract, inlineValidationPlatformContract, inputPlatformContract, kpiTilePlatformContract, listPlatformContract, menuPlatformContract, motionBoundaryPlatformContract, movementRowPlatformContract, paginationPlatformContract, phoneInputPlatformContract, popoverPlatformContract, quickActionPlatformContract, radioButtonPlatformContract, routeSummaryPlatformContract, segmentedControlPlatformContract, selectPlatformContract, skeletonPlatformContract, sliderPlatformContract, stationPinPlatformContract, stepperPlatformContract, switchPlatformContract, tabsPlatformContract, tablePlatformContract, tagPlatformContract, textAreaPlatformContract, toastPlatformContract, tooltipPlatformContract, treeViewPlatformContract } from "@design-system/components/platforms";

assert.equal(Accordion.displayName, "Accordion");
assert.equal(Accordion.platformContract, accordionPlatformContract);
assert.equal(AnimatedMoment.displayName, "AnimatedMoment");
assert.equal(AnimatedMoment.platformContract, animatedMomentPlatformContract);
assert.equal(AuditEvent.displayName, "AuditEvent");
assert.equal(AuditEvent.platformContract, auditEventPlatformContract);
assert.equal(Avatar.displayName, "Avatar");
assert.equal(Avatar.platformContract, avatarPlatformContract);
assert.equal(Badge.displayName, "Badge");
assert.equal(Badge.platformContract, badgePlatformContract);
assert.equal(BiometricPrompt.displayName, "BiometricPrompt");
assert.equal(BiometricPrompt.platformContract, biometricPromptPlatformContract);
assert.equal(Breadcrumbs.displayName, "Breadcrumbs");
assert.equal(Breadcrumbs.platformContract, breadcrumbsPlatformContract);
assert.equal(Button.displayName, "Button");
assert.equal(Button.platformContract, buttonPlatformContract);
assert.equal(Card.displayName, "Card");
assert.equal(Card.platformContract, cardPlatformContract);
assert.equal(CardExpiryInput.displayName, "CardExpiryInput");
assert.equal(CardExpiryInput.platformContract, cardExpiryInputPlatformContract);
assert.equal(CardNumberInput.displayName, "CardNumberInput");
assert.equal(CardNumberInput.platformContract, cardNumberInputPlatformContract);
assert.equal(CardSecurityCodeInput.displayName, "CardSecurityCodeInput");
assert.equal(CardSecurityCodeInput.platformContract, cardSecurityCodeInputPlatformContract);
assert.equal(CardSummary.displayName, "CardSummary");
assert.equal(CardSummary.platformContract, cardSummaryPlatformContract);
assert.equal(ChartPanel.displayName, "ChartPanel");
assert.equal(ChartPanel.platformContract, chartPanelPlatformContract);
assert.equal(Checkbox.displayName, "Checkbox");
assert.equal(Checkbox.platformContract, checkboxPlatformContract);
assert.equal(Chip.displayName, "Chip");
assert.equal(Chip.platformContract, chipPlatformContract);
assert.equal(CodeInput.displayName, "CodeInput");
assert.equal(CodeInput.platformContract, codeInputPlatformContract);
assert.equal(Combobox.displayName, "Combobox");
assert.equal(Combobox.platformContract, comboboxPlatformContract);
assert.equal(CountrySelector.displayName, "CountrySelector");
assert.equal(CountrySelector.platformContract, countrySelectorPlatformContract);
assert.equal(DatePicker.displayName, "DatePicker");
assert.equal(DatePicker.platformContract, datePickerPlatformContract);
assert.equal(DateRangePicker.displayName, "DateRangePicker");
assert.equal(DateRangePicker.platformContract, dateRangePickerPlatformContract);
assert.equal(Dialog.displayName, "Dialog");
assert.equal(Dialog.platformContract, dialogPlatformContract);
assert.equal(Drawer.displayName, "Drawer");
assert.equal(Drawer.platformContract, drawerPlatformContract);
assert.equal(EmptyState.displayName, "EmptyState");
assert.equal(EmptyState.platformContract, emptyStatePlatformContract);
assert.equal(ErrorPanel.displayName, "ErrorPanel");
assert.equal(ErrorPanel.platformContract, errorPanelPlatformContract);
assert.equal(FloatingActionButton.displayName, "FloatingActionButton");
assert.equal(FloatingActionButton.platformContract, floatingActionButtonPlatformContract);
assert.equal(IconButton.displayName, "IconButton");
assert.equal(IconButton.platformContract, iconButtonPlatformContract);
assert.equal(InlineValidation.displayName, "InlineValidation");
assert.equal(InlineValidation.platformContract, inlineValidationPlatformContract);
assert.equal(Input.displayName, "Input");
assert.equal(Input.platformContract, inputPlatformContract);
assert.equal(KpiTile.displayName, "KpiTile");
assert.equal(KpiTile.platformContract, kpiTilePlatformContract);
assert.equal(List.displayName, "List");
assert.equal(List.platformContract, listPlatformContract);
assert.equal(Menu.displayName, "Menu");
assert.equal(Menu.platformContract, menuPlatformContract);
assert.equal(MotionBoundary.displayName, "MotionBoundary");
assert.equal(MotionBoundary.platformContract, motionBoundaryPlatformContract);
assert.equal(MovementRow.displayName, "MovementRow");
assert.equal(MovementRow.platformContract, movementRowPlatformContract);
assert.equal(Pagination.displayName, "Pagination");
assert.equal(Pagination.platformContract, paginationPlatformContract);
assert.equal(PhoneInput.displayName, "PhoneInput");
assert.equal(PhoneInput.platformContract, phoneInputPlatformContract);
assert.equal(Popover.displayName, "Popover");
assert.equal(Popover.platformContract, popoverPlatformContract);
assert.equal(QuickAction.displayName, "QuickAction");
assert.equal(QuickAction.platformContract, quickActionPlatformContract);
assert.equal(RadioButton.displayName, "RadioButton");
assert.equal(RadioButton.platformContract, radioButtonPlatformContract);
assert.equal(RouteSummary.displayName, "RouteSummary");
assert.equal(RouteSummary.platformContract, routeSummaryPlatformContract);
assert.equal(SegmentedControl.displayName, "SegmentedControl");
assert.equal(SegmentedControl.platformContract, segmentedControlPlatformContract);
assert.equal(Select.displayName, "Select");
assert.equal(Select.platformContract, selectPlatformContract);
assert.equal(Skeleton.displayName, "Skeleton");
assert.equal(Skeleton.platformContract, skeletonPlatformContract);
assert.equal(Slider.displayName, "Slider");
assert.equal(Slider.platformContract, sliderPlatformContract);
assert.equal(StationPin.displayName, "StationPin");
assert.equal(StationPin.platformContract, stationPinPlatformContract);
assert.equal(Stepper.displayName, "Stepper");
assert.equal(Stepper.platformContract, stepperPlatformContract);
assert.equal(Switch.displayName, "Switch");
assert.equal(Switch.platformContract, switchPlatformContract);
assert.equal(Tabs.displayName, "Tabs");
assert.equal(Tabs.platformContract, tabsPlatformContract);
assert.equal(Table.displayName, "Table");
assert.equal(Table.platformContract, tablePlatformContract);
assert.equal(Tag.displayName, "Tag");
assert.equal(Tag.platformContract, tagPlatformContract);
assert.equal(Toast.displayName, "Toast");
assert.equal(Toast.platformContract, toastPlatformContract);
assert.equal(Tooltip.displayName, "Tooltip");
assert.equal(Tooltip.platformContract, tooltipPlatformContract);
assert.equal(TreeView.displayName, "TreeView");
assert.equal(TreeView.platformContract, treeViewPlatformContract);
assert.equal(TextArea.displayName, "TextArea");
assert.equal(TextArea.platformContract, textAreaPlatformContract);

const markup = renderToStaticMarkup(React.createElement(Button, {
  label: "Approve",
  variant: "outlined",
  density: "sm",
  state: "pressed",
  icon: "check",
  trailingIcon: "arrow_forward",
  fullWidth: true,
}));

assert.match(markup, /class="button button--outlined"/);
assert.match(markup, /data-density="sm"/);
assert.match(markup, /data-state="pressed"/);
assert.match(markup, /data-full-width="true"/);
assert.match(markup, /class="button__icon"/);
assert.match(markup, /class="button__label">Approve<\/span>/);
assert.match(markup, /button__icon--trailing/);
const unnamedButtonMarkup = renderToStaticMarkup(React.createElement(Button, {
  icon: "check",
}));
assert.equal(unnamedButtonMarkup, "");

const loadingMarkup = renderToStaticMarkup(React.createElement(Button, {
  label: "Saving",
  loading: true,
}));

assert.match(loadingMarkup, /disabled=""/);
assert.match(loadingMarkup, /aria-busy="true"/);
assert.match(loadingMarkup, /class="spinner/);
assert.doesNotMatch(loadingMarkup, /Saving loading|Loading/);

const fabMarkup = renderToStaticMarkup(React.createElement(FloatingActionButton, {
  label: "Add movement",
  icon: "add",
  variant: "extended",
  density: "lg",
}));
assert.match(fabMarkup, /^<button/);
assert.match(fabMarkup, /class="fab"/);
assert.match(fabMarkup, /aria-label="Add movement"/);
assert.match(fabMarkup, /data-variant="extended"/);
assert.match(fabMarkup, /data-density="lg"/);
assert.match(fabMarkup, /data-extended="true"/);
assert.match(fabMarkup, /class="fab__icon"/);
assert.match(fabMarkup, /class="fab__label">Add movement<\/span>/);

const loadingFabMarkup = renderToStaticMarkup(React.createElement(FloatingActionButton, {
  label: "Saving movement",
  loading: true,
}));
assert.match(loadingFabMarkup, /class="fab"/);
assert.match(loadingFabMarkup, /disabled=""/);
assert.match(loadingFabMarkup, /aria-busy="true"/);
assert.match(loadingFabMarkup, /class="spinner"/);
assert.doesNotMatch(loadingFabMarkup, /class="fab__icon"/);
assert.doesNotMatch(loadingFabMarkup, /Saving movement loading|Loading/);

const inheritedFabMarkup = renderToStaticMarkup(React.createElement(FloatingActionButton, {
  label: "Inherited fab density",
}));
assert.doesNotMatch(inheritedFabMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedFabMarkup = renderToStaticMarkup(React.createElement(FloatingActionButton));
assert.equal(unnamedFabMarkup, "");

const quickActionMarkup = renderToStaticMarkup(React.createElement(QuickAction, {
  label: "Freeze",
  icon: "lock",
  badge: "2",
  variant: "destructive",
  state: "warning",
  density: "sm",
}));
assert.match(quickActionMarkup, /class="quick-action"/);
assert.match(quickActionMarkup, /data-variant="destructive"/);
assert.match(quickActionMarkup, /data-state="warning"/);
assert.match(quickActionMarkup, /data-density="sm"/);
assert.match(quickActionMarkup, /class="quick-action__control"/);
assert.match(quickActionMarkup, /aria-label="Freeze"/);
assert.match(quickActionMarkup, /class="quick-action__icon"/);
assert.match(quickActionMarkup, /lock/);
assert.match(quickActionMarkup, /class="quick-action__label">Freeze<\/span>/);
assert.match(quickActionMarkup, /class="badge/);

const loadingQuickActionMarkup = renderToStaticMarkup(React.createElement(QuickAction, {
  label: "Sync",
  state: "loading",
}));
assert.match(loadingQuickActionMarkup, /aria-busy="true"/);
assert.match(loadingQuickActionMarkup, /class="spinner/);
assert.doesNotMatch(loadingQuickActionMarkup, /Sync loading|Loading/);

const inheritedQuickActionMarkup = renderToStaticMarkup(React.createElement(QuickAction, {
  label: "Inherited action density",
}));
assert.doesNotMatch(inheritedQuickActionMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedQuickActionMarkup = renderToStaticMarkup(React.createElement(QuickAction));
assert.equal(unnamedQuickActionMarkup, "");

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
assert.match(movementRowMarkup, /^<button/);
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

const inheritedMovementRowMarkup = renderToStaticMarkup(React.createElement(MovementRow, {
  label: "Inherited movement density",
}));
assert.doesNotMatch(inheritedMovementRowMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
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
const comparisonChartMarkup = renderToStaticMarkup(React.createElement(ChartPanel, {
  label: "Comparison chart",
  values: [1, 2],
  labels: ["Current", "Previous"],
  variant: "comparison",
  comparisons: [{ id: "projected", label: "Projected", values: [2, 4] }],
}));
assert.match(comparisonChartMarkup, /data-variant="comparison"/);
assert.match(comparisonChartMarkup, /data-series="1"/);

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
assert.match(animatedMomentMarkup, /class="animated-moment__stage"/);
assert.match(animatedMomentMarkup, /data-animated-moment-stage=""/);
assert.match(animatedMomentMarkup, /class="animation-asset animated-moment__asset"/);
assert.match(animatedMomentMarkup, /data-animation-library="lottie-web"/);
assert.match(animatedMomentMarkup, /data-animation-runtime="fallback"/);
assert.match(animatedMomentMarkup, /class="animation-asset__fallback-icon material-symbol"/);
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
const unnamedBiometricPromptMarkup = renderToStaticMarkup(React.createElement(BiometricPrompt));
assert.doesNotMatch(unnamedBiometricPromptMarkup, /biometric-prompt|role="group"|fingerprint|Biometric authentication/);

const accordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  density: "sm",
  items: [
    { id: "docs", title: "Documents", content: "Insurance", open: true, icon: "description", meta: "3 of 4" },
    { id: "limits", title: "Limits", content: "Daily limit", icon: "speed", meta: "2 rules" },
  ],
}));
assert.match(accordionMarkup, /class="accordion"/);
assert.match(accordionMarkup, /data-density="sm"/);
assert.match(accordionMarkup, /data-variant="single"/);
assert.match(accordionMarkup, /data-multiple="false"/);
assert.match(accordionMarkup, /data-accordion-trigger=""/);
assert.match(accordionMarkup, /aria-expanded="true"/);
assert.match(accordionMarkup, /aria-controls="[^"]+-docs"/);
assert.match(accordionMarkup, /class="accordion__icon"/);
assert.match(accordionMarkup, /class="accordion__title">Documents<\/span>/);
assert.match(accordionMarkup, /class="accordion__meta">3 of 4<\/span>/);
assert.match(accordionMarkup, /class="accordion__chevron"/);
assert.match(accordionMarkup, /class="accordion__panel"/);
assert.match(accordionMarkup, /role="region"/);
assert.match(accordionMarkup, /class="accordion__panel-body">Insurance<\/div>/);
assert.match(accordionMarkup, /hidden="">/);
const inheritedAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "billing", title: "Billing", content: "Cards" }],
}));
assert.doesNotMatch(inheritedAccordionMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const emptyAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [],
}));
assert.doesNotMatch(emptyAccordionMarkup, /Section/);
assert.doesNotMatch(emptyAccordionMarkup, /accordion__item/);
const incompleteAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "ghost", content: "Panel" }],
}));
assert.doesNotMatch(incompleteAccordionMarkup, /accordion__item|data-accordion-trigger/);
const labelAliasAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "ghost", label: "Alias title", content: "Panel" }],
}));
assert.doesNotMatch(labelAliasAccordionMarkup, /accordion__item|data-accordion-trigger|Alias title/);
const descriptionAliasAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "ghost", title: "Documents", description: "Alias panel", open: true }],
}));
assert.doesNotMatch(descriptionAliasAccordionMarkup, /Alias panel/);
const unnamedAccordionItemMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "empty", ariaLabel: "Consumer section", content: "Panel" }],
}));
assert.doesNotMatch(unnamedAccordionItemMarkup, /accordion__item|data-accordion-trigger|aria-label="Consumer section"/);
const unstableAccordionItemMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ title: "Documents", content: "Insurance" }],
}));
assert.doesNotMatch(unstableAccordionItemMarkup, /accordion__item|data-accordion-trigger|accordion-panel-|Documents/);
assert.doesNotMatch(loadingMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
assert.match(loadingMarkup, /class="spinner"/);
assert.match(loadingMarkup, /class="spinner__svg"/);
assert.match(loadingMarkup, /class="spinner__arc"/);

const listMarkup = renderToStaticMarkup(React.createElement(List, {
  label: "Fleet tasks",
  variant: "action",
  state: "selected",
  density: "sm",
  interactive: true,
  items: [
    { key: "docs", label: "Documents", meta: "3 pending", value: "75%", icon: "description", state: "selected" },
    { key: "fuel", label: "Fuel card", meta: "Needs review", value: "$842", icon: "credit_card", tone: "danger" },
  ],
}));
assert.match(listMarkup, /^<ul/);
assert.match(listMarkup, /class="list"/);
assert.match(listMarkup, /role="list"/);
assert.match(listMarkup, /aria-label="Fleet tasks"/);
assert.match(listMarkup, /data-variant="action"/);
assert.match(listMarkup, /data-state="selected"/);
assert.match(listMarkup, /data-density="sm"/);
assert.match(listMarkup, /data-interactive="true"/);
assert.match(listMarkup, /<button class="list__item"/);
assert.match(listMarkup, /data-key="docs"/);
assert.match(listMarkup, /aria-current="true"/);
assert.match(listMarkup, /class="list__icon material-symbol"/);
assert.match(listMarkup, /class="list__content"/);
assert.match(listMarkup, /class="list__value">75%<\/span>/);

const passiveListMarkup = renderToStaticMarkup(React.createElement(List, {
  items: [{ key: "ana-sosa", label: "Ana Sosa", meta: "Driver", value: "Active" }],
}));
assert.match(passiveListMarkup, /<span class="list__item"/);
assert.doesNotMatch(passiveListMarkup.match(/^<ul[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(passiveListMarkup, /<button/);

const loadingListItemMarkup = renderToStaticMarkup(React.createElement(List, {
  items: [{ key: "loading-row", label: "Refreshing assignments", state: "loading" }],
}));
assert.match(loadingListItemMarkup, /aria-busy="true"/);
assert.doesNotMatch(loadingListItemMarkup, /Loading item/);
const unnamedActionListMarkup = renderToStaticMarkup(React.createElement(List, {
  variant: "action",
  items: [{ key: "empty-action", icon: "more_horiz" }],
  onSelect: () => {},
}));
assert.doesNotMatch(unnamedActionListMarkup, /<button/);
assert.doesNotMatch(unnamedActionListMarkup, /data-key="empty-action"/);
const unstableActionListMarkup = renderToStaticMarkup(React.createElement(List, {
  variant: "action",
  items: [{ label: "Documents" }],
  onSelect: () => {},
}));
assert.doesNotMatch(unstableActionListMarkup, /<button/);
assert.doesNotMatch(unstableActionListMarkup, /data-key="Documents"/);
assert.doesNotMatch(unstableActionListMarkup, /Documents/);

const kpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Fuel spend",
  value: "$84.2k",
  delta: "+12% vs last week",
  trend: "up",
  tone: "warning",
  icon: "local_gas_station",
  variant: "delta",
  state: "selected",
  density: "sm",
  selected: true,
  onSelect: () => {},
}));
assert.match(kpiMarkup, /^<article/);
assert.match(kpiMarkup, /class="kpi-tile kpi-tile--warning"/);
assert.match(kpiMarkup, /role="button"/);
assert.match(kpiMarkup, /aria-pressed="true"/);
assert.match(kpiMarkup, /data-variant="delta"/);
assert.match(kpiMarkup, /data-state="selected"/);
assert.match(kpiMarkup, /data-density="sm"/);
assert.match(kpiMarkup, /class="kpi-tile__label">Fuel spend<\/span>/);
assert.match(kpiMarkup, /class="kpi-tile__icon"/);
assert.match(kpiMarkup, /class="kpi-tile__value">\$84\.2k<\/strong>/);
assert.match(kpiMarkup, /class="kpi-tile__delta" data-trend="up"/);
assert.match(kpiMarkup, /trending_up/);

const inheritedKpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Inherited KPI density",
  value: "42",
}));
assert.doesNotMatch(inheritedKpiMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);

const kpiLinkMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Cards at risk",
  value: "18",
  href: "#cards",
  variant: "drill-in",
}));
assert.match(kpiLinkMarkup, /^<a/);
assert.match(kpiLinkMarkup, /href="#cards"/);
assert.match(kpiLinkMarkup, /class="kpi-tile__affordance"/);

const kpiSparklineMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Resolved cases",
  value: "94%",
  variant: "sparkline",
  values: [20, 28, 36],
}));
assert.match(kpiSparklineMarkup, /class="kpi-tile__sparkline"/);
assert.match(kpiSparklineMarkup, /<polyline points="/);
const unnamedInteractiveKpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  variant: "drill-in",
  onSelect: () => {},
  href: "#missing-copy",
}));
assert.equal(unnamedInteractiveKpiMarkup, "");
assert.doesNotMatch(unnamedInteractiveKpiMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /role="button"|tabIndex=|href=|aria-label=/);
assert.doesNotMatch(unnamedInteractiveKpiMarkup, /class="kpi-tile__affordance"/);
const inertDrillInKpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Cards at risk",
  value: "18",
  variant: "drill-in",
}));
assert.match(inertDrillInKpiMarkup, /^<article/);
assert.doesNotMatch(inertDrillInKpiMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /role="button"|tabIndex=|href=/);
assert.doesNotMatch(inertDrillInKpiMarkup, /class="kpi-tile__affordance"/);

const treeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  label: "Fleet hierarchy",
  density: "sm",
  nodes: [
    { key: "fleet", label: "Fleet", level: 1, expanded: true, icon: "account_tree" },
    { key: "cards", label: "Cards", level: 2, selected: true },
    { key: "card-4821", label: "Card 4821", level: 5 },
  ],
}));
assert.match(treeViewMarkup, /^<ul/);
assert.match(treeViewMarkup, /class="tree-view"/);
assert.match(treeViewMarkup, /role="tree"/);
assert.match(treeViewMarkup, /aria-label="Fleet hierarchy"/);
assert.match(treeViewMarkup, /data-density="sm"/);
assert.match(treeViewMarkup, /data-tree-item=""/);
assert.match(treeViewMarkup, /data-level="5"/);
assert.match(treeViewMarkup, /data-expanded="true"/);
assert.match(treeViewMarkup, /data-selected="true"/);
assert.match(treeViewMarkup, /aria-level="5"/);
assert.match(treeViewMarkup, /aria-expanded="true"/);
assert.match(treeViewMarkup, /aria-selected="true"/);
assert.match(treeViewMarkup, /data-tree-control=""/);
assert.match(treeViewMarkup, /role="treeitem"/);
assert.equal((treeViewMarkup.match(/aria-expanded=/g) ?? []).length, 1);
assert.equal((treeViewMarkup.match(/aria-selected=/g) ?? []).length, 3);
assert.doesNotMatch(treeViewMarkup, /style="/);
const inheritedTreeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  label: "Inherited tree",
  nodes: [{ key: "root", label: "Root", level: 1 }],
}));
assert.doesNotMatch(inheritedTreeViewMarkup.match(/^<ul[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedTreeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  nodes: [{ id: "root" }],
}));
assert.doesNotMatch(unnamedTreeViewMarkup, /Tree view|Tree item 1/);
assert.doesNotMatch(unnamedTreeViewMarkup, /role="treeitem"/);
assert.doesNotMatch(unnamedTreeViewMarkup.match(/^<ul[^>]+>/)?.[0] ?? "", /aria-label=/);
const unstableTreeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  label: "Unstable tree",
  nodes: [{ label: "Root", level: 1 }],
}));
assert.doesNotMatch(unstableTreeViewMarkup, /role="treeitem"/);
assert.doesNotMatch(unstableTreeViewMarkup, /tree-item-0|data-key="Root"/);

const cardMarkup = renderToStaticMarkup(React.createElement(Card, {
  title: "Wallet balance",
  value: "8,412.50",
  unit: "$",
  detail: "Available for assigned drivers.",
  status: "Healthy",
  icon: "account_balance_wallet",
  density: "sm",
  fullWidth: true,
  actions: [
    { key: "details", label: "Details", variant: "secondary" },
    { key: "more", icon: "more_horiz", label: "More", iconOnly: true },
  ],
}));
assert.match(cardMarkup, /^<article/);
assert.match(cardMarkup, /class="card"/);
assert.match(cardMarkup, /data-variant="default"/);
assert.match(cardMarkup, /data-composition="standard"/);
assert.match(cardMarkup, /data-state="default"/);
assert.match(cardMarkup, /data-density="sm"/);
assert.match(cardMarkup, /data-full-width="true"/);
assert.match(cardMarkup, /data-interactive="false"/);
assert.match(cardMarkup, /class="card__icon"/);
assert.match(cardMarkup, /class="card__title">Wallet balance<\/h3>/);
assert.match(cardMarkup, /class="card__status">Healthy<\/span>/);
assert.match(cardMarkup, /class="card__value">8,412\.50<\/p>/);
assert.match(cardMarkup, /class="card__detail">Available for assigned drivers\.<\/p>/);
assert.match(cardMarkup, /class="card__actions"/);
assert.match(cardMarkup, /class="button button--secondary"/);
assert.match(cardMarkup, /class="icon-button icon-button--ghost"/);

const unnamedCardActionMarkup = renderToStaticMarkup(React.createElement(Card, {
  title: "Card controls",
  actions: [{ key: "more", icon: "more_horiz", iconOnly: true }],
}));
assert.doesNotMatch(unnamedCardActionMarkup, /Card action/);
assert.doesNotMatch(unnamedCardActionMarkup, /class="card__actions"/);
assert.doesNotMatch(unnamedCardActionMarkup, /class="icon-button/);
const unstableCardActionMarkup = renderToStaticMarkup(React.createElement(Card, {
  title: "Card controls",
  actions: [{ label: "Details" }],
}));
assert.doesNotMatch(unstableCardActionMarkup, /class="card__actions"/);
assert.doesNotMatch(unstableCardActionMarkup, /class="button/);

const selectedCardMarkup = renderToStaticMarkup(React.createElement(Card, {
  title: "Driver card",
  actionKey: "driver-card",
  selected: true,
  interactive: true,
  onAction: () => {},
  composition: "stats",
  unit: "$",
  value: "1200",
  status: "Up",
  trend: "up",
}));
assert.match(selectedCardMarkup, /role="button"/);
assert.match(selectedCardMarkup, /aria-pressed="true"/);
assert.match(selectedCardMarkup, /data-state="selected"/);
assert.match(selectedCardMarkup, /data-composition="stats"/);
assert.match(selectedCardMarkup, /data-trend="up"/);
assert.match(selectedCardMarkup, />\$1200</);
const unnamedInteractiveCardMarkup = renderToStaticMarkup(React.createElement(Card, {
  interactive: true,
  onAction: () => {},
}));
assert.match(unnamedInteractiveCardMarkup, /^<article/);
assert.match(unnamedInteractiveCardMarkup, /data-interactive="false"/);
assert.doesNotMatch(unnamedInteractiveCardMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /role="button"|tabIndex=|aria-pressed=/);
const unstableInteractiveCardMarkup = renderToStaticMarkup(React.createElement(Card, {
  title: "Driver card",
  interactive: true,
  onAction: () => {},
}));
assert.match(unstableInteractiveCardMarkup, /data-interactive="false"/);
assert.doesNotMatch(unstableInteractiveCardMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /role="button"|tabIndex=|aria-pressed=/);

const loadingCardMarkup = renderToStaticMarkup(React.createElement(Card, {
  title: "Loading card",
  loading: true,
  value: "Loading",
}));
assert.match(loadingCardMarkup, /data-state="loading"/);
assert.match(loadingCardMarkup, /aria-busy="true"/);
assert.match(loadingCardMarkup, /class="spinner"/);
assert.doesNotMatch(loadingCardMarkup, /Loading card loading/);

const avatarMarkup = renderToStaticMarkup(React.createElement(Avatar, {
  name: "Ana Sosa",
  status: "online",
  density: "lg",
}));
assert.match(avatarMarkup, /^<span/);
assert.match(avatarMarkup, /class="avatar"/);
assert.match(avatarMarkup, /data-density="lg"/);
assert.match(avatarMarkup, /aria-label="Ana Sosa"/);
assert.match(avatarMarkup, /data-status="online"/);
assert.match(avatarMarkup, /data-state="online"/);
assert.match(avatarMarkup, /data-color-index=/);
assert.match(avatarMarkup, /class="avatar__initials"/);
assert.match(avatarMarkup, />AS<\/span>/);
assert.match(avatarMarkup, /class="avatar__status"/);

const imageAvatarMarkup = renderToStaticMarkup(React.createElement(Avatar, {
  name: "Luis Vera",
  src: "/avatars/luis.png",
  size: "lg",
  state: "disabled",
}));
assert.match(imageAvatarMarkup, /class="avatar avatar--lg"/);
assert.match(imageAvatarMarkup, /data-state="disabled"/);
assert.match(imageAvatarMarkup, /src="\/avatars\/luis.png"/);
assert.match(imageAvatarMarkup, /alt="Luis Vera"/);
const unnamedAvatarMarkup = renderToStaticMarkup(React.createElement(Avatar));
assert.doesNotMatch(unnamedAvatarMarkup, /Unknown avatar/);
assert.doesNotMatch(unnamedAvatarMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /aria-label=/);

const badgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "3",
  variant: "count",
  tone: "danger",
  live: true,
  ariaLabel: "3 alerts",
}));
assert.match(badgeMarkup, /class="badge"/);
assert.match(badgeMarkup, /data-variant="count"/);
assert.match(badgeMarkup, /data-tone="danger"/);
assert.match(badgeMarkup, /data-state="default"/);
assert.match(badgeMarkup, /role="status"/);
assert.match(badgeMarkup, /aria-live="polite"/);
assert.match(badgeMarkup, /aria-label="3 alerts"/);
assert.match(badgeMarkup, /data-live="true"/);
assert.match(badgeMarkup, /class="badge__live"/);
assert.match(badgeMarkup, /class="badge__label">3<\/span>/);

const iconBadgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "!",
  variant: "icon",
  tone: "warning",
  icon: "priority_high",
  state: "focus",
}));
assert.match(iconBadgeMarkup, /data-variant="icon"/);
assert.match(iconBadgeMarkup, /data-state="focus"/);
assert.match(iconBadgeMarkup, /class="badge__icon"/);

const dotBadgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "Unread",
  variant: "dot",
  ariaLabel: "Unread updates",
}));
assert.match(dotBadgeMarkup, /data-variant="dot"/);
assert.match(dotBadgeMarkup, /aria-label="Unread updates"/);
assert.doesNotMatch(dotBadgeMarkup, /class="badge__label"/);

const hiddenBadgeMarkup = renderToStaticMarkup(React.createElement(Badge, {
  label: "0",
  hidden: true,
}));
assert.match(hiddenBadgeMarkup, /hidden=""/);
assert.match(hiddenBadgeMarkup, /data-state="hidden"/);

const breadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  label: "Fleet path",
  collapsedLabel: "Hidden breadcrumb items",
  variant: "overflow",
  state: "collapsed",
  density: "sm",
  maxItems: 4,
  items: [
    { label: "Fleet", href: "#/fleet" },
    { label: "Regions", href: "#/regions" },
    { label: "North", href: "#/north" },
    { label: "Cards", href: "#/cards" },
    { id: "jmx-214-b", label: "JMX-214-B", current: true },
  ],
}));
assert.match(breadcrumbsMarkup, /^<nav/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs"/);
assert.match(breadcrumbsMarkup, /aria-label="Fleet path"/);
assert.match(breadcrumbsMarkup, /data-variant="overflow"/);
assert.match(breadcrumbsMarkup, /data-state="collapsed"/);
assert.match(breadcrumbsMarkup, /data-density="sm"/);
assert.match(breadcrumbsMarkup, /<ol>/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs__item"/);
assert.match(breadcrumbsMarkup, /href="#\/fleet"/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs__target breadcrumbs__target--collapsed"/);
assert.match(breadcrumbsMarkup, /aria-label="Hidden breadcrumb items"/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs__separator"/);
assert.match(breadcrumbsMarkup, /aria-current="page"/);
assert.match(breadcrumbsMarkup, />JMX-214-B<\/span>/);
const unnamedBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  variant: "overflow",
  maxItems: 3,
  items: [
    { href: "#/empty" },
    { label: "Fleet", href: "#/fleet" },
    { label: "Regions", href: "#/regions" },
    { id: "cards", label: "Cards", current: true },
  ],
}));
assert.doesNotMatch(unnamedBreadcrumbsMarkup, /Breadcrumbs|Collapsed breadcrumb items/);
assert.doesNotMatch(unnamedBreadcrumbsMarkup.match(/^<nav[^>]+>/)?.[0] ?? "", /aria-label=/);
assert.doesNotMatch(unnamedBreadcrumbsMarkup, /#\/empty/);
const nonNavigableBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  items: [
    { id: "fleet", label: "Fleet" },
    { id: "vehicle", label: "Vehicle", current: true },
  ],
}));
assert.doesNotMatch(nonNavigableBreadcrumbsMarkup, /href="#"/);
assert.match(nonNavigableBreadcrumbsMarkup, />Fleet<\/span>/);
const actionBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  items: [
    { id: "fleet", label: "Fleet", onClick: () => {} },
    { id: "vehicle", label: "Vehicle", current: true },
  ],
}));
assert.match(actionBreadcrumbsMarkup, /<button type="button" class="breadcrumbs__target">Fleet<\/button>/);
assert.doesNotMatch(actionBreadcrumbsMarkup, /href="#"/);
const unstableBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  items: [
    { label: "Fleet" },
    { label: "Vehicle", current: true },
  ],
}));
assert.doesNotMatch(unstableBreadcrumbsMarkup, /Fleet|Vehicle|breadcrumbs__target/);

const tabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  selectedKey: "cards",
  variant: "underline",
  items: [
    { key: "drivers", label: "Drivers", icon: "person" },
    { key: "cards", label: "Cards", badge: { label: "8", variant: "count", tone: "neutral" } },
  ],
}));
assert.match(tabsMarkup, /^<div/);
assert.match(tabsMarkup, /class="tabs"/);
assert.match(tabsMarkup, /role="tablist"/);
assert.match(tabsMarkup, /aria-label="Fleet views"/);
assert.match(tabsMarkup, /data-variant="underline"/);
assert.match(tabsMarkup, /data-tabs-item=""/);
assert.match(tabsMarkup, /aria-selected="true"/);
assert.match(tabsMarkup, /class="tabs__icon"/);
assert.match(tabsMarkup, /class="tabs__label">Cards<\/span>/);
assert.match(tabsMarkup, /class="badge"/);
const countOnlyTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  items: [{ key: "cards", label: "Cards", count: 8 }],
}));
assert.doesNotMatch(countOnlyTabsMarkup, /class="badge"|aria-label=""/);
const incompleteBadgeTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  items: [{ key: "cards", label: "Cards", badge: { count: 8 } }],
}));
assert.doesNotMatch(incompleteBadgeTabsMarkup, /class="badge"|aria-label=""/);
const unnamedTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  items: [{ key: "overview", icon: "dashboard" }],
}));
assert.doesNotMatch(unnamedTabsMarkup, /aria-label="Tabs"|Tab 1/);
assert.doesNotMatch(unnamedTabsMarkup, /role="tab"/);
const unstableTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  items: [{ label: "Cards" }],
}));
assert.doesNotMatch(unstableTabsMarkup, /role="tab"/);
assert.doesNotMatch(unstableTabsMarkup, /data-key="Cards"|tab-1/);

const paginationMarkup = renderToStaticMarkup(React.createElement(Pagination, {
  label: "Fleet pages",
  previousLabel: "Previous fleet page",
  nextLabel: "Next fleet page",
  getPageLabel: (page) => `Fleet page ${page}`,
  page: 4,
  pageCount: 12,
  state: "selected",
  density: "sm",
  fullWidth: true,
}));
assert.match(paginationMarkup, /^<nav/);
assert.match(paginationMarkup, /class="pagination"/);
assert.match(paginationMarkup, /aria-label="Fleet pages"/);
assert.match(paginationMarkup, /data-variant="numbered"/);
assert.match(paginationMarkup, /data-state="selected"/);
assert.match(paginationMarkup, /data-density="sm"/);
assert.match(paginationMarkup, /data-page="4"/);
assert.match(paginationMarkup, /data-page-count="12"/);
assert.match(paginationMarkup, /data-full-width="true"/);
assert.match(paginationMarkup, /class="pagination__button"/);
assert.match(paginationMarkup, /data-kind="prev"/);
assert.match(paginationMarkup, /data-kind="next"/);
assert.match(paginationMarkup, /class="pagination__ellipsis"/);
assert.match(paginationMarkup, /aria-current="page"/);
assert.match(paginationMarkup, /class="pagination__icon"/);
assert.match(paginationMarkup, /aria-label="Previous fleet page"/);
assert.match(paginationMarkup, /aria-label="Fleet page 4"/);
assert.match(paginationMarkup, /aria-label="Next fleet page"/);
const unnamedPaginationMarkup = renderToStaticMarkup(React.createElement(Pagination, {
  pageCount: 3,
}));
assert.equal(unnamedPaginationMarkup, "");
assert.doesNotMatch(unnamedPaginationMarkup, /Pagination|Previous page|Next page|Page 1/);
assert.doesNotMatch(unnamedPaginationMarkup.match(/^<nav[^>]+>/)?.[0] ?? "", /aria-label=/);
assert.doesNotMatch(unnamedPaginationMarkup, /data-kind="prev"|data-kind="next"/);
assert.doesNotMatch(unnamedPaginationMarkup, /class="pagination__icon"/);

const tableColumns = [
  { key: "plate", label: "Plate", mono: true, sortable: true },
  { key: "status", label: "Status" },
  { key: "spend", label: "Spend", align: "right", mono: true, sortable: true, sortValue: (row) => row.spendValue },
];
const tableRows = [
  { id: "mx-1", plate: "JMX-214-B", status: { label: "Active", tone: "success" }, spend: "$842", spendValue: 842, detail: "Last fuel stop 08:30" },
  { id: "mx-2", plate: "JMX-778-C", status: { label: "Review", tone: "warning" }, spend: "$420", spendValue: 420 },
];
const tableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Fleet spend",
  rowKey: "id",
  variant: "sortable",
  density: "sm",
  sortKey: "spend",
  selectedKey: "mx-1",
  columns: tableColumns,
  rows: tableRows,
}));
assert.match(tableMarkup, /^<div/);
assert.match(tableMarkup, /class="table"/);
assert.match(tableMarkup, /data-variant="sortable"/);
assert.match(tableMarkup, /data-state="sorted"/);
assert.match(tableMarkup, /data-density="sm"/);
assert.match(tableMarkup, /aria-label="Fleet spend"/);
assert.match(tableMarkup, /aria-sort="ascending"/);
assert.match(tableMarkup, /class="table__sort"/);
assert.match(tableMarkup, /data-table-sort=""/);
assert.match(tableMarkup, /data-selected="true"/);
assert.match(tableMarkup, /class="badge"/);
assert.match(tableMarkup, /data-align="right"/);
assert.match(tableMarkup, /data-mono="true"/);

const inheritedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Inherited fleet density",
  rowKey: "id",
  columns: tableColumns,
  rows: tableRows,
}));
assert.doesNotMatch(inheritedTableMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  columns: tableColumns,
  rows: tableRows,
}));
assert.equal(unnamedTableMarkup, "");
assert.doesNotMatch(unnamedTableMarkup, /class="table"|aria-label="Table"/);
const unlabeledColumnTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Guarded columns",
  variant: "sortable",
  columns: [
    { key: "plate", sortable: true },
    { key: "status", label: "Status" },
  ],
  rows: tableRows,
}));
assert.doesNotMatch(unlabeledColumnTableMarkup, /<span>plate<\/span>|<th[^>]*>plate<\/th>/);
assert.match(unlabeledColumnTableMarkup, />Status</);

const unstableRowTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Guarded rows",
  rowKey: "id",
  columns: tableColumns.slice(0, 2),
  rows: [{ plate: "NO-ID", status: "Draft" }],
}));
assert.equal(unstableRowTableMarkup, "");
assert.doesNotMatch(unstableRowTableMarkup, /NO-ID|data-key="undefined"/);

const decorativeSelectedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Decorative selected table",
  rowKey: "id",
  state: "selected",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
}));
assert.match(decorativeSelectedTableMarkup, /data-state="selected"/);
assert.doesNotMatch(decorativeSelectedTableMarkup, /data-selected="true"/);

const expandableTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Expandable fleet",
  getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
  rowKey: "id",
  variant: "expandable",
  state: "expanded",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
  expandedKey: "mx-1",
}));
assert.match(expandableTableMarkup, /data-variant="expandable"/);
assert.match(expandableTableMarkup, /data-state="expanded"/);
assert.match(expandableTableMarkup, /aria-expanded="true"/);
assert.match(expandableTableMarkup, /aria-label="Close JMX-214-B"/);
assert.match(expandableTableMarkup, /class="table__expander"/);
assert.match(expandableTableMarkup, /class="table__detail-row"/);
assert.match(expandableTableMarkup, /class="table__detail"[^>]*>Last fuel stop 08:30/);
const unlabeledExpandableTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Unlabeled expandable fleet",
  rowKey: "id",
  variant: "expandable",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
  expandedKey: "mx-1",
}));
assert.doesNotMatch(unlabeledExpandableTableMarkup, /class="table__expander"/);
assert.doesNotMatch(unlabeledExpandableTableMarkup, /class="table__detail-row"/);
assert.doesNotMatch(unlabeledExpandableTableMarkup, /aria-expanded=/);

const decorativeExpandedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Decorative expandable fleet",
  getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
  rowKey: "id",
  variant: "expandable",
  state: "expanded",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
}));
assert.match(decorativeExpandedTableMarkup, /data-state="expanded"/);
assert.doesNotMatch(decorativeExpandedTableMarkup, /aria-expanded="true"/);

const chipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Active",
  variant: "filter",
  tone: "warning",
  selected: true,
  removable: true,
  icon: "filter_alt",
  onRemoveLabel: "Remove Active",
}));
assert.match(chipMarkup, /^<button/);
assert.match(chipMarkup, /class="chip"/);
assert.match(chipMarkup, /data-variant="filter"/);
assert.match(chipMarkup, /data-tone="warning"/);
assert.match(chipMarkup, /data-state="selected"/);
assert.match(chipMarkup, /data-selected="true"/);
assert.match(chipMarkup, /data-chip-remove="true"/);
assert.match(chipMarkup, /aria-pressed="true"/);
assert.match(chipMarkup, /aria-label="Remove Active"/);
assert.match(chipMarkup, /class="chip__icon"/);
assert.match(chipMarkup, /class="chip__label">Active<\/span>/);
assert.match(chipMarkup, /class="chip__remove"/);
const unnamedRemoveChipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Active",
  removable: true,
}));
assert.doesNotMatch(unnamedRemoveChipMarkup, /Remove Active|Remove chip/);
assert.match(unnamedRemoveChipMarkup, /^<span/);
assert.doesNotMatch(unnamedRemoveChipMarkup, /data-chip-remove="true"/);
assert.doesNotMatch(unnamedRemoveChipMarkup, /class="chip__remove"/);

const staticChipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Suggested",
  variant: "suggestion",
}));
assert.match(staticChipMarkup, /^<span/);
assert.match(staticChipMarkup, /data-variant="suggestion"/);
assert.doesNotMatch(staticChipMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /aria-pressed/);

const tagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Policy",
  variant: "link",
  tone: "info",
  state: "focus",
  icon: "verified",
}));
assert.match(tagMarkup, /^<button/);
assert.match(tagMarkup, /class="tag"/);
assert.match(tagMarkup, /data-variant="link"/);
assert.match(tagMarkup, /data-tone="info"/);
assert.match(tagMarkup, /data-state="focus"/);
assert.match(tagMarkup, /data-interactive="true"/);
assert.match(tagMarkup, /class="tag__icon"/);
assert.match(tagMarkup, /class="tag__label">Policy<\/span>/);

const staticTagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Mobile",
  variant: "platform",
  tone: "neutral",
}));
assert.match(staticTagMarkup, /^<span/);
assert.match(staticTagMarkup, /data-variant="platform"/);

const skeletonMarkup = renderToStaticMarkup(React.createElement(Skeleton, {
  label: "Table loading",
  variant: "table",
  rows: 2,
  columns: 3,
  fullWidth: true,
}));
assert.match(skeletonMarkup, /class="skeleton skeleton--table"/);
assert.match(skeletonMarkup, /role="status"/);
assert.match(skeletonMarkup, /aria-busy="true"/);
assert.match(skeletonMarkup, /aria-label="Table loading"/);
assert.match(skeletonMarkup, /data-variant="table"/);
assert.match(skeletonMarkup, /data-rows="2"/);
assert.match(skeletonMarkup, /data-columns="3"/);
assert.match(skeletonMarkup, /--skeleton-columns:3/);
assert.equal((skeletonMarkup.match(/class="skeleton__row"/g) ?? []).length, 2);
assert.equal((skeletonMarkup.match(/class="skeleton__bone skeleton__cell"/g) ?? []).length, 6);
const unnamedSkeletonMarkup = renderToStaticMarkup(React.createElement(Skeleton));
assert.equal(unnamedSkeletonMarkup, "");
assert.doesNotMatch(unnamedSkeletonMarkup, /Content loading/);
assert.doesNotMatch(unnamedSkeletonMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /aria-label=/);

const progressIndicatorMarkup = renderToStaticMarkup(React.createElement(ProgressIndicator, {
  label: "Documents",
  value: 75,
  max: 100,
  showValue: true,
  tone: "success",
  state: "active",
  density: "lg",
  fullWidth: true,
  id: "docs-progress",
}));
assert.match(progressIndicatorMarkup, /^<div/);
assert.match(progressIndicatorMarkup, /class="progress"/);
assert.match(progressIndicatorMarkup, /role="progressbar"/);
assert.match(progressIndicatorMarkup, /id="docs-progress"/);
assert.match(progressIndicatorMarkup, /aria-labelledby="docs-progress-label"/);
assert.match(progressIndicatorMarkup, /aria-valuemin="0"/);
assert.match(progressIndicatorMarkup, /aria-valuemax="100"/);
assert.match(progressIndicatorMarkup, /aria-valuenow="75"/);
assert.match(progressIndicatorMarkup, /data-tone="success"/);
assert.match(progressIndicatorMarkup, /data-state="active"/);
assert.match(progressIndicatorMarkup, /data-density="lg"/);
assert.match(progressIndicatorMarkup, /data-full-width="true"/);
assert.match(progressIndicatorMarkup, /data-indeterminate="false"/);
assert.match(progressIndicatorMarkup, /class="progress__label" id="docs-progress-label">Documents<\/span>/);
assert.match(progressIndicatorMarkup, /class="progress__value">75%<\/span>/);
assert.match(progressIndicatorMarkup, /class="progress__track"/);
assert.match(progressIndicatorMarkup, /<progress class="progress__meter" max="100" value="75"/);
assert.doesNotMatch(progressIndicatorMarkup, /style="/);

const indeterminateProgressMarkup = renderToStaticMarkup(React.createElement(ProgressIndicator, {
  label: "Syncing policies",
  ariaValueText: "Syncing policies",
  indeterminate: true,
}));
assert.match(indeterminateProgressMarkup, /data-indeterminate="true"/);
assert.match(indeterminateProgressMarkup, /aria-valuetext="Syncing policies"/);
assert.doesNotMatch(indeterminateProgressMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /aria-valuenow=/);
assert.doesNotMatch(indeterminateProgressMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /aria-valuemax=/);
assert.doesNotMatch(indeterminateProgressMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);

const completeProgressMarkup = renderToStaticMarkup(React.createElement(ProgressIndicator, {
  label: "Upload",
  value: 12,
  max: 24,
  state: "complete",
  showValue: true,
  ariaValueText: "Upload complete",
}));
assert.match(completeProgressMarkup, /data-state="complete"/);
assert.match(completeProgressMarkup, /aria-valuenow="24"/);
assert.match(completeProgressMarkup, /aria-valuetext="Upload complete"/);
assert.match(completeProgressMarkup, /class="progress__value">100%<\/span>/);
const unnamedProgressMarkup = renderToStaticMarkup(React.createElement(ProgressIndicator));
assert.doesNotMatch(unnamedProgressMarkup, /class="progress"|role="progressbar"|aria-label="Progress"|In progress|Complete|Unavailable/);

const spinnerMarkup = renderToStaticMarkup(React.createElement(Spinner, {
  label: "Loading route",
  tone: "success",
  state: "loading",
  density: "sm",
}));
assert.match(spinnerMarkup, /^<span/);
assert.match(spinnerMarkup, /class="spinner"/);
assert.match(spinnerMarkup, /role="status"/);
assert.match(spinnerMarkup, /aria-label="Loading route"/);
assert.match(spinnerMarkup, /data-density="sm"/);
assert.match(spinnerMarkup, /data-tone="success"/);
assert.match(spinnerMarkup, /data-state="loading"/);
assert.match(spinnerMarkup, /class="spinner__svg"/);
assert.match(spinnerMarkup, /class="spinner__track"/);
assert.match(spinnerMarkup, /class="spinner__arc"/);

const inheritedSpinnerMarkup = renderToStaticMarkup(React.createElement(Spinner, {
  label: "Loading inherited density",
}));
assert.doesNotMatch(inheritedSpinnerMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedSpinnerMarkup = renderToStaticMarkup(React.createElement(Spinner));
assert.doesNotMatch(unnamedSpinnerMarkup, /Loading/);
assert.doesNotMatch(unnamedSpinnerMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /aria-label=/);
assert.doesNotMatch(unnamedSpinnerMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /role="status"/);
assert.match(unnamedSpinnerMarkup, /aria-hidden="true"/);

const decorativeSpinnerMarkup = renderToStaticMarkup(React.createElement(Spinner, {
  decorative: true,
}));
assert.doesNotMatch(decorativeSpinnerMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /role=/);
assert.match(decorativeSpinnerMarkup, /aria-hidden="true"/);
assert.doesNotMatch(decorativeSpinnerMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /aria-label=/);
assert.match(decorativeSpinnerMarkup, /data-state="decorative"/);

const sliderMarkup = renderToStaticMarkup(React.createElement(Slider, {
  label: "Search radius",
  value: 9,
  min: 0,
  max: 12,
  step: 1,
  unit: " km",
  variant: "stepped",
  state: "focus",
  density: "lg",
  name: "radius",
}));
assert.match(sliderMarkup, /class="slider"/);
assert.match(sliderMarkup, /data-variant="stepped"/);
assert.match(sliderMarkup, /data-state="focus"/);
assert.match(sliderMarkup, /data-density="lg"/);
assert.match(sliderMarkup, /data-value="9"/);
assert.match(sliderMarkup, /data-unit=" km"/);
assert.match(sliderMarkup, /data-pct="75"/);
assert.match(sliderMarkup, /class="slider__label">Search radius<\/span>/);
assert.match(sliderMarkup, /class="slider__value" data-slider-output="">9 km<\/output>/);
assert.match(sliderMarkup, /type="range"/);
assert.match(sliderMarkup, /class="slider__input"/);
assert.match(sliderMarkup, /name="radius"/);
assert.match(sliderMarkup, /min="0"/);
assert.match(sliderMarkup, /max="12"/);
assert.match(sliderMarkup, /step="1"/);
assert.match(sliderMarkup, /aria-valuetext="9 km"/);
assert.match(sliderMarkup, /class="slider__track"/);
assert.match(sliderMarkup, /class="slider__fill"/);
assert.match(sliderMarkup, /class="slider__thumb"/);
const inheritedSliderMarkup = renderToStaticMarkup(React.createElement(Slider, {
  label: "Inherited radius",
}));
assert.doesNotMatch(inheritedSliderMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedSliderMarkup = renderToStaticMarkup(React.createElement(Slider));
assert.equal(unnamedSliderMarkup, "");

const stepperMarkup = renderToStaticMarkup(React.createElement(Stepper, {
  label: "Setup progress",
  current: 1,
  orientation: "vertical",
  density: "lg",
  steps: [
    { id: "vehicle", label: "Vehicle", description: "Basic data" },
    { id: "driver", label: "Driver", description: "Assignment" },
    { id: "confirm", label: "Confirm", description: "Review" },
  ],
}));
assert.match(stepperMarkup, /^<ol/);
assert.match(stepperMarkup, /class="stepper"/);
assert.match(stepperMarkup, /aria-label="Setup progress"/);
assert.match(stepperMarkup, /data-orientation="vertical"/);
assert.match(stepperMarkup, /data-density="lg"/);
assert.match(stepperMarkup, /data-current="1"/);
assert.match(stepperMarkup, /class="stepper__item" data-state="complete"/);
assert.match(stepperMarkup, /class="stepper__item" data-state="active" aria-current="step"/);
assert.match(stepperMarkup, /class="stepper__marker"/);
assert.match(stepperMarkup, />check<\/span>/);
assert.match(stepperMarkup, /class="stepper__connector" data-state="complete"/);
assert.match(stepperMarkup, /class="stepper__text"/);
assert.match(stepperMarkup, /<strong>Driver<\/strong>/);

const unnamedStepperMarkup = renderToStaticMarkup(React.createElement(Stepper, {
  steps: [{ id: "vehicle" }],
}));
assert.equal(unnamedStepperMarkup, "");
const unstableStepperMarkup = renderToStaticMarkup(React.createElement(Stepper, {
  label: "Setup progress",
  steps: [{ label: "Vehicle" }],
}));
assert.doesNotMatch(unstableStepperMarkup, /class="stepper__item"|step-Vehicle|step-0|Vehicle/);

const emptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "No vehicles match",
  description: "Adjust search or status filters.",
  icon: "search_off",
  variant: "search-empty",
  state: "action",
  density: "sm",
  fullWidth: true,
  action: { key: "clear-filters", label: "Clear filters", variant: "secondary", icon: "filter_alt_off" },
}));
assert.match(emptyStateMarkup, /^<section/);
assert.match(emptyStateMarkup, /class="empty-state"/);
assert.match(emptyStateMarkup, /aria-labelledby=/);
assert.match(emptyStateMarkup, /data-variant="search-empty"/);
assert.match(emptyStateMarkup, /data-state="action"/);
assert.match(emptyStateMarkup, /data-density="sm"/);
assert.match(emptyStateMarkup, /data-full-width="true"/);
assert.match(emptyStateMarkup, /class="empty-state__icon"/);
assert.match(emptyStateMarkup, />search_off<\/span>/);
assert.match(emptyStateMarkup, /class="empty-state__title"/);
assert.match(emptyStateMarkup, />No vehicles match<\/h3>/);
assert.match(emptyStateMarkup, /class="empty-state__description"/);
assert.match(emptyStateMarkup, /class="button button--secondary"/);

const loadingEmptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "Loading vehicles",
  state: "loading",
}));
assert.match(loadingEmptyStateMarkup, /data-state="loading"/);
assert.match(loadingEmptyStateMarkup, /class="spinner"/);
assert.doesNotMatch(loadingEmptyStateMarkup, /Loading empty state/);

const inheritedEmptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "Inherited empty density",
  action: { key: "retry", label: "Retry" },
}));
assert.doesNotMatch(inheritedEmptyStateMarkup.match(/^<section[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedEmptyStateMarkup.match(/<button[^>]+>/)?.[0] ?? "", /data-density=/);

const unstableEmptyStateActionMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "No vehicles match",
  action: { label: "Clear filters" },
}));
assert.doesNotMatch(unstableEmptyStateActionMarkup, /class="button/);
const labelOnlyEmptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  label: "No vehicles match",
  description: "Alias copy",
}));
assert.doesNotMatch(labelOnlyEmptyStateMarkup, /empty-state|No vehicles match|Alias copy/);

const errorPanelMarkup = renderToStaticMarkup(React.createElement(ErrorPanel, {
  label: "Sync failed",
  description: "We could not load the latest card data.",
  tone: "warning",
  variant: "blocking",
  state: "warning",
  density: "sm",
  fullWidth: true,
  action: { key: "try-again", label: "Try again", icon: "refresh" },
}));
assert.match(errorPanelMarkup, /^<section/);
assert.match(errorPanelMarkup, /class="error-panel error-panel--warning"/);
assert.match(errorPanelMarkup, /role="status"/);
assert.match(errorPanelMarkup, /data-variant="blocking"/);
assert.match(errorPanelMarkup, /data-state="warning"/);
assert.match(errorPanelMarkup, /data-density="sm"/);
assert.match(errorPanelMarkup, /data-full-width="true"/);
assert.match(errorPanelMarkup, /class="error-panel__icon"/);
assert.match(errorPanelMarkup, />warning<\/span>/);
assert.match(errorPanelMarkup, /class="error-panel__content"/);
assert.match(errorPanelMarkup, /<strong>Sync failed<\/strong>/);
assert.match(errorPanelMarkup, /<p>We could not load the latest card data\.<\/p>/);
assert.match(errorPanelMarkup, /class="button button--secondary"/);

const loadingErrorPanelMarkup = renderToStaticMarkup(React.createElement(ErrorPanel, {
  label: "Loading recovery",
  state: "loading",
  action: { key: "wait", label: "Wait" },
}));
assert.match(loadingErrorPanelMarkup, /data-state="loading"/);
assert.match(loadingErrorPanelMarkup, /role="status"/);
assert.match(loadingErrorPanelMarkup, /class="spinner"/);
assert.match(loadingErrorPanelMarkup, /aria-busy="true"/);
assert.doesNotMatch(loadingErrorPanelMarkup, /Loading error panel/);

const inheritedErrorPanelMarkup = renderToStaticMarkup(React.createElement(ErrorPanel, {
  label: "Inherited error density",
  action: { key: "retry", label: "Retry" },
}));
assert.doesNotMatch(inheritedErrorPanelMarkup.match(/^<section[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedErrorPanelMarkup.match(/<button[^>]+>/)?.[0] ?? "", /data-density=/);

const unstableErrorPanelActionMarkup = renderToStaticMarkup(React.createElement(ErrorPanel, {
  label: "Sync failed",
  action: { label: "Retry" },
}));
assert.doesNotMatch(unstableErrorPanelActionMarkup, /class="button/);

const unnamedErrorPanelMarkup = renderToStaticMarkup(React.createElement(ErrorPanel));
assert.doesNotMatch(unnamedErrorPanelMarkup, /aria-label="Error panel"/);

assert.doesNotMatch(staticTagMarkup, /data-interactive/);

const disabledTagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Disabled",
  variant: "link",
  state: "disabled",
}));
assert.match(disabledTagMarkup, /disabled=""/);
assert.match(disabledTagMarkup, /data-state="disabled"/);

const toastMarkup = renderToStaticMarkup(React.createElement(Toast, {
  label: "Route updated",
  description: "The driver received the new route.",
  tone: "success",
  variant: "undo",
  state: "action",
  density: "sm",
  actionLabel: "Undo",
  dismissible: true,
  dismissLabel: "Dismiss route update",
}));
assert.match(toastMarkup, /^<article/);
assert.match(toastMarkup, /class="toast"/);
assert.match(toastMarkup, /role="status"/);
assert.match(toastMarkup, /aria-live="polite"/);
assert.match(toastMarkup, /data-tone="success"/);
assert.match(toastMarkup, /data-variant="undo"/);
assert.match(toastMarkup, /data-state="action"/);
assert.match(toastMarkup, /data-density="sm"/);
assert.match(toastMarkup, /class="toast__icon"/);
assert.match(toastMarkup, />check_circle<\/span>/);
assert.match(toastMarkup, /class="toast__content"/);
assert.match(toastMarkup, /<strong>Route updated<\/strong>/);
assert.match(toastMarkup, /<p>The driver received the new route\.<\/p>/);
assert.match(toastMarkup, /class="button button--ghost toast__action"/);
assert.match(toastMarkup, /data-toast-action=""/);
assert.match(toastMarkup, /class="icon-button icon-button--ghost toast__dismiss"/);
assert.match(toastMarkup, /data-toast-dismiss=""/);

const warningToastMarkup = renderToStaticMarkup(React.createElement(Toast, {
  label: "Policy conflict",
  tone: "warning",
}));
assert.match(warningToastMarkup, /role="alert"/);
assert.match(warningToastMarkup, /aria-live="assertive"/);

const hiddenToastMarkup = renderToStaticMarkup(React.createElement(Toast, {
  label: "Hidden",
  state: "default",
}));
assert.match(hiddenToastMarkup, /hidden=""/);
assert.doesNotMatch(hiddenToastMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedToastMarkup = renderToStaticMarkup(React.createElement(Toast, {
  dismissible: true,
}));
assert.doesNotMatch(unnamedToastMarkup, /aria-label="Notification"/);
assert.doesNotMatch(unnamedToastMarkup, /aria-label="Dismiss notification"/);
assert.doesNotMatch(unnamedToastMarkup, /toast__dismiss/);

const tooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip, {
  triggerLabel: "Info",
  content: "Short contextual help",
  id: "tip-react",
  placement: "right",
  density: "sm",
}));
assert.match(tooltipMarkup, /class="tooltip"/);
assert.match(tooltipMarkup, /data-placement="right"/);
assert.match(tooltipMarkup, /data-density="sm"/);
assert.match(tooltipMarkup, /data-open="false"/);
assert.match(tooltipMarkup, /class="tooltip__trigger"/);
assert.match(tooltipMarkup, /role="tooltip"/);
assert.match(tooltipMarkup, /hidden=""/);

const inheritedTooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip, {
  triggerLabel: "Info",
  content: "Inherited density",
}));
assert.doesNotMatch(inheritedTooltipMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /data-density=/);

const openTooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip, {
  triggerLabel: "Cost",
  content: "Cost per km",
  id: "tip-cost",
  variant: "metric",
  state: "open",
}));
assert.match(openTooltipMarkup, /data-variant="metric"/);
assert.match(openTooltipMarkup, /data-open="true"/);
assert.match(openTooltipMarkup, /aria-describedby="tip-cost"/);
assert.doesNotMatch(openTooltipMarkup, /hidden=""/);

const unnamedTooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip));
assert.equal(unnamedTooltipMarkup, "");

const ariaOnlyTooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip, {
  triggerAriaLabel: "Open help",
  content: "Contextual help",
}));
assert.equal(ariaOnlyTooltipMarkup, "");

const contentlessTooltipMarkup = renderToStaticMarkup(React.createElement(Tooltip, {
  triggerLabel: "Help",
}));
assert.equal(contentlessTooltipMarkup, "");

const popoverMarkup = renderToStaticMarkup(React.createElement(Popover, {
  triggerLabel: "Details",
  title: "Card status",
  description: "Active card",
  id: "card-popover",
  density: "sm",
  variant: "metric",
  placement: "top",
}));
assert.match(popoverMarkup, /^<span/);
assert.match(popoverMarkup, /class="popover"/);
assert.match(popoverMarkup, /data-open="false"/);
assert.match(popoverMarkup, /data-density="sm"/);
assert.match(popoverMarkup, /data-variant="metric"/);
assert.match(popoverMarkup, /data-placement="top"/);
assert.match(popoverMarkup, /class="button button--tertiary popover__trigger"/);
assert.match(popoverMarkup, /data-popover-trigger=""/);
assert.match(popoverMarkup, /aria-haspopup="dialog"/);
assert.match(popoverMarkup, /aria-expanded="false"/);
assert.match(popoverMarkup, /aria-controls="card-popover"/);
assert.match(popoverMarkup, /class="popover__panel"/);
assert.match(popoverMarkup, /hidden=""/);
assert.match(popoverMarkup, /role="dialog"/);

const inheritedPopoverMarkup = renderToStaticMarkup(React.createElement(Popover, {
  triggerLabel: "Details",
  title: "Inherited density",
}));
assert.doesNotMatch(inheritedPopoverMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /data-density=/);

const actionPopoverMarkup = renderToStaticMarkup(React.createElement(Popover, {
  triggerLabel: "Filters",
  title: "Local filters",
  variant: "action",
  open: true,
  actions: [{ label: "Apply", key: "apply", variant: "primary" }],
}));
assert.match(actionPopoverMarkup, /data-open="true"/);
assert.match(actionPopoverMarkup, /aria-expanded="true"/);
assert.doesNotMatch(actionPopoverMarkup, /hidden=""/);
assert.match(actionPopoverMarkup, /class="popover__actions"/);
assert.match(actionPopoverMarkup, /data-popover-action=""/);
assert.match(actionPopoverMarkup, /data-key="apply"/);
const unstablePopoverActionMarkup = renderToStaticMarkup(React.createElement(Popover, {
  triggerLabel: "Filters",
  title: "Local filters",
  variant: "action",
  open: true,
  actions: [{ label: "Apply" }],
}));
assert.doesNotMatch(unstablePopoverActionMarkup, /data-key="Apply"|class="popover__actions"|data-popover-action=""/);

const formPopoverMarkup = renderToStaticMarkup(React.createElement(Popover, {
  triggerLabel: "Edit",
  title: "Local edit",
  variant: "form",
  open: true,
  density: "lg",
  field: { label: "Limit", value: "$500" },
}));
assert.match(formPopoverMarkup, /data-variant="form"/);
assert.match(formPopoverMarkup, /class="field"/);
assert.match(formPopoverMarkup, /data-density="lg"/);
assert.doesNotMatch(formPopoverMarkup, /data-helper=""/);

const unnamedPopoverMarkup = renderToStaticMarkup(React.createElement(Popover));
assert.equal(unnamedPopoverMarkup, "");
assert.doesNotMatch(unnamedPopoverMarkup, /aria-label="Open popover"/);
assert.doesNotMatch(unnamedPopoverMarkup, /aria-label="Popover"/);
assert.doesNotMatch(unnamedPopoverMarkup, /class="button button--secondary popover__trigger"/);

const popoverWithoutTriggerMarkup = renderToStaticMarkup(React.createElement(Popover, {
  title: "Filters",
}));
assert.equal(popoverWithoutTriggerMarkup, "");
assert.doesNotMatch(popoverWithoutTriggerMarkup, /data-popover-trigger=""/);
assert.doesNotMatch(popoverWithoutTriggerMarkup, /class="button button--secondary popover__trigger"/);

const emptyFormPopoverMarkup = renderToStaticMarkup(React.createElement(Popover, {
  triggerLabel: "Edit",
  title: "Local edit",
  variant: "form",
  open: true,
  field: { value: "$500", placeholder: "Limit" },
}));
assert.doesNotMatch(emptyFormPopoverMarkup, /class="field"/);
assert.doesNotMatch(emptyFormPopoverMarkup, /<input/);
assert.doesNotMatch(emptyFormPopoverMarkup, /\$500|Limit/);

const menuMarkup = renderToStaticMarkup(React.createElement(Menu, {
  triggerLabel: "Actions",
  label: "Driver actions",
  open: true,
  variant: "grouped",
  density: "sm",
  align: "end",
  items: [
    { label: "Edit", icon: "edit", key: "edit" },
    { separator: true },
    { label: "Suspend", icon: "block", key: "suspend", tone: "danger", shortcut: "S" },
  ],
}));
assert.match(menuMarkup, /^<span/);
assert.match(menuMarkup, /class="menu"/);
assert.match(menuMarkup, /data-variant="grouped"/);
assert.match(menuMarkup, /data-density="sm"/);
assert.match(menuMarkup, /data-align="end"/);
assert.match(menuMarkup, /data-open="true"/);
assert.match(menuMarkup, /data-state="open"/);
assert.match(menuMarkup, /class="button button--secondary menu__trigger"/);
assert.match(menuMarkup, /aria-haspopup="menu"/);
assert.match(menuMarkup, /aria-expanded="true"/);
assert.match(menuMarkup, /class="menu__panel"/);
assert.match(menuMarkup, /role="menu"/);
assert.match(menuMarkup, /class="menu__separator"/);
assert.match(menuMarkup, /class="menu__item-icon"/);
assert.match(menuMarkup, /class="menu__item-shortcut">S<\/kbd>/);
assert.match(menuMarkup, /data-tone="danger"/);

const iconMenuMarkup = renderToStaticMarkup(React.createElement(Menu, {
  triggerLabel: "More",
  label: "More actions",
  variant: "icon-trigger",
  items: [{ label: "Open", key: "open" }],
}));
assert.match(iconMenuMarkup, /class="icon-button icon-button--ghost menu__trigger"/);

const avatarMenuMarkup = renderToStaticMarkup(React.createElement(Menu, {
  triggerLabel: "Ana Sosa",
  label: "Account menu",
  variant: "avatar-trigger",
  avatarName: "Ana Sosa",
  avatarStatus: "online",
  items: [{ label: "Profile", key: "profile" }],
}));
assert.match(avatarMenuMarkup, /class="menu__trigger menu__trigger--avatar"/);
assert.match(avatarMenuMarkup, /class="avatar avatar--md"/);

const inheritedMenuMarkup = renderToStaticMarkup(React.createElement(Menu, {
  triggerLabel: "Actions",
  label: "Inherited density",
  items: [{ label: "Open", key: "open" }],
}));
assert.doesNotMatch(inheritedMenuMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /data-density=/);

const triggerNamedMenuMarkup = renderToStaticMarkup(React.createElement(Menu, {
  triggerLabel: "Actions",
  open: true,
  items: [{ label: "Open", key: "open" }],
}));
assert.match(triggerNamedMenuMarkup, /role="menu"/);
assert.match(triggerNamedMenuMarkup, /aria-label="Actions"/);

const unnamedMenuMarkup = renderToStaticMarkup(React.createElement(Menu));
assert.equal(unnamedMenuMarkup, "");
assert.doesNotMatch(unnamedMenuMarkup, /aria-label="Open menu"/);
assert.doesNotMatch(unnamedMenuMarkup, /aria-label="Account menu"/);
assert.doesNotMatch(unnamedMenuMarkup, /aria-label="Menu"/);
assert.doesNotMatch(unnamedMenuMarkup, /menu__trigger/);

const unlabeledMenuItemMarkup = renderToStaticMarkup(React.createElement(Menu, {
  triggerLabel: "Actions",
  open: true,
  items: [{ key: "ghost", icon: "more_horiz" }],
}));
assert.equal(unlabeledMenuItemMarkup, "");
assert.doesNotMatch(unlabeledMenuItemMarkup, /role="menuitem"/);
assert.doesNotMatch(unlabeledMenuItemMarkup, /class="menu__item-label"><\/span>/);

const unstableMenuItemMarkup = renderToStaticMarkup(React.createElement(Menu, {
  triggerLabel: "Actions",
  open: true,
  items: [{ label: "Open" }],
}));
assert.equal(unstableMenuItemMarkup, "");
assert.doesNotMatch(unstableMenuItemMarkup, /role="menuitem"/);
assert.doesNotMatch(unstableMenuItemMarkup, /data-key="Open"|data-key="0"/);

const checkboxMarkup = renderToStaticMarkup(React.createElement(Checkbox, {
  label: "Enable fuel card",
  description: "Applies to active drivers.",
  checked: true,
  density: "sm",
  variant: "descriptive",
}));
assert.match(checkboxMarkup, /class="choice checkbox"/);
assert.match(checkboxMarkup, /data-density="sm"/);
assert.match(checkboxMarkup, /data-variant="descriptive"/);
assert.match(checkboxMarkup, /data-state="checked"/);
assert.match(checkboxMarkup, /type="checkbox"/);
assert.match(checkboxMarkup, /aria-checked="true"/);
assert.match(checkboxMarkup, /class="choice__mark"/);
assert.match(checkboxMarkup, /class="choice__indicator material-symbol"/);
assert.match(checkboxMarkup, /class="choice__label">Enable fuel card<\/span>/);
assert.match(checkboxMarkup, /class="choice__description"/);

const radioButtonMarkup = renderToStaticMarkup(React.createElement(RadioButton, {
  label: "Fastest route",
  description: "Prioritize arrival time.",
  checked: true,
  density: "sm",
  name: "route",
  value: "fastest",
}));
assert.match(radioButtonMarkup, /class="choice radio"/);
assert.match(radioButtonMarkup, /data-density="sm"/);
assert.match(radioButtonMarkup, /data-state="selected"/);
assert.match(radioButtonMarkup, /type="radio"/);
assert.match(radioButtonMarkup, /name="route"/);
assert.match(radioButtonMarkup, /class="choice__mark"/);
assert.match(radioButtonMarkup, /class="choice__label">Fastest route<\/span>/);
assert.match(radioButtonMarkup, /class="choice__description"/);

const segmentedControlMarkup = renderToStaticMarkup(React.createElement(SegmentedControl, {
  label: "View mode",
  variant: "icon-only",
  density: "sm",
  selectedKey: "map",
  items: [
    { key: "map", label: "Map", icon: "map" },
    { key: "list", label: "List", icon: "view_list" },
  ],
}));
assert.match(segmentedControlMarkup, /^<div/);
assert.match(segmentedControlMarkup, /class="segmented-control"/);
assert.match(segmentedControlMarkup, /role="tablist"/);
assert.match(segmentedControlMarkup, /aria-label="View mode"/);
assert.match(segmentedControlMarkup, /data-variant="icon-only"/);
assert.match(segmentedControlMarkup, /data-density="sm"/);
assert.match(segmentedControlMarkup, /class="segmented-control__indicator"/);
assert.match(segmentedControlMarkup, /data-segmented-control-item=""/);
assert.match(segmentedControlMarkup, /data-icon-only="true"/);
assert.match(segmentedControlMarkup, /aria-selected="true"/);
assert.match(segmentedControlMarkup, /aria-label="Map"/);
assert.match(segmentedControlMarkup, /class="segmented-control__icon"/);
assert.doesNotMatch(segmentedControlMarkup, /style="/);
const inheritedSegmentedControlMarkup = renderToStaticMarkup(React.createElement(SegmentedControl, {
  label: "Inherited view",
  items: [{ key: "map", label: "Map" }],
}));
assert.doesNotMatch(inheritedSegmentedControlMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedSegmentedControlMarkup = renderToStaticMarkup(React.createElement(SegmentedControl, {
  items: [{ key: "map", icon: "map" }],
  variant: "icon-only",
}));
assert.doesNotMatch(unnamedSegmentedControlMarkup, /Options|Option 1/);
assert.doesNotMatch(unnamedSegmentedControlMarkup, /role="tab"/);
const unstableSegmentedControlMarkup = renderToStaticMarkup(React.createElement(SegmentedControl, {
  label: "View mode",
  items: [{ label: "Map" }],
}));
assert.doesNotMatch(unstableSegmentedControlMarkup, /role="tab"/);
assert.doesNotMatch(unstableSegmentedControlMarkup, /data-key="Map"|option-1/);

const switchMarkup = renderToStaticMarkup(React.createElement(Switch, {
  label: "Route alerts",
  description: "Notify drivers before changes.",
  checked: true,
  density: "sm",
  name: "route-alerts",
}));
assert.match(switchMarkup, /class="switch"/);
assert.match(switchMarkup, /data-density="sm"/);
assert.match(switchMarkup, /data-state="on"/);
assert.match(switchMarkup, /type="checkbox"/);
assert.match(switchMarkup, /role="switch"/);
assert.match(switchMarkup, /aria-checked="true"/);
assert.match(switchMarkup, /class="switch__track"/);
assert.match(switchMarkup, /class="switch__thumb"/);
assert.match(switchMarkup, /class="switch__label">Route alerts<\/span>/);
assert.match(switchMarkup, /class="switch__description"/);

const textAreaMarkup = renderToStaticMarkup(React.createElement(TextArea, {
  label: "Driver notes",
  helper: "Visible to assigned driver.",
  value: "Customer requests child seat.",
  density: "sm",
  rows: 3,
  maxLength: 120,
}));
assert.match(textAreaMarkup, /class="field"/);
assert.match(textAreaMarkup, /data-density="sm"/);
assert.match(textAreaMarkup, /data-state="filled"/);
assert.match(textAreaMarkup, /class="text-area__surface"/);
assert.match(textAreaMarkup, /data-has-counter="true"/);
assert.match(textAreaMarkup, /class="text-area"/);
assert.match(textAreaMarkup, /class="text-area__counter"/);
assert.match(textAreaMarkup, /29\/120/);
assert.match(textAreaMarkup, /aria-describedby="[^"]+-helper [^"]+-counter"/);

const unnamedTextAreaMarkup = renderToStaticMarkup(React.createElement(TextArea));
assert.doesNotMatch(unnamedTextAreaMarkup, /aria-label="Text area"/);
assert.doesNotMatch(unnamedTextAreaMarkup, /class="field"|class="text-area"/);

const ref = createRef();
React.createElement(Button, { ref, label: "Ref" });

const iconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "Open notifications",
  icon: "notifications",
  variant: "tonal",
  density: "lg",
  selected: true,
  badge: true,
}));

assert.match(iconButtonMarkup, /class="icon-button icon-button--tonal"/);
assert.match(iconButtonMarkup, /aria-label="Open notifications"/);
assert.match(iconButtonMarkup, /aria-pressed="true"/);
assert.match(iconButtonMarkup, /data-density="lg"/);
assert.match(iconButtonMarkup, /class="icon-button__icon"/);
assert.match(iconButtonMarkup, /class="icon-button__badge"/);

const inheritedIconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  ariaLabel: "More actions",
  icon: "more_horiz",
}));
assert.doesNotMatch(inheritedIconButtonMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedIconButtonMarkup = renderToStaticMarkup(React.createElement(IconButton, {
  icon: "settings",
}));
assert.equal(unnamedIconButtonMarkup, "");

const inputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Amount",
  helper: "Use settlement currency.",
  value: "2400",
  variant: "currency",
  density: "sm",
  suffix: "MXN",
  icon: "payments",
  state: "focus",
}));

assert.match(inputMarkup, /class="field"/);
assert.match(inputMarkup, /data-density="sm"/);
assert.match(inputMarkup, /data-variant="currency"/);
assert.match(inputMarkup, /data-align="end"/);
assert.match(inputMarkup, /class="field__label"/);
assert.match(inputMarkup, /class="field__control"/);
assert.match(inputMarkup, /class="field__icon"/);
assert.match(inputMarkup, /class="input"/);
assert.match(inputMarkup, /inputMode="decimal"|inputmode="decimal"/);
assert.match(inputMarkup, /class="field__suffix"/);
assert.match(inputMarkup, /class="field__helper"/);

const inheritedInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Driver",
  value: "Alex",
}));
assert.doesNotMatch(inheritedInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedRevealInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  revealable: true,
}));
assert.doesNotMatch(unnamedRevealInputMarkup, /aria-label="Show value"/);
assert.doesNotMatch(unnamedRevealInputMarkup, /aria-label="Hide value"/);
assert.doesNotMatch(unnamedRevealInputMarkup, /data-field-action="reveal"/);
assert.doesNotMatch(unnamedRevealInputMarkup, /class="field"|class="input"/);

const loadingInputMarkup = renderToStaticMarkup(React.createElement(Input, {
  label: "Amount",
  loading: true,
}));
assert.match(loadingInputMarkup, /class="spinner/);
assert.doesNotMatch(loadingInputMarkup, /Amount loading|Loading/);

const inlineValidationMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  label: "Driver email",
  value: "ana@",
  message: "Enter a complete email address.",
  state: "error",
  density: "sm",
  live: true,
}));
assert.match(inlineValidationMarkup, /^<div/);
assert.match(inlineValidationMarkup, /class="inline-validation"/);
assert.match(inlineValidationMarkup, /data-state="error"/);
assert.match(inlineValidationMarkup, /data-density="sm"/);
assert.match(inlineValidationMarkup, /data-field="true"/);
assert.match(inlineValidationMarkup, /aria-invalid="true"/);
assert.match(inlineValidationMarkup, /role="alert"/);
assert.match(inlineValidationMarkup, /class="field"/);
assert.match(inlineValidationMarkup, /data-density="sm"/);

const inheritedInlineValidationMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  label: "Inherited inline density",
  value: "Alex",
}));
assert.doesNotMatch(inheritedInlineValidationMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedInlineValidationMarkup.match(/<label[^>]+class="field"[^>]*>/)?.[0] ?? "", /data-density=/);
const unnamedInlineValidationMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  value: "Alex",
}));
assert.doesNotMatch(unnamedInlineValidationMarkup, /aria-label="Input"/);
const explicitInlineValidationFieldMarkup = renderToStaticMarkup(React.createElement(InlineValidation, {
  value: "Alex",
  fieldAriaLabel: "Driver field",
}));
assert.doesNotMatch(explicitInlineValidationFieldMarkup, /class="field"|aria-label="Driver field"/);
assert.match(explicitInlineValidationFieldMarkup, /data-field="false"/);

const cardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput, {
  label: "Card number",
  helper: "Use the number printed on the front of the card.",
  value: "4111111111111111",
  density: "sm",
}));
assert.match(cardNumberInputMarkup, /class="field card-number-input"/);
assert.match(cardNumberInputMarkup, /data-density="sm"/);
assert.match(cardNumberInputMarkup, /data-state="valid"/);
assert.match(cardNumberInputMarkup, /data-validity="valid"/);
assert.match(cardNumberInputMarkup, /data-brand="Visa"/);
assert.match(cardNumberInputMarkup, /class="field__control card-number-input__control"/);
assert.match(cardNumberInputMarkup, /class="input card-number-input__input"/);
assert.match(cardNumberInputMarkup, /autoComplete="cc-number"|autocomplete="cc-number"/);
assert.match(cardNumberInputMarkup, /value="4111 1111 1111 1111"/);
assert.match(cardNumberInputMarkup, /class="field__suffix card-number-input__brand"/);
assert.match(cardNumberInputMarkup, /Visa/);

const inheritedCardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput, {
  label: "Card number",
  value: "5231000000000000",
}));
assert.doesNotMatch(inheritedCardNumberInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedCardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput));
assert.doesNotMatch(unnamedCardNumberInputMarkup, /aria-label="Card number"/);
assert.doesNotMatch(unnamedCardNumberInputMarkup, /placeholder="5231 0000 0000 0000"/);
assert.doesNotMatch(unnamedCardNumberInputMarkup, /field card-number-input|card-number-input__input|credit_card/);

const loadingCardNumberInputMarkup = renderToStaticMarkup(React.createElement(CardNumberInput, {
  label: "Card number",
  loading: true,
}));
assert.match(loadingCardNumberInputMarkup, /class="spinner/);
assert.doesNotMatch(loadingCardNumberInputMarkup, /Card number loading|Loading/);

const cardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  helper: "Use the expiry printed on the card.",
  value: "1228",
  density: "sm",
}));
assert.match(cardExpiryInputMarkup, /class="field card-expiry-input"/);
assert.match(cardExpiryInputMarkup, /data-density="sm"/);
assert.match(cardExpiryInputMarkup, /data-state="valid"/);
assert.match(cardExpiryInputMarkup, /data-validity="valid"/);
assert.match(cardExpiryInputMarkup, /data-month="12"/);
assert.match(cardExpiryInputMarkup, /data-year="28"/);
assert.match(cardExpiryInputMarkup, /class="field__control card-expiry-input__control"/);
assert.match(cardExpiryInputMarkup, /class="input card-expiry-input__input"/);
assert.match(cardExpiryInputMarkup, /autoComplete="cc-exp"|autocomplete="cc-exp"/);
assert.match(cardExpiryInputMarkup, /value="12\/28"/);

const invalidCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  value: "1328",
  validationMessage: "Check the expiry date.",
}));
assert.match(invalidCardExpiryInputMarkup, /data-state="error"/);
assert.match(invalidCardExpiryInputMarkup, /data-validity="invalid"/);
assert.match(invalidCardExpiryInputMarkup, /aria-invalid="true"/);
assert.match(invalidCardExpiryInputMarkup, /Check the expiry date\./);

const inheritedCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  value: "1228",
}));
assert.doesNotMatch(inheritedCardExpiryInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput));
assert.doesNotMatch(unnamedCardExpiryInputMarkup, /aria-label="Expiry date"/);
assert.doesNotMatch(unnamedCardExpiryInputMarkup, /placeholder="MM\/YY"/);
assert.doesNotMatch(unnamedCardExpiryInputMarkup, /field card-expiry-input|card-expiry-input__input|calendar_month/);

const loadingCardExpiryInputMarkup = renderToStaticMarkup(React.createElement(CardExpiryInput, {
  label: "Expiry date",
  loading: true,
}));
assert.match(loadingCardExpiryInputMarkup, /class="spinner/);
assert.doesNotMatch(loadingCardExpiryInputMarkup, /Expiry date loading|Loading/);

const cardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  helper: "Use the code printed on the card.",
  value: "48a2",
  density: "sm",
  revealLabel: "Reveal CVC",
  hideLabel: "Conceal CVC",
}));
assert.match(cardSecurityCodeInputMarkup, /class="field card-security-code-input"/);
assert.match(cardSecurityCodeInputMarkup, /data-density="sm"/);
assert.match(cardSecurityCodeInputMarkup, /data-state="valid"/);
assert.match(cardSecurityCodeInputMarkup, /data-validity="valid"/);
assert.match(cardSecurityCodeInputMarkup, /data-length="3"/);
assert.match(cardSecurityCodeInputMarkup, /data-expected-length="3"/);
assert.match(cardSecurityCodeInputMarkup, /class="field__control card-security-code-input__control"/);
assert.match(cardSecurityCodeInputMarkup, /class="input card-security-code-input__input"/);
assert.match(cardSecurityCodeInputMarkup, /autoComplete="cc-csc"|autocomplete="cc-csc"/);
assert.match(cardSecurityCodeInputMarkup, /type="password"/);
assert.match(cardSecurityCodeInputMarkup, /value="482"/);
assert.match(cardSecurityCodeInputMarkup, /class="field-action card-security-code-input__action"/);
assert.match(cardSecurityCodeInputMarkup, /aria-pressed="false"/);

const revealedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  value: "1234",
  expectedLength: 4,
  revealed: true,
  revealLabel: "Reveal CVC",
  hideLabel: "Conceal CVC",
}));
assert.match(revealedCardSecurityCodeInputMarkup, /data-expected-length="4"/);
assert.match(revealedCardSecurityCodeInputMarkup, /type="text"/);
assert.match(revealedCardSecurityCodeInputMarkup, /maxlength="4"|maxLength="4"/);
assert.match(revealedCardSecurityCodeInputMarkup, /aria-pressed="true"/);

const inheritedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput, {
  label: "Security code",
  value: "482",
}));
assert.doesNotMatch(inheritedCardSecurityCodeInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedCardSecurityCodeInputMarkup = renderToStaticMarkup(React.createElement(CardSecurityCodeInput));
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /aria-label="Security code"/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /placeholder="CVC"/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /Show security code|Hide security code/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /data-card-security-code-reveal/);
assert.doesNotMatch(unnamedCardSecurityCodeInputMarkup, /field card-security-code-input|card-security-code-input__input|pin/);

const codeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Security code",
  helper: "Code expires in 00:42",
  value: "a428195",
  length: 6,
  variant: "sms",
  density: "sm",
}));
assert.match(codeInputMarkup, /class="field code-input"/);
assert.match(codeInputMarkup, /data-density="sm"/);
assert.match(codeInputMarkup, /data-state="complete"/);
assert.match(codeInputMarkup, /data-variant="sms"/);
assert.match(codeInputMarkup, /class="code-input__control"/);
assert.match(codeInputMarkup, /class="code-input__input"/);
assert.match(codeInputMarkup, /autoComplete="one-time-code"|autocomplete="one-time-code"/);
assert.match(codeInputMarkup, /value="428195"/);
assert.match(codeInputMarkup, /class="code-input__slots"/);
assert.match(codeInputMarkup, /data-code-slot=""/);
assert.match(codeInputMarkup, /aria-hidden="true"/);
assert.match(codeInputMarkup, /class="field__helper"/);

const maskedCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Passcode",
  value: "123456",
  variant: "masked",
}));
assert.match(maskedCodeInputMarkup, /data-masked="true"/);

const inheritedCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput, {
  label: "Security code",
  value: "123",
}));
assert.doesNotMatch(inheritedCodeInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedCodeInputMarkup = renderToStaticMarkup(React.createElement(CodeInput));
assert.doesNotMatch(unnamedCodeInputMarkup, /digit code/);
assert.doesNotMatch(unnamedCodeInputMarkup, /digits/);
assert.doesNotMatch(unnamedCodeInputMarkup, /field code-input|code-input__input|code-input__slots/);

const countrySelectorMarkup = renderToStaticMarkup(React.createElement(CountrySelector, {
  label: "Country",
  country: "MX",
  density: "sm",
  inline: true,
}));
assert.match(countrySelectorMarkup, /class="select-control select-control--inline country-selector"/);
assert.match(countrySelectorMarkup, /data-country="MX"/);
assert.match(countrySelectorMarkup, /data-density="sm"/);
assert.match(countrySelectorMarkup, /role="combobox"/);
assert.match(countrySelectorMarkup, /aria-expanded="false"/);
assert.match(countrySelectorMarkup, /country-flag-icons\/3x2\/MX.svg/);
assert.match(countrySelectorMarkup, /class="country-selector__label"/);
assert.match(countrySelectorMarkup, /Mexico/);
assert.match(countrySelectorMarkup, /class="select-control__code country-selector__code"/);
assert.match(countrySelectorMarkup, /\+52/);
assert.match(countrySelectorMarkup, /role="listbox"/);
assert.match(countrySelectorMarkup, /class="select-control__option country-selector__option"/);
const consumerDefaultCountrySelectorMarkup = renderToStaticMarkup(React.createElement(CountrySelector, {
  label: "Country",
  countries: [{ country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 }],
}));
assert.match(consumerDefaultCountrySelectorMarkup, /data-country="BR"/);
assert.doesNotMatch(consumerDefaultCountrySelectorMarkup, /data-country="MX"/);

const phoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  helper: "Used for OTP and support recovery.",
  value: "+52 55 1842 9011",
  country: "MX",
  density: "sm",
}));
assert.match(phoneInputMarkup, /class="field phone-input"/);
assert.match(phoneInputMarkup, /data-density="sm"/);
assert.match(phoneInputMarkup, /data-variant="country-code"/);
assert.match(phoneInputMarkup, /class="field__control phone-input__control"/);
assert.match(phoneInputMarkup, /class="select-control select-control--inline country-selector phone-input__country"/);
assert.match(phoneInputMarkup, /data-country="MX"/);
assert.match(phoneInputMarkup, /class="country-flag"/);
assert.match(phoneInputMarkup, /country-flag-icons\/3x2\/MX.svg/);
assert.match(phoneInputMarkup, /class="select-control__code country-selector__code"/);
assert.match(phoneInputMarkup, /\+52/);
assert.match(phoneInputMarkup, /class="select-control__listbox country-selector__listbox"/);
assert.match(phoneInputMarkup, /class="select-control__option country-selector__option"/);
assert.match(phoneInputMarkup, /class="input phone-input__input"/);
assert.match(phoneInputMarkup, /type="tel"/);
assert.match(phoneInputMarkup, /autoComplete="tel-national"|autocomplete="tel-national"/);
assert.match(phoneInputMarkup, /value="55 1842 9011"/);
assert.match(phoneInputMarkup, /class="field__helper"/);
const consumerDefaultPhoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  countries: [{ country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 }],
}));
assert.match(consumerDefaultPhoneInputMarkup, /data-country="BR"/);
assert.doesNotMatch(consumerDefaultPhoneInputMarkup, /data-country="MX"/);

const inheritedPhoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput, {
  label: "Mobile phone",
  value: "5518429011",
  country: "MX",
}));
assert.doesNotMatch(inheritedPhoneInputMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedPhoneInputMarkup = renderToStaticMarkup(React.createElement(PhoneInput));
assert.equal(unnamedPhoneInputMarkup, "");
assert.doesNotMatch(unnamedPhoneInputMarkup, /Phone input/);
assert.doesNotMatch(unnamedPhoneInputMarkup, /Country options/);
assert.doesNotMatch(unnamedPhoneInputMarkup, /Country code/);

const datePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
  locale: "es-MX",
  weekdays: ["L", "M", "X", "J", "V", "S", "D"],
  helper: "One operational date.",
  min: "2026-01-01",
  max: "2026-12-31",
  calendarLabel: "Service date calendar",
  previousMonthLabel: "Previous service month",
  nextMonthLabel: "Next service month",
  density: "lg",
  state: "focus",
}));
assert.match(datePickerMarkup, /class="field date-picker"/);
assert.match(datePickerMarkup, /data-density="lg"/);
assert.match(datePickerMarkup, /data-state="focus"/);
assert.match(datePickerMarkup, /data-open="false"/);
assert.match(datePickerMarkup, /class="field__label date-picker__label"/);
assert.match(datePickerMarkup, /class="field__control date-picker__control"/);
assert.match(datePickerMarkup, /data-date-picker-trigger=""/);
assert.match(datePickerMarkup, /aria-haspopup="dialog"/);
assert.match(datePickerMarkup, /aria-expanded="false"/);
assert.match(datePickerMarkup, /class="field__icon date-picker__icon"/);
assert.match(datePickerMarkup, /calendar_month/);
assert.match(datePickerMarkup, /class="date-picker__value"/);
assert.match(datePickerMarkup, /13 jul 2026/);
assert.match(datePickerMarkup, /type="date"/);
assert.match(datePickerMarkup, /data-date-picker-input=""/);
assert.match(datePickerMarkup, /min="2026-01-01"/);
assert.match(datePickerMarkup, /max="2026-12-31"/);
assert.match(datePickerMarkup, /class="date-picker__panel"/);
assert.match(datePickerMarkup, /role="dialog"/);
assert.match(datePickerMarkup, /aria-modal="false"/);
assert.match(datePickerMarkup, /aria-label="Service date calendar"/);
assert.match(datePickerMarkup, /aria-label="Previous service month"/);
assert.match(datePickerMarkup, /aria-label="Next service month"/);
assert.match(datePickerMarkup, /class="date-picker__grid"/);
assert.match(datePickerMarkup, /role="grid"/);
assert.match(datePickerMarkup, /class="date-picker__weekday"/);
assert.match(datePickerMarkup, /data-date-picker-day="2026-07-13"/);
assert.match(datePickerMarkup, /aria-pressed="true"/);
assert.match(datePickerMarkup, /class="field__helper date-picker__helper"/);

const inheritedDatePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
}));
assert.doesNotMatch(inheritedDatePickerMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedDatePickerMarkup = renderToStaticMarkup(React.createElement(DatePicker));
assert.equal(unnamedDatePickerMarkup, "");
const datePickerWithoutNavLabelsMarkup = renderToStaticMarkup(React.createElement(DatePicker, {
  label: "Service date",
  value: "2026-07-13",
}));
assert.doesNotMatch(datePickerWithoutNavLabelsMarkup, /class="date-picker__nav"/);

const dateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
  locale: "es-MX",
  weekdays: ["L", "M", "X", "J", "V", "S", "D"],
  helper: "One bounded date range.",
  presetItems: [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
  ],
  calendarLabel: "Reporting range calendar",
  previousMonthLabel: "Previous reporting month",
  nextMonthLabel: "Next reporting month",
  density: "sm",
  state: "selected",
}));
assert.match(dateRangePickerMarkup, /class="field date-picker date-range-picker"/);
assert.match(dateRangePickerMarkup, /data-density="sm"/);
assert.match(dateRangePickerMarkup, /data-state="selected"/);
assert.match(dateRangePickerMarkup, /data-open="false"/);
assert.match(dateRangePickerMarkup, /data-from="2026-07-01"/);
assert.match(dateRangePickerMarkup, /data-to="2026-07-15"/);
assert.match(dateRangePickerMarkup, /class="field__label date-picker__label date-range-picker__label"/);
assert.match(dateRangePickerMarkup, /class="field__control date-picker__control date-range-picker__control"/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-trigger=""/);
assert.match(dateRangePickerMarkup, /aria-haspopup="dialog"/);
assert.match(dateRangePickerMarkup, /aria-expanded="false"/);
assert.match(dateRangePickerMarkup, /class="field__icon date-picker__icon date-range-picker__icon"/);
assert.match(dateRangePickerMarkup, /date_range/);
assert.match(dateRangePickerMarkup, /class="date-picker__value date-range-picker__value"/);
assert.match(dateRangePickerMarkup, /01 jul 2026 - 15 jul 2026/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-from=""/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-to=""/);
assert.match(dateRangePickerMarkup, /class="date-picker__panel date-range-picker__panel"/);
assert.match(dateRangePickerMarkup, /role="dialog"/);
assert.match(dateRangePickerMarkup, /aria-label="Reporting range calendar"/);
assert.match(dateRangePickerMarkup, /aria-label="Previous reporting month"/);
assert.match(dateRangePickerMarkup, /aria-label="Next reporting month"/);
assert.match(dateRangePickerMarkup, /class="date-range-picker__presets"/);
assert.match(dateRangePickerMarkup, /class="date-range-picker__preset"/);
assert.match(dateRangePickerMarkup, /class="date-picker__grid date-range-picker__grid"/);
assert.match(dateRangePickerMarkup, /role="grid"/);
assert.match(dateRangePickerMarkup, /data-date-range-picker-day="2026-07-01"/);
assert.match(dateRangePickerMarkup, /data-range-edge="start"/);
assert.match(dateRangePickerMarkup, /data-range-edge="end"/);
assert.match(dateRangePickerMarkup, /data-in-range="true"/);
assert.match(dateRangePickerMarkup, /class="field__helper date-picker__helper date-range-picker__helper"/);

const inheritedDateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
}));
assert.doesNotMatch(inheritedDateRangePickerMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedDateRangePickerMarkup = renderToStaticMarkup(React.createElement(DateRangePicker));
assert.equal(unnamedDateRangePickerMarkup, "");
const dateRangePickerWithoutNavLabelsMarkup = renderToStaticMarkup(React.createElement(DateRangePicker, {
  label: "Reporting range",
  value: { from: "2026-07-01", to: "2026-07-15" },
}));
assert.doesNotMatch(dateRangePickerWithoutNavLabelsMarkup, /class="date-picker__nav"/);

const closedDialogMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Freeze card?",
  description: "Driver cannot spend until review ends.",
  triggerLabel: "Open review",
  density: "sm",
}));
assert.match(closedDialogMarkup, /^<div/);
assert.match(closedDialogMarkup, /class="dialog dialog--neutral"/);
assert.match(closedDialogMarkup, /data-open="false"/);
assert.match(closedDialogMarkup, /data-state="closed"/);
assert.match(closedDialogMarkup, /data-density="sm"/);
assert.match(closedDialogMarkup, /class="button button--secondary dialog__trigger"/);
assert.match(closedDialogMarkup, /aria-haspopup="dialog"/);
assert.match(closedDialogMarkup, /aria-expanded="false"/);
assert.match(closedDialogMarkup, /data-overlay-open=""/);
assert.match(closedDialogMarkup, /class="dialog__overlay"/);
assert.match(closedDialogMarkup, /hidden=""/);

const openDialogMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Freeze card?",
  description: "Driver cannot spend until review ends.",
  closeLabel: "Close freeze card dialog",
  variant: "destructive",
  tone: "danger",
  state: "open",
  open: true,
  density: "lg",
  actions: [{ key: "cancel", label: "Cancel", variant: "ghost" }, { key: "confirm", label: "Confirm", variant: "danger" }],
}));
assert.match(openDialogMarkup, /class="dialog dialog--danger"/);
assert.match(openDialogMarkup, /data-variant="destructive"/);
assert.match(openDialogMarkup, /data-open="true"/);
assert.match(openDialogMarkup, /data-state="open"/);
assert.match(openDialogMarkup, /role="dialog"/);
assert.match(openDialogMarkup, /aria-modal="true"/);
assert.match(openDialogMarkup, /aria-labelledby=/);
assert.match(openDialogMarkup, /class="dialog__icon"/);
assert.match(openDialogMarkup, />warning<\/span>/);
assert.match(openDialogMarkup, /class="icon-button icon-button--ghost dialog__close"/);
assert.match(openDialogMarkup, /data-overlay-close=""/);
assert.match(openDialogMarkup, /data-key="confirm"/);
const unstableDialogActionMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Confirm route",
  open: true,
  actions: [{ label: "Confirm" }],
}));
assert.doesNotMatch(unstableDialogActionMarkup, /data-key="Confirm"|class="button/);

const formDialogMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Edit driver",
  closeLabel: "Close edit driver dialog",
  variant: "form",
  open: true,
  fields: [{ name: "driver", label: "Driver", value: "Ana Sosa" }, { value: "Empty field" }],
}));
assert.match(formDialogMarkup, /data-variant="form"/);
assert.match(formDialogMarkup, /class="dialog__body dialog__fields"/);
assert.match(formDialogMarkup, /class="field"/);
assert.doesNotMatch(formDialogMarkup, /Empty field/);
assert.doesNotMatch(formDialogMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const unstableDialogFieldMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Edit driver",
  open: true,
  fields: [{ label: "Driver", value: "Ana Sosa" }],
}));
assert.doesNotMatch(unstableDialogFieldMarkup, /class="dialog__body dialog__fields"|Driver|Ana Sosa/);

const unnamedDialogMarkup = renderToStaticMarkup(React.createElement(Dialog));
assert.equal(unnamedDialogMarkup, "");
assert.doesNotMatch(unnamedDialogMarkup, /aria-label="Open dialog"/);
assert.doesNotMatch(unnamedDialogMarkup, /aria-label="Dialog"/);
assert.doesNotMatch(unnamedDialogMarkup, /aria-label="Close dialog"/);
assert.doesNotMatch(unnamedDialogMarkup, /class="button button--secondary dialog__trigger"/);
assert.doesNotMatch(unnamedDialogMarkup, /class="icon-button icon-button--ghost dialog__close"/);

const dialogWithoutTriggerMarkup = renderToStaticMarkup(React.createElement(Dialog, {
  label: "Review route",
}));
assert.doesNotMatch(dialogWithoutTriggerMarkup, /data-overlay-open=""/);
assert.doesNotMatch(dialogWithoutTriggerMarkup, /class="button button--secondary dialog__trigger"/);

const closedDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Card controls",
  description: "Review limits.",
  triggerLabel: "Open controls",
  density: "sm",
  side: "left",
}));
assert.match(closedDrawerMarkup, /^<div/);
assert.match(closedDrawerMarkup, /class="drawer drawer--neutral"/);
assert.match(closedDrawerMarkup, /data-open="false"/);
assert.match(closedDrawerMarkup, /data-state="closed"/);
assert.match(closedDrawerMarkup, /data-density="sm"/);
assert.match(closedDrawerMarkup, /data-side="left"/);
assert.match(closedDrawerMarkup, /class="button button--secondary drawer__trigger"/);
assert.match(closedDrawerMarkup, /aria-haspopup="dialog"/);
assert.match(closedDrawerMarkup, /aria-expanded="false"/);
assert.match(closedDrawerMarkup, /data-overlay-open=""/);
assert.match(closedDrawerMarkup, /class="drawer__overlay"/);
assert.match(closedDrawerMarkup, /hidden=""/);

const openDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Ana Sosa",
  closeLabel: "Close Ana Sosa details",
  variant: "detail",
  tone: "info",
  state: "open",
  open: true,
  density: "md",
  content: [
    { key: "status", type: "badge", label: "En ruta", tone: "success", live: true },
    { key: "documents", type: "progress", label: "Documentos", value: 75, max: 100, showValue: true },
  ],
  actions: [{ key: "close", label: "Cerrar", variant: "ghost" }, { key: "save", label: "Guardar" }],
}));
assert.match(openDrawerMarkup, /class="drawer drawer--info"/);
assert.match(openDrawerMarkup, /data-variant="detail"/);
assert.match(openDrawerMarkup, /data-open="true"/);
assert.match(openDrawerMarkup, /data-state="open"/);
assert.match(openDrawerMarkup, /role="dialog"/);
assert.match(openDrawerMarkup, /aria-modal="true"/);
assert.match(openDrawerMarkup, /aria-labelledby=/);
assert.match(openDrawerMarkup, /class="icon-button icon-button--ghost drawer__close"/);
assert.match(openDrawerMarkup, /class="drawer__status-row"/);
assert.match(openDrawerMarkup, /class="badge__label">En ruta<\/span>/);
assert.match(openDrawerMarkup, /class="drawer__progress-row"/);
assert.match(openDrawerMarkup, /class="progress"/);
assert.match(openDrawerMarkup, /aria-valuenow="75"/);
assert.match(openDrawerMarkup, /data-overlay-close=""/);
assert.match(openDrawerMarkup, /data-key="save"/);
const unstableDrawerActionMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Vehicle details",
  open: true,
  actions: [{ label: "Guardar" }],
}));
assert.doesNotMatch(unstableDrawerActionMarkup, /data-key="Guardar"|class="button/);

const formDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Filter routes",
  closeLabel: "Close route filters",
  variant: "filter",
  open: true,
  fields: [{ name: "region", label: "Region" }, { name: "fuel", label: "Fuel type", value: "Diesel" }, { value: "Empty drawer field" }],
}));
assert.match(formDrawerMarkup, /data-variant="filter"/);
assert.match(formDrawerMarkup, /class="drawer__body"/);
assert.match(formDrawerMarkup, /class="field"/);
assert.doesNotMatch(formDrawerMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
assert.match(formDrawerMarkup, /value="Diesel"/);
assert.doesNotMatch(formDrawerMarkup, /Empty drawer field/);
const unstableDrawerFieldMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Filter routes",
  open: true,
  fields: [{ label: "Fuel type", value: "Diesel" }],
}));
assert.doesNotMatch(unstableDrawerFieldMarkup, /class="field"|Fuel type|Diesel/);

const emptyContentDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Details",
  open: true,
  content: [{ type: "badge" }, { type: "progress", value: 75 }, { type: "text" }],
}));
assert.doesNotMatch(emptyContentDrawerMarkup, /drawer__status-row|drawer__progress-row|drawer__supporting-copy/);
const unstableContentDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Details",
  open: true,
  content: [{ type: "badge", label: "En ruta" }, { type: "progress", label: "Documentos", value: 75 }, { type: "text", copy: "Support copy" }],
}));
assert.doesNotMatch(unstableContentDrawerMarkup, /drawer__status-row|drawer__progress-row|drawer__supporting-copy|En ruta|Documentos|Support copy/);

const unnamedDrawerMarkup = renderToStaticMarkup(React.createElement(Drawer));
assert.equal(unnamedDrawerMarkup, "");
assert.doesNotMatch(unnamedDrawerMarkup, /aria-label="Open drawer"/);
assert.doesNotMatch(unnamedDrawerMarkup, /aria-label="Drawer"/);
assert.doesNotMatch(unnamedDrawerMarkup, /aria-label="Close drawer"/);
assert.doesNotMatch(unnamedDrawerMarkup, /class="button button--secondary drawer__trigger"/);
assert.doesNotMatch(unnamedDrawerMarkup, /class="icon-button icon-button--ghost drawer__close"/);

const drawerWithoutTriggerMarkup = renderToStaticMarkup(React.createElement(Drawer, {
  label: "Route filters",
}));
assert.doesNotMatch(drawerWithoutTriggerMarkup, /data-overlay-open=""/);
assert.doesNotMatch(drawerWithoutTriggerMarkup, /class="button button--secondary drawer__trigger"/);

const comboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  helper: "Search by plate, driver, or fleet",
  optionsLabel: "Vehicle options",
  clearSelectionLabel: "Clear vehicle",
  value: "mx-4821",
  density: "sm",
  state: "open",
  options: [
    { label: "MX-4821 - Ana Gomez", value: "mx-4821", meta: "Driver" },
    { label: "MX-8840 - Luis Perez", value: "mx-8840", meta: "Vehicle" },
  ],
}));
assert.match(comboboxMarkup, /^<label/);
assert.match(comboboxMarkup, /class="field"/);
assert.match(comboboxMarkup, /data-density="sm"/);
assert.match(comboboxMarkup, /class="combobox"/);
assert.match(comboboxMarkup, /data-open="true"/);
assert.match(comboboxMarkup, /data-combobox-control=""/);
assert.match(comboboxMarkup, /role="combobox"/);
assert.match(comboboxMarkup, /aria-autocomplete="list"/);
assert.match(comboboxMarkup, /aria-expanded="true"/);
assert.match(comboboxMarkup, /aria-controls="[^"]+-listbox"/);
assert.match(comboboxMarkup, /class="field__icon combobox__icon"/);
assert.match(comboboxMarkup, /class="field-action field__action combobox__clear"/);
assert.match(comboboxMarkup, /class="select-control__chevron combobox__chevron"/);
assert.match(comboboxMarkup, /class="select-control__listbox combobox__listbox"/);
assert.match(comboboxMarkup, /role="listbox"/);
assert.match(comboboxMarkup, /class="select-control__option combobox__option"/);
assert.match(comboboxMarkup, /aria-selected="true"/);
assert.match(comboboxMarkup, /class="select-control__option-code combobox__option-meta">Driver<\/span>/);
assert.match(comboboxMarkup, /class="field__helper"/);

const emptyComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  optionsLabel: "Vehicle options",
  clearSelectionLabel: "Clear vehicle",
  value: "zz",
  emptyText: "No matching options",
  options: [{ label: "MX-4821 - Ana Gomez", value: "mx-4821" }],
}));
assert.match(emptyComboboxMarkup, /data-state="empty"/);
assert.match(emptyComboboxMarkup, /class="combobox__empty"/);
assert.match(emptyComboboxMarkup, />No matching options<\/span>/);

const unnamedComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox));
assert.doesNotMatch(unnamedComboboxMarkup, /aria-label="Combobox"/);
assert.doesNotMatch(unnamedComboboxMarkup, /class="combobox"|role="combobox"|role="listbox"|data-combobox-clear/);

const unnamedClearComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  value: "mx-4821",
  options: [{ label: "MX-4821", value: "mx-4821" }],
}));
assert.doesNotMatch(unnamedClearComboboxMarkup, /data-combobox-clear|class="field-action field__action combobox__clear"/);
assert.doesNotMatch(unnamedComboboxMarkup, /aria-label="Options"/);
assert.doesNotMatch(unnamedComboboxMarkup, /aria-label="Clear selection"/);

const unstableOptionComboboxMarkup = renderToStaticMarkup(React.createElement(Combobox, {
  label: "Vehicle",
  state: "open",
  options: [
    { label: "MX-4821 - Ana Gomez" },
    { value: "mx-8840" },
  ],
}));
assert.doesNotMatch(unstableOptionComboboxMarkup, /role="option"/);
assert.doesNotMatch(unstableOptionComboboxMarkup, /data-value="MX-4821|data-label="mx-8840"/);

const motionBoundaryMarkup = renderToStaticMarkup(React.createElement(MotionBoundary, {
  label: "Panel transition",
  description: "Route content enters as a bounded region.",
  variant: "route",
  state: "entering",
  reducedMotion: true,
  stateLabel: "Reduced motion",
}));
assert.match(motionBoundaryMarkup, /^<div/);
assert.match(motionBoundaryMarkup, /class="motion-boundary"/);
assert.match(motionBoundaryMarkup, /data-variant="route"/);
assert.match(motionBoundaryMarkup, /data-state="reduced-motion"/);
assert.match(motionBoundaryMarkup, /data-reduced-motion="true"/);
assert.match(motionBoundaryMarkup, /role="group"/);
assert.match(motionBoundaryMarkup, /aria-labelledby="[^"]+-label"/);
assert.match(motionBoundaryMarkup, /aria-describedby="[^"]+-description [^"]+-state"/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__icon material-symbol"/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__content"/);
assert.match(motionBoundaryMarkup, /Panel transition/);
assert.match(motionBoundaryMarkup, /Route content enters as a bounded region/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__state"[^>]*>Reduced motion<\/span>/);
assert.match(motionBoundaryMarkup, /class="motion-boundary__cue" data-motion-cue=""/);
const unnamedMotionBoundaryMarkup = renderToStaticMarkup(React.createElement(MotionBoundary, {
  label: "Consumer boundary",
  state: "active",
}));
assert.doesNotMatch(unnamedMotionBoundaryMarkup, /Idle|Entering|Active|Exiting|Reduced motion|Disabled/);
const unlabeledMotionBoundaryMarkup = renderToStaticMarkup(React.createElement(MotionBoundary, {
  description: "No boundary identity",
  stateLabel: "Active",
}));
assert.doesNotMatch(unlabeledMotionBoundaryMarkup, /motion-boundary|role="group"|No boundary identity|Active/);

const selectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Fleet",
  helper: "Choose a fleet.",
  value: "north",
  name: "fleet",
  density: "sm",
  icon: "local_taxi",
  state: "focus",
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south", disabled: true },
  ],
}));
assert.match(selectMarkup, /class="field"/);
assert.match(selectMarkup, /data-density="sm"/);
assert.match(selectMarkup, /class="select-control"/);
assert.match(selectMarkup, /data-select-control=""/);
assert.match(selectMarkup, /role="combobox"/);
assert.match(selectMarkup, /class="select-control__icon"/);
assert.match(selectMarkup, /class="select-control__value"/);
assert.match(selectMarkup, /class="select-control__chevron"/);
assert.match(selectMarkup, /class="select-control__listbox"/);
assert.match(selectMarkup, /data-select-option=""/);
assert.match(selectMarkup, /type="hidden"/);

const inheritedSelectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Country code",
  value: "MX",
  options: [
    { label: "Mexico", value: "MX", meta: "+52" },
    { label: "Cuba", value: "CU", meta: "+53" },
  ],
}));
assert.doesNotMatch(inheritedSelectMarkup.match(/^<label[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedSelectMarkup.match(/^<span[^>]+class="field"[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(inheritedSelectMarkup.match(/<span class="select-control"[^>]+>/)?.[0] ?? "", /data-density=/);

const unnamedSelectMarkup = renderToStaticMarkup(React.createElement(Select));
assert.doesNotMatch(unnamedSelectMarkup, /aria-label="Select"/);
assert.doesNotMatch(unnamedSelectMarkup, /aria-label="Options"/);
assert.doesNotMatch(unnamedSelectMarkup, /select-control|role="combobox"|role="listbox"/);

const unselectedSelectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Fleet",
  options: [
    { label: "North", value: "north" },
    { label: "South", value: "south" },
  ],
}));
assert.doesNotMatch(unselectedSelectMarkup, /class="select-control__value"/);
assert.match(unselectedSelectMarkup, /class="select-control"[^>]*data-value=""/);
assert.doesNotMatch(unselectedSelectMarkup, /aria-activedescendant=/);
assert.doesNotMatch(unselectedSelectMarkup, /aria-selected="true"/);

const unstableOptionSelectMarkup = renderToStaticMarkup(React.createElement(Select, {
  label: "Fleet",
  value: "North",
  options: [
    { label: "North" },
    { value: "south" },
  ],
}));
assert.doesNotMatch(unstableOptionSelectMarkup, /role="option"/);
assert.doesNotMatch(unstableOptionSelectMarkup, /data-value="North"|class="select-control__value"|>North<\/span>/);

console.log("react action and field component render tests passed");
