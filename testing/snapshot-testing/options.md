# Options

## Name

The name of the test.

## meta

The `meta` option is required and needs to be set to `import.meta`. This is
required for executing the snapshot tests.

## fn

Test function that executes your test code. A snapshot is taken of the `stdout`
and `stderr` outputs of this function and stored in the snapshot file.

## steps

With the `steps` option you can add multiple steps to the test function. The
`snapshotTest` method then calls the test function once for each step within a
separate test step by calling `t.step()` from the test context. Each step can
have separate options for `stdin` and `args`. (see
[Test steps](./index.md#test-steps))

## denoArgs

Arguments passed to the `deno test` command when executing the snapshot tests.
`--allow-env=ASSERT_SNAPSHOT_CALL` is passed by default.

## dir

Snapshot output directory. Snapshot files will be written to this directory.
This can be relative to the test directory or an absolute path.

If both `dir` and `path` are specified, the `dir` option will be ignored and the
`path` option will be handled as normal.

## path

Snapshot output path. The snapshot will be written to this file. This can be a
path relative to the test directory or an absolute path.

If both `dir` and `path` are specified, the `dir` option will be ignored and the
`path` option will be handled as normal.

## osSuffix

Operating system snapshot suffix. This is useful when your test produces
different output on different operating systems. `osSuffix` is an array of
`typeof Deno.build.os`.

## colors

Enable/disable colors. Default is `true`.

## timeout

Timeout in milliseconds to wait until the input stream data is buffered before
writing the next data to the stream. This ensures that each user input is
rendered as separate line in the snapshot file. If your test gets flaky, try to
increase the timeout. The default timeout is `600`.

## ignore

If truthy the current test step will be ignored.

It is a quick way to skip over a step, but also can be used for conditional
logic, like determining if an environment feature is present.

## only

If at least one test has `only` set to `true`, only run tests that have `only`
set to `true` and fail the test suite. only?: boolean;
