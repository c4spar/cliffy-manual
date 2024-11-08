# Tty

The tty module exports a `tty` object which works almost the same way as the
`ansi` module. The only difference is, the `tty` module writes the ansi escape
sequences directly to stdout.

```typescript
import { tty } from "@cliffy/ansi/tty";

tty.cursorSave
  .cursorHide
  .cursorTo(0, 0)
  .eraseScreen();
```

Create a new instance.

```typescript
import { tty } from "@cliffy/ansi/tty";

const myTty = tty({
  writer: Deno.stdout,
  reader: Deno.stdin,
});

myTty.cursorSave
  .cursorHide
  .cursorTo(0, 0)
  .eraseScreen();
```
