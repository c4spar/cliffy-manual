# Getting started

Command line arguments parser with build-in validations.

## Usage

The `parseFlags` method accepts as first argument the arguments that to be
parsed, usually `Deno.args`. As the second argument you can pass an options
object. A list of all available options can be found [here](./parse_options.md).

### Basic usage

If `parseFlags` is called without defining specific flags with the options
object, all flags passed as first arguments to the `parseFlags` method are
parsed and added to the flags object returned by the `parseFlags` method. All
non-options arguments are added to the `unknown` array and all flags specified
after the double dash (`--`) are added to the literal array.

```typescript
import { parseFlags } from "https://deno.land/x/cliffy/flags/mod.ts";

console.log(parseFlags(Deno.args));
```

```console
$ deno run https://deno.land/x/cliffy/examples/flags/flags.ts -a foo -b bar
{ flags: { a: "foo", b: "bar" }, unknown: [], literal: [] }

$ deno run https://deno.land/x/cliffy/examples/flags/flags.ts \
    -x 3 \
    -y.z -n5 \
    -abc \
    --beep=boop \
    foo bar baz \
    --deno.land \
    --deno.com -- --cliffy
{
  flags: {
    x: "3",
    y: { z: true },
    n: "5",
    a: true,
    b: true,
    c: true,
    beep: "boop",
    deno: { land: true, com: true }
  },
  unknown: [ "foo", "bar", "baz" ],
  literal: [ "--cliffy" ]
}
```

### Flags

You can specify flagswith the options object. For all unknown or invalid flags
an `ValidationError` is thrown. Read more about error handling
[here](./error_handling.md). A list of all available flag options can be found
[here](./flag_options.md).

```typescript
import { parseFlags } from "https://deno.land/x/cliffy/flags/mod.ts";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "help",
    aliases: ["h"],
    standalone: true,
  }, {
    name: "verbose",
    aliases: ["v"],
    collect: true,
    value: (val: boolean, previous = 0) => val ? previous + 1 : 0,
  }, {
    name: "file",
    aliases: ["f"],
    type: "string",
  }],
});

console.log(flags);
```

```console
$ deno run https://deno.land/x/cliffy/examples/flags/options.ts -vvv -f ./example.ts
{ verbose: 3, file: "./example.ts" }
```
