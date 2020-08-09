const Layer = require("./layer/layer");
const InputLayer = require("./layer/input-layer");
const OutputLayer = require("./layer/output-layer");
const Neuron =  require("./neuron/neuron");
const OutputNeuron = require("./neuron/output-neuron");
const Connection = require("./neuron/connection");
const ExportController = require("./export-controller");


/**
 * Main NeuralNetwork class
 *
 */
class Network {

    constructor(){
        this.label = "";
        this.inputLayer = null;
        this.hiddenLayers = [];
        this.outputLayer = null;
        this.learnRate = 0.3;
    }

    /**
     * Adds a Input layer to the network
     *
     * @param amountOfNeurons
     * @returns {Network}
     */
    addInputLayer(amountOfNeurons){
        this.inputLayer = new InputLayer(amountOfNeurons);
        return this;
    }

    /**
     * Adds a Hidden layer to the network
     *
     * @param amountOfNeurons
     * @returns {Network}
     */
    addHiddenLayer(amountOfNeurons){
        this.hiddenLayers.push(new Layer(amountOfNeurons));
        return this;
    }

    /**
     * Adds Hidden layers to the network
     *
     * @param arrayOfLayerDescriptors
     * @returns {Network}
     */
    addHiddenLayers(arrayOfLayerDescriptors){
        for(let layerDescription of arrayOfLayerDescriptors){
            this.addHiddenLayer(layerDescription);
        }
        return this;
    }

    /**
     * Adds a Output layer to the network
     *
     * @param neuronData
     * @returns {Network}
     */
    addOutputLayer(amountOfNeurons){
        this.outputLayer = new OutputLayer(amountOfNeurons,OutputNeuron); //TODO merge loops
        return this;
    }

    /**
     * Enables logging
     *
     * @param val
     * @returns {Network}
     */
    debug(val){
        nnLogger.debug = val;
        return this;
    }

    /**
     * Sets the learning rate of the network
     *
     * @param rate
     * @returns {Network}
     */
    setLearnRate(rate){
        this.learnRate = rate;
        return this;
    }

    /**
     * Constructs a ideal amount of layers based on https://stats.stackexchange.com/a/136542
     *
     * @returns {number}
     **/
    estimateIdealLayers(data,scale = 2){
        let ns = data.length;
        let no = data.length;
        let ni = this.inputLayer.neurons.length;
        return Math.ceil(ns/(scale*(ni+no)));
    }

    /**
     * Constructs a ideal neuron count based on https://stats.stackexchange.com/a/136542
     *
     * @returns {number}
     **/
    estimateIdealNeurons(data){
        let ns = data.length;
        let no = data.length;
        let ni = this.inputLayer.neurons.length;
        return Math.ceil(ns*(ni+no));
    }

    /**
     * Constructs a ideal network based on https://stats.stackexchange.com/a/136542
     *
     * @returns {Network}
     **/
    constructIdealNetwork(data){
        if(this.outputLayer==null){
            this.addOutputLayer(data.map(d=>d.output));
        }
        if(this.hiddenLayers.length<1){
            let l = this.estimateIdealLayers(data);
            let n = this.estimateIdealNeurons(data);
            this.addHiddenLayers([l,n]);
        }
        this.build();
    }

    /**
     * Trains the network
     *
     * When received specifications network construction takes place.
     * For each data set the network will learn {iteration} times ->catastrophic forgetting
     * For each {iteration} lean a given set ->better memory
     *
     * @returns {Network}
     **/
    train(data,iterations,until){
        this.constructIdealNetwork(data);
        for(let i = 0; i <iterations; i++){
            let errors = [];
            data.forEach((set,setIndex)=>{
                this.outputLayer.setTargets(set.output);
                this.run(set.input,false); //run a forward propagation
                this.propagate(); //run a backpropagation and update values
                this.update();
                if(i%1000==0)console.log(`Network: error = ${this.outputLayer.error} on iteration ${i} for set ${setIndex}`);
                set.error = this.outputLayer.error;
                errors.push(set.error);
            });
            let trainingError = NeuroUtils.collectiveError(errors);
            if(i%1000==0)console.log(`\nNetwork: error = ${trainingError}\n\n`);
            if(trainingError<until)break;
        }
        console.warn("NETWORK: DONE TRAINING!");
        return data;
    }

    /**
     * Runs data trough the network
     *
     * @param data
     */
    run(data,output = true){
        if(this.hiddenLayers.length<1||this.outputLayer==null){
            return nnLogger.error("Please train your model or specify hidden layers");
        }
        nnLogger.log(`Network: start forward feed with data ${data}`);
        this.inputLayer.set(data);
        this.inputLayer.feedForward();
        if(output){
            return this.outputLayer.neurons.map(neuron=>neuron.value).sort((a,b)=>b - a);
        }
    }

    /**
     * Gets the layers in the network
     *
     * @returns {Array}
     */
    getLayers(){ //TODO cache
        let layers = [];
        layers.push(this.inputLayer);
        layers = layers.concat(this.hiddenLayers);
        layers.push(this.outputLayer);
        return layers;
    }

    //https://machinelearningmastery.com/implement-backpropagation-algorithm-scratch-python/
    //http://jsfiddle.net/Wkrgu/5/
    //
    //calculate gradients
    //update weights
    propagate(){ //TODO not working yet
        nnLogger.log("Network: starting propagation");
        this.outputLayer.propagate();
    }

    /**
     * Updates the connection weights
     */
    update(){
        nnLogger.log("Network: Starting update of weights");
        this.inputLayer.update(this.learnRate);
    }

    /**
     * Builds the network
     * @returns {Network}
     */
    build(){
        if(!this.inputLayer){
            nnLogger.error("Network: No input defined");
            return this;
        }
        if(this.hiddenLayers.length<1){
            nnLogger.log("Network: No predefined hidden layers");
            return this;
        }
        this.connectLayers();
        return this;
    }

    /**
     * Connects all layers
     * @returns {Network}
     */
    connectLayers(){
        this.inputLayer.connectTo(this.hiddenLayers[0]);
        for(let i = 0; i < this.hiddenLayers.length;i++){
            let layer = this.hiddenLayers[i];
            if(i+1===this.hiddenLayers.length){
                layer.connectTo(this.outputLayer);
                break;
            }
            let nextLayer = this.hiddenLayers[i+1];
            layer.connectTo(nextLayer);
        }
        return this;
    }

    /**
     * Sets a network label for export purpose`s
     * @param label
     * @returns {Network}
     */
    setLabel(label){
        this.label = label;
        return this;
    }

    /**
     * Exports the neural network
     *
     * @returns {string}
     */
    export(){
        return ExportController.export(this);
    }

    /**
     * Imports a network model
     *
     * @param json
     * @param fromObject
     */
    import(json, fromObject=false){
        return ExportController.import(json,fromObject,this);
    }
}
module.exports = Network;