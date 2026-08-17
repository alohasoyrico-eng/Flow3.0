# System React publication boundary

Generated: 2026-08-14

## Summary

- Status: pass
- Packed files: 1374
- Package file entries: 13
- Root React export targets: 310
- React package export targets: 310
- React private import targets: 1
- Package file entries including React src: 0
- Published React src files: 0
- Root React export targets to src: 0
- React package export targets to src: 0
- Internal React private import targets to source: 1
- Dist import leaks: 0
- Publication boundary debt: 0

## Issues

- reactPrivateImportTargetsToSrc: 1

## Policy

- Published files: The installable package must not include packages/react/src files.
- Public exports: Root ./react exports and @design-system/react package exports must target dist runtime and declaration files.
- Private imports: Root private react import aliases may target source for repository tooling, but published dist runtime must not import those aliases.
- Dist runtime: Published dist runtime/declarations must not import packages/react/src or private aliases that resolve to the src mirror.
