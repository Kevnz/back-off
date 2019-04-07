# Back-Off

[![npm version](https://badge.fury.io/js/back-off.svg)](https://badge.fury.io/js/back-off) ![Build Status](https://img.shields.io/circleci/project/github/Kevnz/back-off/master.svg) [![Coverage Status](https://coveralls.io/repos/github/Kevnz/back-off/badge.svg?branch=master)](https://coveralls.io/github/Kevnz/back-off?branch=master)

## Circuit Breaker design pattern for JavaScript

![circuit breaker](https://kevinisom.info/back-off/circuit-breaker.svg)

This module let's you use the [Circuit Breaker](https://www.martinfowler.com/bliki/CircuitBreaker.html) pattern and call a function multiple times. In addition you can specify a delay to be applied between attempts as well as extending the delay as attempts are made.

### Async/Await

```js
const BackOff = require('back-off');
const backoff = new BackOff({
    times: 5, //number of times method should be called
    delay: 50, //delay in milliseconds between calls
    backoff: true // if the delay should be doubled between execution attempts
});
try {
  const result = await backoff.executeAsync(asyncTask);
} catch (error) {
  //do something with the final error
}

```

### Promise

```js
const BackOff = require('back-off');
const backoff = new BackOff({
  times: 5, //number of times method should be called
  delay: 50, //delay in milliseconds between calls
  backoff: true // if the delay should be doubled between execution attempts
});

backoff.execute(() => {
  //do something here that may fail
})
.then(()=> {
  // do something else
})
.catch(() => {
  //attempts failed
});

```


The tests show the module in action.
