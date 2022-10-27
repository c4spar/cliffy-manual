# Commands

The command class is used to create main and sub commands. All methods from the
command class are chainable and returns the current command instance. There are
only two exceptions:

- The `.command()` method returns the new created sub command, so you can add
  options, argument, environment variables and types to your sub commands in a
  chainable way.
- The `.reset()` method returns the main command from your current command
  chain.

## Name

With the `.name()` method you can define the name of your main command. The name
should match the name of your program. It is displayed in the auto generated
help and used for shell completions.

## Version

With the `.version()` method you can define the version of your cli. The version
is displayed in the auto generated help and the
[version](./help.md#version-option) option.

## Description

The `.description()` method adds a description for the command that will be
displayed in the auto generated help. If the help options is called with the
short flag `-h` only the first line is displayed. If called with the long name
`--help`, the full description is displayed.

For better multiline formatting, unnecessary indentations and empty leading and
trailing lines will be automatically removed.

For example, following description:

```ts
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

new Command()
  .description(`
    This is a multiline description.
      The indentation of this line will be preserved.
  `);
```

is formatted as follows:

```console
This is a multiline description.
  The indentation of this line will be preserved.
```

## Usage

With the `.usage()` method you can override the usage text that is displayed at
the top of the auto generated help which defaults to the command arguments. The
usage is always prefixed with the command name.

```ts
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

new Command()
  .name("script-runner")
  .description("Simple script runner.")
  .usage("[options] [script] [script options]")
  .parse(Deno.args);
```

## Arguments

You can use the `.arguments()` method to specify the arguments for your
commands. Angled brackets (e.g. `<required>`) indicate required input and square
brackets (e.g. `[optional]`) indicate optional input. A required input cannot be
defined after an optional input.

Arguments can be also defined with the `.command()` method. You can read more
about the `.command()` method [here](#sub-commands).

Optionally you can define [types](./types.md) and
[completions](./shell_completions.md) for your arguments. If no type is
specified the type defaults to `string`.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { args } = await new Command()
  .arguments("<input> [output:string]")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/arguments_syntax.ts
Error: Missing argument(s): input
```

### Variadic arguments

The last argument of a command can be variadic. To make an argument variadic you
can append or prepend `...` to the argument name (`<...NAME>` or `<NAME...>`).
Required rest arguments `<...args>` requires at least one argument, optional
rest args `[...args]` are completely optional.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { args: dirs } = await new Command()
  .description("Remove directories.")
  .arguments("<dirs...>")
  .parse(Deno.args);

for (const dir of dirs) {
  console.log("rmdir %s", dir);
}
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/variadic_arguments.ts dir1 dir2 dir3  
rmdir dir1  
rmdir dir2  
rmdir dir3
```

## Option

Options can be added with the `.option()` method. The first two arguments of the
method are required. With the first argument you specify the flags and arguments
of your option. The second argument is the description and with the third
argument you can set some option specific settings.

Optionally you can define [types](./types.md) and
[completions](./shell_completions.md) for the arguments of the option. If no
type is specified the type defaults to `string`. If no argument is specified,
the type defaults to `true`. You can read more about options
[here](./options.md).

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { args } = await new Command()
  .option("-f, --file <path:string>", "Force option.")
  .parse(Deno.args);
```

## Action handler

The action handler is called when the command is executed and can be registered
with the `.action()` method. The first arguments is the options object, which
contains all options and environment variables, followed by all arguments, in
the same order in which they were defined with the `.arguments()` method.
Options and arguments will be automatically typed by infering the types and
names of all options, arguments and environment variables 🚀.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .name("rm")
  .description("Remove directory.")
  .option("-r, --recursive", "Remove directory recursively.")
  .arguments("<dir>")
  .action(({ recursive }, dir: string) => {
    console.log("remove " + dir + (recursive ? " recursively" : ""));
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/action_handler.ts rm dir
remove dir
```

## Stop early

If enabled, all arguments starting from the first non option argument will be
interpreted as raw argument.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-d, --debug-level <level:string>", "Debug level.")
  .arguments("[script] [...args]")
  .stopEarly() // <-- enable stop early
  .action((options, script?: string, ...args: Array<string>) => {
    console.log("options:", options);
    console.log("script:", script);
    console.log("args:", args);
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/stop_early.ts -d warning server -p 80
options: { debugLevel: "warning" }
script: server
args: [ "-p", "80" ]
```

## Sub commands

With the `.command()` method you can add and nest sub commands as many you want.
The first argument is the command name with optional arguments. The seconds
argument is optional and can be either the description of the command or an
instance of `Command`. You can read more about sub commands
[here](./sub_commands.md).

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("foo [val:string]")
  .description("Foo command.")
  .action(() => console.log("Foo action."))
  .command("bar [val:string]", "Foo command.")
  .action(() => console.log("Bar action."))
  .parse(Deno.args);
```

## Global commands

To share commands with sub commands you can use the `.global()` method.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("global [val:string]", "global ...")
  .global()
  .action(console.log)
  .command(
    "command1",
    new Command()
      .description("Some sub command.")
      .command(
        "command2",
        new Command()
          .description("Some nested sub command."),
      ),
  )
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/global_commands.ts command1 command2 global test
{} test
```

### Disable globals

With the `.noGlobals()` method you can disable inheriting global _commands_,
_options_ and _environment variables_ from parent commands.

> The build-in `--help` option and the `help` command are excluded from the
> `.noGlobals()` method.

```ts
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

new Command()
  .globalOption("--beep", "Beep...")
  .command("foo", "Foo...")
  .command("bar", "Bar...")
  // disable global --foo option and all other globals for command bar:
  .noGlobals()
  .parse();
```

## Hidden commands

To exclude sub commands from the auto generated help and shell completions you
can use the `.hidden()` method.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("debug", "Some internal debugging command.")
  .hidden()
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/hidden_commands.ts -h
```

## Parse

The `.parse()` method processes all arguments, leaving any options and
environment variables consumed by the command in the `options` object, all
arguments in the `args` array and all arguments defined after the double dash
(`--`) in the `literal` array.

For all unknown or invalid options, arguments and types the command will throw
an error and exit the program with `Deno.exit(1)`. Read more about error
handling [here](./error_handling.md).

The parse method accepts optionally as first argument an array of command-line
arguments that should be consumed. By default `Deno.args` is used.

```ts
import { Command } from "https://deno.land/x/cliffy@v0.20.1/command/mod.ts";

const { args, options, literal, cmd } = await new Command()
  .env("DEBUG", "Enable debugging.")
  .option("--debug", "Enable debugging.")
  .arguments("<input:string>")
  .parse();
```

All types and names for options, arguments and environment variables are
automatically inferred and properly typed. If the command has sub commands,
options and arguments will be of type `Record<string, unknown>` and
`Array<unknown>`, because cliffy can not know with sub command was executed to
provide the specific types. In this case use action handlers.
