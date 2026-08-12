export type FlowTokenName =
  | "density-card-padding"
  | "density-component-gap"
  | "density-component-gap-lg"
  | "density-control-height"
  | "density-control-padding-x"
  | "density-control-padding-y"
  | "density-doc-body-line-height"
  | "density-doc-body-size"
  | "density-doc-card-body-size"
  | "density-doc-card-min-block"
  | "density-doc-card-title-size"
  | "density-doc-example-min-block"
  | "density-doc-heading-line-height"
  | "density-doc-heading-size"
  | "density-doc-label-size"
  | "density-doc-subheading-size"
  | "density-page-gap"
  | "density-panel-padding"
  | "density-row-height"
  | "density-section-gap"
  | "density-subsection-gap"
  | "density-surface-padding"
  | "ref-a11y-contrast-aa"
  | "ref-a11y-contrast-large"
  | "ref-a11y-motion-reduced-duration"
  | "ref-a11y-outline-reset"
  | "ref-a11y-touch-target-min"
  | "ref-depth-blur-lg"
  | "ref-depth-blur-md"
  | "ref-depth-blur-sm"
  | "ref-depth-overlay-dark"
  | "ref-depth-overlay-light"
  | "ref-depth-shadow-color-rgb"
  | "ref-depth-z-base"
  | "ref-depth-z-dialog"
  | "ref-depth-z-dropdown"
  | "ref-depth-z-overlay"
  | "ref-depth-z-sticky"
  | "ref-depth-z-toast"
  | "ref-energy-blue-100"
  | "ref-energy-blue-200"
  | "ref-energy-blue-300"
  | "ref-energy-blue-400"
  | "ref-energy-blue-50"
  | "ref-energy-blue-500"
  | "ref-energy-blue-600"
  | "ref-energy-blue-700"
  | "ref-energy-blue-800"
  | "ref-energy-blue-900"
  | "ref-energy-green-100"
  | "ref-energy-green-200"
  | "ref-energy-green-300"
  | "ref-energy-green-400"
  | "ref-energy-green-50"
  | "ref-energy-green-500"
  | "ref-energy-green-600"
  | "ref-energy-green-700"
  | "ref-energy-green-800"
  | "ref-energy-green-900"
  | "ref-energy-neutral-100"
  | "ref-energy-neutral-200"
  | "ref-energy-neutral-300"
  | "ref-energy-neutral-400"
  | "ref-energy-neutral-50"
  | "ref-energy-neutral-500"
  | "ref-energy-neutral-600"
  | "ref-energy-neutral-700"
  | "ref-energy-neutral-800"
  | "ref-energy-neutral-900"
  | "ref-energy-orange-100"
  | "ref-energy-orange-200"
  | "ref-energy-orange-300"
  | "ref-energy-orange-400"
  | "ref-energy-orange-50"
  | "ref-energy-orange-500"
  | "ref-energy-orange-600"
  | "ref-energy-orange-700"
  | "ref-energy-orange-800"
  | "ref-energy-orange-900"
  | "ref-energy-pink-100"
  | "ref-energy-pink-200"
  | "ref-energy-pink-300"
  | "ref-energy-pink-400"
  | "ref-energy-pink-50"
  | "ref-energy-pink-500"
  | "ref-energy-pink-600"
  | "ref-energy-pink-700"
  | "ref-energy-pink-800"
  | "ref-energy-pink-900"
  | "ref-energy-purple-100"
  | "ref-energy-purple-200"
  | "ref-energy-purple-300"
  | "ref-energy-purple-400"
  | "ref-energy-purple-50"
  | "ref-energy-purple-500"
  | "ref-energy-purple-600"
  | "ref-energy-purple-700"
  | "ref-energy-purple-800"
  | "ref-energy-purple-900"
  | "ref-energy-red-100"
  | "ref-energy-red-200"
  | "ref-energy-red-300"
  | "ref-energy-red-400"
  | "ref-energy-red-50"
  | "ref-energy-red-500"
  | "ref-energy-red-600"
  | "ref-energy-red-700"
  | "ref-energy-red-800"
  | "ref-energy-red-900"
  | "ref-energy-teal-100"
  | "ref-energy-teal-200"
  | "ref-energy-teal-300"
  | "ref-energy-teal-400"
  | "ref-energy-teal-50"
  | "ref-energy-teal-500"
  | "ref-energy-teal-600"
  | "ref-energy-teal-700"
  | "ref-energy-teal-800"
  | "ref-energy-teal-900"
  | "ref-energy-yellow-100"
  | "ref-energy-yellow-200"
  | "ref-energy-yellow-300"
  | "ref-energy-yellow-400"
  | "ref-energy-yellow-50"
  | "ref-energy-yellow-500"
  | "ref-energy-yellow-600"
  | "ref-energy-yellow-700"
  | "ref-energy-yellow-800"
  | "ref-energy-yellow-900"
  | "ref-frame-border-control"
  | "ref-frame-border-indicator"
  | "ref-frame-border-medium"
  | "ref-frame-border-thin"
  | "ref-frame-breakpoint-lg"
  | "ref-frame-breakpoint-md"
  | "ref-frame-breakpoint-shell-sidebar"
  | "ref-frame-breakpoint-sm"
  | "ref-frame-breakpoint-xl"
  | "ref-frame-content-callout"
  | "ref-frame-content-dialog"
  | "ref-frame-content-drawer-lg"
  | "ref-frame-content-drawer-md"
  | "ref-frame-content-drawer-sm"
  | "ref-frame-content-max"
  | "ref-frame-content-narrow"
  | "ref-frame-content-prose"
  | "ref-frame-device-border-block"
  | "ref-frame-device-border-block-sm"
  | "ref-frame-device-border-inline"
  | "ref-frame-device-border-inline-sm"
  | "ref-frame-doc-badge-sm"
  | "ref-frame-doc-col-bar"
  | "ref-frame-doc-col-num"
  | "ref-frame-doc-col-preview"
  | "ref-frame-doc-col-token"
  | "ref-frame-doc-col-token-lg"
  | "ref-frame-doc-col-value-sm"
  | "ref-frame-doc-demo-radius"
  | "ref-frame-doc-grid-lg"
  | "ref-frame-doc-grid-md"
  | "ref-frame-doc-grid-sm"
  | "ref-frame-grid-lg-columns"
  | "ref-frame-grid-lg-gutter"
  | "ref-frame-grid-lg-margin"
  | "ref-frame-grid-lg-max-width"
  | "ref-frame-grid-md-columns"
  | "ref-frame-grid-md-gutter"
  | "ref-frame-grid-md-margin"
  | "ref-frame-grid-sm-columns"
  | "ref-frame-grid-sm-gutter"
  | "ref-frame-grid-sm-margin"
  | "ref-frame-height-control-lg"
  | "ref-frame-height-control-lg-comfortable"
  | "ref-frame-height-control-lg-compact"
  | "ref-frame-height-control-md"
  | "ref-frame-height-control-md-comfortable"
  | "ref-frame-height-control-md-compact"
  | "ref-frame-height-control-sm"
  | "ref-frame-height-control-sm-comfortable"
  | "ref-frame-height-control-sm-compact"
  | "ref-frame-height-control-xl"
  | "ref-frame-height-control-xl-comfortable"
  | "ref-frame-height-control-xl-compact"
  | "ref-frame-radius-0"
  | "ref-frame-radius-1"
  | "ref-frame-radius-10"
  | "ref-frame-radius-11"
  | "ref-frame-radius-12"
  | "ref-frame-radius-2"
  | "ref-frame-radius-3"
  | "ref-frame-radius-4"
  | "ref-frame-radius-5"
  | "ref-frame-radius-6"
  | "ref-frame-radius-7"
  | "ref-frame-radius-8"
  | "ref-frame-radius-9"
  | "ref-frame-radius-full"
  | "ref-frame-sidebar-collapsed"
  | "ref-frame-sidebar-expanded"
  | "ref-frame-space-0"
  | "ref-frame-space-1"
  | "ref-frame-space-10"
  | "ref-frame-space-11"
  | "ref-frame-space-12"
  | "ref-frame-space-16"
  | "ref-frame-space-2"
  | "ref-frame-space-20"
  | "ref-frame-space-24"
  | "ref-frame-space-3"
  | "ref-frame-space-32"
  | "ref-frame-space-4"
  | "ref-frame-space-40"
  | "ref-frame-space-5"
  | "ref-frame-space-6"
  | "ref-frame-space-7"
  | "ref-frame-space-8"
  | "ref-frame-space-9"
  | "ref-frame-space-micro"
  | "ref-growth-stage-deprecated"
  | "ref-growth-stage-measured"
  | "ref-growth-stage-seed"
  | "ref-growth-stage-stable"
  | "ref-momentum-duration-cycle"
  | "ref-momentum-duration-enter"
  | "ref-momentum-duration-fast"
  | "ref-momentum-duration-instant"
  | "ref-momentum-duration-loading"
  | "ref-momentum-duration-normal"
  | "ref-momentum-duration-press"
  | "ref-momentum-duration-progress"
  | "ref-momentum-duration-pulse"
  | "ref-momentum-duration-reveal"
  | "ref-momentum-duration-slow"
  | "ref-momentum-duration-slower"
  | "ref-momentum-duration-snappy"
  | "ref-momentum-easing-enter"
  | "ref-momentum-easing-exit"
  | "ref-momentum-easing-linear"
  | "ref-momentum-easing-move"
  | "ref-momentum-easing-standard"
  | "ref-momentum-easing-touch"
  | "ref-momentum-lift-hover"
  | "ref-momentum-scale-hover"
  | "ref-momentum-scale-press"
  | "ref-momentum-stagger-fast"
  | "ref-momentum-stagger-normal"
  | "ref-momentum-stagger-slow"
  | "ref-state-focus-ring-offset"
  | "ref-state-focus-ring-width"
  | "ref-state-loading-spin"
  | "ref-state-opacity-closed"
  | "ref-state-opacity-disabled"
  | "ref-state-opacity-faint"
  | "ref-state-opacity-low"
  | "ref-state-opacity-muted"
  | "ref-state-opacity-soft"
  | "ref-state-opacity-subtle"
  | "ref-state-opacity-visible"
  | "ref-state-overlay-hover"
  | "ref-state-overlay-pressed"
  | "ref-state-overlay-selected"
  | "ref-state-precedence-disabled"
  | "ref-state-precedence-error"
  | "ref-state-precedence-focus"
  | "ref-state-precedence-hover"
  | "ref-state-precedence-loading"
  | "ref-symbol-family-material"
  | "ref-symbol-grid-base"
  | "ref-symbol-live-area"
  | "ref-symbol-size-display-md"
  | "ref-symbol-size-display-sm"
  | "ref-symbol-size-lg"
  | "ref-symbol-size-lg-plus"
  | "ref-symbol-size-marker"
  | "ref-symbol-size-md"
  | "ref-symbol-size-md-plus"
  | "ref-symbol-size-sm"
  | "ref-symbol-size-sm-plus"
  | "ref-symbol-size-station"
  | "ref-symbol-size-xl"
  | "ref-symbol-size-xs"
  | "ref-symbol-stroke"
  | "ref-symbol-variation-filled"
  | "ref-symbol-variation-filled-strong"
  | "ref-symbol-variation-outline-strong"
  | "ref-tone-weight-assistive"
  | "ref-tone-weight-neutral"
  | "ref-tone-weight-repair"
  | "ref-tone-weight-urgent"
  | "ref-voice-family-brand"
  | "ref-voice-family-mono"
  | "ref-voice-family-sans"
  | "ref-voice-letter-spacing-caps"
  | "ref-voice-letter-spacing-expanded"
  | "ref-voice-letter-spacing-normal"
  | "ref-voice-letter-spacing-snug"
  | "ref-voice-letter-spacing-tight"
  | "ref-voice-letter-spacing-tighter"
  | "ref-voice-letter-spacing-wide"
  | "ref-voice-letter-spacing-wider"
  | "ref-voice-letter-spacing-widest"
  | "ref-voice-line-height-balanced"
  | "ref-voice-line-height-body"
  | "ref-voice-line-height-comfortable"
  | "ref-voice-line-height-compact"
  | "ref-voice-line-height-crisp"
  | "ref-voice-line-height-dense"
  | "ref-voice-line-height-display"
  | "ref-voice-line-height-loose"
  | "ref-voice-line-height-none"
  | "ref-voice-line-height-normal"
  | "ref-voice-line-height-reading"
  | "ref-voice-line-height-relaxed"
  | "ref-voice-line-height-snug"
  | "ref-voice-line-height-tight"
  | "ref-voice-line-height-tightest"
  | "ref-voice-size-1"
  | "ref-voice-size-10"
  | "ref-voice-size-11"
  | "ref-voice-size-12"
  | "ref-voice-size-13"
  | "ref-voice-size-14"
  | "ref-voice-size-2"
  | "ref-voice-size-3"
  | "ref-voice-size-4"
  | "ref-voice-size-5"
  | "ref-voice-size-6"
  | "ref-voice-size-7"
  | "ref-voice-size-8"
  | "ref-voice-size-9"
  | "ref-voice-weight-black"
  | "ref-voice-weight-bold"
  | "ref-voice-weight-extrabold"
  | "ref-voice-weight-medium"
  | "ref-voice-weight-regular"
  | "ref-voice-weight-semibold"
  | "sys-a11y-contrast-aa"
  | "sys-a11y-contrast-surface"
  | "sys-a11y-contrast-text"
  | "sys-a11y-focus-offset"
  | "sys-a11y-focus-ring"
  | "sys-a11y-motion-duration"
  | "sys-a11y-outline-reset"
  | "sys-a11y-overlay-depth"
  | "sys-a11y-readable-line-height"
  | "sys-a11y-touch-target-min"
  | "sys-accessibility-contrast-aa"
  | "sys-accessibility-contrast-surface"
  | "sys-accessibility-contrast-text"
  | "sys-accessibility-focus-offset"
  | "sys-accessibility-focus-ring"
  | "sys-accessibility-motion-duration"
  | "sys-accessibility-outline-reset"
  | "sys-accessibility-overlay-depth"
  | "sys-accessibility-readable-line-height"
  | "sys-accessibility-touch-target-min"
  | "sys-border-width-thin"
  | "sys-breakpoint-desktop"
  | "sys-breakpoint-laptop"
  | "sys-breakpoint-mobile"
  | "sys-breakpoint-tablet"
  | "sys-breakpoint-wide"
  | "sys-chart-axis-color"
  | "sys-chart-empty-color"
  | "sys-chart-focus-ring"
  | "sys-chart-grid-color"
  | "sys-chart-legend-text-color"
  | "sys-chart-motion-duration-enter"
  | "sys-chart-motion-duration-update"
  | "sys-chart-motion-easing-enter"
  | "sys-chart-motion-easing-update"
  | "sys-chart-series-primary"
  | "sys-chart-series-quaternary"
  | "sys-chart-series-secondary"
  | "sys-chart-series-tertiary"
  | "sys-chart-summary-font"
  | "sys-chart-summary-line-height"
  | "sys-chart-threshold-danger"
  | "sys-chart-threshold-warning"
  | "sys-chart-tooltip-background"
  | "sys-chart-tooltip-foreground"
  | "sys-color-action"
  | "sys-color-action-hover"
  | "sys-color-action-text"
  | "sys-color-border"
  | "sys-color-border-strong"
  | "sys-color-danger"
  | "sys-color-focus"
  | "sys-color-success"
  | "sys-color-surface"
  | "sys-color-surface-muted"
  | "sys-color-surface-raised"
  | "sys-color-text"
  | "sys-color-text-muted"
  | "sys-color-text-subtle"
  | "sys-color-warning"
  | "sys-density-card-padding"
  | "sys-density-component-gap"
  | "sys-density-component-gap-lg"
  | "sys-density-control-height"
  | "sys-density-control-padding-x"
  | "sys-density-control-padding-y"
  | "sys-density-doc-body-line-height"
  | "sys-density-doc-body-size"
  | "sys-density-doc-card-body-size"
  | "sys-density-doc-card-min-block"
  | "sys-density-doc-card-title-size"
  | "sys-density-doc-example-min-block"
  | "sys-density-doc-heading-line-height"
  | "sys-density-doc-heading-size"
  | "sys-density-doc-label-size"
  | "sys-density-doc-subheading-size"
  | "sys-density-page-gap"
  | "sys-density-panel-padding"
  | "sys-density-row-height"
  | "sys-density-section-gap"
  | "sys-density-subsection-gap"
  | "sys-density-surface-padding"
  | "sys-depth-backdrop-blur"
  | "sys-depth-blur-lg"
  | "sys-depth-blur-md"
  | "sys-depth-blur-sm"
  | "sys-depth-blur-topbar"
  | "sys-depth-elevation-0"
  | "sys-depth-elevation-1"
  | "sys-depth-elevation-2"
  | "sys-depth-elevation-3"
  | "sys-depth-elevation-4"
  | "sys-depth-lift-overlay"
  | "sys-depth-lift-raised"
  | "sys-depth-lift-rest"
  | "sys-depth-lift-subtle"
  | "sys-depth-overlay"
  | "sys-depth-z-base"
  | "sys-depth-z-dialog"
  | "sys-depth-z-dropdown"
  | "sys-depth-z-floating"
  | "sys-depth-z-local-popover"
  | "sys-depth-z-overlay"
  | "sys-depth-z-raised"
  | "sys-depth-z-sticky"
  | "sys-depth-z-toast"
  | "sys-depth-z-underlay"
  | "sys-disabled-border-color"
  | "sys-disabled-cursor"
  | "sys-disabled-icon-color"
  | "sys-disabled-opacity"
  | "sys-disabled-pointer-events"
  | "sys-disabled-readable-opacity"
  | "sys-disabled-surface-opacity"
  | "sys-disabled-text-color"
  | "sys-duration-base"
  | "sys-duration-cycle"
  | "sys-duration-enter"
  | "sys-duration-fast"
  | "sys-duration-instant"
  | "sys-duration-loading-cycle"
  | "sys-duration-loading-spin"
  | "sys-duration-medium"
  | "sys-duration-overlay"
  | "sys-duration-press"
  | "sys-duration-progress"
  | "sys-duration-pulse"
  | "sys-duration-reveal"
  | "sys-duration-sheet"
  | "sys-duration-slow"
  | "sys-duration-snappy"
  | "sys-duration-touch"
  | "sys-elevation-0"
  | "sys-elevation-1"
  | "sys-elevation-2"
  | "sys-elevation-3"
  | "sys-elevation-4"
  | "sys-elevation-card"
  | "sys-elevation-card-hover"
  | "sys-elevation-control"
  | "sys-elevation-floating"
  | "sys-elevation-modal"
  | "sys-elevation-popover"
  | "sys-elevation-sheet"
  | "sys-elevation-toast"
  | "sys-email-border-width"
  | "sys-email-color-accent"
  | "sys-email-color-border"
  | "sys-email-color-border-soft"
  | "sys-email-color-danger"
  | "sys-email-color-link"
  | "sys-email-color-page"
  | "sys-email-color-success"
  | "sys-email-color-text-muted"
  | "sys-email-color-text-primary"
  | "sys-email-color-text-secondary"
  | "sys-email-color-warning"
  | "sys-email-color-white"
  | "sys-email-content-width"
  | "sys-email-font-family-body"
  | "sys-email-font-family-fallback"
  | "sys-email-font-family-mono"
  | "sys-email-font-size-body"
  | "sys-email-font-size-brand"
  | "sys-email-font-size-code"
  | "sys-email-font-size-code-label"
  | "sys-email-font-size-headline"
  | "sys-email-font-size-hidden"
  | "sys-email-font-size-list"
  | "sys-email-font-size-note"
  | "sys-email-font-size-sm"
  | "sys-email-font-size-step"
  | "sys-email-font-size-transactional-headline"
  | "sys-email-font-size-xs"
  | "sys-email-letter-spacing-code"
  | "sys-email-letter-spacing-eyebrow"
  | "sys-email-letter-spacing-label"
  | "sys-email-letter-spacing-tight"
  | "sys-email-line-height-body"
  | "sys-email-line-height-headline"
  | "sys-email-line-height-hidden"
  | "sys-email-line-height-note"
  | "sys-email-line-height-transactional-headline"
  | "sys-email-radius-card"
  | "sys-email-radius-metric"
  | "sys-email-radius-pill"
  | "sys-email-space-2xl"
  | "sys-email-space-3xl"
  | "sys-email-space-4xl"
  | "sys-email-space-5xl"
  | "sys-email-space-6xl"
  | "sys-email-space-7xl"
  | "sys-email-space-lg"
  | "sys-email-space-md"
  | "sys-email-space-sm"
  | "sys-email-space-xl"
  | "sys-email-space-xs"
  | "sys-email-space-xxs"
  | "sys-energy-action-hover"
  | "sys-energy-action-primary"
  | "sys-energy-border-default"
  | "sys-energy-border-strong"
  | "sys-energy-status-error"
  | "sys-energy-status-info"
  | "sys-energy-status-success"
  | "sys-energy-status-warning"
  | "sys-energy-status-warning-foreground"
  | "sys-energy-surface-accent"
  | "sys-energy-surface-primary"
  | "sys-energy-surface-secondary"
  | "sys-energy-surface-sunken"
  | "sys-energy-surface-tertiary"
  | "sys-energy-text-on-action"
  | "sys-energy-text-primary"
  | "sys-energy-text-secondary"
  | "sys-energy-text-tertiary"
  | "sys-focus-restore-ring"
  | "sys-focus-ring"
  | "sys-focus-ring-offset"
  | "sys-focus-roving-ring"
  | "sys-focus-skip-target-offset"
  | "sys-focus-trap-z-index"
  | "sys-focus-visible-offset"
  | "sys-focus-visible-ring"
  | "sys-font-body"
  | "sys-font-icon"
  | "sys-font-mono"
  | "sys-font-title"
  | "sys-font-weight-regular"
  | "sys-font-weight-semibold"
  | "sys-frame-border-control"
  | "sys-frame-border-indicator"
  | "sys-frame-border-medium"
  | "sys-frame-border-thin"
  | "sys-frame-brand-logo-max"
  | "sys-frame-brand-logo-min"
  | "sys-frame-brand-logo-mobile-max"
  | "sys-frame-brand-logo-mobile-min"
  | "sys-frame-breakpoint-lg"
  | "sys-frame-breakpoint-md"
  | "sys-frame-breakpoint-shell-sidebar"
  | "sys-frame-breakpoint-sm"
  | "sys-frame-breakpoint-xl"
  | "sys-frame-button-padding-x-lg"
  | "sys-frame-button-padding-x-md"
  | "sys-frame-button-padding-x-sm"
  | "sys-frame-content-action-control-lg"
  | "sys-frame-content-action-control-md"
  | "sys-frame-content-action-control-sm"
  | "sys-frame-content-action-label-lg"
  | "sys-frame-content-action-label-md"
  | "sys-frame-content-action-label-sm"
  | "sys-frame-content-action-label-xl"
  | "sys-frame-content-action-min-block-lg"
  | "sys-frame-content-action-min-block-md"
  | "sys-frame-content-action-min-inline-lg"
  | "sys-frame-content-action-min-inline-md"
  | "sys-frame-content-action-min-inline-sm"
  | "sys-frame-content-callout"
  | "sys-frame-content-card-chip-block-lg"
  | "sys-frame-content-card-chip-block-md"
  | "sys-frame-content-card-chip-block-sm"
  | "sys-frame-content-card-chip-inline-lg"
  | "sys-frame-content-card-chip-inline-md"
  | "sys-frame-content-card-chip-inline-sm"
  | "sys-frame-content-card-media-block"
  | "sys-frame-content-code-slot-block-lg"
  | "sys-frame-content-code-slot-block-md"
  | "sys-frame-content-code-slot-block-sm"
  | "sys-frame-content-code-slot-inline-lg"
  | "sys-frame-content-code-slot-inline-md"
  | "sys-frame-content-code-slot-inline-sm"
  | "sys-frame-content-country-listbox-inline"
  | "sys-frame-content-country-listbox-max-inline"
  | "sys-frame-content-date-panel"
  | "sys-frame-content-date-range-panel"
  | "sys-frame-content-date-range-preset-min-block"
  | "sys-frame-content-dialog"
  | "sys-frame-content-disclosure-trigger-min-block-lg"
  | "sys-frame-content-disclosure-trigger-min-block-md"
  | "sys-frame-content-disclosure-trigger-min-block-sm"
  | "sys-frame-content-drawer-lg"
  | "sys-frame-content-drawer-md"
  | "sys-frame-content-drawer-sm"
  | "sys-frame-content-feedback-action-size"
  | "sys-frame-content-hero-copy"
  | "sys-frame-content-hero-visual"
  | "sys-frame-content-inline-trigger-min-block-lg"
  | "sys-frame-content-inline-trigger-min-block-md"
  | "sys-frame-content-inline-trigger-min-block-sm"
  | "sys-frame-content-map-pin-min-block-lg"
  | "sys-frame-content-map-pin-min-block-md"
  | "sys-frame-content-map-pin-min-block-sm"
  | "sys-frame-content-max"
  | "sys-frame-content-menu-max-block"
  | "sys-frame-content-menu-min"
  | "sys-frame-content-menu-min-lg"
  | "sys-frame-content-menu-min-md"
  | "sys-frame-content-menu-min-sm"
  | "sys-frame-content-menu-wide"
  | "sys-frame-content-metric-min-lg"
  | "sys-frame-content-metric-min-md"
  | "sys-frame-content-metric-min-sm"
  | "sys-frame-content-metric-min-xs"
  | "sys-frame-content-movement-icon-size"
  | "sys-frame-content-movement-row-min-block-lg"
  | "sys-frame-content-movement-row-min-block-md"
  | "sys-frame-content-movement-row-min-block-sm"
  | "sys-frame-content-narrow"
  | "sys-frame-content-navigation-ellipsis-inline"
  | "sys-frame-content-navigation-target-lg"
  | "sys-frame-content-navigation-target-md"
  | "sys-frame-content-navigation-target-sm"
  | "sys-frame-content-option-min-block"
  | "sys-frame-content-phone-input-flex-basis"
  | "sys-frame-content-phone-input-flex-basis-compact"
  | "sys-frame-content-phone-input-min-inline"
  | "sys-frame-content-phone-input-min-inline-compact"
  | "sys-frame-content-prose"
  | "sys-frame-content-prose-wide"
  | "sys-frame-content-search-min"
  | "sys-frame-content-search-results-max-block"
  | "sys-frame-content-segmented-control-inline"
  | "sys-frame-content-skeleton-circle"
  | "sys-frame-content-skeleton-row-leading"
  | "sys-frame-content-step-marker-lg"
  | "sys-frame-content-step-marker-md"
  | "sys-frame-content-step-marker-sm"
  | "sys-frame-content-step-text-max-inline"
  | "sys-frame-content-step-text-min-inline"
  | "sys-frame-content-tab-label-max"
  | "sys-frame-content-table-expander"
  | "sys-frame-content-tree-control-lg"
  | "sys-frame-device-border-block"
  | "sys-frame-device-border-block-sm"
  | "sys-frame-device-border-inline"
  | "sys-frame-device-border-inline-sm"
  | "sys-frame-doc-card-grid-min"
  | "sys-frame-doc-card-min-block-lg"
  | "sys-frame-doc-card-min-block-md"
  | "sys-frame-doc-device-min-block"
  | "sys-frame-doc-device-width"
  | "sys-frame-doc-dot"
  | "sys-frame-doc-grid-lg"
  | "sys-frame-doc-grid-md"
  | "sys-frame-doc-grid-sm"
  | "sys-frame-doc-icon-lg"
  | "sys-frame-doc-icon-md"
  | "sys-frame-doc-icon-sm"
  | "sys-frame-doc-line"
  | "sys-frame-doc-panel-min-lg"
  | "sys-frame-doc-panel-min-md"
  | "sys-frame-doc-panel-min-sm"
  | "sys-frame-doc-panel-min-xl"
  | "sys-frame-doc-pill-min-block"
  | "sys-frame-doc-stage-inline"
  | "sys-frame-doc-surface-max-inline"
  | "sys-frame-doc-table-inline"
  | "sys-frame-gap-component"
  | "sys-frame-gap-component-lg"
  | "sys-frame-gap-element"
  | "sys-frame-gap-page"
  | "sys-frame-gap-section"
  | "sys-frame-gap-subsection"
  | "sys-frame-gap-topnav-max"
  | "sys-frame-gap-topnav-min"
  | "sys-frame-grid-lg-columns"
  | "sys-frame-grid-lg-gutter"
  | "sys-frame-grid-lg-margin"
  | "sys-frame-grid-lg-max-width"
  | "sys-frame-grid-md-columns"
  | "sys-frame-grid-md-gutter"
  | "sys-frame-grid-md-margin"
  | "sys-frame-grid-sm-columns"
  | "sys-frame-grid-sm-gutter"
  | "sys-frame-grid-sm-margin"
  | "sys-frame-height-control-lg"
  | "sys-frame-height-control-md"
  | "sys-frame-height-control-sm"
  | "sys-frame-height-shell-topbar"
  | "sys-frame-height-shell-topbar-mobile"
  | "sys-frame-max-width-control"
  | "sys-frame-min-width-control"
  | "sys-frame-padding-container"
  | "sys-frame-padding-control"
  | "sys-frame-padding-inset-s"
  | "sys-frame-padding-surface"
  | "sys-frame-position-center"
  | "sys-frame-radius-container"
  | "sys-frame-radius-control"
  | "sys-frame-radius-full"
  | "sys-frame-radius-md"
  | "sys-frame-radius-sm"
  | "sys-frame-radius-surface"
  | "sys-frame-ratio-half"
  | "sys-frame-sidebar-collapsed"
  | "sys-frame-sidebar-expanded"
  | "sys-frame-space-micro"
  | "sys-frame-space-none"
  | "sys-frame-template-desktop-inline-min"
  | "sys-frame-template-desktop-inline-wide"
  | "sys-frame-width-control"
  | "sys-growth-event-font"
  | "sys-growth-stage-deprecated-color"
  | "sys-growth-stage-measured-color"
  | "sys-growth-stage-seed-color"
  | "sys-growth-stage-stable-color"
  | "sys-icon-color-action"
  | "sys-icon-color-danger"
  | "sys-icon-color-disabled"
  | "sys-icon-color-muted"
  | "sys-icon-color-navigation"
  | "sys-icon-color-status"
  | "sys-icon-color-warning"
  | "sys-icon-family"
  | "sys-icon-focus-offset"
  | "sys-icon-focus-ring"
  | "sys-icon-size-display-md"
  | "sys-icon-size-display-sm"
  | "sys-icon-size-lg"
  | "sys-icon-size-lg-plus"
  | "sys-icon-size-marker"
  | "sys-icon-size-md"
  | "sys-icon-size-md-plus"
  | "sys-icon-size-sm"
  | "sys-icon-size-sm-plus"
  | "sys-icon-size-station"
  | "sys-icon-touch-target-min"
  | "sys-icon-variation-filled"
  | "sys-icon-variation-filled-strong"
  | "sys-icon-variation-outline-strong"
  | "sys-iconography-color-action"
  | "sys-iconography-color-danger"
  | "sys-iconography-color-disabled"
  | "sys-iconography-color-muted"
  | "sys-iconography-color-navigation"
  | "sys-iconography-color-status"
  | "sys-iconography-color-warning"
  | "sys-iconography-family"
  | "sys-iconography-focus-offset"
  | "sys-iconography-focus-ring"
  | "sys-iconography-size-display-md"
  | "sys-iconography-size-display-sm"
  | "sys-iconography-size-lg"
  | "sys-iconography-size-lg-plus"
  | "sys-iconography-size-marker"
  | "sys-iconography-size-md"
  | "sys-iconography-size-md-plus"
  | "sys-iconography-size-sm"
  | "sys-iconography-size-sm-plus"
  | "sys-iconography-size-station"
  | "sys-iconography-touch-target-min"
  | "sys-iconography-variation-filled"
  | "sys-iconography-variation-filled-strong"
  | "sys-iconography-variation-outline-strong"
  | "sys-line-height-normal"
  | "sys-loading-busy-cursor"
  | "sys-loading-cycle-duration"
  | "sys-loading-easing-linear"
  | "sys-loading-easing-rhythm"
  | "sys-loading-progress-duration"
  | "sys-loading-progress-fill"
  | "sys-loading-progress-track"
  | "sys-loading-pulse-duration"
  | "sys-loading-skeleton-highlight"
  | "sys-loading-skeleton-surface"
  | "sys-loading-spin-duration"
  | "sys-loading-spinner-tone"
  | "sys-loading-spinner-track"
  | "sys-loading-stale-opacity"
  | "sys-map-depth-pin"
  | "sys-map-depth-selected"
  | "sys-map-fallback-surface"
  | "sys-map-fallback-text-color"
  | "sys-map-focus-ring"
  | "sys-map-permission-denied-color"
  | "sys-map-permission-granted-color"
  | "sys-map-permission-prompt-color"
  | "sys-map-pin-action-color"
  | "sys-map-pin-background"
  | "sys-map-pin-border"
  | "sys-map-pin-cluster-background"
  | "sys-map-pin-cluster-foreground"
  | "sys-map-pin-foreground"
  | "sys-map-pin-selected-background"
  | "sys-map-pin-selected-foreground"
  | "sys-map-route-line-color"
  | "sys-map-route-line-muted-color"
  | "sys-measurement-analytics-color"
  | "sys-measurement-event-color"
  | "sys-measurement-event-font"
  | "sys-measurement-guardrail-background"
  | "sys-measurement-guardrail-color"
  | "sys-measurement-hypothesis-color"
  | "sys-measurement-metric-color"
  | "sys-measurement-metric-font"
  | "sys-measurement-metric-weight"
  | "sys-measurement-privacy-color"
  | "sys-message-action-weight"
  | "sys-message-alert-role"
  | "sys-message-body-font"
  | "sys-message-body-weight"
  | "sys-message-focus-ring"
  | "sys-message-intent-assistive-color"
  | "sys-message-intent-danger-color"
  | "sys-message-intent-neutral-color"
  | "sys-message-intent-success-color"
  | "sys-message-intent-warning-color"
  | "sys-message-live-role"
  | "sys-message-locale-max-inline-size"
  | "sys-message-readable-line-height"
  | "sys-message-recovery-weight"
  | "sys-message-title-font"
  | "sys-message-title-weight"
  | "sys-momentum-cue-transform-active"
  | "sys-momentum-cue-transform-enter"
  | "sys-momentum-cue-transform-exit"
  | "sys-momentum-cue-transform-idle"
  | "sys-momentum-duration-critical"
  | "sys-momentum-duration-cycle"
  | "sys-momentum-duration-default"
  | "sys-momentum-duration-enter"
  | "sys-momentum-duration-fast"
  | "sys-momentum-duration-instant"
  | "sys-momentum-duration-loading-cycle"
  | "sys-momentum-duration-loading-spin"
  | "sys-momentum-duration-loop"
  | "sys-momentum-duration-medium"
  | "sys-momentum-duration-overlay"
  | "sys-momentum-duration-press"
  | "sys-momentum-duration-progress"
  | "sys-momentum-duration-pulse"
  | "sys-momentum-duration-reveal"
  | "sys-momentum-duration-route"
  | "sys-momentum-duration-sheet"
  | "sys-momentum-duration-slow"
  | "sys-momentum-duration-slower"
  | "sys-momentum-duration-snappy"
  | "sys-momentum-duration-touch"
  | "sys-momentum-easing-enter"
  | "sys-momentum-easing-exit"
  | "sys-momentum-easing-linear"
  | "sys-momentum-easing-move"
  | "sys-momentum-easing-standard"
  | "sys-momentum-easing-touch"
  | "sys-momentum-lift-hover"
  | "sys-momentum-progress-translate-end"
  | "sys-momentum-progress-translate-mid"
  | "sys-momentum-progress-translate-start"
  | "sys-momentum-rotate-cycle"
  | "sys-momentum-rotate-expanded"
  | "sys-momentum-rotate-quarter"
  | "sys-momentum-rotate-rest"
  | "sys-momentum-rotate-tilt"
  | "sys-momentum-scale-current-overshoot"
  | "sys-momentum-scale-current-start"
  | "sys-momentum-scale-enter"
  | "sys-momentum-scale-hover"
  | "sys-momentum-scale-none"
  | "sys-momentum-scale-press"
  | "sys-momentum-scale-quiet"
  | "sys-momentum-scale-raised"
  | "sys-momentum-scale-rest"
  | "sys-momentum-scale-settle"
  | "sys-momentum-stagger-chart"
  | "sys-momentum-stagger-chart-compact"
  | "sys-momentum-stagger-fast"
  | "sys-momentum-stagger-normal"
  | "sys-momentum-stagger-sequence-2"
  | "sys-momentum-stagger-sequence-3"
  | "sys-momentum-stagger-slow"
  | "sys-momentum-transition-default"
  | "sys-momentum-transition-fast"
  | "sys-momentum-transition-slow"
  | "sys-momentum-transition-touch"
  | "sys-momentum-translate-inline-nudge"
  | "sys-momentum-translate-rest"
  | "sys-motion-curve-enter"
  | "sys-motion-curve-exit"
  | "sys-motion-curve-linear"
  | "sys-motion-curve-move"
  | "sys-motion-curve-standard"
  | "sys-motion-curve-touch"
  | "sys-radius-0"
  | "sys-radius-container"
  | "sys-radius-control"
  | "sys-radius-full"
  | "sys-radius-lg"
  | "sys-radius-md"
  | "sys-radius-pill"
  | "sys-radius-sm"
  | "sys-radius-surface"
  | "sys-radius-xl"
  | "sys-radius-xs"
  | "sys-research-confidence-high-color"
  | "sys-research-confidence-low-color"
  | "sys-research-confidence-medium-color"
  | "sys-research-context-color"
  | "sys-research-decision-link-color"
  | "sys-research-evidence-color"
  | "sys-research-hypothesis-color"
  | "sys-research-question-font"
  | "sys-research-question-weight"
  | "sys-research-readable-line-height"
  | "sys-research-risk-color"
  | "sys-space-0"
  | "sys-space-1"
  | "sys-space-10"
  | "sys-space-11"
  | "sys-space-12"
  | "sys-space-16"
  | "sys-space-2"
  | "sys-space-20"
  | "sys-space-24"
  | "sys-space-2xl"
  | "sys-space-2xs"
  | "sys-space-3"
  | "sys-space-32"
  | "sys-space-3xl"
  | "sys-space-4"
  | "sys-space-40"
  | "sys-space-4xl"
  | "sys-space-5"
  | "sys-space-5xl"
  | "sys-space-6"
  | "sys-space-7"
  | "sys-space-8"
  | "sys-space-9"
  | "sys-space-lg"
  | "sys-space-md"
  | "sys-space-micro"
  | "sys-space-sm"
  | "sys-space-xl"
  | "sys-space-xs"
  | "sys-spacing-component-lg"
  | "sys-spacing-component-md"
  | "sys-spacing-component-sm"
  | "sys-spacing-inline-sm"
  | "sys-spacing-inline-xs"
  | "sys-spacing-page"
  | "sys-spacing-section"
  | "sys-state-closed-opacity"
  | "sys-state-disabled-opacity"
  | "sys-state-disabled-readable-opacity"
  | "sys-state-focus-offset"
  | "sys-state-focus-ring"
  | "sys-state-hidden-opacity"
  | "sys-state-hover-overlay"
  | "sys-state-loading-spin"
  | "sys-state-muted-opacity"
  | "sys-state-pressed-overlay"
  | "sys-state-selected-overlay"
  | "sys-state-visible-opacity"
  | "sys-symbol-color-action"
  | "sys-symbol-color-danger"
  | "sys-symbol-color-muted"
  | "sys-symbol-color-status"
  | "sys-symbol-color-warning"
  | "sys-symbol-family"
  | "sys-symbol-size-display-md"
  | "sys-symbol-size-display-sm"
  | "sys-symbol-size-lg"
  | "sys-symbol-size-lg-plus"
  | "sys-symbol-size-marker"
  | "sys-symbol-size-md"
  | "sys-symbol-size-md-plus"
  | "sys-symbol-size-sm"
  | "sys-symbol-size-sm-plus"
  | "sys-symbol-size-station"
  | "sys-symbol-variation-filled"
  | "sys-symbol-variation-filled-strong"
  | "sys-symbol-variation-outline-strong"
  | "sys-tone-assistive-color"
  | "sys-tone-assistive-weight"
  | "sys-tone-confirm-color"
  | "sys-tone-neutral-color"
  | "sys-tone-neutral-weight"
  | "sys-tone-repair-color"
  | "sys-tone-repair-weight"
  | "sys-tone-urgent-color"
  | "sys-tone-urgent-weight"
  | "sys-touch-target-min"
  | "sys-voice-caption-line-height"
  | "sys-voice-caption-size"
  | "sys-voice-code-line-height"
  | "sys-voice-code-size"
  | "sys-voice-code-sm-size"
  | "sys-voice-display-lg-family"
  | "sys-voice-display-lg-letter-spacing"
  | "sys-voice-display-lg-line-height"
  | "sys-voice-display-lg-size"
  | "sys-voice-display-lg-weight"
  | "sys-voice-display-md-family"
  | "sys-voice-display-md-letter-spacing"
  | "sys-voice-display-md-line-height"
  | "sys-voice-display-md-size"
  | "sys-voice-display-md-weight"
  | "sys-voice-display-sm-family"
  | "sys-voice-display-sm-letter-spacing"
  | "sys-voice-display-sm-line-height"
  | "sys-voice-display-sm-size"
  | "sys-voice-display-sm-weight"
  | "sys-voice-family"
  | "sys-voice-family-body"
  | "sys-voice-family-brand"
  | "sys-voice-family-control"
  | "sys-voice-family-mono"
  | "sys-voice-family-title"
  | "sys-voice-heading-lg-family"
  | "sys-voice-heading-lg-letter-spacing"
  | "sys-voice-heading-lg-line-height"
  | "sys-voice-heading-lg-size"
  | "sys-voice-heading-lg-weight"
  | "sys-voice-heading-md-family"
  | "sys-voice-heading-md-letter-spacing"
  | "sys-voice-heading-md-line-height"
  | "sys-voice-heading-md-size"
  | "sys-voice-heading-md-weight"
  | "sys-voice-heading-sm-family"
  | "sys-voice-heading-sm-letter-spacing"
  | "sys-voice-heading-sm-line-height"
  | "sys-voice-heading-sm-size"
  | "sys-voice-heading-sm-weight"
  | "sys-voice-label-lg-line-height"
  | "sys-voice-label-lg-size"
  | "sys-voice-label-md-line-height"
  | "sys-voice-label-md-size"
  | "sys-voice-label-sm-line-height"
  | "sys-voice-label-sm-size"
  | "sys-voice-letter-spacing-caps"
  | "sys-voice-letter-spacing-control"
  | "sys-voice-letter-spacing-expanded"
  | "sys-voice-letter-spacing-normal"
  | "sys-voice-letter-spacing-snug"
  | "sys-voice-letter-spacing-tight"
  | "sys-voice-letter-spacing-wide"
  | "sys-voice-letter-spacing-wider"
  | "sys-voice-letter-spacing-widest"
  | "sys-voice-line-height-balanced"
  | "sys-voice-line-height-body"
  | "sys-voice-line-height-body-sm"
  | "sys-voice-line-height-comfortable"
  | "sys-voice-line-height-compact"
  | "sys-voice-line-height-control"
  | "sys-voice-line-height-crisp"
  | "sys-voice-line-height-dense"
  | "sys-voice-line-height-display"
  | "sys-voice-line-height-loose"
  | "sys-voice-line-height-none"
  | "sys-voice-line-height-normal"
  | "sys-voice-line-height-reading"
  | "sys-voice-line-height-relaxed"
  | "sys-voice-line-height-snug"
  | "sys-voice-line-height-tight"
  | "sys-voice-line-height-tightest"
  | "sys-voice-numeral-family"
  | "sys-voice-numeral-lg-size"
  | "sys-voice-numeral-line-height"
  | "sys-voice-numeral-weight"
  | "sys-voice-overline-line-height"
  | "sys-voice-overline-size"
  | "sys-voice-paragraph-lg-line-height"
  | "sys-voice-paragraph-lg-size"
  | "sys-voice-paragraph-md-line-height"
  | "sys-voice-paragraph-md-size"
  | "sys-voice-paragraph-sm-line-height"
  | "sys-voice-paragraph-sm-size"
  | "sys-voice-size-1"
  | "sys-voice-size-10"
  | "sys-voice-size-11"
  | "sys-voice-size-12"
  | "sys-voice-size-13"
  | "sys-voice-size-14"
  | "sys-voice-size-2"
  | "sys-voice-size-3"
  | "sys-voice-size-4"
  | "sys-voice-size-5"
  | "sys-voice-size-6"
  | "sys-voice-size-7"
  | "sys-voice-size-8"
  | "sys-voice-size-9"
  | "sys-voice-size-body"
  | "sys-voice-size-body-sm"
  | "sys-voice-size-caption"
  | "sys-voice-size-label"
  | "sys-voice-size-overline"
  | "sys-voice-transform-none"
  | "sys-voice-transform-uppercase"
  | "sys-voice-weight-black"
  | "sys-voice-weight-bold"
  | "sys-voice-weight-control"
  | "sys-voice-weight-extrabold"
  | "sys-voice-weight-medium"
  | "sys-voice-weight-regular"
  | "sys-voice-weight-semibold";

