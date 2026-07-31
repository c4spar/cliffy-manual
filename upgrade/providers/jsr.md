# Jsr provider

The `JsrProvider` upgrades a cli published as a [jsr](https://jsr.io) package.
Set the full `package` name, or a `scope` plus an optional `name` that defaults
to the cli name.

```ts ignore
import { JsrProvider } from "@cliffy/upgrade/provider/jsr";

const provider = new JsrProvider({ package: "@my-scope/my-cli" });
```

```ts ignore
const provider = new JsrProvider({ scope: "my-scope", name: "my-cli" });
```

> [!NOTE]
> When upgrading to `latest`, the `JsrProvider` lets the runtime resolve the
> concrete version instead of pinning it. This way a configured minimum
> dependency age policy is respected (`minimumDependencyAge` in Deno,
> `min-release-age` in npm/pnpm/bun): the upgrade installs the newest version
> allowed by the policy rather than the absolute latest.
