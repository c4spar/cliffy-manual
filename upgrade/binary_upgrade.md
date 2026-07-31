# Binary upgrade

The [`GithubProvider`](./providers/github.md),
[`GitlabProvider`](./providers/gitlab.md) and
[`UrlProvider`](./providers/url.md) can replace a standalone executable in place
by downloading a release asset, instead of reinstalling from a registry. This
works for a cli compiled with `deno compile`, `bun build --compile`, or as a
Node single executable application.

Each provider resolves _which_ asset to download in its own way (github and
gitlab with the `asset` map, url with the download url). Everything after that
(detecting the mode, unpacking the asset, installing it) is shared and described
below.

## Standalone detection

The upgrade detects which mode to use from the runtime: a compiled standalone
executable has its binary swapped, while any other install is reinstalled from
the registry. Older runtimes can't report whether the process is standalone and
default to a script install, so pass `standalone: true` (to the `UpgradeCommand`
or to `upgrade()`) to force the binary path for a compiled cli.

## Asset formats

Raw binaries, `.gz`, and `.tar.gz`/`.tgz` archives are handled built-in. For
`.zip` or other formats, provide an `extract` function. Map a filename suffix to
its extractor, matched by longest suffix. Suffixes you don't list fall through
to the built-in handlers:

```ts
import { GithubProvider } from "@cliffy/upgrade/provider/github";

declare function unzip(bytes: Uint8Array, name: string): Uint8Array;

new GithubProvider({
  repository: "user/my-cli",
  asset: {
    "linux-x86_64": "my-cli-linux-amd64.tar.gz", // built-in
    "windows-x86_64": "my-cli-windows-amd64.zip", // custom extractor
  },
  extract: {
    ".zip": (bytes, asset) => unzip(bytes, asset.name),
  },
});
```

A single function overrides extraction for every asset, for when one extractor
handles all of your formats:

```ts
import { GithubProvider } from "@cliffy/upgrade/provider/github";

declare function unzip(bytes: Uint8Array, name: string): Uint8Array;

new GithubProvider({
  repository: "user/my-cli",
  asset: { "windows-x86_64": "my-cli-windows-amd64.zip" },
  extract: (bytes, asset) => unzip(bytes, asset.name),
});
```

The binary extracted from an archive defaults to the cli name (matching both
`name` and `name.exe` inside the archive). Override it with the `binaryName`
option, either a string or a function of the build target.

## Install location

By default the upgrade replaces the running executable in place (self-replace).
The provider's `location` option sets a different default, and a directory
installs the cli into it by its name (with an `.exe` suffix on Windows). The
resolved location follows this precedence:

1. the `UpgradeCommand`'s `-o` or `--output` flag,
2. its environment variable, enabled with the command's `outputEnv` option
   (`true` derives `OUTPUT`, a string sets the name, and `{ prefix: "MYCLI_" }`
   derives `MYCLI_OUTPUT`),
3. the provider's `location` option,
4. the running executable.

The new binary is written to a temporary file next to the target and swapped in
afterwards, so a failed download leaves the current install untouched. On
Windows the running executable is moved aside to `<name>.exe.old` first, and
restored if the swap fails.
