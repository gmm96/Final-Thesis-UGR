var competition = require( "./competitionAPI" );
var team = require( "./teamAPI" );
var player = require( "./playerAPI" );
var permissions = require( "../permissions" );
var passport = require( "passport" );


exports.assignRoutes = function ( app ) {
	app.get( "/competitions", competition.getAllCompetitions );
	app.post( "/competitions", competition.createCompetition );
	app.put( "/competitions/:_id", competition.updateCompetition );
	app.delete( "/competitions/:_id", competition.deleteCompetition );
	
	app.post( "/competitions/:competitionID/teams/:teamID/players", competition.addNewPlayerToTeam );
}
