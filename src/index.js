const { delay } = require('@kev_nz/async-tools')
class CircuitBreaker {
  constructor(props) {
    Object.assign(
      this,
      {
        times: 3,
        delay: 0,
        backoff: false,
        callback: null,
      },
      props
    )
    this.timesToTry = this.times
    this.timesRemaining = this.times
  }

  async tryPromise(methodToTry) {
    this.timesRemaining--

    if (this.timesRemaining < 0) {
      throw new Error(`Negative ${this.timesRemaining} Times Remaining`)
    }
    try {
      return await methodToTry()
    } catch (error) {
      if (this.timesRemaining === 0) {
        throw error
      }
      if (this.delay > 0) {
        let delayTime = this.backoff
          ? this.delay * (this.timesToTry - this.timesRemaining)
          : this.delay
        await delay(delayTime)
      }
      return this.tryPromise(methodToTry)
    }
  }
  async execute(attempt) {
    return this.tryPromise(attempt)
  }
}

module.exports = CircuitBreaker
