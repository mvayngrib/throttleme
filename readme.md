# throttleme
[![NPM](https://nodei.co/npm/throttleme.png)](https://nodei.co/npm/throttleme/)

## Usage

```js
var throttle = require('throttleme')
var now = Date.now()

var fast = function (/* whatever args */) {
  console.log(Date.now() - now)
}

var slow = throttle(fast, 200)

// Note: you won't get exactly 0, 200, etc, because this module 
// uses setTimeout, which is inaccurate (and this module isn't that sophisticated)
// Expect something like ~20ms accuracy

slow() // -> 0
slow() // -> 200
slow() // -> 400
slow() // -> etc.
```
