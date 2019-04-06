# Back-Off

## Circuit Breaker design pattern for JavaScript

[![Build Status](https://travis-ci.org/Kevnz/back-off.svg?branch=master)](https://travis-ci.org/Kevnz/back-off)

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
