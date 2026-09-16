# Github provider

The `GithubProvider` upgrades from a github repository, set with the
`repository` option. For a script install it reinstalls the cli source from any
tag or branch. For a standalone executable it downloads a
[release asset](#binary-upgrades) instead.

```ts
import { GithubProvider } from "@cliffy/upgrade/provider/github";

const provider = new GithubProvider({ repository: "user/my-cli" });
```

## Listing versions

The github provider lists all tags and branches. Lists longer than `25` entries
are rendered as a table.

```console
$ COMMAND upgrade --registry github --list-versions
Tags:

  v0.18.2   v0.17.0   v0.14.1   v0.11.2   v0.8.2   v0.6.1   v0.3.0
  v0.18.1 * v0.16.0   v0.14.0   v0.11.1   v0.8.1   v0.6.0   v0.2.0
  v0.18.0   v0.15.0   v0.13.0   v0.11.0   v0.8.0   v0.5.1   v0.1.0
  v0.17.2   v0.14.3   v0.12.1   v0.10.0   v0.7.1   v0.5.0
  v0.17.1   v0.14.2   v0.12.0   v0.9.0    v0.7.0   v0.4.0

Branches:

  main (Protected)
  keypress/add-keypress-module
  keycode/refactoring
  command/upgrade-command
```

Disable branch listing with the `branches` option.

```ts
import { GithubProvider } from "@cliffy/upgrade/provider/github";

new GithubProvider({ repository: "user/my-cli", branches: false });
```

## Binary upgrades

To upgrade a standalone executable, map each `os-arch` target to its release
asset filename with the `asset` option. The `os` and `arch` keys use the Deno
naming convention (`darwin`/`linux`/`windows`, `x86_64`/`aarch64`) on every
runtime.

```ts
import { GithubProvider } from "@cliffy/upgrade/provider/github";

new GithubProvider({
  repository: "user/my-cli",
  asset: {
    "darwin-x86_64": "my-cli-macos-amd64.tar.gz",
    "darwin-aarch64": "my-cli-macos-arm64.tar.gz",
    "linux-x86_64": "my-cli-linux-amd64.tar.gz",
    "windows-x86_64": "my-cli-windows-amd64.zip",
  },
});
```

Instead of a map, `asset` also accepts a function that builds the filename per
target.

```ts
import { GithubProvider } from "@cliffy/upgrade/provider/github";

new GithubProvider({
  repository: "user/my-cli",
  asset: ({ os, arch, version }) => `my-cli-${version}-${os}-${arch}.tar.gz`,
});
```

Asset formats, custom extractors, the binary name, and the install location are
shared with the other binary providers. See
[binary upgrade](../binary_upgrade.md).

## Private repositories

A github token is resolved from the `token` option, a string or a function
returning one, and then from the `GITHUB_TOKEN` and `GH_TOKEN` environment
variables. The function form lets you plug in any scheme, such as an OIDC
exchange, `gh auth token`, or a credential manager.

```ts
import { GithubProvider } from "@cliffy/upgrade/provider/github";

new GithubProvider({
  repository: "user/my-cli",
  token: () => Deno.env.get("MY_CLI_TOKEN") ?? "",
});
```
