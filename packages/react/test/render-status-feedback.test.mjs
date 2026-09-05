import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, Checkbox, Chip, EmptyState, ErrorPanel, Menu, Popover, ProgressIndicator, RadioButton, SegmentedControl, Skeleton, Slider, Spinner, Stepper, Switch, Tag, Toast, Tooltip } from "../dist/index.js";

const chipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Active",
  variant: "filter",
  tone: "warning",
  selected: true,
  onSelectedChange: () => {},
  removable: true,
  icon: "filter_alt",
  onRemoveLabel: "Remove Active",
  onRemove: () => {},
}));
assert.match(chipMarkup, /^<span/);
assert.match(chipMarkup, /class="chip"/);
assert.match(chipMarkup, /data-variant="filter"/);
assert.match(chipMarkup, /data-tone="warning"/);
assert.match(chipMarkup, /data-state="selected"/);
assert.match(chipMarkup, /data-selected="true"/);
assert.match(chipMarkup, /data-chip-remove="true"/);
assert.match(chipMarkup, /data-interactive="true"/);
assert.match(chipMarkup, /class="chip__action"/);
assert.match(chipMarkup, /aria-pressed="true"/);
assert.match(chipMarkup, /aria-label="Remove Active"/);
assert.match(chipMarkup, /class="chip__icon"/);
assert.match(chipMarkup, /class="chip__label">Active<\/span>/);
assert.match(chipMarkup, /class="chip__remove"/);
assert.doesNotMatch(chipMarkup, /<button[^>]*class="chip"[^>]*data-chip-remove/);
const visualSelectedChipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Selected only",
  selected: true,
}));
assert.match(visualSelectedChipMarkup, /^<span/);
assert.match(visualSelectedChipMarkup, /data-state="selected"/);
assert.doesNotMatch(visualSelectedChipMarkup, /aria-pressed/);
const unnamedRemoveChipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Active",
  removable: true,
}));
assert.doesNotMatch(unnamedRemoveChipMarkup, /Remove Active|Remove chip/);
assert.match(unnamedRemoveChipMarkup, /^<span/);
assert.doesNotMatch(unnamedRemoveChipMarkup, /data-chip-remove="true"/);
assert.doesNotMatch(unnamedRemoveChipMarkup, /class="chip__remove"/);
const inertRemoveChipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Active",
  removable: true,
  onRemoveLabel: "Remove Active",
}));
assert.match(inertRemoveChipMarkup, /^<span/);
assert.doesNotMatch(inertRemoveChipMarkup, /data-chip-remove="true"|class="chip__remove"|aria-label="Remove Active"/);

const staticChipMarkup = renderToStaticMarkup(React.createElement(Chip, {
  label: "Metadata",
  variant: "assist",
}));
assert.match(staticChipMarkup, /^<span/);
assert.match(staticChipMarkup, /data-variant="filter"/);
assert.doesNotMatch(staticChipMarkup.match(/^<span[^>]+>/)?.[0] ?? "", /aria-pressed/);

const tagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Policy",
  variant: "link",
  tone: "info",
  state: "focus",
  icon: "verified",
  onClick: () => {},
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

const inertLinkTagMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Docs",
  variant: "link",
}));
assert.match(inertLinkTagMarkup, /^<span/);
assert.match(inertLinkTagMarkup, /data-variant="link"/);
assert.doesNotMatch(inertLinkTagMarkup, /data-interactive/);

const normalizedTagTypeMarkup = renderToStaticMarkup(React.createElement(Tag, {
  label: "Unsafe type",
  variant: "link",
  type: "menu",
  onClick: () => {},
}));
assert.match(normalizedTagTypeMarkup, /^<button/);
assert.match(normalizedTagTypeMarkup, /type="button"/);
assert.doesNotMatch(normalizedTagTypeMarkup, /type="menu"/);

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
assert.match(skeletonMarkup, /--comp-skeleton-current-columns:3/);
assert.match(skeletonMarkup, /--comp-skeleton-table-header-block-size/);
assert.match(skeletonMarkup, /--comp-skeleton-cell-medium-inline/);
assert.match(skeletonMarkup, /--comp-skeleton-cell-short-inline/);
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
  variant: "linear",
  showValue: true,
  tone: "success",
  state: "active",
  density: "lg",
  fullWidth: true,
  id: "docs-progress",
}));
assert.match(progressIndicatorMarkup, /^<div/);
assert.match(progressIndicatorMarkup, /class="progress"/);
assert.match(progressIndicatorMarkup, /id="docs-progress"/);
assert.match(progressIndicatorMarkup, /aria-labelledby="docs-progress-label"/);
assert.match(progressIndicatorMarkup, /data-tone="success"/);
assert.match(progressIndicatorMarkup, /data-state="active"/);
assert.match(progressIndicatorMarkup, /data-density="lg"/);
assert.match(progressIndicatorMarkup, /data-variant="linear"/);
assert.match(progressIndicatorMarkup, /data-full-width="true"/);
assert.match(progressIndicatorMarkup, /data-indeterminate="false"/);
assert.match(progressIndicatorMarkup, /class="progress__label" id="docs-progress-label">Documents<\/span>/);
assert.match(progressIndicatorMarkup, /class="progress__value">75%<\/span>/);
assert.match(progressIndicatorMarkup, /class="progress__track"/);
assert.match(progressIndicatorMarkup, /<progress class="progress__meter" max="100" value="75" aria-labelledby="docs-progress-label" aria-valuemin="0" aria-valuemax="100" aria-valuenow="75"/);
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
assert.doesNotMatch(indeterminateProgressMarkup, /<progress[^>]+value=/);

