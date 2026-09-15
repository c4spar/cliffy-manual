# Deno Land provider

The `DenoLandProvider` upgrades a cli published to
[deno.land/x](https://deno.land/x). The module name defaults to the cli name.
Override it with the `name` option.

```ts ignore
import { DenoLandProvider } from "@cliffy/upgrade/provider/deno-land";

const provider = new DenoLandProvider();
```
