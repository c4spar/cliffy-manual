# Gitlab provider

The `GitlabProvider` upgrades from a gitlab repository, set with the
`repository` option. For a script install it reinstalls the cli source from any
tag or branch. For a standalone executable it downloads a
[release asset](#binary-upgrades) instead.

```ts
import { GitlabProvider } from "@cliffy/upgrade/provider/gitlab";

const provider = new GitlabProvider({ repository: "group/my-cli" });
```

## Self-hosted instances

The `host` option points the provider at a self-hosted instance. It defaults to
`https://gitlab.com`.

```ts
import { GitlabProvider } from "@cliffy/upgrade/provider/gitlab";

new GitlabProvider({
  repository: "group/my-cli",
  host: "https://gitlab.example.com",
});
```

## Listing versions

The gitlab provider lists all tags and branches. Lists longer than `25` entries
are rendered as a table.

```console
$ COMMAND upgrade --registry gitlab --list-versions
Tags:

  v0.3.0   v0.2.0   v0.1.0
  v0.2.1 * v0.1.1

Branches:

  main (Protected)
  feat/binary-upgrade
```

Disable branch listing with the `branches` option.

```ts
import { GitlabProvider } from "@cliffy/upgrade/provider/gitlab";

new GitlabProvider({ repository: "group/my-cli", branches: false });
```

## Binary upgrades

To upgrade a standalone executable, map each `os-arch` target to the name of a
release asset link with the `asset` option. The `os` and `arch` keys use the
Deno naming convention (`darwin`/`linux`/`windows`, `x86_64`/`aarch64`) on every
runtime.

```ts
import { GitlabProvider } from "@cliffy/upgrade/provider/gitlab";

new GitlabProvider({
  repository: "group/my-cli",
  asset: {
    "darwin-x86_64": "my-cli-macos-amd64.tar.gz",
    "darwin-aarch64": "my-cli-macos-arm64.tar.gz",
    "linux-x86_64": "my-cli-linux-amd64.tar.gz",
    "windows-x86_64": "my-cli-windows-amd64.zip",
  },
});
```

Instead of a map, `asset` also accepts a function that builds the name per
target.

```ts
import { GitlabProvider } from "@cliffy/upgrade/provider/gitlab";

new GitlabProvider({
  repository: "group/my-cli",
  asset: ({ os, arch, version }) => `my-cli-${version}-${os}-${arch}.tar.gz`,
});
```

The name is matched against the release's asset links, so the release has to
link the file, not just have it attached to the tag.

Asset formats, custom extractors, the binary name, and the install location are
shared with the other binary providers. See
[binary upgrade](../binary_upgrade.md).

## Private repositories

A gitlab token is resolved from the `token` option, a string or a function
returning one, and then from the `GITLAB_TOKEN` environment variable. It is sent
as the `PRIVATE-TOKEN` header on api requests, and on the asset download when
the link points at the same host.

```ts
import { GitlabProvider } from "@cliffy/upgrade/provider/gitlab";

new GitlabProvider({
  repository: "group/my-cli",
  token: () => Deno.env.get("MY_CLI_TOKEN") ?? "",
});
```
