# Table

Fast and customizable table module to render unicode tables on the command line.

## Installation

<!--tabs-start-->

### Deno

```bash
deno add jsr:@cliffy/table
```

### Pnpm

```bash
pnpm add jsr:@cliffy/table
```

or (using pnpm 10.8 or older):

```bash
pnpm dlx jsr add @cliffy/table
```

### Yarn

```bash
yarn add jsr:@cliffy/table
```

or (using Yarn 4.8 or older):

```bash
yarn dlx jsr add @cliffy/table
```

### Vlt

```bash
vlt install jsr:@cliffy/table
```

### Npm

```bash
npx jsr add @cliffy/table
```

### Bun

```bash
bunx jsr add @cliffy/table
```

<!--tabs-end-->

## Usage

### Basic Usage

To create a table you can simple create an instance of the `Table` class and
pass the rows as arguments to the constructor. The example below will output a
simple table with three rows and without any styles. The only default option is
`padding` which is set to `1`.

```ts
import { Table } from "@cliffy/table";

const table: Table = new Table(
  ["Baxter Herman", "Oct 1, 2020", "Harderwijk", "Slovenia"],
  ["Jescie Wolfe", "Dec 4, 2020", "Alto Hospicio", "Japan"],
  ["Allegra Cleveland", "Apr 16, 2020", "Avernas-le-Bauduin", "Samoa"],
  ["Aretha Gamble", "Feb 22, 2021", "Honolulu", "Georgia"],
);

console.log(table.toString());
```

```console
$ deno run examples/table/basic_usage.ts
```

![](assets/img/basic_usage.gif)

### Using as Array

Since the `Table` class is an `Array`, you can call all the methods of the array
class like `.from()`, `.sort()`, `.push()`, `.unshift()` and friends.

```ts
import { Table } from "@cliffy/table";

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
$ deno run examples/table/using_as_array.ts
```

![](assets/img/using_as_array.gif)
