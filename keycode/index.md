# Keycode

ANSI key code parser.

## Usage

The `keycode` module exports a `parse()` method which accepts an ansi string and
return an array of [`KeyCode`](./keycode.md).

```typescript
import { parse } from "@cliffy/keycode";

console.log(
  parse(
    "\x1b[A\x1b[B\x1b[C\x1b[D\x1b[E\x1b[F\x1b[H",
  ),
);
```

```console
$ deno run examples/keycode/example.ts
```

**Output:**

```json
[
  { name: "up", sequence: "\x1b[A", code: "[A", ctrl: false, meta: false, shift: false },
  { name: "down", sequence: "\x1b[B", code: "[B", ctrl: false, meta: false, shift: false },
  { name: "right", sequence: "\x1b[C", code: "[C", ctrl: false, meta: false, shift: false },
  { name: "left", sequence: "\x1b[D", code: "[D", ctrl: false, meta: false, shift: false },
  { name: "clear", sequence: "\x1b[E", code: "[E", ctrl: false, meta: false, shift: false },
  { name: "end", sequence: "\x1b[F", code: "[F", ctrl: false, meta: false, shift: false },
  { name: "home", sequence: "\x1b[H", code: "[H", ctrl: false, meta: false, shift: false }
]
```

## Example

```typescript
import { KeyCode, parse } from "@cliffy/keycode";

async function* keypress(): AsyncGenerator<KeyCode, void> {
  while (true) {
    const data = new Uint8Array(8);

    Deno.stdin.setRaw(true);
    const nread = await Deno.stdin.read(data);
    Deno.stdin.setRaw(false);

    if (nread === null) {
      return;
    }

    const keys: Array<KeyCode> = parse(data.subarray(0, nread));

    for (const key of keys) {
      yield key;
    }
  }
}

console.log("Hit ctrl + c to exit.");

for await (const key of keypress()) {
  if (key.ctrl && key.name === "c") {
    console.log("exit");
    break;
  }
  console.log(key);
}
```

```console
$ deno run examples/keycode/read_key.ts
```
