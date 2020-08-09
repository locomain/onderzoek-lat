/**
 * NNLogger
 *
 * Debug helper class
 */
module.exports = window.nnLogger = new class NNLogger{
    constructor(mode){
        this.debug = mode?mode:false;
    }
    log(msg){
        if(this.debug)console.log(msg);
    }
    error(msg){
        console.error(msg);
    }
}();