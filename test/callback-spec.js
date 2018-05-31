import assert from 'assert';
import CircuitBreaker from '../cb';

describe('The Circuit Breaker Module', () => {
  describe('the callback api', () => {
    it('should accept a function', (done) => {
      const cb = new CircuitBreaker();
      cb.execute(() => {
        assert.ok(true, 'this got executed');
        done();
      });
    });
    it('should accept a callback function', (done) => {
      const cb = new CircuitBreaker();
      cb.execute(() => {
        assert.ok(true, 'this got executed');
      }, (err) => {
        done();
      });
    });
    it('should execute a function a default of 3 times', (done) => {
      const cb = new CircuitBreaker();
      var executeCount = 0;
      cb.execute(() => {
        executeCount++;
        throw new Error("This is an error");
      }, (err) => {
          assert.ok(err !== null, 'this got executed');
          assert.ok(executeCount === 3, 'this got executed 3 times');
          done();
      });
    });
    it('should allow the times to execute to be configured', (done) => {
      const cb = new CircuitBreaker({times: 6});
      let executeCount = 0;
      cb.execute((finalError) => {
        executeCount++;
        if (executeCount === 6) {
          assert.ok(finalError !== null, 'this got executed');
          done();
        } else if (executeCount > 6) {
          assert.fail(executeCount, 6);
        }
        else {
          throw new Error("This is an error");
        }
      });
    });
    it('should be delayed between executions', (done) => {
      const cb = new CircuitBreaker({times: 6, delay: 10});
      let executeCount = 0;
      const start = Date.now();
      cb.execute((finalError) => {
        executeCount++;
        if (executeCount === 6) {
          const end = Date.now();
          assert.ok(finalError !== null, 'this got executed');
          assert.ok(start + 50 < end && start + 70 > end, 'Should be long enough, but not to long');
          done();
        } else if (executeCount > 6) {
          assert.fail(executeCount, 6, "executed too many times");
        }
        else {
          throw new Error("This is an error");
        }

      });
    });
    it('should have the delay between execution double when passed a backoff property', (done) => {
      const cb = new CircuitBreaker({ delay: 105, backoff: true, times: 4});
      let executeCount = 0;
      const start = Date.now();
      cb.execute((finalError) => {
        executeCount++;
        if (executeCount === 4) {
          let end = Date.now();
          assert.ok(finalError !== null, 'this got executed');
          const totaldiff = end - start;
          assert.ok(start < end && totaldiff > 300 && totaldiff < 400 , 'Should be long enough, but not to long');
          done();
        } else if (executeCount > 4) {
          assert.fail(executeCount,finalError, "executed too many times");
        }
        else {
          throw new Error("This is an error");
        }

      });
    });
  });

});
