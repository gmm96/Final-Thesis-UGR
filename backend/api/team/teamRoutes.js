var team = require( "../team/teamAPI" );
var permissions = require( "../permissions" );
var passport = require( "passport" );


exports.assignRoutes = function ( app ) {
	app.get( "/teams/:teamID/competitions", team.getTeamCompetitions );
	app.get( "/teams/:teamID", team.getTeamById );
	app.put( "/teams/:teamID", team.updateTeam );
	app.delete( "/teams/:teamID", passport.authenticate( 'jwt' ), team.purgeTeam );
	app.get( "/teams", passport.authenticate( 'jwt' ), team.getTeamArrayByName );
	app.post( "/teams", passport.authenticate( 'jwt' ), team.createTeam );
}

