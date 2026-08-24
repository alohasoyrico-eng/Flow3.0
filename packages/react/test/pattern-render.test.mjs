import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ActionSheet } from "../dist/patterns/ActionSheet.js";
import { AccountOperations } from "../dist/patterns/AccountOperations.js";
import { AgentConversation } from "../dist/patterns/AgentConversation.js";
import { AdvancedFilters } from "../dist/patterns/AdvancedFilters.js";
import { AuthenticationLoginBiometricsAndOtp } from "../dist/patterns/AuthenticationLoginBiometricsAndOtp.js";
import { AvatarGroup } from "../dist/patterns/AvatarGroup.js";
import { AvatarMenu } from "../dist/patterns/AvatarMenu.js";
import { Autocomplete } from "../dist/patterns/Autocomplete.js";
import { BackofficeApproval } from "../dist/patterns/BackofficeApproval.js";
import { BulkActions } from "../dist/patterns/BulkActions.js";
import { CalendarView } from "../dist/patterns/CalendarView.js";
import { CaseManagement } from "../dist/patterns/CaseManagement.js";
import { ChartWrapper } from "../dist/patterns/ChartWrapper.js";
import { ColumnConfigurator } from "../dist/patterns/ColumnConfigurator.js";
import { CommandPalette } from "../dist/patterns/CommandPalette.js";
import { ConfirmationDialog } from "../dist/patterns/ConfirmationDialog.js";
import { DenseOperationalList } from "../dist/patterns/DenseOperationalList.js";
import { DragSortableList } from "../dist/patterns/DragSortableList.js";
import { DriverAndVehicleAdministration } from "../dist/patterns/DriverAndVehicleAdministration.js";
import { DriverOnboardingMobile } from "../dist/patterns/DriverOnboardingMobile.js";
import { DrawerAdapter } from "../dist/patterns/DrawerAdapter.js";
import { EmailTemplateLayout } from "../dist/patterns/EmailTemplateLayout.js";
import { ExpandableDetailTable } from "../dist/patterns/ExpandableDetailTable.js";
import { FileUpload } from "../dist/patterns/FileUpload.js";
import { FleetManagerOnboardingDesktop } from "../dist/patterns/FleetManagerOnboardingDesktop.js";
import { FilterChipGroup } from "../dist/patterns/FilterChipGroup.js";
import { FilterableEditableTable } from "../dist/patterns/FilterableEditableTable.js";
import { FormSection } from "../dist/patterns/FormSection.js";
import { FullscreenSheet } from "../dist/patterns/FullscreenSheet.js";
import { GanttChart } from "../dist/patterns/GanttChart.js";
import { HelpCenter } from "../dist/patterns/HelpCenter.js";
import { KanbanBoard } from "../dist/patterns/KanbanBoard.js";
import { KpiCard } from "../dist/patterns/KpiCard.js";
import { MultiSelect } from "../dist/patterns/MultiSelect.js";
import { MultiStepForm } from "../dist/patterns/MultiStepForm.js";
import { NotificationPanel } from "../dist/patterns/NotificationPanel.js";
import { PaymentForm } from "../dist/patterns/PaymentForm.js";
import { PolarChart } from "../dist/patterns/PolarChart.js";
import { PricingOperations } from "../dist/patterns/PricingOperations.js";
import { PreferenceManagement } from "../dist/patterns/PreferenceManagement.js";
import { PullToRefresh } from "../dist/patterns/PullToRefresh.js";
import { QuickActionsGrid } from "../dist/patterns/QuickActionsGrid.js";
import { RolesAndPermissions } from "../dist/patterns/RolesAndPermissions.js";
import { Search } from "../dist/patterns/Search.js";
import { SectionHeader } from "../dist/patterns/SectionHeader.js";
import { SelectOptionLayer } from "../dist/patterns/SelectOptionLayer.js";
import { Settings } from "../dist/patterns/Settings.js";
import { Sidebar } from "../dist/patterns/Sidebar.js";
import { SnackbarProvider } from "../dist/patterns/SnackbarProvider.js";
import { StationDiscovery } from "../dist/patterns/StationDiscovery.js";
import { StatusFeedbackView } from "../dist/patterns/StatusFeedbackView.js";
import { SwipeActions } from "../dist/patterns/SwipeActions.js";
import { TicketQueue } from "../dist/patterns/TicketQueue.js";
import { Timeline } from "../dist/patterns/Timeline.js";
import { Toolbar } from "../dist/patterns/Toolbar.js";
import { Topbar } from "../dist/patterns/Topbar.js";
import { TransferList } from "../dist/patterns/TransferList.js";
import { VirtualDataTable } from "../dist/patterns/VirtualDataTable.js";
import { WaterfallChart } from "../dist/patterns/WaterfallChart.js";
import { ConfigurationConsole } from "../dist/templates/ConfigurationConsole.js";

