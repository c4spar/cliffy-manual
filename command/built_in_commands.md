# Built-in commands

Cliffy provides some predefined commands like `help`, `completions` and
`upgrade`. These commands are optional and must be registered manually if you
want to use them.

## Help command

The `HelpCommand` prints the auto generated help. It is mostly the same as the
`--help` option but it also accepts the name of a child command as optional
argument to show the help of the given sub-command.

To make the help command globally available for all child commands you can use
the `.global()` method on the help command.

```typescript
import { Command } from "@cliffy/command";
import { HelpCommand } from "@cliffy/command/help";

await new Command()
  .version("0.1.0")
  .description("Sample description ...")
  .env(
    "EXAMPLE_ENVIRONMENT_VARIABLE=<value:boolean>",
    "Environment variable description ...",
  )
  .command("help", new HelpCommand().global())
  .parse();
```

```console
$ deno run examples/command/help_option_and_command.ts help
$ deno run examples/command/help_option_and_command.ts help completions
$ deno run examples/command/help_option_and_command.ts completions help
```

## Completions command

The `CompletionsCommand` includes sub commands for all supported shell
environments. The sub commands generate the shell completions script and outputs
it to stdout. The completions command must be registered manually.

```ts
import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";

await new Command()
  .command("completions", new CompletionsCommand())
  .parse();
```

By calling `<command> completions <shell>`, the command will output the
completions script for the specified shell to stdout.

Each shell command provides also a `--name` option which allows you to override
the command name: `<command> completions <shell> --name <my-command>`

### Bash Completions

To add support for bash completions you can either register the
`CompletionsCommand` or directly the `BashCompletionsCommand`.

To enable bash completions add the following line to your `~/.bashrc`:

```shell
source <(COMMAND completions bash)
```

> [!NOTE]
> Replace `COMMAND` with the name of your cli.

### Fish Completions

To add support for fish completions you can either register the
`CompletionsCommand` or directly the `FishCompletionsCommand`.

To enable fish completions add the following line to your
`~/.config/fish/config.fish`:

```shell script
source (COMMAND completions fish | psub)
```

> [!NOTE]
> Replace `COMMAND` with the name of your cli.

### Zsh Completions

To add support for zsh completions you can either register the
`CompletionsCommand` or directly the `ZshCompletionsCommand`.

To enable zsh completions add the following line to your `~/.zshrc`:

```shell script
source <(COMMAND completions zsh)
```

or run following command to use **zsh fpath** completions:

```shell script
COMMAND completions zsh > /path/to/zsh/site-functions/_COMMAND
```

> [!NOTE]
> Replace `COMMAND` with the name of your cli.

## Upgrade command

The `UpgradeCommand` can be used to upgrade your cli to a given or latest
version. If the `UpgradeCommand` is registered, a hint is shown in the help and
the long version output if a new version is available.

```shell
COMMAND upgrade --version 1.0.2
```

```typescript
import { Command } from "@cliffy/command";
import { UpgradeCommand } from "@cliffy/command/upgrade";
import { DenoLandProvider } from "@cliffy/upgrade/provider/deno-land";

new Command()
  .command(
    "upgrade",
    new UpgradeCommand({
      main: "cliffy.ts",
      args: ["--allow-net"],
      provider: new DenoLandProvider(),
    }),
  );
```

With the `provider` option you specify which registries are supported. This
option is required.

The `main` option is the entry file of your cli, appended to the registry url.
On Deno the cli is reinstalled under the name of your main command.

> ❗️ The name cannot have spaces! If you use spaces, you (or your users!) will
> get an error when upgrading.

If your cli needs some permissions, you can specify the permissions with the
`args` option which are passed to the runtime's install command. Use the
`runtime` option to pass different `args` or a different `main` per runtime.

> - Deno installs with `--name`, `--global` and `--force`.
> - Node and bun install with `--global` and `--force`.
> - The install command is silenced (`--quiet` on Deno, `--silent` on node and
>   bun) unless the upgrade is run with `-v` or `--verbose`.

### Selecting a registry

The `provider` option is required and takes one provider or an array of them.
Cliffy ships providers for [jsr](https://jsr.io), [npm](https://www.npmjs.com/),
[deno.land](https://deno.land/x), [nest.land](https://nest.land),
[github](https://github.com), [gitlab](https://gitlab.com), and any
[url](../upgrade/providers/url.md). Their options are documented in
[providers](../upgrade/providers/index.md).

With multiple providers, users select one with the `--registry` option (hidden
when only one is registered). Without it, the first registered provider is used.
For a standalone executable, the first provider that supports binary upgrades is
used instead.

```shell
COMMAND upgrade --registry github --version main
```

The package name defaults to the command name for the jsr, npm, deno.land and
nest.land providers. Override it with the `name` option. The github and gitlab
providers use the `repository` option instead, and the url provider builds the
url itself.

### List available versions

The `-l` or `--list-versions` option lists the available versions. The current
version is highlighted and prefixed with a `*`. The option is only registered if
at least one of the providers can list versions.

```console
$ COMMAND upgrade -l
* v0.2.2
  v0.2.1
  v0.2.0
  v0.1.0
```

What each registry lists (for example the github provider's tags and branches)
is covered under
[listing versions](../upgrade/providers/github.md#listing-versions).

### Binary upgrade

For a cli distributed as a standalone executable, the `GithubProvider`,
`GitlabProvider` and `UrlProvider` can replace the running binary in place
instead of reinstalling from a registry. Configure the provider with the `asset`
option, force the binary path with `standalone: true` when it can't be
auto-detected, and let users pick an install path with the `-o` or `--output`
flag (or an env var via the `outputEnv` option). The `--output` flag is only
registered if at least one of the providers supports binary upgrades. See
[binary upgrade](../upgrade/binary_upgrade.md) for the full configuration.

> [!NOTE]
> The `UpgradeCommand` wraps the parser-agnostic
> [`@cliffy/upgrade`](../upgrade/index.md) package. To add an upgrade command to
> a cli built with `@cliffy/flags` or another parser, use that package directly.
