import CircuitBreaker from '../index';

describe('The Circuit Breaker Module', () => {
  describe('the callback api', () => {
    it('should accept a function', (done) => {
      const cb = new CircuitBreaker();
      cb.execute(() => {
        expect(true).toBe(true);
        done();
      });
    });
    it('should accept a callback function', (done) => {
      const cb = new CircuitBreaker();
      cb.execute(() => {
        expect(true).toBe(true);
      }, (err) => {
        done();
      });
    });
    it('should execute a function a default of 3 times', (done) => {
      const cb = new CircuitBreaker();
      let executeCount = 0;
      cb.execute(() => {
        executeCount++;
        throw new Error("This is an error");
      }, (err) => {
        expect(err).not.toBe(null);
        expect(executeCount).toBeGreaterThanOrEqual(3)
        done();
      });
    });
    it('should allow the times to execute to be configured', (done) => {
      const cb = new CircuitBreaker({times: 6});
      let executeCount = 0;
      cb.execute(() => {
        executeCount++;
        throw new Error("This is an error");
      }, (finalError) => {
        executeCount++;
         if (executeCount === 7) {
          expect(finalError).not.toBe(null);
          done();
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

          expect(finalError).not.toBe(null);
          expect(start + 50 < end && start + 70 > end).toBe(true);
          done();
        } else if (executeCount > 6) {
          expect(executeCount > 6).toBe(false);

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
          expect(finalError).not.toBe(null);
          const totaldiff = end - start;

          expect(start < end && totaldiff > 300 && totaldiff < 400).toBe(true)
          done();
        } else if (executeCount > 4) {
          expect(true).toBe(false);
        }
        else {
          throw new Error("This is an error");
        }

      });
    });
  });

});
