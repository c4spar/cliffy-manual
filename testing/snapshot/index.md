# Snapshot testing

The `snapshotTest` method can be used to test `stdin`, `stdout` and `stderr` of
a single test case. It injects data to stdin and snapshots the `stdout` and
`stderr` output of each test case separately.

## Usage

The `snapshotTest` method behaves like a combination of `Deno.test()` and the
`assertSnapshot` method from the deno std library. The `name`, `meta` and `fn`
options are required.

### Basic usage

This example snapshots the output of `console.log` and `console.error`.

```ts
import { snapshotTest } from "@cliffy/testing";

await snapshotTest({
  name: "should log to stdout and stderr",
  meta: import.meta,
  async fn() {
    console.log("foo");
    console.error("bar");
  },
});
```

To update the snapshots, run `deno test -- --update`. This creates a snapshot
file at `__snapshots__/[filename].snap` with the following content:

```ts ignore
export const snapshot = {};

snapshot[`should log to stdout and stderr 1`] = `
"stdout:
foo

stderr:
bar
"
`;
```

If you now run `deno test` (without `-- --update`), it will check if your test
function still has the same output as the snapshot file content has.

### Script arguments

Arguments defined with the `args` option are injected into the test method as
script args. You can simply use `Deno.args` as you normally would to get the
script arguments.

```ts
import { snapshotTest } from "@cliffy/testing";

await snapshotTest({
  name: "should log Deno.args",
  meta: import.meta,
  args: ["--foo", "bar"],
  async fn() {
    console.log(Deno.args);
  },
});
```

You can use this to create snapshot tests for commands.

```ts
import { snapshotTest } from "@cliffy/testing";
import { Command } from "@cliffy/command";

await snapshotTest({
  name: "should execute the command with the --foo option",
  meta: import.meta,
  args: ["--foo", "bar"],
  async fn() {
    await new Command()
      .name("example")
      .description("Example command.")
      .option("-f, --foo <bar:string>", "Example option.")
      .action(({ foo }) => {
        console.log("foo: %s", foo);
      })
      .parse();
  },
});
```

### Stdin

The `snapshotTest` method can inject data to the test function with the `stdin`
option. You can simply read the data from `Deno.stdin` as you normally would
when reading data from stdin.

```ts
import { snapshotTest } from "@cliffy/testing";

await snapshotTest({
  name: "should read cliffy from stdin",
  meta: import.meta,
  stdin: ["cliffy"],
  async fn() {
    let name = "";
    const decoder = new TextDecoder();
    for await (const chunk of Deno.stdin.readable) {
      name += decoder.decode(chunk);
      if (name === "cliffy") {
        break;
      }
    }
    console.log("name:", name);
  },
});
```

You can use this to create snapshot tests for prompts. The `ansi` module can be
used to generate escape sequences to control the prompt.

```ts
import { snapshotTest } from "@cliffy/testing";
import { Select } from "@cliffy/prompt";
import { ansi } from "@cliffy/ansi";

await snapshotTest({
  name: "should select a color",
  meta: import.meta,
  stdin: ansi
    .cursorDown
    .cursorDown
    .text("\n")
    .toArray(),
  async fn() {
    const name = await Select.prompt({
      message: "Select a color",
      options: ["red", "green", "blue"],
    });
    console.log("name:", name);
  },
});
```

### Test steps

You can also add multiple steps to the test function. The `snapshotTest` method
then calls the test function once for each step within a separate test step by
calling `t.step()` from the test context. Each step can have separate options
for `stdin` and `args`.

```ts
import { snapshotTest } from "@cliffy/testing";

await snapshotTest({
  name: "should log to stdout and atderr",
  meta: import.meta,
  steps: {
    "step 1": { args: ["foo"], stdin: ["bar"] },
    "step 2": { args: ["beep"], stdin: ["boop"] },
  },
  async fn() {
    console.log(Deno.args);
  },
});
```
