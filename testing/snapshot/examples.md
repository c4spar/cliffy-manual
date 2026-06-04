# Examples

## Prompt snapshot

You can use the `ansi` module to generate some control sequences to control a
prompt in your test.

```ts
import { snapshotTest } from "@cliffy/testing";
import { Checkbox } from "@cliffy/prompt/checkbox";
import { ansi } from "@cliffy/ansi";

await snapshotTest({
  name: "should check an option",
  meta: import.meta,
  stdin: ansi
    .cursorDown
    .cursorDown
    .text(" ")
    .text("\n")
    .toArray(),
  async fn() {
    await Checkbox.prompt({
      message: "Select an option",
      options: [
        { name: "Foo", value: "foo" },
        { name: "Bar", value: "bar" },
        { name: "Baz", value: "baz" },
      ],
    });
  },
});
```

## Command snapshot

A simple example with two steps and different arguments to snapshot the output
of a command.

```ts
import { snapshotTest } from "@cliffy/testing";
import { Command } from "@cliffy/command";

await snapshotTest({
  name: "command",
  meta: import.meta,
  ignore: Deno.build.os === "windows",
  colors: true,
  steps: {
    "should delete a file": {
      args: ["/foo/bar"],
    },
    "should delete a directory recursively": {
      args: ["--recursive", "/foo/bar"],
    },
  },
  async fn() {
    await new Command()
      .version("1.0.0")
      .name("rm")
      .option("-r, --recursive", "Delete recursive.")
      .arguments("<path>")
      .action(({ recursive }, path) => {
        if (recursive) {
          console.log("Delete recursive: %s", path);
        } else {
          console.log("Delete: %s", path);
        }
      })
      .parse();
  },
});
```

## Smoke test

A single snapshot can guard your entire help and usage surface against
accidental changes. Each step runs `--help` on a different command, so one test
covers the root command and every subcommand at once.

```ts
import { snapshotTest } from "@cliffy/testing";
import { Command } from "@cliffy/command";

const cli = new Command()
  .name("shop")
  .version("1.0.0")
  .description("Example shop CLI.")
  .globalOption("-v, --verbose", "Enable verbose output.")
  .command(
    "search",
    new Command()
      .description("Search for products.")
      .arguments("<query>")
      .option("-l, --limit <count:number>", "Limit the number of results."),
  )
  .command(
    "product",
    new Command()
      .description("Show a single product.")
      .arguments("<id>"),
  );

await snapshotTest({
  name: "smoke",
  meta: import.meta,
  colors: false,
  steps: {
    "--help": { args: ["--help"] },
    "search --help": { args: ["search", "--help"] },
    "product --help": { args: ["product", "--help"] },
  },
  async fn() {
    await cli.parse(Deno.args);
  },
});
```

In a real project you would import the command from your entry file instead of
defining it inline, and use `denoArgs` to grant your CLI the permissions it
needs at runtime.

```ts ignore
import { snapshotTest } from "@cliffy/testing";
import { cli } from "./main.ts";

await snapshotTest({
  name: "smoke",
  meta: import.meta,
  denoArgs: ["--quiet", "--allow-env", "--allow-read"],
  steps: {
    "--help": { args: ["--help"] },
    "search --help": { args: ["search", "--help"] },
    "product --help": { args: ["product", "--help"] },
  },
  async fn() {
    await cli.parse(Deno.args);
  },
});
```
