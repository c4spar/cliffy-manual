# Getting started

Create simple and powerful interactive prompts with cliffy's prompt module.

## Usage

> ⚠️ This module requires the `--unstable` flag because it uses
> [Deno.setRaw()](https://doc.deno.land/deno/unstable/~/Deno.setRaw) which is
> still marked as unstable.

There are two ways of using this module. You can either use standalone (single)
prompts or you can run a list of prompts that can be dynamically controlled.

### Single prompt

Each prompt type is usable as standalone module and can be imported directly
from the prompt specific module or from the main module. Each prompt has a
static `.prompt()` method which accepts a prompt message or an options object
and returns the prompt result.

Execute a single prompt with a message as first argument.

```typescript
import { Input } from "https://deno.land/x/cliffy/prompt/mod.ts";

const name: string = await Input.prompt(`What's your name?`);
```

Execute a single prompt with an options object as firts argument.

```typescript
import { Input } from "https://deno.land/x/cliffy/prompt/mod.ts";

const name: string = await Input.prompt({
  message: `Choose a username`,
  minLength: 8,
});
```

### Prompt list

To execute a list of prompts you can use the `prompt()` method. The prompt
method accepts an array of [prompt options](./types/index.md) combined with a
`name` and `type` property.

> ❗ Make sure to give each prompt a unique name to prevent overwriting values!

Unlike npm's inquirer, the `type` property accepts a prompt object and not the
name of the prompt.

```typescript
import {
  Checkbox,
  Confirm,
  Input,
  Number,
  prompt,
} from "https://deno.land/x/cliffy/prompt/mod.ts";

const result = await prompt([{
  name: "name",
  message: "What's your name?",
  type: Input,
}, {
  name: "age",
  message: "How old are you?",
  type: Number,
}, {
  name: "like",
  message: "Do you like animal's?",
  type: Confirm,
}, {
  name: "animals",
  message: "Select some animal's",
  type: Checkbox,
  options: ["dog", "cat", "snake"],
}]);

console.log(result);
```

```console
$ deno run --unstable https://deno.land/x/cliffy/examples/prompt/prompt_list.ts
```
