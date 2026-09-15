# Nest Land provider

The `NestLandProvider` upgrades a cli published to
[nest.land](https://nest.land). The module name defaults to the cli name.
Override it with the `name` option.

```ts ignore
import { NestLandProvider } from "@cliffy/upgrade/provider/nest-land";

const provider = new NestLandProvider();
```
