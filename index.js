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
      queue.push(func)
      return
    }

    if (delay < 0) {
      debug('running')
      last = now
      return func()
    }

    queue.push(func)
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
      queue.shift()() // run throttled function
      if (queue.length) timeoutUnqueue(wait)
    }, millis)
  }
}
