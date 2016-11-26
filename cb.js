
export default class CircuitBreaker {
  constructor (props) {
    props = props || {};
    this.timesToTry = props.times || 3;
    this.delay = props.delay || 0;
    this.backoff = props.backoff || false;
    super(props);
  }
  tryCall (callback, timesRemaining) {
    timesRemaining--;
    if(timesRemaining === 0) {
      callback({status:'Failed'});
      return;
    }

    try {
      callback();
    } catch (e) {
      if (this.delay > 0) {
        console.log((this.timesToTry - timesRemaining));
        let delay = this.backoff ? this.delay * (this.timesToTry - timesRemaining) : this.delay;
        console.log('the delay ' + delay);
        setTimeout(() => {
          this.tryCall(callback,timesRemaining);
        }, this.delay);
      } else {
        this.tryCall(callback,timesRemaining);
      }

    }
  }
  execute (callback) {
    this.tryCall(callback, this.timesToTry);
  }
}
