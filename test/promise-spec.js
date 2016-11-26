import assert from 'assert';
import CircuitBreaker from '../cb';

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
      const cb = new CircuitBreaker({ delay: 100, backoff:true, times: 4});
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
