# Ansi

Chainable ansi escape sequences.

![](assets/img/demo.gif)

## Installation

<!--tabs-start-->

### Deno

```bash
deno add jsr:@cliffy/ansi
```

### Pnpm

```bash
pnpm add jsr:@cliffy/ansi
```

or (using pnpm 10.8 or older):

```bash
pnpm dlx jsr add @cliffy/ansi
```

### Yarn

```bash
yarn add jsr:@cliffy/ansi
```

or (using Yarn 4.8 or older):

```bash
yarn dlx jsr add @cliffy/ansi
```

### Vlt

```bash
vlt install jsr:@cliffy/ansi
```

### Npm

```bash
npx jsr add @cliffy/ansi
```

### Bun

```bash
bunx jsr add @cliffy/ansi
```

<!--tabs-end-->

## Usage

### Ansi escape sequences

The [ansi](./ansi.md) and [tty](./tty.md) module can be used to generate or
write ansi escape sequences to stdout.

```typescript
import { tty } from "@cliffy/ansi/tty";

tty.cursorSave
  .cursorHide
  .cursorTo(0, 0)
  .eraseScreen();
```

### Colors

The [colors](./colors.md) module is a simple and tiny chainable wrapper for
[@std/fmt/colors](https://jsr.io/@std/fmt@1.0.3/doc/colors) module and works
similar to node's [chalk](https://github.com/chalk/chalk) module.

```typescript
import { colors } from "@cliffy/ansi/colors";

console.log(
  colors.bold.underline.rgb24("Welcome to Deno.Land!", 0xff3333),
);
```
