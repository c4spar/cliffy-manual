# Table options

To customize the table, the table class provides a few chainable option methods.
To see a list of all available options go to the [Table](#table) API section.

```ts
import { Table } from "https://deno.land/x/cliffy/table/mod.ts";

new Table()
  .header(["Name", "Date", "City", "Country"])
  .body([
    ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
    ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
    ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
    ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
  ])
  .maxColWidth(10)
  .padding(1)
  .indent(2)
  .border(true)
  .render();
```

```console
$ deno run https://deno.land/x/cliffy/examples/table/table_options.ts
```

![](assets/img/table_options.gif)

## Header and Body

To define a table header you can use the `.header()` method. The header is not
affected by any `Array` method like `.sort()` because it is stored as a separate
property and not in the array stack. The `.body()` method adds an array of rows
to the table and removes all existing rows.

The first argument of the `.header()` method can be an `Array` of `string`
and/or `Cell`.

The first argument of the `.body()` can be an `Array` of rows and a row can be
an `Array` of `string` and `Cell`. You can read more about rows and cells
[here](./rows_and_cells.md).

```ts
import { Table } from "https://deno.land/x/cliffy/table/mod.ts";

new Table()
  .header(["Name", "Date", "City", "Country"])
  .body([
    ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
    ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
    ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
    ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
  ])
  .render();
```

```console
$ deno run https://deno.land/x/cliffy/examples/table/header_and_body.ts
```

![](assets/img/header_and_body.gif)

## Render

The `.render()` method outputs the table to stdout. If you need the output as
string you can use the `.toString()` method return the table as string.

## Column width

You can set the min/max with of columns with the `.minColWidth()` and
`.maxColWidth()` methods.

## Cell padding

The `.padding()` method adds padding to all cell.

## Border

You can enable border by using the `.border()` method.

### Border style

With the `.chars()` method you can change the border style.

Here is an example of the default border characters:

```json
{
  "top": "─",
  "topMid": "┬",
  "topLeft": "┌",
  "topRight": "┐",
  "bottom": "─",
  "bottomMid": "┴",
  "bottomLeft": "└",
  "bottomRight": "┘",
  "left": "│",
  "leftMid": "├",
  "mid": "─",
  "midMid": "┼",
  "right": "│",
  "rightMid": "┤",
  "middle": "│"
}
```

## Align content

The content can be aligned with the `.align()` method. The first argument is the
direction. Possible values are:

- `"left"`
- `"right"`
- `"center"`

## Table indent

With the `.indent()` method you can add indentation to the table.

## Clone

The `.clone()` method clones the entire table.
