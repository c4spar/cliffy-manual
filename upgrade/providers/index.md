# Providers

A provider is a registry adapter that tells `upgrade()` (and the
[`UpgradeCommand`](../../command/built_in_commands.md#upgrade-command)) which
versions exist and where to download them. `upgrade()` takes a single provider.
The `UpgradeCommand` also accepts an array: the first one is the default, the
others are selectable with `--registry`.

## Available providers

| Provider                             | Source            | Script    | Binary |
| ------------------------------------ | ----------------- | --------- | ------ |
| [`JsrProvider`](./jsr.md)            | jsr package       | yes       | no     |
| [`NpmProvider`](./npm.md)            | npm package       | yes       | no     |
| [`DenoLandProvider`](./deno_land.md) | deno.land/x       | yes       | no     |
| [`NestLandProvider`](./nest_land.md) | nest.land         | yes       | no     |
| [`GithubProvider`](./github.md)      | github repository | yes       | yes    |
| [`GitlabProvider`](./gitlab.md)      | gitlab repository | yes       | yes    |
| [`UrlProvider`](./url.md)            | any url           | Deno only | yes    |

Providers group by where the cli is distributed:

- **Package registries**: [jsr](./jsr.md) and [npm](./npm.md).
- **CDNs**: [deno.land](./deno_land.md) and [nest.land](./nest_land.md).
- **Git repositories**: [github](./github.md) and [gitlab](./gitlab.md).
- **Custom url**: [url](./url.md).

The `GithubProvider`, `GitlabProvider` and `UrlProvider` can upgrade standalone
executables by downloading a release asset. The shared configuration for that is
described under [binary upgrade](../binary_upgrade.md).

## Package name

The package name defaults to the cli name for the [jsr](./jsr.md),
[npm](./npm.md), [deno.land](./deno_land.md) and [nest.land](./nest_land.md)
providers. Override it with the `name` option, or set the full `package` name on
the jsr and npm providers.

The [github](./github.md) and [gitlab](./gitlab.md) providers locate the source
with the `repository` option instead, and [url](./url.md) builds the url itself.
The cli name is still what the upgraded cli is installed as, and what the binary
inside a release archive is expected to be called. See
[binary upgrade](../binary_upgrade.md) to override the latter.

> [!NOTE]
> `@cliffy/command/upgrade` re-exports the jsr, npm, deno.land, nest.land and
> github providers, but those re-exports are deprecated and will be removed in
> 2.0. Import providers from `@cliffy/upgrade/provider/*` instead. The gitlab
> and url providers are only available there.
