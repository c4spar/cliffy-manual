# Shell completion

Cliffy supports shell completion out of the box. To enable shell completions it
is required to register the
[completions](./built_in_commands.md#completions-command) command.

The completions command generates a shell completions script for your specific
shell environment. Currently supported shells are:

- [bash](./built_in_commands.md#bash-completions)
- [fish](./built_in_commands.md#fish-completions)
- [zsh](./built_in_commands.md#zsh-completions)

The completions command enables completions for all sub-commands, options and
arguments.

## Adding shell completions

There are three ways to add shell completions to types which are explained in
the following sections.

### Enum type

One way is to use the `EnumType`. All values defined with the `EnumType` will be
used for shell completions. Read more about the enum type
[here](./types.md#enum-type).

```typescript
import { Command, EnumType } from "@cliffy/command";

const colorType = new EnumType(["red", "blue", "yellow"]);

await new Command()
  .type("color", colorType)
  .arguments("[color-name:color]")
  .option("-c, --color <name:color>", "Choose a color.")
  .parse();
```

### Complete method

Another way to add completions is by registering a completions action with the
`.complete()` or `.globalComplete()` method. The values returned by the callback
method from the`.complete()` or `.globalComplete()` method will be used for
shell completions.

To use these completions you can add the name of the action after the type
separated by colon.

> [!NOTE]
> Completions defined with the `.complete()` or `.globalComplete()` method will
> override completions defined with the `.type()` or `.globalType()` method.

```typescript
import { Command } from "@cliffy/command";

await new Command()
  .complete("color", () => ["red", "blue", "yellow"])
  .arguments("[color-name:string:color]")
  .option("-c, --color <name:string:color>", "Choose a color.")
  .parse();
```

### Custom type

The 3rd way to add shell completions is by creating a custom type with a
`.complete()` method. The values returned by the `.complete()` method will be
used for shell completions. You can read more about custom types
[here](./types.md#custom-types).

```typescript
import { Command, StringType } from "@cliffy/command";

class ColorType extends StringType {
  override complete(): Array<string> {
    return ["red", "blue", "yellow"];
  }
}

await new Command()
  .type("color", new ColorType())
  .option("-c, --color <name:color>", "Choose a color.")
  .parse();
```

## Dynamically generating shell completions

You can also dynamically generate the completions shell script. To do this you
can call the `generateShellCompletions()` function. The function accepts the
command instance and the shell name as arguments and returns the generated shell
completions script as string.

Optionally you can also pass a third argument to the
`generateShellCompletions()` function. The third argument is an options object
with the following properties:

- `name`: The name of the binary. Default is the name of the command.

```typescript
import { Command, generateShellCompletions } from "@cliffy/command";

const cmd = await new Command()
  .name("mycmd")
  .complete("color", () => ["red", "blue", "yellow"])
  .arguments("[color-name:string:color]")
  .parse();

const bashCompletions = generateShellCompletions(cmd, "bash");
console.log(bashCompletions);
```
