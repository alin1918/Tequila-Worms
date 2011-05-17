worm = function (id){
    this.x = 0;

    this.id = id;

    this.y = 0;

    this.name =  null;

    this.wormSpeed = 1;

    this.moving = [this.wormSpeed,0];

    this.hasBonus = 0;
   
    this.lengthSnake = 7;

    this.minimLength = 3;

    this.pieces  = [[1,1]];

    this.remainingBonus = 0;

    this.head = [1,1];

    this.waitingPieces = this.lengthSnake - this.pieces.length;

    this.inHold = 0;
    
    this.color = function(){
        color = Math.round(Math.random() * parseInt('ffffff', 16))
        .toString(16);
        return    color = '#' + color;
    }();
   
    this.move = function(){
        if(this.waitingPieces == 0) {
            this.pieces.pop();
        } else if(this.waitingPieces < 0){
            this.waitingPieces = 0;
        } else {
            this.waitingPieces--;
        }

        if(this.remainingBonus >0) {
            this.remainingBonus--;
        }

        this.pieces = [[this.head[0] = this.head[0] + this.moving[0], this.head[1] = this.head[1] + this.moving[1]] ].concat(this.pieces);
        
    }

    this.changeDestination = function(way){
      
        switch(way){
            case "up":
                this.moving = [0,-this.wormSpeed];
                break;
            case "down":
                this.moving = [0,this.wormSpeed];
                break;
            case "left":
                this.moving = [-this.wormSpeed,0];
                break;
            case "right":
            default:
                this.moving = [this.wormSpeed,0];
                break;

        }
    }
    this.getPieces = function (){
        return this.pieces;
    }
    /**
     * 
     */
    
    this.setWormSpeed = function (val){
        this.wormSpeed = val;
    }
    /**
     * 
     */
    this.getId = function () {
        return this.id;
    }
    this.getColor = function(){
        return this.color;
    }
    this.addPieces = function(elems){
        this.waitingPieces +=elems;

        return this;
    }
    this.reset = function (){

        this.moving = [1,0];

        this.lengthSnake = 5;

        this.minimLength = 3;

        this.pieces  = [[1,1]];

        this.head = [1,1];

        this.waitingPieces = this.lengthSnake - this.pieces.length;
    }

    this.remove = function (to){

        remained = this.pieces.length - to;
        
        this.pieces = this.pieces.slice(0,to);

        if(this.pieces.length < this.minimLength) {
            return this.pieces.length + remained;
        }
        return remained;
    }

    this.toSmall = function(){
        if(this.pieces.length < this.minimLength) {
            return true;
        }
        return false;
    }

    this.setName = function(name){
        this.name = name;
    }

    this.getName = function(){
        
        return this.name;
    }
    
    this.addBonus = function(lastTime) {
        this.hasBonus = 1;
        this.remainingBonus = lastTime;
    }
    
    this.getSpeed = function (){
        return this.wormSpeed;
    }
}