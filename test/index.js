var test = require('tape')
var throttle = require('../index')

test('limits rate', function (t) {
  var times = 5
  t.plan((times - 1) * 2)
  var now = 0
  var rate = 100
  var delta = 30

  function fast () {
    var newNow = Date.now()
    var timePassed = newNow - now
    if (now) {
      t.ok(timePassed >= rate, 'not too fast')
      t.ok(timePassed <= rate + delta, 'not too slow')
    }

    now = newNow
  }

  var slow = throttle(fast, rate)
  for (var i = 0; i < times; i++) {
    slow()
  }
})

test('doesn\'t throttle when not needed', function (t) {
  var times = 5
  t.plan(times)

  var rate = 100
  var delta = 20

  function fast () {
    return true // to distinguish from throttled
  }

  var slow = throttle(fast, rate)
  for (var i = 0; i < times; i++) {
    (function (millis) {
      setTimeout(function () {
        t.ok(slow())
      }, millis)
    })(i * (rate + delta))
  }
})

test('preserves order', function (t) {
  var times = 5
  var rate = 100
  var n = 0

  t.plan(times)

  function fast (i) {
    t.equal(i, n++)
  }

  var slow = throttle(fast, rate)
  for (var i = 0; i < times; i++) {
    slow(i)
  }
})
