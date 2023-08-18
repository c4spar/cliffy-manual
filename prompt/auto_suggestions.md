# Auto suggestions

You can provide suggestions to the [input](./types/input.md),
[number](./types/number.md) and [list](./types/list.md) prompt to enable
tab-completions with the [suggestions](#suggestions) and/or
[id](#local-storage-id) option. If an `id` is provided, the values will be saved
to the local storage using the `id` as local storage key. With `suggestions` you
can provide some default suggestions. Both options can be defined at the same
time.

```shell
deno install you/cli.ts --location https://example.com
# or
deno run you/cli.ts --location https://example.com
```

## Options

### Suggestions

The `suggestions` options specifies a list of default suggestions.

```typescript
import { Input } from "https://deno.land/x/cliffy/prompt/input.ts";

const color: string = await Input.prompt({
  message: "Choose a color",
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
$ deno run https://deno.land/x/cliffy/examples/prompt/suggestions.ts
```

![](assets/img/suggestions.gif)

### Local storage id

If the `id` option is provided, values are stored in the local storage using the
id as local storage key. The stored values are used as suggestions at the next
time the prompt is used.

> ❕ The `id` option requires deno >= `1.10` and the `--location` flag. Since
> deno `1.16.0` the `--location` flag is optional.

### Path completions

To enable path completions for relative and absolute files, set the `files`
option to `true`. Path completions is only available for `Input` and `List`
prompts.

### Suggestions list

With the `list` option you can display a list of suggestions. Matched
suggestions will be highlighted in the list and can be completed with the `tab`
key.

You can also display the info bar with the `info` option to show the number of
available suggestions and usage information.

```typescript
import { Input } from "https://deno.land/x/cliffy/prompt/input.ts";

const color: string = await Input.prompt({
  message: "Choose a color",
  list: true,
  info: true,
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
$ deno run https://deno.land/x/cliffy/examples/prompt/suggestions_list.ts
```

![](assets/img/suggestions_list.gif)

#### Max suggestions

With the `maxRows` option you specify the number of suggestions displayed per
page. Defaults to `10`.
