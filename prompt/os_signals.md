# OS signals

> ⚠️ The [cbreak](https://deno.land/api@v1.31.1?s=Deno.SetRawOptions#prop_cbreak)
> option works currently only on Linux and macOS!

By default, cliffy will call `Deno.exit(0)` after the user presses `ctrl+c`. If
you need to use a custom signal handler, you can enable the `cbreak` option on
your prompt. This will enable pass-through of os signals to deno, allowing you
to register your own signal handler.

> When using prompts like `Select` or `Toggle` with the `cbreak` option enabled,
> you have to show the cursor and clear the stdout before calling `Deno.exit()`
> manually. Maybe this will be improved somehow in the future.

```typescript
import { tty } from "https://deno.land/x/cliffy/ansi/tty.ts";
import { Toggle } from "https://deno.land/x/cliffy/prompt/toggle.ts";

Deno.addSignalListener("SIGINT", () => {
  tty.cursorLeft.eraseDown.cursorShow();
  console.log("interrupted!");
  Deno.exit(1);
});

const confirmed: boolean = await Toggle.prompt({
  message: "Please confirm",
  cbreak: true,
});

console.log({ confirmed });
```

```console
$ deno run https://deno.land/x/cliffy/examples/prompt/os_signals.ts
```
