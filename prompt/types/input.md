# Input

The `Input` prompt is a simple text input with support for
[auto suggestions](#auto-suggestions).

![](../assets/img/input.gif)

The `Input` prompt can be imported from `prompt/mod.ts` or `prompt/input.ts`.

```typescript
import { Input } from "https://deno.land/x/cliffy/prompt/input.ts";

const name: string = await Input.prompt("What's your github user name?");
```

```console
$ deno run https://deno.land/x/cliffy/examples/prompt/input.ts
```

## Options

The `Input` prompt implements all [base](./index.md) and
[auto suggestion](../auto_suggestions.md) options and the following prompt
specific options.

### Min input length

The `minLength` option specifies the minimum length of the input value. Default
is `0`.

### Max input length

The `maxLength` option specifies the maximum length of the input value. Default
is `infinity`.

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

> ❕ The `id` option requires deno >= `1.10` and the `--location` flag. Since
> deno `1.16.0` the `--location` flag is optional.

```typescript
import { Input } from "https://deno.land/x/cliffy/prompt/input.ts";

const color: string = await Input.prompt({
  message: "Choose a color",
  id: "<local-storage-key>",
  suggestions: [
    "Abbey",
    "Absolute Zero",
    "Acadia",
    "Acapulco",
    "Acid Green",
    "Aero",
    "Aero Blue",
    "Affair",
    "African Violet",
    "Air Force Blue",
  ],
});

console.log({ color });
```

```console
$ deno run https://deno.land/x/cliffy/examples/prompt/suggestions_list_prompt.ts
```

![](../assets/img/suggestions.gif)
