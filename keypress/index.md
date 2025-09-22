# Keypress

Keypress module with promise, async iterator and event target API.

## Installation

<!--tabs-start-->

### Deno

```bash
deno add jsr:@cliffy/keypress
```

### Pnpm

```bash
pnpm add jsr:@cliffy/keypress
```

or (using pnpm 10.8 or older):

```bash
pnpm dlx jsr add @cliffy/keypress
```

### Yarn

```bash
yarn add jsr:@cliffy/keypress
```

or (using Yarn 4.8 or older):

```bash
yarn dlx jsr add @cliffy/keypress
```

### Vlt

```bash
vlt install jsr:@cliffy/keypress
```

### Npm

```bash
npx jsr add @cliffy/keypress
```

### Bun

```bash
bunx jsr add @cliffy/keypress
```

<!--tabs-end-->

## Usage

There are two ways to use this module. You can use the `keypress()` method,
which returns a global instance of the `KeyPress` class, or you can create a new
instance of the `KeyPress` class. There is no difference between these two ways,
except that the `keypress()` method always returns the same instance, unless the
`.dispose()` method is called. In this case a new instance is returned.

### Promise

The keypress module can be used as promise. It reads one chunk from stdin and
returns a `KeyPressEvent` for the first parsed character.

```typescript
import { keypress, KeyPressEvent } from "@cliffy/keypress";

const event: KeyPressEvent = await keypress();

console.log(
  "type: %s, key: %s, ctrl: %s, meta: %s, shift: %s, alt: %s, repeat: %s",
  event.type,
  event.key,
  event.ctrlKey,
  event.metaKey,
  event.shiftKey,
  event.altKey,
  event.repeat,
);
```

```console
$ deno run --reload examples/keypress/promise.ts
```

### Async Iterator

The keypress module can be used as async iterator to iterate over all keypress
events. The async iterator reads chunk by chunk from stdin. On each step, it
reads one chunk from stdin and emits for each character a keypress event. It
pauses reading from stdin before emitting the events, so stdin is not blocked
inside the for loop.

```typescript
import { keypress, KeyPressEvent } from "@cliffy/keypress";

for await (const event of keypress()) {
  console.log(
    "type: %s, key: %s, ctrl: %s, meta: %s, shift: %s, alt: %s, repeat: %s",
    event.type,
    event.key,
    event.ctrlKey,
    event.metaKey,
    event.shiftKey,
    event.altKey,
    event.repeat,
  );

  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    break;
  }
}
```

```console
$ deno run --reload examples/keypress/async_iterator.ts
```

### Event Target

The Keypress class extends from the EventTarget class that provides a
`.addEventListener()` method that can be used to register event listeners. The
addEventListener method starts an event loop in the background that reads from
stdin and emits an event for each input.

> ❗ As long as the event loop is running, stdin is blocked for other resources.

You can stop the event loop with `keypress().dispose()`.

> ❕ The promise and async iterator based solution does not start an event loop
> in the background.

```typescript
import { keypress, KeyPressEvent } from "@cliffy/keypress";

keypress().addEventListener("keydown", (event: KeyPressEvent) => {
  console.log(
    "type: %s, key: %s, ctrl: %s, meta: %s, shift: %s, alt: %s, repeat: %s",
    event.type,
    event.key,
    event.ctrlKey,
    event.metaKey,
    event.shiftKey,
    event.altKey,
    event.repeat,
  );

  if (event.ctrlKey && event.key === "c") {
    console.log("exit");
    keypress().dispose();
  }
});
```

```console
$ deno run --reload examples/keypress/event_target.ts
```
