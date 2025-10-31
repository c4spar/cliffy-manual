# Secret

The `Secret` prompt is a hidden text input which doesn't diplay the input value.

![](../assets/img/secret.gif)

```typescript
import { Secret } from "@cliffy/prompt/secret";

const password = await Secret.prompt("Enter your password");
```

```console
$ deno run examples/prompt/secret.ts
```

## Options

The `Secret` prompt has all [base options](./index.md) and the following prompt
specific options.

### Secret name

You can change the displayed name of secret with the `label` option. Default is
`Password`.

### Min secret length

The `minLength` option specifies the minimum length of the input value. Default
is `0`.

### Max secret length

The `maxLength` option specifies the minimum length of the input value. Default
is `infinity`.

### Hide input value

By default a `*` is shown for each user input. If the `hidden` option is enabled
the user input is hidden during typing and a fix number of `*` characters is
shown on success.
