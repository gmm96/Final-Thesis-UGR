var competition = require( "./competitionAPI" );
var permissions = require( "../permissions" );
var passport = require( "passport" );


exports.assignRoutes = function ( app ) {
	app.get( "/competitions/:competitionID/fixture/:fixtureNumber", competition.getGamesByCompetitionAndFixture );
	app.get( "/competitions/:competitionID/all-playoffs/", competition.getAllAvailablePlayoffsRoundsByCompetition );
	app.get( "/competitions/:competitionID/current-fixture", competition.getCurrentFixture );
	app.get( "/competitions/:competitionID/league-table", competition.getCompetitionLeagueTable );
	app.get( "/competitions/:competitionID", competition.getCompetitionByID );
	app.post( "/competitions", competition.createCompetition );
	app.put( "/competitions/:competitionID", competition.updateCompetition );
	app.purge( "/competitions/:competitionID", competition.purgeCompetition );
}
