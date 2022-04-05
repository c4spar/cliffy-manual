# Options

Options are defined with the `.option()` method and can be accessed as
properties on the options object which is passed to the `.action()` handler and
returned by the `.parse()` method.

With the first argument of the `.options()` method you define the option names
and arguments. Each option can have multiple short and long flag's, separated by
comma. The name of the first long flag will be uesed as option name. If no long
flag is provided the first short flag will be used.

Multi-word options such as `--template-engine` are camel-cased to
`templateEngine` and multiple short flags may be combined as a single arg, for
example `-abc` is equivalent to `-a -b -c` and `-n5` is equivalent to `-n 5` and
`-n=5`.

The second parameter of the `.options()` method is the description and the third
parameter can be an options object.

## Arguments

An option can have multiple required and optional arguments, separated by space.
Required values are declared using angle brackets `<port>` and optional values
with square brackets `[hostname]`. Optionally you can define [types](./types.md)
and [completions](./shell_completions.md) for the arguments of the option. If no
type is specified the type defaults to `string`. If no argument is specified,
the type defaults to `true`.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-s, --silent", "disable output.")
  .option("-d, --debug [level]", "output extra debugging.")
  .option("-p, --port <port>", "the port number.")
  .option("-h, --host [hostname]", "the host name.", { default: "localhost" })
  .parse(Deno.args);

console.log("server running at %s:%s", options.host, options.port);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/options.ts -p 80
server running at localhost:80
```

### Variadic arguments

The last argument of an option can be variadic. To make an argument variadic you
can append or prepand `...` to the argument name. For example:

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .version("0.1.0")
  .option("-d, --dir [otherDirs...:string]", "Variadic option.")
  .parse(Deno.args);

console.log(options);
```

The variadic option is returned as an array.

```console
$ deno run https://deno.land/x/cliffy/examples/command/variadic_options.ts -d dir1 dir2 dir3
{ dir: [ "dir1", "dir2", "dir3" ] }
```

## Dotted options

Dotted options allows you to group your options together in nested objects.
There is no limit for the level of nested objects.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option(
    "-b.a, --bitrate.audio, --audio-bitrate <bitrate:number>",
    "Audio bitrate",
  )
  .option(
    "-b.v, --bitrate.video, --video-bitrate <bitrate:number>",
    "Video bitrate",
  )
  .parse();

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/dotted_options.ts -b.a 300 -b.v 900
{ bitrate: { audio: 300, video: 900 } }

$ deno run https://deno.land/x/cliffy/examples/command/dotted_options.ts --bitrate.audio 300 --bitrate.video 900
{ bitrate: { audio: 300, video: 900 } }

$ deno run https://deno.land/x/cliffy/examples/command/dotted_options.ts --audio-bitrate 300 --video-bitrate 900
{ bitrate: { audio: 300, video: 900 } }
```

## Default option value

You can specify a default value for an option with an optional value.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-c, --cheese [type:string]", "add the specified type of cheese", {
    default: "blue",
  })
  .parse(Deno.args);

console.log(`cheese: ${options.cheese}`);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/default_option_value.ts
cheese: blue

$ deno run https://deno.land/x/cliffy/examples/command/default_option_value.ts --cheese mozzarella
cheese: mozzarella
```

## Required options

You may specify a required (mandatory) option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-c, --cheese [type:string]", "pizza must have cheese", {
    required: true,
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/required_options.ts
Error: Missing required option "--cheese".
```

### Allow empty

If `.allowEmpty()` is called, the command will not throw an error if the command
has a required option but no argument is passed to the command.

## Negatable options

You can specify a boolean option long name with a leading `no-` to set the
option value to false when used. Defined alone this also makes the option true
by default.

If you define `--foo`, adding `--no-foo` does not change the default value from
what it would otherwise be.

You can specify a default value for a flag and it can be overridden on command
line.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  // default value will be automatically set to true if no --check option exists
  .option("--no-check", "No check.")
  .option("--color <color:string>", "Color name.", { default: "yellow" })
  .option("--no-color", "No color.")
  // no default value
  .option("--remote <url:string>", "Remote url.")
  .option("--no-remote", "No remote.")
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/negatable_options.ts
{ check: true, color: "yellow" }

$ deno run https://deno.land/x/cliffy/examples/command/negatable_options.ts --no-check --no-color --no-remote
{ check: false, color: false, remote: false }
```

## Global options

