# Choice Current Local Review

Date: 2026-08-19

Scope: checkbox, radio-button, switch, combobox local interactive demos.

## Evidence

- `npm run audit:flow-core-gate`: pass.
- `npm run audit:choice-frame-runtime`: pass, including light/dark rendered mark/label top alignment, radio rest ring, selected dot scale, unchecked dot hiding, and switch off/on thumb motion.
- `npm run audit:option-listbox-runtime`: pass, including light/dark option-row parity across Select, Combobox, and Menu.
- Local demos read `Flow3.0/packages/components/styles/components.css`.

## Checkbox

- Choice root now renders as `display: grid` with `align-items: start`.
- Descriptive/select-all rows align the mark to the first label line instead of the full copy block.
- Current Playwright measurement after the fix:
  - `display`: grid.
  - `alignItems`: start.
  - descriptive `deltaTop`: 0.
  - descriptive `deltaCenter`: 1.
  - sm/md/lg mark sizes remain 16/24/36.
  - sm/md/lg indicator font sizes remain 16/20/24 through `audit:choice-frame-runtime`.
  - `markTopDelta`: 0 in sm/md/lg through `audit:choice-frame-runtime`.

Decision: checkbox current label-alignment and density/icon issues are closed.

## Radio Button

- Choice root alignment fix applies to radio-button too.
- Current Playwright measurement after the fix:
  - `display`: grid.
  - `alignItems`: start.
  - md `deltaTop`: 0.
  - md `deltaCenter`: 1.
  - sm/md/lg mark sizes remain 16/24/36.
  - sm/md/lg dot sizes remain 8/12/18 in light/dark through `audit:choice-frame-runtime`.
  - selected dot renders at opacity 1 and scale 1 in light/dark.
  - unselected dot renders at scale 0 in light/dark.
  - dark unselected mark now resolves to a dark surface with a visible light ring instead of inheriting the white root radio surface.
  - `markTopDelta`: 0 in sm/md/lg for light/dark through `audit:choice-frame-runtime`.

Decision: radio-button current alignment, density, selected/rest dot behavior, and dark-mode rest ring issues are closed by runtime evidence.

## Switch

- `audit:choice-frame-runtime` verifies current switch geometry:
  - sm track 44x24, thumb 16.
  - md track 48x28, thumb 20.
  - lg track 60x36, thumb 24.
  - track and thumb use `box-sizing: border-box`.
  - checked thumb translates horizontally in sm/md/lg for light/dark.
  - unchecked thumb rests at translateX 0 in sm/md/lg for light/dark.
  - track and thumb transition `transform`.

Decision: switch geometry, off/on thumb position, and motion contract are closed by runtime evidence.

## Combobox

- ControlFrame runtime confirms combobox field sizes 36/44/52 and field radius 16px.
- Scoped local demo verification confirms the first interactive combobox path:
  - focus opens the listbox.
  - ArrowDown activates Ana Sosa.
  - second ArrowDown activates Luis Perez.
  - Enter commits only Luis Perez and closes the combobox.
  - Escape closes without changing the committed value.
  - Clear removes the value and disables the clear action.
- The earlier "multiple selected options" reading came from querying every listbox in the exhaustive demo at once, including static density examples.
- `audit:option-listbox-runtime` verifies Combobox option-row parity with Select and Menu:
  - rest rows share 64px height, 24px horizontal padding, and 14px radius.
  - active and selected Combobox backgrounds match Select in light/dark.
  - dark option-row foreground resolves to light text.
  - disabled options stay legible through color, not opacity.

Decision: combobox keyboard behavior, clear behavior, option geometry, active/selected color parity, and dark-mode option legibility are closed by runtime evidence.
