# Ansi

The ansi module exports an `ansi` object with chainable methods and properties
for generating ansi escape sequence strings. The last property must be invoked
as a method to generate the ansi string.

```typescript
import { ansi } from "https://deno.land/x/cliffy/ansi/ansi.ts";

console.log(
  ansi.cursorUp.cursorLeft.eraseDown(),
);
```

## Arguments

If the last method takes some arguments, you have to invoke the `.toString()`
method to generate the ansi string.

```typescript
import { ansi } from "https://deno.land/x/cliffy/ansi/ansi.ts";

console.log(
  ansi.cursorUp(2).cursorLeft.eraseDown(2).toString(),
);
```

## Uint8Array

Convert to `Uint8Array`:

```typescript
import { ansi } from "https://deno.land/x/cliffy/ansi/ansi.ts";

await Deno.stdout.write(
  ansi.cursorUp.cursorLeft.eraseDown.toBuffer(),
);
```

## Functional

You can also directly import the ansi escape methods from the `ansi_escapes.ts`
module.

```typescript
import {
  cursorTo,
  eraseDown,
  image,
  link,
} from "https://deno.land/x/cliffy/ansi/ansi_escapes.ts";

const response = await fetch("https://deno.land/images/hashrock_simple.png");
const imageBuffer: ArrayBuffer = await response.arrayBuffer();

console.log(
  cursorTo(0, 0) +
    eraseDown() +
    image(imageBuffer, {
      width: 29,
      preserveAspectRatio: true,
    }) +
    "\n          " +
    link("Deno Land", "https://deno.land") +
    "\n",
);
```

```console
$ deno run --allow-net https://deno.land/x/cliffy/examples/ansi/functional.ts
```