To share options with child commands you can use the `.globalOption()` method or
the `.option()` method together with the `global` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-l, --local [val:string]", "Only available on this command.")
  .globalOption(
    "-g, --global [val:string]",
    "Available on this and all nested child command's.",
  )
  .action(console.log)
  .command(
    "command1",
    new Command()
      .description("Some sub command.")
      .action(console.log)
      .command(
        "command2",
        new Command()
          .description("Some nested sub command.")
          .action(console.log),
      ),
  )
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/global_options.ts command1 command2 -g test
{ global: "test" }
```

## Hidden options

To exclude option's from the help and completion command's you can use the
`hidden` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-H, --hidden [hidden:boolean]", "Nobody knows about me!", {
    hidden: true,
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/hidden_options.ts -h
```

## Standalone options

Standalone options cannot be combine with any command and option. For example
the `--help` and `--version` flag. You can achieve this with the `standalone`
option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .option("-s, --standalone [value:boolean]", "Some standalone option.", {
    standalone: true,
  })
  .option("-o, --other [value:boolean]", "Some other option.")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/standalone_options.ts --standalone --other
Error: Option --standalone cannot be combined with other options.
```

## Conflicting options

To define options which conflicts with other options you can use the `conflicts`
option by defining an array with the names of these options.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-f, --file <file:string>", "read from file ...")
  .option("-i, --stdin [stdin:boolean]", "read from stdin ...", {
    conflicts: ["file"],
  })
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/conflicting_options.ts -f file1
{ file: "file1" }

$ deno run https://deno.land/x/cliffy/examples/command/conflicting_options.ts -i
{ stdin: true }

$ deno run https://deno.land/x/cliffy/examples/command/conflicting_options.ts -if file1
Error: Option --stdin conflicts with option: --file
```

## Depending options

To define options which depends on other options you can use the `depends`
option by defining an array with the names of these options.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-u, --audio-codec <type:string>", "description ...")
  .option("-p, --video-codec <type:string>", "description ...", {
    depends: ["audio-codec"],
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/depending_options.ts -a aac
{ audioCodec: "aac" }

$ deno run https://deno.land/x/cliffy/examples/command/depending_options.ts -v x265
Error: Option "--video-codec" depends on option "--audio-codec".

$ deno run https://deno.land/x/cliffy/examples/command/depending_options.ts -a aac -v x265
{ audioCodec: "aac", videoCodec: "x265" }
```

## Collect options

An option can occur multiple times in the command line to collect multiple
values. Todo this, you have to activate the `collect` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option("-c, --color <color:string>", "read from file ...", { collect: true })
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/collect_options.ts --color yellow --color red --color blue
{ color: [ "yellow", "red", "blue" ] }
```

## Map option value

You may specify a function to do custom processing of option values. The
callback function receives one parameter, the user specified value which is
already parsed into the specified type. The return value of this method will be
used as option value.

If collect is enabled the function receives as second parameter the previous
value. This allows you to coerce the option value to the desired type, or
accumulate values, or do entirely custom processing.

```typescript
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  .option(
    "-o, --object <item:string>",
    "map string to object",
    (value: string): { value: string } => {
      return { value };
    },
  )
  .option("-C, --color <item:string>", "collect colors", {
    collect: true,
    value: (value: string, previous: Array<string> = []): Array<string> => {
      if (["blue", "yellow", "red"].indexOf(value) === -1) {
        throw new ValidationError(
          `Color must be one of "blue, yellow or red", but got "${value}".`,
          // optional you can set the exitCode which is used if .throwErrors()
          // is not called. Default is: 1
          { exitCode: 1 },
        );
      }
      previous.push(value);
      return previous;
    },
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_processing.ts --object a
{ object: { value: "a" } }

$ deno run https://deno.land/x/cliffy/examples/command/custom_option_processing.ts --color blue \
                                                                                   --color yellow \
                                                                                   --color red
{ color: [ "blue", "yellow", "red" ] }
```

## Option action handler

Options can have an action handler same as commands. You can add an action
handler with the `action` option.

> **Prior to v0.20.0**, when an option action was executed, the command action
> was not executed. **Since v0.20.0**, this has changed. The command action is
> now executed by default. Only standalone options do not execute the command
> actions.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .version("0.1.0")
  .option("--foo", "Foo option.", {
    action: () => {
      console.log("--foo action");
    },
  })
  .option("--bar", "Bar option.", {
    standalone: true,
    action: () => {
      console.log("--bar action");
    },
  })
  .option("--baz", "Baz option.", {
    action: () => {
      console.log("--baz action");
      Deno.exit(0);
    },
  })
  .action(() => console.log("main action"))
  .parse(Deno.args);

console.log("main context");
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/action_options.ts --foo
--foo action
main action
main context
$ deno run https://deno.land/x/cliffy/examples/command/action_options.ts --bar
--bar action
main context
$ deno run https://deno.land/x/cliffy/examples/command/action_options.ts --baz
--baz action
```
