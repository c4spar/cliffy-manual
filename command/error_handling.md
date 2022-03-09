# Error and exit handling

Cliffy throws an `ValidationError` for invalid user input. By default, when a
`ValidationError` is thrown, cliffy prints the auto generated help and the error
message and calls `Deno.exit(1)` to exit the program. This behaviour can be
changed by calling `.throwErrors()` or `.noExit()`.

## Throw errors

By default, cliffy prints the help text and calls `Deno.exit()` when a
`ValidationError` is thrown. You can override this behaviour with the
`.throwErrors()` method. All other errors will be thrown by default.

## No exit

The `.noExit()` method does the same as `.throwErrors()` but also prevents the
command from calling `Deno.exit()` when the help or version option is called.

## Runtime errors

This example will catch only runtime errors.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

const cmd = new Command()
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  .action(() => {
    throw new Error("Some error happened.");
  });

try {
  cmd.parse();
} catch (error) {
  console.error("[CUSTOM_ERROR]", error);
  Deno.exit(1);
}
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/general_error_handling.ts -t
Unknown option "-t". Did you mean option "-h"?
$ deno run https://deno.land/x/cliffy/examples/command/general_error_handling.ts
[CUSTOM_ERROR] Some error happened.
```

## Validation errors

This example will catch all errors. You can differenciate between runtime and
validation errors by checking if the `error` is an instance of
`ValidationError`. The validation error has a `exitCode` property that should be
used to exit the program.

```typescript
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

const cmd = new Command()
  .throwErrors() // <-- throw also validation errors.
  .option("-p, --pizza-type <type>", "Flavour of pizza.")
  .action(() => {
    throw new Error("Some error happened.");
  });

try {
  cmd.parse();
} catch (error) {
  if (error instanceof ValidationError) {
    cmd.showHelp();
    console.error("Usage error: %s", error.message);
    Deno.exit(error.exitCode);
  } else {
    console.error("Runtime error: %s", error);
    Deno.exit(1);
  }
}
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/validation_error_handling.ts -t
Usage error: Unknown option "-t". Did you mean option "-h"?
```

### Custom validation errors

You can throw custom validation errors by throwing an instance of
`ValidationError`. Optional you can define the exit code that should be used
when `Deno.exit()` is called after displaying the auto generated help and the
error message.

```typescript
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

const cmd = new Command()
  .option("-c, --color <name:string>", "Choose a color.")
  .action(({ color }) => {
    if (color === "black") {
      throw new ValidationError("Black is not supported.", { exitCode: 1 });
    }
  })
  .parse();
```
