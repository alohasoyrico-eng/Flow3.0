export function createSpinner({
  label = "Loading",
  density = "md",
  tone = "accent",
  state = "loading",
  decorative = false,
} = {}) {
  const spinner = document.createElement("span");
  spinner.className = "spinner";
  spinner.dataset.density = density;
  spinner.dataset.tone = tone;
  spinner.dataset.state = state;

  const svg = document.createElement("svg");
  svg.className = "spinner__svg";
  svg.setAttribute("viewBox", "0 0 40 40");
  svg.setAttribute("focusable", "false");
  svg.setAttribute("aria-hidden", "true");

  const track = document.createElement("circle");
  track.className = "spinner__track";
  track.setAttribute("cx", "20");
  track.setAttribute("cy", "20");
  track.setAttribute("r", "16");
  track.setAttribute("pathLength", "100");

  const arc = document.createElement("circle");
  arc.className = "spinner__arc";
  arc.setAttribute("cx", "20");
  arc.setAttribute("cy", "20");
  arc.setAttribute("r", "16");
  arc.setAttribute("pathLength", "100");

  svg.append(track, arc);
  spinner.append(svg);

  if (decorative || state === "decorative") {
    spinner.setAttribute("aria-hidden", "true");
  } else {
    spinner.setAttribute("role", "status");
    spinner.setAttribute("aria-label", label);
  }
  return spinner;
}
