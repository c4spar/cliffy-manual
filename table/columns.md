# Column

The `Column` class is used to set table column options. A `Column` class can be
added to the `Table` with the [.columns()](./options.md) and
[.column()](./options.md) method.

```ts
import { Table } from "https://deno.land/x/cliffy/table/mod.ts";

new Table()
  .body([
    ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
    ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
    ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
    ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
  ])
  .columns([
    { border: true },
    new Column().align("right"),
  ])
  .render();
```

## Column options

### Border

You can enable/disable the border by using the `.border()` method.

### Align column content

The content can be aligned with the `.align()` method. The first argument is the
direction. Possible values are:

- `"left"`
- `"right"`
- `"center"`

### Column width

You can set the min/max with of columns with the `.minColWidth()` and
`.maxColWidth()` methods.

### Cell padding

The `.padding()` method adds padding to all cell's in this column.
