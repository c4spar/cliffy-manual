# Flag options

## Name

With the name you can specify the name of the flag. The name is also used as
property name for the options object.

## Type

With the `type` you specify the type of the argument. The type can be one of the
following types or any custom types.

- `boolean`
- `string`
- `number`
- `integer`

The `type` option is optional. If no type is specified the flag is a boolean
option without a value. If `type` is set to `boolean` the flag can have a
boolean value.

## Optional value

by default for all options with a defined type the value is required. You can
make the value optional by setting `optionalValue` to `true`.

## Variadic value

You can make an argument variadic with the `variadic` option. A variadic value
can appear multiple times.

## List value

If `list` is set to `true`, the argument will be splittet by `,` and the values
will be stored in an array. You can overide the seperator with the `seperator`
option.

## Aliases

You can specify some aliases for the flag with the `aliases` option.

## Standalone

If `standalone` is set to `true`, this option cannot be combined with other
options.

## Default

With the `default` option you specify the default value of the flag when the
flag is not specified on comandline.

## Required

If `required` is set to `true` an error is throw if the flag is not set on
commandline.

## Depends

You can specify flags which must be provided if a specific flag is set. If
`depends` is set to `["foo", "bar"]`, an error is throw if one of this flags are
not provided on commandline.

## Conflicts

This is the opposit of the `conflicts` option. You can specify flags which can
not be provided if a specific flag is set. If `conflicts` is set to
`["foo", "bar"]`, an error is throw if one of this flags is provided on
commandline.

## Collect values

If `collect` is enabled, an flag can be specified multiple times on commandline.
All values will be collected in to an array.

```typescript
import { parseFlags } from "https://deno.land/x/cliffy/flags/mod.ts";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "color",
    type: "string",
    collect: true,
  }],
});

console.log(flags);
```

```console
$ deno run https://deno.land/x/cliffy/examples/flags/collect.ts --color red --color blue
{ color: ["red", "blue"] }
```

## Map values

You may specify a function to do custom processing of flag values. The callback
function receives one parameter, the user specified value which is already
parsed into the specified type. The return value of this method will be used as
flag value.

If [collect](#collect-values) is enabled the function receives as second
parameter the previous value. This allows you to coerce the option value to the
desired type, or accumulate values, or do entirely custom processing.

```typescript
import {
  parseFlags,
  ValidationError,
} from "https://deno.land/x/cliffy/flags/mod.ts";

const { flags } = parseFlags(Deno.args, {
  flags: [{
    name: "color",
    type: "string",
    collect: true,
    value(value: string, previous: Array<string>): Array<string> | undefined {
      if (["foo", "bar", "baz"].includes(value)) {
        return [...previous, value];
      }
      // if no value is returned, a default validation error will be thrown.
      // You can use the `ValidationError` to provide a custom error message.
      throw new ValidationError(
        `Option "--value" must be one of "foo", "bar" or "baz", but got "${value}".`,
      );
    },
  }],
});

console.log(flags);
```

```console
$ deno run https://deno.land/x/cliffy/examples/flags/value.ts --value fooo
error: Uncaught Error: Option "--value" must be one of "foo", "bar" or "baz", but got "fooo".
$ deno run https://deno.land/x/cliffy/examples/flags/value.ts --value foo
{ value: ["foo"] }
```

## Args

The `args` array can be used if the flag has multiple values. Following options
are available in the `args` array.

- [type](#type)
- [optionalValue](#optional-value)
- [variadic](#variadic-value)
- [list](#list-value)

## Ignore defaults

The `ignoreDefaults` option can be used to ignore the default values from
specific options. The `ignoreDefaults` option is an object. The keys have to
match the option name but the value can be anything (values are ignored).
