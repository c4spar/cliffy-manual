# Confirm

The `Confirm` prompt is a simple yes or no prompt.

![](../assets/img/confirm.gif)

```typescript
import { Confirm } from "@cliffy/prompt/confirm";

const confirmed: boolean = await Confirm.prompt("Can you confirm?");
```

```console
$ deno run examples/prompt/confirm.ts
```

## Options

The `Confirm` prompt has all [base options](./index.md) and the following prompt
specific options.

### Active label

The text for the active state can be changed with the `active` option. Defaults
to `'Yes'`.

### Inactive label

The text for the inactive state can be changed with the `inactive` option.
Defaults to `'No'`.
