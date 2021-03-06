/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/cognitive-complexity */

const { delay } = require('@kev_nz/async-tools')
const BackOff = require('../index')

describe('The Circuit Breaker Module', () => {
  describe('the api', () => {
    it('should accept a function and return a promise on completion', async () => {
      const breaker = new BackOff()
      const result = await breaker.execute(() => {
        return Promise.resolve('result from resolve')
      })
      expect(result).toBe('result from resolve')
    })
    it('should not execute if no times remain', async () => {
      const breaker = new BackOff({
        times: 0,
      })
      try {
        await breaker.execute(() => {})
        expect(true).toBe(false)
      } catch (error) {
        expect(error.message).toBe(`Negative -1 Times Remaining`)
      }
    })
    it('should accept a function and return a promise on completion when `execute` is called', async () => {
      const promisedFunc = async () => {
        await delay(20)
        return 'promised'
      }
      const breaker = new BackOff()
      const result = await breaker.execute(promisedFunc)
      expect(result).toBe('promised')
    })

    it('should accept a function and return a promise on completion when `execute` is called with a promise', async () => {
      const promisedFunc = async () => {
        expect(true).toBe(true)
        await delay(20)
        return true
      }
      const breaker = new BackOff()
      const result = await breaker.execute(promisedFunc)
      expect(result).toBe(true)
    })

    it('should accept a function and return a result from the promise on completion when `execute` is called with a promise', async () => {
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          expect(true).toBe(true)
          setTimeout(() => {
            return resolve(42)
          }, 20)
        })
      }
      const breaker = new BackOff()
      breaker.execute(promisedFunc).then(result => {
        expect(result).toBe(42)
      })
    })
    it('should execute promise again when first result fails', async () => {
      let count = 0
      const promisedFunc = async () => {
        return new Promise((resolve, reject) => {
          expect(true).toBe(true)
          if (count === 0) {
            count++
            // eslint-disable-next-line prefer-promise-reject-errors
            return reject()
          }
          expect(count > 0).toBe(true)
          return setTimeout(resolve, 20)
        })
      }
      const breaker = new BackOff()
      breaker.execute(promisedFunc).then(result => {
        expect(true).toBe(true)
      })
    })
    it('should execute a function a default of 3 times', async () => {
      const breaker = new BackOff()
      let executeCount = 0
      await breaker.execute(finalError => {
        executeCount++
        if (executeCount === 3) {
          expect(finalError).not.toBe(null)
        } else if (executeCount > 3) {
          expect(true).toBe(false)
        } else {
          throw new Error('This is an error')
        }
      })
      expect(true).toBe(true)
    })
    it('should when all attempts fail enter the catch block', async () => {
      const breaker = new BackOff()
      breaker
        .execute(finalError => {
          throw new Error('This is an error')
        })
        .catch(() => {
          expect(true).toBe(true)
        })
    })
    it('should allow the times to execute to be configured', () => {
      const breaker = new BackOff({ times: 6 })
      let executeCount = 0
      breaker
        .execute(finalError => {
          executeCount++
          if (executeCount === 6) {
            expect(finalError).not.toBe(null)
          } else if (executeCount > 6) {
            expect(true).toBe(false)
          } else {
            throw new Error('This is an error')
          }
        })
        .then(() => {
          expect(true).toBe(true)
        })
    })
    it('should be delayed between executions', async () => {
      const breaker = new BackOff({ times: 6, delay: 10 })
      let executeCount = 0
      const start = Date.now()
      await breaker.execute(finalError => {
        executeCount++
        if (executeCount === 6) {
          const end = Date.now()
          expect(finalError).not.toBe(null)
          expect(start + 50).toBeLessThanOrEqual(end)
          expect(start + 60).toBeGreaterThanOrEqual(end)
        } else if (executeCount > 6) {
          expect(true).toBe(false)
        } else {
          throw new Error('This is an error')
        }
      })
      expect(true).toBe(true)
    })
    it('should have the delay between execution double when passed a backoff property', () => {
      const breaker = new BackOff({ delay: 105, backoff: true, times: 4 })
      let executeCount = 0
      const start = Date.now()
      breaker
        .execute(finalError => {
          executeCount++
          if (executeCount === 4) {
            const end = Date.now()
            expect(finalError).not.toBe(null)
            const totaldiff = end - start
            expect(start < end && totaldiff > 300 && totaldiff < 400).toBe(true)
          } else if (executeCount > 4) {
            expect(true).toBe(true)
          } else {
            throw new Error('This is an error')
          }
        })
        .then(() => {
          expect(true).toBe(true)
        })
    })
  })
})
