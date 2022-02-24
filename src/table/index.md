# Getting started

Fast and customizable table module to render unicode table's on the command
line.

## Usage

### Basic Usage

To create a table you can simple create an instance of the `Table` class and
pass the rows as arguments to the constructor. The example below will output a
simple table with three rows and without any styles. The only default option is
`padding` which is set to `1`.

```ts
import { Table } from "https://deno.land/x/cliffy/table/mod.ts";

const table: Table = new Table(
  ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
  ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
  ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
  ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
);

console.log(table.toString());
```

```console
$ deno run https://deno.land/x/cliffy/examples/table/basic_usage.ts
```

![](assets/img/basic_usage.gif)

### Using as Array

Since the `Table` class is an `Array`, you can call all the methods of the array
class like `.from()`, `.sort()`, `.push()`, `.unshift()` and friends.

```ts
import { Table } from "https://deno.land/x/cliffy/table/mod.ts";

const table: Table = Table.from([
  ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
  ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
  ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
]);

table.push(["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"]);
table.sort();
table.render();
```

```console
$ deno run https://deno.land/x/cliffy/examples/table/using_as_array.ts
```

![](assets/img/using_as_array.gif)
