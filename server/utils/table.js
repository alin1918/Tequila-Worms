table = function() {

    this.xSize = 56;
    
    this.ySize = 42;
    
    this.space = (function(x, y) {

        var returned = [];
        
        for(var j = 0; j < x; j++){
            var tmp = []
            
            for(var i = 0; i < y; i++) {

                 tmp[i] = 0;
        }
            returned[j] = tmp;
        }
        console.log();
        
        return returned;
    })(this.xSize, this.ySize);
    

    this.checkLimit  = function(x, y){

        if(x < 0 || y < 0 || x >= this.xSize  || y >= this.ySize ){
            return true;
        }
        return false;
    }
    
    this.getSpace = function (){
        return this.space;
    }
}