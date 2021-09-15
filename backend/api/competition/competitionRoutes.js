var competition = require( "./competitionAPI" );
var passport = require( "passport" );


exports.assignRoutes = function ( app ) {
	app.get( "/competitions/:competitionID/teams/:teamID/players/:playerID/stats", competition.getCompetitionPlayerStatsByCompetitionTeamAndPlayer );
	app.delete( "/competitions/:competitionID/games/:gameID/events/:eventID", passport.authenticate( 'jwt' ), competition.removeGameEvent );
	app.get( "/competitions/:competitionID/teams/:teamID/stats", competition.getCompetitionTeamStatsByCompetitionAndTeam );
	app.get( "/competitions/:competitionID/teams/:teamID/next-games", competition.getNextTeamGamesInCompetition );
	app.get( "/competitions/:competitionID/teams/:teamID/prev-games", competition.getPrevTeamGamesInCompetition );
	app.post( "/competitions/:competitionID/games/:gameID/start", passport.authenticate( 'jwt' ), competition.startGame );
	app.post( "/competitions/:competitionID/games/:gameID/events", passport.authenticate( 'jwt' ), competition.createGameEvent );
	app.get( "/competitions/:competitionID/fixture/:fixtureNumber", competition.getGamesByCompetitionAndFixture );
	app.get( "/competitions/:competitionID/games/:gameID", competition.getFullGameById );
	app.put( "/competitions/:competitionID/games/:gameID", passport.authenticate( 'jwt' ), competition.updateGameTimeAndLocation );
	app.get( "/competitions/:competitionID/all-playoffs/", competition.getAllAvailablePlayoffsRoundsByCompetition );
	app.get( "/competitions/:competitionID/current-fixture", competition.getCurrentFixture );
	app.get( "/competitions/:competitionID/league-table", competition.getCompetitionLeagueTable );
	app.get( "/competitions/:competitionID/unplayed-games", passport.authenticate( 'jwt' ), competition.getUnplayedGamesByCompetitionForScheduling );
	app.get( "/competitions/:competitionID", competition.getCompetitionByID );
	app.post( "/competitions", passport.authenticate( 'jwt' ), competition.createCompetition );
	app.get( "/competitions", passport.authenticate( 'jwt' ), competition.getCompetitionListByName );
}
