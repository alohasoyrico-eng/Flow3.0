import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  RadioButton,
  SegmentedControl,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const radioChanges = [];
  const { getByLabelText: getRadioLabel, rerender: rerenderRadio } = render(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));

  const radioInput = getRadioLabel(/card payment/i);
  assert.equal(radioInput.checked, false);
  fireEvent.click(radioInput);
  await waitFor(() => assert.equal(radioInput.checked, true));
  assert.deepEqual(radioChanges, [{ checked: true, meta: { value: "card" }, eventType: "change" }]);

  rerenderRadio(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    checked: false,
    disabled: true,
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));

  await waitFor(() => assert.equal(radioInput.checked, false));
  fireEvent.click(getRadioLabel(/card payment/i));
  assert.deepEqual(radioChanges, [{ checked: true, meta: { value: "card" }, eventType: "change" }]);
  rerenderRadio(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    checked: false,
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));
  fireEvent.click(radioInput);
  assert.deepEqual(radioChanges.at(-1), { checked: true, meta: { value: "card" }, eventType: "change" });
  await waitFor(() => assert.equal(radioInput.checked, false));
  rerenderRadio(React.createElement(RadioButton, {
    label: "Card payment",
    name: "payment",
    value: "card",
    checked: true,
    onCheckedChange: (checked, meta, event) => radioChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(radioInput.checked, true));

  cleanup();

  const segmentChanges = [];
  const { getByRole: getSegmentRole, rerender: rerenderSegmentedControl } = render(React.createElement(SegmentedControl, {
    label: "View mode",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key, event) => segmentChanges.push({ key, eventType: event.type }),
  }));

  const listSegment = getSegmentRole("tab", { name: /list/i });
  const timelineSegment = getSegmentRole("tab", { name: /timeline/i });
  assert.equal(listSegment.getAttribute("aria-selected"), "true");
  fireEvent.click(timelineSegment);
  await waitFor(() => assert.equal(timelineSegment.getAttribute("aria-selected"), "true"));
  assert.deepEqual(segmentChanges, [{ key: "timeline", eventType: "click" }]);

  fireEvent.keyDown(listSegment, { key: "ArrowRight" });
  assert.deepEqual(segmentChanges, [{ key: "timeline", eventType: "click" }, { key: "list", eventType: "keydown" }]);

  rerenderSegmentedControl(React.createElement(SegmentedControl, {
    label: "View mode",
    selectedKey: "list",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key, event) => segmentChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(listSegment.getAttribute("aria-selected"), "true"));
  fireEvent.click(timelineSegment);
  assert.deepEqual(segmentChanges.at(-1), { key: "timeline", eventType: "click" });
  assert.equal(timelineSegment.getAttribute("aria-selected"), "false");
  rerenderSegmentedControl(React.createElement(SegmentedControl, {
    label: "View mode",
    selectedKey: "timeline",
    items: [
      { key: "list", label: "List" },
      { key: "map", label: "Map", disabled: true },
      { key: "timeline", label: "Timeline" },
    ],
    onValueChange: (key, event) => segmentChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(timelineSegment.getAttribute("aria-selected"), "true"));

  cleanup();

  const preventedSegmentChanges = [];
  const preventedSegmentEvents = [];
  const { getByRole: getPreventedSegmentRole } = render(React.createElement(SegmentedControl, {
    label: "Prevented view mode",
    items: [
      { key: "list", label: "List" },
      {
        key: "timeline",
        label: "Timeline",
        onClick: (event) => {
          preventedSegmentEvents.push(event.type);
          event.preventDefault();
        },
        onKeyDown: (event) => {
          preventedSegmentEvents.push(event.key);
          event.preventDefault();
        },
      },
    ],
    onValueChange: (key, event) => preventedSegmentChanges.push({ key, eventType: event.type }),
  }));

  const preventedTimelineSegment = getPreventedSegmentRole("tab", { name: /timeline/i });
  fireEvent.click(preventedTimelineSegment);
  fireEvent.keyDown(preventedTimelineSegment, { key: "ArrowLeft" });
  assert.deepEqual(preventedSegmentEvents, ["click", "ArrowLeft"]);
  assert.deepEqual(preventedSegmentChanges, []);

  cleanup();
  console.log("interaction choice controls passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
