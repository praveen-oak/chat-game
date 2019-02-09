var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

var gamesSchema = new Schema({
	player1 : String,
	player1WebsocketId : String,
	player2WebsocketId : String,
	player2 : String,
	board : String
})

var Games = mongoose.model('games', gamesSchema);

module.exports = {
	get : function(gameid, cb){
		var id = mongoose.Types.ObjectId(gameid);
		mongoose.model('games').find({_id:new ObjectId(gameid)}, function(err, games){
			cb(err, games);
		});
	},

	getall : function(cb){
		mongoose.model('games').find(function(err, games){
			console.log("here")
			cb(err, games);
		});
	},

	update : function(id, doc, cb){
		mongoose.model('games').update({_id:doc._id}, doc, {upsert: true}, function(err, doc){
			cb(err, doc);
		});
	},

	insert : function(player1, player1WebsocketId,  cb){
		var gamesJson = {
			"player1" : player1,
			"player1WebsocketId" : player1WebsocketId,
			_id : new ObjectId()
		};
		var game = new Games(gamesJson);
		game.save(function(error, data){
			if(error){
				console.log(error);
			}
			else{
				cb(data);
			}
		});
	}
}