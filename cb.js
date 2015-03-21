
export default class CircuitBreaker {
	constructor (props) {
        props = props || {};
        this.timesToTry = props.times || 3;
        this.delay = props.delay || 0;
        super(props);
    }
    tryCall (callback, timesRemaining) {
    	if(timesRemaining === 0) {
    		callback({status:'Failed'});
    		return;
    	} 

    	try {
    		callback();
    	} catch (e) {
    		timesRemaining--;
    		if (this.delay > 0) {
                setTimeout(() => {
                    this.tryCall(callback,timesRemaining);
                }, this.delay);
            } else {
                this.tryCall(callback,timesRemaining);
            }

    	}
    }
    execute (callback) {
		this.tryCall(callback, this.timesToTry)
    }
}