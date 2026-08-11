# Primitive Library Sources Cascade Audit

Status: **pass**

Library primitives are the only boundary where third-party visual/runtime sources enter Flow; components, patterns, templates, and Docs must consume the primitive API instead of duplicating vendors or drawing assets ad hoc.

## Gaps
- None

## Self Gate
- library-sources: spec yes; contract yes; exported yes; records 6

## Library Primitives
- iconography: pass; library material-symbols; exported yes; vendor yes; consumed yes
- country-flags: pass; library country-flag-icons; exported yes; vendor yes; consumed no
- animation-assets: pass; library lottie-web; exported yes; vendor yes; consumed no
- illustration-assets: pass; library open-doodles; exported yes; vendor yes; consumed yes
- charts: pass; library echarts; exported yes; vendor yes; consumed yes
- maps: pass; library maplibre-gl; exported yes; vendor yes; consumed yes
