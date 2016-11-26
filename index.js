'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CircuitBreaker = function () {
  function CircuitBreaker(props) {
    _classCallCheck(this, CircuitBreaker);

    Object.assign(this, {
      times: 3,
      delay: 0,
      backoff: false,
      promised: false,
      callback: null
    }, props);
    this.timesToTry = this.times;
    this.timesRemaining = this.times;
  }

  _createClass(CircuitBreaker, [{
    key: 'tryCall',
    value: function tryCall(methodToTry, resolve, reject) {
      var _this = this;

      this.timesRemaining--;

      if (this.timesRemaining < 0) {
        if (reject) {
          reject();
        } else if (this.callback) {
          this.callback(new Error('All Attempts Failed'));
        }
      }
      if (this.timesRemaining < -1) {
        throw new Error('Negative ' + this.timesRemaining + ' Times Remaining');
      }
      try {
        methodToTry();
        if (resolve) {
          resolve();
        } else if (this.callback) {
          this.callback();
        }
      } catch (e) {
        if (this.delay > 0) {
          var delay = this.backoff ? this.delay * (this.timesToTry - this.timesRemaining) : this.delay;
          return setTimeout(function () {
            return _this.tryCall(methodToTry, resolve, reject);
          }, this.delay);
        } else {
          return this.tryCall(methodToTry, resolve, reject);
        }
      }
    }
  }, {
    key: 'execute',
    value: function execute(attempt, callback) {
      this.callback = callback;
      this.tryCall(attempt);
    }
  }, {
    key: 'executeAsPromise',
    value: function executeAsPromise(attempt) {
      var _this2 = this;

      this.promised = true;
      return new Promise(function (resolve, reject) {
        _this2.tryCall(attempt, resolve, reject);
      });
    }
  }]);

  return CircuitBreaker;
}();

exports.default = CircuitBreaker;
