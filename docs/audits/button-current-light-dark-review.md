# Button Current Light/Dark Review

Status: **pass**

## Checks

- keyboard-activation: pass — Focused enabled native button fired 3 clicks across Enter, Space, and pointer click.
- density-order: pass — Measured sm=36px, md=44px, lg=52px; monotonic and contract-owned.
- icon-density: pass — Measured icon sizes sm=16px, md=20px, lg=24px.
- semantic-tones: pass — Danger and warning use red/yellow token families, not action blue.
- loading-vs-disabled: pass — Loading keeps busy cursor, aria-busy, opacity 1, and tone; disabled uses gray disabled aliases and not-allowed cursor.
- light-dark-legibility: pass — Primary danger, warning, and loading text/background contrast measured >= 5.37 in light and dark review.

## Measurements

| Density | Block | Icon | Font | Padding inline |
| --- | ---: | ---: | ---: | ---: |
| sm | 36px | 16px | 13px | 16px |
| md | 44px | 20px | 14px | 20px |
| lg | 52px | 24px | 16px | 28px |

Contrast minimums: light danger 5.62, light warning 5.43, light loading 5.37; dark danger 5.62, dark warning 5.43, dark loading 5.37.

Debt: 0
