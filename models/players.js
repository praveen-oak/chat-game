var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Schema = mongoose.Schema;

var playersSchema = new Schema({
	name : String,
	websocketId : String
})

var Player = mongoose.model('players', playersSchema);

module.exports = {
	get : function(playerid, cb){
		var id = mongoose.Types.ObjectId(playerid);
		mongoose.model('players').find({_id:new ObjectId(playerid)}, function(err, players){
			cb(err, players);
		});
	},

	getall : function(cb){
		mongoose.model('players').find(function(err, players){
			cb(err, players);
		});
	},

	update : function(id, doc, cb){
		mongoose.model('players').update({_id:doc._id}, doc, {upsert: true}, function(err, doc){
			cb(err, doc);
		});
	},

	insert : function(name, websocketId, cb){
		var playerJson = {
			"name" : name,
			"websocketId" : websocketId,
			_id : new ObjectId()
		};
		var player = new Player(playerJson);
		player.save(function(error, data){
			if(error){
				console.log(error);
			}
			else{
				cb(data);
			}
		});
	}
}