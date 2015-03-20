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
	});

});