let Neuron = require("./neuron");

/**
 *
 **/
class OutputNeuron extends Neuron{

    constructor(target = 0){
        super();
        this.target = target;
    }

    /**
     * Calculates error
     *
     * TODO
     *
     * diff: target-value
     * squared error: 0.5*Math.pow(this.target-this.value,2);
     * sigmoid-d: this.value*(1-this.value)*(this.target - this.value);
     *
     * https://en.wikipedia.org/wiki/Backpropagation
     * @returns {*}
     */
    calculateError(){ //TODO do we need square error?
        this.error = this.target-this.value;//plain error
        //this.error = NeuroUtils.squaredError(this.target,this.value);
        this.delta =  this.value * (1 - this.value) * this.error; // = delta/
        return this.error;
    }
}
module.exports = OutputNeuron;