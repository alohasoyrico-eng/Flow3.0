import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Checkbox,
  Chip,
  CodeInput,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const checkboxChanges = [];
  const { getByLabelText: getCheckboxLabel, rerender: rerenderCheckbox } = render(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    indeterminate: true,
    onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
  }));

  const checkboxInput = getCheckboxLabel(/enable fuel card/i);
  assert.equal(checkboxInput.indeterminate, true);
  assert.equal(checkboxInput.getAttribute("aria-checked"), "mixed");

  fireEvent.click(checkboxInput);
  await waitFor(() => assert.equal(checkboxInput.checked, true));
  assert.equal(checkboxInput.indeterminate, false);
  assert.equal(checkboxInput.getAttribute("aria-checked"), "true");
  assert.equal(checkboxChanges.at(-1).checked, true);
  assert.deepEqual(checkboxChanges.at(-1).meta, { indeterminate: false, value: "fuel-card" });
  assert.equal(checkboxChanges.at(-1).eventType, "change");

  rerenderCheckbox(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    checked: false,
    onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(checkboxInput.checked, false));
  await waitFor(() => assert.equal(checkboxInput.getAttribute("aria-checked"), "false"));
  fireEvent.click(checkboxInput);
  assert.equal(checkboxChanges.at(-1).checked, true);
  await waitFor(() => assert.equal(checkboxInput.checked, false));
  rerenderCheckbox(React.createElement(Checkbox, {
    label: "Enable fuel card",
    value: "fuel-card",
    checked: true,
    onCheckedChange: (checked, meta, event) => checkboxChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(checkboxInput.checked, true));

  cleanup();

  const removedChips = [];
  const { getByRole: getChipRole } = render(React.createElement(Chip, {
    label: "Active",
    removable: true,
    onRemoveLabel: "Remove Active",
    onRemove: (label, event) => removedChips.push({ label, eventType: event.type }),
  }));

  fireEvent.click(getChipRole("button", { name: /remove active/i }));
  assert.deepEqual(removedChips, [{ label: "Active", eventType: "click" }]);

  cleanup();

  const removableSelectedChips = [];
  const removableSelectedRemovals = [];
  const { getByRole: getRemovableSelectedRole } = render(React.createElement(Chip, {
    label: "Route",
    selected: false,
    removable: true,
    onRemoveLabel: "Remove Route",
    onSelectedChange: (selected, event) => removableSelectedChips.push({ selected, eventType: event.type }),
    onRemove: (label, event) => removableSelectedRemovals.push({ label, eventType: event.type }),
  }));

  fireEvent.click(getRemovableSelectedRole("button", { name: /^route$/i }));
  assert.deepEqual(removableSelectedChips, [{ selected: true, eventType: "click" }]);
  assert.deepEqual(removableSelectedRemovals, []);
  fireEvent.click(getRemovableSelectedRole("button", { name: /remove route/i }));
  assert.deepEqual(removableSelectedChips, [{ selected: true, eventType: "click" }]);
  assert.deepEqual(removableSelectedRemovals, [{ label: "Route", eventType: "click" }]);

  cleanup();

  const selectedChips = [];
  const { getByRole: getSelectableChipRole } = render(React.createElement(Chip, {
    label: "EV",
    selected: false,
    onSelectedChange: (selected, event) => selectedChips.push({ selected, eventType: event.type }),
  }));

  const selectableChip = getSelectableChipRole("button", { name: /ev/i });
  assert.equal(selectableChip.getAttribute("aria-pressed"), "false");
  fireEvent.click(selectableChip);
  assert.deepEqual(selectedChips, [{ selected: true, eventType: "click" }]);

  cleanup();

  const preventedChipChanges = [];
  const { getByRole: getPreventedChipRole } = render(React.createElement(Chip, {
    label: "Prevented",
    onClick: (event) => event.preventDefault(),
    onSelectedChange: (selected) => preventedChipChanges.push(selected),
  }));

  fireEvent.click(getPreventedChipRole("button", { name: /prevented/i }));
  assert.deepEqual(preventedChipChanges, []);

  cleanup();

  const codeValues = [];
  const completedCodes = [];
  const { getByLabelText: getCodeLabel, rerender: rerenderCodeInput } = render(React.createElement(CodeInput, {
    label: "SMS code",
    length: 4,
    onValueChange: (value, meta, event) => codeValues.push({ value, meta, eventType: event.type }),
    onComplete: (value, meta, event) => completedCodes.push({ value, meta, eventType: event.type }),
  }));

  const codeInput = getCodeLabel(/sms code/i);
  fireEvent.focus(codeInput);
  fireEvent.input(codeInput, { target: { value: "12a34" } });

  await waitFor(() => assert.equal(codeInput.value, "1234"));
  assert.deepEqual(codeValues, [{ value: "1234", meta: { value: "1234", length: 4, complete: true }, eventType: "change" }]);
  assert.deepEqual(completedCodes, [{ value: "1234", meta: { value: "1234", length: 4, complete: true }, eventType: "change" }]);

  rerenderCodeInput(React.createElement(CodeInput, {
    label: "SMS code",
    length: 4,
    value: "9876",
    onValueChange: (value, meta, event) => codeValues.push({ value, meta, eventType: event.type }),
    onComplete: (value, meta, event) => completedCodes.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(codeInput.value, "9876"));
  fireEvent.input(codeInput, { target: { value: "1111" } });
  assert.deepEqual(codeValues.at(-1), { value: "1111", meta: { value: "1111", length: 4, complete: true }, eventType: "change" });
  await waitFor(() => assert.equal(codeInput.value, "9876"));
  rerenderCodeInput(React.createElement(CodeInput, {
    label: "SMS code",
    length: 4,
    value: "1111",
    onValueChange: (value, meta, event) => codeValues.push({ value, meta, eventType: event.type }),
    onComplete: (value, meta, event) => completedCodes.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(codeInput.value, "1111"));

  cleanup();

  const codeInputFocusEvents = [];
  const { container: preventedCodeInputContainer, getByLabelText: getPreventedCodeLabel } = render(React.createElement(CodeInput, {
    label: "Prevented SMS code",
    length: 4,
    onFocus: (event) => {
      codeInputFocusEvents.push(event.type);
      event.preventDefault();
    },
    onBlur: (event) => {
      codeInputFocusEvents.push(event.type);
      event.preventDefault();
    },
  }));

  const preventedCodeInput = getPreventedCodeLabel(/prevented sms code/i);
  fireEvent.focus(preventedCodeInput);
  assert.deepEqual(codeInputFocusEvents, ["focus"]);
  assert.equal(preventedCodeInputContainer.querySelector(".code-input")?.getAttribute("data-focused"), "false");
  fireEvent.blur(preventedCodeInput);
  assert.deepEqual(codeInputFocusEvents, ["focus", "blur"]);
  assert.equal(preventedCodeInputContainer.querySelector(".code-input")?.getAttribute("data-focused"), "false");

  cleanup();
  console.log("interaction choice inputs passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