export type FlowToken = {
  readonly value: string;
  readonly type: string;
  readonly scope: string;
  readonly cssVariable: `--${string}`;
  readonly reference?: string;
  readonly cssReference?: `--${string}`;
};

export const flowTokens = {
  "density-doc-body-line-height": {
    "value": "var(--sys-density-doc-body-line-height)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-body-line-height",
    "reference": "sys-density-doc-body-line-height",
    "cssReference": "--sys-density-doc-body-line-height"
  },
  "density-doc-body-size": {
    "value": "var(--sys-density-doc-body-size)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-body-size",
    "reference": "sys-density-doc-body-size",
    "cssReference": "--sys-density-doc-body-size"
  },
  "density-doc-card-body-size": {
    "value": "var(--sys-density-doc-card-body-size)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-card-body-size",
    "reference": "sys-density-doc-card-body-size",
    "cssReference": "--sys-density-doc-card-body-size"
  },
  "density-doc-card-min-block": {
    "value": "var(--sys-density-doc-card-min-block)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-card-min-block",
    "reference": "sys-density-doc-card-min-block",
    "cssReference": "--sys-density-doc-card-min-block"
  },
  "density-doc-card-title-size": {
    "value": "var(--sys-density-doc-card-title-size)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-card-title-size",
    "reference": "sys-density-doc-card-title-size",
    "cssReference": "--sys-density-doc-card-title-size"
  },
  "density-doc-example-min-block": {
    "value": "var(--sys-density-doc-example-min-block)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-example-min-block",
    "reference": "sys-density-doc-example-min-block",
    "cssReference": "--sys-density-doc-example-min-block"
  },
  "density-doc-heading-line-height": {
    "value": "var(--sys-density-doc-heading-line-height)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-heading-line-height",
    "reference": "sys-density-doc-heading-line-height",
    "cssReference": "--sys-density-doc-heading-line-height"
  },
  "density-doc-heading-size": {
    "value": "var(--sys-density-doc-heading-size)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-heading-size",
    "reference": "sys-density-doc-heading-size",
    "cssReference": "--sys-density-doc-heading-size"
  },
  "density-doc-label-size": {
    "value": "var(--sys-density-doc-label-size)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-label-size",
    "reference": "sys-density-doc-label-size",
    "cssReference": "--sys-density-doc-label-size"
  },
  "density-doc-subheading-size": {
    "value": "var(--sys-density-doc-subheading-size)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-doc-subheading-size",
    "reference": "sys-density-doc-subheading-size",
    "cssReference": "--sys-density-doc-subheading-size"
  },
  "sys-density-doc-body-line-height": {
    "value": "var(--sys-voice-line-height-relaxed)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-body-line-height",
    "reference": "sys-voice-line-height-relaxed",
    "cssReference": "--sys-voice-line-height-relaxed"
  },
  "sys-density-doc-body-size": {
    "value": "var(--sys-voice-size-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-body-size",
    "reference": "sys-voice-size-6",
    "cssReference": "--sys-voice-size-6"
  },
  "sys-density-doc-card-body-size": {
    "value": "var(--sys-voice-size-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-card-body-size",
    "reference": "sys-voice-size-6",
    "cssReference": "--sys-voice-size-6"
  },
  "sys-density-doc-card-min-block": {
    "value": "calc(var(--sys-density-row-height) * 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-card-min-block"
  },
  "sys-density-doc-card-title-size": {
    "value": "var(--sys-voice-size-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-card-title-size",
    "reference": "sys-voice-size-6",
    "cssReference": "--sys-voice-size-6"
  },
  "sys-density-doc-example-min-block": {
    "value": "calc(var(--sys-density-row-height) * 3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-example-min-block"
  },
  "sys-density-doc-heading-line-height": {
    "value": "var(--sys-voice-line-height-tight)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-heading-line-height",
    "reference": "sys-voice-line-height-tight",
    "cssReference": "--sys-voice-line-height-tight"
  },
  "sys-density-doc-heading-size": {
    "value": "var(--sys-voice-size-10)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-heading-size",
    "reference": "sys-voice-size-10",
    "cssReference": "--sys-voice-size-10"
  },
  "sys-density-doc-label-size": {
    "value": "var(--sys-voice-size-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-label-size",
    "reference": "sys-voice-size-3",
    "cssReference": "--sys-voice-size-3"
  },
  "sys-density-doc-subheading-size": {
    "value": "var(--sys-voice-size-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-doc-subheading-size",
    "reference": "sys-voice-size-9",
    "cssReference": "--sys-voice-size-9"
  },
  "ref-a11y-contrast-aa": {
    "value": "4.5",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-a11y-contrast-aa"
  },
  "ref-a11y-contrast-large": {
    "value": "3",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-a11y-contrast-large"
  },
  "ref-a11y-motion-reduced-duration": {
    "value": "1ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-a11y-motion-reduced-duration"
  },
  "ref-a11y-outline-reset": {
    "value": "0",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-a11y-outline-reset"
  },
  "ref-a11y-touch-target-min": {
    "value": "44px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-a11y-touch-target-min"
  },
  "sys-a11y-contrast-aa": {
    "value": "var(--ref-a11y-contrast-aa)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-a11y-contrast-aa",
    "reference": "ref-a11y-contrast-aa",
    "cssReference": "--ref-a11y-contrast-aa"
  },
  "sys-a11y-contrast-surface": {
    "value": "var(--sys-energy-surface-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-a11y-contrast-surface",
    "reference": "sys-energy-surface-primary",
    "cssReference": "--sys-energy-surface-primary"
  },
  "sys-a11y-contrast-text": {
    "value": "var(--sys-energy-text-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-a11y-contrast-text",
    "reference": "sys-energy-text-primary",
    "cssReference": "--sys-energy-text-primary"
  },
  "sys-a11y-focus-offset": {
    "value": "var(--sys-state-focus-offset)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-a11y-focus-offset",
    "reference": "sys-state-focus-offset",
    "cssReference": "--sys-state-focus-offset"
  },
  "sys-a11y-focus-ring": {
    "value": "var(--sys-state-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-a11y-focus-ring",
    "reference": "sys-state-focus-ring",
    "cssReference": "--sys-state-focus-ring"
  },
  "sys-a11y-motion-duration": {
    "value": "var(--sys-momentum-duration-default)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-a11y-motion-duration",
    "reference": "sys-momentum-duration-default",
    "cssReference": "--sys-momentum-duration-default"
  },
  "sys-a11y-outline-reset": {
    "value": "var(--ref-a11y-outline-reset)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-a11y-outline-reset",
    "reference": "ref-a11y-outline-reset",
    "cssReference": "--ref-a11y-outline-reset"
  },
  "sys-a11y-overlay-depth": {
    "value": "var(--sys-depth-elevation-2)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-a11y-overlay-depth",
    "reference": "sys-depth-elevation-2",
    "cssReference": "--sys-depth-elevation-2"
  },
  "sys-a11y-readable-line-height": {
    "value": "var(--sys-voice-line-height-body)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-a11y-readable-line-height",
    "reference": "sys-voice-line-height-body",
    "cssReference": "--sys-voice-line-height-body"
  },
  "sys-a11y-touch-target-min": {
    "value": "max(var(--ref-a11y-touch-target-min), var(--sys-frame-height-control-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-a11y-touch-target-min"
  },
  "sys-accessibility-contrast-aa": {
    "value": "var(--sys-a11y-contrast-aa)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-contrast-aa",
    "reference": "sys-a11y-contrast-aa",
    "cssReference": "--sys-a11y-contrast-aa"
  },
  "sys-accessibility-contrast-surface": {
    "value": "var(--sys-a11y-contrast-surface)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-contrast-surface",
    "reference": "sys-a11y-contrast-surface",
    "cssReference": "--sys-a11y-contrast-surface"
  },
  "sys-accessibility-contrast-text": {
    "value": "var(--sys-a11y-contrast-text)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-contrast-text",
    "reference": "sys-a11y-contrast-text",
    "cssReference": "--sys-a11y-contrast-text"
  },
  "sys-accessibility-focus-offset": {
    "value": "var(--sys-a11y-focus-offset)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-focus-offset",
    "reference": "sys-a11y-focus-offset",
    "cssReference": "--sys-a11y-focus-offset"
  },
  "sys-accessibility-focus-ring": {
    "value": "var(--sys-a11y-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-focus-ring",
    "reference": "sys-a11y-focus-ring",
    "cssReference": "--sys-a11y-focus-ring"
  },
  "sys-accessibility-motion-duration": {
    "value": "var(--sys-a11y-motion-duration)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-motion-duration",
    "reference": "sys-a11y-motion-duration",
    "cssReference": "--sys-a11y-motion-duration"
  },
  "sys-accessibility-outline-reset": {
    "value": "var(--sys-a11y-outline-reset)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-outline-reset",
    "reference": "sys-a11y-outline-reset",
    "cssReference": "--sys-a11y-outline-reset"
  },
  "sys-accessibility-overlay-depth": {
    "value": "var(--sys-a11y-overlay-depth)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-overlay-depth",
    "reference": "sys-a11y-overlay-depth",
    "cssReference": "--sys-a11y-overlay-depth"
  },
  "sys-accessibility-readable-line-height": {
    "value": "var(--sys-a11y-readable-line-height)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-readable-line-height",
    "reference": "sys-a11y-readable-line-height",
    "cssReference": "--sys-a11y-readable-line-height"
  },
  "sys-accessibility-touch-target-min": {
    "value": "var(--sys-a11y-touch-target-min)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-accessibility-touch-target-min",
    "reference": "sys-a11y-touch-target-min",
    "cssReference": "--sys-a11y-touch-target-min"
  },
  "sys-touch-target-min": {
    "value": "var(--sys-a11y-touch-target-min)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-touch-target-min",
    "reference": "sys-a11y-touch-target-min",
    "cssReference": "--sys-a11y-touch-target-min"
  },
  "ref-depth-shadow-color-rgb": {
    "value": "16 26 119",
    "type": "shadow",
    "scope": "ref",
    "cssVariable": "--ref-depth-shadow-color-rgb"
  },
  "ref-depth-overlay-light": {
    "value": "color-mix(in srgb, var(--ref-energy-neutral-900) 50%, transparent)",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-depth-overlay-light"
  },
  "ref-depth-overlay-dark": {
    "value": "color-mix(in srgb, var(--ref-energy-neutral-900) 65%, transparent)",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-depth-overlay-dark"
  },
  "ref-depth-blur-sm": {
    "value": "4px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-depth-blur-sm"
  },
  "ref-depth-blur-md": {
    "value": "8px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-depth-blur-md"
  },
  "ref-depth-blur-lg": {
    "value": "16px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-depth-blur-lg"
  },
  "ref-depth-z-base": {
    "value": "0",
    "type": "shadow",
    "scope": "ref",
    "cssVariable": "--ref-depth-z-base"
  },
  "ref-depth-z-dropdown": {
    "value": "100",
    "type": "shadow",
    "scope": "ref",
    "cssVariable": "--ref-depth-z-dropdown"
  },
  "ref-depth-z-sticky": {
    "value": "200",
    "type": "shadow",
    "scope": "ref",
    "cssVariable": "--ref-depth-z-sticky"
  },
  "ref-depth-z-overlay": {
    "value": "1000",
    "type": "shadow",
    "scope": "ref",
    "cssVariable": "--ref-depth-z-overlay"
  },
  "ref-depth-z-dialog": {
    "value": "1001",
    "type": "shadow",
    "scope": "ref",
    "cssVariable": "--ref-depth-z-dialog"
  },
  "ref-depth-z-toast": {
    "value": "1100",
    "type": "shadow",
    "scope": "ref",
    "cssVariable": "--ref-depth-z-toast"
  },
  "sys-depth-overlay": {
    "value": "var(--ref-depth-overlay-dark)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-overlay",
    "reference": "ref-depth-overlay-dark",
    "cssReference": "--ref-depth-overlay-dark"
  },
  "sys-depth-backdrop-blur": {
    "value": "var(--ref-depth-blur-sm)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-backdrop-blur",
    "reference": "ref-depth-blur-sm",
    "cssReference": "--ref-depth-blur-sm"
  },
  "sys-depth-blur-sm": {
    "value": "var(--ref-depth-blur-sm)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-blur-sm",
    "reference": "ref-depth-blur-sm",
    "cssReference": "--ref-depth-blur-sm"
  },
  "sys-depth-blur-md": {
    "value": "var(--ref-depth-blur-md)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-blur-md",
    "reference": "ref-depth-blur-md",
    "cssReference": "--ref-depth-blur-md"
  },
  "sys-depth-blur-lg": {
    "value": "var(--ref-depth-blur-lg)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-blur-lg",
    "reference": "ref-depth-blur-lg",
    "cssReference": "--ref-depth-blur-lg"
  },
  "sys-depth-z-underlay": {
    "value": "-1",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-underlay"
  },
  "sys-depth-z-base": {
    "value": "var(--ref-depth-z-base)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-base",
    "reference": "ref-depth-z-base",
    "cssReference": "--ref-depth-z-base"
  },
  "sys-depth-z-raised": {
    "value": "1",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-raised"
  },
  "sys-depth-z-floating": {
    "value": "2",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-floating"
  },
  "sys-depth-z-local-popover": {
    "value": "3",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-local-popover"
  },
  "sys-depth-z-dropdown": {
    "value": "var(--ref-depth-z-dropdown)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-dropdown",
    "reference": "ref-depth-z-dropdown",
    "cssReference": "--ref-depth-z-dropdown"
  },
  "sys-depth-z-sticky": {
    "value": "var(--ref-depth-z-sticky)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-sticky",
    "reference": "ref-depth-z-sticky",
    "cssReference": "--ref-depth-z-sticky"
  },
  "sys-depth-z-overlay": {
    "value": "var(--ref-depth-z-overlay)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-overlay",
    "reference": "ref-depth-z-overlay",
    "cssReference": "--ref-depth-z-overlay"
  },
  "sys-depth-z-dialog": {
    "value": "var(--ref-depth-z-dialog)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-dialog",
    "reference": "ref-depth-z-dialog",
    "cssReference": "--ref-depth-z-dialog"
  },
  "sys-depth-z-toast": {
    "value": "var(--ref-depth-z-toast)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-z-toast",
    "reference": "ref-depth-z-toast",
    "cssReference": "--ref-depth-z-toast"
  },
  "sys-depth-blur-topbar": {
    "value": "var(--ref-depth-blur-lg)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-blur-topbar",
    "reference": "ref-depth-blur-lg",
    "cssReference": "--ref-depth-blur-lg"
  },
  "sys-depth-lift-subtle": {
    "value": "calc(var(--ref-frame-border-thin) * -1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-depth-lift-subtle"
  },
  "sys-depth-lift-rest": {
    "value": "calc(var(--ref-frame-space-micro) * -1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-depth-lift-rest"
  },
  "sys-depth-lift-raised": {
    "value": "calc(var(--ref-frame-space-3) * -0.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-depth-lift-raised"
  },
  "sys-depth-lift-overlay": {
    "value": "calc(var(--ref-frame-space-5) * -0.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-depth-lift-overlay"
  },
  "sys-depth-elevation-0": {
    "value": "none",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-elevation-0"
  },
  "sys-depth-elevation-1": {
    "value": "0 1px 3px 0 rgb(var(--ref-depth-shadow-color-rgb) / 6%), 0 1px 2px 0 rgb(var(--ref-depth-shadow-color-rgb) / 4%)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-elevation-1"
  },
  "sys-depth-elevation-2": {
    "value": "0 4px 12px 4px rgb(var(--ref-depth-shadow-color-rgb) / 8%), 0 2px 4px 0 rgb(var(--ref-depth-shadow-color-rgb) / 4%)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-elevation-2"
  },
  "sys-depth-elevation-3": {
    "value": "0 22px 70px color-mix(in srgb, var(--ref-energy-neutral-900) 52%, transparent)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-elevation-3"
  },
  "sys-depth-elevation-4": {
    "value": "0 20px 56px 8px rgb(var(--ref-depth-shadow-color-rgb) / 16%), 0 8px 20px 2px rgb(var(--ref-depth-shadow-color-rgb) / 8%)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-depth-elevation-4"
  },
  "ref-energy-neutral-50": {
    "value": "#f8fafc",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-50"
  },
  "ref-energy-neutral-100": {
    "value": "#f1f5f9",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-100"
  },
  "ref-energy-neutral-200": {
    "value": "#e2e8f0",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-200"
  },
  "ref-energy-neutral-300": {
    "value": "#cbd5e1",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-300"
  },
  "ref-energy-neutral-400": {
    "value": "#94a3b8",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-400"
  },
  "ref-energy-neutral-500": {
    "value": "#64748b",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-500"
  },
  "ref-energy-neutral-600": {
    "value": "#475569",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-600"
  },
  "ref-energy-neutral-700": {
    "value": "#334155",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-700"
  },
  "ref-energy-neutral-800": {
    "value": "#1e293b",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-800"
  },
  "ref-energy-neutral-900": {
    "value": "#0f172a",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-neutral-900"
  },
  "ref-energy-blue-50": {
    "value": "#e0eeff",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-50"
  },
  "ref-energy-blue-100": {
    "value": "#c7dfff",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-100"
  },
  "ref-energy-blue-200": {
    "value": "#8abcff",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-200"
  },
  "ref-energy-blue-300": {
    "value": "#529cff",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-300"
  },
  "ref-energy-blue-400": {
    "value": "#1a7cff",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-400"
  },
  "ref-energy-blue-500": {
    "value": "#0060df",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-500"
  },
  "ref-energy-blue-600": {
    "value": "#004db3",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-600"
  },
  "ref-energy-blue-700": {
    "value": "#003985",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-700"
  },
  "ref-energy-blue-800": {
    "value": "#002557",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-800"
  },
  "ref-energy-blue-900": {
    "value": "#00142e",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-blue-900"
  },
  "ref-energy-red-50": {
    "value": "#ffe3e0",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-50"
  },
  "ref-energy-red-100": {
    "value": "#ffc6c2",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-100"
  },
  "ref-energy-red-200": {
    "value": "#ff8d85",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-200"
  },
  "ref-energy-red-300": {
    "value": "#ff5447",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-300"
  },
  "ref-energy-red-400": {
    "value": "#ff1b0a",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-400"
  },
  "ref-energy-red-500": {
    "value": "#ca0e00",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-500"
  },
  "ref-energy-red-600": {
    "value": "#a30b00",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-600"
  },
  "ref-energy-red-700": {
    "value": "#7a0800",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-700"
  },
  "ref-energy-red-800": {
    "value": "#520600",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-800"
  },
  "ref-energy-red-900": {
    "value": "#290300",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-red-900"
  },
  "ref-energy-green-50": {
    "value": "#e1f4eb",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-50"
  },
  "ref-energy-green-100": {
    "value": "#c3efda",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-100"
  },
  "ref-energy-green-200": {
    "value": "#79e6b4",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-200"
  },
  "ref-energy-green-300": {
    "value": "#2ee590",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-300"
  },
  "ref-energy-green-400": {
    "value": "#0dba69",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-400"
  },
  "ref-energy-green-500": {
    "value": "#007840",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-500"
  },
  "ref-energy-green-600": {
    "value": "#065b33",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-600"
  },
  "ref-energy-green-700": {
    "value": "#084026",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-700"
  },
  "ref-energy-green-800": {
    "value": "#072718",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-800"
  },
  "ref-energy-green-900": {
    "value": "#05140d",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-green-900"
  },
  "ref-energy-orange-50": {
    "value": "#fdeae3",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-50"
  },
  "ref-energy-orange-100": {
    "value": "#fbd5c6",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-100"
  },
  "ref-energy-orange-200": {
    "value": "#f6ab8e",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-200"
  },
  "ref-energy-orange-300": {
    "value": "#f28155",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-300"
  },
  "ref-energy-orange-400": {
    "value": "#ed571c",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-400"
  },
  "ref-energy-orange-500": {
    "value": "#bf410f",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-500"
  },
  "ref-energy-orange-600": {
    "value": "#97330c",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-600"
  },
  "ref-energy-orange-700": {
    "value": "#712709",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-700"
  },
  "ref-energy-orange-800": {
    "value": "#4c1a06",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-800"
  },
  "ref-energy-orange-900": {
    "value": "#260d03",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-orange-900"
  },
  "ref-energy-purple-50": {
    "value": "#f3eefb",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-50"
  },
  "ref-energy-purple-100": {
    "value": "#ddd2f3",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-100"
  },
  "ref-energy-purple-200": {
    "value": "#c4b5e8",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-200"
  },
  "ref-energy-purple-300": {
    "value": "#a88fdb",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-300"
  },
  "ref-energy-purple-400": {
    "value": "#8d6dd1",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-400"
  },
  "ref-energy-purple-500": {
    "value": "#6b4dc7",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-500"
  },
  "ref-energy-purple-600": {
    "value": "#5a43a8",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-600"
  },
  "ref-energy-purple-700": {
    "value": "#503a99",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-700"
  },
  "ref-energy-purple-800": {
    "value": "#3a2b6e",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-800"
  },
  "ref-energy-purple-900": {
    "value": "#241a42",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-purple-900"
  },
  "ref-energy-teal-50": {
    "value": "#e8f7f7",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-50"
  },
  "ref-energy-teal-100": {
    "value": "#c0ebeb",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-100"
  },
  "ref-energy-teal-200": {
    "value": "#8bd9d9",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-200"
  },
  "ref-energy-teal-300": {
    "value": "#52c4c4",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-300"
  },
  "ref-energy-teal-400": {
    "value": "#1aafaf",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-400"
  },
  "ref-energy-teal-500": {
    "value": "#0a7a7a",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-500"
  },
  "ref-energy-teal-600": {
    "value": "#096b6b",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-600"
  },
  "ref-energy-teal-700": {
    "value": "#075c5c",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-700"
  },
  "ref-energy-teal-800": {
    "value": "#053e3e",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-800"
  },
  "ref-energy-teal-900": {
    "value": "#032121",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-teal-900"
  },
  "ref-energy-yellow-50": {
    "value": "#fffbeb",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-50"
  },
  "ref-energy-yellow-100": {
    "value": "#fef3c7",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-100"
  },
  "ref-energy-yellow-200": {
    "value": "#fde68a",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-200"
  },
  "ref-energy-yellow-300": {
    "value": "#fcd34d",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-300"
  },
  "ref-energy-yellow-400": {
    "value": "#fbbf24",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-400"
  },
  "ref-energy-yellow-500": {
    "value": "#f59e0b",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-500"
  },
  "ref-energy-yellow-600": {
    "value": "#d97706",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-600"
  },
  "ref-energy-yellow-700": {
    "value": "#b45309",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-700"
  },
  "ref-energy-yellow-800": {
    "value": "#92400e",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-800"
  },
  "ref-energy-yellow-900": {
    "value": "#78350f",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-yellow-900"
  },
  "ref-energy-pink-50": {
    "value": "#fdf2f8",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-50"
  },
  "ref-energy-pink-100": {
    "value": "#fce7f3",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-100"
  },
  "ref-energy-pink-200": {
    "value": "#fbcfe8",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-200"
  },
  "ref-energy-pink-300": {
    "value": "#f9a8d4",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-300"
  },
  "ref-energy-pink-400": {
    "value": "#f472b6",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-400"
  },
  "ref-energy-pink-500": {
    "value": "#ec4899",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-500"
  },
  "ref-energy-pink-600": {
    "value": "#db2777",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-600"
  },
  "ref-energy-pink-700": {
    "value": "#be185d",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-700"
  },
  "ref-energy-pink-800": {
    "value": "#9d174d",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-800"
  },
  "ref-energy-pink-900": {
    "value": "#831843",
    "type": "color",
    "scope": "ref",
    "cssVariable": "--ref-energy-pink-900"
  },
  "sys-energy-surface-primary": {
    "value": "#fff",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-surface-primary"
  },
  "sys-energy-surface-secondary": {
    "value": "var(--ref-energy-neutral-50)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-surface-secondary",
    "reference": "ref-energy-neutral-50",
    "cssReference": "--ref-energy-neutral-50"
  },
  "sys-energy-surface-tertiary": {
    "value": "var(--ref-energy-neutral-100)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-surface-tertiary",
    "reference": "ref-energy-neutral-100",
    "cssReference": "--ref-energy-neutral-100"
  },
  "sys-energy-surface-sunken": {
    "value": "var(--ref-energy-neutral-200)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-surface-sunken",
    "reference": "ref-energy-neutral-200",
    "cssReference": "--ref-energy-neutral-200"
  },
  "sys-energy-surface-accent": {
    "value": "var(--ref-energy-blue-50)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-surface-accent",
    "reference": "ref-energy-blue-50",
    "cssReference": "--ref-energy-blue-50"
  },
  "sys-energy-text-primary": {
    "value": "var(--ref-energy-neutral-800)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-text-primary",
    "reference": "ref-energy-neutral-800",
    "cssReference": "--ref-energy-neutral-800"
  },
  "sys-energy-text-secondary": {
    "value": "var(--ref-energy-neutral-600)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-text-secondary",
    "reference": "ref-energy-neutral-600",
    "cssReference": "--ref-energy-neutral-600"
  },
  "sys-energy-text-tertiary": {
    "value": "var(--ref-energy-neutral-500)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-text-tertiary",
    "reference": "ref-energy-neutral-500",
    "cssReference": "--ref-energy-neutral-500"
  },
  "sys-energy-text-on-action": {
    "value": "var(--ref-energy-neutral-50)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-text-on-action",
    "reference": "ref-energy-neutral-50",
    "cssReference": "--ref-energy-neutral-50"
  },
  "sys-energy-action-primary": {
    "value": "var(--ref-energy-blue-500)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-action-primary",
    "reference": "ref-energy-blue-500",
    "cssReference": "--ref-energy-blue-500"
  },
  "sys-energy-action-hover": {
    "value": "var(--ref-energy-blue-600)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-action-hover",
    "reference": "ref-energy-blue-600",
    "cssReference": "--ref-energy-blue-600"
  },
  "sys-energy-status-success": {
    "value": "var(--ref-energy-green-500)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-status-success",
    "reference": "ref-energy-green-500",
    "cssReference": "--ref-energy-green-500"
  },
  "sys-energy-status-info": {
    "value": "var(--ref-energy-teal-500)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-status-info",
    "reference": "ref-energy-teal-500",
    "cssReference": "--ref-energy-teal-500"
  },
  "sys-energy-status-warning": {
    "value": "var(--ref-energy-yellow-400)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-status-warning",
    "reference": "ref-energy-yellow-400",
    "cssReference": "--ref-energy-yellow-400"
  },
  "sys-energy-status-warning-foreground": {
    "value": "var(--ref-energy-yellow-900)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-status-warning-foreground",
    "reference": "ref-energy-yellow-900",
    "cssReference": "--ref-energy-yellow-900"
  },
  "sys-energy-status-error": {
    "value": "var(--ref-energy-red-500)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-status-error",
    "reference": "ref-energy-red-500",
    "cssReference": "--ref-energy-red-500"
  },
  "sys-energy-border-default": {
    "value": "rgb(10 10 15 / 8%)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-border-default"
  },
  "sys-energy-border-strong": {
    "value": "rgb(10 10 15 / 15%)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-energy-border-strong"
  },
  "ref-frame-border-control": {
    "value": "1.5px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-border-control"
  },
  "ref-frame-border-indicator": {
    "value": "3px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-border-indicator"
  },
  "ref-frame-border-medium": {
    "value": "2px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-border-medium"
  },
  "ref-frame-border-thin": {
    "value": "1px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-border-thin"
  },
  "ref-frame-breakpoint-lg": {
    "value": "1180px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-breakpoint-lg"
  },
  "ref-frame-breakpoint-md": {
    "value": "992px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-breakpoint-md"
  },
  "ref-frame-breakpoint-shell-sidebar": {
    "value": "861px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-breakpoint-shell-sidebar"
  },
  "ref-frame-breakpoint-sm": {
    "value": "576px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-breakpoint-sm"
  },
  "ref-frame-breakpoint-xl": {
    "value": "1440px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-breakpoint-xl"
  },
  "ref-frame-content-callout": {
    "value": "1040px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-callout"
  },
  "ref-frame-content-dialog": {
    "value": "480px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-dialog"
  },
  "ref-frame-content-drawer-lg": {
    "value": "800px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-drawer-lg"
  },
  "ref-frame-content-drawer-md": {
    "value": "736px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-drawer-md"
  },
  "ref-frame-content-drawer-sm": {
    "value": "672px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-drawer-sm"
  },
  "ref-frame-content-max": {
    "value": "1440px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-max"
  },
  "ref-frame-content-narrow": {
    "value": "640px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-narrow"
  },
  "ref-frame-content-prose": {
    "value": "680px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-content-prose"
  },
  "ref-frame-device-border-block": {
    "value": "18px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-device-border-block"
  },
  "ref-frame-device-border-block-sm": {
    "value": "12px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-device-border-block-sm"
  },
  "ref-frame-device-border-inline": {
    "value": "10px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-device-border-inline"
  },
  "ref-frame-device-border-inline-sm": {
    "value": "6px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-device-border-inline-sm"
  },
  "ref-frame-doc-badge-sm": {
    "value": "36px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-badge-sm"
  },
  "ref-frame-doc-col-bar": {
    "value": "120px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-col-bar"
  },
  "ref-frame-doc-col-num": {
    "value": "28px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-col-num"
  },
  "ref-frame-doc-col-preview": {
    "value": "240px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-col-preview"
  },
  "ref-frame-doc-col-token": {
    "value": "200px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-col-token"
  },
  "ref-frame-doc-col-token-lg": {
    "value": "220px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-col-token-lg"
  },
  "ref-frame-doc-col-value-sm": {
    "value": "50px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-col-value-sm"
  },
  "ref-frame-doc-demo-radius": {
    "value": "56px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-demo-radius"
  },
  "ref-frame-doc-grid-lg": {
    "value": "42px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-grid-lg"
  },
  "ref-frame-doc-grid-md": {
    "value": "36px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-grid-md"
  },
  "ref-frame-doc-grid-sm": {
    "value": "28px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-doc-grid-sm"
  },
  "ref-frame-grid-lg-columns": {
    "value": "12",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-lg-columns"
  },
  "ref-frame-grid-lg-gutter": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-lg-gutter"
  },
  "ref-frame-grid-lg-margin": {
    "value": "48px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-lg-margin"
  },
  "ref-frame-grid-lg-max-width": {
    "value": "1440px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-lg-max-width"
  },
  "ref-frame-grid-md-columns": {
    "value": "6",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-md-columns"
  },
  "ref-frame-grid-md-gutter": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-md-gutter"
  },
  "ref-frame-grid-md-margin": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-md-margin"
  },
  "ref-frame-grid-sm-columns": {
    "value": "1",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-sm-columns"
  },
  "ref-frame-grid-sm-gutter": {
    "value": "0px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-sm-gutter"
  },
  "ref-frame-grid-sm-margin": {
    "value": "16px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-grid-sm-margin"
  },
  "ref-frame-height-control-lg": {
    "value": "72px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-lg"
  },
  "ref-frame-height-control-lg-comfortable": {
    "value": "86px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-lg-comfortable"
  },
  "ref-frame-height-control-lg-compact": {
    "value": "60px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-lg-compact"
  },
  "ref-frame-height-control-md": {
    "value": "60px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-md"
  },
  "ref-frame-height-control-md-comfortable": {
    "value": "72px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-md-comfortable"
  },
  "ref-frame-height-control-md-compact": {
    "value": "50px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-md-compact"
  },
  "ref-frame-height-control-sm": {
    "value": "48px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-sm"
  },
  "ref-frame-height-control-sm-comfortable": {
    "value": "58px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-sm-comfortable"
  },
  "ref-frame-height-control-sm-compact": {
    "value": "40px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-sm-compact"
  },
  "ref-frame-height-control-xl": {
    "value": "88px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-xl"
  },
  "ref-frame-height-control-xl-comfortable": {
    "value": "106px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-xl-comfortable"
  },
  "ref-frame-height-control-xl-compact": {
    "value": "74px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-height-control-xl-compact"
  },
  "ref-frame-radius-0": {
    "value": "0px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-0"
  },
  "ref-frame-radius-1": {
    "value": "4px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-1"
  },
  "ref-frame-radius-10": {
    "value": "40px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-10"
  },
  "ref-frame-radius-11": {
    "value": "44px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-11"
  },
  "ref-frame-radius-12": {
    "value": "48px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-12"
  },
  "ref-frame-radius-2": {
    "value": "8px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-2"
  },
  "ref-frame-radius-3": {
    "value": "12px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-3"
  },
  "ref-frame-radius-4": {
    "value": "16px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-4"
  },
  "ref-frame-radius-5": {
    "value": "20px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-5"
  },
  "ref-frame-radius-6": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-6"
  },
  "ref-frame-radius-7": {
    "value": "28px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-7"
  },
  "ref-frame-radius-8": {
    "value": "32px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-8"
  },
  "ref-frame-radius-9": {
    "value": "36px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-9"
  },
  "ref-frame-radius-full": {
    "value": "9999px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-radius-full"
  },
  "ref-frame-sidebar-collapsed": {
    "value": "56px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-sidebar-collapsed"
  },
  "ref-frame-sidebar-expanded": {
    "value": "280px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-sidebar-expanded"
  },
  "ref-frame-space-0": {
    "value": "0px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-0"
  },
  "ref-frame-space-1": {
    "value": "4px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-1"
  },
  "ref-frame-space-10": {
    "value": "40px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-10"
  },
  "ref-frame-space-11": {
    "value": "44px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-11"
  },
  "ref-frame-space-12": {
    "value": "48px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-12"
  },
  "ref-frame-space-16": {
    "value": "64px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-16"
  },
  "ref-frame-space-2": {
    "value": "8px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-2"
  },
  "ref-frame-space-20": {
    "value": "80px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-20"
  },
  "ref-frame-space-24": {
    "value": "96px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-24"
  },
  "ref-frame-space-3": {
    "value": "12px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-3"
  },
  "ref-frame-space-32": {
    "value": "128px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-32"
  },
  "ref-frame-space-4": {
    "value": "16px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-4"
  },
  "ref-frame-space-40": {
    "value": "160px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-40"
  },
  "ref-frame-space-5": {
    "value": "20px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-5"
  },
  "ref-frame-space-6": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-6"
  },
  "ref-frame-space-7": {
    "value": "28px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-7"
  },
  "ref-frame-space-8": {
    "value": "32px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-8"
  },
  "ref-frame-space-9": {
    "value": "36px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-9"
  },
  "ref-frame-space-micro": {
    "value": "2px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-frame-space-micro"
  },
  "sys-border-width-thin": {
    "value": "var(--sys-frame-border-thin)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-border-width-thin",
    "reference": "sys-frame-border-thin",
    "cssReference": "--sys-frame-border-thin"
  },
  "sys-frame-border-control": {
    "value": "var(--ref-frame-border-control)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-border-control",
    "reference": "ref-frame-border-control",
    "cssReference": "--ref-frame-border-control"
  },
  "sys-frame-border-indicator": {
    "value": "var(--ref-frame-border-indicator)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-border-indicator",
    "reference": "ref-frame-border-indicator",
    "cssReference": "--ref-frame-border-indicator"
  },
  "sys-frame-border-medium": {
    "value": "var(--ref-frame-border-medium)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-border-medium",
    "reference": "ref-frame-border-medium",
    "cssReference": "--ref-frame-border-medium"
  },
  "sys-frame-border-thin": {
    "value": "var(--ref-frame-border-thin)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-border-thin",
    "reference": "ref-frame-border-thin",
    "cssReference": "--ref-frame-border-thin"
  },
  "sys-frame-brand-logo-max": {
    "value": "calc(var(--ref-frame-space-12) + var(--ref-frame-space-16) + var(--sys-space-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-brand-logo-max"
  },
  "sys-frame-brand-logo-min": {
    "value": "calc((var(--ref-frame-space-12) * 2) + var(--sys-space-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-brand-logo-min"
  },
  "sys-frame-brand-logo-mobile-max": {
    "value": "calc(var(--sys-frame-sidebar-collapsed) + var(--sys-space-xl) + var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-brand-logo-mobile-max"
  },
  "sys-frame-brand-logo-mobile-min": {
    "value": "calc(var(--sys-frame-sidebar-collapsed) + var(--sys-space-lg))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-brand-logo-mobile-min"
  },
  "sys-frame-breakpoint-lg": {
    "value": "var(--ref-frame-breakpoint-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-breakpoint-lg",
    "reference": "ref-frame-breakpoint-lg",
    "cssReference": "--ref-frame-breakpoint-lg"
  },
  "sys-frame-breakpoint-md": {
    "value": "var(--ref-frame-breakpoint-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-breakpoint-md",
    "reference": "ref-frame-breakpoint-md",
    "cssReference": "--ref-frame-breakpoint-md"
  },
  "sys-frame-breakpoint-shell-sidebar": {
    "value": "var(--ref-frame-breakpoint-shell-sidebar)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-breakpoint-shell-sidebar",
    "reference": "ref-frame-breakpoint-shell-sidebar",
    "cssReference": "--ref-frame-breakpoint-shell-sidebar"
  },
  "sys-frame-breakpoint-sm": {
    "value": "var(--ref-frame-breakpoint-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-breakpoint-sm",
    "reference": "ref-frame-breakpoint-sm",
    "cssReference": "--ref-frame-breakpoint-sm"
  },
  "sys-frame-breakpoint-xl": {
    "value": "var(--ref-frame-breakpoint-xl)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-breakpoint-xl",
    "reference": "ref-frame-breakpoint-xl",
    "cssReference": "--ref-frame-breakpoint-xl"
  },
  "sys-frame-button-padding-x-lg": {
    "value": "var(--ref-frame-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-button-padding-x-lg",
    "reference": "ref-frame-space-6",
    "cssReference": "--ref-frame-space-6"
  },
  "sys-frame-button-padding-x-md": {
    "value": "var(--ref-frame-space-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-button-padding-x-md",
    "reference": "ref-frame-space-5",
    "cssReference": "--ref-frame-space-5"
  },
  "sys-frame-button-padding-x-sm": {
    "value": "var(--ref-frame-space-4)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-button-padding-x-sm",
    "reference": "ref-frame-space-4",
    "cssReference": "--ref-frame-space-4"
  },
  "sys-frame-content-action-control-lg": {
    "value": "calc(var(--sys-space-11) * 1.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-control-lg"
  },
  "sys-frame-content-action-control-md": {
    "value": "var(--sys-space-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-control-md",
    "reference": "sys-space-9",
    "cssReference": "--sys-space-9"
  },
  "sys-frame-content-action-control-sm": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-control-sm",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-action-label-lg": {
    "value": "calc(var(--sys-space-11) * 2.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-label-lg"
  },
  "sys-frame-content-action-label-md": {
    "value": "calc(var(--sys-space-11) * 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-label-md"
  },
  "sys-frame-content-action-label-sm": {
    "value": "calc(var(--sys-space-11) * 1.75)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-label-sm"
  },
  "sys-frame-content-action-label-xl": {
    "value": "calc(var(--sys-space-11) * 3.25)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-label-xl"
  },
  "sys-frame-content-action-min-block-lg": {
    "value": "calc(var(--sys-space-11) + (var(--sys-space-11) * 1.5))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-min-block-lg"
  },
  "sys-frame-content-action-min-block-md": {
    "value": "calc(var(--sys-space-11) + var(--sys-space-9))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-min-block-md"
  },
  "sys-frame-content-action-min-inline-lg": {
    "value": "calc(var(--sys-space-11) * 1.75)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-min-inline-lg"
  },
  "sys-frame-content-action-min-inline-md": {
    "value": "calc(var(--sys-space-11) * 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-min-inline-md"
  },
  "sys-frame-content-action-min-inline-sm": {
    "value": "calc(var(--sys-space-11) + var(--sys-space-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-action-min-inline-sm"
  },
  "sys-frame-content-callout": {
    "value": "var(--ref-frame-content-callout)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-callout",
    "reference": "ref-frame-content-callout",
    "cssReference": "--ref-frame-content-callout"
  },
  "sys-frame-content-card-chip-block-lg": {
    "value": "var(--sys-space-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-card-chip-block-lg",
    "reference": "sys-space-9",
    "cssReference": "--sys-space-9"
  },
  "sys-frame-content-card-chip-block-md": {
    "value": "var(--sys-space-7)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-card-chip-block-md",
    "reference": "sys-space-7",
    "cssReference": "--sys-space-7"
  },
  "sys-frame-content-card-chip-block-sm": {
    "value": "var(--sys-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-card-chip-block-sm",
    "reference": "sys-space-6",
    "cssReference": "--sys-space-6"
  },
  "sys-frame-content-card-chip-inline-lg": {
    "value": "var(--sys-space-10)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-card-chip-inline-lg",
    "reference": "sys-space-10",
    "cssReference": "--sys-space-10"
  },
  "sys-frame-content-card-chip-inline-md": {
    "value": "var(--sys-space-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-card-chip-inline-md",
    "reference": "sys-space-9",
    "cssReference": "--sys-space-9"
  },
  "sys-frame-content-card-chip-inline-sm": {
    "value": "var(--sys-space-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-card-chip-inline-sm",
    "reference": "sys-space-9",
    "cssReference": "--sys-space-9"
  },
  "sys-frame-content-card-media-block": {
    "value": "calc((var(--sys-space-11) * 4) + var(--sys-space-xl))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-card-media-block"
  },
  "sys-frame-content-code-slot-block-lg": {
    "value": "calc(var(--sys-space-11) + var(--sys-space-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-code-slot-block-lg"
  },
  "sys-frame-content-code-slot-block-md": {
    "value": "calc(var(--sys-space-11) + var(--sys-frame-border-control))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-code-slot-block-md"
  },
  "sys-frame-content-code-slot-block-sm": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-code-slot-block-sm",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-code-slot-inline-lg": {
    "value": "var(--sys-space-12)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-code-slot-inline-lg",
    "reference": "sys-space-12",
    "cssReference": "--sys-space-12"
  },
  "sys-frame-content-code-slot-inline-md": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-code-slot-inline-md",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-code-slot-inline-sm": {
    "value": "calc(var(--sys-space-11) - (var(--sys-space-xs) * 2))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-code-slot-inline-sm"
  },
  "sys-frame-content-country-listbox-inline": {
    "value": "min(var(--sys-frame-content-country-listbox-max-inline), calc(100vw - (var(--sys-frame-gap-component-lg) * 2)))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-country-listbox-inline"
  },
  "sys-frame-content-country-listbox-max-inline": {
    "value": "calc(var(--sys-space-11) * 6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-country-listbox-max-inline"
  },
  "sys-frame-content-date-panel": {
    "value": "calc(var(--sys-space-11) * 6.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-date-panel"
  },
  "sys-frame-content-date-range-panel": {
    "value": "calc(var(--sys-space-11) * 7)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-date-range-panel"
  },
  "sys-frame-content-date-range-preset-min-block": {
    "value": "var(--sys-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-date-range-preset-min-block",
    "reference": "sys-space-6",
    "cssReference": "--sys-space-6"
  },
  "sys-frame-content-dialog": {
    "value": "var(--ref-frame-content-dialog)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-dialog",
    "reference": "ref-frame-content-dialog",
    "cssReference": "--ref-frame-content-dialog"
  },
  "sys-frame-content-disclosure-trigger-min-block-lg": {
    "value": "calc(var(--sys-space-11) + var(--sys-space-xl))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-disclosure-trigger-min-block-lg"
  },
  "sys-frame-content-disclosure-trigger-min-block-md": {
    "value": "calc(var(--sys-space-11) + var(--sys-space-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-disclosure-trigger-min-block-md"
  },
  "sys-frame-content-disclosure-trigger-min-block-sm": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-disclosure-trigger-min-block-sm",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-drawer-lg": {
    "value": "min(82vw, var(--ref-frame-content-drawer-lg))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-drawer-lg"
  },
  "sys-frame-content-drawer-md": {
    "value": "min(72vw, var(--ref-frame-content-drawer-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-drawer-md"
  },
  "sys-frame-content-drawer-sm": {
    "value": "min(68vw, var(--ref-frame-content-drawer-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-drawer-sm"
  },
  "sys-frame-content-feedback-action-size": {
    "value": "calc(var(--sys-space-11) - var(--sys-space-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-feedback-action-size"
  },
  "sys-frame-content-hero-copy": {
    "value": "calc(var(--ref-frame-content-prose) + var(--sys-frame-gap-component-lg))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-hero-copy"
  },
  "sys-frame-content-hero-visual": {
    "value": "calc(var(--ref-frame-content-callout) - (var(--sys-frame-gap-section) * 2))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-hero-visual"
  },
  "sys-frame-content-inline-trigger-min-block-lg": {
    "value": "calc(var(--sys-space-11) + var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-inline-trigger-min-block-lg"
  },
  "sys-frame-content-inline-trigger-min-block-md": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-inline-trigger-min-block-md",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-inline-trigger-min-block-sm": {
    "value": "calc(var(--sys-space-11) - var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-inline-trigger-min-block-sm"
  },
  "sys-frame-content-map-pin-min-block-lg": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-map-pin-min-block-lg",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-map-pin-min-block-md": {
    "value": "var(--sys-space-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-map-pin-min-block-md",
    "reference": "sys-space-9",
    "cssReference": "--sys-space-9"
  },
  "sys-frame-content-map-pin-min-block-sm": {
    "value": "var(--sys-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-map-pin-min-block-sm",
    "reference": "sys-space-6",
    "cssReference": "--sys-space-6"
  },
  "sys-frame-content-max": {
    "value": "var(--ref-frame-content-max)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-max",
    "reference": "ref-frame-content-max",
    "cssReference": "--ref-frame-content-max"
  },
  "sys-frame-content-menu-max-block": {
    "value": "calc(var(--sys-frame-content-dialog) + (var(--sys-frame-gap-section) * 3))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-menu-max-block"
  },
  "sys-frame-content-menu-min": {
    "value": "var(--ref-frame-doc-col-preview)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-menu-min",
    "reference": "ref-frame-doc-col-preview",
    "cssReference": "--ref-frame-doc-col-preview"
  },
  "sys-frame-content-menu-min-lg": {
    "value": "calc(var(--ref-frame-space-40) + var(--ref-frame-space-16))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-menu-min-lg"
  },
  "sys-frame-content-menu-min-md": {
    "value": "calc(var(--ref-frame-space-40) + var(--ref-frame-space-10))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-menu-min-md"
  },
  "sys-frame-content-menu-min-sm": {
    "value": "calc(var(--ref-frame-space-40) + var(--ref-frame-space-6))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-menu-min-sm"
  },
  "sys-frame-content-menu-wide": {
    "value": "calc(var(--ref-frame-content-prose) + var(--sys-frame-gap-component-lg))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-menu-wide"
  },
  "sys-frame-content-metric-min-lg": {
    "value": "calc(var(--sys-space-11) * 3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-metric-min-lg"
  },
  "sys-frame-content-metric-min-md": {
    "value": "calc(var(--sys-space-11) * 2.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-metric-min-md"
  },
  "sys-frame-content-metric-min-sm": {
    "value": "calc(var(--sys-space-11) * 2.25)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-metric-min-sm"
  },
  "sys-frame-content-metric-min-xs": {
    "value": "calc(var(--sys-space-11) * 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-metric-min-xs"
  },
  "sys-frame-content-movement-icon-size": {
    "value": "calc(var(--sys-space-11) - var(--sys-focus-ring-offset))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-movement-icon-size"
  },
  "sys-frame-content-movement-row-min-block-lg": {
    "value": "calc(var(--sys-space-11) * 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-movement-row-min-block-lg"
  },
  "sys-frame-content-movement-row-min-block-md": {
    "value": "calc(var(--sys-space-11) * 1.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-movement-row-min-block-md"
  },
  "sys-frame-content-movement-row-min-block-sm": {
    "value": "calc(var(--sys-space-11) + var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-movement-row-min-block-sm"
  },
  "sys-frame-content-narrow": {
    "value": "100%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-narrow"
  },
  "sys-frame-content-navigation-ellipsis-inline": {
    "value": "calc(var(--sys-space-11) * 0.75)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-navigation-ellipsis-inline"
  },
  "sys-frame-content-navigation-target-lg": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-navigation-target-lg",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-navigation-target-md": {
    "value": "calc(var(--sys-space-11) - var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-navigation-target-md"
  },
  "sys-frame-content-navigation-target-sm": {
    "value": "calc(var(--sys-space-11) - var(--sys-space-md))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-navigation-target-sm"
  },
  "sys-frame-content-option-min-block": {
    "value": "calc(var(--sys-space-11) - var(--sys-space-xs))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-option-min-block"
  },
  "sys-frame-content-phone-input-flex-basis": {
    "value": "calc(var(--sys-space-11) * 3.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-phone-input-flex-basis"
  },
  "sys-frame-content-phone-input-flex-basis-compact": {
    "value": "calc(var(--sys-space-11) * 3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-phone-input-flex-basis-compact"
  },
  "sys-frame-content-phone-input-min-inline": {
    "value": "calc(var(--sys-space-11) * 2.5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-phone-input-min-inline"
  },
  "sys-frame-content-phone-input-min-inline-compact": {
    "value": "calc(var(--sys-space-11) * 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-phone-input-min-inline-compact"
  },
  "sys-frame-content-prose": {
    "value": "100%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-prose"
  },
  "sys-frame-content-prose-wide": {
    "value": "100%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-prose-wide"
  },
  "sys-frame-content-search-min": {
    "value": "calc(var(--sys-frame-sidebar-expanded) + var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-search-min"
  },
  "sys-frame-content-search-results-max-block": {
    "value": "calc(var(--sys-frame-content-dialog) - var(--sys-frame-gap-component-lg))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-search-results-max-block"
  },
  "sys-frame-content-segmented-control-inline": {
    "value": "calc(var(--sys-space-11) * 9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-segmented-control-inline"
  },
  "sys-frame-content-skeleton-circle": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-skeleton-circle",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-skeleton-row-leading": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-skeleton-row-leading",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-step-marker-lg": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-step-marker-lg",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-step-marker-md": {
    "value": "calc(var(--sys-space-11) - var(--sys-space-lg) - var(--sys-space-xs))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-step-marker-md"
  },
  "sys-frame-content-step-marker-sm": {
    "value": "calc(var(--sys-space-11) - var(--sys-space-lg))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-step-marker-sm"
  },
  "sys-frame-content-step-text-max-inline": {
    "value": "calc(var(--sys-space-11) * 3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-step-text-max-inline"
  },
  "sys-frame-content-step-text-min-inline": {
    "value": "calc(var(--sys-space-11) * 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-step-text-min-inline"
  },
  "sys-frame-content-tab-label-max": {
    "value": "var(--ref-frame-space-32)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-tab-label-max",
    "reference": "ref-frame-space-32",
    "cssReference": "--ref-frame-space-32"
  },
  "sys-frame-content-table-expander": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-table-expander",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-content-tree-control-lg": {
    "value": "var(--sys-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-content-tree-control-lg",
    "reference": "sys-space-11",
    "cssReference": "--sys-space-11"
  },
  "sys-frame-device-border-block": {
    "value": "var(--ref-frame-device-border-block)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-device-border-block",
    "reference": "ref-frame-device-border-block",
    "cssReference": "--ref-frame-device-border-block"
  },
  "sys-frame-device-border-block-sm": {
    "value": "var(--ref-frame-device-border-block-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-device-border-block-sm",
    "reference": "ref-frame-device-border-block-sm",
    "cssReference": "--ref-frame-device-border-block-sm"
  },
  "sys-frame-device-border-inline": {
    "value": "var(--ref-frame-device-border-inline)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-device-border-inline",
    "reference": "ref-frame-device-border-inline",
    "cssReference": "--ref-frame-device-border-inline"
  },
  "sys-frame-device-border-inline-sm": {
    "value": "var(--ref-frame-device-border-inline-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-device-border-inline-sm",
    "reference": "ref-frame-device-border-inline-sm",
    "cssReference": "--ref-frame-device-border-inline-sm"
  },
  "sys-frame-doc-card-grid-min": {
    "value": "calc(var(--ref-frame-space-32) + var(--ref-frame-space-11))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-card-grid-min"
  },
  "sys-frame-doc-card-min-block-lg": {
    "value": "calc(var(--ref-frame-space-32) + var(--ref-frame-space-16))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-card-min-block-lg"
  },
  "sys-frame-doc-card-min-block-md": {
    "value": "calc(var(--ref-frame-space-32) + var(--ref-frame-space-12))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-card-min-block-md"
  },
  "sys-frame-doc-device-min-block": {
    "value": "calc(var(--sys-frame-content-dialog) + var(--sys-frame-gap-section))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-device-min-block"
  },
  "sys-frame-doc-device-width": {
    "value": "calc(var(--sys-frame-content-dialog) - (var(--sys-frame-gap-section) * 2))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-device-width"
  },
  "sys-frame-doc-dot": {
    "value": "calc(var(--sys-space-sm) + var(--sys-frame-space-micro))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-dot"
  },
  "sys-frame-doc-grid-lg": {
    "value": "var(--ref-frame-doc-grid-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-grid-lg",
    "reference": "ref-frame-doc-grid-lg",
    "cssReference": "--ref-frame-doc-grid-lg"
  },
  "sys-frame-doc-grid-md": {
    "value": "var(--ref-frame-doc-grid-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-grid-md",
    "reference": "ref-frame-doc-grid-md",
    "cssReference": "--ref-frame-doc-grid-md"
  },
  "sys-frame-doc-grid-sm": {
    "value": "var(--ref-frame-doc-grid-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-grid-sm",
    "reference": "ref-frame-doc-grid-sm",
    "cssReference": "--ref-frame-doc-grid-sm"
  },
  "sys-frame-doc-icon-lg": {
    "value": "var(--ref-frame-space-10)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-icon-lg",
    "reference": "ref-frame-space-10",
    "cssReference": "--ref-frame-space-10"
  },
  "sys-frame-doc-icon-md": {
    "value": "var(--ref-frame-doc-badge-sm)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-icon-md",
    "reference": "ref-frame-doc-badge-sm",
    "cssReference": "--ref-frame-doc-badge-sm"
  },
  "sys-frame-doc-icon-sm": {
    "value": "var(--ref-frame-space-8)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-icon-sm",
    "reference": "ref-frame-space-8",
    "cssReference": "--ref-frame-space-8"
  },
  "sys-frame-doc-line": {
    "value": "var(--sys-space-xl)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-line",
    "reference": "sys-space-xl",
    "cssReference": "--sys-space-xl"
  },
  "sys-frame-doc-panel-min-lg": {
    "value": "var(--sys-frame-content-menu-min)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-panel-min-lg",
    "reference": "sys-frame-content-menu-min",
    "cssReference": "--sys-frame-content-menu-min"
  },
  "sys-frame-doc-panel-min-md": {
    "value": "calc(var(--ref-frame-space-32) + var(--density-page-gap))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-panel-min-md"
  },
  "sys-frame-doc-panel-min-sm": {
    "value": "var(--ref-frame-space-40)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-panel-min-sm",
    "reference": "ref-frame-space-40",
    "cssReference": "--ref-frame-space-40"
  },
  "sys-frame-doc-panel-min-xl": {
    "value": "calc(var(--sys-frame-content-dialog) - (var(--sys-frame-gap-component-lg) * 4))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-panel-min-xl"
  },
  "sys-frame-doc-pill-min-block": {
    "value": "var(--ref-frame-space-7)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-pill-min-block",
    "reference": "ref-frame-space-7",
    "cssReference": "--ref-frame-space-7"
  },
  "sys-frame-doc-stage-inline": {
    "value": "calc(var(--sys-frame-content-dialog) + var(--sys-frame-gap-section))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-stage-inline"
  },
  "sys-frame-doc-surface-max-inline": {
    "value": "calc(var(--sys-frame-content-max) + var(--sys-frame-gap-page))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-surface-max-inline"
  },
  "sys-frame-doc-table-inline": {
    "value": "calc(var(--ref-frame-content-prose) + var(--sys-frame-sidebar-collapsed))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-doc-table-inline"
  },
  "sys-frame-gap-component": {
    "value": "var(--sys-density-component-gap)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-component",
    "reference": "sys-density-component-gap",
    "cssReference": "--sys-density-component-gap"
  },
  "sys-frame-gap-component-lg": {
    "value": "var(--sys-density-component-gap-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-component-lg",
    "reference": "sys-density-component-gap-lg",
    "cssReference": "--sys-density-component-gap-lg"
  },
  "sys-frame-gap-element": {
    "value": "var(--ref-frame-space-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-element",
    "reference": "ref-frame-space-3",
    "cssReference": "--ref-frame-space-3"
  },
  "sys-frame-gap-page": {
    "value": "var(--sys-density-page-gap)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-page",
    "reference": "sys-density-page-gap",
    "cssReference": "--sys-density-page-gap"
  },
  "sys-frame-gap-section": {
    "value": "var(--sys-density-section-gap)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-section",
    "reference": "sys-density-section-gap",
    "cssReference": "--sys-density-section-gap"
  },
  "sys-frame-gap-subsection": {
    "value": "var(--sys-density-subsection-gap)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-subsection",
    "reference": "sys-density-subsection-gap",
    "cssReference": "--sys-density-subsection-gap"
  },
  "sys-frame-gap-topnav-max": {
    "value": "calc(var(--sys-space-md) + var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-topnav-max"
  },
  "sys-frame-gap-topnav-min": {
    "value": "calc(var(--sys-frame-space-micro) + var(--sys-space-sm))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-gap-topnav-min"
  },
  "sys-frame-grid-lg-columns": {
    "value": "var(--ref-frame-grid-lg-columns)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-lg-columns",
    "reference": "ref-frame-grid-lg-columns",
    "cssReference": "--ref-frame-grid-lg-columns"
  },
  "sys-frame-grid-lg-gutter": {
    "value": "var(--ref-frame-space-8)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-lg-gutter",
    "reference": "ref-frame-space-8",
    "cssReference": "--ref-frame-space-8"
  },
  "sys-frame-grid-lg-margin": {
    "value": "var(--ref-frame-space-12)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-lg-margin",
    "reference": "ref-frame-space-12",
    "cssReference": "--ref-frame-space-12"
  },
  "sys-frame-grid-lg-max-width": {
    "value": "var(--ref-frame-grid-lg-max-width)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-lg-max-width",
    "reference": "ref-frame-grid-lg-max-width",
    "cssReference": "--ref-frame-grid-lg-max-width"
  },
  "sys-frame-grid-md-columns": {
    "value": "var(--ref-frame-grid-md-columns)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-md-columns",
    "reference": "ref-frame-grid-md-columns",
    "cssReference": "--ref-frame-grid-md-columns"
  },
  "sys-frame-grid-md-gutter": {
    "value": "var(--ref-frame-grid-md-gutter)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-md-gutter",
    "reference": "ref-frame-grid-md-gutter",
    "cssReference": "--ref-frame-grid-md-gutter"
  },
  "sys-frame-grid-md-margin": {
    "value": "var(--ref-frame-grid-md-margin)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-md-margin",
    "reference": "ref-frame-grid-md-margin",
    "cssReference": "--ref-frame-grid-md-margin"
  },
  "sys-frame-grid-sm-columns": {
    "value": "var(--ref-frame-grid-sm-columns)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-sm-columns",
    "reference": "ref-frame-grid-sm-columns",
    "cssReference": "--ref-frame-grid-sm-columns"
  },
  "sys-frame-grid-sm-gutter": {
    "value": "var(--ref-frame-grid-sm-gutter)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-sm-gutter",
    "reference": "ref-frame-grid-sm-gutter",
    "cssReference": "--ref-frame-grid-sm-gutter"
  },
  "sys-frame-grid-sm-margin": {
    "value": "var(--ref-frame-grid-sm-margin)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-grid-sm-margin",
    "reference": "ref-frame-grid-sm-margin",
    "cssReference": "--ref-frame-grid-sm-margin"
  },
  "sys-frame-height-control-lg": {
    "value": "var(--ref-frame-height-control-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-height-control-lg",
    "reference": "ref-frame-height-control-lg",
    "cssReference": "--ref-frame-height-control-lg"
  },
  "sys-frame-height-control-md": {
    "value": "var(--sys-density-control-height)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-height-control-md",
    "reference": "sys-density-control-height",
    "cssReference": "--sys-density-control-height"
  },
  "sys-frame-height-control-sm": {
    "value": "var(--ref-frame-height-control-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-height-control-sm",
    "reference": "ref-frame-height-control-sm",
    "cssReference": "--ref-frame-height-control-sm"
  },
  "sys-frame-height-shell-topbar": {
    "value": "calc(var(--sys-frame-height-control-sm) + (var(--sys-space-md) * 2) + var(--sys-frame-border-thin))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-height-shell-topbar"
  },
  "sys-frame-height-shell-topbar-mobile": {
    "value": "calc((var(--sys-frame-height-control-sm) * 2) + var(--sys-frame-gap-component))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-height-shell-topbar-mobile"
  },
  "sys-frame-max-width-control": {
    "value": "none",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-max-width-control"
  },
  "sys-frame-min-width-control": {
    "value": "0",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-min-width-control"
  },
  "sys-frame-padding-container": {
    "value": "var(--sys-density-panel-padding)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-padding-container",
    "reference": "sys-density-panel-padding",
    "cssReference": "--sys-density-panel-padding"
  },
  "sys-frame-padding-control": {
    "value": "var(--sys-density-control-padding-x)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-padding-control",
    "reference": "sys-density-control-padding-x",
    "cssReference": "--sys-density-control-padding-x"
  },
  "sys-frame-padding-inset-s": {
    "value": "var(--ref-frame-space-2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-padding-inset-s",
    "reference": "ref-frame-space-2",
    "cssReference": "--ref-frame-space-2"
  },
  "sys-frame-padding-surface": {
    "value": "var(--sys-density-surface-padding)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-padding-surface",
    "reference": "sys-density-surface-padding",
    "cssReference": "--sys-density-surface-padding"
  },
  "sys-frame-position-center": {
    "value": "-50%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-position-center"
  },
  "sys-frame-radius-container": {
    "value": "var(--ref-frame-radius-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-radius-container",
    "reference": "ref-frame-radius-3",
    "cssReference": "--ref-frame-radius-3"
  },
  "sys-frame-radius-control": {
    "value": "var(--ref-frame-radius-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-radius-control",
    "reference": "ref-frame-radius-3",
    "cssReference": "--ref-frame-radius-3"
  },
  "sys-frame-radius-full": {
    "value": "var(--ref-frame-radius-full)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-radius-full",
    "reference": "ref-frame-radius-full",
    "cssReference": "--ref-frame-radius-full"
  },
  "sys-frame-radius-md": {
    "value": "var(--sys-frame-radius-control)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-radius-md",
    "reference": "sys-frame-radius-control",
    "cssReference": "--sys-frame-radius-control"
  },
  "sys-frame-radius-sm": {
    "value": "var(--ref-frame-radius-1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-radius-sm",
    "reference": "ref-frame-radius-1",
    "cssReference": "--ref-frame-radius-1"
  },
  "sys-frame-radius-surface": {
    "value": "var(--ref-frame-radius-4)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-radius-surface",
    "reference": "ref-frame-radius-4",
    "cssReference": "--ref-frame-radius-4"
  },
  "sys-frame-ratio-half": {
    "value": "0.5",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-ratio-half"
  },
  "sys-frame-sidebar-collapsed": {
    "value": "var(--ref-frame-sidebar-collapsed)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-sidebar-collapsed",
    "reference": "ref-frame-sidebar-collapsed",
    "cssReference": "--ref-frame-sidebar-collapsed"
  },
  "sys-frame-sidebar-expanded": {
    "value": "var(--ref-frame-sidebar-expanded)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-sidebar-expanded",
    "reference": "ref-frame-sidebar-expanded",
    "cssReference": "--ref-frame-sidebar-expanded"
  },
  "sys-frame-space-micro": {
    "value": "var(--ref-frame-space-micro)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-space-micro",
    "reference": "ref-frame-space-micro",
    "cssReference": "--ref-frame-space-micro"
  },
  "sys-frame-space-none": {
    "value": "var(--ref-frame-space-0)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-space-none",
    "reference": "ref-frame-space-0",
    "cssReference": "--ref-frame-space-0"
  },
  "sys-frame-template-desktop-inline-min": {
    "value": "calc(var(--ref-frame-content-prose) + (var(--sys-frame-gap-section) * 2))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-template-desktop-inline-min"
  },
  "sys-frame-template-desktop-inline-wide": {
    "value": "calc(var(--ref-frame-content-prose) + var(--sys-frame-sidebar-expanded) + (var(--sys-frame-gap-section) * 3))",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-template-desktop-inline-wide"
  },
  "sys-frame-width-control": {
    "value": "100%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-frame-width-control"
  },
  "ref-growth-stage-seed": {
    "value": "1",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-growth-stage-seed"
  },
  "ref-growth-stage-stable": {
    "value": "2",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-growth-stage-stable"
  },
  "ref-growth-stage-measured": {
    "value": "3",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-growth-stage-measured"
  },
  "ref-growth-stage-deprecated": {
    "value": "4",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-growth-stage-deprecated"
  },
  "sys-growth-stage-seed-color": {
    "value": "var(--sys-energy-action-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-growth-stage-seed-color",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-growth-stage-stable-color": {
    "value": "var(--sys-energy-status-success)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-growth-stage-stable-color",
    "reference": "sys-energy-status-success",
    "cssReference": "--sys-energy-status-success"
  },
  "sys-growth-stage-measured-color": {
    "value": "var(--sys-energy-status-info)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-growth-stage-measured-color",
    "reference": "sys-energy-status-info",
    "cssReference": "--sys-energy-status-info"
  },
  "sys-growth-stage-deprecated-color": {
    "value": "var(--sys-energy-status-error)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-growth-stage-deprecated-color",
    "reference": "sys-energy-status-error",
    "cssReference": "--sys-energy-status-error"
  },
  "sys-growth-event-font": {
    "value": "var(--ref-voice-family-mono)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-growth-event-font",
    "reference": "ref-voice-family-mono",
    "cssReference": "--ref-voice-family-mono"
  },
  "sys-iconography-family": {
    "value": "var(--sys-symbol-family)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-iconography-family",
    "reference": "sys-symbol-family",
    "cssReference": "--sys-symbol-family"
  },
  "sys-iconography-variation-filled": {
    "value": "var(--sys-symbol-variation-filled)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-iconography-variation-filled",
    "reference": "sys-symbol-variation-filled",
    "cssReference": "--sys-symbol-variation-filled"
  },
  "sys-iconography-variation-filled-strong": {
    "value": "var(--sys-symbol-variation-filled-strong)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-iconography-variation-filled-strong",
    "reference": "sys-symbol-variation-filled-strong",
    "cssReference": "--sys-symbol-variation-filled-strong"
  },
  "sys-iconography-variation-outline-strong": {
    "value": "var(--sys-symbol-variation-outline-strong)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-iconography-variation-outline-strong",
    "reference": "sys-symbol-variation-outline-strong",
    "cssReference": "--sys-symbol-variation-outline-strong"
  },
  "sys-iconography-size-sm": {
    "value": "var(--sys-symbol-size-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-sm",
    "reference": "sys-symbol-size-sm",
    "cssReference": "--sys-symbol-size-sm"
  },
  "sys-iconography-size-sm-plus": {
    "value": "var(--sys-symbol-size-sm-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-sm-plus",
    "reference": "sys-symbol-size-sm-plus",
    "cssReference": "--sys-symbol-size-sm-plus"
  },
  "sys-iconography-size-md": {
    "value": "var(--sys-symbol-size-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-md",
    "reference": "sys-symbol-size-md",
    "cssReference": "--sys-symbol-size-md"
  },
  "sys-iconography-size-md-plus": {
    "value": "var(--sys-symbol-size-md-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-md-plus",
    "reference": "sys-symbol-size-md-plus",
    "cssReference": "--sys-symbol-size-md-plus"
  },
  "sys-iconography-size-lg": {
    "value": "var(--sys-symbol-size-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-lg",
    "reference": "sys-symbol-size-lg",
    "cssReference": "--sys-symbol-size-lg"
  },
  "sys-iconography-size-lg-plus": {
    "value": "var(--sys-symbol-size-lg-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-lg-plus",
    "reference": "sys-symbol-size-lg-plus",
    "cssReference": "--sys-symbol-size-lg-plus"
  },
  "sys-iconography-size-marker": {
    "value": "var(--sys-symbol-size-marker)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-marker",
    "reference": "sys-symbol-size-marker",
    "cssReference": "--sys-symbol-size-marker"
  },
  "sys-iconography-size-station": {
    "value": "var(--sys-symbol-size-station)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-station",
    "reference": "sys-symbol-size-station",
    "cssReference": "--sys-symbol-size-station"
  },
  "sys-iconography-size-display-sm": {
    "value": "var(--sys-symbol-size-display-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-display-sm",
    "reference": "sys-symbol-size-display-sm",
    "cssReference": "--sys-symbol-size-display-sm"
  },
  "sys-iconography-size-display-md": {
    "value": "var(--sys-symbol-size-display-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-size-display-md",
    "reference": "sys-symbol-size-display-md",
    "cssReference": "--sys-symbol-size-display-md"
  },
  "sys-iconography-color-action": {
    "value": "var(--sys-symbol-color-action)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-iconography-color-action",
    "reference": "sys-symbol-color-action",
    "cssReference": "--sys-symbol-color-action"
  },
  "sys-iconography-color-navigation": {
    "value": "var(--sys-symbol-color-muted)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-iconography-color-navigation",
    "reference": "sys-symbol-color-muted",
    "cssReference": "--sys-symbol-color-muted"
  },
  "sys-iconography-color-status": {
    "value": "var(--sys-symbol-color-status)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-iconography-color-status",
    "reference": "sys-symbol-color-status",
    "cssReference": "--sys-symbol-color-status"
  },
  "sys-iconography-color-warning": {
    "value": "var(--sys-symbol-color-warning)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-iconography-color-warning",
    "reference": "sys-symbol-color-warning",
    "cssReference": "--sys-symbol-color-warning"
  },
  "sys-iconography-color-danger": {
    "value": "var(--sys-symbol-color-danger)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-iconography-color-danger",
    "reference": "sys-symbol-color-danger",
    "cssReference": "--sys-symbol-color-danger"
  },
  "sys-iconography-color-muted": {
    "value": "var(--sys-symbol-color-muted)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-iconography-color-muted",
    "reference": "sys-symbol-color-muted",
    "cssReference": "--sys-symbol-color-muted"
  },
  "sys-iconography-color-disabled": {
    "value": "color-mix(in srgb, var(--sys-energy-text-tertiary) 58%, transparent)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-iconography-color-disabled"
  },
  "sys-iconography-touch-target-min": {
    "value": "var(--sys-a11y-touch-target-min)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-touch-target-min",
    "reference": "sys-a11y-touch-target-min",
    "cssReference": "--sys-a11y-touch-target-min"
  },
  "sys-iconography-focus-ring": {
    "value": "var(--sys-a11y-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-iconography-focus-ring",
    "reference": "sys-a11y-focus-ring",
    "cssReference": "--sys-a11y-focus-ring"
  },
  "sys-iconography-focus-offset": {
    "value": "var(--sys-a11y-focus-offset)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-iconography-focus-offset",
    "reference": "sys-a11y-focus-offset",
    "cssReference": "--sys-a11y-focus-offset"
  },
  "ref-momentum-duration-instant": {
    "value": "1ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-instant"
  },
  "ref-momentum-duration-press": {
    "value": "100ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-press"
  },
  "ref-momentum-duration-snappy": {
    "value": "140ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-snappy"
  },
  "ref-momentum-duration-fast": {
    "value": "160ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-fast"
  },
  "ref-momentum-duration-enter": {
    "value": "180ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-enter"
  },
  "ref-momentum-duration-normal": {
    "value": "240ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-normal"
  },
  "ref-momentum-duration-reveal": {
    "value": "260ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-reveal"
  },
  "ref-momentum-duration-slow": {
    "value": "400ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-slow"
  },
  "ref-momentum-duration-slower": {
    "value": "500ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-slower"
  },
  "ref-momentum-duration-loading": {
    "value": "700ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-loading"
  },
  "ref-momentum-duration-pulse": {
    "value": "1100ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-pulse"
  },
  "ref-momentum-duration-progress": {
    "value": "1150ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-progress"
  },
  "ref-momentum-duration-cycle": {
    "value": "1400ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-duration-cycle"
  },
  "ref-momentum-easing-touch": {
    "value": "cubic-bezier(0.34, 1.56, 0.64, 1)",
    "type": "cubicBezier",
    "scope": "ref",
    "cssVariable": "--ref-momentum-easing-touch"
  },
  "ref-momentum-easing-enter": {
    "value": "cubic-bezier(0.22, 1, 0.36, 1)",
    "type": "cubicBezier",
    "scope": "ref",
    "cssVariable": "--ref-momentum-easing-enter"
  },
  "ref-momentum-easing-move": {
    "value": "cubic-bezier(0.65, 0, 0.35, 1)",
    "type": "cubicBezier",
    "scope": "ref",
    "cssVariable": "--ref-momentum-easing-move"
  },
  "ref-momentum-easing-standard": {
    "value": "var(--ref-momentum-easing-touch)",
    "type": "unknown",
    "scope": "ref",
    "cssVariable": "--ref-momentum-easing-standard",
    "reference": "ref-momentum-easing-touch",
    "cssReference": "--ref-momentum-easing-touch"
  },
  "ref-momentum-easing-exit": {
    "value": "var(--ref-momentum-easing-move)",
    "type": "unknown",
    "scope": "ref",
    "cssVariable": "--ref-momentum-easing-exit",
    "reference": "ref-momentum-easing-move",
    "cssReference": "--ref-momentum-easing-move"
  },
  "ref-momentum-easing-linear": {
    "value": "cubic-bezier(0, 0, 1, 1)",
    "type": "cubicBezier",
    "scope": "ref",
    "cssVariable": "--ref-momentum-easing-linear"
  },
  "ref-momentum-scale-hover": {
    "value": "1.04",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-momentum-scale-hover"
  },
  "ref-momentum-scale-press": {
    "value": "0.96",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-momentum-scale-press"
  },
  "ref-momentum-lift-hover": {
    "value": "-3px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-momentum-lift-hover"
  },
  "ref-momentum-stagger-fast": {
    "value": "30ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-stagger-fast"
  },
  "ref-momentum-stagger-normal": {
    "value": "50ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-stagger-normal"
  },
  "ref-momentum-stagger-slow": {
    "value": "80ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-momentum-stagger-slow"
  },
  "sys-momentum-duration-fast": {
    "value": "var(--ref-momentum-duration-fast)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-fast",
    "reference": "ref-momentum-duration-fast",
    "cssReference": "--ref-momentum-duration-fast"
  },
  "sys-momentum-duration-default": {
    "value": "var(--ref-momentum-duration-normal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-default",
    "reference": "ref-momentum-duration-normal",
    "cssReference": "--ref-momentum-duration-normal"
  },
  "sys-momentum-duration-slow": {
    "value": "var(--ref-momentum-duration-slow)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-slow",
    "reference": "ref-momentum-duration-slow",
    "cssReference": "--ref-momentum-duration-slow"
  },
  "sys-momentum-duration-critical": {
    "value": "var(--ref-momentum-duration-instant)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-critical",
    "reference": "ref-momentum-duration-instant",
    "cssReference": "--ref-momentum-duration-instant"
  },
  "sys-momentum-duration-touch": {
    "value": "var(--ref-momentum-duration-fast)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-touch",
    "reference": "ref-momentum-duration-fast",
    "cssReference": "--ref-momentum-duration-fast"
  },
  "sys-momentum-duration-instant": {
    "value": "var(--ref-momentum-duration-instant)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-instant",
    "reference": "ref-momentum-duration-instant",
    "cssReference": "--ref-momentum-duration-instant"
  },
  "sys-momentum-duration-press": {
    "value": "var(--ref-momentum-duration-press)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-press",
    "reference": "ref-momentum-duration-press",
    "cssReference": "--ref-momentum-duration-press"
  },
  "sys-momentum-duration-snappy": {
    "value": "var(--ref-momentum-duration-snappy)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-snappy",
    "reference": "ref-momentum-duration-snappy",
    "cssReference": "--ref-momentum-duration-snappy"
  },
  "sys-momentum-duration-enter": {
    "value": "var(--ref-momentum-duration-enter)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-enter",
    "reference": "ref-momentum-duration-enter",
    "cssReference": "--ref-momentum-duration-enter"
  },
  "sys-momentum-duration-overlay": {
    "value": "var(--ref-momentum-duration-normal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-overlay",
    "reference": "ref-momentum-duration-normal",
    "cssReference": "--ref-momentum-duration-normal"
  },
  "sys-momentum-duration-sheet": {
    "value": "var(--ref-momentum-duration-normal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-sheet",
    "reference": "ref-momentum-duration-normal",
    "cssReference": "--ref-momentum-duration-normal"
  },
  "sys-momentum-duration-reveal": {
    "value": "var(--ref-momentum-duration-reveal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-reveal",
    "reference": "ref-momentum-duration-reveal",
    "cssReference": "--ref-momentum-duration-reveal"
  },
  "sys-momentum-duration-medium": {
    "value": "var(--ref-momentum-duration-normal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-medium",
    "reference": "ref-momentum-duration-normal",
    "cssReference": "--ref-momentum-duration-normal"
  },
  "sys-momentum-duration-loop": {
    "value": "var(--ref-momentum-duration-cycle)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-loop",
    "reference": "ref-momentum-duration-cycle",
    "cssReference": "--ref-momentum-duration-cycle"
  },
  "sys-momentum-duration-loading-spin": {
    "value": "var(--ref-momentum-duration-loading)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-loading-spin",
    "reference": "ref-momentum-duration-loading",
    "cssReference": "--ref-momentum-duration-loading"
  },
  "sys-momentum-duration-loading-cycle": {
    "value": "var(--ref-momentum-duration-loading)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-loading-cycle",
    "reference": "ref-momentum-duration-loading",
    "cssReference": "--ref-momentum-duration-loading"
  },
  "sys-momentum-duration-progress": {
    "value": "var(--ref-momentum-duration-progress)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-progress",
    "reference": "ref-momentum-duration-progress",
    "cssReference": "--ref-momentum-duration-progress"
  },
  "sys-momentum-duration-pulse": {
    "value": "var(--ref-momentum-duration-pulse)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-pulse",
    "reference": "ref-momentum-duration-pulse",
    "cssReference": "--ref-momentum-duration-pulse"
  },
  "sys-momentum-easing-touch": {
    "value": "var(--ref-momentum-easing-touch)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-easing-touch",
    "reference": "ref-momentum-easing-touch",
    "cssReference": "--ref-momentum-easing-touch"
  },
  "sys-momentum-easing-standard": {
    "value": "var(--ref-momentum-easing-standard)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-easing-standard",
    "reference": "ref-momentum-easing-standard",
    "cssReference": "--ref-momentum-easing-standard"
  },
  "sys-momentum-easing-enter": {
    "value": "var(--ref-momentum-easing-enter)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-easing-enter",
    "reference": "ref-momentum-easing-enter",
    "cssReference": "--ref-momentum-easing-enter"
  },
  "sys-momentum-easing-move": {
    "value": "var(--ref-momentum-easing-move)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-easing-move",
    "reference": "ref-momentum-easing-move",
    "cssReference": "--ref-momentum-easing-move"
  },
  "sys-momentum-easing-exit": {
    "value": "var(--ref-momentum-easing-exit)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-easing-exit",
    "reference": "ref-momentum-easing-exit",
    "cssReference": "--ref-momentum-easing-exit"
  },
  "sys-momentum-easing-linear": {
    "value": "var(--ref-momentum-easing-linear)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-easing-linear",
    "reference": "ref-momentum-easing-linear",
    "cssReference": "--ref-momentum-easing-linear"
  },
  "sys-momentum-stagger-fast": {
    "value": "var(--ref-momentum-stagger-fast)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-stagger-fast",
    "reference": "ref-momentum-stagger-fast",
    "cssReference": "--ref-momentum-stagger-fast"
  },
  "sys-momentum-stagger-normal": {
    "value": "var(--ref-momentum-stagger-normal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-stagger-normal",
    "reference": "ref-momentum-stagger-normal",
    "cssReference": "--ref-momentum-stagger-normal"
  },
  "sys-momentum-stagger-slow": {
    "value": "var(--ref-momentum-stagger-slow)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-stagger-slow",
    "reference": "ref-momentum-stagger-slow",
    "cssReference": "--ref-momentum-stagger-slow"
  },
  "sys-momentum-stagger-chart": {
    "value": "var(--ref-momentum-stagger-fast)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-stagger-chart",
    "reference": "ref-momentum-stagger-fast",
    "cssReference": "--ref-momentum-stagger-fast"
  },
  "sys-momentum-stagger-chart-compact": {
    "value": "calc(var(--ref-momentum-stagger-fast) - 2ms)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-stagger-chart-compact"
  },
  "sys-momentum-stagger-sequence-2": {
    "value": "calc(var(--ref-momentum-stagger-slow) * 1.5)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-stagger-sequence-2"
  },
  "sys-momentum-stagger-sequence-3": {
    "value": "calc(var(--ref-momentum-stagger-slow) * 3)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-stagger-sequence-3"
  },
  "sys-momentum-duration-cycle": {
    "value": "var(--ref-momentum-duration-cycle)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-cycle",
    "reference": "ref-momentum-duration-cycle",
    "cssReference": "--ref-momentum-duration-cycle"
  },
  "sys-momentum-duration-slower": {
    "value": "var(--ref-momentum-duration-slower)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-slower",
    "reference": "ref-momentum-duration-slower",
    "cssReference": "--ref-momentum-duration-slower"
  },
  "sys-momentum-duration-route": {
    "value": "calc(var(--sys-momentum-duration-cycle) + var(--sys-momentum-duration-slower))",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-duration-route"
  },
  "sys-momentum-scale-rest": {
    "value": "1",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-rest"
  },
  "sys-momentum-scale-none": {
    "value": "0",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-none"
  },
  "sys-momentum-scale-enter": {
    "value": "0.72",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-enter"
  },
  "sys-momentum-scale-quiet": {
    "value": "0.98",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-quiet"
  },
  "sys-momentum-scale-settle": {
    "value": "0.985",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-settle"
  },
  "sys-momentum-scale-raised": {
    "value": "1.08",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-raised"
  },
  "sys-momentum-scale-current-start": {
    "value": "0.88",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-current-start"
  },
  "sys-momentum-scale-current-overshoot": {
    "value": "1.14",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-current-overshoot"
  },
  "sys-momentum-translate-rest": {
    "value": "0",
    "type": "number",
    "scope": "sys",
    "cssVariable": "--sys-momentum-translate-rest"
  },
  "sys-momentum-translate-inline-nudge": {
    "value": "calc(var(--sys-space-xs) / 2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-translate-inline-nudge"
  },
  "sys-momentum-progress-translate-start": {
    "value": "-120%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-progress-translate-start"
  },
  "sys-momentum-progress-translate-mid": {
    "value": "40%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-progress-translate-mid"
  },
  "sys-momentum-progress-translate-end": {
    "value": "230%",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-progress-translate-end"
  },
  "sys-momentum-cue-transform-idle": {
    "value": "scaleX(0.18)",
    "type": "transform",
    "scope": "sys",
    "cssVariable": "--sys-momentum-cue-transform-idle"
  },
  "sys-momentum-cue-transform-enter": {
    "value": "translateX(32%) scaleX(var(--sys-momentum-scale-enter))",
    "type": "transform",
    "scope": "sys",
    "cssVariable": "--sys-momentum-cue-transform-enter"
  },
  "sys-momentum-cue-transform-active": {
    "value": "scaleX(var(--sys-momentum-scale-rest))",
    "type": "transform",
    "scope": "sys",
    "cssVariable": "--sys-momentum-cue-transform-active"
  },
  "sys-momentum-cue-transform-exit": {
    "value": "translateX(86%) scaleX(0.46)",
    "type": "transform",
    "scope": "sys",
    "cssVariable": "--sys-momentum-cue-transform-exit"
  },
  "sys-momentum-rotate-rest": {
    "value": "0deg",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-rotate-rest"
  },
  "sys-momentum-rotate-quarter": {
    "value": "90deg",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-rotate-quarter"
  },
  "sys-momentum-rotate-tilt": {
    "value": "45deg",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-rotate-tilt"
  },
  "sys-momentum-rotate-expanded": {
    "value": "180deg",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-rotate-expanded"
  },
  "sys-momentum-rotate-cycle": {
    "value": "360deg",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-momentum-rotate-cycle"
  },
  "sys-momentum-scale-hover": {
    "value": "var(--ref-momentum-scale-hover)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-hover",
    "reference": "ref-momentum-scale-hover",
    "cssReference": "--ref-momentum-scale-hover"
  },
  "sys-momentum-scale-press": {
    "value": "var(--ref-momentum-scale-press)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-scale-press",
    "reference": "ref-momentum-scale-press",
    "cssReference": "--ref-momentum-scale-press"
  },
  "sys-momentum-lift-hover": {
    "value": "var(--ref-momentum-lift-hover)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-momentum-lift-hover",
    "reference": "ref-momentum-lift-hover",
    "cssReference": "--ref-momentum-lift-hover"
  },
  "sys-momentum-transition-touch": {
    "value": "var(--sys-momentum-duration-touch) var(--sys-momentum-easing-touch)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-transition-touch",
    "cssReference": "--sys-momentum-duration-touch) var(--sys-momentum-easing-touch"
  },
  "sys-momentum-transition-fast": {
    "value": "var(--sys-momentum-transition-touch)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-transition-fast",
    "reference": "sys-momentum-transition-touch",
    "cssReference": "--sys-momentum-transition-touch"
  },
  "sys-momentum-transition-default": {
    "value": "var(--sys-momentum-duration-default) var(--sys-momentum-easing-touch)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-transition-default",
    "cssReference": "--sys-momentum-duration-default) var(--sys-momentum-easing-touch"
  },
  "sys-momentum-transition-slow": {
    "value": "var(--sys-momentum-duration-slow) var(--sys-momentum-easing-enter)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-momentum-transition-slow",
    "cssReference": "--sys-momentum-duration-slow) var(--sys-momentum-easing-enter"
  },
  "ref-state-opacity-disabled": {
    "value": "0.42",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-disabled"
  },
  "ref-state-opacity-faint": {
    "value": "0.35",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-faint"
  },
  "ref-state-opacity-subtle": {
    "value": "0.12",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-subtle"
  },
  "ref-state-opacity-low": {
    "value": "0.18",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-low"
  },
  "ref-state-opacity-muted": {
    "value": "0.7",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-muted"
  },
  "ref-state-opacity-soft": {
    "value": "0.85",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-soft"
  },
  "ref-state-opacity-closed": {
    "value": "0.48",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-closed"
  },
  "ref-state-opacity-visible": {
    "value": "1",
    "type": "opacity",
    "scope": "ref",
    "cssVariable": "--ref-state-opacity-visible"
  },
  "ref-state-overlay-hover": {
    "value": "6%",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-state-overlay-hover"
  },
  "ref-state-overlay-pressed": {
    "value": "12%",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-state-overlay-pressed"
  },
  "ref-state-overlay-selected": {
    "value": "10%",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-state-overlay-selected"
  },
  "ref-state-focus-ring-width": {
    "value": "3px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-state-focus-ring-width"
  },
  "ref-state-focus-ring-offset": {
    "value": "var(--ref-frame-border-indicator)",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-state-focus-ring-offset",
    "reference": "ref-frame-border-indicator",
    "cssReference": "--ref-frame-border-indicator"
  },
  "ref-state-loading-spin": {
    "value": "900ms",
    "type": "duration",
    "scope": "ref",
    "cssVariable": "--ref-state-loading-spin"
  },
  "ref-state-precedence-disabled": {
    "value": "100",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-state-precedence-disabled"
  },
  "ref-state-precedence-loading": {
    "value": "90",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-state-precedence-loading"
  },
  "ref-state-precedence-error": {
    "value": "80",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-state-precedence-error"
  },
  "ref-state-precedence-focus": {
    "value": "70",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-state-precedence-focus"
  },
  "ref-state-precedence-hover": {
    "value": "30",
    "type": "number",
    "scope": "ref",
    "cssVariable": "--ref-state-precedence-hover"
  },
  "sys-state-disabled-opacity": {
    "value": "var(--ref-state-opacity-disabled)",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-state-disabled-opacity",
    "reference": "ref-state-opacity-disabled",
    "cssReference": "--ref-state-opacity-disabled"
  },
  "sys-state-hidden-opacity": {
    "value": "0",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-state-hidden-opacity"
  },
  "sys-state-disabled-readable-opacity": {
    "value": "0.58",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-state-disabled-readable-opacity"
  },
  "sys-state-muted-opacity": {
    "value": "var(--ref-state-opacity-muted)",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-state-muted-opacity",
    "reference": "ref-state-opacity-muted",
    "cssReference": "--ref-state-opacity-muted"
  },
  "sys-state-closed-opacity": {
    "value": "var(--ref-state-opacity-closed)",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-state-closed-opacity",
    "reference": "ref-state-opacity-closed",
    "cssReference": "--ref-state-opacity-closed"
  },
  "sys-state-visible-opacity": {
    "value": "var(--ref-state-opacity-visible)",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-state-visible-opacity",
    "reference": "ref-state-opacity-visible",
    "cssReference": "--ref-state-opacity-visible"
  },
  "sys-state-focus-ring": {
    "value": "var(--ref-state-focus-ring-width) solid color-mix(in srgb, var(--sys-energy-action-primary) 35%, transparent)",
    "type": "border",
    "scope": "sys",
    "cssVariable": "--sys-state-focus-ring",
    "cssReference": "--ref-state-focus-ring-width) solid color-mix(in srgb, var(--sys-energy-action-primary) 35%, transparent"
  },
  "sys-state-focus-offset": {
    "value": "var(--ref-state-focus-ring-offset)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-state-focus-offset",
    "reference": "ref-state-focus-ring-offset",
    "cssReference": "--ref-state-focus-ring-offset"
  },
  "sys-state-hover-overlay": {
    "value": "color-mix(in srgb, var(--sys-energy-action-primary) var(--ref-state-overlay-hover), transparent)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-state-hover-overlay"
  },
  "sys-state-pressed-overlay": {
    "value": "color-mix(in srgb, var(--sys-energy-action-primary) var(--ref-state-overlay-pressed), transparent)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-state-pressed-overlay"
  },
  "sys-state-selected-overlay": {
    "value": "color-mix(in srgb, var(--sys-energy-action-primary) var(--ref-state-overlay-selected), transparent)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-state-selected-overlay"
  },
  "sys-state-loading-spin": {
    "value": "var(--ref-state-loading-spin)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-state-loading-spin",
    "reference": "ref-state-loading-spin",
    "cssReference": "--ref-state-loading-spin"
  },
  "ref-symbol-size-xs": {
    "value": "12px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-xs"
  },
  "ref-symbol-size-sm": {
    "value": "16px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-sm"
  },
  "ref-symbol-size-sm-plus": {
    "value": "18px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-sm-plus"
  },
  "ref-symbol-size-md": {
    "value": "20px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-md"
  },
  "ref-symbol-size-md-plus": {
    "value": "22px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-md-plus"
  },
  "ref-symbol-size-lg": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-lg"
  },
  "ref-symbol-size-lg-plus": {
    "value": "26px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-lg-plus"
  },
  "ref-symbol-size-marker": {
    "value": "14px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-marker"
  },
  "ref-symbol-size-station": {
    "value": "17px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-station"
  },
  "ref-symbol-size-display-sm": {
    "value": "30px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-display-sm"
  },
  "ref-symbol-size-xl": {
    "value": "32px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-xl"
  },
  "ref-symbol-size-display-md": {
    "value": "34px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-size-display-md"
  },
  "ref-symbol-grid-base": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-grid-base"
  },
  "ref-symbol-live-area": {
    "value": "20px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-live-area"
  },
  "ref-symbol-stroke": {
    "value": "1.5px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-symbol-stroke"
  },
  "ref-symbol-family-material": {
    "value": "\"Material Symbols Rounded\"",
    "type": "fontFamily",
    "scope": "ref",
    "cssVariable": "--ref-symbol-family-material"
  },
  "ref-symbol-variation-filled": {
    "value": "\"FILL\" 1, \"wght\" 500, \"GRAD\" 0, \"opsz\" 24",
    "type": "fontVariationSettings",
    "scope": "ref",
    "cssVariable": "--ref-symbol-variation-filled"
  },
  "ref-symbol-variation-filled-strong": {
    "value": "\"FILL\" 1, \"wght\" 600, \"GRAD\" 0, \"opsz\" 24",
    "type": "fontVariationSettings",
    "scope": "ref",
    "cssVariable": "--ref-symbol-variation-filled-strong"
  },
  "ref-symbol-variation-outline-strong": {
    "value": "\"FILL\" 0, \"wght\" 700, \"GRAD\" 0, \"opsz\" 20",
    "type": "fontVariationSettings",
    "scope": "ref",
    "cssVariable": "--ref-symbol-variation-outline-strong"
  },
  "sys-symbol-family": {
    "value": "var(--ref-symbol-family-material)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-symbol-family",
    "reference": "ref-symbol-family-material",
    "cssReference": "--ref-symbol-family-material"
  },
  "sys-symbol-variation-filled": {
    "value": "var(--ref-symbol-variation-filled)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-symbol-variation-filled",
    "reference": "ref-symbol-variation-filled",
    "cssReference": "--ref-symbol-variation-filled"
  },
  "sys-symbol-variation-filled-strong": {
    "value": "var(--ref-symbol-variation-filled-strong)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-symbol-variation-filled-strong",
    "reference": "ref-symbol-variation-filled-strong",
    "cssReference": "--ref-symbol-variation-filled-strong"
  },
  "sys-symbol-variation-outline-strong": {
    "value": "var(--ref-symbol-variation-outline-strong)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-symbol-variation-outline-strong",
    "reference": "ref-symbol-variation-outline-strong",
    "cssReference": "--ref-symbol-variation-outline-strong"
  },
  "sys-symbol-size-sm": {
    "value": "var(--ref-symbol-size-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-sm",
    "reference": "ref-symbol-size-sm",
    "cssReference": "--ref-symbol-size-sm"
  },
  "sys-symbol-size-sm-plus": {
    "value": "var(--ref-symbol-size-sm-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-sm-plus",
    "reference": "ref-symbol-size-sm-plus",
    "cssReference": "--ref-symbol-size-sm-plus"
  },
  "sys-symbol-size-md": {
    "value": "var(--ref-symbol-size-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-md",
    "reference": "ref-symbol-size-md",
    "cssReference": "--ref-symbol-size-md"
  },
  "sys-symbol-size-md-plus": {
    "value": "var(--ref-symbol-size-md-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-md-plus",
    "reference": "ref-symbol-size-md-plus",
    "cssReference": "--ref-symbol-size-md-plus"
  },
  "sys-symbol-size-lg": {
    "value": "var(--ref-symbol-size-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-lg",
    "reference": "ref-symbol-size-lg",
    "cssReference": "--ref-symbol-size-lg"
  },
  "sys-symbol-size-lg-plus": {
    "value": "var(--ref-symbol-size-lg-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-lg-plus",
    "reference": "ref-symbol-size-lg-plus",
    "cssReference": "--ref-symbol-size-lg-plus"
  },
  "sys-symbol-size-marker": {
    "value": "var(--ref-symbol-size-marker)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-marker",
    "reference": "ref-symbol-size-marker",
    "cssReference": "--ref-symbol-size-marker"
  },
  "sys-symbol-size-station": {
    "value": "var(--ref-symbol-size-station)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-station",
    "reference": "ref-symbol-size-station",
    "cssReference": "--ref-symbol-size-station"
  },
  "sys-symbol-size-display-sm": {
    "value": "var(--ref-symbol-size-display-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-display-sm",
    "reference": "ref-symbol-size-display-sm",
    "cssReference": "--ref-symbol-size-display-sm"
  },
  "sys-symbol-size-display-md": {
    "value": "var(--ref-symbol-size-display-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-symbol-size-display-md",
    "reference": "ref-symbol-size-display-md",
    "cssReference": "--ref-symbol-size-display-md"
  },
  "sys-symbol-color-action": {
    "value": "var(--sys-energy-action-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-symbol-color-action",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-symbol-color-status": {
    "value": "var(--sys-energy-status-success)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-symbol-color-status",
    "reference": "sys-energy-status-success",
    "cssReference": "--sys-energy-status-success"
  },
  "sys-symbol-color-warning": {
    "value": "var(--sys-energy-status-warning-foreground)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-symbol-color-warning",
    "reference": "sys-energy-status-warning-foreground",
    "cssReference": "--sys-energy-status-warning-foreground"
  },
  "sys-symbol-color-danger": {
    "value": "var(--sys-energy-status-error)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-symbol-color-danger",
    "reference": "sys-energy-status-error",
    "cssReference": "--sys-energy-status-error"
  },
  "sys-symbol-color-muted": {
    "value": "var(--sys-energy-text-tertiary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-symbol-color-muted",
    "reference": "sys-energy-text-tertiary",
    "cssReference": "--sys-energy-text-tertiary"
  },
  "ref-tone-weight-neutral": {
    "value": "var(--ref-voice-weight-regular)",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-tone-weight-neutral",
    "reference": "ref-voice-weight-regular",
    "cssReference": "--ref-voice-weight-regular"
  },
  "ref-tone-weight-assistive": {
    "value": "var(--ref-voice-weight-medium)",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-tone-weight-assistive",
    "reference": "ref-voice-weight-medium",
    "cssReference": "--ref-voice-weight-medium"
  },
  "ref-tone-weight-urgent": {
    "value": "var(--ref-voice-weight-bold)",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-tone-weight-urgent",
    "reference": "ref-voice-weight-bold",
    "cssReference": "--ref-voice-weight-bold"
  },
  "ref-tone-weight-repair": {
    "value": "var(--ref-voice-weight-bold)",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-tone-weight-repair",
    "reference": "ref-voice-weight-bold",
    "cssReference": "--ref-voice-weight-bold"
  },
  "sys-tone-neutral-color": {
    "value": "var(--sys-energy-text-secondary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-tone-neutral-color",
    "reference": "sys-energy-text-secondary",
    "cssReference": "--sys-energy-text-secondary"
  },
  "sys-tone-assistive-color": {
    "value": "var(--sys-energy-action-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-tone-assistive-color",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-tone-urgent-color": {
    "value": "var(--sys-energy-status-warning-foreground)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-tone-urgent-color",
    "reference": "sys-energy-status-warning-foreground",
    "cssReference": "--sys-energy-status-warning-foreground"
  },
  "sys-tone-repair-color": {
    "value": "var(--sys-energy-status-error)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-tone-repair-color",
    "reference": "sys-energy-status-error",
    "cssReference": "--sys-energy-status-error"
  },
  "sys-tone-confirm-color": {
    "value": "var(--sys-energy-status-success)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-tone-confirm-color",
    "reference": "sys-energy-status-success",
    "cssReference": "--sys-energy-status-success"
  },
  "sys-tone-neutral-weight": {
    "value": "var(--ref-tone-weight-neutral)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-tone-neutral-weight",
    "reference": "ref-tone-weight-neutral",
    "cssReference": "--ref-tone-weight-neutral"
  },
  "sys-tone-assistive-weight": {
    "value": "var(--ref-tone-weight-assistive)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-tone-assistive-weight",
    "reference": "ref-tone-weight-assistive",
    "cssReference": "--ref-tone-weight-assistive"
  },
  "sys-tone-urgent-weight": {
    "value": "var(--ref-tone-weight-urgent)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-tone-urgent-weight",
    "reference": "ref-tone-weight-urgent",
    "cssReference": "--ref-tone-weight-urgent"
  },
  "sys-tone-repair-weight": {
    "value": "var(--ref-tone-weight-repair)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-tone-repair-weight",
    "reference": "ref-tone-weight-repair",
    "cssReference": "--ref-tone-weight-repair"
  },
  "ref-voice-family-brand": {
    "value": "\"Edenred\", \"Ubuntu\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "type": "fontFamily",
    "scope": "ref",
    "cssVariable": "--ref-voice-family-brand"
  },
  "ref-voice-family-sans": {
    "value": "\"Ubuntu\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    "type": "fontFamily",
    "scope": "ref",
    "cssVariable": "--ref-voice-family-sans"
  },
  "ref-voice-family-mono": {
    "value": "\"Ubuntu Mono\", \"Ubuntu\", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    "type": "fontFamily",
    "scope": "ref",
    "cssVariable": "--ref-voice-family-mono"
  },
  "ref-voice-weight-regular": {
    "value": "400",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-voice-weight-regular"
  },
  "ref-voice-weight-medium": {
    "value": "500",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-voice-weight-medium"
  },
  "ref-voice-weight-semibold": {
    "value": "600",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-voice-weight-semibold"
  },
  "ref-voice-weight-bold": {
    "value": "700",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-voice-weight-bold"
  },
  "ref-voice-weight-extrabold": {
    "value": "800",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-voice-weight-extrabold"
  },
  "ref-voice-weight-black": {
    "value": "900",
    "type": "fontWeight",
    "scope": "ref",
    "cssVariable": "--ref-voice-weight-black"
  },
  "ref-voice-size-1": {
    "value": "10px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-1"
  },
  "ref-voice-size-2": {
    "value": "11px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-2"
  },
  "ref-voice-size-3": {
    "value": "12px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-3"
  },
  "ref-voice-size-4": {
    "value": "13px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-4"
  },
  "ref-voice-size-5": {
    "value": "14px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-5"
  },
  "ref-voice-size-6": {
    "value": "16px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-6"
  },
  "ref-voice-size-7": {
    "value": "18px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-7"
  },
  "ref-voice-size-8": {
    "value": "20px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-8"
  },
  "ref-voice-size-9": {
    "value": "24px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-9"
  },
  "ref-voice-size-10": {
    "value": "32px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-10"
  },
  "ref-voice-size-11": {
    "value": "40px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-11"
  },
  "ref-voice-size-12": {
    "value": "48px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-12"
  },
  "ref-voice-size-13": {
    "value": "54px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-13"
  },
  "ref-voice-size-14": {
    "value": "62px",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-size-14"
  },
  "ref-voice-letter-spacing-tighter": {
    "value": "-0.02em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-tighter"
  },
  "ref-voice-letter-spacing-tight": {
    "value": "-0.01em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-tight"
  },
  "ref-voice-letter-spacing-snug": {
    "value": "-0.005em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-snug"
  },
  "ref-voice-letter-spacing-normal": {
    "value": "0em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-normal"
  },
  "ref-voice-letter-spacing-wide": {
    "value": "0.02em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-wide"
  },
  "ref-voice-letter-spacing-expanded": {
    "value": "0.04em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-expanded"
  },
  "ref-voice-letter-spacing-wider": {
    "value": "0.06em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-wider"
  },
  "ref-voice-letter-spacing-widest": {
    "value": "0.08em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-widest"
  },
  "ref-voice-letter-spacing-caps": {
    "value": "0.12em",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-letter-spacing-caps"
  },
  "ref-voice-line-height-none": {
    "value": "1",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-none"
  },
  "ref-voice-line-height-tightest": {
    "value": "1.05",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-tightest"
  },
  "ref-voice-line-height-compact": {
    "value": "1.1",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-compact"
  },
  "ref-voice-line-height-crisp": {
    "value": "1.15",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-crisp"
  },
  "ref-voice-line-height-tight": {
    "value": "1.2",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-tight"
  },
  "ref-voice-line-height-balanced": {
    "value": "1.25",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-balanced"
  },
  "ref-voice-line-height-dense": {
    "value": "1.333",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-dense"
  },
  "ref-voice-line-height-snug": {
    "value": "1.35",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-snug"
  },
  "ref-voice-line-height-comfortable": {
    "value": "1.4",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-comfortable"
  },
  "ref-voice-line-height-reading": {
    "value": "1.45",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-reading"
  },
  "ref-voice-line-height-display": {
    "value": "1.484",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-display"
  },
  "ref-voice-line-height-normal": {
    "value": "1.5",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-normal"
  },
  "ref-voice-line-height-relaxed": {
    "value": "1.556",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-relaxed"
  },
  "ref-voice-line-height-loose": {
    "value": "1.6",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-loose"
  },
  "ref-voice-line-height-body": {
    "value": "1.7",
    "type": "dimension",
    "scope": "ref",
    "cssVariable": "--ref-voice-line-height-body"
  },
  "sys-voice-display-lg-family": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-lg-family",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-display-lg-weight": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-lg-weight",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-display-lg-size": {
    "value": "var(--ref-voice-size-14)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-lg-size",
    "reference": "ref-voice-size-14",
    "cssReference": "--ref-voice-size-14"
  },
  "sys-voice-display-lg-line-height": {
    "value": "var(--ref-voice-line-height-display)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-lg-line-height",
    "reference": "ref-voice-line-height-display",
    "cssReference": "--ref-voice-line-height-display"
  },
  "sys-voice-display-lg-letter-spacing": {
    "value": "var(--ref-voice-letter-spacing-tight)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-lg-letter-spacing",
    "reference": "ref-voice-letter-spacing-tight",
    "cssReference": "--ref-voice-letter-spacing-tight"
  },
  "sys-voice-display-md-family": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-md-family",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-display-md-weight": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-md-weight",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-display-md-size": {
    "value": "var(--ref-voice-size-12)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-md-size",
    "reference": "ref-voice-size-12",
    "cssReference": "--ref-voice-size-12"
  },
  "sys-voice-display-md-line-height": {
    "value": "var(--ref-voice-line-height-display)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-md-line-height",
    "reference": "ref-voice-line-height-display",
    "cssReference": "--ref-voice-line-height-display"
  },
  "sys-voice-display-md-letter-spacing": {
    "value": "var(--ref-voice-letter-spacing-tight)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-md-letter-spacing",
    "reference": "ref-voice-letter-spacing-tight",
    "cssReference": "--ref-voice-letter-spacing-tight"
  },
  "sys-voice-display-sm-family": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-sm-family",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-display-sm-weight": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-sm-weight",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-display-sm-size": {
    "value": "var(--ref-voice-size-10)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-sm-size",
    "reference": "ref-voice-size-10",
    "cssReference": "--ref-voice-size-10"
  },
  "sys-voice-display-sm-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-sm-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-display-sm-letter-spacing": {
    "value": "var(--ref-voice-letter-spacing-snug)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-display-sm-letter-spacing",
    "reference": "ref-voice-letter-spacing-snug",
    "cssReference": "--ref-voice-letter-spacing-snug"
  },
  "sys-voice-heading-lg-family": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-lg-family",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-heading-lg-weight": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-lg-weight",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-heading-lg-size": {
    "value": "var(--ref-voice-size-8)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-lg-size",
    "reference": "ref-voice-size-8",
    "cssReference": "--ref-voice-size-8"
  },
  "sys-voice-heading-lg-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-lg-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-heading-lg-letter-spacing": {
    "value": "var(--ref-voice-letter-spacing-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-lg-letter-spacing",
    "reference": "ref-voice-letter-spacing-normal",
    "cssReference": "--ref-voice-letter-spacing-normal"
  },
  "sys-voice-heading-md-family": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-md-family",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-heading-md-weight": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-md-weight",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-heading-md-size": {
    "value": "var(--ref-voice-size-7)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-md-size",
    "reference": "ref-voice-size-7",
    "cssReference": "--ref-voice-size-7"
  },
  "sys-voice-heading-md-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-md-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-heading-md-letter-spacing": {
    "value": "var(--ref-voice-letter-spacing-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-md-letter-spacing",
    "reference": "ref-voice-letter-spacing-normal",
    "cssReference": "--ref-voice-letter-spacing-normal"
  },
  "sys-voice-heading-sm-family": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-sm-family",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-heading-sm-weight": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-sm-weight",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-heading-sm-size": {
    "value": "var(--ref-voice-size-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-sm-size",
    "reference": "ref-voice-size-6",
    "cssReference": "--ref-voice-size-6"
  },
  "sys-voice-heading-sm-line-height": {
    "value": "var(--ref-voice-line-height-loose)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-sm-line-height",
    "reference": "ref-voice-line-height-loose",
    "cssReference": "--ref-voice-line-height-loose"
  },
  "sys-voice-heading-sm-letter-spacing": {
    "value": "var(--ref-voice-letter-spacing-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-heading-sm-letter-spacing",
    "reference": "ref-voice-letter-spacing-normal",
    "cssReference": "--ref-voice-letter-spacing-normal"
  },
  "sys-voice-label-lg-size": {
    "value": "var(--ref-voice-size-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-label-lg-size",
    "reference": "ref-voice-size-6",
    "cssReference": "--ref-voice-size-6"
  },
  "sys-voice-label-lg-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-label-lg-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-label-md-size": {
    "value": "var(--ref-voice-size-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-label-md-size",
    "reference": "ref-voice-size-5",
    "cssReference": "--ref-voice-size-5"
  },
  "sys-voice-label-md-line-height": {
    "value": "var(--ref-voice-line-height-loose)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-label-md-line-height",
    "reference": "ref-voice-line-height-loose",
    "cssReference": "--ref-voice-line-height-loose"
  },
  "sys-voice-label-sm-size": {
    "value": "var(--ref-voice-size-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-label-sm-size",
    "reference": "ref-voice-size-3",
    "cssReference": "--ref-voice-size-3"
  },
  "sys-voice-label-sm-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-label-sm-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-paragraph-lg-size": {
    "value": "var(--ref-voice-size-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-paragraph-lg-size",
    "reference": "ref-voice-size-9",
    "cssReference": "--ref-voice-size-9"
  },
  "sys-voice-paragraph-lg-line-height": {
    "value": "var(--ref-voice-line-height-relaxed)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-paragraph-lg-line-height",
    "reference": "ref-voice-line-height-relaxed",
    "cssReference": "--ref-voice-line-height-relaxed"
  },
  "sys-voice-paragraph-md-size": {
    "value": "var(--ref-voice-size-8)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-paragraph-md-size",
    "reference": "ref-voice-size-8",
    "cssReference": "--ref-voice-size-8"
  },
  "sys-voice-paragraph-md-line-height": {
    "value": "var(--ref-voice-line-height-relaxed)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-paragraph-md-line-height",
    "reference": "ref-voice-line-height-relaxed",
    "cssReference": "--ref-voice-line-height-relaxed"
  },
  "sys-voice-paragraph-sm-size": {
    "value": "var(--ref-voice-size-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-paragraph-sm-size",
    "reference": "ref-voice-size-6",
    "cssReference": "--ref-voice-size-6"
  },
  "sys-voice-paragraph-sm-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-paragraph-sm-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-caption-size": {
    "value": "var(--ref-voice-size-2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-caption-size",
    "reference": "ref-voice-size-2",
    "cssReference": "--ref-voice-size-2"
  },
  "sys-voice-caption-line-height": {
    "value": "var(--ref-voice-line-height-relaxed)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-caption-line-height",
    "reference": "ref-voice-line-height-relaxed",
    "cssReference": "--ref-voice-line-height-relaxed"
  },
  "sys-voice-overline-size": {
    "value": "var(--ref-voice-size-1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-overline-size",
    "reference": "ref-voice-size-1",
    "cssReference": "--ref-voice-size-1"
  },
  "sys-voice-overline-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-overline-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-code-size": {
    "value": "var(--ref-voice-size-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-code-size",
    "reference": "ref-voice-size-5",
    "cssReference": "--ref-voice-size-5"
  },
  "sys-voice-code-sm-size": {
    "value": "var(--ref-voice-size-2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-code-sm-size",
    "reference": "ref-voice-size-2",
    "cssReference": "--ref-voice-size-2"
  },
  "sys-voice-code-line-height": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-code-line-height",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-numeral-family": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-numeral-family",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-numeral-weight": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-numeral-weight",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-numeral-lg-size": {
    "value": "var(--ref-voice-size-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-numeral-lg-size",
    "reference": "ref-voice-size-9",
    "cssReference": "--ref-voice-size-9"
  },
  "sys-voice-numeral-line-height": {
    "value": "var(--ref-voice-line-height-none)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-numeral-line-height",
    "reference": "ref-voice-line-height-none",
    "cssReference": "--ref-voice-line-height-none"
  },
  "sys-voice-family-control": {
    "value": "var(--ref-voice-family-sans)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-family-control",
    "reference": "ref-voice-family-sans",
    "cssReference": "--ref-voice-family-sans"
  },
  "sys-voice-weight-control": {
    "value": "var(--ref-voice-weight-semibold)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-weight-control",
    "reference": "ref-voice-weight-semibold",
    "cssReference": "--ref-voice-weight-semibold"
  },
  "sys-voice-line-height-control": {
    "value": "var(--ref-voice-line-height-none)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-control",
    "reference": "ref-voice-line-height-none",
    "cssReference": "--ref-voice-line-height-none"
  },
  "sys-voice-letter-spacing-control": {
    "value": "var(--ref-voice-letter-spacing-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-control",
    "reference": "ref-voice-letter-spacing-normal",
    "cssReference": "--ref-voice-letter-spacing-normal"
  },
  "sys-voice-family": {
    "value": "var(--ref-voice-family-sans)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-family",
    "reference": "ref-voice-family-sans",
    "cssReference": "--ref-voice-family-sans"
  },
  "sys-voice-family-body": {
    "value": "var(--ref-voice-family-sans)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-family-body",
    "reference": "ref-voice-family-sans",
    "cssReference": "--ref-voice-family-sans"
  },
  "sys-voice-family-title": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-family-title",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-family-mono": {
    "value": "var(--ref-voice-family-mono)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-family-mono",
    "reference": "ref-voice-family-mono",
    "cssReference": "--ref-voice-family-mono"
  },
  "sys-voice-family-brand": {
    "value": "var(--ref-voice-family-brand)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-voice-family-brand",
    "reference": "ref-voice-family-brand",
    "cssReference": "--ref-voice-family-brand"
  },
  "sys-voice-weight-regular": {
    "value": "var(--ref-voice-weight-regular)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-weight-regular",
    "reference": "ref-voice-weight-regular",
    "cssReference": "--ref-voice-weight-regular"
  },
  "sys-voice-weight-medium": {
    "value": "var(--ref-voice-weight-medium)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-weight-medium",
    "reference": "ref-voice-weight-medium",
    "cssReference": "--ref-voice-weight-medium"
  },
  "sys-voice-weight-semibold": {
    "value": "var(--ref-voice-weight-semibold)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-weight-semibold",
    "reference": "ref-voice-weight-semibold",
    "cssReference": "--ref-voice-weight-semibold"
  },
  "sys-voice-weight-bold": {
    "value": "var(--ref-voice-weight-bold)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-weight-bold",
    "reference": "ref-voice-weight-bold",
    "cssReference": "--ref-voice-weight-bold"
  },
  "sys-voice-weight-extrabold": {
    "value": "var(--ref-voice-weight-extrabold)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-weight-extrabold",
    "reference": "ref-voice-weight-extrabold",
    "cssReference": "--ref-voice-weight-extrabold"
  },
  "sys-voice-weight-black": {
    "value": "var(--ref-voice-weight-black)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-voice-weight-black",
    "reference": "ref-voice-weight-black",
    "cssReference": "--ref-voice-weight-black"
  },
  "sys-voice-line-height-none": {
    "value": "var(--ref-voice-line-height-none)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-none",
    "reference": "ref-voice-line-height-none",
    "cssReference": "--ref-voice-line-height-none"
  },
  "sys-voice-line-height-tightest": {
    "value": "var(--ref-voice-line-height-tightest)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-tightest",
    "reference": "ref-voice-line-height-tightest",
    "cssReference": "--ref-voice-line-height-tightest"
  },
  "sys-voice-line-height-compact": {
    "value": "var(--ref-voice-line-height-compact)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-compact",
    "reference": "ref-voice-line-height-compact",
    "cssReference": "--ref-voice-line-height-compact"
  },
  "sys-voice-line-height-crisp": {
    "value": "var(--ref-voice-line-height-crisp)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-crisp",
    "reference": "ref-voice-line-height-crisp",
    "cssReference": "--ref-voice-line-height-crisp"
  },
  "sys-voice-line-height-dense": {
    "value": "var(--ref-voice-line-height-dense)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-dense",
    "reference": "ref-voice-line-height-dense",
    "cssReference": "--ref-voice-line-height-dense"
  },
  "sys-voice-line-height-tight": {
    "value": "var(--ref-voice-line-height-tight)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-tight",
    "reference": "ref-voice-line-height-tight",
    "cssReference": "--ref-voice-line-height-tight"
  },
  "sys-voice-line-height-balanced": {
    "value": "var(--ref-voice-line-height-balanced)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-balanced",
    "reference": "ref-voice-line-height-balanced",
    "cssReference": "--ref-voice-line-height-balanced"
  },
  "sys-voice-line-height-snug": {
    "value": "var(--ref-voice-line-height-snug)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-snug",
    "reference": "ref-voice-line-height-snug",
    "cssReference": "--ref-voice-line-height-snug"
  },
  "sys-voice-line-height-comfortable": {
    "value": "var(--ref-voice-line-height-comfortable)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-comfortable",
    "reference": "ref-voice-line-height-comfortable",
    "cssReference": "--ref-voice-line-height-comfortable"
  },
  "sys-voice-line-height-reading": {
    "value": "var(--ref-voice-line-height-reading)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-reading",
    "reference": "ref-voice-line-height-reading",
    "cssReference": "--ref-voice-line-height-reading"
  },
  "sys-voice-line-height-normal": {
    "value": "var(--ref-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-normal",
    "reference": "ref-voice-line-height-normal",
    "cssReference": "--ref-voice-line-height-normal"
  },
  "sys-voice-line-height-relaxed": {
    "value": "var(--ref-voice-line-height-relaxed)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-relaxed",
    "reference": "ref-voice-line-height-relaxed",
    "cssReference": "--ref-voice-line-height-relaxed"
  },
  "sys-voice-line-height-loose": {
    "value": "var(--ref-voice-line-height-loose)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-loose",
    "reference": "ref-voice-line-height-loose",
    "cssReference": "--ref-voice-line-height-loose"
  },
  "sys-voice-line-height-display": {
    "value": "var(--ref-voice-line-height-display)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-display",
    "reference": "ref-voice-line-height-display",
    "cssReference": "--ref-voice-line-height-display"
  },
  "sys-voice-size-1": {
    "value": "var(--ref-voice-size-1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-1",
    "reference": "ref-voice-size-1",
    "cssReference": "--ref-voice-size-1"
  },
  "sys-voice-size-2": {
    "value": "var(--ref-voice-size-2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-2",
    "reference": "ref-voice-size-2",
    "cssReference": "--ref-voice-size-2"
  },
  "sys-voice-size-3": {
    "value": "var(--ref-voice-size-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-3",
    "reference": "ref-voice-size-3",
    "cssReference": "--ref-voice-size-3"
  },
  "sys-voice-size-4": {
    "value": "var(--ref-voice-size-4)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-4",
    "reference": "ref-voice-size-4",
    "cssReference": "--ref-voice-size-4"
  },
  "sys-voice-size-5": {
    "value": "var(--ref-voice-size-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-5",
    "reference": "ref-voice-size-5",
    "cssReference": "--ref-voice-size-5"
  },
  "sys-voice-size-6": {
    "value": "var(--ref-voice-size-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-6",
    "reference": "ref-voice-size-6",
    "cssReference": "--ref-voice-size-6"
  },
  "sys-voice-size-7": {
    "value": "var(--ref-voice-size-7)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-7",
    "reference": "ref-voice-size-7",
    "cssReference": "--ref-voice-size-7"
  },
  "sys-voice-size-8": {
    "value": "var(--ref-voice-size-8)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-8",
    "reference": "ref-voice-size-8",
    "cssReference": "--ref-voice-size-8"
  },
  "sys-voice-size-9": {
    "value": "var(--ref-voice-size-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-9",
    "reference": "ref-voice-size-9",
    "cssReference": "--ref-voice-size-9"
  },
  "sys-voice-size-10": {
    "value": "var(--ref-voice-size-10)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-10",
    "reference": "ref-voice-size-10",
    "cssReference": "--ref-voice-size-10"
  },
  "sys-voice-size-11": {
    "value": "var(--ref-voice-size-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-11",
    "reference": "ref-voice-size-11",
    "cssReference": "--ref-voice-size-11"
  },
  "sys-voice-size-12": {
    "value": "var(--ref-voice-size-12)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-12",
    "reference": "ref-voice-size-12",
    "cssReference": "--ref-voice-size-12"
  },
  "sys-voice-size-13": {
    "value": "var(--ref-voice-size-13)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-13",
    "reference": "ref-voice-size-13",
    "cssReference": "--ref-voice-size-13"
  },
  "sys-voice-size-14": {
    "value": "var(--ref-voice-size-14)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-14",
    "reference": "ref-voice-size-14",
    "cssReference": "--ref-voice-size-14"
  },
  "sys-voice-letter-spacing-tight": {
    "value": "var(--ref-voice-letter-spacing-tight)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-tight",
    "reference": "ref-voice-letter-spacing-tight",
    "cssReference": "--ref-voice-letter-spacing-tight"
  },
  "sys-voice-letter-spacing-snug": {
    "value": "var(--ref-voice-letter-spacing-snug)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-snug",
    "reference": "ref-voice-letter-spacing-snug",
    "cssReference": "--ref-voice-letter-spacing-snug"
  },
  "sys-voice-letter-spacing-normal": {
    "value": "var(--ref-voice-letter-spacing-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-normal",
    "reference": "ref-voice-letter-spacing-normal",
    "cssReference": "--ref-voice-letter-spacing-normal"
  },
  "sys-voice-letter-spacing-wide": {
    "value": "var(--ref-voice-letter-spacing-wide)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-wide",
    "reference": "ref-voice-letter-spacing-wide",
    "cssReference": "--ref-voice-letter-spacing-wide"
  },
  "sys-voice-letter-spacing-expanded": {
    "value": "var(--ref-voice-letter-spacing-expanded)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-expanded",
    "reference": "ref-voice-letter-spacing-expanded",
    "cssReference": "--ref-voice-letter-spacing-expanded"
  },
  "sys-voice-letter-spacing-wider": {
    "value": "var(--ref-voice-letter-spacing-wider)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-wider",
    "reference": "ref-voice-letter-spacing-wider",
    "cssReference": "--ref-voice-letter-spacing-wider"
  },
  "sys-voice-letter-spacing-widest": {
    "value": "var(--ref-voice-letter-spacing-widest)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-widest",
    "reference": "ref-voice-letter-spacing-widest",
    "cssReference": "--ref-voice-letter-spacing-widest"
  },
  "sys-voice-letter-spacing-caps": {
    "value": "var(--ref-voice-letter-spacing-caps)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-letter-spacing-caps",
    "reference": "ref-voice-letter-spacing-caps",
    "cssReference": "--ref-voice-letter-spacing-caps"
  },
  "sys-voice-transform-none": {
    "value": "none",
    "type": "textTransform",
    "scope": "sys",
    "cssVariable": "--sys-voice-transform-none"
  },
  "sys-voice-transform-uppercase": {
    "value": "uppercase",
    "type": "textTransform",
    "scope": "sys",
    "cssVariable": "--sys-voice-transform-uppercase"
  },
  "sys-voice-size-body": {
    "value": "var(--sys-voice-paragraph-sm-size)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-body",
    "reference": "sys-voice-paragraph-sm-size",
    "cssReference": "--sys-voice-paragraph-sm-size"
  },
  "sys-voice-size-body-sm": {
    "value": "var(--sys-voice-caption-size)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-body-sm",
    "reference": "sys-voice-caption-size",
    "cssReference": "--sys-voice-caption-size"
  },
  "sys-voice-size-label": {
    "value": "var(--sys-voice-label-md-size)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-label",
    "reference": "sys-voice-label-md-size",
    "cssReference": "--sys-voice-label-md-size"
  },
  "sys-voice-size-caption": {
    "value": "var(--sys-voice-caption-size)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-caption",
    "reference": "sys-voice-caption-size",
    "cssReference": "--sys-voice-caption-size"
  },
  "sys-voice-size-overline": {
    "value": "var(--sys-voice-overline-size)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-size-overline",
    "reference": "sys-voice-overline-size",
    "cssReference": "--sys-voice-overline-size"
  },
  "sys-voice-line-height-body": {
    "value": "var(--sys-voice-paragraph-sm-line-height)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-body",
    "reference": "sys-voice-paragraph-sm-line-height",
    "cssReference": "--sys-voice-paragraph-sm-line-height"
  },
  "sys-voice-line-height-body-sm": {
    "value": "var(--sys-voice-caption-line-height)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-voice-line-height-body-sm",
    "reference": "sys-voice-caption-line-height",
    "cssReference": "--sys-voice-caption-line-height"
  },
  "sys-breakpoint-desktop": {
    "value": "var(--sys-frame-breakpoint-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-breakpoint-desktop",
    "reference": "sys-frame-breakpoint-lg",
    "cssReference": "--sys-frame-breakpoint-lg"
  },
  "sys-breakpoint-laptop": {
    "value": "var(--sys-frame-breakpoint-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-breakpoint-laptop",
    "reference": "sys-frame-breakpoint-md",
    "cssReference": "--sys-frame-breakpoint-md"
  },
  "sys-breakpoint-mobile": {
    "value": "0px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-breakpoint-mobile"
  },
  "sys-breakpoint-tablet": {
    "value": "var(--sys-frame-breakpoint-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-breakpoint-tablet",
    "reference": "sys-frame-breakpoint-sm",
    "cssReference": "--sys-frame-breakpoint-sm"
  },
  "sys-breakpoint-wide": {
    "value": "var(--sys-frame-breakpoint-xl)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-breakpoint-wide",
    "reference": "sys-frame-breakpoint-xl",
    "cssReference": "--sys-frame-breakpoint-xl"
  },
  "sys-chart-axis-color": {
    "value": "var(--sys-energy-text-secondary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-chart-axis-color",
    "reference": "sys-energy-text-secondary",
    "cssReference": "--sys-energy-text-secondary"
  },
  "sys-chart-empty-color": {
    "value": "var(--sys-message-intent-neutral-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-chart-empty-color",
    "reference": "sys-message-intent-neutral-color",
    "cssReference": "--sys-message-intent-neutral-color"
  },
  "sys-chart-focus-ring": {
    "value": "var(--sys-a11y-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-focus-ring",
    "reference": "sys-a11y-focus-ring",
    "cssReference": "--sys-a11y-focus-ring"
  },
  "sys-chart-grid-color": {
    "value": "var(--sys-energy-border-default)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-chart-grid-color",
    "reference": "sys-energy-border-default",
    "cssReference": "--sys-energy-border-default"
  },
  "sys-chart-legend-text-color": {
    "value": "var(--sys-energy-text-secondary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-chart-legend-text-color",
    "reference": "sys-energy-text-secondary",
    "cssReference": "--sys-energy-text-secondary"
  },
  "sys-chart-motion-duration-enter": {
    "value": "var(--sys-momentum-duration-reveal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-chart-motion-duration-enter",
    "reference": "sys-momentum-duration-reveal",
    "cssReference": "--sys-momentum-duration-reveal"
  },
  "sys-chart-motion-duration-update": {
    "value": "var(--sys-momentum-duration-default)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-chart-motion-duration-update",
    "reference": "sys-momentum-duration-default",
    "cssReference": "--sys-momentum-duration-default"
  },
  "sys-chart-motion-easing-enter": {
    "value": "var(--sys-momentum-easing-enter)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-motion-easing-enter",
    "reference": "sys-momentum-easing-enter",
    "cssReference": "--sys-momentum-easing-enter"
  },
  "sys-chart-motion-easing-update": {
    "value": "var(--sys-momentum-easing-move)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-motion-easing-update",
    "reference": "sys-momentum-easing-move",
    "cssReference": "--sys-momentum-easing-move"
  },
  "sys-chart-series-primary": {
    "value": "var(--sys-energy-action-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-series-primary",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-chart-series-quaternary": {
    "value": "var(--sys-energy-status-warning)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-series-quaternary",
    "reference": "sys-energy-status-warning",
    "cssReference": "--sys-energy-status-warning"
  },
  "sys-chart-series-secondary": {
    "value": "var(--sys-energy-text-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-series-secondary",
    "reference": "sys-energy-text-primary",
    "cssReference": "--sys-energy-text-primary"
  },
  "sys-chart-series-tertiary": {
    "value": "var(--sys-energy-status-success)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-series-tertiary",
    "reference": "sys-energy-status-success",
    "cssReference": "--sys-energy-status-success"
  },
  "sys-chart-summary-font": {
    "value": "var(--sys-voice-family-body)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-chart-summary-font",
    "reference": "sys-voice-family-body",
    "cssReference": "--sys-voice-family-body"
  },
  "sys-chart-summary-line-height": {
    "value": "var(--sys-a11y-readable-line-height)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-chart-summary-line-height",
    "reference": "sys-a11y-readable-line-height",
    "cssReference": "--sys-a11y-readable-line-height"
  },
  "sys-chart-threshold-danger": {
    "value": "var(--sys-energy-status-error)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-chart-threshold-danger",
    "reference": "sys-energy-status-error",
    "cssReference": "--sys-energy-status-error"
  },
  "sys-chart-threshold-warning": {
    "value": "var(--sys-energy-status-warning)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-chart-threshold-warning",
    "reference": "sys-energy-status-warning",
    "cssReference": "--sys-energy-status-warning"
  },
  "sys-chart-tooltip-background": {
    "value": "var(--sys-energy-text-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-tooltip-background",
    "reference": "sys-energy-text-primary",
    "cssReference": "--sys-energy-text-primary"
  },
  "sys-chart-tooltip-foreground": {
    "value": "var(--sys-energy-surface-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-chart-tooltip-foreground",
    "reference": "sys-energy-surface-primary",
    "cssReference": "--sys-energy-surface-primary"
  },
  "sys-color-action": {
    "value": "var(--sys-energy-action-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-action",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-color-action-hover": {
    "value": "var(--sys-energy-action-hover)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-action-hover",
    "reference": "sys-energy-action-hover",
    "cssReference": "--sys-energy-action-hover"
  },
  "sys-color-action-text": {
    "value": "var(--sys-energy-text-on-action)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-action-text",
    "reference": "sys-energy-text-on-action",
    "cssReference": "--sys-energy-text-on-action"
  },
  "sys-color-border": {
    "value": "var(--sys-energy-border-default)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-border",
    "reference": "sys-energy-border-default",
    "cssReference": "--sys-energy-border-default"
  },
  "sys-color-border-strong": {
    "value": "var(--sys-energy-border-strong)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-border-strong",
    "reference": "sys-energy-border-strong",
    "cssReference": "--sys-energy-border-strong"
  },
  "sys-color-danger": {
    "value": "var(--sys-energy-status-error)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-danger",
    "reference": "sys-energy-status-error",
    "cssReference": "--sys-energy-status-error"
  },
  "sys-color-focus": {
    "value": "var(--sys-energy-action-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-focus",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-color-success": {
    "value": "var(--sys-energy-status-success)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-success",
    "reference": "sys-energy-status-success",
    "cssReference": "--sys-energy-status-success"
  },
  "sys-color-surface": {
    "value": "var(--sys-energy-surface-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-surface",
    "reference": "sys-energy-surface-primary",
    "cssReference": "--sys-energy-surface-primary"
  },
  "sys-color-surface-muted": {
    "value": "var(--sys-energy-surface-sunken)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-surface-muted",
    "reference": "sys-energy-surface-sunken",
    "cssReference": "--sys-energy-surface-sunken"
  },
  "sys-color-surface-raised": {
    "value": "var(--sys-energy-surface-secondary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-surface-raised",
    "reference": "sys-energy-surface-secondary",
    "cssReference": "--sys-energy-surface-secondary"
  },
  "sys-color-text": {
    "value": "var(--sys-energy-text-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-text",
    "reference": "sys-energy-text-primary",
    "cssReference": "--sys-energy-text-primary"
  },
  "sys-color-text-muted": {
    "value": "var(--sys-energy-text-secondary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-text-muted",
    "reference": "sys-energy-text-secondary",
    "cssReference": "--sys-energy-text-secondary"
  },
  "sys-color-text-subtle": {
    "value": "var(--sys-energy-text-tertiary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-text-subtle",
    "reference": "sys-energy-text-tertiary",
    "cssReference": "--sys-energy-text-tertiary"
  },
  "sys-color-warning": {
    "value": "var(--sys-energy-status-warning)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-color-warning",
    "reference": "sys-energy-status-warning",
    "cssReference": "--sys-energy-status-warning"
  },
  "density-card-padding": {
    "value": "var(--sys-density-card-padding)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-card-padding",
    "reference": "sys-density-card-padding",
    "cssReference": "--sys-density-card-padding"
  },
  "density-component-gap": {
    "value": "var(--sys-density-component-gap)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-component-gap",
    "reference": "sys-density-component-gap",
    "cssReference": "--sys-density-component-gap"
  },
  "density-component-gap-lg": {
    "value": "var(--sys-density-component-gap-lg)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-component-gap-lg",
    "reference": "sys-density-component-gap-lg",
    "cssReference": "--sys-density-component-gap-lg"
  },
  "density-control-height": {
    "value": "var(--sys-density-control-height)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-control-height",
    "reference": "sys-density-control-height",
    "cssReference": "--sys-density-control-height"
  },
  "density-control-padding-x": {
    "value": "var(--sys-density-control-padding-x)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-control-padding-x",
    "reference": "sys-density-control-padding-x",
    "cssReference": "--sys-density-control-padding-x"
  },
  "density-control-padding-y": {
    "value": "var(--sys-density-control-padding-y)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-control-padding-y",
    "reference": "sys-density-control-padding-y",
    "cssReference": "--sys-density-control-padding-y"
  },
  "density-page-gap": {
    "value": "var(--sys-density-page-gap)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-page-gap",
    "reference": "sys-density-page-gap",
    "cssReference": "--sys-density-page-gap"
  },
  "density-panel-padding": {
    "value": "var(--sys-density-panel-padding)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-panel-padding",
    "reference": "sys-density-panel-padding",
    "cssReference": "--sys-density-panel-padding"
  },
  "density-row-height": {
    "value": "var(--sys-density-row-height)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-row-height",
    "reference": "sys-density-row-height",
    "cssReference": "--sys-density-row-height"
  },
  "density-section-gap": {
    "value": "var(--sys-density-section-gap)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-section-gap",
    "reference": "sys-density-section-gap",
    "cssReference": "--sys-density-section-gap"
  },
  "density-subsection-gap": {
    "value": "var(--sys-density-subsection-gap)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-subsection-gap",
    "reference": "sys-density-subsection-gap",
    "cssReference": "--sys-density-subsection-gap"
  },
  "density-surface-padding": {
    "value": "var(--sys-density-surface-padding)",
    "type": "dimension",
    "scope": "density",
    "cssVariable": "--density-surface-padding",
    "reference": "sys-density-surface-padding",
    "cssReference": "--sys-density-surface-padding"
  },
  "sys-density-card-padding": {
    "value": "var(--sys-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-card-padding",
    "reference": "sys-space-6",
    "cssReference": "--sys-space-6"
  },
  "sys-density-component-gap": {
    "value": "var(--sys-space-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-component-gap",
    "reference": "sys-space-5",
    "cssReference": "--sys-space-5"
  },
  "sys-density-component-gap-lg": {
    "value": "var(--sys-space-7)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-component-gap-lg",
    "reference": "sys-space-7",
    "cssReference": "--sys-space-7"
  },
  "sys-density-control-height": {
    "value": "var(--ref-frame-height-control-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-control-height",
    "reference": "ref-frame-height-control-md",
    "cssReference": "--ref-frame-height-control-md"
  },
  "sys-density-control-padding-x": {
    "value": "var(--sys-space-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-control-padding-x",
    "reference": "sys-space-5",
    "cssReference": "--sys-space-5"
  },
  "sys-density-control-padding-y": {
    "value": "var(--sys-space-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-control-padding-y",
    "reference": "sys-space-3",
    "cssReference": "--sys-space-3"
  },
  "sys-density-page-gap": {
    "value": "var(--sys-space-20)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-page-gap",
    "reference": "sys-space-20",
    "cssReference": "--sys-space-20"
  },
  "sys-density-panel-padding": {
    "value": "var(--sys-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-panel-padding",
    "reference": "sys-space-6",
    "cssReference": "--sys-space-6"
  },
  "sys-density-row-height": {
    "value": "var(--ref-frame-height-control-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-row-height",
    "reference": "ref-frame-height-control-md",
    "cssReference": "--ref-frame-height-control-md"
  },
  "sys-density-section-gap": {
    "value": "var(--sys-space-16)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-section-gap",
    "reference": "sys-space-16",
    "cssReference": "--sys-space-16"
  },
  "sys-density-subsection-gap": {
    "value": "var(--sys-space-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-subsection-gap",
    "reference": "sys-space-9",
    "cssReference": "--sys-space-9"
  },
  "sys-density-surface-padding": {
    "value": "var(--sys-space-12)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-density-surface-padding",
    "reference": "sys-space-12",
    "cssReference": "--sys-space-12"
  },
  "sys-disabled-border-color": {
    "value": "color-mix(in srgb, var(--sys-energy-border-default) 82%, transparent)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-disabled-border-color"
  },
  "sys-disabled-cursor": {
    "value": "not-allowed",
    "type": "content",
    "scope": "sys",
    "cssVariable": "--sys-disabled-cursor"
  },
  "sys-disabled-icon-color": {
    "value": "var(--sys-icon-color-disabled)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-disabled-icon-color",
    "reference": "sys-icon-color-disabled",
    "cssReference": "--sys-icon-color-disabled"
  },
  "sys-disabled-opacity": {
    "value": "var(--sys-state-disabled-opacity)",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-disabled-opacity",
    "reference": "sys-state-disabled-opacity",
    "cssReference": "--sys-state-disabled-opacity"
  },
  "sys-disabled-pointer-events": {
    "value": "none",
    "type": "content",
    "scope": "sys",
    "cssVariable": "--sys-disabled-pointer-events"
  },
  "sys-disabled-readable-opacity": {
    "value": "var(--sys-state-disabled-readable-opacity)",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-disabled-readable-opacity",
    "reference": "sys-state-disabled-readable-opacity",
    "cssReference": "--sys-state-disabled-readable-opacity"
  },
  "sys-disabled-surface-opacity": {
    "value": "var(--sys-state-disabled-readable-opacity)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-disabled-surface-opacity",
    "reference": "sys-state-disabled-readable-opacity",
    "cssReference": "--sys-state-disabled-readable-opacity"
  },
  "sys-disabled-text-color": {
    "value": "var(--sys-energy-text-tertiary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-disabled-text-color",
    "reference": "sys-energy-text-tertiary",
    "cssReference": "--sys-energy-text-tertiary"
  },
  "sys-duration-base": {
    "value": "var(--sys-momentum-duration-default)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-base",
    "reference": "sys-momentum-duration-default",
    "cssReference": "--sys-momentum-duration-default"
  },
  "sys-duration-cycle": {
    "value": "var(--sys-momentum-duration-loop)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-cycle",
    "reference": "sys-momentum-duration-loop",
    "cssReference": "--sys-momentum-duration-loop"
  },
  "sys-duration-enter": {
    "value": "var(--sys-momentum-duration-enter)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-enter",
    "reference": "sys-momentum-duration-enter",
    "cssReference": "--sys-momentum-duration-enter"
  },
  "sys-duration-fast": {
    "value": "var(--sys-momentum-duration-fast)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-fast",
    "reference": "sys-momentum-duration-fast",
    "cssReference": "--sys-momentum-duration-fast"
  },
  "sys-duration-instant": {
    "value": "var(--sys-momentum-duration-instant)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-instant",
    "reference": "sys-momentum-duration-instant",
    "cssReference": "--sys-momentum-duration-instant"
  },
  "sys-duration-loading-cycle": {
    "value": "var(--sys-momentum-duration-loading-cycle)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-loading-cycle",
    "reference": "sys-momentum-duration-loading-cycle",
    "cssReference": "--sys-momentum-duration-loading-cycle"
  },
  "sys-duration-loading-spin": {
    "value": "var(--sys-momentum-duration-loading-spin)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-loading-spin",
    "reference": "sys-momentum-duration-loading-spin",
    "cssReference": "--sys-momentum-duration-loading-spin"
  },
  "sys-duration-medium": {
    "value": "var(--sys-momentum-duration-medium)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-medium",
    "reference": "sys-momentum-duration-medium",
    "cssReference": "--sys-momentum-duration-medium"
  },
  "sys-duration-overlay": {
    "value": "var(--sys-momentum-duration-overlay)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-overlay",
    "reference": "sys-momentum-duration-overlay",
    "cssReference": "--sys-momentum-duration-overlay"
  },
  "sys-duration-press": {
    "value": "var(--sys-momentum-duration-press)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-press",
    "reference": "sys-momentum-duration-press",
    "cssReference": "--sys-momentum-duration-press"
  },
  "sys-duration-progress": {
    "value": "var(--sys-momentum-duration-progress)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-progress",
    "reference": "sys-momentum-duration-progress",
    "cssReference": "--sys-momentum-duration-progress"
  },
  "sys-duration-pulse": {
    "value": "var(--sys-momentum-duration-pulse)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-pulse",
    "reference": "sys-momentum-duration-pulse",
    "cssReference": "--sys-momentum-duration-pulse"
  },
  "sys-duration-reveal": {
    "value": "var(--sys-momentum-duration-reveal)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-reveal",
    "reference": "sys-momentum-duration-reveal",
    "cssReference": "--sys-momentum-duration-reveal"
  },
  "sys-duration-sheet": {
    "value": "var(--sys-momentum-duration-sheet)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-sheet",
    "reference": "sys-momentum-duration-sheet",
    "cssReference": "--sys-momentum-duration-sheet"
  },
  "sys-duration-slow": {
    "value": "var(--sys-momentum-duration-slow)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-slow",
    "reference": "sys-momentum-duration-slow",
    "cssReference": "--sys-momentum-duration-slow"
  },
  "sys-duration-snappy": {
    "value": "var(--sys-momentum-duration-snappy)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-snappy",
    "reference": "sys-momentum-duration-snappy",
    "cssReference": "--sys-momentum-duration-snappy"
  },
  "sys-duration-touch": {
    "value": "var(--sys-momentum-duration-touch)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-duration-touch",
    "reference": "sys-momentum-duration-touch",
    "cssReference": "--sys-momentum-duration-touch"
  },
  "sys-elevation-0": {
    "value": "var(--sys-depth-elevation-0)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-0",
    "reference": "sys-depth-elevation-0",
    "cssReference": "--sys-depth-elevation-0"
  },
  "sys-elevation-1": {
    "value": "var(--sys-depth-elevation-1)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-1",
    "reference": "sys-depth-elevation-1",
    "cssReference": "--sys-depth-elevation-1"
  },
  "sys-elevation-2": {
    "value": "var(--sys-depth-elevation-2)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-2",
    "reference": "sys-depth-elevation-2",
    "cssReference": "--sys-depth-elevation-2"
  },
  "sys-elevation-3": {
    "value": "var(--sys-depth-elevation-3)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-3",
    "reference": "sys-depth-elevation-3",
    "cssReference": "--sys-depth-elevation-3"
  },
  "sys-elevation-4": {
    "value": "var(--sys-depth-elevation-4)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-4",
    "reference": "sys-depth-elevation-4",
    "cssReference": "--sys-depth-elevation-4"
  },
  "sys-elevation-card": {
    "value": "var(--sys-elevation-1)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-card",
    "reference": "sys-elevation-1",
    "cssReference": "--sys-elevation-1"
  },
  "sys-elevation-card-hover": {
    "value": "var(--sys-elevation-3)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-card-hover",
    "reference": "sys-elevation-3",
    "cssReference": "--sys-elevation-3"
  },
  "sys-elevation-control": {
    "value": "var(--sys-elevation-1)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-control",
    "reference": "sys-elevation-1",
    "cssReference": "--sys-elevation-1"
  },
  "sys-elevation-floating": {
    "value": "var(--sys-elevation-2)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-floating",
    "reference": "sys-elevation-2",
    "cssReference": "--sys-elevation-2"
  },
  "sys-elevation-modal": {
    "value": "var(--sys-elevation-4)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-modal",
    "reference": "sys-elevation-4",
    "cssReference": "--sys-elevation-4"
  },
  "sys-elevation-popover": {
    "value": "var(--sys-elevation-3)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-popover",
    "reference": "sys-elevation-3",
    "cssReference": "--sys-elevation-3"
  },
  "sys-elevation-sheet": {
    "value": "var(--sys-elevation-4)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-sheet",
    "reference": "sys-elevation-4",
    "cssReference": "--sys-elevation-4"
  },
  "sys-elevation-toast": {
    "value": "var(--sys-elevation-3)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-elevation-toast",
    "reference": "sys-elevation-3",
    "cssReference": "--sys-elevation-3"
  },
  "sys-email-color-text-primary": {
    "value": "#17171A",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-text-primary"
  },
  "sys-email-color-text-muted": {
    "value": "#8A8781",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-text-muted"
  },
  "sys-email-color-text-secondary": {
    "value": "#55534E",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-text-secondary"
  },
  "sys-email-color-page": {
    "value": "#F3F1ED",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-page"
  },
  "sys-email-color-border": {
    "value": "#E0DDD7",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-border"
  },
  "sys-email-color-border-soft": {
    "value": "#EEEBE6",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-border-soft"
  },
  "sys-email-color-accent": {
    "value": "#FF3617",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-accent"
  },
  "sys-email-color-link": {
    "value": "#E62D10",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-link"
  },
  "sys-email-color-success": {
    "value": "#0E8A50",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-success"
  },
  "sys-email-color-warning": {
    "value": "#B26A00",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-warning"
  },
  "sys-email-color-danger": {
    "value": "#B42318",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-danger"
  },
  "sys-email-color-white": {
    "value": "#FFFFFF",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-email-color-white"
  },
  "sys-email-font-family-body": {
    "value": "Arial,Helvetica,sans-serif",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-email-font-family-body"
  },
  "sys-email-font-family-mono": {
    "value": "Courier New,monospace",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-email-font-family-mono"
  },
  "sys-email-font-family-fallback": {
    "value": "sans-serif",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-email-font-family-fallback"
  },
  "sys-email-font-size-hidden": {
    "value": "1px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-hidden"
  },
  "sys-email-font-size-xs": {
    "value": "11px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-xs"
  },
  "sys-email-font-size-sm": {
    "value": "12px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-sm"
  },
  "sys-email-font-size-note": {
    "value": "12.5px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-note"
  },
  "sys-email-font-size-code-label": {
    "value": "13px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-code-label"
  },
  "sys-email-font-size-list": {
    "value": "13.5px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-list"
  },
  "sys-email-font-size-body": {
    "value": "14px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-body"
  },
  "sys-email-font-size-step": {
    "value": "15px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-step"
  },
  "sys-email-font-size-brand": {
    "value": "20px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-brand"
  },
  "sys-email-font-size-headline": {
    "value": "22px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-headline"
  },
  "sys-email-font-size-transactional-headline": {
    "value": "34px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-transactional-headline"
  },
  "sys-email-font-size-code": {
    "value": "32px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-font-size-code"
  },
  "sys-email-line-height-hidden": {
    "value": "1px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-line-height-hidden"
  },
  "sys-email-line-height-note": {
    "value": "18px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-line-height-note"
  },
  "sys-email-line-height-body": {
    "value": "21px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-line-height-body"
  },
  "sys-email-line-height-headline": {
    "value": "29px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-line-height-headline"
  },
  "sys-email-line-height-transactional-headline": {
    "value": "40px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-line-height-transactional-headline"
  },
  "sys-email-letter-spacing-tight": {
    "value": "-0.5px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-letter-spacing-tight"
  },
  "sys-email-letter-spacing-label": {
    "value": "0.6px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-letter-spacing-label"
  },
  "sys-email-letter-spacing-eyebrow": {
    "value": "1px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-letter-spacing-eyebrow"
  },
  "sys-email-letter-spacing-code": {
    "value": "8px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-letter-spacing-code"
  },
  "sys-email-border-width": {
    "value": "1px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-border-width"
  },
  "sys-email-radius-card": {
    "value": "20px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-radius-card"
  },
  "sys-email-radius-pill": {
    "value": "999px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-radius-pill"
  },
  "sys-email-radius-metric": {
    "value": "14px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-radius-metric"
  },
  "sys-email-space-xxs": {
    "value": "2px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-xxs"
  },
  "sys-email-space-xs": {
    "value": "4px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-xs"
  },
  "sys-email-space-sm": {
    "value": "8px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-sm"
  },
  "sys-email-space-md": {
    "value": "10px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-md"
  },
  "sys-email-space-lg": {
    "value": "12px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-lg"
  },
  "sys-email-space-xl": {
    "value": "16px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-xl"
  },
  "sys-email-space-2xl": {
    "value": "18px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-2xl"
  },
  "sys-email-space-3xl": {
    "value": "20px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-3xl"
  },
  "sys-email-space-4xl": {
    "value": "24px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-4xl"
  },
  "sys-email-space-5xl": {
    "value": "26px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-5xl"
  },
  "sys-email-space-6xl": {
    "value": "28px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-6xl"
  },
  "sys-email-space-7xl": {
    "value": "32px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-space-7xl"
  },
  "sys-email-content-width": {
    "value": "600px",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-email-content-width"
  },
  "sys-focus-restore-ring": {
    "value": "var(--sys-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-focus-restore-ring",
    "reference": "sys-focus-ring",
    "cssReference": "--sys-focus-ring"
  },
  "sys-focus-ring": {
    "value": "var(--sys-accessibility-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-focus-ring",
    "reference": "sys-accessibility-focus-ring",
    "cssReference": "--sys-accessibility-focus-ring"
  },
  "sys-focus-ring-offset": {
    "value": "var(--sys-accessibility-focus-offset)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-focus-ring-offset",
    "reference": "sys-accessibility-focus-offset",
    "cssReference": "--sys-accessibility-focus-offset"
  },
  "sys-focus-roving-ring": {
    "value": "var(--sys-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-focus-roving-ring",
    "reference": "sys-focus-ring",
    "cssReference": "--sys-focus-ring"
  },
  "sys-focus-skip-target-offset": {
    "value": "var(--sys-frame-gap-component)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-focus-skip-target-offset",
    "reference": "sys-frame-gap-component",
    "cssReference": "--sys-frame-gap-component"
  },
  "sys-focus-trap-z-index": {
    "value": "var(--sys-depth-z-dialog)",
    "type": "zIndex",
    "scope": "sys",
    "cssVariable": "--sys-focus-trap-z-index",
    "reference": "sys-depth-z-dialog",
    "cssReference": "--sys-depth-z-dialog"
  },
  "sys-focus-visible-offset": {
    "value": "var(--sys-focus-ring-offset)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-focus-visible-offset",
    "reference": "sys-focus-ring-offset",
    "cssReference": "--sys-focus-ring-offset"
  },
  "sys-focus-visible-ring": {
    "value": "var(--sys-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-focus-visible-ring",
    "reference": "sys-focus-ring",
    "cssReference": "--sys-focus-ring"
  },
  "sys-icon-color-action": {
    "value": "var(--sys-iconography-color-action)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-icon-color-action",
    "reference": "sys-iconography-color-action",
    "cssReference": "--sys-iconography-color-action"
  },
  "sys-icon-color-danger": {
    "value": "var(--sys-iconography-color-danger)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-icon-color-danger",
    "reference": "sys-iconography-color-danger",
    "cssReference": "--sys-iconography-color-danger"
  },
  "sys-icon-color-disabled": {
    "value": "var(--sys-iconography-color-disabled)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-icon-color-disabled",
    "reference": "sys-iconography-color-disabled",
    "cssReference": "--sys-iconography-color-disabled"
  },
  "sys-icon-color-muted": {
    "value": "var(--sys-iconography-color-muted)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-icon-color-muted",
    "reference": "sys-iconography-color-muted",
    "cssReference": "--sys-iconography-color-muted"
  },
  "sys-icon-color-navigation": {
    "value": "var(--sys-iconography-color-navigation)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-icon-color-navigation",
    "reference": "sys-iconography-color-navigation",
    "cssReference": "--sys-iconography-color-navigation"
  },
  "sys-icon-color-status": {
    "value": "var(--sys-iconography-color-status)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-icon-color-status",
    "reference": "sys-iconography-color-status",
    "cssReference": "--sys-iconography-color-status"
  },
  "sys-icon-color-warning": {
    "value": "var(--sys-iconography-color-warning)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-icon-color-warning",
    "reference": "sys-iconography-color-warning",
    "cssReference": "--sys-iconography-color-warning"
  },
  "sys-icon-family": {
    "value": "var(--sys-iconography-family)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-icon-family",
    "reference": "sys-iconography-family",
    "cssReference": "--sys-iconography-family"
  },
  "sys-icon-focus-offset": {
    "value": "var(--sys-iconography-focus-offset)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-focus-offset",
    "reference": "sys-iconography-focus-offset",
    "cssReference": "--sys-iconography-focus-offset"
  },
  "sys-icon-focus-ring": {
    "value": "var(--sys-iconography-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-icon-focus-ring",
    "reference": "sys-iconography-focus-ring",
    "cssReference": "--sys-iconography-focus-ring"
  },
  "sys-icon-size-display-md": {
    "value": "var(--sys-iconography-size-display-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-display-md",
    "reference": "sys-iconography-size-display-md",
    "cssReference": "--sys-iconography-size-display-md"
  },
  "sys-icon-size-display-sm": {
    "value": "var(--sys-iconography-size-display-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-display-sm",
    "reference": "sys-iconography-size-display-sm",
    "cssReference": "--sys-iconography-size-display-sm"
  },
  "sys-icon-size-lg": {
    "value": "var(--sys-iconography-size-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-lg",
    "reference": "sys-iconography-size-lg",
    "cssReference": "--sys-iconography-size-lg"
  },
  "sys-icon-size-lg-plus": {
    "value": "var(--sys-iconography-size-lg-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-lg-plus",
    "reference": "sys-iconography-size-lg-plus",
    "cssReference": "--sys-iconography-size-lg-plus"
  },
  "sys-icon-size-marker": {
    "value": "var(--sys-iconography-size-marker)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-marker",
    "reference": "sys-iconography-size-marker",
    "cssReference": "--sys-iconography-size-marker"
  },
  "sys-icon-size-md": {
    "value": "var(--sys-iconography-size-md)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-md",
    "reference": "sys-iconography-size-md",
    "cssReference": "--sys-iconography-size-md"
  },
  "sys-icon-size-md-plus": {
    "value": "var(--sys-iconography-size-md-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-md-plus",
    "reference": "sys-iconography-size-md-plus",
    "cssReference": "--sys-iconography-size-md-plus"
  },
  "sys-icon-size-sm": {
    "value": "var(--sys-iconography-size-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-sm",
    "reference": "sys-iconography-size-sm",
    "cssReference": "--sys-iconography-size-sm"
  },
  "sys-icon-size-sm-plus": {
    "value": "var(--sys-iconography-size-sm-plus)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-sm-plus",
    "reference": "sys-iconography-size-sm-plus",
    "cssReference": "--sys-iconography-size-sm-plus"
  },
  "sys-icon-size-station": {
    "value": "var(--sys-iconography-size-station)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-size-station",
    "reference": "sys-iconography-size-station",
    "cssReference": "--sys-iconography-size-station"
  },
  "sys-icon-touch-target-min": {
    "value": "var(--sys-iconography-touch-target-min)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-icon-touch-target-min",
    "reference": "sys-iconography-touch-target-min",
    "cssReference": "--sys-iconography-touch-target-min"
  },
  "sys-icon-variation-filled": {
    "value": "var(--sys-iconography-variation-filled)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-icon-variation-filled",
    "reference": "sys-iconography-variation-filled",
    "cssReference": "--sys-iconography-variation-filled"
  },
  "sys-icon-variation-filled-strong": {
    "value": "var(--sys-iconography-variation-filled-strong)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-icon-variation-filled-strong",
    "reference": "sys-iconography-variation-filled-strong",
    "cssReference": "--sys-iconography-variation-filled-strong"
  },
  "sys-icon-variation-outline-strong": {
    "value": "var(--sys-iconography-variation-outline-strong)",
    "type": "fontVariationSettings",
    "scope": "sys",
    "cssVariable": "--sys-icon-variation-outline-strong",
    "reference": "sys-iconography-variation-outline-strong",
    "cssReference": "--sys-iconography-variation-outline-strong"
  },
  "sys-loading-busy-cursor": {
    "value": "progress",
    "type": "content",
    "scope": "sys",
    "cssVariable": "--sys-loading-busy-cursor"
  },
  "sys-loading-cycle-duration": {
    "value": "var(--sys-momentum-duration-loading-cycle)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-loading-cycle-duration",
    "reference": "sys-momentum-duration-loading-cycle",
    "cssReference": "--sys-momentum-duration-loading-cycle"
  },
  "sys-loading-easing-linear": {
    "value": "var(--sys-momentum-easing-linear)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-loading-easing-linear",
    "reference": "sys-momentum-easing-linear",
    "cssReference": "--sys-momentum-easing-linear"
  },
  "sys-loading-easing-rhythm": {
    "value": "var(--sys-momentum-easing-move)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-loading-easing-rhythm",
    "reference": "sys-momentum-easing-move",
    "cssReference": "--sys-momentum-easing-move"
  },
  "sys-loading-progress-duration": {
    "value": "var(--sys-momentum-duration-progress)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-loading-progress-duration",
    "reference": "sys-momentum-duration-progress",
    "cssReference": "--sys-momentum-duration-progress"
  },
  "sys-loading-progress-fill": {
    "value": "var(--sys-energy-action-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-loading-progress-fill",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-loading-progress-track": {
    "value": "var(--sys-energy-border-default)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-loading-progress-track",
    "reference": "sys-energy-border-default",
    "cssReference": "--sys-energy-border-default"
  },
  "sys-loading-pulse-duration": {
    "value": "var(--sys-momentum-duration-pulse)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-loading-pulse-duration",
    "reference": "sys-momentum-duration-pulse",
    "cssReference": "--sys-momentum-duration-pulse"
  },
  "sys-loading-skeleton-highlight": {
    "value": "var(--sys-energy-border-default)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-loading-skeleton-highlight",
    "reference": "sys-energy-border-default",
    "cssReference": "--sys-energy-border-default"
  },
  "sys-loading-skeleton-surface": {
    "value": "var(--sys-energy-surface-sunken)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-loading-skeleton-surface",
    "reference": "sys-energy-surface-sunken",
    "cssReference": "--sys-energy-surface-sunken"
  },
  "sys-loading-spin-duration": {
    "value": "var(--sys-momentum-duration-loading-spin)",
    "type": "duration",
    "scope": "sys",
    "cssVariable": "--sys-loading-spin-duration",
    "reference": "sys-momentum-duration-loading-spin",
    "cssReference": "--sys-momentum-duration-loading-spin"
  },
  "sys-loading-spinner-tone": {
    "value": "var(--sys-energy-action-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-loading-spinner-tone",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-loading-spinner-track": {
    "value": "var(--sys-energy-border-default)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-loading-spinner-track",
    "reference": "sys-energy-border-default",
    "cssReference": "--sys-energy-border-default"
  },
  "sys-loading-stale-opacity": {
    "value": "var(--sys-state-closed-opacity)",
    "type": "opacity",
    "scope": "sys",
    "cssVariable": "--sys-loading-stale-opacity",
    "reference": "sys-state-closed-opacity",
    "cssReference": "--sys-state-closed-opacity"
  },
  "sys-map-depth-pin": {
    "value": "var(--sys-depth-elevation-1)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-map-depth-pin",
    "reference": "sys-depth-elevation-1",
    "cssReference": "--sys-depth-elevation-1"
  },
  "sys-map-depth-selected": {
    "value": "var(--sys-depth-elevation-2)",
    "type": "shadow",
    "scope": "sys",
    "cssVariable": "--sys-map-depth-selected",
    "reference": "sys-depth-elevation-2",
    "cssReference": "--sys-depth-elevation-2"
  },
  "sys-map-fallback-surface": {
    "value": "var(--sys-energy-surface-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-fallback-surface",
    "reference": "sys-energy-surface-primary",
    "cssReference": "--sys-energy-surface-primary"
  },
  "sys-map-fallback-text-color": {
    "value": "var(--sys-energy-text-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-fallback-text-color",
    "reference": "sys-energy-text-primary",
    "cssReference": "--sys-energy-text-primary"
  },
  "sys-map-focus-ring": {
    "value": "var(--sys-a11y-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-map-focus-ring",
    "reference": "sys-a11y-focus-ring",
    "cssReference": "--sys-a11y-focus-ring"
  },
  "sys-map-permission-denied-color": {
    "value": "var(--sys-energy-status-error)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-permission-denied-color",
    "reference": "sys-energy-status-error",
    "cssReference": "--sys-energy-status-error"
  },
  "sys-map-permission-granted-color": {
    "value": "var(--sys-energy-status-success)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-permission-granted-color",
    "reference": "sys-energy-status-success",
    "cssReference": "--sys-energy-status-success"
  },
  "sys-map-permission-prompt-color": {
    "value": "var(--sys-energy-status-warning)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-permission-prompt-color",
    "reference": "sys-energy-status-warning",
    "cssReference": "--sys-energy-status-warning"
  },
  "sys-map-pin-action-color": {
    "value": "var(--sys-energy-action-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-action-color",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-map-pin-background": {
    "value": "var(--sys-energy-surface-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-background",
    "reference": "sys-energy-surface-primary",
    "cssReference": "--sys-energy-surface-primary"
  },
  "sys-map-pin-border": {
    "value": "var(--sys-energy-border-default)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-border",
    "reference": "sys-energy-border-default",
    "cssReference": "--sys-energy-border-default"
  },
  "sys-map-pin-cluster-background": {
    "value": "var(--sys-energy-text-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-cluster-background",
    "reference": "sys-energy-text-primary",
    "cssReference": "--sys-energy-text-primary"
  },
  "sys-map-pin-cluster-foreground": {
    "value": "var(--sys-energy-surface-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-cluster-foreground",
    "reference": "sys-energy-surface-primary",
    "cssReference": "--sys-energy-surface-primary"
  },
  "sys-map-pin-foreground": {
    "value": "var(--sys-energy-text-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-foreground",
    "reference": "sys-energy-text-primary",
    "cssReference": "--sys-energy-text-primary"
  },
  "sys-map-pin-selected-background": {
    "value": "var(--sys-energy-action-primary)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-selected-background",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-map-pin-selected-foreground": {
    "value": "var(--sys-energy-text-on-action)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-map-pin-selected-foreground",
    "reference": "sys-energy-text-on-action",
    "cssReference": "--sys-energy-text-on-action"
  },
  "sys-map-route-line-color": {
    "value": "var(--sys-energy-action-primary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-route-line-color",
    "reference": "sys-energy-action-primary",
    "cssReference": "--sys-energy-action-primary"
  },
  "sys-map-route-line-muted-color": {
    "value": "var(--sys-energy-border-default)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-map-route-line-muted-color",
    "reference": "sys-energy-border-default",
    "cssReference": "--sys-energy-border-default"
  },
  "sys-measurement-analytics-color": {
    "value": "var(--sys-growth-stage-stable-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-measurement-analytics-color",
    "reference": "sys-growth-stage-stable-color",
    "cssReference": "--sys-growth-stage-stable-color"
  },
  "sys-measurement-event-color": {
    "value": "var(--sys-tone-neutral-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-measurement-event-color",
    "reference": "sys-tone-neutral-color",
    "cssReference": "--sys-tone-neutral-color"
  },
  "sys-measurement-event-font": {
    "value": "var(--sys-growth-event-font)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-measurement-event-font",
    "reference": "sys-growth-event-font",
    "cssReference": "--sys-growth-event-font"
  },
  "sys-measurement-guardrail-background": {
    "value": "color-mix(in srgb, var(--sys-energy-status-warning) 16%, transparent)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-measurement-guardrail-background"
  },
  "sys-measurement-guardrail-color": {
    "value": "var(--sys-tone-urgent-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-measurement-guardrail-color",
    "reference": "sys-tone-urgent-color",
    "cssReference": "--sys-tone-urgent-color"
  },
  "sys-measurement-hypothesis-color": {
    "value": "var(--sys-tone-assistive-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-measurement-hypothesis-color",
    "reference": "sys-tone-assistive-color",
    "cssReference": "--sys-tone-assistive-color"
  },
  "sys-measurement-metric-color": {
    "value": "var(--sys-growth-stage-measured-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-measurement-metric-color",
    "reference": "sys-growth-stage-measured-color",
    "cssReference": "--sys-growth-stage-measured-color"
  },
  "sys-measurement-metric-font": {
    "value": "var(--sys-voice-numeral-family)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-measurement-metric-font",
    "reference": "sys-voice-numeral-family",
    "cssReference": "--sys-voice-numeral-family"
  },
  "sys-measurement-metric-weight": {
    "value": "var(--sys-voice-numeral-weight)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-measurement-metric-weight",
    "reference": "sys-voice-numeral-weight",
    "cssReference": "--sys-voice-numeral-weight"
  },
  "sys-measurement-privacy-color": {
    "value": "var(--sys-energy-text-secondary)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-measurement-privacy-color",
    "reference": "sys-energy-text-secondary",
    "cssReference": "--sys-energy-text-secondary"
  },
  "sys-message-action-weight": {
    "value": "var(--sys-tone-assistive-weight)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-message-action-weight",
    "reference": "sys-tone-assistive-weight",
    "cssReference": "--sys-tone-assistive-weight"
  },
  "sys-message-alert-role": {
    "value": "alert",
    "type": "content",
    "scope": "sys",
    "cssVariable": "--sys-message-alert-role"
  },
  "sys-message-body-font": {
    "value": "var(--sys-voice-family-body)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-message-body-font",
    "reference": "sys-voice-family-body",
    "cssReference": "--sys-voice-family-body"
  },
  "sys-message-body-weight": {
    "value": "var(--sys-tone-neutral-weight)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-message-body-weight",
    "reference": "sys-tone-neutral-weight",
    "cssReference": "--sys-tone-neutral-weight"
  },
  "sys-message-focus-ring": {
    "value": "var(--sys-accessibility-focus-ring)",
    "type": "unknown",
    "scope": "sys",
    "cssVariable": "--sys-message-focus-ring",
    "reference": "sys-accessibility-focus-ring",
    "cssReference": "--sys-accessibility-focus-ring"
  },
  "sys-message-intent-assistive-color": {
    "value": "var(--sys-tone-assistive-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-message-intent-assistive-color",
    "reference": "sys-tone-assistive-color",
    "cssReference": "--sys-tone-assistive-color"
  },
  "sys-message-intent-danger-color": {
    "value": "var(--sys-tone-repair-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-message-intent-danger-color",
    "reference": "sys-tone-repair-color",
    "cssReference": "--sys-tone-repair-color"
  },
  "sys-message-intent-neutral-color": {
    "value": "var(--sys-tone-neutral-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-message-intent-neutral-color",
    "reference": "sys-tone-neutral-color",
    "cssReference": "--sys-tone-neutral-color"
  },
  "sys-message-intent-success-color": {
    "value": "var(--sys-tone-confirm-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-message-intent-success-color",
    "reference": "sys-tone-confirm-color",
    "cssReference": "--sys-tone-confirm-color"
  },
  "sys-message-intent-warning-color": {
    "value": "var(--sys-tone-urgent-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-message-intent-warning-color",
    "reference": "sys-tone-urgent-color",
    "cssReference": "--sys-tone-urgent-color"
  },
  "sys-message-live-role": {
    "value": "status",
    "type": "content",
    "scope": "sys",
    "cssVariable": "--sys-message-live-role"
  },
  "sys-message-locale-max-inline-size": {
    "value": "72ch",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-message-locale-max-inline-size"
  },
  "sys-message-readable-line-height": {
    "value": "var(--sys-accessibility-readable-line-height)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-message-readable-line-height",
    "reference": "sys-accessibility-readable-line-height",
    "cssReference": "--sys-accessibility-readable-line-height"
  },
  "sys-message-recovery-weight": {
    "value": "var(--sys-tone-repair-weight)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-message-recovery-weight",
    "reference": "sys-tone-repair-weight",
    "cssReference": "--sys-tone-repair-weight"
  },
  "sys-message-title-font": {
    "value": "var(--sys-voice-family-title)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-message-title-font",
    "reference": "sys-voice-family-title",
    "cssReference": "--sys-voice-family-title"
  },
  "sys-message-title-weight": {
    "value": "var(--sys-tone-urgent-weight)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-message-title-weight",
    "reference": "sys-tone-urgent-weight",
    "cssReference": "--sys-tone-urgent-weight"
  },
  "sys-motion-curve-enter": {
    "value": "var(--sys-momentum-easing-enter)",
    "type": "cubicBezier",
    "scope": "sys",
    "cssVariable": "--sys-motion-curve-enter",
    "reference": "sys-momentum-easing-enter",
    "cssReference": "--sys-momentum-easing-enter"
  },
  "sys-motion-curve-exit": {
    "value": "var(--sys-momentum-easing-exit)",
    "type": "cubicBezier",
    "scope": "sys",
    "cssVariable": "--sys-motion-curve-exit",
    "reference": "sys-momentum-easing-exit",
    "cssReference": "--sys-momentum-easing-exit"
  },
  "sys-motion-curve-linear": {
    "value": "var(--sys-momentum-easing-linear)",
    "type": "cubicBezier",
    "scope": "sys",
    "cssVariable": "--sys-motion-curve-linear",
    "reference": "sys-momentum-easing-linear",
    "cssReference": "--sys-momentum-easing-linear"
  },
  "sys-motion-curve-move": {
    "value": "var(--sys-momentum-easing-move)",
    "type": "cubicBezier",
    "scope": "sys",
    "cssVariable": "--sys-motion-curve-move",
    "reference": "sys-momentum-easing-move",
    "cssReference": "--sys-momentum-easing-move"
  },
  "sys-motion-curve-standard": {
    "value": "var(--sys-momentum-easing-standard)",
    "type": "cubicBezier",
    "scope": "sys",
    "cssVariable": "--sys-motion-curve-standard",
    "reference": "sys-momentum-easing-standard",
    "cssReference": "--sys-momentum-easing-standard"
  },
  "sys-motion-curve-touch": {
    "value": "var(--sys-momentum-easing-touch)",
    "type": "cubicBezier",
    "scope": "sys",
    "cssVariable": "--sys-motion-curve-touch",
    "reference": "sys-momentum-easing-touch",
    "cssReference": "--sys-momentum-easing-touch"
  },
  "sys-radius-0": {
    "value": "var(--ref-frame-radius-0)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-0",
    "reference": "ref-frame-radius-0",
    "cssReference": "--ref-frame-radius-0"
  },
  "sys-radius-container": {
    "value": "var(--sys-frame-radius-container)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-container",
    "reference": "sys-frame-radius-container",
    "cssReference": "--sys-frame-radius-container"
  },
  "sys-radius-control": {
    "value": "var(--sys-frame-radius-control)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-control",
    "reference": "sys-frame-radius-control",
    "cssReference": "--sys-frame-radius-control"
  },
  "sys-radius-full": {
    "value": "var(--ref-frame-radius-full)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-full",
    "reference": "ref-frame-radius-full",
    "cssReference": "--ref-frame-radius-full"
  },
  "sys-radius-lg": {
    "value": "var(--ref-frame-radius-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-lg",
    "reference": "ref-frame-radius-5",
    "cssReference": "--ref-frame-radius-5"
  },
  "sys-radius-md": {
    "value": "var(--ref-frame-radius-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-md",
    "reference": "ref-frame-radius-3",
    "cssReference": "--ref-frame-radius-3"
  },
  "sys-radius-pill": {
    "value": "var(--sys-frame-radius-full)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-pill",
    "reference": "sys-frame-radius-full",
    "cssReference": "--sys-frame-radius-full"
  },
  "sys-radius-sm": {
    "value": "var(--ref-frame-radius-1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-sm",
    "reference": "ref-frame-radius-1",
    "cssReference": "--ref-frame-radius-1"
  },
  "sys-radius-surface": {
    "value": "var(--sys-frame-radius-surface)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-surface",
    "reference": "sys-frame-radius-surface",
    "cssReference": "--sys-frame-radius-surface"
  },
  "sys-radius-xl": {
    "value": "var(--ref-frame-radius-8)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-xl",
    "reference": "ref-frame-radius-8",
    "cssReference": "--ref-frame-radius-8"
  },
  "sys-radius-xs": {
    "value": "var(--ref-frame-radius-2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-radius-xs",
    "reference": "ref-frame-radius-2",
    "cssReference": "--ref-frame-radius-2"
  },
  "sys-research-confidence-high-color": {
    "value": "var(--sys-tone-confirm-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-confidence-high-color",
    "reference": "sys-tone-confirm-color",
    "cssReference": "--sys-tone-confirm-color"
  },
  "sys-research-confidence-low-color": {
    "value": "var(--sys-tone-urgent-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-confidence-low-color",
    "reference": "sys-tone-urgent-color",
    "cssReference": "--sys-tone-urgent-color"
  },
  "sys-research-confidence-medium-color": {
    "value": "var(--sys-tone-assistive-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-confidence-medium-color",
    "reference": "sys-tone-assistive-color",
    "cssReference": "--sys-tone-assistive-color"
  },
  "sys-research-context-color": {
    "value": "var(--sys-tone-neutral-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-context-color",
    "reference": "sys-tone-neutral-color",
    "cssReference": "--sys-tone-neutral-color"
  },
  "sys-research-decision-link-color": {
    "value": "var(--sys-tone-assistive-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-decision-link-color",
    "reference": "sys-tone-assistive-color",
    "cssReference": "--sys-tone-assistive-color"
  },
  "sys-research-evidence-color": {
    "value": "var(--sys-measurement-analytics-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-evidence-color",
    "reference": "sys-measurement-analytics-color",
    "cssReference": "--sys-measurement-analytics-color"
  },
  "sys-research-hypothesis-color": {
    "value": "var(--sys-measurement-hypothesis-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-hypothesis-color",
    "reference": "sys-measurement-hypothesis-color",
    "cssReference": "--sys-measurement-hypothesis-color"
  },
  "sys-research-question-font": {
    "value": "var(--sys-voice-family-title)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-research-question-font",
    "reference": "sys-voice-family-title",
    "cssReference": "--sys-voice-family-title"
  },
  "sys-research-question-weight": {
    "value": "var(--sys-tone-urgent-weight)",
    "type": "fontWeight",
    "scope": "sys",
    "cssVariable": "--sys-research-question-weight",
    "reference": "sys-tone-urgent-weight",
    "cssReference": "--sys-tone-urgent-weight"
  },
  "sys-research-readable-line-height": {
    "value": "var(--sys-a11y-readable-line-height)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-research-readable-line-height",
    "reference": "sys-a11y-readable-line-height",
    "cssReference": "--sys-a11y-readable-line-height"
  },
  "sys-research-risk-color": {
    "value": "var(--sys-measurement-guardrail-color)",
    "type": "color",
    "scope": "sys",
    "cssVariable": "--sys-research-risk-color",
    "reference": "sys-measurement-guardrail-color",
    "cssReference": "--sys-measurement-guardrail-color"
  },
  "sys-space-0": {
    "value": "var(--ref-frame-space-0)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-0",
    "reference": "ref-frame-space-0",
    "cssReference": "--ref-frame-space-0"
  },
  "sys-space-1": {
    "value": "var(--ref-frame-space-1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-1",
    "reference": "ref-frame-space-1",
    "cssReference": "--ref-frame-space-1"
  },
  "sys-space-10": {
    "value": "var(--ref-frame-space-10)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-10",
    "reference": "ref-frame-space-10",
    "cssReference": "--ref-frame-space-10"
  },
  "sys-space-11": {
    "value": "var(--ref-frame-space-11)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-11",
    "reference": "ref-frame-space-11",
    "cssReference": "--ref-frame-space-11"
  },
  "sys-space-12": {
    "value": "var(--ref-frame-space-12)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-12",
    "reference": "ref-frame-space-12",
    "cssReference": "--ref-frame-space-12"
  },
  "sys-space-16": {
    "value": "var(--ref-frame-space-16)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-16",
    "reference": "ref-frame-space-16",
    "cssReference": "--ref-frame-space-16"
  },
  "sys-space-2": {
    "value": "var(--ref-frame-space-2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-2",
    "reference": "ref-frame-space-2",
    "cssReference": "--ref-frame-space-2"
  },
  "sys-space-20": {
    "value": "var(--ref-frame-space-20)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-20",
    "reference": "ref-frame-space-20",
    "cssReference": "--ref-frame-space-20"
  },
  "sys-space-24": {
    "value": "var(--ref-frame-space-24)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-24",
    "reference": "ref-frame-space-24",
    "cssReference": "--ref-frame-space-24"
  },
  "sys-space-2xl": {
    "value": "var(--sys-space-8)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-2xl",
    "reference": "sys-space-8",
    "cssReference": "--sys-space-8"
  },
  "sys-space-2xs": {
    "value": "var(--ref-frame-space-micro)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-2xs",
    "reference": "ref-frame-space-micro",
    "cssReference": "--ref-frame-space-micro"
  },
  "sys-space-3": {
    "value": "var(--ref-frame-space-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-3",
    "reference": "ref-frame-space-3",
    "cssReference": "--ref-frame-space-3"
  },
  "sys-space-32": {
    "value": "var(--ref-frame-space-32)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-32",
    "reference": "ref-frame-space-32",
    "cssReference": "--ref-frame-space-32"
  },
  "sys-space-3xl": {
    "value": "var(--sys-space-10)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-3xl",
    "reference": "sys-space-10",
    "cssReference": "--sys-space-10"
  },
  "sys-space-4": {
    "value": "var(--ref-frame-space-4)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-4",
    "reference": "ref-frame-space-4",
    "cssReference": "--ref-frame-space-4"
  },
  "sys-space-40": {
    "value": "var(--ref-frame-space-40)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-40",
    "reference": "ref-frame-space-40",
    "cssReference": "--ref-frame-space-40"
  },
  "sys-space-4xl": {
    "value": "var(--sys-space-12)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-4xl",
    "reference": "sys-space-12",
    "cssReference": "--sys-space-12"
  },
  "sys-space-5": {
    "value": "var(--ref-frame-space-5)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-5",
    "reference": "ref-frame-space-5",
    "cssReference": "--ref-frame-space-5"
  },
  "sys-space-5xl": {
    "value": "var(--sys-space-16)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-5xl",
    "reference": "sys-space-16",
    "cssReference": "--sys-space-16"
  },
  "sys-space-6": {
    "value": "var(--ref-frame-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-6",
    "reference": "ref-frame-space-6",
    "cssReference": "--ref-frame-space-6"
  },
  "sys-space-7": {
    "value": "var(--ref-frame-space-7)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-7",
    "reference": "ref-frame-space-7",
    "cssReference": "--ref-frame-space-7"
  },
  "sys-space-8": {
    "value": "var(--ref-frame-space-8)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-8",
    "reference": "ref-frame-space-8",
    "cssReference": "--ref-frame-space-8"
  },
  "sys-space-9": {
    "value": "var(--ref-frame-space-9)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-9",
    "reference": "ref-frame-space-9",
    "cssReference": "--ref-frame-space-9"
  },
  "sys-space-lg": {
    "value": "var(--sys-space-4)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-lg",
    "reference": "sys-space-4",
    "cssReference": "--sys-space-4"
  },
  "sys-space-md": {
    "value": "var(--sys-space-3)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-md",
    "reference": "sys-space-3",
    "cssReference": "--sys-space-3"
  },
  "sys-space-micro": {
    "value": "var(--ref-frame-space-micro)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-micro",
    "reference": "ref-frame-space-micro",
    "cssReference": "--ref-frame-space-micro"
  },
  "sys-space-sm": {
    "value": "var(--sys-space-2)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-sm",
    "reference": "sys-space-2",
    "cssReference": "--sys-space-2"
  },
  "sys-space-xl": {
    "value": "var(--sys-space-6)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-xl",
    "reference": "sys-space-6",
    "cssReference": "--sys-space-6"
  },
  "sys-space-xs": {
    "value": "var(--sys-space-1)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-space-xs",
    "reference": "sys-space-1",
    "cssReference": "--sys-space-1"
  },
  "sys-spacing-component-lg": {
    "value": "var(--sys-frame-gap-component-lg)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-spacing-component-lg",
    "reference": "sys-frame-gap-component-lg",
    "cssReference": "--sys-frame-gap-component-lg"
  },
  "sys-spacing-component-md": {
    "value": "var(--sys-frame-gap-component)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-spacing-component-md",
    "reference": "sys-frame-gap-component",
    "cssReference": "--sys-frame-gap-component"
  },
  "sys-spacing-component-sm": {
    "value": "var(--sys-frame-gap-element)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-spacing-component-sm",
    "reference": "sys-frame-gap-element",
    "cssReference": "--sys-frame-gap-element"
  },
  "sys-spacing-inline-sm": {
    "value": "var(--sys-space-sm)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-spacing-inline-sm",
    "reference": "sys-space-sm",
    "cssReference": "--sys-space-sm"
  },
  "sys-spacing-inline-xs": {
    "value": "var(--sys-space-xs)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-spacing-inline-xs",
    "reference": "sys-space-xs",
    "cssReference": "--sys-space-xs"
  },
  "sys-spacing-page": {
    "value": "var(--sys-frame-gap-page)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-spacing-page",
    "reference": "sys-frame-gap-page",
    "cssReference": "--sys-frame-gap-page"
  },
  "sys-spacing-section": {
    "value": "var(--sys-frame-gap-section)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-spacing-section",
    "reference": "sys-frame-gap-section",
    "cssReference": "--sys-frame-gap-section"
  },
  "sys-font-body": {
    "value": "var(--sys-voice-family-body)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-font-body",
    "reference": "sys-voice-family-body",
    "cssReference": "--sys-voice-family-body"
  },
  "sys-font-icon": {
    "value": "var(--sys-icon-family)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-font-icon",
    "reference": "sys-icon-family",
    "cssReference": "--sys-icon-family"
  },
  "sys-font-mono": {
    "value": "var(--sys-voice-family-mono)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-font-mono",
    "reference": "sys-voice-family-mono",
    "cssReference": "--sys-voice-family-mono"
  },
  "sys-font-title": {
    "value": "var(--sys-voice-family-title)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-font-title",
    "reference": "sys-voice-family-title",
    "cssReference": "--sys-voice-family-title"
  },
  "sys-font-weight-regular": {
    "value": "var(--sys-voice-weight-regular)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-font-weight-regular",
    "reference": "sys-voice-weight-regular",
    "cssReference": "--sys-voice-weight-regular"
  },
  "sys-font-weight-semibold": {
    "value": "var(--sys-voice-weight-semibold)",
    "type": "fontFamily",
    "scope": "sys",
    "cssVariable": "--sys-font-weight-semibold",
    "reference": "sys-voice-weight-semibold",
    "cssReference": "--sys-voice-weight-semibold"
  },
  "sys-line-height-normal": {
    "value": "var(--sys-voice-line-height-normal)",
    "type": "dimension",
    "scope": "sys",
    "cssVariable": "--sys-line-height-normal",
    "reference": "sys-voice-line-height-normal",
    "cssReference": "--sys-voice-line-height-normal"
  }
} as const satisfies Record<FlowTokenName, FlowToken>;

