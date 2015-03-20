
export default class CircuitBreaker {
	constructor(props) {
        super(props);
    }
    tryCall(callback, timesRemaining) {
    	if(timesRemaining === 0) {
    		callback({status:'Failed'});
    		return;
    	} 

    	try {
    		callback();
    	} catch (e) {
    		timesRemaining--;
    		this.tryCall(callback,timesRemaining)
    	}
    }
    execute(callback) {
		this.tryCall(callback, 2)
    }
}