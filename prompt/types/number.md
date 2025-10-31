# Number

The `Number` prompt is a simple number input with support for
[auto suggestions](#auto-suggestions).

![](../assets/img/number.gif)

```typescript
import { Number } from "@cliffy/prompt/number";

const age = await Number.prompt("How old are you?");
```

```console
$ deno run examples/prompt/number.ts
```

## Options

The `Number` prompt implements all [base](./index.md) and
[auto suggestion](../auto_suggestions.md) options and the following prompt
specific options.

### Min input value

The `min` option specifies the minimum input value. Defaults to `-Infinity`.

### Max input value

The `max` option specifies the maximum input value. Defaults to `Infinity`.

### Decimal value

You can allow floating point inputs with the `float` option which defaults to
`false`.

The `round` option specifies the number of decimals to round. Defaults to `2`.

### List pointer

With the `listPointer` you specify the list pointer icon. Default is `❯`.

### Display usage info

The `info` option enables the info bar which displays some usage information.

### Auto suggestions

Tab-completions can be enabled with the `suggestions` and/or `id` option. If an
`id` is provided, the value will be saved to the local storage using the `id` as
local storage key. With `suggestions` you can provide some default suggestions.
Both options can be defined at the same time. You can read more about auto
suggestions [here](../auto_suggestions.md).

> [!NOTE]
> The `id` option requires deno >= `1.10` and the `--location` flag. Since
> deno `1.16.0` the `--location` flag is optional.

```typescript
import { Number } from "@cliffy/prompt/number";

const color = await Number.prompt({
  message: "Choose a number",
  id: "<local-storage-key>",
  suggestions: [
    "111",
    "222",
    "333",
  ],
});

console.log({ color });
```
