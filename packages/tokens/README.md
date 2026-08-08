# @design-system/tokens

Prototype-ready Design System token package.

Use this package when you need stable semantic values without opening the docs app.

```js
import { systemTokens } from "../tokens/src/index.js";
```

```js
import tokenContract from "../tokens/tokens.json" with { type: "json" };
```

```css
@import "../tokens/styles/tokens.css";
```

`tokens.json` is the platform-neutral token contract for build pipelines such as Style Dictionary. The canonical system contract remains `packages/specs/specs/unison.system.json`.
