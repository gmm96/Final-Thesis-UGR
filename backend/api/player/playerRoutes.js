var player = require( "../player/playerAPI" );
var permissions = require( "../permissions" );
var passport = require( "passport" );


exports.assignRoutes = function ( app ) {
	app.get("/players/:playerID", player.getFullPlayerById );
	app.post("/players", player.createPlayer );
	app.put("/players/:playerID", player.updatePlayer );
	app.delete("/players/:playerID", player.purgePlayer );
}

