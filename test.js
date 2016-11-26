import assert from 'assert';
import CircuitBreaker from './cb';

describe('The Circuit Breaker Module', () => {
  describe('the api', () => {
    it('should accept a function', (done) => {

      let cb = new CircuitBreaker();
      cb.execute(() => {
        assert.ok(true, 'this got executed');
        done();
      });
    });
    it('should execute a function a default of 3 times', (done) => {

      let cb = new CircuitBreaker();
      let executeCount = 0;
      cb.execute((finalError) => {
        executeCount++;
        if (executeCount === 3) {
          assert.ok(finalError !== null, 'this got executed');
          done();
        } else if (executeCount > 3) {
          assert.fail(executeCount, 3);
        }
        else {
          throw new Error("This is an error");
        }

      });
    });
    it('should allow the times to execute to be configured', (done) => {
      let cb = new CircuitBreaker({times: 6});
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
      let cb = new CircuitBreaker({times: 6, delay: 10});
      let executeCount = 0;
      let start = Date.now();
      cb.execute((finalError) => {
        executeCount++;
        if (executeCount === 6) {
          let end = Date.now();
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
      let cb = new CircuitBreaker({ delay: 100, backoff:true, times: 4});
      let executeCount = 0;
      let start = Date.now();
      cb.execute((finalError) => {
        executeCount++;
        if (executeCount === 4) {
          let end = Date.now();
          assert.ok(finalError !== null, 'this got executed');
          console.log(end - start);
          assert.ok(start < end && (start + 320 > end && start + 250 < end ) , 'Should be long enough, but not to long');
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
