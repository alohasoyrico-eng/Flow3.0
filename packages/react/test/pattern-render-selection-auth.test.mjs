import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SelectOptionLayer } from "../dist/patterns/SelectOptionLayer.js";
import { FilterChipGroup } from "../dist/patterns/FilterChipGroup.js";
import { AvatarGroup } from "../dist/patterns/AvatarGroup.js";
import { SnackbarProvider } from "../dist/patterns/SnackbarProvider.js";
import { AvatarMenu } from "../dist/patterns/AvatarMenu.js";
import { Autocomplete } from "../dist/patterns/Autocomplete.js";
import { AuthenticationLoginBiometricsAndOtp } from "../dist/patterns/AuthenticationLoginBiometricsAndOtp.js";

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


console.log("react pattern selection auth render tests passed");
