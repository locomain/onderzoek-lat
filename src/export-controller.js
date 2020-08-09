const Config = require("./config");
const LayerDefinition = require("./layer/layer-definition");

const Layer = require("./layer/layer");
const ConvolutionalLayer = require("./layer/convolutional-layer");
const InputLayer = require("./layer/input-layer");
const OutputLayer = require("./layer/output-layer");

const Neuron = require("./neuron/neuron");
const OutputNeuron = require("./neuron/output-neuron");
const Connection = require("./neuron/connection");

const Network = require("./network");


module.exports = class ExportController {

    /**
     *
     * @param json
     * @param fromObject
     * @param context
     * @returns {*}
     */
    static import(json, fromObject=false,context=null){
        if(!context)context = new Network();
        let importable = fromObject?json:JSON.parse(json);

        context.learnRate = importable.learnRate;
        context.label = importable.label;

        let disposableInputLayer = null;
        let disposableHiddenLayers = [];
        let disposableOutputLayer = null;

        for(const layer of importable.layers){
            switch(layer.type){
                case LayerDefinition.INPUT:{
                    disposableInputLayer = layer;
                    context.inputLayer = new InputLayer(layer.neurons.length);
                    break;
                }
                case LayerDefinition.HIDDEN: {
                    disposableHiddenLayers.push(layer);
                    context.hiddenLayers.push(new Layer(layer.neurons.length));
                    break;
                }
                case LayerDefinition.OUTPUT:{
                    disposableOutputLayer = layer;
                    context.outputLayer = new OutputLayer(new InputLayer(layer.neurons.length));
                    break;
                }
            }
        }

        //connect layers
        context.inputLayer.connectTo(context.hiddenLayers[0],disposableHiddenLayers[0].neurons);
        for(let i = 0; i < context.hiddenLayers.length;i++){
            let layer = context.hiddenLayers[i];
            if(i+1===context.hiddenLayers.length){
                layer.connectTo(context.outputLayer);
                break;
            }
            let nextLayer = context.hiddenLayers[i+1];
            layer.connectTo(nextLayer);
        }

        return context;
    }

    /**
     *
     * @param context
     * @param json
     * @returns {*}
     */
    static export(context,json = true){
        let exportable = {
            version:Config.VERSION,
            layers:[],
            learnRate:context.learnRate,
            label:context.label
        };
        for(const layer of context.getLayers()){
            let expoLayer = {
                neurons:[],
                type:layer.getType()
            };
            for(const neuron of layer.neurons){
                let expoNeuron = {
                    connections:[]
                };
                for(const connection of neuron.outputConnections){
                    expoNeuron.connections.push({
                        weight: connection.weight
                    });
                }
                expoLayer.neurons.push(expoNeuron);
            }
            exportable.layers.push(expoLayer);
        }
        return json?JSON.stringify(exportable):exportable;
    }
}