"use strict"
exports.__esModule = true
exports.Mutex = exports.Semaphore = void 0
var tslib_1 = require("tslib")
var Semaphore = /** @class */ (function () {
  function Semaphore(count) {
    this.tasks = []
    this.count = count
  }
  Semaphore.prototype.sched = function () {
    if (this.count > 0 && this.tasks.length > 0) {
      this.count--
      var next = this.tasks.shift()
      if (next === undefined) {
        throw "Unexpected undefined value in tasks list"
      }
      next()
    }
  }
  Semaphore.prototype.acquire = function () {
    var _this = this
    return new Promise(function (res, _) {
      var task = function () {
        var released = false
        res(function () {
          if (!released) {
            released = true
            _this.count++
            _this.sched()
          }
        })
      }
      _this.tasks.push(task)
      if (process === null || process === void 0 ? void 0 : process.nextTick) {
        process.nextTick(_this.sched.bind(_this))
      } else {
        setImmediate(_this.sched.bind(_this))
      }
    })
  }
  Semaphore.prototype.use = function (f) {
    return this.acquire().then(function (release) {
      return f()
        .then(function (res) {
          release()
          return res
        })
        ["catch"](function (err) {
          release()
          throw err
        })
    })
  }
  return Semaphore
})()
exports.Semaphore = Semaphore
var Mutex = /** @class */ (function (_super) {
  tslib_1.__extends(Mutex, _super)
  function Mutex() {
    return _super.call(this, 1) || this
  }
  return Mutex
})(Semaphore)
exports.Mutex = Mutex
//# sourceMappingURL=await-semaphore.js.map
