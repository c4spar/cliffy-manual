# Colors

The colors module is a simple and tiny chainable wrapper around
[deno's std colors](https://deno.land/std/fmt/colors.ts) module and works
similar to node's [chalk](https://github.com/chalk/chalk) module.

```typescript
import { colors } from "https://deno.land/x/cliffy/ansi/colors.ts";

console.log(
  colors.bold.underline.rgb24("Welcome to Deno.Land!", 0xff3333),
);
```

```console
$ deno run https://deno.land/x/cliffy/examples/ansi/colors.ts
```

## Themes

You can create your own re-usable themes just bei storing your styles into a
variable.

```typescript
// Define theme colors.
const error = colors.bold.red;
const warn = colors.bold.yellow;
const info = colors.bold.blue;

// Use theme colors.
console.log(error("[ERROR]"), "Some error!");
console.log(warn("[WARN]"), "Some warning!");
console.log(info("[INFO]"), "Some information!");

// Override theme colors.
console.log(error.underline("[ERROR]"), "Some error!");
console.log(warn.underline("[WARN]"), "Some warning!");
console.log(info.underline("[INFO]"), "Some information!");
```

```console
$ deno run https://deno.land/x/cliffy/examples/ansi/color_themes.ts
```
