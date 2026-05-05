# Column

The `Column` class is used to set table column options. A `Column` class can be
added to the `Table` with the [.columns()](./options.md) and
[.column()](./options.md) method.

```ts
import { Column, Table } from "@cliffy/table";

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

You can enable/disable the border by using the `.border()` method which accepts
an optional boolean value.

### Align column content

The content can be aligned with the `.align()` method. The first argument is the
direction. Possible values are:

- `"left"`
- `"right"`
- `"center"`

### Column width

You can set the min and max width of columns with the `.minColWidth()` and
`.maxColWidth()` methods.

### Cell padding

The `.padding()` method adds padding to all cells in this column.

### Flex grow

The `.flexGrow(weight)` method allows a column to expand into available slack.
Follows CSS `flex-grow` semantics: available space is distributed proportionally
by weight, so a column with weight `2` receives twice the extra space of one
with weight `1`. The default is `0` (no grow).

> [!NOTE]
> Flex only takes effect when `maxWidth` is set to a finite value on the table.
> Without it the layout has no target width and flex is a no-op.

```ts
import { Column, Table } from "@cliffy/table";

new Table()
  .body([
    ["Name", "Description"],
    ["foo", "A short value"],
    ["bar", "A much longer description that needs more space"],
  ])
  .maxWidth(80) // required — flex is a no-op without a finite maxWidth
  .columns([
    new Column().minWidth(10),
    new Column().flexGrow(1), // expand to fill up to 80 columns
  ])
  .render();
```

### Flex shrink

The `.flexShrink(weight)` method allows a column to give up space when the table
is wider than `maxWidth`. Follows CSS `flex-shrink` semantics: each column's
share of the reduction is proportional to `weight × width`, so a wider column or
one with a higher weight absorbs more of the overflow. The default is `0` (rigid
— never shrinks).

> [!NOTE]
> Flex only takes effect when `maxWidth` is set to a finite value on the table.
> Without it the layout has no target width and flex is a no-op.

```ts
import { Column, Table } from "@cliffy/table";

new Table()
  .body([
    ["Name", "Description"],
    ["foo", "A short value"],
    ["bar", "A much longer description that can be compressed"],
  ])
  .maxWidth(40) // required — triggers shrink when content exceeds this width
  .columns([
    new Column().minWidth(10),
    new Column().flexShrink(1), // absorb overflow proportionally
  ])
  .render();
```

### Flex (shorthand)

The `.flex(weight)` method is a shorthand that sets both `.flexGrow` and
`.flexShrink` to the same weight. The column will both expand into and contract
out of available space.

> [!NOTE]
> Flex only takes effect when `maxWidth` is set to a finite value on the table.
> Without it the layout has no target width and flex is a no-op.

```ts
import { Column, Table } from "@cliffy/table";

new Table()
  .body([
    ["Name", "Description"],
    ["foo", "A short value"],
    ["bar", "A much longer description"],
  ])
  .maxWidth(80) // required — flex is a no-op without a finite maxWidth
  .columns([
    new Column().minWidth(10),
    new Column().flex(1), // grow and shrink proportionally
  ])
  .render();
```

### Set multiple options

The `.options()` method allows you to set multiple options at once by passing an
options bag to the `.options()` method.
