var player = require( "../player/playerAPI" );
var passport = require( "passport" );
const formidableMiddleware = require('express-formidable');



exports.assignRoutes = function ( app ) {
	app.get( "/players/:playerID/competitions", player.getPlayerCompetitions );
	app.get( "/players/:playerID/stats", player.getAverageCompetitionPlayerStats );
	app.get( "/players/no-team", passport.authenticate( 'jwt' ), player.getPlayersWithNoTeam );
	app.get( "/players/:playerID", player.getFullPlayerById );
	app.put( "/players/:playerID", passport.authenticate( 'jwt' ), player.updatePlayer );
	app.delete( "/players/:playerID", passport.authenticate( 'jwt' ), player.purgePlayer );
	app.get( "/players", passport.authenticate( 'jwt' ), player.getPlayerArrayByPersonalIdentification );
	app.post( "/players", passport.authenticate( 'jwt' ), player.createPlayer );
}

