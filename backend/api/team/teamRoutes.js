var team = require( "../team/teamAPI" );
var permissions = require( "../permissions" );
var passport = require( "passport" );


exports.assignRoutes = function ( app ) {
	app.get( "/teams/:teamID", team.getTeamById );
	app.get( "/teams", team.getTeamArrayByName );
	app.post( "/teams", team.createTeam );
	app.put( "/teams/:teamID", team.updateTeam );
	app.delete( "/teams/:teamID", team.purgeTeam );
}

