# Email channel governance audit

Status: pass

Email is a separate Flow channel: it may be authored from package-owned React contracts, but the shipped output must be static HTML-email markup with table-safe layout, inline values, text-backed state, and no web runtime dependency.

## Inventory

- zipEmailVariants: 6
- zipEmailReadmes: 1
- declaredVariants: 6
- artifactSlots: 11
- channelSlots: 9
- primitiveSlots: 2
- rendererVariants: 6
- rendererForbiddenImports: 0
- zipForbiddenSignals: 0
- zipDisallowedTags: 0
- zipMissingRequiredSignals: 0
- emailChannelDebt: 0

## Variants

| Variant | File | Required gaps | Conditional gaps | Forbidden | Disallowed tags |
| --- | --- | ---: | ---: | ---: | ---: |
| base | ui_kits/mailings/base-layout.html | 0 | 0 | 0 | 0 |
| transactional | ui_kits/mailings/transaccional-recibo.html | 0 | 0 | 0 | 0 |
| operational-summary | ui_kits/mailings/resumen-semanal.html | 0 | 0 | 0 | 0 |
| security-alert | ui_kits/mailings/alerta-seguridad.html | 0 | 0 | 0 | 0 |
| team-invite | ui_kits/mailings/invitacion-equipo.html | 0 | 0 | 0 | 0 |
| welcome | ui_kits/mailings/bienvenida.html | 0 | 0 | 0 | 0 |

## Issues

- None.

