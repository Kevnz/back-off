import assert from 'assert';
describe('The Circuit Breaker Module', () => {
	describe('the api', () => {
		it('should accept a function', (done) => {

			var CircuitBreaker = require('./cb');
			var cb = new CircuitBreaker();
			cb.execute(() => {
				assert.ok(true, 'this got executed');	
				done();
			});
		});
		it('should execute a function a default of 3 times', (done) => {

			var CircuitBreaker = require('./cb');
			var cb = new CircuitBreaker();
			var executeCount = 0;
			cb.execute((finalError) => {
				executeCount++;
				if (executeCount === 3) {
					assert.ok(finalError !== null, 'this got executed');
					done();	
				} else if (executeCount > 3) {
					assert.fail(executeCount, 3);
				} 
				else {
					throw new Error("swallow this please");
				}
				
			});
		});
		it('should allow the times to execute to be configured', (done) => {
			var CircuitBreaker = require('./cb');
			var cb = new CircuitBreaker({times:6});
			var executeCount = 0;
			cb.execute((finalError) => {
				executeCount++;
				if (executeCount === 6) {
					assert.ok(finalError !== null, 'this got executed');
					done();	
				} else if (executeCount > 6) {
					assert.fail(executeCount, 6);
				} 
				else {
					throw new Error("swallow this please");
				}
				
			});
			
		});
	});

});