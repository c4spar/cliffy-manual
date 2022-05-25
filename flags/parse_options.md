# Parse options

## Flags

B default the `parseFlags` method parses all flags and tries to autodetect the
type. With the `flags` options you can specify an Array of flags options. If the
`flags` option is set the `parseFlags` method will throw an error for all
unknown or invalid flags. You can find a list of all possible flag options
[here](./flag_options.md).

## Parse

With the `parse` method you can add a custom handler for handling and parsing
types.

> ❗ The `parse` method will be called for all types, which means it overrides
> also all build in types!

```typescript
import { ITypeInfo, parseFlags } from "https://deno.land/x/cliffy/flags/mod.ts";

parseFlags(Deno.args, {
  flags: [{
    name: "foo",
    type: "float",
  }],
  parse: ({ label, name, value, type }: ITypeInfo) => {
    switch (type) {
      case "float":
        if (isNaN(Number(value))) {
          throw new Error(
            `${label} "${name}" must be of type "${type}", but got "${value}".`,
          );
        }
        return parseFloat(value);
      default:
        throw new Error(`Unknown type "${type}".`);
    }
  },
});
```

```console
$ deno run https://deno.land/x/cliffy/examples/flags/custom_option_processing.ts --foo 1.2
{ flags: { foo: 1.2 }, unknown: [], literal: [] }

$ deno run https://deno.land/x/cliffy/examples/flags/custom_option_processing.ts --foo abc
error: Uncaught Error: Option "--foo" must be of type "float", but got "abc".
```

## Option callback

The `option` callback method option is called for each parsed option.

## Stop early

If `stopEarly` is enabled, all values starting from the first non option
argument will be added to the `unknown` array.

## Allow empty

If an required option is specified, by default an error is thrown if the command
is invoked without any flags. To disable this behavior you can set `allowEmpty`
to `true`. The default is `false`.
