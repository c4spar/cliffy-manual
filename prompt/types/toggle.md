# Toggle

The `Toggle` prompt is a simple yes or no switch.

![](../assets/img/toggle.gif)

```typescript
import { Toggle } from "@cliffy/prompt/toggle";

const confirmed = await Toggle.prompt("Can you confirm?");
```

```console
$ deno run examples/prompt/toggle.ts
```

## Options

The `Toggle` prompt has all [base options](./index.md) and the following prompt
specific options.

### Active label

The text for the active state can be changed with the `active` option. Defaults
to `'Yes'`.

### Inactive label

The text for the inactive state can be changed with the `inactive` option.
Defaults to `'No'`.
