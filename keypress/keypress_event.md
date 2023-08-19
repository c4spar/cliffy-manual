# KeyPressEvent

The `KeyPressEvent` represents a keypress event and it inherits most properties
from the [`KeyCode`](../keycode/keycode.md) interface.

```json
{
  "name": "up",
  "sequence": "\x1b[A",
  "code": "[A",
  "ctrlKey": false,
  "metaKey": false,
  "shiftKey": false,
  "altKey": false
}
```

### key

The `key` property defines the name of the key code. The type is
`string | undefined`.

### char

The `char` property defines the pressed character of the key code. The type is
`string | undefined`.

### sequence

The `sequence` property defines the ansi sequence of the key code. The type is
`string | undefined`.

### code

The `code` property defines the ansi code of the key code. The type is
`string | undefined`.

### ctrlKey

The `ctrlKey` property defines whether the ctrl key is pressed or not. The type
is `boolean`.

### metaKey

The `metaKey` property defines whether the meta key is pressed or not. The type
is `boolean`.

### shiftKey

The `shiftKey` property defines whether the shift key is pressed or not. The
type is `boolean`.

### altKey

The `altKey` property defines whether the alt key is pressed or not. The type is
`boolean`.

### repeat

The `repeat` property indicates how many times the key was pressed repeatedly.
