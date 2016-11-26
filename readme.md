# Back-Off
## Circuit breaker design pattern for JavaScript
[![Build Status](https://travis-ci.org/Kevnz/back-off.svg?branch=master)](https://travis-ci.org/Kevnz/back-off)

This module let's you use the circuit breaker pattern and call a function multiple times. In addition you can specify a delay to be applied between attempts as well as extending the delay as attempts are made.

### Promise
```
import BackOff from 'back-off';
const backoff = new BackOff({ 
    times: 5, //number of times method should be called
    delay: 50, //delay in milliseconds between calls
    backoff: true // if the delay should be doubled between execution attempts
});

backoff.executeAsPromise((finalFail) => {
  //do something here
})
.then(()=> {
  // do something else
})
.catch(() => {
  //attempts failed
});

```

### Callback
```
import BackOff from 'back-off';
const backoff = new BackOff({ 
    times: 5, //number of times method should be called
    delay: 50, //delay in milliseconds between calls
    backoff: true // if the delay should be doubled between execution attempts
});

backoff.execute(() => {
  //do something here
}, (err) => {
  //do something here.
  if(err) {
    it failed
  }
});
// or fire and forget
backoff.execute(() => {
  //do something here
});
```

The tests show the module in action.