const completeProgressMarkup = renderToStaticMarkup(React.createElement(ProgressIndicator, {
  label: "Upload",
  value: 12,
  max: 24,
  state: "complete",
  showValue: true,
  ariaValueText: "Upload complete",
}));
assert.match(completeProgressMarkup, /data-state="complete"/);
assert.match(completeProgressMarkup, /<progress class="progress__meter" max="24" value="24"/);
assert.match(completeProgressMarkup, /aria-valuetext="Upload complete"/);
assert.match(completeProgressMarkup, /class="progress__value">100%<\/span>/);
const circularProgressMarkup = renderToStaticMarkup(React.createElement(ProgressIndicator, {
  label: "Battery",
  value: 42,
  max: 50,
  variant: "circular",
  showValue: true,
  tone: "warning",
}));
assert.match(circularProgressMarkup, /data-variant="circular"/);
assert.match(circularProgressMarkup, /class="progress__ring" role="progressbar" aria-labelledby="progress-label-[^"]+" aria-valuemin="0" aria-valuemax="50" aria-valuenow="42"/);
assert.match(circularProgressMarkup, /class="progress__ring-svg"/);
assert.match(circularProgressMarkup, /class="progress__ring-meter"/);
assert.match(circularProgressMarkup, /class="progress__ring-value">84%<\/span>/);
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
assert.match(sliderMarkup, /style="--comp-slider-percent:75%"/);
assert.doesNotMatch(sliderMarkup, /data-pct=/);
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
const pressedSliderMarkup = renderToStaticMarkup(React.createElement(Slider, {
  label: "Pressed radius",
  value: 6,
  state: "pressed",
}));
assert.match(pressedSliderMarkup, /data-state="pressed"/);
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

const slotEmptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "Sin unidades activas",
  icon: "local_taxi",
  action: React.createElement(Button, { label: "Agregar unidad", icon: "add" }),
}));
assert.match(slotEmptyStateMarkup, /class="empty-state__action"/);
assert.match(slotEmptyStateMarkup, /class="button/);
assert.match(slotEmptyStateMarkup, />Agregar unidad<\/span>|>Agregar unidad<\/button>/);

const multiSlotEmptyStateMarkup = renderToStaticMarkup(React.createElement(EmptyState, {
  title: "Too many actions",
  action: [
    React.createElement(Button, { key: "one", label: "One" }),
    React.createElement(Button, { key: "two", label: "Two" }),
  ],
}));
assert.doesNotMatch(multiSlotEmptyStateMarkup, /class="button/);

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
  secondaryAction: { key: "support", label: "Contact support", variant: "ghost" },
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
assert.match(errorPanelMarkup, /class="error-panel__actions"/);
assert.match(errorPanelMarkup, /class="button button--primary"/);
assert.match(errorPanelMarkup, />Contact support<\/span>|>Contact support<\/button>/);

const loadingErrorPanelMarkup = renderToStaticMarkup(React.createElement(ErrorPanel, {
  label: "Loading recovery",
  state: "loading",
  action: { key: "wait", label: "Wait" },
}));
assert.match(loadingErrorPanelMarkup, /data-state="loading"/);
assert.match(loadingErrorPanelMarkup, /role="status"/);
assert.match(loadingErrorPanelMarkup, /aria-busy="true"/);
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
  onClick: () => {},
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
  onAction: () => {},
  dismissible: true,
  dismissLabel: "Dismiss route update",
}));
assert.match(toastMarkup, /^<div/);
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

const inertToastActionMarkup = renderToStaticMarkup(React.createElement(Toast, {
  label: "Route updated",
  actionLabel: "Undo",
}));
assert.doesNotMatch(inertToastActionMarkup, /data-toast-action/);
assert.doesNotMatch(inertToastActionMarkup, /class="button button--ghost toast__action"/);

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
assert.match(avatarMenuMarkup, /class="avatar"/);
assert.doesNotMatch(avatarMenuMarkup, /avatar--/);

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


console.log("react status feedback render tests passed");
