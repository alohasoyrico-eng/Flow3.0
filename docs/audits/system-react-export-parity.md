# System React export parity

Generated: 2026-08-14

## Summary

- Status: pass
- Export entries: 182
- Direct export entries: 178
- Wildcard export entries: 4
- React export entries: 155
- Direct targets: 333
- Wildcard resolved targets: 124
- Resolved direct exports: 178
- React dist runtime files: 158
- Exported React dist runtime files: 155
- Allowed internal React dist runtime files: 3
- Orphan public React dist runtime files: 0
- Export parity debt: 0

## Issues

- None

## Policy

- React exports: Every ./react subpath must publish both types and default runtime targets.
- Direct targets: Every direct package export target must exist inside the package root.
- Wildcard targets: Every spec wildcard artifact must resolve through the package exports map.
- React dist runtime: Every public React dist runtime file must be reachable through exports; internal runtime files may remain private.
