/**
 * Connection
 *
 * Neuron connection pass trough
 */
class Connection {

    constructor(weight){
        this.value = 0;
        this.weight = weight?weight:NeuroUtils.random();
        nnLogger.log(`Connection: connection generated with weight ${this.weight}`);
    }

    /**
     * Pushes data to the connection
     * @param data
     */
    push(data){
        this.value = data;
    }
}
module.exports = Connection;