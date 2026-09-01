import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Slider,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const sliderChanges = [];
  const { getByRole: getSliderRole, getByText: getSliderText, rerender: rerenderSlider } = render(React.createElement(Slider, {
    label: "Search radius",
    min: 0,
    max: 20,
    step: 1,
    unit: " km",
    name: "radius",
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));

  const sliderInput = getSliderRole("slider", { name: /search radius/i });
  fireEvent.input(sliderInput, { target: { value: "12" } });
  await waitFor(() => assert.equal(sliderInput.value, "12"));
  getSliderText("12 km");
  assert.deepEqual(sliderChanges, [{ value: 12, meta: { name: "radius", min: 0, max: 20, step: 1, unit: " km" }, eventType: "change" }]);

  rerenderSlider(React.createElement(Slider, {
    label: "Search radius",
    value: 12,
    min: 0,
    max: 20,
    disabled: true,
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));

  fireEvent.input(getSliderRole("slider", { name: /search radius/i }), { target: { value: "14" } });
  assert.equal(sliderChanges.length, 1);
  rerenderSlider(React.createElement(Slider, {
    label: "Search radius",
    value: 12,
    min: 0,
    max: 20,
    step: 1,
    unit: " km",
    name: "radius",
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));
  fireEvent.input(sliderInput, { target: { value: "14" } });
  assert.deepEqual(sliderChanges.at(-1), { value: 14, meta: { name: "radius", min: 0, max: 20, step: 1, unit: " km" }, eventType: "change" });
  await waitFor(() => assert.equal(sliderInput.value, "12"));
  getSliderText("12 km");
  rerenderSlider(React.createElement(Slider, {
    label: "Search radius",
    value: 14,
    min: 0,
    max: 20,
    step: 1,
    unit: " km",
    name: "radius",
    onValueChange: (value, meta, event) => sliderChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(sliderInput.value, "14"));
  getSliderText("14 km");

  cleanup();
  console.log("interaction slider passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
