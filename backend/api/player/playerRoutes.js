var player = require( "../player/playerAPI" );
var permissions = require( "../permissions" );
var passport = require( "passport" );
const formidableMiddleware = require('express-formidable');



exports.assignRoutes = function ( app ) {
	app.get( "/players/no-team", player.getPlayersWithNoTeam );
	app.get( "/players/:playerID", player.getFullPlayerById );
	app.get( "/players", player.getPlayerArrayByPersonalIdentification );
	app.post( "/players", player.createPlayer );
	app.put( "/players/:playerID", player.updatePlayer );
	app.delete( "/players/:playerID", player.purgePlayer );
}

