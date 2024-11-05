# Sub commands

Sub commands can be added using the `.command()` method. The first argument
specifies the name and optionally arguments for your sub command. The arguments
may be `<required>` or `[optional]` and the last argument may also be variadic.
The second argument of the `.command()` method is optional and can be either the
command description or an instance of a `Command` class. The description can be
also defined with the `.description()` method.

> ❗ The `.command()` method returns the instance of the added command. If you
> call the `.action()` method after the `.command()` method is called, the
> action will be registered to the sub command and not to your main command. You
> can use the `.reset()` method to get the instance of the parent command back.

There are two ways to specify sub-commands with the `.command()` method which
are explained in the following section.

## Chained commands

Sub-command implemented using the `.command()` method with an action handler.

```typescript
import { Command } from "@cliffy/command";

await new Command()
  .command(
    "clone <source:string> [destination:string]",
    "Clone a repository into a newly created directory.",
  )
  .option("-r, --recursive", "Clone recursive.")
  .action(({ recursive }, source: string, destination?: string) => {
    console.log(
      "clone %s to %s",
      source,
      destination,
      recursive ? " (recursive)" : "",
    );
  })
  .parse(Deno.args);
```

## Command instance

The command method accepts as second argument a instance of a command. This way
you can move your sub-commands into different files.

```typescript
import { Command } from "@cliffy/command";

const clone = new Command()
  .arguments("<source:string> [destination:string]")
  .description("Clone a repository into a newly created directory.")
  .action((options: any, source: string, destination?: string) => {
    console.log("clone command called");
  });

await new Command()
  .command("clone", clone)
  .parse(Deno.args);
```

## Command Literal Arguments

For arguments with `--` the following can be used.

```typescript
import { Command } from "@cliffy/command";

await new Command()
  .name("my-command")
  .arguments("[...args:string]")
  .option("--foo", "Foo option.")
  .action(function (options, ...args: Array<string>) {
    console.log("Options:", options);
    console.log("Arguments:", args);
    console.log("Literal arguments:", this.getLiteralArgs());
  })
  .parse();
```

```console
$ my-command --foo bar -- --baz
Options: { foo: true }
Arguments: [ "bar" ]
Literal arguments: [ "--baz" ]
```
