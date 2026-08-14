# Generated Token Output Governance

Status: **pass**

This report compares current token source and generated outputs against the build manifest produced by `npm run build:tokens`.

## Gates

| Gate | Status | Evidence |
| --- | --- | --- |
| `generated-output-manifest-exists` | pass | `{"file":"packages/tokens/dist/token-output-manifest.json","exists":true}` |
| `token-source-matches-manifest` | pass | `{"manifestSourceSha":"408ed869ea455cbe0cf246e90a04dcbbae0c621e79e4c4f05f104245e5acdbe3","actualSourceSha":"408ed869ea455cbe0cf246e90a04dcbbae0c621e79e4c4f05f104245e5acdbe3","manifestTokenCount":1139,"actualTokenCount":1139}` |
| `generated-outputs-match-manifest` | pass | `{"outputs":[{"file":"packages/tokens/styles/tokens.css","exists":true,"expectedSha":"60ae82341224bc4b0b19091ee60cfc975cad3989a154e875a799deda5b5a013b","actualSha":"60ae82341224bc4b0b19091ee60cfc975cad3989a154e875a799deda5b5a013b","matchesManifest":true},{"file":"packages/tokens/styles/token-contexts.css","exists":true,"expectedSha":"44a2e2f4b575e772bce1cc6d214a98562b9539e99b2055ba4705a77651223f5f","actualSha":"44a2e2f4b575e772bce1cc6d214a98562b9539e99b2055ba4705a77651223f5f","matchesManifest":true},{"file":"packages/tokens/tokens.json","exists":true,"expectedSha":"e99d5dc0e817250a03b79e016989411e8d1f91e7e3fafb1550c43f110da6edae","actualSha":"e99d5dc0e817250a03b79e016989411e8d1f91e7e3fafb1550c43f110da6edae","matchesManifest":true},{"file":"packages/tokens/src/generated/tokens.ts","exists":true,"expectedSha":"6adebfeb0e61eb742f98d367872742456d79eaf08cea8ac86094036fad1bca48","actualSha":"6adebfeb0e61eb742f98d367872742456d79eaf08cea8ac86094036fad1bca48","matchesManifest":true},{"file":"packages/tokens/src/index.js","exists":true,"expectedSha":"b002f199519291ec9f24aa373bc95e56ca968c0b9cd0d9776282454677ab4937","actualSha":"b002f199519291ec9f24aa373bc95e56ca968c0b9cd0d9776282454677ab4937","matchesManifest":true},{"file":"packages/tokens/dist/flutter/flow_tokens.dart","exists":true,"expectedSha":"c469bf6de36651ec5def9632f3d7ed3e5e86d88d7e5bf4b7f55345c2a3df33cc","actualSha":"c469bf6de36651ec5def9632f3d7ed3e5e86d88d7e5bf4b7f55345c2a3df33cc","matchesManifest":true},{"file":"packages/tokens/dist/android/flow_tokens.xml","exists":true,"expectedSha":"6f11179f087fb6e3ad9a1130c1ebd34b981cd2e7c8cd99832093a8916f9192b2","actualSha":"6f11179f087fb6e3ad9a1130c1ebd34b981cd2e7c8cd99832093a8916f9192b2","matchesManifest":true},{"file":"packages/tokens/dist/ios/FlowTokens.swift","exists":true,"expectedSha":"6dc6f93e0b4492360b91723919702bfdd8b5df3260368d87fc7a9977c190ded0","actualSha":"6dc6f93e0b4492360b91723919702bfdd8b5df3260368d87fc7a9977c190ded0","matchesManifest":true},{"file":"packages/react/src/internal/email-token-values.js","exists":true,"expectedSha":"7ec4ac4621d6494e3dfe56df1a8a50f2c0f55de723c501b4b51ce15e146d0e31","actualSha":"7ec4ac4621d6494e3dfe56df1a8a50f2c0f55de723c501b4b51ce15e146d0e31","matchesManifest":true}]}` |

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

