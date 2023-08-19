# Keycode

The `KeyCode` interface represents a parsed ansi sequence:

```json
{
  "name": "up",
  "sequence": "\x1b[A",
  "code": "[A",
  "ctrl": false,
  "meta": false,
  "shift": false
}
```

### Name

The `name` property defines the name of the key code. The type is
`string | undefined`.

### Char

The `char` property defines the pressed character of the key code. The type is
`string | undefined`.

### Sequence

The `sequence` property defines the ansi sequence of the key code. The type is
`string | undefined`.

### Code

The `code` property defines the ansi code of the key code. The type is
`string | undefined`.

### Ctrl

The `ctrl` property defines whether the ctrl key is pressed or not. The type is
`boolean | undefined`.

### Meta

The `meta` property defines whether the meta key is pressed or not. The type is
`boolean | undefined`.

### Shift

The `shift` property defines whether the shift key is pressed or not. The type
is `boolean | undefined`.
