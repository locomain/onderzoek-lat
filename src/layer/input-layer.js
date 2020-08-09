const Layer = require("./layer");
const LayerDefinition = require("./layer-definition");

/**
 * Input layer class
 */
class InputLayer extends Layer{

    /**
     * Sets the input neuron values
     * @param value
     */
    set(value){
        if(value.constructor !== Array){
            for(let i = 0; i < value.length;i++){
                this.neurons[i].setValue(value);
            }
            return;
        }
        if(value.length!=this.neurons.length){
            console.log(value.length);
            console.log(this.neurons.length);
            nnLogger.error("Input size must match amount of neurons in layer");
            return;
        }
        for(let i = 0; i < value.length;i++){
            this.neurons[i].setValue(value[i]);
        }
    }

    //TODO test | create input neuron class?
    /**
     * Input neurons dont need to transfer and activate
     */
    feedForward(){
        for(let neuron of this.neurons){
            for(let connection of neuron.outputConnections){
                connection.push(neuron.value);
            }
        }
        this.rightConnectionLayer.feedForward();
    }

    /**
     * Returns layer type
     * @returns {number}
     */
    getType(){
        return LayerDefinition.INPUT;
    }


    propagate(){
        nnLogger.log("InputLayer: propogation end is reached.");
        super.propagate();
    }
}
module.exports = InputLayer;