const Layer = require("./layer");
const LayerDefinition = require("./layer-definition");
const OutputNeuron = require("../neuron/output-neuron");

/**
 * Output layer class
 */
class OutputLayer extends Layer {

    constructor(amountOfNeurons,neuronType = OutputNeuron){
        super(amountOfNeurons,neuronType);
        this.error = 0;
        this.target = 0;
    }

    /**
     * Calculate the errors based on the to be value { target }
     * @param target
     */
    propagate(){
        this.calculateError();
        this.leftConnectionLayer.propagate();
    }

    /**
     * Calculates the total error for the layer
     * Sets the member error.
     * @returns {number}
     */
    calculateError(){
        let error = 0;
        for(let neuron of this.neurons){
            error+=neuron.calculateError();
        }
        return this.error = error;
    }

    /**
     * Set target value of output neuron
     * @param targets
     */
    setTargets(targets){
        for(let i = 0; i < targets.length; i++){
            //console.log(`setting target value ${targets[i]} for neuron ${i}`);
            this.neurons[i].target = targets[i];
        }
    }

    /**
     * As this is the last layer.
     * Feedforward generates the final outputs
     */
    feedForward(){
        for(let neuron of this.neurons){
            neuron.feedForward();
        }
        nnLogger.log("Outputlayer: done feeding");
    }

    /**
     * Returns layer type
     * @returns {number}
     */
    getType(){
        return LayerDefinition.OUTPUT;
    }
}
module.exports = OutputLayer;