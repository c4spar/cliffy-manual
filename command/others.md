# Others

## Did you mean

Cliffy has built-in _did-you-mean_ support to improve the user and developer
experience. For example, cliffy prints some suggestions, when the user executes
an invalid command, or the developer has a typo in the name of a type.

```console
$ deno run https://deno.land/x/cliffy/examples/command/demo.ts -g
error: Unknown option "-g". Did you mean option "-h"?
```
