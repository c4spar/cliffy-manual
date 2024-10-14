# Error handling

You can catch validation errors with the `ValidationError` class. A validation
error is thrown when an invalid command is invoked by the user.

```typescript
import { parseFlags, ValidationError } from "@cliffy/flags";

try {
  const flags = parseFlags(Deno.args, {
    flags: [{
      name: "debug",
    }],
  });
  console.log(flags);
} catch (error) {
  // Flags validation error.
  if (error instanceof ValidationError) {
    console.log("[VALIDATION_ERROR] %s", error.message);
    Deno.exit(1);
  }
  // General error.
  throw error;
}
```

```console
$ deno run https://deno.land/x/cliffy/examples/flags/error_handling.ts -d
[VALIDATION_ERROR] Unknown option "-d". Did you mean option "--debug"?
```
