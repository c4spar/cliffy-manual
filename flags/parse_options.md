# Parse options

## Flags

By default the `parseFlags` method parses all flags and tries to autodetect the
type. With the `flags` option you can specify an Array of flag options. If the
`flags` option is set the `parseFlags` method will throw an error for all
unknown or invalid flags. You can find a list of all possible flag options
[here](./flag_options.md).

## Parse

With the `parse` method you can add a custom handler for handling and parsing
types.

> [!NOTE]
> The `parse` method will be called for all types, which means it overrides
> also all built-in types!

```typescript
import { ArgumentValue, parseFlags } from "@cliffy/flags";

parseFlags(Deno.args, {
  flags: [{
    name: "foo",
    type: "float",
  }],
  parse: ({ label, name, value, type }: ArgumentValue) => {
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
$ deno run examples/flags/custom_option_processing.ts --foo 1.2
{ flags: { foo: 1.2 }, unknown: [], literal: [] }

$ deno run examples/flags/custom_option_processing.ts --foo abc
error: Uncaught Error: Option "--foo" must be of type "float", but got "abc".
```

## Option callback

The `option` callback method is called for each parsed option.

## Stop early

If `stopEarly` is enabled, all values starting from the first non option
argument will be added to the `unknown` array (can be combined with
[stopOnUnknown](#stop-on-unknown)).

## Stop on unknown

If `stopOnUnknown` is enabled, all values starting from the first unknown option
argument will be added to the `unknown` array (can be combined with
[stopEarly](#stop-early)).

## Allow empty

If an required option is specified, by default an error is thrown if the command
is invoked without any flags. To disable this behavior you can set `allowEmpty`
to `true`. The default is `false`.

## Dotted

By default, all option names that have dots in their names are converted to
nested objects. For example, `{ "foo.bar": 1 }` becomes
`{ "foo": { "bar": 1 } }`. You can disable this behavior by setting the `dotted`
option to `false`. This is required when parsing command line arguments in
multiple steps (see [parse-context](./index.md#parse-context)).
