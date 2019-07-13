var player = require( './playerAPI' );
var permissions = require( '../permissions' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/players', player.getAllPlayers );
	app.post( '/players', player.createPlayer );
	app.put( '/players/:_id', player.updatePlayer );
	app.delete( '/players/:_id', player.deletePlayer );
}
