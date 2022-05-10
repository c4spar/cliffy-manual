# Types

Cliffy provides some default types which are used to validate user input,
providing shell completions and adding infos to the help text. It is also
possible to register custom types. You can read more about custom types
[here](#custom-types).

Types can be declared after the argument name, separated by colon `<name:type>`.
If no type is specified, the type defaults to `string`. If an option with no
arguments is defined the type defaults to `true`.

## Build-in types

Following types are available by default on all commands.

- **boolean:** Can be one of: `true`, `false`, `1` or `0`.
- **string:** Can be any value.
- **number:** Can be any numeric value.
- **integer:** Can be any integer value.
- **file:** Same as string but adds support for path completion.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  // Env value must be always required.
  .env("DEBUG=<debug:boolean>", "Enable debugging.")
  // Option with no value.
  .option("-d, --debug", "Enable debugging.")
  // Option with optional boolean value.
  .option("-s, --small [small:boolean]", "Small pizza size.")
  // Option with required string value.
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  // Option with required number value.
  .option("-a, --amount <amount:integer>", "Pieces of pizza.")
  // One required and one optional command arguemnt.
  .arguments("<input:file> [output:file]")
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/common_option_types.ts -p
Error: Missing value for option "--pizza-type".

$ deno run https://deno.land/x/cliffy/examples/command/common_option_types.ts -sp vegetarian --amount 3
{ small: true, pizzaType: "vegetarian", amount: 3 }
```

## Enum type

The `EnumType` can be used to define a list of allowed values. The constructor
accepts either an `Array<string | number | boolean>` or an `enum`. The values
are used for input validation and shell completions and displayed in the help
text and types will be automatically inferred and applied to the values of the
command options and arguments.

```typescript
import { Command, EnumType } from "https://deno.land/x/cliffy/command/mod.ts";

enum Animal {
  Dog = "dog",
  Cat = "cat",
}

// Enum type with enum.
const animal = new EnumType(Animal);

// Enum type with array.
const color = new EnumType(["blue", "yellow", "red"]);

await new Command()
  .type("color", color)
  .type("animal", animal)
  .option(
    "-c, --color [name:color]",
    "Choose a color.",
  )
  .option(
    "-a, --animal [name:animal]",
    "Choose an animal.",
  )
  .action(({ color, animal }) => {
    console.log("color: %s", color);
    console.log("animal: %s", animal);
  })
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/enum_option_type.ts --color red --animal dog
color: red
animal: dog

$ deno run https://deno.land/x/cliffy/examples/command/enum_option_type.ts --color foo
error: Option "--color" must be of type "color", but got "foo". Expected values: "blue", "yellow", "red"
```

## List types

Each type can be used as a list. A list type accepts a `,` seperated list of
items with the specified type. The default separator is `,` but can be changed
with the `separator` option.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const { options } = await new Command()
  // comma separated list
  .option("-l, --list <items:number[]>", "comma separated list of numbers.")
  // space separated list
  .option(
    "-o, --other-list <items:string[]>",
    "space separated list of strings.",
    { separator: " " },
  )
  .parse(Deno.args);

console.log(options);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/list_option_type.ts -l 1,2,3
{ list: [ 1, 2, 3 ] }

$ deno run https://deno.land/x/cliffy/examples/command/list_option_type.ts -o "1 2 3"
{ otherList: [ "1", "2", "3" ] }
```

## Global types

To make a type also available for child commands, you can use the
`.globalType()` method. You can also make a type global with the `global` option
in `.type()` method.

```typescript
import { Command, EnumType } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .globalType("color", new EnumType(["red", "blue", "yellow"]))
  .command("foo", "...")
  .option("-c, --color <name:color>", "Chose a color.")
  .action(console.log)
  .command("bar", "...")
  .option("-b, --background-color [name:color]", "Choose a background color.")
  .action(console.log)
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/global_custom_type.ts login --color "red"
{ color: "red" }
```

## Custom types

You can register custom types with the `.type()` method. The first argument is
the name of the type, the second can be either a function or an instance of
`Type` and the third argument can be an options object.

### Function types

This example shows you how to use a function as type handler.

```typescript
import { Command, ITypeInfo } from "https://deno.land/x/cliffy/command/mod.ts";

const colors = ["red", "blue", "yellow"];

function colorType({ label, name, value }: ITypeInfo): string {
  if (!colors.includes(value.toLowerCase())) {
    throw new Error(
      `${label} "${name}" must be a valid color, but got "${value}". Possible values are: ${
        colors.join(", ")
      }`,
    );
  }

  return value;
}

const { options } = await new Command()
  .type("color", colorType)
  .arguments("[color-name:color]")
  .option("-c, --color <name:color>", "...")
  .command("foo [color-name:color]", "...")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type.ts -e "red"
{ color: "red" }
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type.ts -e "green"
Error: Option "--color" must be a valid color, but got "green". Possilbe values are: red, blue, yellow
```

### Class types

This example shows you how to create a custom type that extends the base `Type`.

```typescript
import {
  Command,
  ITypeInfo,
  Type,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

class ColorType extends Type<string> {
  private readonly colors = ["red", "blue", "yellow"];

  public parse({ label, name, value }: ITypeInfo): string {
    if (!this.colors.includes(value)) {
      throw new ValidationError(
        `${label} "${name}" must be a valid color, but got "${value}". Possible values are: ${
          this.colors.join(", ")
        }`,
      );
    }

    return value;
  }
}

const { options } = await new Command()
  .type("color", new ColorType())
  .arguments("[color-name:color]")
  .option("-c, --color <name:color>", "...")
  .command("foo [color-name:color]", "...")
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type_class.ts -e "red"
{ color: "red" }
$ deno run https://deno.land/x/cliffy/examples/command/custom_option_type_class.ts -e "green"
Error: Option "--color" must be a valid color, but got "green". Possible values are: red, blue, yellow
```

The `ValidationError` ensures that the help is displayed befor the program
exits. You can read more about error handling [here](./error_handling.md).

#### Shell completions

You can also add shell completions to custom types by adding a `complete` method
to your type. Read more about shell completions
[here](./shell_completions.md#custom-type).

```ts
import { Command, Type } from "https://deno.land/x/cliffy/command/mod.ts";

class ColorType extends Type<string> {
  complete(): Array<string> {
    return ["red", "blue", "yellow"];
  }
}
```

#### Override possible values in help text

To override possible values listed in the auto generated help, you can add a
`.values()` method to your custom type.

```ts
import { Command, Type } from "https://deno.land/x/cliffy/command/mod.ts";

class ColorType extends Type<string> {
  values(): Array<string> {
    return ["red", "blue", "yellow"];
  }
}
```
