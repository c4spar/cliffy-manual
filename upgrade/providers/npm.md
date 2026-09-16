# Npm provider

The `NpmProvider` upgrades a cli published as an [npm](https://www.npmjs.com/)
package. Set the full `package` name, or a `scope` plus an optional `name` that
defaults to the cli name.

```ts
import { NpmProvider } from "@cliffy/upgrade/provider/npm";

const provider = new NpmProvider({ package: "@my-scope/my-cli" });
```

For an unscoped package published under the cli name, no options are required.

```ts
import { NpmProvider } from "@cliffy/upgrade/provider/npm";

const provider = new NpmProvider();
```

> [!NOTE]
> When upgrading to `latest`, the `NpmProvider` lets the runtime resolve the
> concrete version instead of pinning it. This way a configured minimum
> dependency age policy is respected (`minimumDependencyAge` in Deno,
> `min-release-age` in npm/pnpm/bun): the upgrade installs the newest version
> allowed by the policy rather than the absolute latest.
