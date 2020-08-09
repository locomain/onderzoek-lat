/**
 * Neuron
 *
 */
class Neuron{

    constructor(){
        this.bias = NeuroUtils.random();
        this.error = 0;
        this.delta = 0;
        this.value = 0;

        this.inputConnections = [];
        this.outputConnections = [];
    }

    /**
     * Sets a direct value to the neuron
     * @param value
     */
    setValue(value){
        nnLogger.log(`Neuron: setting value: ${value}`);
        this.value = value;
    }

    /**
     * Adds a outgoingConnection
     * @param connection
     */
    addOutgoingConnection(connection){
        this.outputConnections.push(connection);
    }

    /**
     * Adds a incoming connections
     * @param connection
     */
    addIncomingConnection(connection){
        this.inputConnections.push(connection);
    }

    /**
     *  Transfers all the inputs and activates the neuron.
     *  After that activation value gets pushed trough the connection
     */
    feedForward(){
        //this.clear();TODO
        this.transfer();
        this.activate();
        for(let connection of this.outputConnections){
            connection.push(this.value);
        }
    }

    clear(){
        //this.value = 0;//TODO
        //this.error = 0;//TODO
    }

    /**
     * Propagates
     *
     * TODO
     */
    propagate(layer){
        this.calculateError(layer);
    }

    /**
     *
     * @param learnRate
     */
    update(learnRate){
        for(let connection of this.inputConnections){
            connection.weight += this.delta * connection.value * learnRate;
        }
        this.bias+=learnRate*this.delta;
    }

    /**
     * Calculates the gradient/error
     * @param layer
     */
    calculateError(layer){
        let error = 0;
        for(let neuron of layer.rightConnectionLayer.neurons){ //previous error
            for(let connection of neuron.inputConnections){//input for right side layer
                for(let outputConnection of this.outputConnections){ //check if the connection is between both neurons
                    if(connection===outputConnection){
                        error+=connection.weight * neuron.delta;
                    }
                }
            }
        }
        this.error = error;
        this.delta = this.value * (1 - this.value) * this.error;
        nnLogger.log(`Neuron: Error = ${this.error}`);
    }

    /**
     * Sums al the input values * weights
     */
    transfer(){
        if(this.inputConnections.length<1)return;
        let sum = 0;
        for(let input of this.inputConnections){
            sum+=(input.value*input.weight);
        }
        sum += this.bias;
        this.value = sum;
    }

    /**
     * activates the neuron using a sigmoid
     */
    activate(){
        this.value = NeuroUtils.sigmoid(this.value);
    }

}
module.exports = Neuron;