"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var CircuitBreaker = (function () {
    function CircuitBreaker(props) {
        _classCallCheck(this, CircuitBreaker);

        props = props || {};
        this.timesToTry = props.times || 3;
        this.delay = props.delay || 0;
        _get(Object.getPrototypeOf(CircuitBreaker.prototype), "constructor", this).call(this, props);
    }

    _createClass(CircuitBreaker, {
        tryCall: {
            value: function tryCall(callback, timesRemaining) {
                var _this = this;

                console.log(this);
                if (timesRemaining === 0) {
                    callback({ status: "Failed" });
                    return;
                }

                try {
                    callback();
                } catch (e) {
                    timesRemaining--;
                    if (this.delay > 0) {
                        setTimeout(function () {
                            console.log("timeout thing");
                            _this.tryCall(callback, timesRemaining);
                        }, this.delay);
                    } else {
                        this.tryCall(callback, timesRemaining);
                    }
                }
            }
        },
        execute: {
            value: function execute(callback) {
                this.tryCall(callback, this.timesToTry);
            }
        }
    });

    return CircuitBreaker;
})();

module.exports = CircuitBreaker;
