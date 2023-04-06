# Testing

Helper functions for testing.

## assertSnapshotCall

### Usage

The `assertSnapshotCall` method snapshots the `stdout` and `stderr` output of
the test function.

#### Basic usage

The `assertSnapshotCall` method behaves the same as a combination of
`Deno.test()` and the `assertSnapshot` method from the deno std library. `name`,
`meta` and `fn` are all required options.

To update the snapshot run `deno test -- --update`. To only execute the test run
`deno test`.

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "should log to stdout and stderr",
  meta: import.meta,
  async fn() {
    console.log("foo");
    console.error("bar");
  },
});
```

#### Script arguments

Arguments defined with the `args` option are injected as script args to the test
method. You can simple use `Deno.args` as you would do it normally to get the
script args.

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";

await assertSnapshotCall({
  name: "should log Deno.args",
  meta: import.meta,
  args: ["--foo", "bar"],
  async fn() {
    console.log(Deno.args);
  },
});
```

#### Stdin

The `assertSnapshotCall` method can inject data with the `stdin` option to the
test function. You can simple read the data from `Deno.stdin` as you would do it
normally when reading data from stdin.

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";

await assertSnapshotCall({
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

#### Steps

You can also add multiple steps to the test function. The `assertSnapshotCall`
method then calls the test function once for each step within a separate test
step by calling `t.step()` from the test context. Each step can have separate
options for `stdin` and `args`.

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";

await assertSnapshotCall({
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

### Options

### Examples

#### Prompt snapshot

You can use the `ansi` module to generate some control sequences to control a
prompt in your test.

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";
import { Checkbox } from "../prompt/checkbox.ts";
import { ansi } from "../ansi/ansi.ts";

await assertSnapshotCall({
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

#### Command snapshot

A simple example with two steps and different arguments to snapshot the output
of a command.

```ts
import { assertSnapshotCall } from "./assert_snapshot_call.ts";
import { Command } from "../command/mod.ts";

await assertSnapshotCall({
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
