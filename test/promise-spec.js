import CircuitBreaker from '../cb';
import assert from 'assert';

describe('The Circuit Breaker Module As Promised', () => {
  describe('the api', () => {
    it('should accept a function and return a promise on completion', (done) => {

      const cb = new CircuitBreaker();
      cb.executeAsPromise(() => {
        assert.ok(true, 'this got executed');
      })
      .then(()=> {
        assert.ok(true, 'then got executed');
        done();
      });
    });
    it('should accept a function and return a promise on completion when `executeAsync` is called', (done) => {
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          assert.ok(true, 'promise got executed');
          setTimeout(resolve, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then(()=> {
        assert.ok(true, 'then got executed');
        done();
      });
    });

    it('should accept a function and return a promise on completion when `executeAsync` is called with a promise', (done) => {
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          assert.ok(true, 'promise got executed');
          setTimeout(resolve, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then((result)=> {
        assert.ok(true, 'final then got executed');
        done();
      });
    });

    it('should accept a function and return a result from the promise on completion when `executeAsync` is called with a promise', (done) => {
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          assert.ok(true, 'promise got executed');
          setTimeout(()=> {
            return resolve(42);
          }, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then((result)=> {
        assert.ok(result === 42, 'final then got executed');
        done();
      });
    });
    it('should execute promise again when first result fails', (done) => {
      let count = 0;
      const promisedFunc = () => {
        return new Promise((resolve, reject) => {
          assert.ok(true, 'promise got executed');
          if (count === 0) {
            count++;
            return reject();
          }
          assert.ok(count > 0, 'promise got executed again');
          return setTimeout(resolve, 20);
        })
      }
      const cb = new CircuitBreaker();
      cb.executeAsync(promisedFunc)
      .then((result)=> {
        assert.ok(true, 'final then got executed');
        done();
      });
    });
    it('should execute a function a default of 3 times', (done) => {
      const cb = new CircuitBreaker();
      let executeCount = 0;
      cb.executeAsPromise((finalError) => {
        executeCount++;
        if (executeCount === 3) {
          assert.ok(finalError !== null, 'this got executed');
        } else if (executeCount > 3) {
          assert.fail(executeCount, 3);
        }
        else {
          throw new Error("This is an error");
        }
      })
      .then(()=> {
        assert.ok(true, 'then got executed');
        done();
      });
    });
    it('should when all attemps fail enter the catch block', (done) => {
      const cb = new CircuitBreaker();
      cb.executeAsync((finalError) => {
        throw new Error("This is an error");
      })
      .catch(()=> {
        assert.ok(true, 'catch got executed');
        done();
      });
    });
    it('should allow the times to execute to be configured', (done) => {
      const cb = new CircuitBreaker({times: 6});
      let executeCount = 0;
      cb.executeAsPromise((finalError) => {
        executeCount++;
        if (executeCount === 6) {
          assert.ok(finalError !== null, 'this got executed');
        } else if (executeCount > 6) {
          assert.fail(executeCount, 6);
        }
        else {

          throw new Error("This is an error");
        }

      })
      .then(()=> {
        assert.ok(true, 'then got executed');
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
          assert.ok(finalError !== null, 'this got executed');
          assert.ok(start + 50 < end && start + 70 > end, 'Should be long enough, but not to long');
        } else if (executeCount > 6) {
          assert.fail(executeCount, 6, "executed too many times");
        }
        else {
          throw new Error("This is an error");
        }

      })
      .then(()=> {
        assert.ok(true, 'then got executed');
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
          assert.ok(finalError !== null, 'this got executed');
          const totaldiff = end - start;
          assert.ok(start < end && totaldiff > 300 && totaldiff < 400 , 'Should be long enough, but not to long');
        } else if (executeCount > 4) {
          assert.fail(executeCount,finalError, "executed too many times");
        }
        else {
          throw new Error("This is an error");
        }

      })
      .then(()=> {
        assert.ok(true, 'then got executed');
        done();
      });
    });
  });

});
