# Checkbox

The `Checkbox` prompt is a multi select prompt.

![](../assets/img/checkbox.gif)

```typescript
import { Checkbox } from "https://deno.land/x/cliffy/prompt/checkbox.ts";

const colors: string[] = await Checkbox.prompt({
  message: "Pick a color",
  options: [
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#00ff00", disabled: true },
    { name: "Blue", value: "#0000ff" },
    Checkbox.separator("--------"),
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
  ],
});
```

```console
$ deno run --unstable https://deno.land/x/cliffy/examples/prompt/checkbox.ts
```

## Options

The `Checkbox` prompt has all [base options](./index.md) and the following
prompt specific options.

### Checkbox options

With the `options` option you specify an array of options. An option can be
either a string or an options object.

#### Checkbox option

##### Option value

Value which will be returned as result.

##### Option name

Name is displayed in the list. Defaults to `value`.

##### Disable option

Disabled item. Can't be selected.

##### Checke option

Whether item is checked or not. Defaults to `false`.

##### Option icon

Show or hide item icon. Defaults to `true`.

### Min options

The `minOptions` option specifies the minimum amount of selectable options.
Default is `0`.

### Max options

The `maxOptions` option specifies the maximum amount of selectable options.
Default is `infinity`.

### Max rows

The `maxRows` option specifies the number of options displayed per page.
Defaults to `10`.

### List pointer

With the `listPointer` you specify the list pointer icon. Default is `❯`.

### Enable search input

You can enable a search/filter input with the `search` option. The `search`
option is useful if you have a large list of options.

You can change the search input label with the `searchLabel` option.

### check

Change the check icon.

### uncheck

Change the uncheck icon.
