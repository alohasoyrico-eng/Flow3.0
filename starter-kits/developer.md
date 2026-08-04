# Developer Starter Kit

Use this path when building with Design System.

## Install

From GitHub:

```json
{
  "dependencies": {
    "flow": "github:alohasoyrico-eng/Flow3.0#main"
  }
}
```

From Azure Repos:

```json
{
  "dependencies": {
    "flow": "git+ssh://git@ssh.dev.azure.com:v3/{org}/{project}/Flow3.0#main"
  }
}
```

From the local split:

```json
{
  "dependencies": {
    "flow": "file:../Flow3.0"
  }
}
```

## Use

1. Import tokens from `flow/tokens/styles.css`.
2. Import component CSS from `flow/components/styles.css`.
3. Import React product components from `flow/react`.
4. Import package helpers from `flow/components` only for components that have not migrated to React yet.
5. Check contracts in `flow/specs/system`.
6. Run the relevant validation command before handing work off.

Prototype example:

```js
import { createCard } from "flow/components";
import { Button, Select } from "flow/react";
import "flow/tokens/styles.css";
import "flow/components/styles.css";
```

React example:

```js
import { Button } from "flow/react";
import "flow/tokens/styles.css";
import "flow/components/styles.css";
```

## Validate

For Design System source:

```sh
npm run validate:system
```

For Docs:

```sh
npm run validate:docs
```

audit handoff: include the validation command that passed and the package surface you changed before asking for review.
