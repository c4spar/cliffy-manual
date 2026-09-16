# Upgrade

Parser-agnostic self-upgrade api for cli tools.

`@cliffy/upgrade` downloads a newer version and replaces the current install. It
handles both script installs (reinstalled from a registry through the runtime's
package manager) and standalone binaries (`deno compile`, `bun build --compile`,
Node single executable applications). It has no dependency on `@cliffy/command`
or `@cliffy/flags`, so it can be used with any argument parser.

> [!NOTE]
> Most cli tools use this through `@cliffy/command`, which wraps it as the
> [`UpgradeCommand`](../command/built_in_commands.md#upgrade-command). Reach for
> `@cliffy/upgrade` directly when you build the upgrade command yourself.

## Installation

<!--tabs-start-->

### Deno

```bash
deno add jsr:@cliffy/upgrade
```

### Pnpm

```bash
pnpm add jsr:@cliffy/upgrade
```

or (using pnpm 10.8 or older):

```bash
pnpm dlx jsr add @cliffy/upgrade
```

### Yarn

```bash
yarn add jsr:@cliffy/upgrade
```

or (using Yarn 4.8 or older):

```bash
yarn dlx jsr add @cliffy/upgrade
```

### Vlt

```bash
vlt install jsr:@cliffy/upgrade
```

### Npm

```bash
npx jsr add @cliffy/upgrade
```

### Bun

```bash
bunx jsr add @cliffy/upgrade
```

<!--tabs-end-->

## Usage

Call `upgrade()` with the cli name, the current and target versions, and a
[provider](./providers/index.md). The provider is a registry adapter that
resolves versions and, for binary upgrades, release assets.

```ts
import { upgrade } from "@cliffy/upgrade";
import { GithubProvider } from "@cliffy/upgrade/provider/github";

await upgrade({
  name: "my-cli",
  from: "1.0.0",
  to: "latest",
  provider: new GithubProvider({ repository: "user/my-cli" }),
});
```

### Versions

`to` is the target version, either a concrete version or `latest`. `from` is the
currently installed version and is optional. Without it, the upgrade always runs
instead of comparing against the installed version, which `force: true` also
does for a known version.

```ts
import { upgrade } from "@cliffy/upgrade";
import { GithubProvider } from "@cliffy/upgrade/provider/github";

await upgrade({
  name: "my-cli",
  from: "1.0.0",
  to: "1.2.0",
  force: true,
  provider: new GithubProvider({ repository: "user/my-cli" }),
});
```

### Standalone binaries

The install kind (script or standalone binary) is detected from the runtime. For
a compiled binary on a runtime that can't report this, pass `standalone: true`
to force the binary path. See [binary upgrade](./binary_upgrade.md) for the
asset configuration it needs.

```ts
import { upgrade } from "@cliffy/upgrade";
import { GithubProvider } from "@cliffy/upgrade/provider/github";

await upgrade({
  name: "my-cli",
  to: "latest",
  provider: new GithubProvider({ repository: "user/my-cli" }),
  standalone: true,
});
```

### Reporting progress

`upgrade()` is silent unless a `logger` is passed. It's an object with `log`,
`info`, `warn` and `error` methods, so `console` works as is:

```ts
import { upgrade } from "@cliffy/upgrade";
import { GithubProvider } from "@cliffy/upgrade/provider/github";

await upgrade({
  name: "my-cli",
  from: "1.0.0",
  to: "latest",
  provider: new GithubProvider({ repository: "user/my-cli" }),
  logger: console,
});
```

`verbose: true` additionally keeps the output of the runtime's install command,
which is silenced otherwise.

### Install arguments

For a script install, `args` is passed to the runtime's install command, for
example Deno permission flags, and `main` is the entrypoint module appended to
the registry url.

```ts
import { upgrade } from "@cliffy/upgrade";
import { JsrProvider } from "@cliffy/upgrade/provider/jsr";

await upgrade({
  name: "my-cli",
  to: "latest",
  provider: new JsrProvider({ package: "@my-scope/my-cli" }),
  args: ["--allow-net"],
  main: "cli.ts",
});
```

### Runtime specific options

The `runtime` option overrides `args` and `main` per runtime, and adds
`importMap` on Deno.

```ts
import { upgrade } from "@cliffy/upgrade";
import { JsrProvider } from "@cliffy/upgrade/provider/jsr";

await upgrade({
  name: "my-cli",
  to: "latest",
  provider: new JsrProvider({ package: "@my-scope/my-cli" }),
  args: ["--allow-net"],
  runtime: {
    deno: { importMap: "import_map.json" },
    node: { args: [] },
  },
});
```

### Errors

Everything the upgrade throws extends `UpgradeError`:

- `VersionNotFoundError`: the requested version isn't listed by the registry.
- `AssetNotFoundError`: no release asset is configured or found for the build
  target, or the binary isn't in the downloaded archive.
- `UnsupportedUpgradeError`: the provider can't perform the requested install
  kind.
- `UnsupportedVersionListingError`: the provider has no version list.

### Driving it from a custom parser

Because `upgrade()` is independent of `@cliffy/command`, a cli built with
`@cliffy/flags` (or any parser) can wire up its own upgrade command:

```ts
import { parseFlags } from "@cliffy/flags";
import { upgrade } from "@cliffy/upgrade";
import { GithubProvider } from "@cliffy/upgrade/provider/github";

const { flags } = parseFlags(Deno.args, {
  flags: [{ name: "version", type: "string", default: "latest" }],
});

await upgrade({
  name: "my-cli",
  from: "1.0.0",
  to: flags.version,
  provider: new GithubProvider({
    repository: "user/my-cli",
    asset: {
      "darwin-x86_64": "my-cli-macos-amd64.tar.gz",
      "linux-x86_64": "my-cli-linux-amd64.tar.gz",
      "windows-x86_64": "my-cli-windows-amd64.zip",
    },
  }),
});
```

## Binary upgrades

The [`GithubProvider`](./providers/github.md),
[`GitlabProvider`](./providers/gitlab.md) and
[`UrlProvider`](./providers/url.md) can replace a standalone binary in place by
downloading a release asset. See [binary upgrade](./binary_upgrade.md) for the
`asset` mapping, custom extractors, install location, and private-repository
token.
