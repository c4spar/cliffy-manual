# Environment variables

> ❗ To allow deno to access environment variables the `--allow-env` flag is
> required.

Environment variables added with the `.env()` method will be validated when the
command is executed. Only environment variables which are available on the
executed command will be validated. Valid environment variables will be stored
in the options object and for invalid or missing environment varibles an error
is thrown. They are also shown in the auto generated [help](./help.md).

Environment variable names will be camel cased. For example `SOME_ENV_VAR=true`
will be parsed to `{ someEnvVar: true }`.

> ❗ If an option with the same name is defined, the option will override the
> environment variable.

```typescript
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .env("SOME_ENV_VAR=<value:number>", "Description ...")
  .action((options) => console.log(options))
  .parse(Deno.args);
```

```console
$ deno run https://deno.land/x/cliffy/examples/command/environment_variables.ts
error: Missing required environment variable "SOME_ENV_VAR".

$ SOME_ENV_VAR=abc deno run --allow-env --unstable https://deno.land/x/cliffy/examples/command/environment_variables.ts
Error: Environment variable "SOME_ENV_VAR" must be of type "number", but got "abc".

$ SOME_ENV_VAR=1 deno run --allow-env https://deno.land/x/cliffy/examples/command/environment_variables.ts
{ someEnvVar: 1 }
```

## Global environment variables

Global environment variables are also available on all sub commands. You can add
global environment variables either with the `.env()` method and the `global`
option or with the `.globalEnv()` method.

```ts
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .env("SOME_ENV_VAR=<value:number>", "Description ...", { global: true })
  .globalEnv("SOME_OTHER_ENV_VAR=<value:number>", "Description ...")
  .action((options) => console.log(options))
  .command("hello", "world ...")
  .action((options) => console.log(options))
  .parse(Deno.args);
```

## Required environment variables

Required environment variable can be added with the `required` option. If an
required environment variable is registered the command throws an error if the
environment variable is not defined.

```ts
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .env("SOME_ENV_VAR=<value:number>", "Description ...", { required: true })
  .action((options) => console.log(options))
  .parse(Deno.args);
```

## Hidden environment variables

Hidden environment variable can be added with the `hidden` option and will be
not displayed in the auto generated help.

```ts
import { Command } from "https://deno.land/x/cliffy/command/mod.ts";

await new Command()
  .env("SOME_ENV_VAR=<value:number>", "Description ...", { required: true })
  .action((options) => console.log(options))
  .parse(Deno.args);
```

## Prefix

It is very common to prefix environment variables with a name like `DENO_DIR`
and `DENO_INSTALL_ROOT`. With the `prefix` option you can ensure the prefix is
remove before the value is added to the options object. This works also in
combination with options.

```typescript
await new Command()
  .env(
    "DENO_INSTALL_ROOT=<path:string>",
    "Set install root.",
    { prefix: "DENO_" },
  )
  .option(
    "--install-root <path:string>",
    "Set install root.",
  )
  .action((options) => console.log(options))
  .parse();
```

```console
$ FOO_OUTPUT_FILE=example.txt deno run --allow-env https://deno.land/x/cliffy/examples/command/environment_variables_override.ts
{ outputFile: "example.txt" }
$ FOO_OUTPUT_FILE=example.txt deno run --allow-env https://deno.land/x/cliffy/examples/command/environment_variables_override.ts --output-file example2.txt
{ outputFile: "example2.txt" }
```
