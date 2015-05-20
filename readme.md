# Back-Off
## Circuit breaker design pattern for JavaScript

This module let's you use the circuit breaker patter and call a function multiple times. 

```
import BackOff from 'back-off';
let backoff = new BackOff({ 
    times: 5, //number of times method should be called
    delay: 50, //delay in milliseconds between calls
    backoff: true // if the delay should be doubled between execution attempts
});

backoff.execute((finalFail) => {
   //do something here
});

```

The tests show the module in action.