# Dynamic prompts

You can dynamically control the flow of the prompt list with the `before` and
`after` callbacks which works like a middleware function.

```typescript
import {
  Checkbox,
  Confirm,
  Number,
  prompt,
} from "https://deno.land/x/cliffy/prompt/mod.ts";

const result = await prompt([{
  name: "animals",
  message: "Select some animals",
  type: Checkbox,
  options: ["dog", "cat", "snake"],
}, {
  name: "like",
  message: "Do you like animals?",
  type: Confirm,
  after: async ({ like }, next) => { // executed after like prompt
    if (like) {
      await next(); // run age prompt
    } else {
      await next("like"); // run like prompt again
    }
  },
}, {
  name: "age",
  message: "How old are you?",
  type: Number,
  before: async ({ animals }, next) => { // executed before age prompt
    if (animals?.length === 3) {
      await next(); // run age prompt
    } else {
      await next("animals"); // begin from start
    }
  },
}]);

console.log(result);
```

```console
$ deno run https://deno.land/x/cliffy/examples/prompt/dynamic_prompts.ts
```

## Options

Following options are available as global and/or prompt specific options. Global
options will be passed as second argument to the `prompt()` method.

### Prompt name

The `name` option is required for each prompt and is used as key for the results
object where the answer of the prompt is stored.

### Prompt type

The `type` option is required for each prompt and specifies the type of the
prompt.

### Before and after hooks

The `before` callback method is called before and the `after` callback method
after the prompt is executed. It is available as global and prompt specific
option.

The first argument is the `result` object which contains all already available
answers.

The second argument is the `next()` method which executes the next prompt in the
list (for the before callback it's the current prompt). To jump to a specific
prompt you can pass the name or index of the prompt to the `next()` method. To
skip this prompt you can pass `true` to the `next()` method. If `next()` isn't
called all other prompts will be skipped.

### OS signals

> ⚠️ The [cbreak](https://deno.land/api@v1.31.1?s=Deno.SetRawOptions#prop_cbreak)
> option works currently only on Linux and macOS!

The `cbreak` option enables pass-through of os signals to deno, allowing you to
register your own signal handler. It is available as global and prompt specific
option. Read more about os signals [here](./os_signals.md).
