var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
var app = express();
var fs = require('fs');



app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));



fs.readdirSync(__dirname+'/models').forEach(function(filename){
  require(__dirname+'/models/'+filename);
});

mongoose.connect('mongodb://127.0.0.1:27017/postmanDb');


var players = require('./models/players')

app.get('/players', function(req, res){
players.getall(function(err, players){
        res.send(players);
    });

});

var games = require('./models/games')
app.get('/get-games', function(req, res){
    mongoose.model('games').find(function(err, games){
        res.send(games);
    });
});


app.get('/', function(req, res){
    checkIfSocketExists(null, null);
    res.sendFile(__dirname+'/views/index.html')
});
app.get('/game', function(req, res){
    res.sendFile(__dirname+'/views/games.html')
});

var httpserver = http.createServer(app).listen(8080, function(){
  console.log('listening for requests on port '+app.get('port'));
})

var server   = require('http').Server(app);
var io       = require('socket.io')(server);

io.sockets.on('connection', function(socket) {
    checkIfSocketExists(socket.id, function(socketId){
        if(socketId == null){
            players.insert(null, socketId, function(error, data){
                
            });
        }
    });

    socket.on('message', function(message){
        if(message.playername != null){
            getPlayer(socket.id, function(player){
                if(player != null){
                    player.name = message.playername;
                    player.update(player._id, player, function(err, data){

                    });
                }
            });
        }

        if(message.startGame != null)
    });

});


function getPlayer(socketId, callback){
    var playerList = players.getall(function(err, players){
        for(i = 0;i<players.length;i++){
            if(players[i].websocketId == socketId){
                callback(player);
            }
        }
        callback(null);    
    });
}

function checkIfSocketExists(socketId, callback){
    var playerList = players.getall(function(err, players){
        for(i = 0;i<players.length;i++){
            if(players[i].websocketId == socketId){
                callback(websocketId);
            }
        }
        callback(null);    
    });
}

module.exports = app;








// var WebSocketServer = require('websocket').server;

// wsServer = new WebSocketServer({
//     httpServer: httpserver,
//     autoAcceptConnections: false
// });


// wsServer.on('request', function(request) {

//     var connection = request.accept('none-protocol', request.origin);

//     console.log((new Date()) + ' Connection accepted.');
//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             console.log('Received Message: ' + message.utf8Data);
            
//         }
//     });
//     connection.on('close', function(reasonCode, description) {
//         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//     });
// });
// app.use('/', routes);
// app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

// development error handler
// will print stacktrace
// if (app.get('env') === 'development') {
//   app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//       message: err.message,
//       error: err
//     });
//   });
// }


// app.use(express.static('public'));
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.engine('html', engines.mustache);
// app.set('view engine', 'html');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.get('/players/get/:playerid', function(req, res){
    players.get(req.params.playerid, function(err, players){
        res.send(players);
    });
});

app.get('/players/getall', function(req, res){
    players.getall(function(err, players){
        res.send(players);
    });
});

app.post('/players/join', function(req, res){
    var name = "John"
    var websocketId = 1123

    var retFunction = function(data){
        console.log(data);
    };

    players.insert(name, websocketId, retFunction);
        res.send();
    });