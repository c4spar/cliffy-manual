# Flags

Command line arguments parser with built-in validations.

## Installation

<!--tabs-start-->

### Deno

```bash
deno add jsr:@cliffy/flags
```

### Pnpm

```bash
pnpm add jsr:@cliffy/flags
```

or (using pnpm 10.8 or older):

```bash
pnpm dlx jsr add @cliffy/flags
```

### Yarn

```bash
yarn add jsr:@cliffy/flags
```

or (using Yarn 4.8 or older):

```bash
yarn dlx jsr add @cliffy/flags
```

### Vlt

```bash
vlt install jsr:@cliffy/flags
```

### Npm

```bash
npx jsr add @cliffy/flags
```

### Bun

```bash
bunx jsr add @cliffy/flags
```

<!--tabs-end-->

## Usage

The `parseFlags` method takes as its first argument the arguments to be parsed,
usually `Deno.args`, or a [parse context](#parse-context). As the second
argument you can pass an options object. A list of all available options can be
found [here](./parse_options.md).

### Basic usage

If `parseFlags` is called without defining specific flags with the options
object, all arguments are parsed and added to the flags object returned by the
`parseFlags` method. All non-options arguments are added to the `unknown` array
and all flags specified after the double dash (`--`) are added to the `literal`
array.

```typescript
import { parseFlags } from "@cliffy/flags";

console.log(parseFlags(Deno.args));
```

```console
$ deno run examples/flags/flags.ts -a foo -b bar
{
  flags: { a: "foo", b: "bar" },
  literal: [],
  unknown: [],
  stopEarly: false,
  stopOnUnknown: false
}

$ deno run examples/flags/flags.ts \
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
  literal: [ "--cliffy" ],
  unknown: [ "foo", "bar", "baz" ],
  stopEarly: false,
  stopOnUnknown: false
}
```

### Define flags

You can specify flags with the options object. For all unknown or invalid flags
an `ValidationError` is thrown. Read more about error handling
[here](./error_handling.md). A list of all available flag options can be found
[here](./flag_options.md).

```typescript
import { parseFlags } from "@cliffy/flags";

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
$ deno run examples/flags/options.ts -vvv -f ./example.ts
{ verbose: 3, file: "./example.ts" }
```

### Parse context

The `parseFlags` method accepts also a parse context as first argument. The
context can either be a manually created object or the result of a previously
called `parseFlags` method.

This can be used to parse command line flags in multiple steps, for example,
when parsing options that precede a subcommand.

```ts
import { parseFlags } from "@cliffy/flags";

const globalFlags = [{
  name: "foo-global",
  alias: ["g"],
  collect: true,
}];

const flags = [{
  name: "foo",
  alias: ["f"],
  collect: true,
}];

const args = ["--foo-global", "cmd1", "--foo-global", "--foo", "arg1", "--foo"];

// Parse main command args (all flags until the first unknown argument).
const ctx = parseFlags(args, {
  flags: globalFlags,
  stopEarly: true, // Stop on first non option argument.
  stopOnUnknown: true, // Stop on first option argument.
  dotted: false, // Don't convert dotted option keys to nested objects.
});

// Shift sub-command from arguments.
const subCommand = ctx.unknown.shift();

// Parse all sub command args.
parseFlags(ctx, {
  flags: [
    ...globalFlags,
    ...flags,
  ],
});

console.log("sub-command:", subCommand); // -> cmd1
console.log("options:", ctx.flags); // -> { fooGlobal: [ true, true ], foo: [ true, true ] }
console.log("arguments:", ctx.unknown); // -> [ "arg1" ]
```
