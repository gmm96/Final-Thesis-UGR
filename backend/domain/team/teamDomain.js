var domainTools = require( "../domainTools" );
var teamDatabase = require( '../../db/team/teamDatabase' );
var ObjectID = require( 'mongodb' ).ObjectID;


exports.getAllTeams = async () => {
	let result = ( await teamDatabase.getAllTeams() );
	return result;
};


exports.createTeam = async ( team ) => {
	if ( !team.name ) throw { code: 422, message: "Invalid team name" };
	if ( !team.city ) throw { code: 422, message: "Invalid city" };
	if ( !team.federatedNumber || typeof team.federatedNumber != 'number' )
		throw { code: 422, message: "Invalid federated number" };
	
	return ( await teamDatabase.createTeam( team ) );
};


exports.updateTeam = async ( id, team ) => {
	if ( !id || !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid team id" };
	if ( !team.name ) throw { code: 422, message: "Invalid team name" };
	if ( !team.city ) throw { code: 422, message: "Invalid city" };
	if ( !team.federatedNumber || typeof team.federatedNumber != 'number' )
		throw { code: 422, message: "Invalid federated number" };
	
	let existingTeamById = ( await teamDatabase.getTeamById( id ) );
	if ( !existingTeamById ) throw { code: 422, message: "Specified team is not in system" };
	
	return ( await teamDatabase.updateTeam( id, team ) );
};


exports.deleteTeam = async ( id ) => {
	if ( !id || !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid team id" };
	
	let existingTeam = ( await teamDatabase.getTeamById( id ) );
	if ( !existingTeam ) {
		throw { code: 422, message: "Specified team is not in system" };
	}
	
	return ( await teamDatabase.deleteTeam( id ) );
};
