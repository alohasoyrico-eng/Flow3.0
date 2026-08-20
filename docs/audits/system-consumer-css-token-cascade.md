# System consumer CSS token cascade

Generated: 2026-08-14

## Summary

- Status: pass
- Packed files: 1375
- Token CSS bytes: 65902
- Component CSS bytes: 591522
- Token markers: 4
- Component alias markers: 6
- Component root markers: 6
- Density markers: 4
- Forbidden CSS markers checked: 6
- Consumer CSS token cascade debt: 0

## Policy

- Package boundary: CSS smoke must resolve CSS through public package exports only.
- Cascade order: Consumers must load token CSS before component CSS aliases.
- Leak boundary: Installed CSS must not leak FlowDocs, gold-* demo, sourcemap, or workspace import markers.
