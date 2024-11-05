# Built-in commands

Cliffy provides some predefined commands like `help`, `completions` and
`upgrade`. These commands are optional and must be registered manually if you
want to use them.

## Help command

The `HelpCommand` prints the auto generated help. It is mostly the same as the
`--help` option but it also accepts the name of an child command as optional
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
  .parse(Deno.args);
```

```console
$ deno run examples/command/help_option_and_command.ts help
$ deno run examples/command/help_option_and_command.ts help completions
$ deno run examples/command/help_option_and_command.ts completions help
```

## Completions command

The `CompetionsCommand` includes sub commands for all supported shell
environments. The sub commands generates the shell completions script and
outputs it to stdout. The completions command must be registered manually.

```ts
import { Command } from "@cliffy/command";
import { CompletionsCommand } from "@cliffy/command/completions";

await new Command()
  .command("completions", new CompletionsCommand())
  .parse(Deno.args);
```

By calling `<command> completions <shell>`, the command will output the
completions script fo the specified shell to stdout.

Each shell command provides also a `--name` option which allows you to override
the command name: `<command> completions <shell> --name <my-command>`

### Bash Completions

To add support for bash completions you can either register the
`CompetionsCommand` or directly the `BashCompetionsCommand`.

To enable bash completions add the following line to your `~/.bashrc`:

```shell
source <(COMMAND completions bash)
```

> ❗ Replace `COMMAND` with the name of your cli.

### Fish Completions

To add support for fish completions you can either register the
`CompetionsCommand` or directly the `FishCompetionsCommand`.

To enable fish completions add the following line to your
`~/.config/fish/config.fish`:

```shell script
source (COMMAND completions fish | psub)
```

> ❗ Replace `COMMAND` with the name of your cli.

### Zsh Completions

To add support for zsh completions you can either register the
`CompetionsCommand` or directly the `ZshCompetionsCommand`.

To enable zsh completions add the following line to your `~/.zshrc`:

```shell script
source <(COMMAND completions zsh)
```

> ❗ Replace `COMMAND` with the name of your cli.

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
import { DenoLandProvider } from "@cliffy/command/upgrade/provider/deno-land";

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

The `main` option is the entry file of your cli. With the `name` option you can
optional define the name of your cli which defaults to the name of your main
file (`[name].ts`).

If your cli needs some permissions you can specify the permissions with the
`args` option which are passed to `deno install`.

> - When `args` is defined, `--force` and `--name` is set by default.
> - When `args` is not defined, `--force`, `--name`, `--quiet` and `--no-check`
>
>> is set by default.

### Providers

There are three built-in providers: `deno.land`, `nest.land` and `github`. If
multiple providers are registered, you can specify the registry that should be
used with the `--registry` option. The github provider can also be used to
`upgrade` to any git branch.

```shell
COMMAND upgrade --registry github --version main
```

The `--registry` option is hidden if only one provider is registered. If the
`upgrade` command is called without the `--registry` option, the default
registry is used. The default registry is the first registered provider.

The `GithubProvider` requires the `repository` name as option. The
`DenoLandProvider` and `NestLandProvider` does not require any options but you
can optionally pass the registry module name to the provider which defaults to
the command name.

```typescript
import { Command } from "@cliffy/command";
import { UpgradeCommand } from "@cliffy/command/upgrade";
import { DenoLandProvider } from "@cliffy/command/upgrade/provider/deno-land";
import { GithubProvider } from "@cliffy/command/upgrade/provider/github";
import { NestLandProvider } from "@cliffy/command/upgrade/provider/nest-land";

new Command()
  .command(
    "upgrade",
    new UpgradeCommand({
      provider: [
        new DenoLandProvider({ name: "cliffy" }),
        new NestLandProvider({ name: "cliffy" }),
        new GithubProvider({ repository: "c4spar/deno-cliffy" }),
      ],
    }),
  );
```

### List available versions

The upgrade command can be also used, to list all available versions with the
`-l` or `--list-versions` option. The current installed version is highlighted
and prefixed with a `*`.

```console
$ COMMAND upgrade -l
* v0.2.2
  v0.2.1
  v0.2.0
  v0.1.0
```

The github registry shows all available tags and branches. Branches can be
disabled with the `branches` option `GithubProvider({ branches: false })`. If
the versions list is larger than `25`, the versions are displayed as table.

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
