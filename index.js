var assert = require('assert')
var debug = require('debug')('throttle')

module.exports = function throttle (func, wait) {
  assert(typeof wait === 'number', 'expected "wait"')

  var queue = []
  var last = 0
  var timeout
  return function () {
    var now = Date.now()
    var delay = wait - (now - last)
    if (timeout) {
      debug('queueing')
      queue.push([this, arguments])
      return
    }

    if (delay < 0) {
      debug('running')
      last = now
      return func.apply(this, arguments)
    }

    queue.push([this, arguments])
    timeoutUnqueue(delay)
  }

  function timeoutUnqueue (millis) {
    if (timeout) return

    if (!queue.length) throw Error('empty queue')

    debug('waiting ' + millis + 'ms')
    timeout = setTimeout(function () {
      timeout = null
      last = Date.now()
      debug('running throttled')
      var ctxAndArgs = queue.shift()
      func.apply(ctxAndArgs[0], ctxAndArgs[1])

      if (queue.length) timeoutUnqueue(wait)
    }, millis)
  }
}
