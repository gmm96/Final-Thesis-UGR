var competition = require( "./competitionAPI" );
var permissions = require( "../permissions" );
var passport = require( "passport" );


exports.assignRoutes = function ( app ) {
	app.get( "/competitions/:competitionID/league-table", competition.getCompetitionLeagueTable );
	app.get( "/competitions/:competitionID", competition.getCompetitionByID );
	app.post( "/competitions", competition.createCompetition );
	app.put( "/competitions/:competitionID", competition.updateCompetition );
	app.purge( "/competitions/:competitionID", competition.purgeCompetition );
}
