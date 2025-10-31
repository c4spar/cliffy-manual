# Generic options and types

Since `v0.21.0`, cliffy has strict types by default. All types, option and
environment-variable names will be automatically magically inferred 🪄.

> [!NOTE]
> It is no longer recommended to define the types manually with the generic
> parameters.

The only exception where you define generics manually is when you want to
organize your sub commands in separate files, than you can use the first two
generic constructor parameters which are used do define required global options
and types which is explained in [Generic parent types](#generic-parent-types).

Another exception is, if you want to extend the command class to share it with
other projects like cliffy it does with the `HelpCommand`. This is explained in
[extending commands](#extending-commands).

## Generic parent types

If you want to organize your sub commands into different files, you can define
required global parent options and types in the constructor of the child
command.

The first parameter defines required global options and/or environment
variables. The second parameter defines required global custom types.

```typescript
import { Command, EnumType } from "@cliffy/command";

const colorType = new EnumType(["red", "blue"]);

const fooCommand = new Command<
  { debug?: true },
  { color: typeof colorType }
>()
  .option("-b, --bar", "...")
  .option("-c, --color <color-name:color>", "...")
  .action((options) => {
    if (options.debug) {
      console.log("debug");
    }
    if (options.bar) {
      console.log("bar");
    }
    if (options.color) {
      console.log("color", options.color);
    }
  });

await new Command()
  .globalType("color", colorType)
  .globalOption("-d, --debug", "...")
  .command("foo", fooCommand)
  .parse();
```

The types of the options object will look like this:

```ts
type Options = {
  debug?: true | undefined;
  bar?: true | undefined;
  color?: "red" | "blue" | undefined;
};
```

## Extending commands

If you want to extend the `Command` class like cliffy it does with the
`HelpCommand`. New instances of this command will have `void` types by default.
In this case you can specify the types manually with the generic constructor
parameters of the `Command` class. But this is completely optional. You can add
`void` commands to any other command.

> When you specify the types, it is recommended to return the command instance
> in the constructor.

This way you can ensure the constructor typings matches your command typings,
because in typescript you can only return an instance in the constructor that is
compatible to it self.

```ts
import { Command } from "@cliffy/command";

class FooCommand extends Command<
  void,
  void,
  { foo?: string; bar?: number },
  [string, string?]
> {
  constructor() {
    super();
    return this
      .name("foo")
      .description("Foo command.")
      .option("--foo <value:string>", "...")
      .option("--bar <value:number>", "...")
      .arguments("<input:string> [output:string]")
      .action(() => console.log("foo"));
  }
}
```
