import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Avatar, Badge, Card } from "../dist/index.js";

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
assert.match(selectedCardMarkup, /^<div/);
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
assert.match(avatarMarkup, /style="--comp-avatar-identity-bg:var\(--comp-avatar-identity-[a-z-]+-bg\);--comp-avatar-identity-fg:var\(--comp-avatar-identity-[a-z-]+-fg\)"/);
assert.doesNotMatch(avatarMarkup, /data-color-index=/);
assert.match(avatarMarkup, /class="avatar__initials"/);
assert.match(avatarMarkup, />AS<\/span>/);
assert.match(avatarMarkup, /class="avatar__status"/);
assert.match(avatarMarkup, /role="img"/);
assert.match(avatarMarkup, /aria-label="En linea"/);

const imageAvatarMarkup = renderToStaticMarkup(React.createElement(Avatar, {
  name: "Luis Vera",
  src: "/avatars/luis.png",
  density: "xl",
  state: "disabled",
}));
assert.match(imageAvatarMarkup, /class="avatar"/);
assert.match(imageAvatarMarkup, /data-density="xl"/);
assert.doesNotMatch(imageAvatarMarkup, /avatar--/);
assert.match(imageAvatarMarkup, /data-state="disabled"/);
assert.match(imageAvatarMarkup, /src="\/avatars\/luis.png"/);
assert.match(imageAvatarMarkup, /alt="Luis Vera"/);
const unnamedAvatarMarkup = renderToStaticMarkup(React.createElement(Avatar));
assert.equal(unnamedAvatarMarkup, "");
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


console.log("react surface status render tests passed");
