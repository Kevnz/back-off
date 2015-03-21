"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var CircuitBreaker = (function () {
    function CircuitBreaker(props) {
        _classCallCheck(this, CircuitBreaker);

        _get(Object.getPrototypeOf(CircuitBreaker.prototype), "constructor", this).call(this, props);
    }

    _createClass(CircuitBreaker, {
        tryCall: {
            value: function tryCall(callback, timesRemaining) {
                if (timesRemaining === 0) {
                    callback({ status: "Failed" });
                    return;
                }

                try {
                    callback();
                } catch (e) {
                    timesRemaining--;
                    this.tryCall(callback, timesRemaining);
                }
            }
        },
        execute: {
            value: function execute(callback) {
                this.tryCall(callback, 2);
            }
        }
    });

    return CircuitBreaker;
})();

module.exports = CircuitBreaker;
