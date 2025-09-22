# Prompt

Cliffy's prompt module allows you to create simple yet powerful interactive
prompts for your command-line applications.

## Installation

<!--tabs-start-->

### Deno

```bash
deno add jsr:@cliffy/prompt
```

### Pnpm

```bash
pnpm add jsr:@cliffy/prompt
```

or (using pnpm 10.8 or older):

```bash
pnpm dlx jsr add @cliffy/prompt
```

### Yarn

```bash
yarn add jsr:@cliffy/prompt
```

or (using Yarn 4.8 or older):

```bash
yarn dlx jsr add @cliffy/prompt
```

### Vlt

```bash
vlt install jsr:@cliffy/prompt
```

### Npm

```bash
npx jsr add @cliffy/prompt
```

### Bun

```bash
bunx jsr add @cliffy/prompt
```

<!--tabs-end-->

## Usage

There are two ways of using this module. You can either use standalone (single)
prompts or you can run a list of prompts that can be dynamically controlled.

### Single prompt

Each prompt type is usable as standalone module and can be imported directly
from the prompt specific module or from the main module. Each prompt has a
static `.prompt()` method which accepts a prompt message or an options object
and returns the prompt result.

Execute a single prompt with a message as first argument.

```typescript
import { Input } from "@cliffy/prompt";

const name: string = await Input.prompt(`What's your name?`);
```

Execute a single prompt with an options object as first argument.

```typescript
import { Input } from "@cliffy/prompt";

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
import { Checkbox, Confirm, Input, Number, prompt } from "@cliffy/prompt";

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
  message: "Do you like animals?",
  type: Confirm,
}, {
  name: "animals",
  message: "Select some animals",
  type: Checkbox,
  options: ["dog", "cat", "snake"],
}]);

console.log(result);
```

```console
$ deno run examples/prompt/prompt_list.ts
```
