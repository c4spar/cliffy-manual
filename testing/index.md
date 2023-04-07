# Testing

Helper functions for testing.

## assertSnapshotCall

### Usage

The `assertSnapshotCall` method can be used to test `stdin`, `stdout` and
`stderr` of a single test case. It injects data to stdin and snapshots the
`stdout` and `stderr` output of each test case separately.

#### Basic usage

The `assertSnapshotCall` method behaves like a combination of `Deno.test()` and
the `assertSnapshot` method from the deno std library. The `name`, `meta` and
`fn` options are required.

```ts
import { assertSnapshotCall } from "https://deno.land/x/cliffy/testing/mod.ts";

await assertSnapshotCall({
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

```console
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

#### Script arguments

Arguments defined with the `args` option are injected into the test method as
script args. You can simply use `Deno.args` as you normally would to get the
script arguments.

```ts
import { assertSnapshotCall } from "https://deno.land/x/cliffy/testing/mod.ts";

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

The `assertSnapshotCall` method can inject data to the test function with the
`stdin` option. You can simply read the data from `Deno.stdin` as you normally
would when reading data from stdin.

```ts
import { assertSnapshotCall } from "https://deno.land/x/cliffy/testing/mod.ts";

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

#### Test steps

You can also add multiple steps to the test function. The `assertSnapshotCall`
method then calls the test function once for each step within a separate test
step by calling `t.step()` from the test context. Each step can have separate
options for `stdin` and `args`.

```ts
import { assertSnapshotCall } from "https://deno.land/x/cliffy/testing/mod.ts";

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

#### Name

The name of the test.

#### meta

The `meta` option is required and needs to be set to `import.meta`. This is
required for executing the snapshot tests.

#### fn

Test function that executes your test code. A snapshot is taken of the `stdout`
and `stderr` outputs of this function and stored in the snapshot file.

#### steps

With the `steps` option you can add multiple steps to the test function. The
`assertSnapshotCall` method then calls the test function once for each step
within a separate test step by calling `t.step()` from the test context. Each
step can have separate options for `stdin` and `args`. (see
[Test steps](./index.md#test-steps))

#### denoArgs

Arguments passed to the `deno test` command when executing the snapshot tests.
`--allow-env=ASSERT_SNAPSHOT_CALL` is passed by default.

#### dir

Snapshot output directory. Snapshot files will be written to this directory.
This can be relative to the test directory or an absolute path.

If both `dir` and `path` are specified, the `dir` option will be ignored and the
`path` option will be handled as normal.

#### path

Snapshot output path. The snapshot will be written to this file. This can be a
path relative to the test directory or an absolute path.

If both `dir` and `path` are specified, the `dir` option will be ignored and the
`path` option will be handled as normal.

#### osSuffix

Operating system snapshot suffix. This is useful when your test produces
different output on different operating systems. `osSuffix` is an array of
`typeof Deno.build.os`.

#### colors

Enable/disable colors. Default is `true`.

#### timeout

Timeout in milliseconds to wait until the input stream data is buffered before
writing the next data to the stream. This ensures that each user input is
rendered as separate line in the snapshot file. If your test gets flaky, try to
increase the timeout. The default timeout is `600`.

#### ignore

If truthy the current test step will be ignored.

It is a quick way to skip over a step, but also can be used for conditional
logic, like determining if an environment feature is present.

#### only

If at least one test has `only` set to `true`, only run tests that have `only`
set to `true` and fail the test suite. only?: boolean;

### Examples

#### Prompt snapshot

You can use the `ansi` module to generate some control sequences to control a
prompt in your test.

```ts
import { assertSnapshotCall } from "https://deno.land/x/cliffy/testing/mod.ts";
import { Checkbox } from "https://deno.land/x/cliffy/prompt/checkbox.ts";
import { ansi } from "https://deno.land/x/cliffy/ansi/ansi.ts";

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
import { assertSnapshotCall } from "https://deno.land/x/cliffy/testing/mod.ts";
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

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
