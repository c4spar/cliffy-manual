# Examples

## Prompt snapshot

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

## Command snapshot

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
