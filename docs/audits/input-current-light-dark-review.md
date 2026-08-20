# Input Current Light/Dark Review

Status: **pass**

## Checks

- field-density-contract: pass — Input/Field density tokens resolve sm/md/lg to 36/44/52 min-block-size via component field aliases; rendered size is monotonic at 42/46/54 including content-box border/text effects.
- field-message-a11y: pass — Success and warning helper messages stay valid/status; error alone sets aria-invalid=true and role=alert; loading sets aria-busy=true and disabled.
- reveal-action: pass — Password reveal action responds to keyboard activation and updates aria-pressed, label, and input type.
- input-motion-contract: pass — Base Input text entry does not use Button-style transform/keyframe motion; helper/status/InlineValidation motion is tokenized and reduced-motion covered.
- dark-semantic-states: pass — Dark aliases now cover info, success, warning, error, loading, and disabled states instead of only error/loading/disabled.
- light-dark-legibility: pass — Measured input/helper/icon contrast is >= 4.56 across semantic field states in light and dark review.

## Density

| Density | Token | Min block | Rendered block |
| --- | ---: | ---: | ---: |
| sm | 36px | 36px | 42px |
| md | 44px | 44px | 46px |
| lg | calc(48px + 4px) | 52px | 54px |

## Contrast Minimums

| Theme | Input | Helper | Icon |
| --- | ---: | ---: | ---: |
| light | 10.39 | 5 | 4.95 |
| dark | 11.53 | 4.56 | 4.7 |

Debt: 0
