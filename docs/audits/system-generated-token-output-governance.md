# Generated Token Output Governance

Status: **pass**

This report compares current token source and generated outputs against the build manifest produced by `npm run build:tokens`.

## Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| `generated-output-manifest-exists` | pass | `{"file":"packages/tokens/dist/token-output-manifest.json","exists":true}` |
| `token-source-matches-manifest` | pass | `{"manifestSourceSha":"8b45c6eac1fd70d841e959e9032c9d795cc6a08e0644540cc26ac64895133ec5","actualSourceSha":"8b45c6eac1fd70d841e959e9032c9d795cc6a08e0644540cc26ac64895133ec5","manifestTokenCount":1152,"actualTokenCount":1152}` |
| `generated-outputs-match-manifest` | pass | `{"outputs":[{"file":"packages/tokens/styles/tokens.css","exists":true,"expectedSha":"e0e728c2e128beba16851e341412cf93fde688a5b041305abb34b16c0b04263a","actualSha":"e0e728c2e128beba16851e341412cf93fde688a5b041305abb34b16c0b04263a","matchesManifest":true},{"file":"packages/tokens/styles/token-contexts.css","exists":true,"expectedSha":"b70c5a2f09d73bd978269f839036f83a7f6d80e1762b33e6b9993a939ddde02e","actualSha":"b70c5a2f09d73bd978269f839036f83a7f6d80e1762b33e6b9993a939ddde02e","matchesManifest":true},{"file":"packages/tokens/tokens.json","exists":true,"expectedSha":"41eacd64e29b607903a7fa63de25ac9cfcb609be665edea01ad79b9b1540f458","actualSha":"41eacd64e29b607903a7fa63de25ac9cfcb609be665edea01ad79b9b1540f458","matchesManifest":true},{"file":"packages/tokens/src/generated/tokens.ts","exists":true,"expectedSha":"c9a677a164c16ebb736fa10ca747cad87f5867c3a687bf88bff5f286c47afa77","actualSha":"c9a677a164c16ebb736fa10ca747cad87f5867c3a687bf88bff5f286c47afa77","matchesManifest":true},{"file":"packages/tokens/src/index.js","exists":true,"expectedSha":"b002f199519291ec9f24aa373bc95e56ca968c0b9cd0d9776282454677ab4937","actualSha":"b002f199519291ec9f24aa373bc95e56ca968c0b9cd0d9776282454677ab4937","matchesManifest":true},{"file":"packages/tokens/dist/flutter/flow_tokens.dart","exists":true,"expectedSha":"35a4437d14283170829a412b2671b7fc963e62ecda08336baf3a77e8b8b079d6","actualSha":"35a4437d14283170829a412b2671b7fc963e62ecda08336baf3a77e8b8b079d6","matchesManifest":true},{"file":"packages/tokens/dist/android/flow_tokens.xml","exists":true,"expectedSha":"59019d98d80f7094e05fba4efdb926217a0ac4d43e1d90f64b916b1c76b57a5b","actualSha":"59019d98d80f7094e05fba4efdb926217a0ac4d43e1d90f64b916b1c76b57a5b","matchesManifest":true},{"file":"packages/tokens/dist/ios/FlowTokens.swift","exists":true,"expectedSha":"ebb09ce4eeed24bd8f6a4dec82a7e025648a37814f64c0944acb916a952c6886","actualSha":"ebb09ce4eeed24bd8f6a4dec82a7e025648a37814f64c0944acb916a952c6886","matchesManifest":true},{"file":"packages/react/src/internal/email-token-values.js","exists":true,"expectedSha":"7ec4ac4621d6494e3dfe56df1a8a50f2c0f55de723c501b4b51ce15e146d0e31","actualSha":"7ec4ac4621d6494e3dfe56df1a8a50f2c0f55de723c501b4b51ce15e146d0e31","matchesManifest":true}]}` |

## Outputs

| File | Status |
| --- | --- |
| `packages/tokens/styles/tokens.css` | pass |
| `packages/tokens/styles/token-contexts.css` | pass |
| `packages/tokens/tokens.json` | pass |
| `packages/tokens/src/generated/tokens.ts` | pass |
| `packages/tokens/src/index.js` | pass |
| `packages/tokens/dist/flutter/flow_tokens.dart` | pass |
| `packages/tokens/dist/android/flow_tokens.xml` | pass |
| `packages/tokens/dist/ios/FlowTokens.swift` | pass |
| `packages/react/src/internal/email-token-values.js` | pass |

