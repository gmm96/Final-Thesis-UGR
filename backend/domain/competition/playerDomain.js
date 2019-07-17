var domainTools = require( "../domainTools" );
var playerDatabase = require( '../../db/competition/playerDatabase' );
var ObjectID = require( 'mongodb' ).ObjectID;


exports.getAllPlayers = async () => {
	let result = ( await playerDatabase.getAllPlayers() );
	return result;
};


exports.getPlayerById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Invalid player id" };
	return ( await playerDatabase.getPlayerById( id ) );
};


exports.createPlayer = async ( player ) => {
	if ( !player.name ) throw { code: 422, message: "Invalid name" };
	if ( !player.surname ) throw { code: 422, message: "Invalid surname" };
	if ( !player.nationalIdentityCard && !player.passport ) throw { code: 422, message: "Player personal identification is required" };
	if ( !player.birthDate ) throw { code: 422, message: "Invalid birth date" };
	if ( typeof player.federatedNumber != 'number' ) throw { code: 422, message: "Invalid federated number" };
	
	let existingPlayer = ( await playerDatabase.getPlayerByPersonalIdentification( player.nationalIdentityCard, player.passport ) );
	if ( existingPlayer.length ) {
		throw { code: 422, message: "Personal identity already in use" };
	}
	
	return ( await playerDatabase.createPlayer( player ) );
};


exports.updatePlayer = async ( id, player ) => {
	if ( !id ) throw { code: 422, message: "Invalid player id" };
	if ( !player.name ) throw { code: 422, message: "Invalid name" };
	if ( !player.surname ) throw { code: 422, message: "Invalid surname" };
	if ( !player.birthDate ) throw { code: 422, message: "Invalid birth date" };
	if ( typeof player.federatedNumber != 'number' ) throw { code: 422, message: "Invalid federated number" };
	
	let existingPlayerById = ( await playerDatabase.getPlayerById( id ) );
	if ( !existingPlayerById ) throw { code: 422, message: "Specified player is not in system" };
	
	return ( await playerDatabase.updatePlayer( id, player ) );
};


exports.deletePlayer = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Invalid player id" };
	
	let existingPlayer = ( await playerDatabase.getPlayerById( id ) );
	if ( !existingPlayer ) {
		throw { code: 422, message: "Specified player is not in system" };
	}
	
	return ( await playerDatabase.deletePlayer( id ) );
};


exports.countTeamPlayers = async ( teamID ) => {
	if ( !teamID ) throw { code: 422, message: "Invalid team id" };
	
	return ( await playerDatabase.countTeamPlayers( teamID ) );
};
