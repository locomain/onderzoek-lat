const Layer = require("./layer");
const LayerDefinition = require("./layer-definition");

class ConvolutionalLayer extends Layer {

    constructor(){
        super();
    }

    feedForward(){}

    propagate(){}

    /**
     * Returns layer type
     * @returns {number}
     */
    getType(){
        return LayerDefinition.CONVOLUTIONAL;
    }
}