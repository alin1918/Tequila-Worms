$(document).ready(function () {
    /*
    var MyWorm = {
        id: null,
        alive: 1, //0=dead,1=alive
        colour: null,
        setWormId: function(id) {
            this.wormId = id;
        },
        sendWormStatus: function(socket, data) { //use socket
            socket.send();
        },
        allWorms: null
    
    };
    */
   var socket;
    streamConnect = function () {
        
        if(socket) {
            try {
                socket.disconnect();
            } catch(e) {}
        }
        
        socket = new io.Socket('192.168.1.3',{
            'port':8090
        });
        socket.connect();

        socket.on('connect', function(){
            console.log('connected');
	    Game.addMessage('You have been connected to the server');
            //socket.send('hi!');
        
            Game.setSocket(socket);
        });
    
        var processRespons = function (response) {
            switch (response.action) {
                case 'yourID':
                    //MyWorm.setWormId(response.values);
                    Game.setId(response.values);
                    Game.sendName();
                    break;
                
                case 'allWorms':
                
                    Game.setWorms(response.values);
                    //            myData = JSON.parse(text, function (key, value) {
                    //                var type;
                    //                if (value && typeof value === 'object') {
                    //                    type = value.type;
                    //                    if (typeof type === 'string' && typeof window[type] === 'function') {
                    //                        return new (window[type])(value);
                    //                    }
                    //                }
                    //                return value;
                    //            });
                    //            MyWorm.allWorms = myData(response.values);
                    break;

                case 'map':
                    console.log('map data received');
                    Game.init(response.values);
                    break;

                case 'message':
                    console.log(response.values);
                    Game.addMessage(response.values);
                    break;

                case 'deleteWorm':
                    //                if(response.values === MyWorm.id) {
                    //                    MyWorm.alive = 0;
                    //                    alert('You\'re dead! Bye bye!');
                    //                }
                    Game.testDie(response.values);
                    break;
                
                case 'wormsChanges':
                    Game.step(response.values);
                    //console.log(response.values)
                    break;
                
                default:
                    break; 
            }
        }
    
        socket.on('message', function(data){
            var i;
            $("#box").html(data);
            var response = JSON.parse(data);
        
            if(response.constructor === Array) {
                for(i = 0; i < response.length; i++) {
                    processRespons(response[i]);
                }
            } else {
                processRespons(response);
            }
        
        
        });


        socket.on('disconnect', function(){
            console.log('disconected');
            Game.addMessage('You have been disconnected from the server');
        });
    
    
        $(function(){
            $("#send2").click(function(){
                socket.send($("#send").val());
            })
        })
    }
});
