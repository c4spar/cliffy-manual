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

There are three ways to specify sub-commands with the `.command()` method which
are explained in the following section.

## Chained commands

Sub-command implemented using the `.command()` method with an action handler.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

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
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

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

## Executable commands

> ⚠️ This is currently work in progress and in an experimental state!

When `.executable()` is invoked on a sub-command, this tells cliffy you're going
to use a separate executable file for the sub-command. Cliffy will look for a
globally installed program with the name program-sub-command, like
`deno-install`, `deno-upgrade`.

You handle the options for an executable (sub)command in the executable, and
don't declare them at the top-level.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .command("install [name]", "install one or more packages").executable()
  .command("search [query]", "search with optional query").executable()
  .command("update", "update installed packages").executable()
  .command("list", "list packages installed").executable()
  .parse(Deno.args);
```
