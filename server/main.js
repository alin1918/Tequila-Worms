var http = require('http'), io = require('socket.io'),

server = http.createServer();

server.listen(8090);


require('./utils/reader');

require('./utils/writer');

require('./utils/worm');

require('./utils/table');

var messages = ["bites the dust", "killed himself", "fallowed bin laden", ",die die!", "didn't have 9 lives", " see you in hell", "jabber wobber", " has been undefined", "sleeps with the fish", " equals null"];

var timeout = 500;

var worms = {};

var clients = [];

var wormsNumber = 0;

var table1 = new table();

var vierme ;

var tableToSend = JSON.stringify({
    "action" : "map" ,
    "values" : table1.getSpace()
});



var socket = io.listen(server);

setInterval(function(){
    var positions = [];
    
    
    var wormsToKill = [];

    var tmpFields = [];
    tmpFields = worms;

    for(wormX in worms) {

        if(worms[wormX] == undefined) {
            continue;
        }

        worms[wormX].move();
        
        pieces = worms[wormX].getPieces();
        

        if(table1.checkLimit(pieces[0][0],pieces[0][1])){    

            wormsToKill.push(wormX);

        } else {
            wormY = {
                "id":worms[wormX].getId(),
                "pieces":pieces
            };
            positions.push(wormY);
        }

        for(tmpEach in tmpFields){
            if(tmpEach != wormX) {
                intersetWorms(tmpEach, wormX);
            }
        }
    /**
         *
         * check if worm head has hit a wall
         *
         */
    }

    for(var i = 0; i <  wormsToKill.length; i++){
        syncronizedAction('deleteWorm',wormsToKill[i]);
    }
    
    
    socket.broadcast(JSON.stringify({
        "action":"wormsChanges",
        "values":positions
    }));
    //,{"action":"bonus","values":[0,1]}]
    
}, timeout);

function intersetWorms(worm1,worm2){
    
    if(worms[worm1] == undefined || worms[worm2] == undefined) {
        return;
    }
    
    var sl1 =  worms[worm1].getPieces();
    var sl2 =  worms[worm2].getPieces();
   
    for(var i = 0; i < sl1.length; i++) {
        if(sl1[i][0] == sl2[0][0] &&  sl1[i][1] == sl2[0][1]){

            if(i == 0) {
                if(sl1.length == sl2.length){
                    deleteWorm(worm1);
                    deleteWorm(worm2);
                } else if(sl1.length < sl2.length) {
                    deleteWorm(worm1);
                    worms[worm2].addPieces(sl1.length);
                } else {
                    deleteWorm(worm2);
                    worms[worm1].addPieces(sl2.length);
                }
                return ;
            }

            if(worms[worm1] != undefined) {
                toAdd = worms[worm1].remove(i);
            }

            worms[worm2].addPieces(toAdd);

            if(worms[worm1] != undefined && worms[worm1].toSmall()){
                deleteWorm(worm1);
            }

        }
    }
}
/**
 *
 *
 */

function syncronizedAction(action, id)
{
    if(worms[id] == undefined){
        return ;
    }
    
    switch(action){
        case 'deleteWorm':
            deleteWorm(id);
            break;
        case 'moveWorm':
            moveWorm(id, arguments[2]);
            break;
        case 'nameWorm':
          
            worms[id].setName(arguments[2]);
            break;
        case 'getName':
            return worms[id].getName();
            break;
    }
}

function moveWorm(id,direction){
    worms[id].changeDestination(direction);
}


function deleteWorm(id){
    
    socket.broadcast(JSON.stringify([{
        "action":"deleteWorm",
        "values":id
    },{
        "action":"message",
        "values": syncronizedAction('getName',id) + '  ' + getRandKillMessage()
    },{
        "action" : "allWorms",
        "values" : getWormsCredentials()
    }]));
            
    delete worms[id];
//worms[id].reset();
}

function getRandKillMessage(){
    var i = Math.round(Math.random() * messages.length - 1 );

    return messages[i];
}
/**
 *
 * returns worm credentials
 */
function getWormsCredentials (){
    var retunedArray = [];
    for(wormX in worms){
        retunedArray.push({
            "id":worms[wormX].getId(),
            "color":worms[wormX].getColor(),
            "nume" : worms[wormX].getName()
        });

    }
    
    return retunedArray;
}

socket.on('connection', function(client){

    wormsNumber++;
    clients.push(client);

    client.wormId = wormsNumber;

    vierme = new worm(wormsNumber);

    worms[wormsNumber]= vierme;
    
    /**
     * sending welcome message
     */
    client.send(JSON.stringify({
        "action" : "yourID",
        "values" : wormsNumber
    }));
    /**
         *
         *
         */
    client.send(tableToSend);

    
    /**
     * 
     */
    
    //console.log(vierme.getPieces());
    client.on('message', function(message){
        var decoded = JSON.parse(message);
      
        switch(decoded.action) {
            case 'keypressed':
                //moveWorm(decoded.values.id, decoded.values.direction);
                syncronizedAction('moveWorm',decoded.values.id, decoded.values.direction);
                break;
            case 'name':
                syncronizedAction('nameWorm',decoded.id, decoded.nume);
                /**
                 * hack
                 */
                socket.broadcast(JSON.stringify({
                    "action" : "allWorms",
                    "values" : getWormsCredentials()
                }));
                break;
        }
    });

    client.on('disconnect', function(){
        syncronizedAction('deleteWorm',client.wormId);
    });
});
