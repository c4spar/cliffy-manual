# Types

## Base Options

All prompt types have the following base options.

### Prompt message

With the `message` option you specify the prompt message to display. This option
is required for all prompts.

### Default value

You can set a default value with the `default` option. The type depends on the
prompt type.

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

With the `hint` option you can display a info message that is displayed below
the prompt.

### Pointer icon

The `pointer` option lets you change the pointer icon.

### Prompt indentation

With the `indent` option you can change the prompt indentation. Default is
`" "`.

### OS signals

> ⚠️ The [cbreak](https://deno.land/api@v1.31.1?s=Deno.SetRawOptions#prop_cbreak)
> option works currently only on Linux and macOS!

The `cbreak` option enables pass-through of os signals to deno, allowing you to
register your own signal handler. Read more about os signals
[here](../os_signals.md).
