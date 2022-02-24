# Rows and cells

It is also possible to customize single rows and cell. To do this you can use
the `Row` and `Cell` class. The `Row` class is also an `Array` class like the
`Table` class.

```ts
import { Cell, Row, Table } from "https://deno.land/x/cliffy/table/mod.ts";

new Table()
  .header(Row.from(["Name", "Date", "City", "Country"]).border(true))
  .body([
    [
      "Baxter Herman",
      new Cell("Oct 1, 2020").border(true),
      "Row 1 Column 3",
      "Harderwijk",
      "Slovenia",
    ],
    new Row("Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan").border(
      true,
    ),
    ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
    ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
  ])
  .render();
```

```console
$ deno run https://deno.land/x/cliffy/examples/table/rows_and_cells.ts
```

![](assets/img/rows_and_cells.gif)

## Rows

### Row border

To enable row border you can use the `.border()` method.

### Align row content

The `.aling()` method aligns the content of all cells in the row. The first
argument is the direction. Possible values are:

- `"left"`
- `"right"`
- `"center"`

### Clone row

The `.clone()` method clones the entire row.

## Cells

### Cell border

With the `.border()` method you can add border to a cell.

### Align cell content

The `.aling()` method aligns the content of the cell. The first argument is the
direction. Possible values are:

- `"left"`
- `"right"`
- `"center"`

### Colspan and rowspan

Colspan and rowspan allows a single table cell to span the width/height of more
than one column and/or row.

```ts
import { Cell, Table } from "https://deno.land/x/cliffy/table/mod.ts";

Table.from([
  [
    new Cell("Row 1 & 2 Column 1").rowSpan(2),
    "Row 1 Column 2",
    "Row 1 Column 3",
  ],
  [new Cell("Row 2 Column 2 & 3").colSpan(2)],
  [
    new Cell("Row 3 & 4 Column 1").rowSpan(2),
    "Row 3 Column 2",
    "Row 3 Column 3",
  ],
  [new Cell("Row 4 Column 2 & 3").colSpan(2)],
  ["Row 5 Column 1", new Cell("Row 5 & 6 Column 2 & 3").rowSpan(2).colSpan(2)],
  ["Row 6 Column 1"],
])
  .border(true)
  .render();
```

```console
$ deno run https://deno.land/x/cliffy/examples/table/colspan_and_rowspan.ts
```

![](assets/img/colspan_and_rowspan.gif)

### Clone cell

To clone a single cell you can use the `.clone()` method.
