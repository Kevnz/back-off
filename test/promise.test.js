import CircuitBreaker from '../index';

describe('The Circuit Breaker Module As Promised', () => {
  describe('the api', () => {
    it('should accept a function and return a promise on completion', (done) => {

      const cb = new CircuitBreaker();
      cb.executeAsPromise(() => {
        expect(true).toBe(true);
      })
      .then(()=> {
        expect(true).toBe(true);
        done();
      });
    });
    it('should accept a function and return a promise on completion when `executeAsync` is called', (done) => {
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          expect(true).toBe(true);
          setTimeout(resolve, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then(()=> {
        expect(true).toBe(true);
        done();
      });
    });

    it('should accept a function and return a promise on completion when `executeAsync` is called with a promise', (done) => {
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          expect(true).toBe(true);
          setTimeout(resolve, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then((result)=> {
        expect(true).toBe(true);
        done();
      });
    });

    it('should accept a function and return a result from the promise on completion when `executeAsync` is called with a promise', (done) => {
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          expect(true).toBe(true);
          setTimeout(()=> {
            return resolve(42);
          }, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then((result)=> {
        expect(result).toBe(42);
        done();
      });
    });
    it('should execute promise again when first result fails', (done) => {
      let count = 0;
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          expect(true).toBe(true);
          if (count === 0) {
            count++;
            return reject();
          }
          expect(count > 0).toBe(true);
          return setTimeout(resolve, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then((result)=> {
        expect(true).toBe(true);
        done();
      });
    });
    it('should execute a function a default of 3 times', (done) => {
      const cb = new CircuitBreaker();
      let executeCount = 0;
      cb.executeAsPromise((finalError) => {
        executeCount++;
        if (executeCount === 3) {
          expect(finalError).not.toBe(null);
        } else if (executeCount > 3) {

          expect(true).toBe(false);
        }
        else {
          throw new Error("This is an error");
        }
      })
      .then(()=> {
        expect(true).toBe(true);
        done();
      });
    });
    it('should when all attemps fail enter the catch block', (done) => {
      const cb = new CircuitBreaker();
      cb.executeAsync((finalError) => {
        throw new Error("This is an error");
      })
      .catch(()=> {
        expect(true).toBe(true);

        done();
      });
    });
    it('should allow the times to execute to be configured', (done) => {
      const cb = new CircuitBreaker({times: 6});
      let executeCount = 0;
      cb.executeAsPromise((finalError) => {
        executeCount++;
        if (executeCount === 6) {
          expect(finalError).not.toBe(null);
        } else if (executeCount > 6) {
          expect(true).toBe(false);
        }
        else {

          throw new Error("This is an error");
        }

      })
      .then(()=> {
        expect(true).toBe(true);
        done();
      });

    });
    it('should be delayed between executions', (done) => {
      const cb = new CircuitBreaker({times: 6, delay: 10});
      let executeCount = 0;
      const start = Date.now();
      cb.executeAsPromise((finalError) => {
        executeCount++;
        if (executeCount === 6) {
          const end = Date.now();
          expect(finalError).not.toBe(null);
          expect(start + 50 < end && start + 70 > end).toBe(true);
        } else if (executeCount > 6) {
          expect(true).toBe(false);
        }
        else {
          throw new Error("This is an error");
        }

      })
      .then(()=> {
        expect(true).toBe(true);
        done();
      });
    });
    it('should have the delay between execution double when passed a backoff property', (done) => {
      const cb = new CircuitBreaker({ delay: 105, backoff: true, times: 4});
      let executeCount = 0;
      const start = Date.now();
      cb.executeAsPromise((finalError) => {
        executeCount++;
        if (executeCount === 4) {
          const end = Date.now();
          expect(finalError).not.toBe(null);
          const totaldiff = end - start;
          expect(start < end && totaldiff > 300 && totaldiff < 400).toBe(true);
        } else if (executeCount > 4) {
          expect(true).toBe(true);
        }
        else {
          throw new Error("This is an error");
        }

      })
      .then(()=> {

        expect(true).toBe(true);
        done();
      });
    });
  });

});
