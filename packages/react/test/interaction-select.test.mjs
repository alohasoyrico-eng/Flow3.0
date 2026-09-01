import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Select,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const selectChanges = [];
  const selectOpenChanges = [];
  const { getByRole: getSelectRole, rerender: rerenderSelect } = render(React.createElement(Select, {
    label: "Country",
    value: "mx",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta, event) => selectChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const selectTrigger = getSelectRole("combobox", { name: /country/i });
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(selectTrigger);
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(selectOpenChanges, [{ open: true, eventType: "click", key: undefined }]);

  fireEvent.click(getSelectRole("option", { name: /canada/i }));
  assert.deepEqual(selectChanges, []);

  fireEvent.click(getSelectRole("option", { name: /united states/i }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(selectChanges, [{ value: "us", meta: { label: "United States", meta: "+1" }, eventType: "click" }]);
  assert.equal(selectTrigger.textContent.includes("Mexico"), true);
  assert.deepEqual(selectOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
  ]);

  fireEvent.keyDown(selectTrigger, { key: "ArrowDown" });
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "true");
  const mexicoOption = getSelectRole("option", { name: /mexico/i });
  const unitedStatesOption = getSelectRole("option", { name: /united states/i });
  assert.equal(mexicoOption.querySelector(".select-control__option-check")?.textContent, "check");
  assert.equal(selectTrigger.getAttribute("aria-activedescendant"), mexicoOption.id);
  assert.equal(mexicoOption.getAttribute("data-active"), "true");
  fireEvent.keyDown(selectTrigger, { key: "ArrowUp" });
  assert.equal(selectTrigger.getAttribute("aria-activedescendant"), unitedStatesOption.id);
  assert.equal(unitedStatesOption.getAttribute("data-active"), "true");
  fireEvent.keyDown(selectTrigger, { key: "ArrowUp" });
  assert.equal(selectTrigger.getAttribute("aria-activedescendant"), mexicoOption.id);
  assert.equal(mexicoOption.getAttribute("data-active"), "true");
  fireEvent.keyDown(selectTrigger, { key: "ArrowDown" });
  assert.equal(selectTrigger.getAttribute("aria-activedescendant"), unitedStatesOption.id);
  assert.equal(unitedStatesOption.getAttribute("data-active"), "true");
  fireEvent.keyDown(selectTrigger, { key: "Enter" });
  assert.equal(selectTrigger.getAttribute("aria-expanded"), "false");
  assert.deepEqual(selectChanges.at(-1), { value: "us", meta: { label: "United States", meta: "+1" }, eventType: "keydown" });

  rerenderSelect(React.createElement(Select, {
    label: "Country",
    value: "mx",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta, event) => selectChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(selectTrigger.textContent.includes("Mexico"), true));
  rerenderSelect(React.createElement(Select, {
    label: "Country",
    value: "us",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "Canada", value: "ca", meta: "+1", disabled: true },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onValueChange: (value, meta, event) => selectChanges.push({ value, meta, eventType: event.type }),
    onOpenChange: (open, event) => selectOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(selectTrigger.textContent.includes("United States"), true));

  rerenderSelect(React.createElement(Select, {
    label: "Country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    open: true,
  }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-expanded"), "true"));
  rerenderSelect(React.createElement(Select, {
    label: "Country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    open: false,
  }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-expanded"), "false"));
  rerenderSelect(React.createElement(Select, {
    label: "Country",
    value: "mx",
    state: "loading",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
  }));
  await waitFor(() => assert.equal(selectTrigger.getAttribute("aria-busy"), "true"));
  assert.equal(selectTrigger.textContent.includes("progress_activity"), true);

  cleanup();

  const selectTriggerEvents = [];
  const { getByRole: getNativeSelectRole } = render(React.createElement(Select, {
    label: "Native country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onClick: (event) => selectTriggerEvents.push(event.type),
    onKeyDown: (event) => selectTriggerEvents.push(event.key),
  }));

  const nativeSelectTrigger = getNativeSelectRole("combobox", { name: /native country/i });
  fireEvent.click(nativeSelectTrigger);
  fireEvent.keyDown(nativeSelectTrigger, { key: "Escape" });
  assert.deepEqual(selectTriggerEvents, ["click", "Escape"]);
  assert.equal(nativeSelectTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const preventedSelectTriggerEvents = [];
  const { getByRole: getPreventedSelectRole } = render(React.createElement(Select, {
    label: "Prevented country",
    options: [
      { label: "Mexico", value: "mx", meta: "+52" },
      { label: "United States", value: "us", meta: "+1" },
    ],
    onClick: (event) => {
      preventedSelectTriggerEvents.push(event.type);
      event.preventDefault();
    },
    onKeyDown: (event) => {
      preventedSelectTriggerEvents.push(event.key);
      event.preventDefault();
    },
  }));

  const preventedSelectTrigger = getPreventedSelectRole("combobox", { name: /prevented country/i });
  fireEvent.click(preventedSelectTrigger);
  fireEvent.keyDown(preventedSelectTrigger, { key: "ArrowDown" });
  assert.deepEqual(preventedSelectTriggerEvents, ["click", "ArrowDown"]);
  assert.equal(preventedSelectTrigger.getAttribute("aria-expanded"), "false");

  cleanup();
  console.log("interaction select passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
