const Neuron = require("../neuron/neuron");
const LayerDefinition = require("./layer-definition");
const Connection = require("../neuron/connection");

/**
 * Base layer class
 */
class Layer {

    constructor(amountOfNeurons, neuronType = Neuron){
        this.neurons = [];
        this.rightConnectionLayer = null;
        this.leftConnectionLayer = null;
        for(let i = 0; i < amountOfNeurons; i++)
            this.neurons.push(new neuronType());
    }

    /**
     * Connects a rightside layer
     * @param layer
     * @param indexedWeights
     */
    connectTo(layer,indexedWeights = []){
        console.log(indexedWeights)
        this.rightConnectionLayer = layer;
        layer.leftConnectionLayer = this;
        for(let [neuronIndex,neuron] of this.neurons.entries()){
            for(let [nextNeuronIndex,nextLayerNeuron] of layer.neurons.entries()){
                if(indexedWeights.length > 1){ //TODO
                    console.log(`layer size = ${layer.neurons.length} and indexedWeights = ${indexedWeights.length}`);
                    console.log(neuronIndex,nextNeuronIndex);
                    console.log(indexedWeights[neuronIndex].connections[nextNeuronIndex]);
                    console.log(new Connection(indexedWeights[neuronIndex].connections[nextNeuronIndex].weight));
                }

                let connection = indexedWeights.length < 1 ? new Connection() : new Connection(indexedWeights[neuronIndex].connections[nextNeuronIndex].weight);
                neuron.addOutgoingConnection(connection);
                nextLayerNeuron.addIncomingConnection(connection);
            }
        }
    }

    /**
     * Feeds value forward
     */
    feedForward(){
        for(let neuron of this.neurons){
            neuron.feedForward();
        }
        this.rightConnectionLayer.feedForward();
    }

    /**
     * Propagates backwards trough the network
     */
    propagate(){
        for(let neuron of this.neurons){
            neuron.propagate(this);
        }
        if(this.leftConnectionLayer)
            this.leftConnectionLayer.propagate();
    }

    /**
     *
     * @param learnRate
     */
    update(learnRate){
        for(let neuron of this.neurons){
            neuron.update(learnRate);
        }
        if(this.rightConnectionLayer)
            this.rightConnectionLayer.update(learnRate);
    }

    /**
     * Returns layer type
     * @returns {number}
     */
    getType(){
        return LayerDefinition.HIDDEN;
    }
}
module.exports = Layer;