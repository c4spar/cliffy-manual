# Select

The `Select` prompt lets you select a option from an options list.

![](../assets/img/select.gif)

```typescript
import { Select } from "https://deno.land/x/cliffy/prompt/select.ts";

const color: string = await Select.prompt({
  message: "Pick a color",
  options: [
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#00ff00", disabled: true },
    { name: "Blue", value: "#0000ff" },
    Select.separator("--------"),
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
  ],
});
```

```console
$ deno run https://deno.land/x/cliffy/examples/prompt/select.ts
```

## Options

The `Select` prompt has all [base options](./index.md) and the following prompt
specific options.

### Select options

With the `options` option you specify an array of options. An option can be
either a string or an options object.

#### Select option

##### Option value

Value which will be returned as result.

##### Option name

Name is displayed in the list. Defaults to `value`.

##### Disable option

Disabled item. Can't be selected.

### Max rows

The `maxRows` option specifies the number of options displayed per page.
Defaults to `10`.

### List pointer

With the `listPointer` you specify the list pointer icon. Default is `❯`.

### Enable search input

You can enable a search/filter input with the `search` option. The `search`
option is useful if you have a large list of options.

You can change the search input label with the `searchLabel` option.
