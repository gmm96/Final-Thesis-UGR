var domainTools = require( "../domainTools" );
var competitionDatabase = require( '../../db/competition/competitionDatabase' );
var ObjectID = require( 'mongodb' ).ObjectID;


exports.getAllCompetitions = async () => {
	let allCompetitions = ( await competitionDatabase.getAllCompetitions() );
	return allCompetitions;
};


exports.createCompetition = async ( competition ) => {
	if ( !competition.name ) throw { code: 422, message: "Invalid competition name" };
	if ( !competition.leagueFixturesVsSameTeam && !competition.playoffsFixturesVsSameTeam ) {
		throw { code: 422, message: "Invalid competition format" };
	}
	
	return ( await competitionDatabase.createCompetition( competition ) );
};


exports.updateCompetition = async ( id, competition ) => {
	if ( !id || !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid competition id" };
	if ( !competition.name ) throw { code: 422, message: "Invalid competition name" };
	if ( !competition.leagueFixturesVsSameTeam && !competition.playoffsFixturesVsSameTeam ) {
		throw { code: 422, message: "Invalid competition format" };
	}
	
	let existingCompetitionById = ( await competitionDatabase.getCompetitionById( id ) );
	if ( !existingCompetitionById ) throw { code: 422, message: "Specified competition is not in system" };
	
	return ( await competitionDatabase.updateCompetition( id, competition ) );
};


exports.deleteCompetition = async ( id ) => {
	if ( !id || !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid competition id" };
	
	let existingCompetition = ( await competitionDatabase.getCompetitionById( id ) );
	if ( !existingCompetition ) {
		throw { code: 422, message: "Specified competition is not in system" };
	}
	
	return ( await competitionDatabase.deleteCompetition( id ) );
};
