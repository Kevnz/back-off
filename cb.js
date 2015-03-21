
export default class CircuitBreaker {
	constructor(props) {
        props = props || {};
        this.timesToTry = props.times || 3;
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
        console.log(this);
		this.tryCall(callback, this.timesToTry)
    }
}