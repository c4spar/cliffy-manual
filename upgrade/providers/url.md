# Url provider

The `UrlProvider` upgrades from an arbitrary url (a cdn, object storage, or a
custom host). It downloads a standalone binary with the `asset` option and
reinstalls a script with the `url` option. One of the two is required.

## Binary upgrades

Set `asset` to the download url, or to a function that builds it per build
target:

```ts
import { UrlProvider } from "@cliffy/upgrade/provider/url";

const provider = new UrlProvider({
  asset: ({ name, version, os, arch }) =>
    `https://cdn.example.com/${name}/${version}/${name}-${os}-${arch}.tar.gz`,
});
```

The asset filename decides how the download is unpacked. It defaults to the last
path segment of the url. When the url doesn't end in the filename, return an
`{ url, name }` object instead of a string:

```ts
import { UrlProvider } from "@cliffy/upgrade/provider/url";

new UrlProvider({
  asset: ({ version, os, arch }) => ({
    url: `https://cdn.example.com/download?v=${version}&target=${os}-${arch}`,
    name: `my-cli-${os}-${arch}.tar.gz`,
  }),
});
```

For a private host, send auth headers with the `assetHeaders` option (a
`HeadersInit`, or a function of the build target returning one).

## Script upgrades

Set `url` to the exact script entrypoint, or to a function of the cli name and
the resolved version. Script upgrades are only supported on Deno, where the url
is installed with `deno install`:

```ts
import { UrlProvider } from "@cliffy/upgrade/provider/url";

new UrlProvider({
  url: ({ name, version }) =>
    `https://cdn.example.com/${name}/${version}/cli.ts`,
});
```

Because `url` already points at the exact entrypoint, the `main` option is not
supported by this provider.

## Listing versions

The provider has no registry to query, so the `latest` target can only be
resolved from the `versions` option (a `Versions` object, or a function
returning one):

```ts
import { UrlProvider } from "@cliffy/upgrade/provider/url";

new UrlProvider({
  asset: "https://cdn.example.com/my-cli/latest/my-cli.tar.gz",
  versions: async () => {
    const response = await fetch(
      "https://cdn.example.com/my-cli/versions.json",
    );
    return await response.json();
  },
});
```

Without it, an explicit version must be requested, the `--list-versions` option
is not registered, and the automatic version check is skipped.

A function resolver is only run by the automatic version check if it can run
without triggering a permission prompt. Add `hasRequiredPermissions` to report
that, otherwise the check is skipped:

```ts
import { UrlProvider } from "@cliffy/upgrade/provider/url";

new UrlProvider({
  asset: "https://cdn.example.com/my-cli/latest/my-cli.tar.gz",
  versions: () =>
    fetch("https://cdn.example.com/my-cli/versions.json")
      .then((response) => response.json()),
  hasRequiredPermissions: async () =>
    (await Deno.permissions.query({ name: "net", host: "cdn.example.com" }))
      .state === "granted",
});
```

## Homepage

The `homepage` option sets the url shown in the upgrade success message.

Asset formats, custom extractors, the binary name, and the install location are
shared with the other binary providers. See
[binary upgrade](../binary_upgrade.md).
