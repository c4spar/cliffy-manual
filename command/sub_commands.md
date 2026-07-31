# Sub commands

Sub commands can be added using the `.command()` method. The first argument
specifies the name and optionally arguments for your sub command. The arguments
may be `<required>` or `[optional]` and the last argument may also be variadic.
The second argument of the `.command()` method is optional and can be either the
command description or an instance of a `Command` class. The description can be
also defined with the `.description()` method.

> [!NOTE]
> The `.command()` method returns the instance of the added command. Any method
> that is called after the `.command()` method, for example `.action()`,
> `.option()` or `.globalOption()`, is registered on the sub command and not on
> your main command. You can use the [`.reset()`](./commands.md#reset) method to
> get the instance of the parent command back.

There are three ways to specify sub-commands with the `.command()` method which
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
  .action(({ recursive }, source, destination?) => {
    console.log(
      "clone %s to %s",
      source,
      destination,
      recursive ? " (recursive)" : "",
    );
  })
  .parse();
```

## Command instance

The command method accepts as second argument an instance of a command. This way
you can move your sub-commands into different files.

```typescript
import { Command } from "@cliffy/command";

const clone = new Command()
  .arguments("<source:string> [destination:string]")
  .description("Clone a repository into a newly created directory.")
  .action((options, source, destination?) => {
    console.log("clone command called");
  });

await new Command()
  .command("clone", clone)
  .parse();
```

## Lazy loading

The `.command()` method also accepts a function that returns a command, a
promise of a command, or a module with the command as its default export. The
function is called the first time the sub-command is needed, and only once, so
its module is only imported when it is used.

```typescript ignore
import { Command } from "@cliffy/command";

await new Command()
  .command("clone", () => import("./commands/clone.ts"))
  .command("push", () => import("./commands/push.ts"))
  .parse();
```

```typescript
// commands/clone.ts
import { Command } from "@cliffy/command";

export default new Command()
  .arguments("<source:string> [destination:string]")
  .description("Clone a repository into a newly created directory.")
  .action((options, source, destination?) => {
    console.log("clone command called");
  });
```

Running a sub-command loads only that sub-command. Printing the help loads all
of them, because their descriptions are part of the output.

Methods chained after the `.command()` method are registered on the sub-command
and applied on top of the lazy loaded command, so it can be configured without
importing its module.

```typescript ignore
import { Command } from "@cliffy/command";

await new Command()
  .command("clone", () => import("./commands/clone.ts"))
  .description("Clone a repository.")
  .alias("cp")
  .parse();
```

> [!NOTE]
> Settings defined this way win over the ones from the lazy loaded command.
> Aliases from both are merged.

### Returning a command directly

The function can also return a command instead of a module, which defers
building it without moving it into another file:

```typescript
import { Command } from "@cliffy/command";

await new Command()
  .command("clone", () =>
    new Command()
      .arguments("<source:string> [destination:string]")
      .description("Clone a repository into a newly created directory.")
      .action(() => {}))
  .parse();
```

### When lazy loading helps

Lazy loading makes running a command faster, because only the commands on its
path are loaded. The rest of the command tree is never built:

- A function returning a command is only called when the command is needed, so
  the commands of every other branch are not built. The saving grows with the
  size of the whole tree and with how much each command defines, such as
  options, arguments, environment variables and examples. It also pays off when
  building a command is expensive, for example when it reads a config file or
  derives options from a schema.
- A dynamic import saves the same, and additionally skips loading the code of
  the module and its dependencies. This saves the most when commands pull in
  large dependencies that other commands do not need.

It has two costs:

- Sub-commands at the same level load concurrently, but a lazy sub-command
  nested inside another one can only load after its parent. With dynamic
  imports, the import time of a deep chain adds up level by level.
- Printing the help loads every sub-command of the command being printed, so it
  costs about the same as declaring them eagerly, and slightly more with dynamic
  imports. Sub-commands of nested commands are not loaded.

Declaring sub-commands eagerly stays the simpler choice for a small command
tree, or for commands that are cheap to build.

## Command Literal Arguments

For arguments with `--` the following can be used.

```typescript
import { Command } from "@cliffy/command";

await new Command()
  .name("my-command")
  .arguments("[...args:string]")
  .option("--foo", "Foo option.")
  .action(function (options, ...args) {
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
