# Error and exit handling

Cliffy throws an `ValidationError` for invalid options, arguments and
environment variables. `ValidationError`'s can be also throw manually. By
default, when a `ValidationError` is thrown, cliffy prints the auto generated
help and the error message and calls `Deno.exit(validationError.exitCode ?? 1)`
to exit the program. This behaviour can be changed by calling
[`.throwErrors()`](#throw-errors) or [`.noExit()`](#no-exit) or by adding an
[error handler](#error-handler).

## Throw errors

By default, cliffy prints the help text of the failed command together with the
error message and calls `Deno.exit()` when a `ValidationError` is thrown. All
other errors will be thrown by default. You can override this behaviour with the
`.throwErrors()` method to always throw errors.

## No exit

The `.noExit()` method does the same as `.throwErrors()` but also prevents the
command from calling `Deno.exit()` for example when the help or version option
is called.

## Error handler

Errors can be caught by simply wrapping the `.parse()` method into a try catch
block. But you can also register an error handler with the `.error()` method.

Child commands can override error handlers from parent commands. If the error
handler doesn't throw or call `Deno.exit`, the default error handler is
executed.

The first argument of the error handler is the error and the second argument the
instance of the failed command. You can use this instance to print the help text
from this command.

```ts
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .error((error, cmd) => {
    if (error instanceof ValidationError) {
      cmd.showHelp();
    }
    console.error(error);
    Deno.exit(error instanceof ValidationError ? error.exitCode : 1);
  })
  .action(() => {
    throw new ValidationError("validation error message.");
  })
  .parse();
```

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
  await cmd.parse();
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

This example will catch all errors. You can differentiate between runtime and
validation errors by checking if the `error` is an instance of
`ValidationError`. The validation error has a `exitCode` property that should be
used to exit the program. It also provides a `cmd` property which references the
failed command.

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
  await cmd.parse();
} catch (error) {
  if (error instanceof ValidationError) {
    error.cmd?.showHelp();
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

await new Command()
  .option("-c, --color <name:string>", "Choose a color.")
  .action(({ color }) => {
    if (color === "black") {
      throw new ValidationError("Black is not supported.", { exitCode: 1 });
    }
  })
  .parse();
```

## Throw errors outside the command context

The `.throw()` method can be used to throw errors outside the command context so
you have the same behaviour as when you throw an error for example within an
action handler or a type.

```ts
import {
  Command,
  ValidationError,
} from "https://deno.land/x/cliffy/command/mod.ts";

const { options, cmd } = await new Command()
  .error((_error, _cmd) => {
    console.error("error handler...");
    // Throw or call Deno.exit() to disable the default error handler.
    // throw _error;
    // Deno.exit(_error instanceof ValidationError ? _error.exitCode : 1);
  })
  .option("-r, --runtime-error", "Triggers a runtime error.")
  .option("-v, --validation-error", "Triggers a validation error.")
  .parse();

if (options.validationError) {
  cmd.throw(new ValidationError("validation error message."));
}

if (options.runtimeError) {
  cmd.throw(new Error("runtime error message."));
}
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/throw.ts --runtime-error
error handler...
error: Uncaught Error: runtime error message.
  cmd.throw(new Error("runtime error message."));
            ^
    at https://deno.land/x/cliffy/examples/command/throw.ts:21:13
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/throw.ts --validation-error
error handler...

  Usage: COMMAND

  Options:

    -h, --help              - Show this help.
    -r, --runtime-error     - Triggers a runtime error.
    -v, --validation-error  - Triggers a validation error.

  error: validation error message.
```