const groupedMarkup = renderToStaticMarkup(React.createElement(SelectOptionLayer, {
  label: "Vehicle",
  helper: "Choose the active unit",
  density: "sm",
  state: "open",
  value: "mx-4821",
  groups: [
    {
      label: "Available",
      options: [
        { label: "MX-4821", value: "mx-4821" },
        { label: "MX-8840", value: "mx-8840", unavailable: true, reason: "Maintenance" },
      ],
    },
  ],
  validation: {
    message: "Unavailable options keep an explicit reason.",
    state: "warning",
  },
  action: {
    label: "Refresh",
    variant: "secondary",
  },
  "data-product-hook": "select-option-layer",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(groupedMarkup, /data-flow-pattern="select-option-layer"/);
assert.match(groupedMarkup, /data-state="open"/);
assert.match(groupedMarkup, /data-density="sm"/);
assert.match(groupedMarkup, /data-product-hook="select-option-layer"/);
assert.match(groupedMarkup, /class="select-control/);
assert.match(groupedMarkup, /class="inline-validation/);
assert.match(groupedMarkup, /class="button button--secondary"/);
assert.match(groupedMarkup, /Maintenance/);
assert.doesNotMatch(groupedMarkup, /style=|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const emptyMarkup = renderToStaticMarkup(React.createElement(SelectOptionLayer, {
  label: "Vehicle",
  helper: "No vehicle matches the current filters.",
  options: [],
  empty: {
    title: "No vehicles",
    description: "Try a broader search.",
  },
}));

assert.match(emptyMarkup, /data-flow-pattern="select-option-layer"/);
assert.match(emptyMarkup, /data-has-options="false"/);
assert.match(emptyMarkup, /class="empty-state/);
assert.match(emptyMarkup, /No vehicles/);

const filterMarkup = renderToStaticMarkup(React.createElement(FilterChipGroup, {
  label: "Applied filters",
  density: "sm",
  resultCount: 12,
  overflowCount: 2,
  filters: [
    { key: "status", label: "Status: Active" },
    { key: "city", label: "City: CDMX", tone: "warning" },
  ],
  reset: { label: "Clear filters" },
  feedback: {
    label: "Filters updated",
    description: "12 results available",
    dismissible: true,
    dismissLabel: "Dismiss",
  },
  "data-product-hook": "filter-chip-group",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(filterMarkup, /data-flow-pattern="filter-chip-group"/);
assert.match(filterMarkup, /data-filter-count="2"/);
assert.match(filterMarkup, /class="badge/);
assert.match(filterMarkup, /class="chip/);
assert.match(filterMarkup, /class="button button--ghost"/);
assert.match(filterMarkup, /class="toast/);
assert.match(filterMarkup, /Remove Status: Active/);
assert.doesNotMatch(filterMarkup, /style=|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const emptyFilterMarkup = renderToStaticMarkup(React.createElement(FilterChipGroup, {
  filters: [],
  empty: {
    title: "No filters",
    description: "Apply filters from search.",
  },
}));

assert.match(emptyFilterMarkup, /data-flow-pattern="filter-chip-group"/);
assert.match(emptyFilterMarkup, /data-state="empty"/);
assert.match(emptyFilterMarkup, /class="empty-state/);

const avatarMarkup = renderToStaticMarkup(React.createElement(AvatarGroup, {
  label: "Dispatch team",
  density: "sm",
  maxVisible: 2,
  identities: [
    { key: "ana", name: "Ana Torres", status: "online", role: "Dispatcher" },
    { key: "leo", name: "Leo Marin", status: "busy", role: "Ops" },
    { key: "maya", name: "Maya Chen", status: "offline", role: "Support" },
  ],
  overflow: {
    triggerLabel: "View more people",
    title: "Dispatch team",
    description: "People assigned to this route.",
    open: true,
  },
  tooltip: {
    triggerLabel: "Team visibility",
    content: "Visible identities are available to this role.",
  },
  action: {
    label: "Manage",
  },
  validation: {
    message: "One identity is unavailable.",
    state: "warning",
  },
  "data-product-hook": "avatar-group",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(avatarMarkup, /data-flow-pattern="avatar-group"/);
assert.match(avatarMarkup, /data-avatar-count="3"/);
assert.match(avatarMarkup, /class="avatar/);
assert.match(avatarMarkup, /class="badge/);
assert.match(avatarMarkup, /class="popover/);
assert.match(avatarMarkup, /class="list/);
assert.match(avatarMarkup, /class="tooltip/);
assert.match(avatarMarkup, /class="button button--ghost"/);
assert.match(avatarMarkup, /class="inline-validation/);
assert.doesNotMatch(avatarMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const snackbarMarkup = renderToStaticMarkup(React.createElement(SnackbarProvider, {
  label: "Route notifications",
  density: "sm",
  maxVisible: 1,
  messages: [
    { key: "saved", label: "Route saved", tone: "success", actionLabel: "Undo" },
    { key: "sync", label: "Sync queued", description: "Will retry when online.", tone: "warning" },
  ],
  action: {
    label: "Dismiss all",
  },
  "data-product-hook": "snackbar-provider",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(snackbarMarkup, /data-flow-pattern="snackbar-provider"/);
assert.match(snackbarMarkup, /data-message-count="2"/);
assert.match(snackbarMarkup, /class="badge/);
assert.match(snackbarMarkup, /class="toast/);
assert.match(snackbarMarkup, /class="button button--ghost"/);
assert.doesNotMatch(snackbarMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const avatarMenuMarkup = renderToStaticMarkup(React.createElement(AvatarMenu, {
  name: "Ana Torres",
  status: "online",
  density: "sm",
  open: true,
  items: [
    { key: "profile", label: "Profile", icon: "person" },
    { key: "settings", label: "Settings", icon: "settings" },
    "divider",
    { key: "sign-out", label: "Sign out", tone: "danger" },
  ],
  "data-product-hook": "avatar-menu",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(avatarMenuMarkup, /data-flow-pattern="avatar-menu"/);
assert.match(avatarMenuMarkup, /data-state="open"/);
assert.match(avatarMenuMarkup, /data-action-count="3"/);
assert.match(avatarMenuMarkup, /class="avatar/);
assert.match(avatarMenuMarkup, /class="menu/);
assert.match(avatarMenuMarkup, /data-variant="avatar-trigger"/);
assert.match(avatarMenuMarkup, /role="menu"/);
assert.doesNotMatch(avatarMenuMarkup, /settings-panel|profile-form|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const avatarMenuLoadingMarkup = renderToStaticMarkup(React.createElement(AvatarMenu, {
  name: "Ana Torres",
  loading: true,
  items: [{ key: "profile", label: "Profile" }],
}));
assert.match(avatarMenuLoadingMarkup, /data-state="loading"/);
assert.match(avatarMenuLoadingMarkup, /aria-busy="true"/);

const avatarMenuPermissionMarkup = renderToStaticMarkup(React.createElement(AvatarMenu, {
  name: "Ana Torres",
  permissionBlocked: true,
  items: [{ key: "profile", label: "Profile" }],
}));
assert.match(avatarMenuPermissionMarkup, /data-state="permission-blocked"/);

const avatarMenuSigningOutMarkup = renderToStaticMarkup(React.createElement(AvatarMenu, {
  name: "Ana Torres",
  signingOut: true,
  items: [{ key: "sign-out", label: "Sign out" }],
}));
assert.match(avatarMenuSigningOutMarkup, /data-state="signing-out"/);

const autocompleteMarkup = renderToStaticMarkup(React.createElement(Autocomplete, {
  label: "Vehicle",
  helper: "Type to choose a vehicle",
  density: "sm",
  state: "suggesting",
  value: "mx-4821",
  selectedKey: "mx-4821",
  suggestions: [
    { key: "mx-4821", label: "MX-4821", meta: "Active" },
    { key: "mx-8840", label: "MX-8840", meta: "Maintenance", disabled: true },
  ],
  validation: {
    message: "Selection is required.",
    state: "warning",
  },
  "data-product-hook": "autocomplete",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(autocompleteMarkup, /data-flow-pattern="autocomplete"/);
assert.match(autocompleteMarkup, /data-suggestion-count="2"/);
assert.match(autocompleteMarkup, /class="combobox/);
assert.match(autocompleteMarkup, /class="list/);
assert.match(autocompleteMarkup, /class="inline-validation/);
assert.doesNotMatch(autocompleteMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const autocompleteLoadingMarkup = renderToStaticMarkup(React.createElement(Autocomplete, {
  label: "Vehicle",
  loading: true,
  suggestions: [{ label: "MX-4821", value: "mx-4821" }],
}));
assert.match(autocompleteLoadingMarkup, /class="skeleton/);

const autocompleteEmptyMarkup = renderToStaticMarkup(React.createElement(Autocomplete, {
  label: "Vehicle",
  suggestions: [],
  empty: { title: "No vehicles" },
}));
assert.match(autocompleteEmptyMarkup, /class="empty-state/);

const authMarkup = renderToStaticMarkup(React.createElement(AuthenticationLoginBiometricsAndOtp, {
  label: "Secure sign in",
  description: "Verify with a trusted channel.",
  density: "sm",
  otpSent: true,
  credential: { label: "Email", value: "ana@example.com" },
  phone: { label: "Phone number", value: "5551234567", country: "MX" },
  otp: { label: "Security code", value: "123456", length: 6 },
  biometric: { label: "Use device biometrics", fallback: "Use code instead" },
  validation: { message: "Code sent to trusted channel.", state: "info" },
  primaryAction: { label: "Verify code" },
  secondaryAction: { label: "Use another method" },
  feedback: { label: "Security check ready", tone: "info" },
  "data-product-hook": "auth-login",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(authMarkup, /data-flow-pattern="authentication-login-biometrics-and-otp"/);
assert.match(authMarkup, /data-state="otp-sent"/);
assert.match(authMarkup, /data-has-otp="true"/);
assert.match(authMarkup, /data-has-biometric="true"/);
assert.match(authMarkup, /data-product-hook="auth-login"/);
assert.match(authMarkup, /data-flow-primitive="surface"/);
assert.match(authMarkup, /data-authentication-login-surface="true"/);
assert.match(authMarkup, /class="input/);
assert.match(authMarkup, /phone-input/);
assert.match(authMarkup, /class="inline-validation/);
assert.match(authMarkup, /class="code-input/);
assert.match(authMarkup, /class="biometric-prompt/);
assert.match(authMarkup, /class="button button--primary"/);
assert.match(authMarkup, /class="toast/);
assert.doesNotMatch(authMarkup, /auth-provider|oauth|mfa-policy|route-after-login|custom-otp|fake-biometric|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const authSubmittingMarkup = renderToStaticMarkup(React.createElement(AuthenticationLoginBiometricsAndOtp, {
  submitting: true,
  phone: { label: "Phone number" },
}));
assert.match(authSubmittingMarkup, /data-state="submitting"/);
assert.match(authSubmittingMarkup, /aria-busy="true"/);

const authOtpInvalidMarkup = renderToStaticMarkup(React.createElement(AuthenticationLoginBiometricsAndOtp, {
  otpInvalid: true,
  phone: { label: "Phone number" },
  otp: { label: "Security code", value: "000000" },
}));
assert.match(authOtpInvalidMarkup, /data-state="otp-invalid"/);
assert.match(authOtpInvalidMarkup, /class="error-panel/);

const authBiometricMarkup = renderToStaticMarkup(React.createElement(AuthenticationLoginBiometricsAndOtp, {
  biometricPrompt: true,
  phone: { label: "Phone number" },
  biometric: { label: "Use biometrics" },
}));
assert.match(authBiometricMarkup, /data-state="biometric-prompt"/);
assert.match(authBiometricMarkup, /class="biometric-prompt/);

const authLockedMarkup = renderToStaticMarkup(React.createElement(AuthenticationLoginBiometricsAndOtp, {
  locked: true,
  phone: { label: "Phone number" },
}));
assert.match(authLockedMarkup, /data-state="locked"/);
assert.match(authLockedMarkup, /class="error-panel/);

const authRateLimitedMarkup = renderToStaticMarkup(React.createElement(AuthenticationLoginBiometricsAndOtp, {
  rateLimited: true,
  phone: { label: "Phone number" },
}));
assert.match(authRateLimitedMarkup, /data-state="rate-limited"/);
assert.match(authRateLimitedMarkup, /class="error-panel/);

const authRecoveredMarkup = renderToStaticMarkup(React.createElement(AuthenticationLoginBiometricsAndOtp, {
  recovered: true,
  phone: { label: "Phone number" },
  feedback: { label: "Access recovered", tone: "success" },
}));
assert.match(authRecoveredMarkup, /data-state="recovered"/);
assert.match(authRecoveredMarkup, /class="toast/);

const kpiMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  value: 96,
  unit: "%",
  delta: "+4%",
  trend: "up",
  tone: "success",
  density: "sm",
  status: { label: "Healthy", tone: "success" },
  tag: { label: "Live", tone: "info" },
  action: { label: "Review" },
  "data-product-hook": "kpi-card",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(kpiMarkup, /data-flow-pattern="kpi-card"/);
assert.match(kpiMarkup, /class="kpi-card"/);
assert.match(kpiMarkup, /class="kpi-tile/);
assert.match(kpiMarkup, /class="badge/);
assert.match(kpiMarkup, /class="tag/);
assert.match(kpiMarkup, /class="button button--ghost"/);
assert.doesNotMatch(kpiMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const kpiLoadingMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  loading: true,
}));
assert.match(kpiLoadingMarkup, /class="skeleton/);

const kpiErrorMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  state: "error",
  error: { label: "Metric unavailable", description: "Retry later." },
}));
assert.match(kpiErrorMarkup, /class="error-panel/);

const kpiEmptyMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  value: 96,
  state: "empty",
}));
assert.match(kpiEmptyMarkup, /data-state="empty"/);
assert.match(kpiEmptyMarkup, /class="empty-state/);
assert.doesNotMatch(kpiEmptyMarkup, /class="kpi-tile/);

const kpiPermissionMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  value: 96,
  state: "permission-blocked",
}));
assert.match(kpiPermissionMarkup, /data-state="permission-blocked"/);
assert.match(kpiPermissionMarkup, /data-variant="permission"/);
assert.doesNotMatch(kpiPermissionMarkup, /class="kpi-tile/);

const confirmationMarkup = renderToStaticMarkup(React.createElement(ConfirmationDialog, {
  label: "Delete route",
  description: "This action cannot be undone.",
  open: true,
  destructive: true,
  density: "sm",
  confirm: { label: "Delete" },
  cancel: { label: "Keep route" },
  validation: { message: "Review impacted assignments.", state: "warning" },
  recovery: {
    label: "Delete failed",
    description: "Try again later.",
    secondaryAction: { label: "View details" },
  },
  feedback: { label: "Route delete queued", actionLabel: "Undo" },
  "data-product-hook": "confirmation-dialog",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(confirmationMarkup, /data-flow-pattern="confirmation-dialog"/);
assert.match(confirmationMarkup, /class="dialog/);
assert.match(confirmationMarkup, /class="button/);
assert.match(confirmationMarkup, /class="inline-validation/);
assert.match(confirmationMarkup, /class="error-panel/);
assert.match(confirmationMarkup, /class="toast/);
assert.doesNotMatch(confirmationMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fileUploadMarkup = renderToStaticMarkup(React.createElement(FileUpload, {
  label: "Proof of delivery",
  description: "Upload a PDF or image.",
  density: "sm",
  state: "uploading",
  files: [
    { key: "pod", name: "pod.pdf", size: "1.2 MB", type: "PDF", status: "Uploading" },
  ],
  progress: { label: "Upload progress", value: 64, showValue: true },
  chooseAction: { label: "Choose file" },
  removeAction: { label: "Remove" },
  validation: { message: "PDF, PNG, or JPG only.", state: "warning" },
  feedback: { label: "Upload queued", description: "Processing file." },
  "data-product-hook": "file-upload",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(fileUploadMarkup, /data-flow-pattern="file-upload"/);
assert.match(fileUploadMarkup, /data-file-count="1"/);
assert.match(fileUploadMarkup, /data-flow-primitive="surface"/);
assert.match(fileUploadMarkup, /class="surface"/);
assert.match(fileUploadMarkup, /class="tag/);
assert.match(fileUploadMarkup, /class="progress/);
assert.match(fileUploadMarkup, /class="inline-validation/);
assert.match(fileUploadMarkup, /class="button button--secondary"/);
assert.match(fileUploadMarkup, /class="toast/);
assert.doesNotMatch(fileUploadMarkup, /type="file"|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fileUploadEmptyMarkup = renderToStaticMarkup(React.createElement(FileUpload, {
  label: "Proof of delivery",
  files: [],
  empty: { title: "No file selected", description: "Choose a file to continue." },
}));
assert.match(fileUploadEmptyMarkup, /data-flow-pattern="file-upload"/);
assert.match(fileUploadEmptyMarkup, /class="empty-state/);

const multiSelectMarkup = renderToStaticMarkup(React.createElement(MultiSelect, {
  label: "Regions",
  helper: "Choose every active service region.",
  density: "sm",
  open: true,
  value: ["north", "central"],
  options: [
    { label: "North", value: "north", meta: "12 routes" },
    { label: "Central", value: "central", meta: "8 routes" },
    { label: "South", value: "south", meta: "Unavailable", disabled: true },
  ],
  clearAction: { label: "Clear regions" },
  validation: { message: "At least one region is required.", state: "warning" },
  "data-product-hook": "multi-select",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(multiSelectMarkup, /data-flow-pattern="multi-select"/);
assert.match(multiSelectMarkup, /data-selected-count="2"/);
assert.match(multiSelectMarkup, /class="select-control/);
assert.match(multiSelectMarkup, /class="badge/);
assert.match(multiSelectMarkup, /class="choice checkbox/);
assert.match(multiSelectMarkup, /class="chip/);
assert.match(multiSelectMarkup, /class="button button--ghost"/);
assert.match(multiSelectMarkup, /class="inline-validation/);
assert.doesNotMatch(multiSelectMarkup, /data-multi-select-count|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const multiSelectEmptyMarkup = renderToStaticMarkup(React.createElement(MultiSelect, {
  label: "Regions",
  options: [],
  empty: { title: "No regions", description: "Try another account." },
}));
assert.match(multiSelectEmptyMarkup, /data-flow-pattern="multi-select"/);
assert.match(multiSelectEmptyMarkup, /class="empty-state/);

const formSectionMarkup = renderToStaticMarkup(React.createElement(FormSection, {
  title: "Driver profile",
  description: "Keep dispatch records current.",
  density: "sm",
  state: "dirty",
  fields: [
    { key: "name", label: "Driver name", value: "Ana Torres", required: true },
    { key: "notes", kind: "text-area", label: "Notes", value: "Prefers morning routes.", maxLength: 120 },
  ],
  primaryAction: { label: "Save profile" },
  secondaryAction: { label: "Cancel" },
  validation: { message: "Review required fields.", state: "warning", summary: "2 fields changed" },
  feedback: { label: "Profile saved", description: "Changes will sync shortly." },
  "data-product-hook": "form-section",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(formSectionMarkup, /data-flow-pattern="form-section"/);
assert.match(formSectionMarkup, /data-field-count="2"/);
assert.match(formSectionMarkup, /data-flow-primitive="surface"/);
assert.match(formSectionMarkup, /class="surface"/);
assert.match(formSectionMarkup, /class="input/);
assert.match(formSectionMarkup, /class="text-area/);
assert.match(formSectionMarkup, /class="inline-validation/);
assert.match(formSectionMarkup, /class="button button--primary"/);
assert.match(formSectionMarkup, /class="toast/);
assert.doesNotMatch(formSectionMarkup, /<form|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const rolesAndPermissionsMarkup = renderToStaticMarkup(React.createElement(RolesAndPermissions, {
  label: "Roles and permissions",
  description: "Review access before saving.",
  density: "sm",
  state: "dirty",
  roles: [
    { key: "admin", label: "Admin" },
    { key: "dispatcher", label: "Dispatcher" },
  ],
  permissions: [
    { key: "cards.view", label: "View cards", badge: "Cards", tone: "info" },
    { key: "drivers.suspend", label: "Suspend drivers", badge: "Drivers", tone: "warning", disabled: true, disabledReason: "Requires owner approval." },
  ],
  values: {
    admin: { "cards.view": true, "drivers.suspend": true },
    dispatcher: { "cards.view": true, "drivers.suspend": false },
  },
  validation: { message: "Owner approval required for risky permissions.", state: "warning" },
  audit: { label: "Last edited by Ana", description: "Permission matrix changed yesterday.", status: "verified" },
  confirmation: {
    label: "Confirm permission change",
    description: "This can affect operational access.",
    open: true,
    actions: [{ label: "Cancel", variant: "secondary" }, { label: "Apply", variant: "danger", intent: "danger" }],
  },
  actions: [{ label: "Save changes", variant: "primary" }],
  feedback: { label: "Permissions updated", tone: "success" },
  "data-product-hook": "roles-and-permissions",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(rolesAndPermissionsMarkup, /data-flow-pattern="roles-and-permissions"/);
assert.match(rolesAndPermissionsMarkup, /data-role-count="2"/);
assert.match(rolesAndPermissionsMarkup, /data-permission-count="2"/);
assert.match(rolesAndPermissionsMarkup, /class="table/);
assert.match(rolesAndPermissionsMarkup, /class="switch/);
assert.match(rolesAndPermissionsMarkup, /class="badge/);
assert.match(rolesAndPermissionsMarkup, /class="tooltip/);
assert.match(rolesAndPermissionsMarkup, /class="dialog/);
assert.match(rolesAndPermissionsMarkup, /class="inline-validation/);
assert.match(rolesAndPermissionsMarkup, /class="audit-event/);
assert.match(rolesAndPermissionsMarkup, /class="toast/);
assert.match(rolesAndPermissionsMarkup, /class="button button--primary"/);
assert.doesNotMatch(rolesAndPermissionsMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const virtualDataTableMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  description: "Operational fleet rows",
  density: "sm",
  virtualized: true,
  columns: [
    { key: "unit", label: "Unit", sortable: true },
    { key: "status", label: "Status" },
  ],
  rows: [
    { id: "mx-4821", unit: "MX-4821", status: "Active" },
    { id: "mx-8840", unit: "MX-8840", status: "Maintenance" },
  ],
  selectedKeys: ["mx-4821"],
  selection: { enabled: true, label: "Select vehicles" },
  bulkActions: [{ label: "Assign", variant: "secondary" }],
  page: 1,
  pageCount: 3,
  pagination: { label: "Vehicle pages" },
  "data-product-hook": "virtual-data-table",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(virtualDataTableMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(virtualDataTableMarkup, /data-row-count="2"/);
assert.match(virtualDataTableMarkup, /data-selected-count="1"/);
assert.match(virtualDataTableMarkup, /data-virtualized="true"/);
assert.match(virtualDataTableMarkup, /class="badge/);
assert.match(virtualDataTableMarkup, /class="table/);
assert.match(virtualDataTableMarkup, /class="choice checkbox/);
assert.match(virtualDataTableMarkup, /class="button button--secondary"/);
assert.match(virtualDataTableMarkup, /class="pagination/);
assert.doesNotMatch(virtualDataTableMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const virtualDataTableLoadingMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  loading: true,
  columns: [{ key: "unit", label: "Unit" }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
}));
assert.match(virtualDataTableLoadingMarkup, /data-state="loading"/);
assert.match(virtualDataTableLoadingMarkup, /class="skeleton/);

const virtualDataTableEmptyMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  columns: [{ key: "unit", label: "Unit" }],
  rows: [],
  empty: { title: "No vehicles", description: "Try a broader filter." },
}));
assert.match(virtualDataTableEmptyMarkup, /data-state="empty"/);
assert.match(virtualDataTableEmptyMarkup, /class="empty-state/);

const virtualDataTableErrorMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  columns: [{ key: "unit", label: "Unit" }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  error: { label: "Vehicles unavailable", description: "Retry later." },
}));
assert.match(virtualDataTableErrorMarkup, /data-state="error"/);
assert.match(virtualDataTableErrorMarkup, /class="error-panel/);

const searchMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  helper: "Search by unit or driver",
  density: "sm",
  query: "MX",
  scopes: [
    { label: "Vehicles", value: "vehicles" },
    { label: "Drivers", value: "drivers" },
  ],
  scopeValue: "vehicles",
  results: [
    { key: "mx-4821", label: "MX-4821", meta: "Active" },
    { key: "mx-8840", label: "MX-8840", meta: "Maintenance", disabled: true },
  ],
  selectedKey: "mx-4821",
  resultCount: 2,
  submitAction: { label: "Search" },
  clearAction: { label: "Clear" },
  validation: { message: "2 results available", state: "info", live: true },
  "data-product-hook": "search",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(searchMarkup, /data-flow-pattern="search"/);
assert.match(searchMarkup, /data-result-count="2"/);
assert.match(searchMarkup, /data-has-scope="true"/);
assert.match(searchMarkup, /class="field/);
assert.match(searchMarkup, /class="input/);
assert.match(searchMarkup, /class="select/);
assert.match(searchMarkup, /class="inline-validation/);
assert.match(searchMarkup, /class="list/);
assert.match(searchMarkup, /class="button button--primary"/);
assert.match(searchMarkup, /class="button button--ghost"/);
assert.doesNotMatch(searchMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-|data-flow-pattern="autocomplete"|class="combobox/i);

const searchEmptyMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  query: "ZZ",
  state: "results",
  results: [],
  empty: { title: "No vehicles", description: "Try another scope." },
}));
assert.match(searchEmptyMarkup, /data-state="empty"/);
assert.match(searchEmptyMarkup, /class="empty-state/);

const searchInvalidMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  query: "%",
  validation: { message: "Use at least two letters.", state: "error" },
}));
assert.match(searchInvalidMarkup, /data-state="invalid"/);
assert.match(searchInvalidMarkup, /aria-invalid="true"/);

const searchLoadingMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  query: "MX",
  loading: true,
  results: [{ key: "mx-4821", label: "MX-4821" }],
}));
assert.match(searchLoadingMarkup, /data-state="loading"/);
assert.match(searchLoadingMarkup, /class="spinner/);

const notificationPanelMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  density: "sm",
  open: true,
  notifications: [
    { key: "route", label: "Route delayed", description: "Driver is 8 minutes late.", unread: true },
    { key: "sync", label: "Sync complete", description: "Cards are up to date." },
  ],
  selectedKey: "route",
  markAllAction: { label: "Mark all read" },
  feedback: { label: "Notifications updated", tone: "success" },
  "data-product-hook": "notification-panel",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(notificationPanelMarkup, /data-flow-pattern="notification-panel"/);
assert.match(notificationPanelMarkup, /data-state="unread"/);
assert.match(notificationPanelMarkup, /data-notification-count="2"/);
assert.match(notificationPanelMarkup, /data-unread-count="1"/);
assert.match(notificationPanelMarkup, /class="drawer/);
assert.match(notificationPanelMarkup, /class="badge/);
assert.match(notificationPanelMarkup, /class="list/);
assert.match(notificationPanelMarkup, /class="button button--secondary"/);
assert.match(notificationPanelMarkup, /class="icon-button/);
assert.match(notificationPanelMarkup, /class="toast/);
assert.doesNotMatch(notificationPanelMarkup, /topbar|notification-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const notificationPanelEmptyMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  notifications: [],
  empty: { title: "No notifications" },
}));
assert.match(notificationPanelEmptyMarkup, /data-state="empty"/);
assert.match(notificationPanelEmptyMarkup, /class="empty-state/);

const notificationPanelPermissionMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  permissionBlocked: true,
  notifications: [{ key: "route", label: "Route delayed", unread: true }],
}));
assert.match(notificationPanelPermissionMarkup, /data-state="permission-blocked"/);
assert.match(notificationPanelPermissionMarkup, /class="empty-state/);

const notificationPanelErrorMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  error: { title: "Notifications unavailable", description: "Retry later." },
  notifications: [{ key: "route", label: "Route delayed", unread: true }],
}));
assert.match(notificationPanelErrorMarkup, /data-state="error"/);
assert.match(notificationPanelErrorMarkup, /class="empty-state/);

const pullToRefreshMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  label: "Route updates",
  description: "Refresh route feed without losing context.",
  density: "sm",
  state: "refreshing",
  progress: 45,
  list: { items: [{ key: "route", label: "Route delayed", meta: "Updated now" }] },
  cards: [{ title: "Fleet status", value: "Stale", detail: "Pull or press refresh." }],
  fallbackAction: { label: "Refresh now" },
  validation: { message: "Refresh status is announced.", state: "info" },
  feedback: { label: "Refreshing routes", tone: "info" },
  "data-product-hook": "pull-to-refresh",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(pullToRefreshMarkup, /data-flow-pattern="pull-to-refresh"/);
assert.match(pullToRefreshMarkup, /data-state="refreshing"/);
assert.match(pullToRefreshMarkup, /data-progress="45"/);
assert.match(pullToRefreshMarkup, /data-reduced-motion="false"/);
assert.match(pullToRefreshMarkup, /data-card-count="1"/);
assert.match(pullToRefreshMarkup, /data-product-hook="pull-to-refresh"/);
assert.match(pullToRefreshMarkup, /class="animated-moment/);
assert.match(pullToRefreshMarkup, /class="progress/);
assert.match(pullToRefreshMarkup, /class="button button--secondary"/);
assert.match(pullToRefreshMarkup, /data-flow-primitive="surface"/);
assert.match(pullToRefreshMarkup, /class="list/);
assert.match(pullToRefreshMarkup, /class="card/);
assert.match(pullToRefreshMarkup, /class="inline-validation/);
assert.match(pullToRefreshMarkup, /class="toast/);
assert.doesNotMatch(pullToRefreshMarkup, /touchstart|pointermove|translateY|fake-progress|gesture-only|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const pullToRefreshReducedMotionMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  reducedMotion: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Refresh" },
}));
assert.match(pullToRefreshReducedMotionMarkup, /data-state="reduced-motion"/);
assert.match(pullToRefreshReducedMotionMarkup, /data-reduced-motion="true"/);

const pullToRefreshErrorMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  error: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Retry" },
}));
assert.match(pullToRefreshErrorMarkup, /data-state="error"/);
assert.match(pullToRefreshErrorMarkup, /Refresh failed/);

const pullToRefreshCompleteMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  complete: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Refresh" },
}));
assert.match(pullToRefreshCompleteMarkup, /data-state="complete"/);

const pullToRefreshDisabledMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  disabled: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Refresh" },
}));
assert.match(pullToRefreshDisabledMarkup, /data-state="disabled"/);

const commandPaletteMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  density: "sm",
  open: true,
  query: "route",
  commands: [
    { key: "open-route", label: "Open route", icon: "route", shortcut: "R" },
    { key: "delete-route", label: "Delete route", tone: "danger", disabled: true, reason: "Requires owner approval" },
  ],
  primaryAction: { label: "Run command" },
  feedback: { label: "Command queued", tone: "success" },
  "data-product-hook": "command-palette",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(commandPaletteMarkup, /data-flow-pattern="command-palette"/);
assert.match(commandPaletteMarkup, /data-state="results"/);
assert.match(commandPaletteMarkup, /data-command-count="2"/);
assert.match(commandPaletteMarkup, /class="dialog/);
assert.match(commandPaletteMarkup, /class="field/);
assert.match(commandPaletteMarkup, /class="input/);
assert.match(commandPaletteMarkup, /class="menu/);
assert.match(commandPaletteMarkup, /class="button button--primary"/);
assert.match(commandPaletteMarkup, /class="toast/);
assert.doesNotMatch(commandPaletteMarkup, /topbar|data-flow-pattern="search"|class="combobox|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const commandPaletteEmptyMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  open: true,
  query: "missing",
  commands: [],
  empty: { title: "No commands" },
}));
assert.match(commandPaletteEmptyMarkup, /data-state="empty"/);
assert.match(commandPaletteEmptyMarkup, /class="empty-state/);

const commandPaletteLoadingMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  open: true,
  loading: true,
  commands: [{ key: "open-route", label: "Open route" }],
}));
assert.match(commandPaletteLoadingMarkup, /data-state="loading"/);
assert.match(commandPaletteLoadingMarkup, /class="spinner/);

const commandPaletteExecutingMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  open: true,
  executingKey: "open-route",
  commands: [{ key: "open-route", label: "Open route" }],
}));
assert.match(commandPaletteExecutingMarkup, /data-state="executing"/);

const settingsMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  description: "Reusable preferences only.",
  density: "sm",
  dirty: true,
  summary: { title: "Preferences", value: "3", detail: "Reusable settings groups" },
  groups: [
    {
      key: "profile",
      title: "Profile",
      description: "Visible account preferences.",
      controls: [
        { key: "name", label: "Display name", value: "Ana Torres" },
        { key: "timezone", kind: "select", label: "Timezone", value: "mx", options: [{ label: "Mexico City", value: "mx" }] },
        { key: "alerts", kind: "switch", label: "Operational alerts", checked: true },
      ],
    },
  ],
  confirmation: {
    label: "Reset settings",
    description: "This restores defaults.",
    open: true,
    actions: [{ key: "cancel", label: "Cancel" }, { key: "reset", label: "Reset", variant: "danger", intent: "danger" }],
  },
  saveAction: { label: "Save settings" },
  resetAction: { label: "Reset" },
  feedback: { label: "Settings saved", tone: "success" },
  "data-product-hook": "settings",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(settingsMarkup, /data-flow-pattern="settings"/);
assert.match(settingsMarkup, /data-state="dirty"/);
assert.match(settingsMarkup, /data-group-count="1"/);
assert.match(settingsMarkup, /data-control-count="3"/);
assert.match(settingsMarkup, /data-flow-primitive="surface"/);
assert.match(settingsMarkup, /data-settings-group="profile"/);
assert.match(settingsMarkup, /class="card/);
assert.match(settingsMarkup, /class="input/);
assert.match(settingsMarkup, /class="select/);
assert.match(settingsMarkup, /class="switch/);
assert.match(settingsMarkup, /class="dialog/);
assert.match(settingsMarkup, /class="button button--primary"/);
assert.match(settingsMarkup, /class="toast/);
assert.doesNotMatch(settingsMarkup, /admin-template|business-admin|<form|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const settingsInvalidMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  dirty: true,
  validation: { message: "Review required preferences.", state: "error" },
  groups: [{ title: "Profile", controls: [{ label: "Display name", error: "Required" }] }],
}));
assert.match(settingsInvalidMarkup, /data-state="invalid"/);
assert.match(settingsInvalidMarkup, /class="toast/);

const settingsSavingMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  saving: true,
  dirty: true,
  saveAction: { label: "Save settings" },
  groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }],
}));
assert.match(settingsSavingMarkup, /data-state="saving"/);
assert.match(settingsSavingMarkup, /aria-busy="true"/);

const settingsPermissionMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  permissionBlocked: true,
  groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }],
}));
assert.match(settingsPermissionMarkup, /data-state="permission-blocked"/);
assert.match(settingsPermissionMarkup, /data-flow-primitive="surface"/);

const preferenceManagementMarkup = renderToStaticMarkup(React.createElement(PreferenceManagement, {
  label: "Workspace preferences",
  description: "Governed settings flow.",
  density: "sm",
  dirty: true,
  summary: { label: "Unsaved" },
  settings: {
    label: "Notification preferences",
    dirty: true,
    groups: [{
      key: "notifications",
      title: "Notifications",
      description: "Channel preferences.",
      controls: [
        { key: "email", label: "Email updates", kind: "switch", checked: true },
        { key: "timezone", label: "Timezone", kind: "select", value: "mx", options: [{ label: "Mexico City", value: "mx" }] },
      ],
    }],
    saveAction: { label: "Save preferences" },
    resetAction: { label: "Reset preferences" },
  },
  sections: [{
    key: "profile-copy",
    title: "Profile copy",
    description: "Visible preference content.",
    state: "dirty",
    fields: [{ key: "display-name", label: "Display name", value: "Ana Torres" }],
    primaryAction: { key: "save-profile", label: "Save profile" },
  }],
  dangerZone: {
    label: "Delete workspace",
    description: "This cannot be undone.",
    open: true,
    confirm: { key: "delete", label: "Delete workspace" },
    cancel: { key: "cancel", label: "Keep workspace" },
  },
  "data-product-hook": "preference-management",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(preferenceManagementMarkup, /data-flow-pattern="preference-management"/);
assert.match(preferenceManagementMarkup, /data-flow-slot="preferenceSurface"/);
assert.match(preferenceManagementMarkup, /data-preference-state="danger-confirming"/);
assert.match(preferenceManagementMarkup, /data-settings-group-count="1"/);
assert.match(preferenceManagementMarkup, /data-form-section-count="1"/);
assert.match(preferenceManagementMarkup, /data-control-count="3"/);
assert.match(preferenceManagementMarkup, /data-flow-slot="preferenceSummary"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern-boundary="settings"/);
assert.match(preferenceManagementMarkup, /data-flow-slot="preferenceBlocks"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern-boundary="form-section"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern-boundary="confirmation-dialog"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern="settings"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern="form-section"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern="confirmation-dialog"/);
assert.match(preferenceManagementMarkup, /data-flow-primitive="surface"/);
assert.match(preferenceManagementMarkup, /class="badge/);
assert.doesNotMatch(preferenceManagementMarkup, /preference-card|danger-zone-card|custom-modal|custom-overlay|fake-field|<form|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const accountOperationsMarkup = renderToStaticMarkup(React.createElement(AccountOperations, {
  label: "Account operations",
  description: "Review account state and audit history.",
  density: "sm",
  selectedAccountKey: "acct-1",
  detailOpen: true,
  summaries: [
    { key: "active", label: "24 active accounts" },
    { key: "review", label: "3 need review", tone: "warning" },
  ],
  accounts: {
    label: "Accounts",
    search: { label: "Account search", query: "acme" },
    filters: [{ key: "status", label: "Status: active" }],
    toolbar: { actions: [{ key: "export", label: "Export" }] },
    bulkActions: { actions: [{ key: "suspend", label: "Suspend" }] },
    table: {
      columns: [{ key: "name", label: "Name" }, { key: "status", label: "Status" }],
      rows: [{ id: "acct-1", name: "Acme", status: "Active" }],
      rowKey: "id",
    },
  },
  detail: {
    label: "Account detail",
    open: true,
    drawer: { triggerLabel: "Open account detail", closeLabel: "Close account detail" },
    list: { label: "Account fields", items: [{ key: "owner", label: "Owner", value: "Ana" }] },
    actions: [{ key: "review", label: "Review account" }],
  },
  timeline: {
    label: "Account audit",
    filtered: true,
    filters: [{ key: "risk", label: "Risk: high" }],
    events: [{ key: "evt-1", label: "Risk reviewed", status: "warning", timestamp: "2026-08-10" }],
  },
  "data-product-hook": "account-operations",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(accountOperationsMarkup, /data-flow-pattern="account-operations"/);
assert.match(accountOperationsMarkup, /data-flow-slot="accountOperationsSurface"/);
assert.match(accountOperationsMarkup, /data-account-operations-state="detail-open"/);
assert.match(accountOperationsMarkup, /data-summary-count="2"/);
assert.match(accountOperationsMarkup, /data-account-row-count="1"/);
assert.match(accountOperationsMarkup, /data-audit-event-count="1"/);
assert.match(accountOperationsMarkup, /data-flow-slot="operationsSummary"/);
assert.match(accountOperationsMarkup, /data-flow-slot="operationsMetric"/);
assert.match(accountOperationsMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(accountOperationsMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(accountOperationsMarkup, /data-flow-pattern-boundary="timeline"/);
assert.match(accountOperationsMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(accountOperationsMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(accountOperationsMarkup, /data-flow-pattern="timeline"/);
assert.match(accountOperationsMarkup, /data-flow-primitive="surface"/);
assert.match(accountOperationsMarkup, /class="badge/);
assert.doesNotMatch(accountOperationsMarkup, /account-card|account-row-card|custom-drawer|custom-timeline|internal-tools-local|account-table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const ticketQueueMarkup = renderToStaticMarkup(React.createElement(TicketQueue, {
  label: "Ticket queue",
  description: "Triage support tickets.",
  density: "sm",
  selectedTicketKey: "ticket-1",
  detailOpen: true,
  summaries: [{ key: "sla", label: "2 SLA risks", tone: "warning" }],
  alerts: {
    label: "Ticket alerts",
    open: true,
    notifications: [{ key: "alert-1", label: "New urgent ticket", unread: true }],
    markAllAction: { label: "Mark alerts read" },
  },
  tickets: {
    label: "Tickets",
    search: { label: "Ticket search", query: "refund" },
    filters: [{ key: "priority", label: "Priority: high" }],
    toolbar: { actions: [{ key: "assign", label: "Assign" }] },
    bulkActions: { actions: [{ key: "close", label: "Close tickets" }] },
    table: {
      columns: [{ key: "subject", label: "Subject" }, { key: "priority", label: "Priority" }],
      rows: [{ id: "ticket-1", subject: "Refund issue", priority: "High" }],
      rowKey: "id",
    },
  },
  detail: {
    label: "Ticket detail",
    open: true,
    drawer: { triggerLabel: "Open ticket detail", closeLabel: "Close ticket detail" },
    actions: [{ key: "assign", label: "Assign ticket" }],
  },
  feedback: {
    kind: "toast",
    label: "Queue updated",
    description: "Ticket assignment is synced.",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "ticket-queue",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(ticketQueueMarkup, /data-flow-pattern="ticket-queue"/);
assert.match(ticketQueueMarkup, /data-flow-slot="ticketQueueSurface"/);
assert.match(ticketQueueMarkup, /data-ticket-queue-state="detail-open"/);
assert.match(ticketQueueMarkup, /data-summary-count="1"/);
assert.match(ticketQueueMarkup, /data-ticket-row-count="1"/);
assert.match(ticketQueueMarkup, /data-alert-count="1"/);
assert.match(ticketQueueMarkup, /data-flow-slot="queueSummary"/);
assert.match(ticketQueueMarkup, /data-flow-slot="queueMetric"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="notification-panel"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="notification-panel"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(ticketQueueMarkup, /data-flow-primitive="surface"/);
assert.match(ticketQueueMarkup, /class="badge/);
assert.doesNotMatch(ticketQueueMarkup, /ticket-card|ticket-row-card|custom-ticket-list|custom-notification-list|custom-drawer|local-feedback|ticket-table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const caseManagementMarkup = renderToStaticMarkup(React.createElement(CaseManagement, {
  label: "Case management",
  description: "Review escalated cases.",
  density: "sm",
  selectedCaseKey: "case-1",
  detailOpen: true,
  summaries: [{ key: "sla", label: "4 escalations", tone: "warning" }],
  filters: {
    label: "Case filters",
    open: true,
    fields: [{ key: "owner", label: "Owner", value: "Ana" }],
    appliedFilters: [{ key: "priority", label: "Priority: high" }],
    drawer: { triggerLabel: "Open case filters", closeLabel: "Close case filters" },
    applyAction: { label: "Apply case filters" },
    resetAction: { label: "Reset case filters" },
  },
  cases: {
    label: "Cases",
    search: { label: "Case search", query: "refund" },
    filters: [{ key: "status", label: "Status: open" }],
    toolbar: { actions: [{ key: "assign", label: "Assign" }] },
    bulkActions: { actions: [{ key: "escalate", label: "Escalate" }] },
    table: {
      columns: [{ key: "subject", label: "Subject" }, { key: "priority", label: "Priority" }],
      rows: [{ id: "case-1", subject: "Refund escalation", priority: "High" }],
      rowKey: "id",
    },
  },
  detail: {
    label: "Case detail",
    open: true,
    drawer: { triggerLabel: "Open case detail", closeLabel: "Close case detail" },
    actions: [{ key: "resolve", label: "Resolve case" }],
  },
  timeline: {
    label: "Case activity",
    filtered: true,
    filters: [{ key: "owner", label: "Owner: Ana" }],
    events: [{ key: "evt-1", label: "Case escalated", status: "warning", timestamp: "2026-08-10" }],
  },
  feedback: {
    kind: "toast",
    label: "Case updated",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "case-management",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(caseManagementMarkup, /data-flow-pattern="case-management"/);
assert.match(caseManagementMarkup, /data-flow-slot="caseManagementSurface"/);
assert.match(caseManagementMarkup, /data-case-management-state="detail-open"/);
assert.match(caseManagementMarkup, /data-summary-count="1"/);
assert.match(caseManagementMarkup, /data-case-row-count="1"/);
assert.match(caseManagementMarkup, /data-activity-event-count="1"/);
assert.match(caseManagementMarkup, /data-flow-slot="caseSummary"/);
assert.match(caseManagementMarkup, /data-flow-slot="caseMetric"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="advanced-filters"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="timeline"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(caseManagementMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(caseManagementMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(caseManagementMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(caseManagementMarkup, /data-flow-pattern="timeline"/);
assert.match(caseManagementMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(caseManagementMarkup, /data-flow-primitive="surface"/);
assert.match(caseManagementMarkup, /class="badge/);
assert.doesNotMatch(caseManagementMarkup, /case-card|case-row-card|custom-case-filter|custom-activity-feed|custom-drawer|local-feedback|case-table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const filterableEditableTableMarkup = renderToStaticMarkup(React.createElement(FilterableEditableTable, {
  label: "Editable pricing table",
  description: "Review editable rows.",
  density: "sm",
  selectedRowKey: "price-1",
  editing: true,
  metrics: [{ key: "pending", label: "3 pending edits", tone: "warning" }],
  filters: {
    label: "Pricing filters",
    open: true,
    fields: [{ key: "region", label: "Region", value: "North" }],
    appliedFilters: [{ key: "status", label: "Status: draft" }],
    drawer: { triggerLabel: "Open pricing filters", closeLabel: "Close pricing filters" },
    applyAction: { label: "Apply pricing filters" },
    resetAction: { label: "Reset pricing filters" },
  },
  table: {
    label: "Pricing rows",
    columns: [{ key: "sku", label: "SKU" }, { key: "price", label: "Price" }],
    rows: [{ id: "price-1", sku: "FUEL-001", price: "$10.00" }],
    rowKey: "id",
    page: 1,
    pageCount: 2,
    bulkActions: [{ key: "approve", label: "Approve edits" }],
  },
  editor: {
    label: "Pricing editor",
    open: true,
    drawer: { triggerLabel: "Open pricing editor", closeLabel: "Close pricing editor" },
    actions: [{ key: "save", label: "Save edits" }],
  },
  feedback: {
    kind: "toast",
    label: "Edits saved",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "filterable-editable-table",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(filterableEditableTableMarkup, /data-flow-pattern="filterable-editable-table"/);
assert.match(filterableEditableTableMarkup, /data-flow-slot="filterableEditableTableSurface"/);
assert.match(filterableEditableTableMarkup, /data-filterable-editable-table-state="editing"/);
assert.match(filterableEditableTableMarkup, /data-row-count="1"/);
assert.match(filterableEditableTableMarkup, /data-filter-count="1"/);
assert.match(filterableEditableTableMarkup, /data-metric-count="1"/);
assert.match(filterableEditableTableMarkup, /data-flow-slot="tableSummary"/);
assert.match(filterableEditableTableMarkup, /data-flow-slot="tableMetric"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="advanced-filters"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="virtual-data-table"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(filterableEditableTableMarkup, /data-flow-primitive="surface"/);
assert.match(filterableEditableTableMarkup, /class="badge/);
assert.doesNotMatch(filterableEditableTableMarkup, /editable-card|editable-row-card|custom-edit-table|custom-filter-shell|custom-editor|local-feedback|table-local|inline-edit-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const pricingOperationsMarkup = renderToStaticMarkup(React.createElement(PricingOperations, {
  label: "Pricing operations",
  description: "Rate rules and approvals.",
  density: "sm",
  selectedRuleKey: "P-101",
  editorOpen: true,
  summaries: [{ key: "pending", label: "2 pending approvals", tone: "warning" }],
  rules: [
    { id: "P-101", name: "Base fare CDMX", scope: "City", type: "Base", value: "$10.50/km", status: "pending approval", by: "Pricing" },
    { id: "P-102", name: "Peak surcharge", scope: "Zone", type: "Surge", value: "x1.8", status: "active", by: "Ops" },
  ],
  rolePolicy: {
    mode: "checkbox",
    roles: [{ key: "pricing", label: "Pricing" }],
    permissions: [{ key: "approve", label: "Approve pricing", badge: "Approval" }],
    values: { pricing: { approve: true } },
  },
  queue: {
    filters: {
      label: "Pricing filters",
      appliedFilters: [{ key: "status", label: "Status: pending" }],
      resetAction: { label: "Reset pricing filters" },
    },
    table: {
      page: 1,
      pageCount: 2,
      pagination: { label: "Pricing pagination" },
    },
    editor: {
      label: "Pricing rule editor",
      open: true,
      drawer: { triggerLabel: "Open pricing editor", closeLabel: "Close pricing editor" },
      actions: [{ key: "submit-approval", label: "Submit for approval" }],
    },
  },
  feedback: {
    kind: "toast",
    label: "Pricing submitted",
    action: { key: "review", label: "Review queue" },
  },
  "data-product-hook": "pricing-operations",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(pricingOperationsMarkup, /data-flow-pattern="pricing-operations"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingOperationsSurface"/);
assert.match(pricingOperationsMarkup, /data-pricing-operations-state="editing"/);
assert.match(pricingOperationsMarkup, /data-rule-count="2"/);
assert.match(pricingOperationsMarkup, /data-pending-rule-count="1"/);
assert.match(pricingOperationsMarkup, /data-editor-open="true"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingSummary"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingMetric"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingPermissionBoundary"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingRulesBoundary"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingFeedbackBoundary"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="roles-and-permissions"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="advanced-filters"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="virtual-data-table"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="roles-and-permissions"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(pricingOperationsMarkup, /data-flow-primitive="surface"/);
assert.match(pricingOperationsMarkup, /class="badge/);
assert.doesNotMatch(pricingOperationsMarkup, /pricing-card|pricing-row-card|custom-pricing-table|custom-pricing-drawer|custom-role-guard|fake-approval|local-toast|table-local|class="card(?:\s|")|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const backofficeApprovalMarkup = renderToStaticMarkup(React.createElement(BackofficeApproval, {
  label: "Backoffice approval",
  description: "Document review queue.",
  density: "sm",
  selectedDocumentKey: "D-220",
  detailOpen: true,
  summaries: [{ key: "pending", label: "3 pending reviews", tone: "warning" }],
  documents: [
    { id: "D-220", who: "Diego Vera", doc: "Driver license", submitted: "1 day ago", status: "pending", file: "license.pdf" },
    { id: "D-221", who: "Ana Sosa", doc: "Insurance policy", submitted: "2 days ago", status: "approved", file: "policy.pdf" },
  ],
  queue: {
    search: { label: "Search documents", query: "license" },
    filters: [{ key: "status", label: "Status: pending" }],
    table: {
      page: 1,
      pageCount: 2,
      pagination: { label: "Document pagination" },
      bulkActions: [{ key: "approve", label: "Approve selected" }, { key: "reject", label: "Reject selected" }],
    },
  },
  detail: {
    label: "Document detail",
    open: true,
    drawer: { triggerLabel: "Open document detail", closeLabel: "Close document detail" },
    actions: [{ key: "reject", label: "Reject" }, { key: "approve", label: "Approve" }],
  },
  feedback: {
    kind: "toast",
    label: "Document approved",
    action: { key: "review", label: "Review next" },
  },
  "data-product-hook": "backoffice-approval",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(backofficeApprovalMarkup, /data-flow-pattern="backoffice-approval"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="backofficeApprovalSurface"/);
assert.match(backofficeApprovalMarkup, /data-backoffice-approval-state="detail-open"/);
assert.match(backofficeApprovalMarkup, /data-document-count="2"/);
assert.match(backofficeApprovalMarkup, /data-pending-document-count="1"/);
assert.match(backofficeApprovalMarkup, /data-detail-open="true"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalSummary"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalMetric"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalQueueBoundary"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalDetailBoundary"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalFeedbackBoundary"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(backofficeApprovalMarkup, /data-flow-primitive="surface"/);
assert.match(backofficeApprovalMarkup, /class="badge/);
assert.doesNotMatch(backofficeApprovalMarkup, /document-card|approval-card|custom-document-table|custom-approval-drawer|custom-role-guard|fake-approval|local-toast|table-local|class="card(?:\s|")|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const emailVariants = ["base", "transactional", "operational-summary", "security-alert", "team-invite", "welcome"];
const emailTemplateMarkup = emailVariants.map((variant) => renderToStaticMarkup(React.createElement(EmailTemplateLayout, {
  variant,
  title: variant === "base" ? "Flow base mailing" : undefined,
  preheader: variant === "base" ? "Base preheader" : undefined,
  action: variant === "base" ? { label: "Open Flow", href: "https://flow.example" } : undefined,
  "data-product-hook": "email-template-layout",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}))).join("\n");

assert.match(emailTemplateMarkup, /data-flow-pattern="email-template-layout"/);
assert.match(emailTemplateMarkup, /data-flow-channel="email"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="base"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="transactional"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="operational-summary"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="security-alert"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="team-invite"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="welcome"/);
assert.match(emailTemplateMarkup, /role="presentation"/);
assert.match(emailTemplateMarkup, /class="flow-container"/);
assert.match(emailTemplateMarkup, /class="flow-px"/);
assert.match(emailTemplateMarkup, /display:inline-block/);
assert.match(emailTemplateMarkup, /href="https:\/\/flow\.example"/);
assert.match(emailTemplateMarkup, /482 917/);
assert.match(emailTemplateMarkup, /Ver dashboard completo/);
assert.match(emailTemplateMarkup, /Aceptar invitación/);
assert.match(emailTemplateMarkup, /Abrir Flow/);
assert.doesNotMatch(emailTemplateMarkup, /class="(?:button|card|table|toast|dialog|drawer|surface)(?:\s|")|data-flow-primitive="surface"|data-flow-pattern="status-feedback-view"|<script|display:flex|display:grid|var\(--|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const expandableDetailTableMarkup = renderToStaticMarkup(React.createElement(ExpandableDetailTable, {
  label: "Expandable detail table",
  description: "Review selected row detail.",
  density: "sm",
  expandedRowKey: "row-1",
  detailOpen: true,
  summaries: [{ key: "selected", label: "1 row selected", tone: "info" }],
  table: {
    label: "Operational rows",
    columns: [{ key: "name", label: "Name" }, { key: "status", label: "Status" }],
    rows: [{ id: "row-1", name: "Acme", status: "Active" }],
    rowKey: "id",
    page: 1,
    pageCount: 2,
    bulkActions: [{ key: "review", label: "Review row" }],
  },
  detail: {
    label: "Row detail",
    open: true,
    drawer: { triggerLabel: "Open row detail", closeLabel: "Close row detail" },
    actions: [{ key: "approve", label: "Approve row" }],
  },
  feedback: {
    kind: "toast",
    label: "Detail updated",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "expandable-detail-table",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(expandableDetailTableMarkup, /data-flow-pattern="expandable-detail-table"/);
assert.match(expandableDetailTableMarkup, /data-flow-slot="expandableDetailTableSurface"/);
assert.match(expandableDetailTableMarkup, /data-expandable-detail-table-state="detail-open"/);
assert.match(expandableDetailTableMarkup, /data-row-count="1"/);
assert.match(expandableDetailTableMarkup, /data-summary-count="1"/);
assert.match(expandableDetailTableMarkup, /data-flow-slot="detailTableSummary"/);
assert.match(expandableDetailTableMarkup, /data-flow-slot="detailTableMetric"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern-boundary="virtual-data-table"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(expandableDetailTableMarkup, /data-flow-primitive="surface"/);
assert.match(expandableDetailTableMarkup, /class="badge/);
assert.doesNotMatch(expandableDetailTableMarkup, /expandable-card|expanded-row-card|custom-expand-table|custom-detail-drawer|local-feedback|table-local|row-detail-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const ganttChartMarkup = renderToStaticMarkup(React.createElement(GanttChart, {
  label: "Launch schedule",
  description: "Milestone plan",
  density: "sm",
  selectedTaskKey: "task-1",
  tasks: [
    { key: "task-1", label: "Design review", owner: "Ops", start: "2026-08-01", end: "2026-08-04", progress: 75, status: "on-track" },
    { key: "task-2", label: "Pilot rollout", owner: "Fleet", start: "2026-08-05", end: "2026-08-12", progress: 20, status: "risk" },
  ],
  milestones: [{ key: "m1", label: "Pilot ready", date: "2026-08-12" }],
  dependencies: [{ from: "task-1", to: "task-2", type: "finish-start" }],
  metrics: [{ key: "risk", label: "1 risk", tone: "warning" }],
  primaryAction: { key: "inspect", label: "Inspect schedule" },
  feedback: { status: { key: "sync", label: "Synced", tone: "info" } },
  "data-product-hook": "gantt-chart",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(ganttChartMarkup, /data-flow-pattern="gantt-chart"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttChartSurface"/);
assert.match(ganttChartMarkup, /data-gantt-chart-state="selected"/);
assert.match(ganttChartMarkup, /data-task-count="2"/);
assert.match(ganttChartMarkup, /data-milestone-count="1"/);
assert.match(ganttChartMarkup, /data-dependency-count="1"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttSummary"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttMetric"/);
assert.match(ganttChartMarkup, /data-flow-slot="chartWrapperBoundary"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttDataSummary"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttFeedback"/);
assert.match(ganttChartMarkup, /data-flow-pattern-boundary="chart-wrapper"/);
assert.match(ganttChartMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(ganttChartMarkup, /data-chart-kind="gantt"/);
assert.match(ganttChartMarkup, /data-flow-primitive="surface"/);
assert.match(ganttChartMarkup, /class="badge/);
assert.match(ganttChartMarkup, /class="chart-panel/);
assert.match(ganttChartMarkup, /class="table/);
assert.doesNotMatch(ganttChartMarkup, /gantt-card|local-gantt|custom-gantt|gantt-bar|gantt-svg|canvas|custom-chart|raw-task-table|table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const waterfallChartMarkup = renderToStaticMarkup(React.createElement(WaterfallChart, {
  label: "Margin bridge",
  description: "Contribution analysis",
  density: "sm",
  selectedStepKey: "fuel",
  steps: [
    { key: "start", label: "Starting margin", value: 100, kind: "total", formattedValue: "$100k", formattedCumulative: "$100k" },
    { key: "fuel", label: "Fuel variance", value: -12, formattedValue: "-$12k", formattedCumulative: "$88k", note: "Supplier cost" },
    { key: "discount", label: "Discount recovery", value: 8, formattedValue: "$8k", formattedCumulative: "$96k" },
  ],
  metrics: [{ key: "variance", label: "1 negative step", tone: "warning" }],
  primaryAction: { key: "inspect", label: "Inspect bridge" },
  feedback: { status: { key: "review", label: "Needs review", tone: "warning" } },
  "data-product-hook": "waterfall-chart",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(waterfallChartMarkup, /data-flow-pattern="waterfall-chart"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallChartSurface"/);
assert.match(waterfallChartMarkup, /data-waterfall-chart-state="selected"/);
assert.match(waterfallChartMarkup, /data-step-count="3"/);
assert.match(waterfallChartMarkup, /data-increase-count="1"/);
assert.match(waterfallChartMarkup, /data-decrease-count="1"/);
assert.match(waterfallChartMarkup, /data-total-count="1"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallSummary"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallMetric"/);
assert.match(waterfallChartMarkup, /data-flow-slot="chartWrapperBoundary"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallDataSummary"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallFeedback"/);
assert.match(waterfallChartMarkup, /data-flow-pattern-boundary="chart-wrapper"/);
assert.match(waterfallChartMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(waterfallChartMarkup, /data-chart-kind="waterfall"/);
assert.match(waterfallChartMarkup, /data-flow-primitive="surface"/);
assert.match(waterfallChartMarkup, /class="badge/);
assert.match(waterfallChartMarkup, /class="chart-panel/);
assert.match(waterfallChartMarkup, /class="table/);
assert.doesNotMatch(waterfallChartMarkup, /waterfall-card|local-waterfall|custom-waterfall|waterfall-bar|waterfall-svg|canvas|custom-chart|raw-step-table|table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const polarChartMarkup = renderToStaticMarkup(React.createElement(PolarChart, {
  label: "Risk distribution",
  description: "Segment comparison",
  density: "sm",
  selectedSegmentKey: "fuel",
  segments: [
    { key: "fuel", label: "Fuel risk", value: 42, formattedValue: "42", share: "42%", status: "warning" },
    { key: "maintenance", label: "Maintenance", value: 28, formattedValue: "28", share: "28%", status: "info" },
  ],
  metrics: [{ key: "segments", label: "2 segments", tone: "info" }],
  primaryAction: { key: "inspect", label: "Inspect distribution" },
  feedback: { status: { key: "review", label: "Reviewed", tone: "info" } },
  "data-product-hook": "polar-chart",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(polarChartMarkup, /data-flow-pattern="polar-chart"/);
assert.match(polarChartMarkup, /data-flow-slot="polarChartSurface"/);
assert.match(polarChartMarkup, /data-polar-chart-state="selected"/);
assert.match(polarChartMarkup, /data-segment-count="2"/);
assert.match(polarChartMarkup, /data-flow-slot="polarSummary"/);
assert.match(polarChartMarkup, /data-flow-slot="polarMetric"/);
assert.match(polarChartMarkup, /data-flow-slot="chartWrapperBoundary"/);
assert.match(polarChartMarkup, /data-flow-slot="polarDataSummary"/);
assert.match(polarChartMarkup, /data-flow-slot="polarFeedback"/);
assert.match(polarChartMarkup, /data-flow-pattern-boundary="chart-wrapper"/);
assert.match(polarChartMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(polarChartMarkup, /data-chart-kind="polar"/);
assert.match(polarChartMarkup, /data-flow-primitive="surface"/);
assert.match(polarChartMarkup, /class="badge/);
assert.match(polarChartMarkup, /class="chart-panel/);
assert.match(polarChartMarkup, /class="table/);
assert.doesNotMatch(polarChartMarkup, /polar-card|local-polar|custom-polar|polar-arc|polar-svg|radar-svg|canvas|custom-chart|raw-segment-table|table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const sidebarMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  density: "sm",
  activeKey: "routes",
  breadcrumbs: [
    { label: "Fleet", href: "/fleet" },
    { label: "Routes", current: true },
  ],
  groups: [
    {
      key: "operations",
      title: "Operations",
      badge: "2",
      open: true,
      routes: [
        { key: "routes", label: "Routes", icon: "route", badge: "4", active: true },
        { key: "drivers", label: "Drivers", icon: "person" },
      ],
    },
  ],
  "data-product-hook": "sidebar",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(sidebarMarkup, /data-flow-pattern="sidebar"/);
assert.match(sidebarMarkup, /data-state="active"/);
assert.match(sidebarMarkup, /data-group-count="1"/);
assert.match(sidebarMarkup, /data-route-count="2"/);
assert.match(sidebarMarkup, /data-flow-primitive="surface"/);
assert.match(sidebarMarkup, /data-flow-slot="groups"/);
assert.match(sidebarMarkup, /data-sidebar-route="routes"/);
assert.doesNotMatch(sidebarMarkup, /class="drawer/);
assert.match(sidebarMarkup, /class="breadcrumbs/);
assert.match(sidebarMarkup, /class="accordion/);
assert.doesNotMatch(sidebarMarkup, /data-flow-slot="collapse-action"/);
assert.match(sidebarMarkup, /class="badge/);
assert.doesNotMatch(sidebarMarkup, /topbar|fleet-dashboard-suite|configuration-console|template-route|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const sidebarCollapseMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  collapseAction: { label: "Collapse navigation" },
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarCollapseMarkup, /data-flow-slot="collapse-action"/);
assert.match(sidebarCollapseMarkup, /class="icon-button/);

const sidebarCollapsedMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  collapsed: true,
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarCollapsedMarkup, /data-state="collapsed"/);
assert.match(sidebarCollapsedMarkup, /data-collapsed="true"/);

const sidebarMobileMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  mobileDrawer: true,
  drawerOpen: true,
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarMobileMarkup, /data-state="mobile-drawer"/);
assert.match(sidebarMobileMarkup, /data-open="true"/);
assert.match(sidebarMobileMarkup, /class="drawer/);

const sidebarPermissionMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  permissionFiltered: true,
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarPermissionMarkup, /data-state="permission-filtered"/);
assert.match(sidebarPermissionMarkup, /Permission filtered/);

const topbarMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  density: "sm",
  search: {
    label: "Search fleet",
    triggerLabel: "Search fleet",
    query: "MX",
    active: true,
    delegate: {
      label: "Search vehicles",
      query: "MX",
      results: [{ key: "mx-4821", label: "MX-4821", meta: "Active" }],
    },
  },
  autocomplete: {
    label: "Vehicle",
    suggestions: [{ label: "MX-4821", value: "mx-4821" }],
  },
  account: {
    name: "Ana Torres",
    status: "online",
    open: true,
    items: [{ key: "profile", label: "Profile" }],
    delegate: {
      name: "Ana Torres",
      items: [{ key: "profile", label: "Profile" }],
    },
  },
  commandPalette: {
    label: "Command palette",
    open: true,
    commands: [{ key: "open-route", label: "Open route" }],
  },
  notifications: {
    label: "Notifications",
    open: true,
    notifications: [{ key: "route", label: "Route delayed", unread: true }],
  },
  settings: {
    groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }],
  },
  sidebar: {
    groups: [{ title: "Operations", routes: [{ key: "routes", label: "Routes" }] }],
  },
  actions: [{ key: "settings", label: "Settings", icon: "settings" }],
  "data-product-hook": "topbar",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(topbarMarkup, /data-flow-pattern="topbar"/);
assert.match(topbarMarkup, /data-state="search-active"/);
assert.match(topbarMarkup, /data-action-count="1"/);
assert.match(topbarMarkup, /data-unread-count="1"/);
assert.match(topbarMarkup, /data-product-hook="topbar"/);
assert.match(topbarMarkup, /class="drawer/);
assert.match(topbarMarkup, /class="icon-button/);
assert.match(topbarMarkup, /class="field/);
assert.match(topbarMarkup, /class="input/);
assert.match(topbarMarkup, /class="badge/);
assert.match(topbarMarkup, /class="avatar/);
assert.match(topbarMarkup, /class="menu/);
assert.match(topbarMarkup, /data-flow-pattern="search"/);
assert.match(topbarMarkup, /data-flow-pattern="autocomplete"/);
assert.match(topbarMarkup, /data-flow-pattern="avatar-menu"/);
assert.match(topbarMarkup, /data-flow-pattern="command-palette"/);
assert.match(topbarMarkup, /data-flow-pattern="notification-panel"/);
assert.match(topbarMarkup, /data-flow-pattern="settings"/);
assert.match(topbarMarkup, /data-flow-pattern="sidebar"/);
assert.match(topbarMarkup, /data-flow-primitive="surface"/);
assert.doesNotMatch(topbarMarkup, /fleet-dashboard-suite|configuration-console|template-route|toolbar-local|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const topbarMobileMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  mobile: true,
  sidebar: { drawerOpen: true, groups: [{ title: "Operations", routes: [{ label: "Routes" }] }] },
}));
assert.match(topbarMobileMarkup, /data-state="mobile"/);
assert.match(topbarMobileMarkup, /data-mobile="true"/);

const topbarAccountMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  account: { name: "Ana Torres", open: true, items: [{ key: "profile", label: "Profile" }] },
}));
assert.match(topbarAccountMarkup, /data-state="account-open"/);

const topbarPermissionMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  permissionFiltered: true,
}));
assert.match(topbarPermissionMarkup, /data-state="permission-filtered"/);
assert.match(topbarPermissionMarkup, /Permission filtered/);

const topbarLoadingMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  loading: true,
}));
assert.match(topbarLoadingMarkup, /data-state="loading"/);
assert.match(topbarLoadingMarkup, /aria-busy="true"/);

const toolbarMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  density: "sm",
  search: {
    label: "Search vehicles",
    query: "MX",
    input: { label: "Search vehicles", value: "MX" },
    delegate: { label: "Search vehicles", query: "MX", results: [{ key: "mx-4821", label: "MX-4821" }] },
  },
  filters: [{ key: "active", label: "Status: active", removable: true }],
  badges: [{ key: "selected", label: "2 selected", tone: "info" }],
  actions: [{ key: "assign", label: "Assign", variant: "primary" }],
  overflow: { triggerLabel: "More actions", open: true, items: [{ key: "export", label: "Export" }] },
  feedback: { label: "Toolbar updated", tone: "success" },
  "data-product-hook": "toolbar",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(toolbarMarkup, /data-flow-pattern="toolbar"/);
assert.match(toolbarMarkup, /role="toolbar"/);
assert.match(toolbarMarkup, /data-state="overflow"/);
assert.match(toolbarMarkup, /data-action-count="1"/);
assert.match(toolbarMarkup, /data-filter-count="1"/);
assert.match(toolbarMarkup, /data-badge-count="1"/);
assert.match(toolbarMarkup, /data-product-hook="toolbar"/);
assert.match(toolbarMarkup, /class="button button--primary"/);
assert.match(toolbarMarkup, /class="chip/);
assert.match(toolbarMarkup, /class="input/);
assert.match(toolbarMarkup, /class="menu/);
assert.match(toolbarMarkup, /class="toast/);
assert.match(toolbarMarkup, /class="badge/);
assert.match(toolbarMarkup, /data-flow-pattern="search"/);
assert.doesNotMatch(toolbarMarkup, /data-flow-pattern="topbar"|fleet-dashboard-suite|configuration-console|template-route|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const toolbarFilterMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  filters: [{ label: "Region: north" }],
}));
assert.match(toolbarFilterMarkup, /data-state="filter-active"/);

const toolbarPermissionMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  permissionBlocked: true,
  actions: [{ label: "Export" }],
}));
assert.match(toolbarPermissionMarkup, /data-state="permission-blocked"/);
assert.match(toolbarPermissionMarkup, /Permission blocked/);

const toolbarTopbarBoundaryMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  topbar: { label: "Global shell", account: { name: "Ana Torres", items: [{ key: "profile", label: "Profile" }] } },
}));
assert.match(toolbarTopbarBoundaryMarkup, /data-flow-pattern="toolbar"/);
assert.match(toolbarTopbarBoundaryMarkup, /data-flow-pattern="topbar"/);

const bulkActionsMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  density: "sm",
  selectedCount: 2,
  totalCount: 5,
  eligibleCount: 1,
  selection: { label: "Select vehicles" },
  table: {
    label: "Selected vehicles",
    columns: [{ key: "unit", label: "Unit" }, { key: "eligibility", label: "Eligibility" }],
    rows: [{ id: "mx-4821", unit: "MX-4821", eligibility: "Eligible" }],
  },
  toolbar: {
    label: "Bulk action host",
    actions: [{ key: "assign", label: "Assign", variant: "primary" }],
  },
  actions: [{ key: "assign", label: "Assign", variant: "primary" }],
  overflow: { triggerLabel: "More bulk actions", open: true, items: [{ key: "export", label: "Export" }] },
  confirmation: {
    label: "Confirm assignment",
    open: true,
    description: "Apply to selected vehicles.",
    actions: [{ key: "cancel", label: "Cancel" }, { key: "confirm", label: "Apply", variant: "primary" }],
  },
  progress: { label: "Applying bulk action", value: 60, showValue: true, state: "active" },
  feedback: { label: "Bulk action queued", tone: "info" },
  "data-product-hook": "bulk-actions",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(bulkActionsMarkup, /data-flow-pattern="bulk-actions"/);
assert.match(bulkActionsMarkup, /data-state="running"/);
assert.match(bulkActionsMarkup, /data-selected-count="2"/);
assert.match(bulkActionsMarkup, /data-eligible-count="1"/);
assert.match(bulkActionsMarkup, /data-action-count="1"/);
assert.match(bulkActionsMarkup, /data-product-hook="bulk-actions"/);
assert.match(bulkActionsMarkup, /class="choice checkbox"/);
assert.match(bulkActionsMarkup, /class="badge/);
assert.match(bulkActionsMarkup, /class="table/);
assert.match(bulkActionsMarkup, /data-flow-pattern="toolbar"/);
assert.match(bulkActionsMarkup, /class="button button--primary"/);
assert.match(bulkActionsMarkup, /class="menu/);
assert.match(bulkActionsMarkup, /class="dialog/);
assert.match(bulkActionsMarkup, /class="progress/);
assert.match(bulkActionsMarkup, /class="toast/);
assert.doesNotMatch(bulkActionsMarkup, /selection-policy-owned-by-toolbar|fake-checkbox|fake-menu|fleet-dashboard-suite|configuration-console|template-route|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const bulkActionsEmptyMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
}));
assert.match(bulkActionsEmptyMarkup, /data-state="none-selected"/);

const bulkActionsConfirmingMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  selectedCount: 1,
  totalCount: 1,
  confirmation: { label: "Confirm assignment", open: true },
}));
assert.match(bulkActionsConfirmingMarkup, /data-state="confirming"/);

const bulkActionsFailureMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  selectedCount: 2,
  totalCount: 2,
  progress: { label: "Applying bulk action", state: "error" },
}));
assert.match(bulkActionsFailureMarkup, /data-state="partial-failure"/);

const bulkActionsCompleteMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  selectedCount: 2,
  totalCount: 2,
  progress: { label: "Applying bulk action", state: "complete" },
}));
assert.match(bulkActionsCompleteMarkup, /data-state="complete"/);

const bulkActionsDisabledMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  disabled: true,
  selectedCount: 2,
  totalCount: 2,
}));
assert.match(bulkActionsDisabledMarkup, /data-state="disabled"/);

const chartWrapperMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  description: "Completed routes by day.",
  density: "sm",
  filtered: true,
  chart: { values: [12, 18, 22], labels: ["Mon", "Tue", "Wed"], variant: "line", value: "22" },
  summary: { label: "Completed", value: "22", tone: "success" },
  status: { label: "Filtered", tone: "warning" },
  primaryAction: { label: "Export" },
  overflow: { triggerLabel: "Chart actions", open: true, items: [{ key: "compare", label: "Compare" }] },
  table: {
    columns: [{ key: "day", label: "Day" }, { key: "routes", label: "Routes" }],
    rows: [{ id: "mon", day: "Mon", routes: "12" }],
  },
  list: { items: [{ key: "summary", label: "Best day", value: "Wed" }] },
  "data-product-hook": "chart-wrapper",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(chartWrapperMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(chartWrapperMarkup, /class="chart-wrapper"/);
assert.match(chartWrapperMarkup, /data-state="filtered"/);
assert.match(chartWrapperMarkup, /data-has-table-summary="true"/);
assert.match(chartWrapperMarkup, /data-has-list-summary="true"/);
assert.match(chartWrapperMarkup, /data-product-hook="chart-wrapper"/);
assert.match(chartWrapperMarkup, /data-flow-primitive="surface"/);
assert.match(chartWrapperMarkup, /class="chart-panel/);
assert.match(chartWrapperMarkup, /class="kpi-tile/);
assert.match(chartWrapperMarkup, /class="badge/);
assert.match(chartWrapperMarkup, /class="button button--secondary"/);
assert.match(chartWrapperMarkup, /class="menu/);
assert.match(chartWrapperMarkup, /class="table/);
assert.match(chartWrapperMarkup, /class="list/);
assert.doesNotMatch(chartWrapperMarkup, /class="card|custom-chart|dashboard-template|canvas|chart-wrapper-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const chartWrapperLoadingMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  loading: true,
  chart: { values: [12, 18] },
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperLoadingMarkup, /data-state="loading"/);
assert.match(chartWrapperLoadingMarkup, /class="skeleton/);

const chartWrapperEmptyMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  empty: true,
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperEmptyMarkup, /data-state="empty"/);
assert.match(chartWrapperEmptyMarkup, /class="empty-state/);

const chartWrapperErrorMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  error: { label: "Chart unavailable", description: "Retry later." },
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperErrorMarkup, /data-state="error"/);
assert.match(chartWrapperErrorMarkup, /class="error-panel/);

const chartWrapperPermissionMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  permissionBlocked: true,
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperPermissionMarkup, /data-state="permission-blocked"/);
assert.match(chartWrapperPermissionMarkup, /class="empty-state/);
assert.match(chartWrapperPermissionMarkup, /data-variant="permission"/);
assert.doesNotMatch(chartWrapperPermissionMarkup, /class="chart-panel/);

const calendarViewMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  label: "Maintenance calendar",
  description: "Operational schedule by selected period.",
  density: "sm",
  selectedDate: "2026-08-09",
  rangeLabel: "Aug 2026",
  timezoneLabel: "America/Mexico_City",
  dateControl: { label: "Schedule date", value: "2026-08-09", open: true },
  dense: true,
  selectedKey: "oil",
  events: [
    { key: "oil", label: "Oil change", time: "09:00", description: "Unit MX-4821", status: "warning", statusLabel: "Due soon" },
    { key: "renewal", label: "Permit renewal", time: "14:00", description: "Owner: Fleet ops", status: "success", statusLabel: "Confirmed" },
  ],
  actions: [{ label: "Create event" }],
  detail: { triggerLabel: "Open event details", title: "Oil change", open: true },
  "data-product-hook": "calendar-view",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(calendarViewMarkup, /data-flow-pattern="calendar-view"/);
assert.match(calendarViewMarkup, /data-state="dense"/);
assert.match(calendarViewMarkup, /data-event-count="2"/);
assert.match(calendarViewMarkup, /data-selected-date="2026-08-09"/);
assert.match(calendarViewMarkup, /data-product-hook="calendar-view"/);
assert.match(calendarViewMarkup, /data-flow-primitive="surface"/);
assert.match(calendarViewMarkup, /date-range-picker/);
assert.match(calendarViewMarkup, /class="badge/);
assert.match(calendarViewMarkup, /class="tooltip/);
assert.match(calendarViewMarkup, /class="button button--secondary"/);
assert.match(calendarViewMarkup, /class="list/);
assert.match(calendarViewMarkup, /class="card/);
assert.match(calendarViewMarkup, /class="popover/);
assert.doesNotMatch(calendarViewMarkup, /calendar-grid|calendar-cell|custom-calendar|event-pill|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const calendarViewLoadingMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  loading: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewLoadingMarkup, /data-state="loading"/);
assert.match(calendarViewLoadingMarkup, /class="skeleton/);

const calendarViewEmptyMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  empty: true,
  dateControl: { label: "Schedule date" },
  events: [],
}));
assert.match(calendarViewEmptyMarkup, /data-state="empty"/);
assert.match(calendarViewEmptyMarkup, /class="empty-state/);

const calendarViewErrorMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  error: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewErrorMarkup, /data-state="error"/);
assert.match(calendarViewErrorMarkup, /class="empty-state/);

const calendarViewDisabledMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  disabled: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewDisabledMarkup, /data-state="disabled"/);

const calendarViewRangeChangingMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  rangeChanging: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewRangeChangingMarkup, /data-state="range-changing"/);
assert.match(calendarViewRangeChangingMarkup, /class="skeleton/);

const columnConfiguratorMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  label: "Vehicle columns",
  description: "Choose columns for the operations table.",
  density: "sm",
  open: true,
  surface: { mode: "drawer", triggerLabel: "Columns" },
  columns: [
    { key: "unit", label: "Unit", required: true, requiredReason: "Identity column" },
    { key: "status", label: "Status", visible: true },
    { key: "route", label: "Route", visible: false },
  ],
  rows: [{ id: "mx-4821", unit: "MX-4821", status: "Active", route: "Centro" }],
  applyAction: { label: "Apply columns" },
  resetAction: { label: "Reset" },
  saveViewAction: { label: "Save view" },
  validation: { message: "Required identity columns stay visible.", state: "info" },
  feedback: { label: "Columns updated", tone: "success" },
  "data-product-hook": "column-configurator",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(columnConfiguratorMarkup, /data-flow-pattern="column-configurator"/);
assert.match(columnConfiguratorMarkup, /data-state="dirty"/);
assert.match(columnConfiguratorMarkup, /data-visible-count="2"/);
assert.match(columnConfiguratorMarkup, /data-column-count="3"/);
assert.match(columnConfiguratorMarkup, /data-surface-mode="drawer"/);
assert.match(columnConfiguratorMarkup, /data-product-hook="column-configurator"/);
assert.match(columnConfiguratorMarkup, /class="drawer/);
assert.match(columnConfiguratorMarkup, /data-flow-primitive="surface"/);
assert.match(columnConfiguratorMarkup, /class="choice checkbox"/);
assert.match(columnConfiguratorMarkup, /Identity column/);
assert.match(columnConfiguratorMarkup, /class="table/);
assert.match(columnConfiguratorMarkup, /class="inline-validation/);
assert.match(columnConfiguratorMarkup, /class="toast/);
assert.doesNotMatch(columnConfiguratorMarkup, /class="card|fake-checkbox|fake-drawer|fake-table|column-settings-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const columnConfiguratorDialogMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  surface: { mode: "dialog", triggerLabel: "Columns" },
  open: true,
  columns: [{ key: "unit", label: "Unit", required: true }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  applyAction: { label: "Apply" },
}));
assert.match(columnConfiguratorDialogMarkup, /data-surface-mode="dialog"/);
assert.match(columnConfiguratorDialogMarkup, /class="dialog/);

const columnConfiguratorMenuMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  surface: { mode: "menu", triggerLabel: "Columns" },
  open: true,
  columns: [{ key: "unit", label: "Unit", required: true }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  applyAction: { label: "Apply" },
}));
assert.match(columnConfiguratorMenuMarkup, /data-surface-mode="menu"/);
assert.match(columnConfiguratorMenuMarkup, /class="menu/);

const columnConfiguratorInvalidMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  columns: [{ key: "unit", label: "Unit", required: true, visible: false }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  applyAction: { label: "Apply" },
}));
assert.match(columnConfiguratorInvalidMarkup, /data-state="invalid"/);

const dragSortableListMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  label: "Dashboard module order",
  density: "sm",
  dirty: true,
  movingKey: "alerts",
  items: [
    { key: "summary", label: "Summary", locked: true, lockedReason: "Required first module" },
    { key: "alerts", label: "Alerts", description: "Moved with keyboard controls" },
    { key: "map", label: "Map" },
  ],
  settings: { label: "Order preferences" },
  saveAction: { label: "Save order" },
  undoAction: { label: "Undo move" },
  resetAction: { label: "Reset order" },
  feedback: { label: "Order ready to save", tone: "info" },
  "data-product-hook": "drag-sortable-list",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(dragSortableListMarkup, /data-flow-pattern="drag-sortable-list"/);
assert.match(dragSortableListMarkup, /data-state="keyboard-moving"/);
assert.match(dragSortableListMarkup, /data-item-count="3"/);
assert.match(dragSortableListMarkup, /data-settings-boundary="true"/);
assert.match(dragSortableListMarkup, /data-product-hook="drag-sortable-list"/);
assert.match(dragSortableListMarkup, /class="motion-boundary/);
assert.match(dragSortableListMarkup, /data-reduced-motion="false"/);
assert.match(dragSortableListMarkup, /class="list/);
assert.match(dragSortableListMarkup, /class="badge/);
assert.match(dragSortableListMarkup, /Required first module/);
assert.match(dragSortableListMarkup, /class="button button--ghost"/);
assert.match(dragSortableListMarkup, /data-flow-pattern-boundary="settings"/);
assert.match(dragSortableListMarkup, /class="toast/);
assert.doesNotMatch(dragSortableListMarkup, /pointermove|touchstart|translateX|fake-list|settings-owned-reorder|class="card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const dragSortableListReducedMotionMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  reducedMotion: true,
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListReducedMotionMarkup, /data-state="reduced-motion"/);
assert.match(dragSortableListReducedMotionMarkup, /data-reduced-motion="true"/);

const dragSortableListSavedMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  state: "saved",
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListSavedMarkup, /data-state="saved"/);

const dragSortableListErrorMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  error: true,
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListErrorMarkup, /data-state="error"/);

const dragSortableListDisabledMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  disabled: true,
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListDisabledMarkup, /data-state="disabled"/);

const kanbanBoardMarkup = renderToStaticMarkup(React.createElement(KanbanBoard, {
  label: "Growth board",
  description: "Onboarding experiments by state",
  density: "sm",
  selectedKey: "activate",
  selectedColumnKey: "doing",
  sortable: true,
  actions: [{ key: "add", label: "Add card" }],
  columns: [
    {
      key: "todo",
      label: "To do",
      limit: 2,
      items: [{ key: "brief", label: "Brief", description: "Draft experiment" }],
    },
    {
      key: "doing",
      label: "Doing",
      limit: 1,
      items: [
        { key: "activate", label: "Activation", description: "Keyboard movable", status: { label: "Live", tone: "success" } },
        { key: "review", label: "Review", locked: true, lockedReason: "Compliance review" },
      ],
    },
  ],
  "data-product-hook": "kanban-board",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(kanbanBoardMarkup, /data-flow-pattern="kanban-board"/);
assert.match(kanbanBoardMarkup, /data-state="idle"/);
assert.match(kanbanBoardMarkup, /data-column-count="2"/);
assert.match(kanbanBoardMarkup, /data-card-count="3"/);
assert.match(kanbanBoardMarkup, /data-sortable="true"/);
assert.match(kanbanBoardMarkup, /data-product-hook="kanban-board"/);
assert.match(kanbanBoardMarkup, /data-flow-primitive="surface"/);
assert.match(kanbanBoardMarkup, /data-flow-pattern-boundary="drag-sortable-list"/);
assert.match(kanbanBoardMarkup, /data-flow-pattern="drag-sortable-list"/);
assert.match(kanbanBoardMarkup, /class="badge/);
assert.match(kanbanBoardMarkup, /class="button button--secondary"/);
assert.match(kanbanBoardMarkup, /Compliance review/);
assert.doesNotMatch(kanbanBoardMarkup, /class="card|board-column|kanban-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const kanbanBoardEmptyMarkup = renderToStaticMarkup(React.createElement(KanbanBoard, {
  columns: [],
  empty: { title: "No work", description: "Create the first lane." },
}));
assert.match(kanbanBoardEmptyMarkup, /data-flow-pattern="kanban-board"/);
assert.match(kanbanBoardEmptyMarkup, /data-state="empty"/);
assert.match(kanbanBoardEmptyMarkup, /class="empty-state/);

const kanbanBoardErrorMarkup = renderToStaticMarkup(React.createElement(KanbanBoard, {
  error: { label: "Board unavailable", description: "Retry later." },
  columns: [{ key: "todo", label: "To do", items: [{ key: "brief", label: "Brief" }] }],
}));
assert.match(kanbanBoardErrorMarkup, /data-state="error"/);
assert.match(kanbanBoardErrorMarkup, /class="error-panel/);

const driverAndVehicleAdministrationMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  label: "Driver and vehicle admin",
  description: "Review admin records.",
  density: "sm",
  selectedKey: "ana",
  toolbar: {
    label: "Admin toolbar",
    actions: [{ key: "export", label: "Export" }],
    filters: [{ key: "active", label: "Active" }],
    badges: [{ key: "records", label: "2 records" }],
  },
  summary: { label: "Administration", number: "2 records", status: "Active" },
  records: [
    { key: "ana", driver: "Ana Torres", vehicle: "MX-4821", type: "Driver", status: "active" },
    { key: "unit", driver: "Fleet Unit", vehicle: "MX-8840", type: "Vehicle", status: "review" },
  ],
  actions: [{ key: "assign", label: "Assign", icon: "person_add" }],
  primaryAction: { label: "Save changes" },
  secondaryAction: { label: "Cancel" },
  dialog: { label: "Review admin action", open: true, actions: [{ key: "confirm", label: "Confirm" }] },
  audit: { label: "Ana Torres updated", meta: "Today", status: "Verified" },
  pagination: { page: 1, pageCount: 2 },
  feedback: { label: "Administration ready", tone: "info" },
  "data-product-hook": "driver-and-vehicle-administration",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(driverAndVehicleAdministrationMarkup, /data-flow-pattern="driver-and-vehicle-administration"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-state="selected"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-record-count="2"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-action-count="1"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-product-hook="driver-and-vehicle-administration"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-flow-pattern="toolbar"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-admin-toolbar-boundary="true"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-flow-primitive="surface"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-admin-surface="true"/);
assert.match(driverAndVehicleAdministrationMarkup, /class="card-summary/);
assert.match(driverAndVehicleAdministrationMarkup, /class="table/);
assert.match(driverAndVehicleAdministrationMarkup, /class="avatar/);
assert.match(driverAndVehicleAdministrationMarkup, /class="badge/);
assert.match(driverAndVehicleAdministrationMarkup, /class="pattern-action-item/);
assert.match(driverAndVehicleAdministrationMarkup, /class="button button--primary"/);
assert.match(driverAndVehicleAdministrationMarkup, /class="dialog/);
assert.match(driverAndVehicleAdministrationMarkup, /class="audit-event/);
assert.match(driverAndVehicleAdministrationMarkup, /class="pagination/);
assert.match(driverAndVehicleAdministrationMarkup, /class="toast/);
assert.doesNotMatch(driverAndVehicleAdministrationMarkup, /domain-authorization|route-policy|business-workflow|custom-table|fake-toolbar|custom-audit|class="card |rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const driverAndVehicleAdministrationLoadingMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  loading: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationLoadingMarkup, /data-state="loading"/);
assert.match(driverAndVehicleAdministrationLoadingMarkup, /aria-busy="true"/);

const driverAndVehicleAdministrationEmptyMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  records: [],
}));
assert.match(driverAndVehicleAdministrationEmptyMarkup, /data-state="empty"/);
assert.match(driverAndVehicleAdministrationEmptyMarkup, /class="empty-state/);

const driverAndVehicleAdministrationPermissionMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  permissionBlocked: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationPermissionMarkup, /data-state="permission-blocked"/);
assert.match(driverAndVehicleAdministrationPermissionMarkup, /Permission required/);

const driverAndVehicleAdministrationRunningMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  actionRunning: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
  actions: [{ key: "assign", label: "Assign" }],
}));
assert.match(driverAndVehicleAdministrationRunningMarkup, /data-state="action-running"/);

const driverAndVehicleAdministrationErrorMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  error: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationErrorMarkup, /data-state="error"/);

const driverAndVehicleAdministrationDisabledMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  disabled: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationDisabledMarkup, /data-state="disabled"/);

const driverOnboardingMobileMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  label: "Driver onboarding",
  description: "Complete mobile setup.",
  density: "sm",
  inProgress: true,
  currentStep: 1,
  reducedMotion: true,
  steps: [{ id: "identity", label: "Identity" }, { id: "verify", label: "Verify" }, { id: "done", label: "Done" }],
  summary: { label: "Mobile setup", number: "2/3", status: "In progress" },
  identityCard: { title: "Ana Torres", value: "MX-4821", detail: "Driver profile" },
  formSection: { title: "License", fields: [{ label: "License number", value: "A123" }] },
  identity: { label: "Driver name", value: "Ana Torres" },
  phone: { label: "Phone number", value: "5551234567", country: "MX" },
  code: { label: "Verification code", value: "123456" },
  validation: { message: "Continue verification.", state: "info" },
  biometricPrompt: { label: "Use biometrics", fallback: "Use code instead" },
  primaryAction: { label: "Continue" },
  secondaryAction: { label: "Back" },
  animatedMoment: { label: "Verification ready", animationSource: "driver.json" },
  feedback: { label: "Onboarding ready", tone: "info" },
  "data-product-hook": "driver-onboarding-mobile",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(driverOnboardingMobileMarkup, /data-flow-pattern="driver-onboarding-mobile"/);
assert.match(driverOnboardingMobileMarkup, /data-state="in-progress"/);
assert.match(driverOnboardingMobileMarkup, /data-step-count="3"/);
assert.match(driverOnboardingMobileMarkup, /data-reduced-motion="true"/);
assert.match(driverOnboardingMobileMarkup, /data-driver-onboarding-surface="true"/);
assert.match(driverOnboardingMobileMarkup, /data-form-section-boundary="true"/);
assert.match(driverOnboardingMobileMarkup, /class="stepper/);
assert.match(driverOnboardingMobileMarkup, /class="card-summary/);
assert.match(driverOnboardingMobileMarkup, /class="card/);
assert.match(driverOnboardingMobileMarkup, /class="field/);
assert.match(driverOnboardingMobileMarkup, /phone-input/);
assert.match(driverOnboardingMobileMarkup, /class="code-input/);
assert.match(driverOnboardingMobileMarkup, /class="inline-validation/);
assert.match(driverOnboardingMobileMarkup, /class="biometric-prompt/);
assert.match(driverOnboardingMobileMarkup, /class="animated-moment/);
assert.match(driverOnboardingMobileMarkup, /class="button button--primary"/);
assert.match(driverOnboardingMobileMarkup, /class="toast/);
assert.doesNotMatch(driverOnboardingMobileMarkup, /eligibility-policy|compliance-policy|template-sequence|biometric-only|custom-form-section|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const driverOnboardingVerifyingMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  verifying: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingVerifyingMarkup, /data-state="verifying"/);
assert.match(driverOnboardingVerifyingMarkup, /aria-busy="true"/);

const driverOnboardingBiometricMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  biometric: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingBiometricMarkup, /data-state="biometric"/);
assert.match(driverOnboardingBiometricMarkup, /class="biometric-prompt/);

const driverOnboardingInvalidMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  invalid: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingInvalidMarkup, /data-state="invalid"/);

const driverOnboardingBlockedMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  blocked: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingBlockedMarkup, /data-state="blocked"/);

const driverOnboardingCompleteMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  complete: true,
  phone: { label: "Phone number" },
  animatedMoment: { label: "Complete", animationSource: "done.json" },
}));
assert.match(driverOnboardingCompleteMarkup, /data-state="complete"/);

const driverOnboardingDisabledMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  disabled: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingDisabledMarkup, /data-state="disabled"/);

const fleetManagerOnboardingDesktopMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  label: "Fleet manager onboarding",
  description: "Complete desktop setup.",
  density: "sm",
  inProgress: true,
  currentStep: 1,
  steps: [{ id: "setup", label: "Setup" }, { id: "review", label: "Review" }, { id: "done", label: "Done" }],
  metrics: [{ key: "progress", label: "Progress", value: "2/3", tone: "info" }],
  tasks: [{ key: "vehicles", label: "Add vehicles", checked: true }, { key: "drivers", label: "Invite drivers" }],
  fields: [{ key: "fleet", label: "Fleet name", value: "North" }],
  selects: [{ key: "region", label: "Region", value: "north", options: [{ label: "North", value: "north" }] }],
  reviewColumns: [{ key: "name", label: "Name" }, { key: "status", label: "Status" }],
  reviewRows: [{ id: "vehicle", name: "MX-4821", status: "Ready" }],
  settings: { label: "Setup settings", groups: [{ label: "Preferences", controls: [{ key: "alerts", kind: "checkbox", label: "Alerts", checked: true }] }] },
  validation: { message: "Review setup before finishing.", state: "warning" },
  primaryAction: { label: "Finish setup" },
  secondaryAction: { label: "Save draft" },
  feedback: { label: "Setup ready", tone: "info" },
  "data-product-hook": "fleet-manager-onboarding-desktop",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(fleetManagerOnboardingDesktopMarkup, /data-flow-pattern="fleet-manager-onboarding-desktop"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-state="in-progress"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-task-count="2"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-review-count="1"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-fleet-manager-onboarding-surface="true"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-settings-boundary="true"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="stepper/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="kpi-tile/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="badge/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="choice checkbox/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="field/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="select-control/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="inline-validation/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-flow-pattern="settings"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="table/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="button button--primary"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="toast/);
assert.doesNotMatch(fleetManagerOnboardingDesktopMarkup, /business-template|product-route|custom-checklist|cloned-settings|dashboard-layout|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fleetManagerValidatingMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  validating: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerValidatingMarkup, /data-state="validating"/);
assert.match(fleetManagerValidatingMarkup, /aria-busy="true"/);

const fleetManagerBlockedMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  blocked: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerBlockedMarkup, /data-state="blocked"/);

const fleetManagerCompleteMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  complete: true,
  tasks: [{ key: "vehicles", label: "Add vehicles", checked: true }],
}));
assert.match(fleetManagerCompleteMarkup, /data-state="complete"/);

const fleetManagerEmptyMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  empty: true,
}));
assert.match(fleetManagerEmptyMarkup, /data-state="empty"/);
assert.match(fleetManagerEmptyMarkup, /class="empty-state/);

const fleetManagerPermissionMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  permissionBlocked: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerPermissionMarkup, /data-state="permission-blocked"/);
assert.match(fleetManagerPermissionMarkup, /Permission required/);

const fleetManagerDisabledMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  disabled: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerDisabledMarkup, /data-state="disabled"/);

const advancedFiltersMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  description: "Refine vehicles before applying.",
  density: "sm",
  open: true,
  dirty: true,
  fields: [
    { key: "unit", kind: "input", label: "Unit", value: "MX", placeholder: "Search unit" },
    { key: "status", kind: "select", label: "Status", value: "active", options: [{ label: "Active", value: "active" }] },
    { key: "service-window", kind: "date-range", label: "Service window", from: "2026-08-01", to: "2026-08-09", open: true },
  ],
  appliedFilters: [
    { key: "active", label: "Status: active", removable: true },
    { key: "window", label: "Service window", removable: true },
  ],
  validation: { label: "Advanced vehicle filters", message: "Review filter combinations.", state: "warning" },
  applyAction: { label: "Apply filters" },
  resetAction: { label: "Reset" },
  savedViews: { triggerLabel: "Saved filters", open: true, items: [{ key: "recent", label: "Recently active" }] },
  overflow: { triggerLabel: "More filter actions", open: true, items: [{ key: "save", label: "Save view" }] },
  feedback: { label: "Filters updated", tone: "success" },
  toolbar: {
    label: "Filter host",
    actions: [{ key: "open", label: "Advanced filters" }],
    filters: [{ key: "status", label: "Status: active" }],
  },
  "data-product-hook": "advanced-filters",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(advancedFiltersMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(advancedFiltersMarkup, /data-state="invalid"/);
assert.match(advancedFiltersMarkup, /data-field-count="3"/);
assert.match(advancedFiltersMarkup, /data-applied-count="2"/);
assert.match(advancedFiltersMarkup, /data-product-hook="advanced-filters"/);
assert.match(advancedFiltersMarkup, /class="drawer/);
assert.match(advancedFiltersMarkup, /data-flow-pattern="toolbar"/);
assert.match(advancedFiltersMarkup, /class="field/);
assert.match(advancedFiltersMarkup, /class="input/);
assert.match(advancedFiltersMarkup, /class="select-control/);
assert.match(advancedFiltersMarkup, /class="field date-picker date-range-picker"/);
assert.match(advancedFiltersMarkup, /class="chip/);
assert.match(advancedFiltersMarkup, /class="badge/);
assert.match(advancedFiltersMarkup, /class="button button--primary"/);
assert.match(advancedFiltersMarkup, /class="inline-validation/);
assert.match(advancedFiltersMarkup, /class="menu/);
assert.match(advancedFiltersMarkup, /class="toast/);
assert.doesNotMatch(advancedFiltersMarkup, /data-flow-pattern="filter-chip-group"|toolbar-owns-filter-editing|custom-filter-chip|query-syntax|fleet-dashboard-suite|configuration-console|template-route|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const advancedFiltersApplyingMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  applying: true,
  fields: [{ label: "Unit", value: "MX" }],
  applyAction: { label: "Apply filters" },
}));
assert.match(advancedFiltersApplyingMarkup, /data-state="applying"/);
assert.match(advancedFiltersApplyingMarkup, /aria-busy="true"/);

const advancedFiltersDirtyMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  dirty: true,
  fields: [{ label: "Unit", value: "MX" }],
}));
assert.match(advancedFiltersDirtyMarkup, /data-state="dirty"/);

const advancedFiltersAppliedMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  appliedFilters: [{ label: "Status: active" }],
}));
assert.match(advancedFiltersAppliedMarkup, /data-state="applied"/);

const advancedFiltersInvalidMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  fields: [{ label: "Unit", error: "Required" }],
}));
assert.match(advancedFiltersInvalidMarkup, /data-state="invalid"/);

const advancedFiltersDisabledMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  disabled: true,
}));
assert.match(advancedFiltersDisabledMarkup, /data-state="disabled"/);

const sectionHeaderMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  description: "Review local assignment state.",
  headingLevel: 3,
  density: "sm",
  badge: { label: "12 ready", tone: "info", variant: "status" },
  tag: { label: "Draft", tone: "warning" },
  dirty: true,
  actions: [{ key: "save", label: "Save", variant: "primary" }],
  overflow: { triggerLabel: "More section actions", open: true, items: [{ key: "export", label: "Export" }] },
  toolbar: { label: "Section actions", actions: [{ key: "refresh", label: "Refresh" }] },
  settings: { groups: [{ title: "Display", controls: [{ label: "Compact view", checked: true }] }] },
  formSection: { title: "Assignment details", fields: [{ label: "Owner", value: "Ana" }] },
  "data-product-hook": "section-header",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(sectionHeaderMarkup, /data-flow-pattern="section-header"/);
assert.match(sectionHeaderMarkup, /data-state="dirty"/);
assert.match(sectionHeaderMarkup, /data-action-count="1"/);
assert.match(sectionHeaderMarkup, /data-product-hook="section-header"/);
assert.match(sectionHeaderMarkup, /<h3>Vehicle assignments<\/h3>/);
assert.match(sectionHeaderMarkup, /class="badge/);
assert.match(sectionHeaderMarkup, /class="tag/);
assert.match(sectionHeaderMarkup, /class="button button--primary"/);
assert.match(sectionHeaderMarkup, /class="menu/);
assert.match(sectionHeaderMarkup, /data-flow-pattern="toolbar"/);
assert.match(sectionHeaderMarkup, /data-flow-pattern="settings"/);
assert.match(sectionHeaderMarkup, /data-flow-pattern="form-section"/);
assert.doesNotMatch(sectionHeaderMarkup, /template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const sectionHeaderLoadingMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  loading: true,
}));
assert.match(sectionHeaderLoadingMarkup, /data-state="loading"/);
assert.match(sectionHeaderLoadingMarkup, /class="skeleton/);
assert.match(sectionHeaderLoadingMarkup, /aria-busy="true"/);

const sectionHeaderActionableMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  actions: [{ label: "Refresh" }],
}));
assert.match(sectionHeaderActionableMarkup, /data-state="actionable"/);

const sectionHeaderPermissionMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  permissionBlocked: true,
}));
assert.match(sectionHeaderPermissionMarkup, /data-state="permission-blocked"/);
assert.match(sectionHeaderPermissionMarkup, /Permission blocked/);

const sectionHeaderDisabledMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  disabled: true,
}));
assert.match(sectionHeaderDisabledMarkup, /data-state="disabled"/);

const actionSheetMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  description: "Choose a contextual trip action.",
  open: true,
  density: "sm",
  actions: [
    { key: "assign", label: "Assign driver", icon: "user", prominent: true },
    { key: "remove", label: "Remove trip", intent: "danger", tone: "danger", description: "Cannot be undone" },
  ],
  overflow: { triggerLabel: "More trip actions", open: true, items: [{ key: "share", label: "Share" }] },
  search: { query: "ana", results: [{ key: "ana", label: "Ana Lopez" }] },
  primaryAction: { label: "Apply action" },
  feedback: { label: "Action ready", tone: "info" },
  "data-product-hook": "action-sheet",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(actionSheetMarkup, /data-flow-pattern="action-sheet"/);
assert.match(actionSheetMarkup, /data-state="destructive"/);
assert.match(actionSheetMarkup, /data-density="sm"/);
assert.match(actionSheetMarkup, /data-action-count="2"/);
assert.match(actionSheetMarkup, /data-search-handoff="true"/);
assert.match(actionSheetMarkup, /data-product-hook="action-sheet"/);
assert.match(actionSheetMarkup, /class="dialog/);
assert.match(actionSheetMarkup, /class="list/);
assert.match(actionSheetMarkup, /class="menu/);
assert.match(actionSheetMarkup, /class="button button--primary"/);
assert.match(actionSheetMarkup, /class="toast/);
assert.match(actionSheetMarkup, /data-flow-pattern="search"/);
assert.match(actionSheetMarkup, /Remove trip/);
assert.doesNotMatch(actionSheetMarkup, /drawer|bottom-sheet|custom-overlay|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const actionSheetClosedMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetClosedMarkup, /data-state="closed"/);
assert.match(actionSheetClosedMarkup, /data-search-handoff="false"/);

const actionSheetLoadingMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  loading: true,
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetLoadingMarkup, /data-state="loading"/);
assert.match(actionSheetLoadingMarkup, /aria-busy="true"/);

const actionSheetDisabledMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  disabled: true,
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetDisabledMarkup, /data-state="disabled"/);

const actionSheetPermissionMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  permissionBlocked: true,
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetPermissionMarkup, /data-state="permission-blocked"/);

const actionSheetErrorMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  error: { label: "Action failed", description: "Try again." },
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetErrorMarkup, /data-state="error"/);
assert.match(actionSheetErrorMarkup, /Action failed/);

const fullscreenSheetMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  description: "Review the mobile task before saving.",
  open: true,
  dirty: true,
  density: "sm",
  summary: { label: "Trip MX-4821", status: "Draft", metrics: [{ label: "Stops", value: "4" }] },
  steps: [{ id: "details", label: "Details" }, { id: "review", label: "Review" }],
  currentStep: 1,
  fields: [
    { key: "driver", label: "Driver", value: "Ana" },
    { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }] },
  ],
  validation: { message: "Unsaved changes remain.", state: "warning" },
  primaryAction: { label: "Save trip" },
  secondaryAction: { label: "Review later" },
  closeAction: { label: "Close" },
  actionSheet: { label: "Secondary actions", actions: [{ key: "delete", label: "Delete", intent: "danger", tone: "danger" }] },
  feedback: { label: "Draft updated", tone: "info" },
  "data-product-hook": "fullscreen-sheet",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(fullscreenSheetMarkup, /data-flow-pattern="fullscreen-sheet"/);
assert.match(fullscreenSheetMarkup, /data-state="dirty"/);
assert.match(fullscreenSheetMarkup, /data-density="sm"/);
assert.match(fullscreenSheetMarkup, /data-field-count="2"/);
assert.match(fullscreenSheetMarkup, /data-action-sheet-boundary="true"/);
assert.match(fullscreenSheetMarkup, /data-product-hook="fullscreen-sheet"/);
assert.match(fullscreenSheetMarkup, /data-flow-primitive="surface"/);
assert.match(fullscreenSheetMarkup, /class="card-summary/);
assert.match(fullscreenSheetMarkup, /class="stepper/);
assert.match(fullscreenSheetMarkup, /class="input"/);
assert.match(fullscreenSheetMarkup, /class="select-control/);
assert.match(fullscreenSheetMarkup, /class="inline-validation/);
assert.match(fullscreenSheetMarkup, /class="button button--primary"/);
assert.match(fullscreenSheetMarkup, /class="toast/);
assert.match(fullscreenSheetMarkup, /data-flow-pattern="action-sheet"/);
assert.doesNotMatch(fullscreenSheetMarkup, /class="card |drawer|bottom-sheet|custom-overlay|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fullscreenSheetClosedMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
}));
assert.match(fullscreenSheetClosedMarkup, /data-state="closed"/);

const fullscreenSheetValidatingMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  validating: true,
  fields: [{ label: "Driver", value: "Ana" }],
}));
assert.match(fullscreenSheetValidatingMarkup, /data-state="validating"/);
assert.match(fullscreenSheetValidatingMarkup, /aria-busy="true"/);

const fullscreenSheetSavingMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  saving: true,
  primaryAction: { label: "Save trip" },
}));
assert.match(fullscreenSheetSavingMarkup, /data-state="saving"/);
assert.match(fullscreenSheetSavingMarkup, /aria-busy="true"/);

const fullscreenSheetErrorMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  error: { label: "Save failed" },
}));
assert.match(fullscreenSheetErrorMarkup, /data-state="error"/);
assert.match(fullscreenSheetErrorMarkup, /Save failed/);

const fullscreenSheetDismissMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  dismissConfirming: true,
}));
assert.match(fullscreenSheetDismissMarkup, /data-state="dismiss-confirming"/);

const fullscreenSheetDisabledMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  disabled: true,
}));
assert.match(fullscreenSheetDisabledMarkup, /data-state="disabled"/);

const helpCenterMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  label: "Fleet help",
  description: "Find support articles without leaving the workflow.",
  density: "sm",
  open: true,
  query: "drivers",
  selectedTopicKey: "drivers",
  topics: [{ key: "drivers", label: "Drivers", count: 4 }, { key: "billing", label: "Billing" }],
  articles: [{ id: "assign-driver", title: "Assign a driver", topic: "Drivers", summary: "Use assignment tools.", open: true }],
  search: { label: "Search help", query: "drivers", results: [{ key: "assign-driver", label: "Assign a driver" }] },
  sidebar: { label: "Help topics" },
  topicInput: { label: "Topic filter", value: "drivers" },
  recovery: { action: { label: "Contact support" } },
  "data-product-hook": "help-center",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(helpCenterMarkup, /data-flow-pattern="help-center"/);
assert.match(helpCenterMarkup, /data-state="topic-selected"/);
assert.match(helpCenterMarkup, /data-topic-count="2"/);
assert.match(helpCenterMarkup, /data-article-count="1"/);
assert.match(helpCenterMarkup, /data-search-boundary="true"/);
assert.match(helpCenterMarkup, /data-sidebar-boundary="true"/);
assert.match(helpCenterMarkup, /data-product-hook="help-center"/);
assert.match(helpCenterMarkup, /data-flow-primitive="surface"/);
assert.match(helpCenterMarkup, /class="drawer/);
assert.match(helpCenterMarkup, /data-flow-pattern="search"/);
assert.match(helpCenterMarkup, /data-flow-pattern="sidebar"/);
assert.match(helpCenterMarkup, /class="input/);
assert.match(helpCenterMarkup, /class="tag/);
assert.match(helpCenterMarkup, /class="accordion/);
assert.doesNotMatch(helpCenterMarkup, /Contact support/);
assert.doesNotMatch(helpCenterMarkup, /help-search|help-sidebar|custom-drawer|custom-help|topic-pill|faq-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const helpCenterLoadingMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  loading: true,
  articles: [{ id: "assign-driver", title: "Assign a driver" }],
}));
assert.match(helpCenterLoadingMarkup, /data-state="loading"/);
assert.match(helpCenterLoadingMarkup, /class="empty-state/);

const helpCenterEmptyMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  empty: true,
  articles: [],
}));
assert.match(helpCenterEmptyMarkup, /data-state="empty"/);
assert.match(helpCenterEmptyMarkup, /class="empty-state/);

const helpCenterErrorMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  error: true,
  articles: [{ id: "assign-driver", title: "Assign a driver" }],
}));
assert.match(helpCenterErrorMarkup, /data-state="error"/);
assert.match(helpCenterErrorMarkup, /class="empty-state/);

const helpCenterDisabledMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  disabled: true,
  articles: [{ id: "assign-driver", title: "Assign a driver" }],
}));
assert.match(helpCenterDisabledMarkup, /data-state="disabled"/);

const drawerAdapterMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  description: "Adapt navigation and task drawer behavior.",
  open: true,
  responsive: true,
  density: "sm",
  drawer: { triggerLabel: "Open operations", closeLabel: "Close operations" },
  dialog: { label: "Review drawer", open: true, actions: [{ key: "close", label: "Close" }] },
  list: { items: [{ key: "routes", label: "Routes" }, { key: "drivers", label: "Drivers" }] },
  cards: [{ title: "Open tasks", value: "12", detail: "Needs review" }],
  menu: { triggerLabel: "Drawer options", open: true, items: [{ key: "pin", label: "Pin drawer" }] },
  actions: [{ key: "apply", label: "Apply", variant: "primary" }],
  topbar: { label: "Operations topbar", mobile: true, search: { label: "Search operations", query: "routes" } },
  sidebar: { groups: [{ title: "Operations", routes: [{ key: "routes", label: "Routes" }] }] },
  multiStepForm: { label: "Task flow boundary" },
  feedback: { label: "Drawer adapted", tone: "info" },
  "data-product-hook": "drawer-adapter",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(drawerAdapterMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(drawerAdapterMarkup, /data-state="responsive"/);
assert.match(drawerAdapterMarkup, /data-density="sm"/);
assert.match(drawerAdapterMarkup, /data-card-count="1"/);
assert.match(drawerAdapterMarkup, /data-list-count="2"/);
assert.match(drawerAdapterMarkup, /data-multi-step-form-boundary="true"/);
assert.match(drawerAdapterMarkup, /data-product-hook="drawer-adapter"/);
assert.match(drawerAdapterMarkup, /class="drawer/);
assert.match(drawerAdapterMarkup, /class="dialog/);
assert.match(drawerAdapterMarkup, /data-flow-primitive="surface"/);
assert.match(drawerAdapterMarkup, /class="list/);
assert.match(drawerAdapterMarkup, /class="card/);
assert.match(drawerAdapterMarkup, /class="menu/);
assert.match(drawerAdapterMarkup, /class="button button--primary"/);
assert.match(drawerAdapterMarkup, /class="toast/);
assert.match(drawerAdapterMarkup, /data-flow-pattern="topbar"/);
assert.match(drawerAdapterMarkup, /data-flow-pattern="sidebar"/);
assert.match(drawerAdapterMarkup, /data-flow-pattern-boundary="multi-step-form"/);
assert.match(drawerAdapterMarkup, /data-flow-pattern="multi-step-form"/);
assert.doesNotMatch(drawerAdapterMarkup, /bottom-sheet|custom-overlay|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const drawerAdapterModalMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  modal: true,
}));
assert.match(drawerAdapterModalMarkup, /data-state="modal"/);

const drawerAdapterNonModalMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  nonModal: true,
}));
assert.match(drawerAdapterNonModalMarkup, /data-state="non-modal"/);

const drawerAdapterLoadingMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  loading: true,
  actions: [{ label: "Apply" }],
}));
assert.match(drawerAdapterLoadingMarkup, /data-state="loading"/);
assert.match(drawerAdapterLoadingMarkup, /aria-busy="true"/);

const drawerAdapterErrorMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  error: { label: "Drawer failed" },
}));
assert.match(drawerAdapterErrorMarkup, /data-state="error"/);
assert.match(drawerAdapterErrorMarkup, /Drawer failed/);

const drawerAdapterDisabledMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  disabled: true,
}));
assert.match(drawerAdapterDisabledMarkup, /data-state="disabled"/);

const quickActionsGridMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  density: "sm",
  actions: [
    { key: "assign", label: "Assign driver", icon: "person", badge: "2", status: { label: "Ready", tone: "success" }, tooltip: { content: "Assigns a driver to the selected trip." } },
    { key: "delete", label: "Delete trip", icon: "delete", intent: "danger", tone: "danger", status: { label: "Needs review", tone: "warning" }, tooltip: { content: "Requires confirmation before deletion." } },
  ],
  search: { label: "Find target", query: "Ana", results: [{ key: "ana", label: "Ana Torres" }] },
  confirmation: { label: "Confirm delete", open: true, actions: [{ key: "cancel", label: "Cancel" }, { key: "delete", label: "Delete", variant: "primary", intent: "danger" }] },
  feedback: { label: "Actions ready", tone: "info" },
  "data-product-hook": "quick-actions-grid",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(quickActionsGridMarkup, /data-flow-pattern="quick-actions-grid"/);
assert.match(quickActionsGridMarkup, /data-state="confirming"/);
assert.match(quickActionsGridMarkup, /data-density="sm"/);
assert.match(quickActionsGridMarkup, /data-action-count="2"/);
assert.match(quickActionsGridMarkup, /data-search-boundary="true"/);
assert.match(quickActionsGridMarkup, /data-product-hook="quick-actions-grid"/);
assert.match(quickActionsGridMarkup, /class="pattern-action-item/);
assert.match(quickActionsGridMarkup, /class="badge/);
assert.match(quickActionsGridMarkup, /class="tooltip/);
assert.match(quickActionsGridMarkup, /class="dialog/);
assert.match(quickActionsGridMarkup, /class="toast/);
assert.match(quickActionsGridMarkup, /data-flow-pattern="search"/);
assert.doesNotMatch(quickActionsGridMarkup, /custom-button|fake-button|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const quickActionsLoadingMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  loading: true,
  actions: [{ label: "Assign driver" }],
}));
assert.match(quickActionsLoadingMarkup, /data-state="loading"/);
assert.match(quickActionsLoadingMarkup, /aria-busy="true"/);

const quickActionsDisabledMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  disabled: true,
  actions: [{ label: "Assign driver" }],
}));
assert.match(quickActionsDisabledMarkup, /data-state="disabled"/);

const quickActionsPermissionMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  permissionBlocked: true,
  actions: [{ label: "Assign driver", status: { label: "Permission needed", tone: "warning" } }],
}));
assert.match(quickActionsPermissionMarkup, /data-state="permission-blocked"/);
assert.match(quickActionsPermissionMarkup, /Permission needed/);

const quickActionsCompletedMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  completed: true,
  feedback: { label: "Done", tone: "success" },
}));
assert.match(quickActionsCompletedMarkup, /data-state="completed"/);
assert.match(quickActionsCompletedMarkup, /Done/);

const quickActionsErrorMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  error: { label: "Action failed" },
}));
assert.match(quickActionsErrorMarkup, /data-state="error"/);
assert.match(quickActionsErrorMarkup, /Action failed/);

const swipeActionsMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  density: "sm",
  revealed: true,
  row: { label: "Fuel charge", meta: "MX-4821", amount: "$82.00", status: "Pending", category: "fuel" },
  actions: [
    { key: "approve", label: "Approve", icon: "check", badge: "1" },
    { key: "decline", label: "Decline", icon: "close", intent: "danger", tone: "danger", fallbackLabel: "Decline without swipe" },
  ],
  confirmation: { label: "Confirm decline", open: true, actions: [{ key: "cancel", label: "Cancel" }, { key: "decline", label: "Decline", intent: "danger" }] },
  recovery: { label: "Action can be undone", tone: "info", actionLabel: "Undo" },
  feedback: { label: "Swipe actions ready", tone: "success" },
  "data-product-hook": "swipe-actions",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(swipeActionsMarkup, /data-flow-pattern="swipe-actions"/);
assert.match(swipeActionsMarkup, /data-state="confirming"/);
assert.match(swipeActionsMarkup, /data-density="sm"/);
assert.match(swipeActionsMarkup, /data-action-count="2"/);
assert.match(swipeActionsMarkup, /data-non-swipe-access="true"/);
assert.match(swipeActionsMarkup, /data-product-hook="swipe-actions"/);
assert.match(swipeActionsMarkup, /class="movement-row/);
assert.match(swipeActionsMarkup, /class="pattern-action-item/);
assert.match(swipeActionsMarkup, /class="button button--secondary"/);
assert.match(swipeActionsMarkup, /without swipe/);
assert.match(swipeActionsMarkup, /class="dialog/);
assert.match(swipeActionsMarkup, /class="toast/);
assert.doesNotMatch(swipeActionsMarkup, /touchstart|pointermove|translateX|custom-button|fake-button|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const swipeActionsRevealedMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  revealed: true,
  row: { label: "Fuel charge" },
  actions: [{ label: "Approve" }],
}));
assert.match(swipeActionsRevealedMarkup, /data-state="revealed"/);

const swipeActionsThresholdMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  threshold: true,
  row: { label: "Fuel charge" },
  actions: [{ label: "Approve" }],
}));
assert.match(swipeActionsThresholdMarkup, /data-state="threshold"/);

const swipeActionsCommittedMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  committed: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsCommittedMarkup, /data-state="committed"/);

const swipeActionsConfirmingMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  confirming: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsConfirmingMarkup, /data-state="confirming"/);

const swipeActionsDisabledMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  disabled: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsDisabledMarkup, /data-state="disabled"/);

const swipeActionsReducedMotionMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  reducedMotion: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsReducedMotionMarkup, /data-state="reduced-motion"/);

const timelineMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  label: "Route audit timeline",
  description: "Chronological audit history.",
  density: "sm",
  filtered: true,
  selectedKey: "delay",
  filters: [{ key: "status", label: "Status: warning", removable: true }],
  status: { label: "2 audit events", tone: "warning" },
  events: [
    { key: "assigned", label: "Driver assigned", actor: "Ana Torres", timestamp: "2026-08-09 09:00", status: "success", statusLabel: "Verified" },
    { key: "delay", label: "Delay reported", description: "Route Centro", timestamp: "2026-08-09 09:30", status: "warning", statusLabel: "Needs review" },
  ],
  clearAction: { label: "Clear filters" },
  "data-product-hook": "timeline",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(timelineMarkup, /data-flow-pattern="timeline"/);
assert.match(timelineMarkup, /data-state="filtered"/);
assert.match(timelineMarkup, /data-event-count="2"/);
assert.match(timelineMarkup, /data-filter-count="1"/);
assert.match(timelineMarkup, /data-product-hook="timeline"/);
assert.match(timelineMarkup, /class="audit-event/);
assert.match(timelineMarkup, /class="list/);
assert.match(timelineMarkup, /class="chip/);
assert.match(timelineMarkup, /class="badge/);
assert.match(timelineMarkup, /class="button button--ghost"/);
assert.doesNotMatch(timelineMarkup, /timeline-card|event-card|event-pill|status-pill|custom-timeline|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const timelineLoadingMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  loading: true,
  events: [{ key: "assigned", label: "Driver assigned" }],
}));
assert.match(timelineLoadingMarkup, /data-state="loading"/);
assert.match(timelineLoadingMarkup, /class="empty-state/);

const timelineEmptyMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  empty: true,
  events: [],
}));
assert.match(timelineEmptyMarkup, /data-state="empty"/);
assert.match(timelineEmptyMarkup, /class="empty-state/);

const timelineErrorMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  error: true,
  events: [{ key: "assigned", label: "Driver assigned" }],
}));
assert.match(timelineErrorMarkup, /data-state="error"/);
assert.match(timelineErrorMarkup, /class="empty-state/);

const timelinePermissionMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  permissionBlocked: true,
  events: [{ key: "assigned", label: "Driver assigned" }],
}));
assert.match(timelinePermissionMarkup, /data-state="permission-blocked"/);
assert.match(timelinePermissionMarkup, /class="empty-state/);

const multiStepFormMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  description: "Complete the reusable step sequence.",
  density: "sm",
  dirty: true,
  steps: [{ id: "profile", label: "Profile" }, { id: "vehicle", label: "Vehicle" }, { id: "review", label: "Review" }],
  currentStep: 1,
  summary: { title: "Onboarding progress" },
  fields: [
    { key: "name", label: "Driver name", value: "Ana" },
    { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }] },
  ],
  formSection: { title: "License details", fields: [{ label: "License number", value: "MX-123" }] },
  validation: { message: "Review license details.", state: "warning" },
  backAction: { label: "Back" },
  saveAction: { label: "Save draft" },
  primaryAction: { label: "Continue" },
  feedback: { label: "Draft saved", tone: "info" },
  "data-product-hook": "multi-step-form",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(multiStepFormMarkup, /data-flow-pattern="multi-step-form"/);
assert.match(multiStepFormMarkup, /data-state="dirty"/);
assert.match(multiStepFormMarkup, /data-density="sm"/);
assert.match(multiStepFormMarkup, /data-step-count="3"/);
assert.match(multiStepFormMarkup, /data-current-step="1"/);
assert.match(multiStepFormMarkup, /data-field-count="2"/);
assert.match(multiStepFormMarkup, /data-form-section-boundary="true"/);
assert.match(multiStepFormMarkup, /data-product-hook="multi-step-form"/);
assert.match(multiStepFormMarkup, /class="stepper/);
assert.match(multiStepFormMarkup, /data-flow-primitive="surface"/);
assert.match(multiStepFormMarkup, /class="card/);
assert.match(multiStepFormMarkup, /class="input"/);
assert.match(multiStepFormMarkup, /class="select-control/);
assert.match(multiStepFormMarkup, /class="inline-validation/);
assert.match(multiStepFormMarkup, /data-flow-pattern="form-section"/);
assert.match(multiStepFormMarkup, /class="button button--primary"/);
assert.match(multiStepFormMarkup, /class="toast/);
assert.doesNotMatch(multiStepFormMarkup, /custom-form|fake-step|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const multiStepNotStartedMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
}));
assert.match(multiStepNotStartedMarkup, /data-state="not-started"/);

const multiStepActiveMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  started: true,
}));
assert.match(multiStepActiveMarkup, /data-state="active"/);

const multiStepValidatingMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  validating: true,
  fields: [{ label: "Driver name", value: "Ana" }],
}));
assert.match(multiStepValidatingMarkup, /data-state="validating"/);
assert.match(multiStepValidatingMarkup, /aria-busy="true"/);

const multiStepInvalidMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  invalid: true,
  validation: { message: "Fix this step.", state: "error" },
}));
assert.match(multiStepInvalidMarkup, /data-state="invalid"/);
assert.match(multiStepInvalidMarkup, /Fix this step/);

const multiStepSavingMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  saving: true,
  primaryAction: { label: "Save" },
}));
assert.match(multiStepSavingMarkup, /data-state="saving"/);
assert.match(multiStepSavingMarkup, /aria-busy="true"/);

const multiStepCompleteMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  complete: true,
  feedback: { label: "Complete", tone: "success" },
}));
assert.match(multiStepCompleteMarkup, /data-state="complete"/);
assert.match(multiStepCompleteMarkup, /Complete/);

const multiStepDisabledMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  disabled: true,
}));
assert.match(multiStepDisabledMarkup, /data-state="disabled"/);

const transferListMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  density: "sm",
  sourceLabel: "Available drivers",
  targetLabel: "Assigned drivers",
  source: [
    { key: "ana", label: "Ana Torres", description: "North", selected: true },
    { key: "luis", label: "Luis Perez", description: "South" },
  ],
  target: [{ key: "mia", label: "Mia Chen", description: "Assigned", selected: true }],
  selectedSourceKeys: ["ana"],
  selectedTargetKeys: ["mia"],
  search: { label: "Search drivers", query: "Ana", results: [{ key: "ana", label: "Ana Torres" }] },
  filterInput: { label: "Filter local drivers", value: "north" },
  multiSelect: { label: "Selected driver ids", options: [{ label: "Ana Torres", value: "ana" }], value: ["ana"] },
  moveToTargetAction: { label: "Assign selected" },
  moveToSourceAction: { label: "Remove selected" },
  validation: { message: "One driver has limited availability.", state: "warning" },
  feedback: { label: "Transfer ready", tone: "info" },
  "data-product-hook": "transfer-list",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(transferListMarkup, /data-flow-pattern="transfer-list"/);
assert.match(transferListMarkup, /data-state="selecting"/);
assert.match(transferListMarkup, /data-density="sm"/);
assert.match(transferListMarkup, /data-source-count="2"/);
assert.match(transferListMarkup, /data-target-count="1"/);
assert.match(transferListMarkup, /data-selected-count="4"/);
assert.match(transferListMarkup, /data-search-boundary="true"/);
assert.match(transferListMarkup, /data-multi-select-boundary="true"/);
assert.match(transferListMarkup, /data-product-hook="transfer-list"/);
assert.match(transferListMarkup, /data-flow-pattern="search"/);
assert.match(transferListMarkup, /data-flow-pattern="multi-select"/);
assert.match(transferListMarkup, /class="list/);
assert.match(transferListMarkup, /class="choice checkbox/);
assert.match(transferListMarkup, /class="badge/);
assert.match(transferListMarkup, /class="field/);
assert.match(transferListMarkup, /class="button button--primary"/);
assert.match(transferListMarkup, /class="inline-validation/);
assert.match(transferListMarkup, /class="toast/);
assert.doesNotMatch(transferListMarkup, /custom-list|fake-checkbox|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const transferListIdleMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  source: [{ label: "Ana Torres" }],
  target: [{ label: "Mia Chen" }],
}));
assert.match(transferListIdleMarkup, /data-state="idle"/);

const transferListTransferringMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  transferring: true,
  source: [{ label: "Ana Torres", selected: true }],
  selectedSourceKeys: ["ana"],
}));
assert.match(transferListTransferringMarkup, /data-state="transferring"/);
assert.match(transferListTransferringMarkup, /aria-busy="true"/);

const transferListPartialMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  partial: true,
  source: [{ label: "Ana Torres" }],
}));
assert.match(transferListPartialMarkup, /data-state="partial"/);

const transferListInvalidMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  invalid: true,
  source: [{ label: "Ana Torres" }],
  validation: { message: "Cannot transfer this record.", state: "error" },
}));
assert.match(transferListInvalidMarkup, /data-state="invalid"/);
assert.match(transferListInvalidMarkup, /Cannot transfer this record/);

const transferListEmptySourceMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  source: [],
  target: [{ label: "Mia Chen" }],
}));
assert.match(transferListEmptySourceMarkup, /data-state="empty-source"/);

const transferListEmptyTargetMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  source: [{ label: "Ana Torres" }],
  target: [],
}));
assert.match(transferListEmptyTargetMarkup, /data-state="empty-target"/);

const transferListDisabledMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  disabled: true,
  source: [{ label: "Ana Torres" }],
}));
assert.match(transferListDisabledMarkup, /data-state="disabled"/);

const stationDiscoveryMarkup = renderToStaticMarkup(React.createElement(StationDiscovery, {
  label: "Nearby stations",
  description: "Choose a station or search manually.",
  permission: "granted",
  density: "sm",
  stations: [
    { id: "centro", label: "Centro Norte", value: "1.2 km", meta: "Open", route: "8 min", selected: true },
    { id: "sur", label: "Sur Express", value: "3.4 km", meta: "Diesel only" },
  ],
  route: {
    label: "Route to Centro Norte",
    eta: "8 min",
    distance: "1.2 km",
    metrics: [{ key: "eta", label: "ETA", value: "8 min" }],
    actions: [{ key: "start", label: "Start route", icon: "navigation" }],
  },
  "data-product-hook": "station-discovery",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(stationDiscoveryMarkup, /data-flow-pattern="station-discovery"/);
assert.match(stationDiscoveryMarkup, /data-flow-primitive="surface"/);
assert.match(stationDiscoveryMarkup, /data-map-primitive="maps"/);
assert.match(stationDiscoveryMarkup, /data-map-layer="true"/);
assert.match(stationDiscoveryMarkup, /data-map-permission="granted"/);
assert.match(stationDiscoveryMarkup, /data-map-runtime="runtimeUnavailable"/);
assert.match(stationDiscoveryMarkup, /data-product-hook="station-discovery"/);
assert.match(stationDiscoveryMarkup, /data-flow-pattern="search"/);
assert.match(stationDiscoveryMarkup, /class="station-pin/);
assert.match(stationDiscoveryMarkup, /class="list/);
assert.match(stationDiscoveryMarkup, /class="route-summary/);
assert.match(stationDiscoveryMarkup, /class="inline-validation/);
assert.doesNotMatch(stationDiscoveryMarkup, /class="card|custom-map|template-route|docs-demo|gold-|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs/i);

const stationDiscoveryDeniedMarkup = renderToStaticMarkup(React.createElement(StationDiscovery, {
  label: "Nearby stations",
  permission: "denied",
  stations: [{ id: "manual", label: "Manual station", value: "Search result", meta: "Fallback" }],
}));
assert.match(stationDiscoveryDeniedMarkup, /data-state="denied"/);
assert.match(stationDiscoveryDeniedMarkup, /Location is off/);
assert.match(stationDiscoveryDeniedMarkup, /class="empty-state/);
assert.match(stationDiscoveryDeniedMarkup, /class="list/);

const statusFeedbackMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  label: "Driver status",
  title: "No status yet",
  description: "Create the first driver status.",
  density: "sm",
  action: { key: "create", label: "Create status" },
  "data-product-hook": "status-feedback",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(statusFeedbackMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(statusFeedbackMarkup, /data-feedback-kind="empty"/);
assert.match(statusFeedbackMarkup, /data-density="sm"/);
assert.match(statusFeedbackMarkup, /data-product-hook="status-feedback"/);
assert.match(statusFeedbackMarkup, /class="empty-state/);
assert.match(statusFeedbackMarkup, /Create status/);
assert.doesNotMatch(statusFeedbackMarkup, /status-view|feedback-shell|status-shell|feedback-banner|notice-banner|status-message-wrapper|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const statusFeedbackErrorMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "error",
  label: "Sync failed",
  description: "Retry driver sync.",
  tone: "critical",
  state: "critical",
}));
assert.match(statusFeedbackErrorMarkup, /data-feedback-kind="error"/);
assert.match(statusFeedbackErrorMarkup, /class="error-panel/);
assert.match(statusFeedbackErrorMarkup, /data-state="critical"/);

const statusFeedbackInlineMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "inline",
  label: "Driver name",
  value: "Ana",
  message: "Name is ready.",
  state: "success",
  field: true,
}));
assert.match(statusFeedbackInlineMarkup, /data-feedback-kind="inline"/);
assert.match(statusFeedbackInlineMarkup, /class="inline-validation/);
assert.match(statusFeedbackInlineMarkup, /data-state="success"/);

const statusFeedbackToastMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "toast",
  label: "Saved",
  description: "Driver status saved.",
  state: "success",
}));
assert.match(statusFeedbackToastMarkup, /data-feedback-kind="toast"/);
assert.match(statusFeedbackToastMarkup, /class="toast/);
assert.match(statusFeedbackToastMarkup, /data-tone="success"/);

const statusFeedbackNotificationMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "notifications",
  label: "Driver notifications",
  open: true,
  notifications: [{ key: "risk", label: "Risk review", unread: true }],
}));
assert.match(statusFeedbackNotificationMarkup, /data-feedback-kind="notifications"/);
assert.match(statusFeedbackNotificationMarkup, /data-flow-pattern="notification-panel"/);
assert.match(statusFeedbackNotificationMarkup, /Risk review/);

const statusFeedbackSnackbarMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "snackbar",
  label: "Queue",
  messages: [{ key: "saved", label: "Saved to queue", tone: "success" }],
}));
assert.match(statusFeedbackSnackbarMarkup, /data-feedback-kind="snackbar"/);
assert.match(statusFeedbackSnackbarMarkup, /data-flow-pattern="snackbar-provider"/);
assert.match(statusFeedbackSnackbarMarkup, /Saved to queue/);

const paymentFormMarkup = renderToStaticMarkup(React.createElement(PaymentForm, {
  label: "Card payment",
  description: "Capture card details and amount.",
  density: "sm",
  state: "review",
  cardNumber: { value: "4242424242424242", helper: "Use the driver card." },
  expiry: { value: "1228" },
  securityCode: { value: "123", revealable: true },
  amount: { value: "820", currency: "MXN", helper: "Fuel authorization amount." },
  validation: { message: "Review card details before continuing.", state: "info" },
  feedback: { kind: "toast", title: "Ready for review", description: "Card details are complete.", state: "success" },
  submitAction: { key: "continue", label: "Continue" },
  secondaryAction: { key: "cancel", label: "Cancel" },
  "data-product-hook": "payment-form",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(paymentFormMarkup, /data-flow-pattern="payment-form"/);
assert.match(paymentFormMarkup, /data-flow-slot="paymentSurface"/);
assert.match(paymentFormMarkup, /data-flow-slot="card-fields"/);
assert.match(paymentFormMarkup, /data-flow-slot="amount-fields"/);
assert.match(paymentFormMarkup, /class="field card-number-input"/);
assert.match(paymentFormMarkup, /class="field card-expiry-input"/);
assert.match(paymentFormMarkup, /class="field card-security-code-input"/);
assert.match(paymentFormMarkup, /class="field input-amount"/);
assert.match(paymentFormMarkup, /class="inline-validation/);
assert.match(paymentFormMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(paymentFormMarkup, /class="button/);
assert.doesNotMatch(paymentFormMarkup, /class="card(?:\\s|")|payment-field|card-input-group|payment-shell|raw-payment-input|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const denseOperationalListMarkup = renderToStaticMarkup(React.createElement(DenseOperationalList, {
  label: "Accounts operations",
  description: "Open operational records",
  density: "sm",
  selectedKeys: ["acct-1"],
  filters: [{ key: "risk", label: "Risk review" }],
  resultCount: 1,
  search: { query: "ana", placeholder: "Search accounts" },
  toolbar: {
    actions: [{ key: "export", label: "Export" }],
    overflow: { triggerLabel: "More list actions", items: [{ key: "columns", label: "Columns" }], open: true },
  },
  bulkActions: {
    actions: [{ key: "assign", label: "Assign reviewer" }],
  },
  table: {
    columns: [
      { key: "label", label: "Account", sortable: true },
      { key: "status", label: "Status" },
    ],
    rows: [{ id: "acct-1", label: "Ana Torres", status: { label: "Review", tone: "warning" } }],
    page: 1,
    pageCount: 2,
  },
  feedback: { kind: "inline", message: "1 record needs review.", state: "warning" },
  "data-product-hook": "dense-operational-list",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(denseOperationalListMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(denseOperationalListMarkup, /data-flow-primitive="surface"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="listSurface"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="searchBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="summary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="filterSummary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="toolbarBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="bulkActionsBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="tableBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="search"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="filter-chip-group"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="toolbar"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="bulk-actions"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(denseOperationalListMarkup, /class="table/);
assert.match(denseOperationalListMarkup, /data-density="sm"/);
assert.doesNotMatch(denseOperationalListMarkup, /class="card(?:\\s|")|operational-card-row|dense-list-row|fake-toolbar|fake-filter-chip|local-status-shell|raw-table-shell|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const agentConversationMarkup = renderToStaticMarkup(React.createElement(AgentConversation, {
  label: "Agent support",
  description: "Support conversation",
  density: "sm",
  handoff: {
    active: true,
    title: "Specialist joining",
    description: "A teammate can review the conversation.",
    action: { key: "handoff", label: "Open handoff" },
  },
  thread: {
    messages: [
      { key: "m1", author: "user", body: "I need help with billing.", timestamp: "09:00" },
      { key: "m2", author: "agent", authorLabel: "Flow Assist", body: "I can help review that.", action: { label: "Retry answer" } },
    ],
  },
  composer: {
    defaultValue: "Thanks",
    attachLabel: "Attach file",
    sendLabel: "Send message",
  },
  "data-product-hook": "agent-conversation",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(agentConversationMarkup, /data-flow-pattern="agent-conversation"/);
assert.match(agentConversationMarkup, /data-flow-primitive="surface"/);
assert.match(agentConversationMarkup, /data-flow-slot="conversationSurface"/);
assert.match(agentConversationMarkup, /data-flow-slot="thread"/);
assert.match(agentConversationMarkup, /data-flow-slot="handoffFeedback"/);
assert.match(agentConversationMarkup, /data-flow-slot="composer"/);
assert.match(agentConversationMarkup, /data-flow-component="chat-thread"/);
assert.match(agentConversationMarkup, /data-flow-component="chat-message"/);
assert.match(agentConversationMarkup, /data-flow-component="chat-composer"/);
assert.match(agentConversationMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(agentConversationMarkup, /data-conversation-state="handoff"/);
assert.match(agentConversationMarkup, /data-density="sm"/);
assert.doesNotMatch(agentConversationMarkup, /class="card(?:\\s|")|fake-chat-bubble|agent-chat-shell|raw-message-shell|raw-composer|local-handoff|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const configurationConsoleMarkup = renderToStaticMarkup(React.createElement(ConfigurationConsole, {
  label: "Configuration console",
  density: "sm",
  selectedModule: "drivers",
  state: "loaded",
  "data-product-hook": "configuration-console",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(configurationConsoleMarkup, /data-flow-template="configuration-console"/);
assert.match(configurationConsoleMarkup, /data-flow-primitive="surface"/);
assert.match(configurationConsoleMarkup, /data-selected-module="drivers"/);
assert.match(configurationConsoleMarkup, /data-product-hook="configuration-console"/);
assert.match(configurationConsoleMarkup, /data-template-slot="global-shell"/);
assert.match(configurationConsoleMarkup, /data-template-slot="navigation-region"/);
assert.match(configurationConsoleMarkup, /data-template-slot="workspace"/);
assert.match(configurationConsoleMarkup, /data-template-module="permission-matrix"/);
assert.match(configurationConsoleMarkup, /data-template-module="driver-lifecycle-table"/);
assert.match(configurationConsoleMarkup, /data-template-module="vehicle-lifecycle-table"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="topbar"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="sidebar"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="roles-and-permissions"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="driver-and-vehicle-administration"/);
assert.match(configurationConsoleMarkup, /data-density="sm"/);
assert.doesNotMatch(configurationConsoleMarkup, /docs-demo|gold-|apps\/docs|document\.createElement|custom-template|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const configurationConsolePermissionMarkup = renderToStaticMarkup(React.createElement(ConfigurationConsole, {
  density: "md",
  state: "permission",
  authentication: {
    label: "Admin authentication",
    primaryAction: { label: "Continue" },
  },
}));

assert.match(configurationConsolePermissionMarkup, /data-state="permission"/);
assert.match(configurationConsolePermissionMarkup, /data-flow-pattern="authentication-login-biometrics-and-otp"/);
assert.match(configurationConsolePermissionMarkup, /data-template-module="authentication-gate"/);
assert.match(configurationConsolePermissionMarkup, /data-state="permission-blocked"/);

console.log("react pattern render tests passed for SelectOptionLayer, FilterChipGroup, FilterableEditableTable, ExpandableDetailTable, AvatarGroup, AvatarMenu, SnackbarProvider, Autocomplete, AuthenticationLoginBiometricsAndOtp, KpiCard, ConfirmationDialog, FileUpload, MultiSelect, FormSection, MultiStepForm, RolesAndPermissions, VirtualDataTable, Search, NotificationPanel, PaymentForm, DenseOperationalList, AccountOperations, TicketQueue, CaseManagement, AgentConversation, PreferenceManagement, PullToRefresh, CommandPalette, Settings, Sidebar, Topbar, Toolbar, TransferList, BulkActions, CalendarView, ChartWrapper, ColumnConfigurator, DragSortableList, DriverAndVehicleAdministration, DriverOnboardingMobile, FleetManagerOnboardingDesktop, AdvancedFilters, SectionHeader, ActionSheet, FullscreenSheet, HelpCenter, DrawerAdapter, EmailTemplateLayout, QuickActionsGrid, SwipeActions, StationDiscovery, StatusFeedbackView, Timeline, and ConfigurationConsole");
