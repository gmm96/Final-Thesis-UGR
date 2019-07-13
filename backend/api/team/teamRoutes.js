var team = require( './teamAPI' );
var permissions = require( '../permissions' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/teams', team.getAllTeams );
	app.post( '/teams', team.createTeam );
	app.put( '/teams/:_id', team.updateTeam );
	app.delete( '/teams/:_id', team.deleteTeam );
}
