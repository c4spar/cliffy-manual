# Types

## Base Options

All prompt types have the following base options.

### Prompt message

With the `message` option you specify the prompt message to display. This option
is required for all prompts.

### Default value

You can set a default value with the `default` option. The type depends on the
prompt type.

### Hide default value

By default the default value is displayed in the prompt. To hide the default
value, you can set the `hideDefault` option to `true`.

### Transform displayed value

The `transform` callback option lets you transform the value to display. The
method receives the user input and the value returned value will be displayed.

### Validate value

With the `validate` callback option you can validate the user input. It receives
as first argument the sanitized user input.

- If `true` is returned, the value is valid.
- If `false` is returned, an error message is shown.
- If a `string` is returned, the value will be used as error message.

### Info message

With the `hint` option you can display an info message that is displayed below
the prompt.

### Pointer icon

With the `pointer` option the pointer icon can be changed.

```ts
import { colors } from "@cliffy/ansi/colors";
import { Input } from "@cliffy/prompt/input";

const result: string = await Input.prompt({
  message: "Say hallo!",
  pointer: colors.bold.brightBlue("-->"),
});

console.log({ result });
```

### Prompt indentation

With the `indent` option you can change the prompt indentation. Default is
`" "`.

### OS signals

> ⚠️ The
> [cbreak](https://deno.land/api@v1.31.1?s=Deno.SetRawOptions#prop_cbreak)
> option works currently only on Linux and macOS!

The `cbreak` option enables pass-through of os signals to deno, allowing you to
register your own signal handler. Read more about os signals
[here](../os_signals.md).

### Prefix

By default each prompt message is prefixed with `yellow("? ")`. The prefix can
be change with the `prefix` option. The value supports ansi color codes. To
disable the prefix, set the `prefix` option to an empty string `""`.

### Reader

With the `reader` option you can change the input stream which defaults to
`Deno.stdin`.

### Writer

With the `writer` option you can change the output stream which defaults to
`Deno.stdout`.