export const flowTokenNames = [
  "density-card-padding",
  "density-component-gap",
  "density-component-gap-lg",
  "density-control-height",
  "density-control-padding-x",
  "density-control-padding-y",
  "density-doc-body-line-height",
  "density-doc-body-size",
  "density-doc-card-body-size",
  "density-doc-card-min-block",
  "density-doc-card-title-size",
  "density-doc-example-min-block",
  "density-doc-heading-line-height",
  "density-doc-heading-size",
  "density-doc-label-size",
  "density-doc-subheading-size",
  "density-page-gap",
  "density-panel-padding",
  "density-row-height",
  "density-section-gap",
  "density-subsection-gap",
  "density-surface-padding",
  "ref-a11y-contrast-aa",
  "ref-a11y-contrast-large",
  "ref-a11y-motion-reduced-duration",
  "ref-a11y-outline-reset",
  "ref-a11y-touch-target-min",
  "ref-depth-blur-lg",
  "ref-depth-blur-md",
  "ref-depth-blur-sm",
  "ref-depth-overlay-dark",
  "ref-depth-overlay-light",
  "ref-depth-shadow-color-rgb",
  "ref-depth-z-base",
  "ref-depth-z-dialog",
  "ref-depth-z-dropdown",
  "ref-depth-z-overlay",
  "ref-depth-z-sticky",
  "ref-depth-z-toast",
  "ref-energy-blue-100",
  "ref-energy-blue-200",
  "ref-energy-blue-300",
  "ref-energy-blue-400",
  "ref-energy-blue-50",
  "ref-energy-blue-500",
  "ref-energy-blue-600",
  "ref-energy-blue-700",
  "ref-energy-blue-800",
  "ref-energy-blue-900",
  "ref-energy-green-100",
  "ref-energy-green-200",
  "ref-energy-green-300",
  "ref-energy-green-400",
  "ref-energy-green-50",
  "ref-energy-green-500",
  "ref-energy-green-600",
  "ref-energy-green-700",
  "ref-energy-green-800",
  "ref-energy-green-900",
  "ref-energy-neutral-100",
  "ref-energy-neutral-200",
  "ref-energy-neutral-300",
  "ref-energy-neutral-400",
  "ref-energy-neutral-50",
  "ref-energy-neutral-500",
  "ref-energy-neutral-600",
  "ref-energy-neutral-700",
  "ref-energy-neutral-800",
  "ref-energy-neutral-900",
  "ref-energy-orange-100",
  "ref-energy-orange-200",
  "ref-energy-orange-300",
  "ref-energy-orange-400",
  "ref-energy-orange-50",
  "ref-energy-orange-500",
  "ref-energy-orange-600",
  "ref-energy-orange-700",
  "ref-energy-orange-800",
  "ref-energy-orange-900",
  "ref-energy-pink-100",
  "ref-energy-pink-200",
  "ref-energy-pink-300",
  "ref-energy-pink-400",
  "ref-energy-pink-50",
  "ref-energy-pink-500",
  "ref-energy-pink-600",
  "ref-energy-pink-700",
  "ref-energy-pink-800",
  "ref-energy-pink-900",
  "ref-energy-purple-100",
  "ref-energy-purple-200",
  "ref-energy-purple-300",
  "ref-energy-purple-400",
  "ref-energy-purple-50",
  "ref-energy-purple-500",
  "ref-energy-purple-600",
  "ref-energy-purple-700",
  "ref-energy-purple-800",
  "ref-energy-purple-900",
  "ref-energy-red-100",
  "ref-energy-red-200",
  "ref-energy-red-300",
  "ref-energy-red-400",
  "ref-energy-red-50",
  "ref-energy-red-500",
  "ref-energy-red-600",
  "ref-energy-red-700",
  "ref-energy-red-800",
  "ref-energy-red-900",
  "ref-energy-teal-100",
  "ref-energy-teal-200",
  "ref-energy-teal-300",
  "ref-energy-teal-400",
  "ref-energy-teal-50",
  "ref-energy-teal-500",
  "ref-energy-teal-600",
  "ref-energy-teal-700",
  "ref-energy-teal-800",
  "ref-energy-teal-900",
  "ref-energy-yellow-100",
  "ref-energy-yellow-200",
  "ref-energy-yellow-300",
  "ref-energy-yellow-400",
  "ref-energy-yellow-50",
  "ref-energy-yellow-500",
  "ref-energy-yellow-600",
  "ref-energy-yellow-700",
  "ref-energy-yellow-800",
  "ref-energy-yellow-900",
  "ref-frame-border-control",
  "ref-frame-border-indicator",
  "ref-frame-border-medium",
  "ref-frame-border-thin",
  "ref-frame-breakpoint-lg",
  "ref-frame-breakpoint-md",
  "ref-frame-breakpoint-shell-sidebar",
  "ref-frame-breakpoint-sm",
  "ref-frame-breakpoint-xl",
  "ref-frame-content-callout",
  "ref-frame-content-dialog",
  "ref-frame-content-drawer-lg",
  "ref-frame-content-drawer-md",
  "ref-frame-content-drawer-sm",
  "ref-frame-content-max",
  "ref-frame-content-narrow",
  "ref-frame-content-prose",
  "ref-frame-device-border-block",
  "ref-frame-device-border-block-sm",
  "ref-frame-device-border-inline",
  "ref-frame-device-border-inline-sm",
  "ref-frame-doc-badge-sm",
  "ref-frame-doc-col-bar",
  "ref-frame-doc-col-num",
  "ref-frame-doc-col-preview",
  "ref-frame-doc-col-token",
  "ref-frame-doc-col-token-lg",
  "ref-frame-doc-col-value-sm",
  "ref-frame-doc-demo-radius",
  "ref-frame-doc-grid-lg",
  "ref-frame-doc-grid-md",
  "ref-frame-doc-grid-sm",
  "ref-frame-grid-lg-columns",
  "ref-frame-grid-lg-gutter",
  "ref-frame-grid-lg-margin",
  "ref-frame-grid-lg-max-width",
  "ref-frame-grid-md-columns",
  "ref-frame-grid-md-gutter",
  "ref-frame-grid-md-margin",
  "ref-frame-grid-sm-columns",
  "ref-frame-grid-sm-gutter",
  "ref-frame-grid-sm-margin",
  "ref-frame-height-control-lg",
  "ref-frame-height-control-lg-comfortable",
  "ref-frame-height-control-lg-compact",
  "ref-frame-height-control-md",
  "ref-frame-height-control-md-comfortable",
  "ref-frame-height-control-md-compact",
  "ref-frame-height-control-sm",
  "ref-frame-height-control-sm-comfortable",
  "ref-frame-height-control-sm-compact",
  "ref-frame-height-control-xl",
  "ref-frame-height-control-xl-comfortable",
  "ref-frame-height-control-xl-compact",
  "ref-frame-radius-0",
  "ref-frame-radius-1",
  "ref-frame-radius-10",
  "ref-frame-radius-11",
  "ref-frame-radius-12",
  "ref-frame-radius-2",
  "ref-frame-radius-3",
  "ref-frame-radius-4",
  "ref-frame-radius-5",
  "ref-frame-radius-6",
  "ref-frame-radius-7",
  "ref-frame-radius-8",
  "ref-frame-radius-9",
  "ref-frame-radius-full",
  "ref-frame-sidebar-collapsed",
  "ref-frame-sidebar-expanded",
  "ref-frame-space-0",
  "ref-frame-space-1",
  "ref-frame-space-10",
  "ref-frame-space-11",
  "ref-frame-space-12",
  "ref-frame-space-16",
  "ref-frame-space-2",
  "ref-frame-space-20",
  "ref-frame-space-24",
  "ref-frame-space-3",
  "ref-frame-space-32",
  "ref-frame-space-4",
  "ref-frame-space-40",
  "ref-frame-space-5",
  "ref-frame-space-6",
  "ref-frame-space-7",
  "ref-frame-space-8",
  "ref-frame-space-9",
  "ref-frame-space-micro",
  "ref-growth-stage-deprecated",
  "ref-growth-stage-measured",
  "ref-growth-stage-seed",
  "ref-growth-stage-stable",
  "ref-momentum-duration-cycle",
  "ref-momentum-duration-enter",
  "ref-momentum-duration-fast",
  "ref-momentum-duration-instant",
  "ref-momentum-duration-loading",
  "ref-momentum-duration-normal",
  "ref-momentum-duration-press",
  "ref-momentum-duration-progress",
  "ref-momentum-duration-pulse",
  "ref-momentum-duration-reveal",
  "ref-momentum-duration-slow",
  "ref-momentum-duration-slower",
  "ref-momentum-duration-snappy",
  "ref-momentum-easing-enter",
  "ref-momentum-easing-exit",
  "ref-momentum-easing-linear",
  "ref-momentum-easing-move",
  "ref-momentum-easing-standard",
  "ref-momentum-easing-touch",
  "ref-momentum-lift-hover",
  "ref-momentum-scale-hover",
  "ref-momentum-scale-press",
  "ref-momentum-stagger-fast",
  "ref-momentum-stagger-normal",
  "ref-momentum-stagger-slow",
  "ref-state-focus-ring-offset",
  "ref-state-focus-ring-width",
  "ref-state-loading-spin",
  "ref-state-opacity-closed",
  "ref-state-opacity-disabled",
  "ref-state-opacity-faint",
  "ref-state-opacity-low",
  "ref-state-opacity-muted",
  "ref-state-opacity-soft",
  "ref-state-opacity-subtle",
  "ref-state-opacity-visible",
  "ref-state-overlay-hover",
  "ref-state-overlay-pressed",
  "ref-state-overlay-selected",
  "ref-state-precedence-disabled",
  "ref-state-precedence-error",
  "ref-state-precedence-focus",
  "ref-state-precedence-hover",
  "ref-state-precedence-loading",
  "ref-symbol-family-material",
  "ref-symbol-grid-base",
  "ref-symbol-live-area",
  "ref-symbol-size-display-md",
  "ref-symbol-size-display-sm",
  "ref-symbol-size-lg",
  "ref-symbol-size-lg-plus",
  "ref-symbol-size-marker",
  "ref-symbol-size-md",
  "ref-symbol-size-md-plus",
  "ref-symbol-size-sm",
  "ref-symbol-size-sm-plus",
  "ref-symbol-size-station",
  "ref-symbol-size-xl",
  "ref-symbol-size-xs",
  "ref-symbol-stroke",
  "ref-symbol-variation-filled",
  "ref-symbol-variation-filled-strong",
  "ref-symbol-variation-outline-strong",
  "ref-tone-weight-assistive",
  "ref-tone-weight-neutral",
  "ref-tone-weight-repair",
  "ref-tone-weight-urgent",
  "ref-voice-family-brand",
  "ref-voice-family-mono",
  "ref-voice-family-sans",
  "ref-voice-letter-spacing-caps",
  "ref-voice-letter-spacing-expanded",
  "ref-voice-letter-spacing-normal",
  "ref-voice-letter-spacing-snug",
  "ref-voice-letter-spacing-tight",
  "ref-voice-letter-spacing-tighter",
  "ref-voice-letter-spacing-wide",
  "ref-voice-letter-spacing-wider",
  "ref-voice-letter-spacing-widest",
  "ref-voice-line-height-balanced",
  "ref-voice-line-height-body",
  "ref-voice-line-height-comfortable",
  "ref-voice-line-height-compact",
  "ref-voice-line-height-crisp",
  "ref-voice-line-height-dense",
  "ref-voice-line-height-display",
  "ref-voice-line-height-loose",
  "ref-voice-line-height-none",
  "ref-voice-line-height-normal",
  "ref-voice-line-height-reading",
  "ref-voice-line-height-relaxed",
  "ref-voice-line-height-snug",
  "ref-voice-line-height-tight",
  "ref-voice-line-height-tightest",
  "ref-voice-size-1",
  "ref-voice-size-10",
  "ref-voice-size-11",
  "ref-voice-size-12",
  "ref-voice-size-13",
  "ref-voice-size-14",
  "ref-voice-size-2",
  "ref-voice-size-3",
  "ref-voice-size-4",
  "ref-voice-size-5",
  "ref-voice-size-6",
  "ref-voice-size-7",
  "ref-voice-size-8",
  "ref-voice-size-9",
  "ref-voice-weight-black",
  "ref-voice-weight-bold",
  "ref-voice-weight-extrabold",
  "ref-voice-weight-medium",
  "ref-voice-weight-regular",
  "ref-voice-weight-semibold",
  "sys-a11y-contrast-aa",
  "sys-a11y-contrast-surface",
  "sys-a11y-contrast-text",
  "sys-a11y-focus-offset",
  "sys-a11y-focus-ring",
  "sys-a11y-motion-duration",
  "sys-a11y-outline-reset",
  "sys-a11y-overlay-depth",
  "sys-a11y-readable-line-height",
  "sys-a11y-touch-target-min",
  "sys-accessibility-contrast-aa",
  "sys-accessibility-contrast-surface",
  "sys-accessibility-contrast-text",
  "sys-accessibility-focus-offset",
  "sys-accessibility-focus-ring",
  "sys-accessibility-motion-duration",
  "sys-accessibility-outline-reset",
  "sys-accessibility-overlay-depth",
  "sys-accessibility-readable-line-height",
  "sys-accessibility-touch-target-min",
  "sys-border-width-thin",
  "sys-breakpoint-desktop",
  "sys-breakpoint-laptop",
  "sys-breakpoint-mobile",
  "sys-breakpoint-tablet",
  "sys-breakpoint-wide",
  "sys-chart-axis-color",
  "sys-chart-empty-color",
  "sys-chart-focus-ring",
  "sys-chart-grid-color",
  "sys-chart-legend-text-color",
  "sys-chart-motion-duration-enter",
  "sys-chart-motion-duration-update",
  "sys-chart-motion-easing-enter",
  "sys-chart-motion-easing-update",
  "sys-chart-series-primary",
  "sys-chart-series-quaternary",
  "sys-chart-series-secondary",
  "sys-chart-series-tertiary",
  "sys-chart-summary-font",
  "sys-chart-summary-line-height",
  "sys-chart-threshold-danger",
  "sys-chart-threshold-warning",
  "sys-chart-tooltip-background",
  "sys-chart-tooltip-foreground",
  "sys-color-action",
  "sys-color-action-hover",
  "sys-color-action-text",
  "sys-color-border",
  "sys-color-border-strong",
  "sys-color-danger",
  "sys-color-focus",
  "sys-color-success",
  "sys-color-surface",
  "sys-color-surface-muted",
  "sys-color-surface-raised",
  "sys-color-text",
  "sys-color-text-muted",
  "sys-color-text-subtle",
  "sys-color-warning",
  "sys-density-card-padding",
  "sys-density-component-gap",
  "sys-density-component-gap-lg",
  "sys-density-control-height",
  "sys-density-control-padding-x",
  "sys-density-control-padding-y",
  "sys-density-doc-body-line-height",
  "sys-density-doc-body-size",
  "sys-density-doc-card-body-size",
  "sys-density-doc-card-min-block",
  "sys-density-doc-card-title-size",
  "sys-density-doc-example-min-block",
  "sys-density-doc-heading-line-height",
  "sys-density-doc-heading-size",
  "sys-density-doc-label-size",
  "sys-density-doc-subheading-size",
  "sys-density-page-gap",
  "sys-density-panel-padding",
  "sys-density-row-height",
  "sys-density-section-gap",
  "sys-density-subsection-gap",
  "sys-density-surface-padding",
  "sys-depth-backdrop-blur",
  "sys-depth-blur-lg",
  "sys-depth-blur-md",
  "sys-depth-blur-sm",
  "sys-depth-blur-topbar",
  "sys-depth-elevation-0",
  "sys-depth-elevation-1",
  "sys-depth-elevation-2",
  "sys-depth-elevation-3",
  "sys-depth-elevation-4",
  "sys-depth-lift-overlay",
  "sys-depth-lift-raised",
  "sys-depth-lift-rest",
  "sys-depth-lift-subtle",
  "sys-depth-overlay",
  "sys-depth-z-base",
  "sys-depth-z-dialog",
  "sys-depth-z-dropdown",
  "sys-depth-z-floating",
  "sys-depth-z-local-popover",
  "sys-depth-z-overlay",
  "sys-depth-z-raised",
  "sys-depth-z-sticky",
  "sys-depth-z-toast",
  "sys-depth-z-underlay",
  "sys-disabled-border-color",
  "sys-disabled-cursor",
  "sys-disabled-icon-color",
  "sys-disabled-opacity",
  "sys-disabled-pointer-events",
  "sys-disabled-readable-opacity",
  "sys-disabled-surface-opacity",
  "sys-disabled-text-color",
  "sys-duration-base",
  "sys-duration-cycle",
  "sys-duration-enter",
  "sys-duration-fast",
  "sys-duration-instant",
  "sys-duration-loading-cycle",
  "sys-duration-loading-spin",
  "sys-duration-medium",
  "sys-duration-overlay",
  "sys-duration-press",
  "sys-duration-progress",
  "sys-duration-pulse",
  "sys-duration-reveal",
  "sys-duration-sheet",
  "sys-duration-slow",
  "sys-duration-snappy",
  "sys-duration-touch",
  "sys-elevation-0",
  "sys-elevation-1",
  "sys-elevation-2",
  "sys-elevation-3",
  "sys-elevation-4",
  "sys-elevation-card",
  "sys-elevation-card-hover",
  "sys-elevation-control",
  "sys-elevation-floating",
  "sys-elevation-modal",
  "sys-elevation-popover",
  "sys-elevation-sheet",
  "sys-elevation-toast",
  "sys-email-border-width",
  "sys-email-color-accent",
  "sys-email-color-border",
  "sys-email-color-border-soft",
  "sys-email-color-danger",
  "sys-email-color-link",
  "sys-email-color-page",
  "sys-email-color-success",
  "sys-email-color-text-muted",
  "sys-email-color-text-primary",
  "sys-email-color-text-secondary",
  "sys-email-color-warning",
  "sys-email-color-white",
  "sys-email-content-width",
  "sys-email-font-family-body",
  "sys-email-font-family-fallback",
  "sys-email-font-family-mono",
  "sys-email-font-size-body",
  "sys-email-font-size-brand",
  "sys-email-font-size-code",
  "sys-email-font-size-code-label",
  "sys-email-font-size-headline",
  "sys-email-font-size-hidden",
  "sys-email-font-size-list",
  "sys-email-font-size-note",
  "sys-email-font-size-sm",
  "sys-email-font-size-step",
  "sys-email-font-size-transactional-headline",
  "sys-email-font-size-xs",
  "sys-email-letter-spacing-code",
  "sys-email-letter-spacing-eyebrow",
  "sys-email-letter-spacing-label",
  "sys-email-letter-spacing-tight",
  "sys-email-line-height-body",
  "sys-email-line-height-headline",
  "sys-email-line-height-hidden",
  "sys-email-line-height-note",
  "sys-email-line-height-transactional-headline",
  "sys-email-radius-card",
  "sys-email-radius-metric",
  "sys-email-radius-pill",
  "sys-email-space-2xl",
  "sys-email-space-3xl",
  "sys-email-space-4xl",
  "sys-email-space-5xl",
  "sys-email-space-6xl",
  "sys-email-space-7xl",
  "sys-email-space-lg",
  "sys-email-space-md",
  "sys-email-space-sm",
  "sys-email-space-xl",
  "sys-email-space-xs",
  "sys-email-space-xxs",
  "sys-energy-action-hover",
  "sys-energy-action-primary",
  "sys-energy-border-default",
  "sys-energy-border-strong",
  "sys-energy-status-error",
  "sys-energy-status-info",
  "sys-energy-status-success",
  "sys-energy-status-warning",
  "sys-energy-status-warning-foreground",
  "sys-energy-surface-accent",
  "sys-energy-surface-primary",
  "sys-energy-surface-secondary",
  "sys-energy-surface-sunken",
  "sys-energy-surface-tertiary",
  "sys-energy-text-on-action",
  "sys-energy-text-primary",
  "sys-energy-text-secondary",
  "sys-energy-text-tertiary",
  "sys-focus-restore-ring",
  "sys-focus-ring",
  "sys-focus-ring-offset",
  "sys-focus-roving-ring",
  "sys-focus-skip-target-offset",
  "sys-focus-trap-z-index",
  "sys-focus-visible-offset",
  "sys-focus-visible-ring",
  "sys-font-body",
  "sys-font-icon",
  "sys-font-mono",
  "sys-font-title",
  "sys-font-weight-regular",
  "sys-font-weight-semibold",
  "sys-frame-border-control",
  "sys-frame-border-indicator",
  "sys-frame-border-medium",
  "sys-frame-border-thin",
  "sys-frame-brand-logo-max",
  "sys-frame-brand-logo-min",
  "sys-frame-brand-logo-mobile-max",
  "sys-frame-brand-logo-mobile-min",
  "sys-frame-breakpoint-lg",
  "sys-frame-breakpoint-md",
  "sys-frame-breakpoint-shell-sidebar",
  "sys-frame-breakpoint-sm",
  "sys-frame-breakpoint-xl",
  "sys-frame-button-padding-x-lg",
  "sys-frame-button-padding-x-md",
  "sys-frame-button-padding-x-sm",
  "sys-frame-content-action-control-lg",
  "sys-frame-content-action-control-md",
  "sys-frame-content-action-control-sm",
  "sys-frame-content-action-label-lg",
  "sys-frame-content-action-label-md",
  "sys-frame-content-action-label-sm",
  "sys-frame-content-action-label-xl",
  "sys-frame-content-action-min-block-lg",
  "sys-frame-content-action-min-block-md",
  "sys-frame-content-action-min-inline-lg",
  "sys-frame-content-action-min-inline-md",
  "sys-frame-content-action-min-inline-sm",
  "sys-frame-content-callout",
  "sys-frame-content-card-chip-block-lg",
  "sys-frame-content-card-chip-block-md",
  "sys-frame-content-card-chip-block-sm",
  "sys-frame-content-card-chip-inline-lg",
  "sys-frame-content-card-chip-inline-md",
  "sys-frame-content-card-chip-inline-sm",
  "sys-frame-content-card-media-block",
  "sys-frame-content-code-slot-block-lg",
  "sys-frame-content-code-slot-block-md",
  "sys-frame-content-code-slot-block-sm",
  "sys-frame-content-code-slot-inline-lg",
  "sys-frame-content-code-slot-inline-md",
  "sys-frame-content-code-slot-inline-sm",
  "sys-frame-content-country-listbox-inline",
  "sys-frame-content-country-listbox-max-inline",
  "sys-frame-content-date-panel",
  "sys-frame-content-date-range-panel",
  "sys-frame-content-date-range-preset-min-block",
  "sys-frame-content-dialog",
  "sys-frame-content-disclosure-trigger-min-block-lg",
  "sys-frame-content-disclosure-trigger-min-block-md",
  "sys-frame-content-disclosure-trigger-min-block-sm",
  "sys-frame-content-drawer-lg",
  "sys-frame-content-drawer-md",
  "sys-frame-content-drawer-sm",
  "sys-frame-content-feedback-action-size",
  "sys-frame-content-hero-copy",
  "sys-frame-content-hero-visual",
  "sys-frame-content-inline-trigger-min-block-lg",
  "sys-frame-content-inline-trigger-min-block-md",
  "sys-frame-content-inline-trigger-min-block-sm",
  "sys-frame-content-map-pin-min-block-lg",
  "sys-frame-content-map-pin-min-block-md",
  "sys-frame-content-map-pin-min-block-sm",
  "sys-frame-content-max",
  "sys-frame-content-menu-max-block",
  "sys-frame-content-menu-min",
  "sys-frame-content-menu-min-lg",
  "sys-frame-content-menu-min-md",
  "sys-frame-content-menu-min-sm",
  "sys-frame-content-menu-wide",
  "sys-frame-content-metric-min-lg",
  "sys-frame-content-metric-min-md",
  "sys-frame-content-metric-min-sm",
  "sys-frame-content-metric-min-xs",
  "sys-frame-content-movement-icon-size",
  "sys-frame-content-movement-row-min-block-lg",
  "sys-frame-content-movement-row-min-block-md",
  "sys-frame-content-movement-row-min-block-sm",
  "sys-frame-content-narrow",
  "sys-frame-content-navigation-ellipsis-inline",
  "sys-frame-content-navigation-target-lg",
  "sys-frame-content-navigation-target-md",
  "sys-frame-content-navigation-target-sm",
  "sys-frame-content-option-min-block",
  "sys-frame-content-phone-input-flex-basis",
  "sys-frame-content-phone-input-flex-basis-compact",
  "sys-frame-content-phone-input-min-inline",
  "sys-frame-content-phone-input-min-inline-compact",
  "sys-frame-content-prose",
  "sys-frame-content-prose-wide",
  "sys-frame-content-search-min",
  "sys-frame-content-search-results-max-block",
  "sys-frame-content-segmented-control-inline",
  "sys-frame-content-skeleton-circle",
  "sys-frame-content-skeleton-row-leading",
  "sys-frame-content-step-marker-lg",
  "sys-frame-content-step-marker-md",
  "sys-frame-content-step-marker-sm",
  "sys-frame-content-step-text-max-inline",
  "sys-frame-content-step-text-min-inline",
  "sys-frame-content-tab-label-max",
  "sys-frame-content-table-expander",
  "sys-frame-content-tree-control-lg",
  "sys-frame-device-border-block",
  "sys-frame-device-border-block-sm",
  "sys-frame-device-border-inline",
  "sys-frame-device-border-inline-sm",
  "sys-frame-doc-card-grid-min",
  "sys-frame-doc-card-min-block-lg",
  "sys-frame-doc-card-min-block-md",
  "sys-frame-doc-device-min-block",
  "sys-frame-doc-device-width",
  "sys-frame-doc-dot",
  "sys-frame-doc-grid-lg",
  "sys-frame-doc-grid-md",
  "sys-frame-doc-grid-sm",
  "sys-frame-doc-icon-lg",
  "sys-frame-doc-icon-md",
  "sys-frame-doc-icon-sm",
  "sys-frame-doc-line",
  "sys-frame-doc-panel-min-lg",
  "sys-frame-doc-panel-min-md",
  "sys-frame-doc-panel-min-sm",
  "sys-frame-doc-panel-min-xl",
  "sys-frame-doc-pill-min-block",
  "sys-frame-doc-stage-inline",
  "sys-frame-doc-surface-max-inline",
  "sys-frame-doc-table-inline",
  "sys-frame-gap-component",
  "sys-frame-gap-component-lg",
  "sys-frame-gap-element",
  "sys-frame-gap-page",
  "sys-frame-gap-section",
  "sys-frame-gap-subsection",
  "sys-frame-gap-topnav-max",
  "sys-frame-gap-topnav-min",
  "sys-frame-grid-lg-columns",
  "sys-frame-grid-lg-gutter",
  "sys-frame-grid-lg-margin",
  "sys-frame-grid-lg-max-width",
  "sys-frame-grid-md-columns",
  "sys-frame-grid-md-gutter",
  "sys-frame-grid-md-margin",
  "sys-frame-grid-sm-columns",
  "sys-frame-grid-sm-gutter",
  "sys-frame-grid-sm-margin",
  "sys-frame-height-control-lg",
  "sys-frame-height-control-md",
  "sys-frame-height-control-sm",
  "sys-frame-height-shell-topbar",
  "sys-frame-height-shell-topbar-mobile",
  "sys-frame-max-width-control",
  "sys-frame-min-width-control",
  "sys-frame-padding-container",
  "sys-frame-padding-control",
  "sys-frame-padding-inset-s",
  "sys-frame-padding-surface",
  "sys-frame-position-center",
  "sys-frame-radius-container",
  "sys-frame-radius-control",
  "sys-frame-radius-full",
  "sys-frame-radius-md",
  "sys-frame-radius-sm",
  "sys-frame-radius-surface",
  "sys-frame-ratio-half",
  "sys-frame-sidebar-collapsed",
  "sys-frame-sidebar-expanded",
  "sys-frame-space-micro",
  "sys-frame-space-none",
  "sys-frame-template-desktop-inline-min",
  "sys-frame-template-desktop-inline-wide",
  "sys-frame-width-control",
  "sys-growth-event-font",
  "sys-growth-stage-deprecated-color",
  "sys-growth-stage-measured-color",
  "sys-growth-stage-seed-color",
  "sys-growth-stage-stable-color",
  "sys-icon-color-action",
  "sys-icon-color-danger",
  "sys-icon-color-disabled",
  "sys-icon-color-muted",
  "sys-icon-color-navigation",
  "sys-icon-color-status",
  "sys-icon-color-warning",
  "sys-icon-family",
  "sys-icon-focus-offset",
  "sys-icon-focus-ring",
  "sys-icon-size-display-md",
  "sys-icon-size-display-sm",
  "sys-icon-size-lg",
  "sys-icon-size-lg-plus",
  "sys-icon-size-marker",
  "sys-icon-size-md",
  "sys-icon-size-md-plus",
  "sys-icon-size-sm",
  "sys-icon-size-sm-plus",
  "sys-icon-size-station",
  "sys-icon-touch-target-min",
  "sys-icon-variation-filled",
  "sys-icon-variation-filled-strong",
  "sys-icon-variation-outline-strong",
  "sys-iconography-color-action",
  "sys-iconography-color-danger",
  "sys-iconography-color-disabled",
  "sys-iconography-color-muted",
  "sys-iconography-color-navigation",
  "sys-iconography-color-status",
  "sys-iconography-color-warning",
  "sys-iconography-family",
  "sys-iconography-focus-offset",
  "sys-iconography-focus-ring",
  "sys-iconography-size-display-md",
  "sys-iconography-size-display-sm",
  "sys-iconography-size-lg",
  "sys-iconography-size-lg-plus",
  "sys-iconography-size-marker",
  "sys-iconography-size-md",
  "sys-iconography-size-md-plus",
  "sys-iconography-size-sm",
  "sys-iconography-size-sm-plus",
  "sys-iconography-size-station",
  "sys-iconography-touch-target-min",
  "sys-iconography-variation-filled",
  "sys-iconography-variation-filled-strong",
  "sys-iconography-variation-outline-strong",
  "sys-line-height-normal",
  "sys-loading-busy-cursor",
  "sys-loading-cycle-duration",
  "sys-loading-easing-linear",
  "sys-loading-easing-rhythm",
  "sys-loading-progress-duration",
  "sys-loading-progress-fill",
  "sys-loading-progress-track",
  "sys-loading-pulse-duration",
  "sys-loading-skeleton-highlight",
  "sys-loading-skeleton-surface",
  "sys-loading-spin-duration",
  "sys-loading-spinner-tone",
  "sys-loading-spinner-track",
  "sys-loading-stale-opacity",
  "sys-map-depth-pin",
  "sys-map-depth-selected",
  "sys-map-fallback-surface",
  "sys-map-fallback-text-color",
  "sys-map-focus-ring",
  "sys-map-permission-denied-color",
  "sys-map-permission-granted-color",
  "sys-map-permission-prompt-color",
  "sys-map-pin-action-color",
  "sys-map-pin-background",
  "sys-map-pin-border",
  "sys-map-pin-cluster-background",
  "sys-map-pin-cluster-foreground",
  "sys-map-pin-foreground",
  "sys-map-pin-selected-background",
  "sys-map-pin-selected-foreground",
  "sys-map-route-line-color",
  "sys-map-route-line-muted-color",
  "sys-measurement-analytics-color",
  "sys-measurement-event-color",
  "sys-measurement-event-font",
  "sys-measurement-guardrail-background",
  "sys-measurement-guardrail-color",
  "sys-measurement-hypothesis-color",
  "sys-measurement-metric-color",
  "sys-measurement-metric-font",
  "sys-measurement-metric-weight",
  "sys-measurement-privacy-color",
  "sys-message-action-weight",
  "sys-message-alert-role",
  "sys-message-body-font",
  "sys-message-body-weight",
  "sys-message-focus-ring",
  "sys-message-intent-assistive-color",
  "sys-message-intent-danger-color",
  "sys-message-intent-neutral-color",
  "sys-message-intent-success-color",
  "sys-message-intent-warning-color",
  "sys-message-live-role",
  "sys-message-locale-max-inline-size",
  "sys-message-readable-line-height",
  "sys-message-recovery-weight",
  "sys-message-title-font",
  "sys-message-title-weight",
  "sys-momentum-cue-transform-active",
  "sys-momentum-cue-transform-enter",
  "sys-momentum-cue-transform-exit",
  "sys-momentum-cue-transform-idle",
  "sys-momentum-duration-critical",
  "sys-momentum-duration-cycle",
  "sys-momentum-duration-default",
  "sys-momentum-duration-enter",
  "sys-momentum-duration-fast",
  "sys-momentum-duration-instant",
  "sys-momentum-duration-loading-cycle",
  "sys-momentum-duration-loading-spin",
  "sys-momentum-duration-loop",
  "sys-momentum-duration-medium",
  "sys-momentum-duration-overlay",
  "sys-momentum-duration-press",
  "sys-momentum-duration-progress",
  "sys-momentum-duration-pulse",
  "sys-momentum-duration-reveal",
  "sys-momentum-duration-route",
  "sys-momentum-duration-sheet",
  "sys-momentum-duration-slow",
  "sys-momentum-duration-slower",
  "sys-momentum-duration-snappy",
  "sys-momentum-duration-touch",
  "sys-momentum-easing-enter",
  "sys-momentum-easing-exit",
  "sys-momentum-easing-linear",
  "sys-momentum-easing-move",
  "sys-momentum-easing-standard",
  "sys-momentum-easing-touch",
  "sys-momentum-lift-hover",
  "sys-momentum-progress-translate-end",
  "sys-momentum-progress-translate-mid",
  "sys-momentum-progress-translate-start",
  "sys-momentum-rotate-cycle",
  "sys-momentum-rotate-expanded",
  "sys-momentum-rotate-quarter",
  "sys-momentum-rotate-rest",
  "sys-momentum-rotate-tilt",
  "sys-momentum-scale-current-overshoot",
  "sys-momentum-scale-current-start",
  "sys-momentum-scale-enter",
  "sys-momentum-scale-hover",
  "sys-momentum-scale-none",
  "sys-momentum-scale-press",
  "sys-momentum-scale-quiet",
  "sys-momentum-scale-raised",
  "sys-momentum-scale-rest",
  "sys-momentum-scale-settle",
  "sys-momentum-stagger-chart",
  "sys-momentum-stagger-chart-compact",
  "sys-momentum-stagger-fast",
  "sys-momentum-stagger-normal",
  "sys-momentum-stagger-sequence-2",
  "sys-momentum-stagger-sequence-3",
  "sys-momentum-stagger-slow",
  "sys-momentum-transition-default",
  "sys-momentum-transition-fast",
  "sys-momentum-transition-slow",
  "sys-momentum-transition-touch",
  "sys-momentum-translate-inline-nudge",
  "sys-momentum-translate-rest",
  "sys-motion-curve-enter",
  "sys-motion-curve-exit",
  "sys-motion-curve-linear",
  "sys-motion-curve-move",
  "sys-motion-curve-standard",
  "sys-motion-curve-touch",
  "sys-radius-0",
  "sys-radius-container",
  "sys-radius-control",
  "sys-radius-full",
  "sys-radius-lg",
  "sys-radius-md",
  "sys-radius-pill",
  "sys-radius-sm",
  "sys-radius-surface",
  "sys-radius-xl",
  "sys-radius-xs",
  "sys-research-confidence-high-color",
  "sys-research-confidence-low-color",
  "sys-research-confidence-medium-color",
  "sys-research-context-color",
  "sys-research-decision-link-color",
  "sys-research-evidence-color",
  "sys-research-hypothesis-color",
  "sys-research-question-font",
  "sys-research-question-weight",
  "sys-research-readable-line-height",
  "sys-research-risk-color",
  "sys-space-0",
  "sys-space-1",
  "sys-space-10",
  "sys-space-11",
  "sys-space-12",
  "sys-space-16",
  "sys-space-2",
  "sys-space-20",
  "sys-space-24",
  "sys-space-2xl",
  "sys-space-2xs",
  "sys-space-3",
  "sys-space-32",
  "sys-space-3xl",
  "sys-space-4",
  "sys-space-40",
  "sys-space-4xl",
  "sys-space-5",
  "sys-space-5xl",
  "sys-space-6",
  "sys-space-7",
  "sys-space-8",
  "sys-space-9",
  "sys-space-lg",
  "sys-space-md",
  "sys-space-micro",
  "sys-space-sm",
  "sys-space-xl",
  "sys-space-xs",
  "sys-spacing-component-lg",
  "sys-spacing-component-md",
  "sys-spacing-component-sm",
  "sys-spacing-inline-sm",
  "sys-spacing-inline-xs",
  "sys-spacing-page",
  "sys-spacing-section",
  "sys-state-closed-opacity",
  "sys-state-disabled-opacity",
  "sys-state-disabled-readable-opacity",
  "sys-state-focus-offset",
  "sys-state-focus-ring",
  "sys-state-hidden-opacity",
  "sys-state-hover-overlay",
  "sys-state-loading-spin",
  "sys-state-muted-opacity",
  "sys-state-pressed-overlay",
  "sys-state-selected-overlay",
  "sys-state-visible-opacity",
  "sys-symbol-color-action",
  "sys-symbol-color-danger",
  "sys-symbol-color-muted",
  "sys-symbol-color-status",
  "sys-symbol-color-warning",
  "sys-symbol-family",
  "sys-symbol-size-display-md",
  "sys-symbol-size-display-sm",
  "sys-symbol-size-lg",
  "sys-symbol-size-lg-plus",
  "sys-symbol-size-marker",
  "sys-symbol-size-md",
  "sys-symbol-size-md-plus",
  "sys-symbol-size-sm",
  "sys-symbol-size-sm-plus",
  "sys-symbol-size-station",
  "sys-symbol-variation-filled",
  "sys-symbol-variation-filled-strong",
  "sys-symbol-variation-outline-strong",
  "sys-tone-assistive-color",
  "sys-tone-assistive-weight",
  "sys-tone-confirm-color",
  "sys-tone-neutral-color",
  "sys-tone-neutral-weight",
  "sys-tone-repair-color",
  "sys-tone-repair-weight",
  "sys-tone-urgent-color",
  "sys-tone-urgent-weight",
  "sys-touch-target-min",
  "sys-voice-caption-line-height",
  "sys-voice-caption-size",
  "sys-voice-code-line-height",
  "sys-voice-code-size",
  "sys-voice-code-sm-size",
  "sys-voice-display-lg-family",
  "sys-voice-display-lg-letter-spacing",
  "sys-voice-display-lg-line-height",
  "sys-voice-display-lg-size",
  "sys-voice-display-lg-weight",
  "sys-voice-display-md-family",
  "sys-voice-display-md-letter-spacing",
  "sys-voice-display-md-line-height",
  "sys-voice-display-md-size",
  "sys-voice-display-md-weight",
  "sys-voice-display-sm-family",
  "sys-voice-display-sm-letter-spacing",
  "sys-voice-display-sm-line-height",
  "sys-voice-display-sm-size",
  "sys-voice-display-sm-weight",
  "sys-voice-family",
  "sys-voice-family-body",
  "sys-voice-family-brand",
  "sys-voice-family-control",
  "sys-voice-family-mono",
  "sys-voice-family-title",
  "sys-voice-heading-lg-family",
  "sys-voice-heading-lg-letter-spacing",
  "sys-voice-heading-lg-line-height",
  "sys-voice-heading-lg-size",
  "sys-voice-heading-lg-weight",
  "sys-voice-heading-md-family",
  "sys-voice-heading-md-letter-spacing",
  "sys-voice-heading-md-line-height",
  "sys-voice-heading-md-size",
  "sys-voice-heading-md-weight",
  "sys-voice-heading-sm-family",
  "sys-voice-heading-sm-letter-spacing",
  "sys-voice-heading-sm-line-height",
  "sys-voice-heading-sm-size",
  "sys-voice-heading-sm-weight",
  "sys-voice-label-lg-line-height",
  "sys-voice-label-lg-size",
  "sys-voice-label-md-line-height",
  "sys-voice-label-md-size",
  "sys-voice-label-sm-line-height",
  "sys-voice-label-sm-size",
  "sys-voice-letter-spacing-caps",
  "sys-voice-letter-spacing-control",
  "sys-voice-letter-spacing-expanded",
  "sys-voice-letter-spacing-normal",
  "sys-voice-letter-spacing-snug",
  "sys-voice-letter-spacing-tight",
  "sys-voice-letter-spacing-wide",
  "sys-voice-letter-spacing-wider",
  "sys-voice-letter-spacing-widest",
  "sys-voice-line-height-balanced",
  "sys-voice-line-height-body",
  "sys-voice-line-height-body-sm",
  "sys-voice-line-height-comfortable",
  "sys-voice-line-height-compact",
  "sys-voice-line-height-control",
  "sys-voice-line-height-crisp",
  "sys-voice-line-height-dense",
  "sys-voice-line-height-display",
  "sys-voice-line-height-loose",
  "sys-voice-line-height-none",
  "sys-voice-line-height-normal",
  "sys-voice-line-height-reading",
  "sys-voice-line-height-relaxed",
  "sys-voice-line-height-snug",
  "sys-voice-line-height-tight",
  "sys-voice-line-height-tightest",
  "sys-voice-numeral-family",
  "sys-voice-numeral-lg-size",
  "sys-voice-numeral-line-height",
  "sys-voice-numeral-weight",
  "sys-voice-overline-line-height",
  "sys-voice-overline-size",
  "sys-voice-paragraph-lg-line-height",
  "sys-voice-paragraph-lg-size",
  "sys-voice-paragraph-md-line-height",
  "sys-voice-paragraph-md-size",
  "sys-voice-paragraph-sm-line-height",
  "sys-voice-paragraph-sm-size",
  "sys-voice-size-1",
  "sys-voice-size-10",
  "sys-voice-size-11",
  "sys-voice-size-12",
  "sys-voice-size-13",
  "sys-voice-size-14",
  "sys-voice-size-2",
  "sys-voice-size-3",
  "sys-voice-size-4",
  "sys-voice-size-5",
  "sys-voice-size-6",
  "sys-voice-size-7",
  "sys-voice-size-8",
  "sys-voice-size-9",
  "sys-voice-size-body",
  "sys-voice-size-body-sm",
  "sys-voice-size-caption",
  "sys-voice-size-label",
  "sys-voice-size-overline",
  "sys-voice-transform-none",
  "sys-voice-transform-uppercase",
  "sys-voice-weight-black",
  "sys-voice-weight-bold",
  "sys-voice-weight-control",
  "sys-voice-weight-extrabold",
  "sys-voice-weight-medium",
  "sys-voice-weight-regular",
  "sys-voice-weight-semibold"
] as const satisfies readonly FlowTokenName[];
