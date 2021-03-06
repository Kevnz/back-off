const { delay } = require('@kev_nz/async-tools')
class BackOff {
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

  async attemptCall(methodToTry) {
    this.timesRemaining--

    if (this.timesRemaining < 0) {
      throw new Error(`Negative ${this.timesRemaining} Times Remaining`)
    }
    try {
      return await methodToTry()
    } catch (error) {
      this.attemptCleanup()
      if (this.timesRemaining === 0) {
        throw error
      }
      if (this.delay > 0) {
        const delayTime = this.backoff
          ? this.delay * (this.timesToTry - this.timesRemaining)
          : this.delay
        await delay(delayTime)
      }
      return this.attemptCall(methodToTry)
    }
  }

  async execute(attempt, cleanup = () => {}) {
    this.attemptCleanup = cleanup
    return this.attemptCall(attempt)
  }
}

module.exports = BackOff
