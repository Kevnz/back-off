
export default class CircuitBreaker {
  constructor (props) {
    Object.assign(this, {
      times: 3,
      delay: 0,
      backoff: false,
      promised:false,
      callback: null
    }, props);
    this.timesToTry = this.times;
    this.timesRemaining = this.times;
  }
  tryCall (methodToTry, resolve, reject) {
    this.timesRemaining--;

    if (this.timesRemaining < 0 ) {
      if (reject) {
        reject();
      } else if (this.callback) {
        this.callback(new Error('All Attempts Failed'));
      }
    }
    if (this.timesRemaining < -1 ) {
      throw new Error(`Negative ${this.timesRemaining} Times Remaining`);
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
        let delay = this.backoff ? this.delay * (this.timesToTry - this.timesRemaining) : this.delay;
        return setTimeout(() => {
          return this.tryCall(methodToTry, resolve, reject);
        }, this.delay);
      } else {
        return this.tryCall(methodToTry, resolve, reject);
      }
    }
  }
  execute (attempt, callback) {
    this.callback = callback;
    this.tryCall(attempt);
  }
  executeAsPromise(attempt) {
    this.promised = true;
    return new Promise((resolve, reject) => {
      this.tryCall(attempt, resolve, reject);
    })

  }
}
