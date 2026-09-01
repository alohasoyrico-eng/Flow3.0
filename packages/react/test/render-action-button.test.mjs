import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "../dist/index.js";

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
assert.doesNotMatch(loadingMarkup.match(/^<button[^>]+>/)?.[0] ?? "", /data-density=/);
assert.match(loadingMarkup, /class="spinner"/);
assert.match(loadingMarkup, /class="spinner__svg"/);
assert.match(loadingMarkup, /class="spinner__arc"/);

const warningMarkup = renderToStaticMarkup(React.createElement(Button, {
  label: "Review warning",
  intent: "warning",
}));
assert.match(warningMarkup, /class="button button--primary button--warning"/);

const dangerMarkup = renderToStaticMarkup(React.createElement(Button, {
  label: "Delete route",
  intent: "danger",
}));
assert.match(dangerMarkup, /class="button button--primary button--danger"/);


console.log("react action button render tests passed");
