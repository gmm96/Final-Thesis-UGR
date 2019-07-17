var domainTools = require( "../domainTools" );
var competitionDatabase = require( '../../db/competition/competitionDatabase' );
var teamDomain = require( "./teamDomain" );
var playerDomain = require( "./playerDomain" );


exports.getAllCompetitions = async () => {
	return ( await competitionDatabase.getAllCompetitions() );
};


exports.getCompetitionById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Invalid competition id" };
	return ( await competitionDatabase.getCompetitionById( id ) );
};


exports.createCompetition = async ( competition ) => {
	if ( !competition.name ) throw { code: 422, message: "Invalid competition name" };
	if ( !competition.leagueFixturesVsSameTeam && !competition.playoffsFixturesVsSameTeam ) {
		throw { code: 422, message: "Invalid competition format" };
	}
	
	return ( await competitionDatabase.createCompetition( competition ) );
};


exports.updateCompetition = async ( id, competition ) => {
	if ( !id ) throw { code: 422, message: "Invalid competition id" };
	if ( !competition.name ) throw { code: 422, message: "Invalid competition name" };
	if ( !competition.leagueFixturesVsSameTeam && !competition.playoffsFixturesVsSameTeam ) {
		throw { code: 422, message: "Invalid competition format" };
	}
	
	let existingCompetitionById = ( await competitionDatabase.getCompetitionById( id ) );
	if ( !existingCompetitionById ) throw { code: 422, message: "Specified competition is not in system" };
	
	return ( await competitionDatabase.updateCompetition( id, competition ) );
};


exports.deleteCompetition = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Invalid competition id" };
	
	let existingCompetition = ( await competitionDatabase.getCompetitionById( id ) );
	if ( !existingCompetition ) {
		throw { code: 422, message: "Specified competition is not in system" };
	}
	
	return ( await competitionDatabase.deleteCompetition( id ) );
};


exports.addNewPlayerToTeam = async ( newPlayer ) => {
	if ( !newPlayer.competitions[ 0 ].competitionID ) throw { code: 422, message: "Invalid competition id" };
	if ( !newPlayer.competitions[ 0 ].teamID ) throw { code: 422, message: "Invalid team id" };
	
	let existingCompetition = ( await exports.getCompetitionById( newPlayer.competitions[ 0 ].competitionID ) );
	if ( !existingCompetition ) {
		throw { code: 422, message: "Specified competition is not in system" };
	}
	
	let existingTeam = ( await teamDomain.getTeamById( newPlayer.competitions[ 0 ].teamID ) );
	if ( !existingTeam ) {
		throw { code: 422, message: "Specified team is not in system" };
	}
	
	if ( playerDomain.countTeamPlayers( newPlayer.competitions[ 0 ].teamID ) >= existingCompetition.maxPlayerNumber ) {
		throw { code: 422, message: "Reached max number of registered players for this team" };
	}
	
	return ( await playerDomain.createPlayer( newPlayer ) );
};
