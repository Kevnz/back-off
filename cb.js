
export default class CircuitBreaker {
	constructor(props) {
        super(props);
    }
    execute(callback) {
    	callback();
    }
}