module.exports = window.NeuroUtils = new class NeuroUtils {

    sigmoid(val){
       return 1/(1+Math.pow(Math.E,0-val));
    }

    random(){
        return this.getRandomInt(-0.5,0.5);
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    sigmoidDirivative(val){
        let sig = this.sigmoid(val);
        return sig*(1-sig);
    }

    squaredError(target,actual){
        return 1/2*Math.pow(target-actual,2);
    }

    squaredErrorDirivative(target,actual){
        return 2*(1/2*Math.pow(target-actual,2-1)) * -1;
    }

    collectiveError(errors) {
        let sum = errors.reduce((sum, i)=>{ return sum + i * i }, 0);
        return sum / errors.length;
    }

    transferDirivative(target,respected){
        return 1*target*Math.pow(respected,0);
    }
}();
