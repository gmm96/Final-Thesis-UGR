var domainTools = require( "../domainTools" );
var competitionDomain = require( "../competition/competitionDomain" );
var teamDomain = require( "../team/teamDomain" );
var competitionPlayerStatsDomain = require( "../competition/competitionPlayerStatsDomain" );
var playerDatabase = require( '../../db/player/playerDatabase' );


exports.getPlayerById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de jugador inválido" };
	return ( await playerDatabase.getPlayerById( id ) );
};


exports.getPlayerByNameOrSurname = async ( nameOrSurname ) => {
	if ( !nameOrSurname ) return [];
	return ( await playerDatabase.getPlayerByNameOrSurname( nameOrSurname ) );
}


exports.createPlayer = async ( player, avatar ) => {
	( await exports.playerParametersValidator( player, avatar ) );
	
	let existingPlayer = ( await playerDatabase.getPlayerByPersonalIdentification( player.idCard ) );
	if ( existingPlayer ) {
		throw { code: 422, message: "El identificador personal de jugador " + player.idCard + " ya está en uso" };
	}
	
	let createdPlayer = ( await playerDatabase.createPlayer( player ) );
	if ( avatar ) {
		let createdPlayerID = createdPlayer._id;
		player[ 'avatar' ] = ( await domainTools.moveImageToMediaDirectory( avatar.path, "players/" + createdPlayerID + ".jpg" ) );
		createdPlayer = ( await playerDatabase.updatePlayer( createdPlayerID, player ) );
	}
	return createdPlayer;
};


exports.updatePlayer = async ( id, player, avatar ) => {
	( await exports.playerParametersValidator( player, avatar ) );
	let existingPlayer = ( await playerDatabase.getPlayerById( id ) );
	if ( !existingPlayer ) {
		throw { code: 422, message: "El jugador especificado no se encuentra en el sistema" };
	}
	
	if ( existingPlayer.idCard !== player.idCard ) {
		let otherPlayersWithNewIDCard = ( await playerDatabase.getPlayerByPersonalIdentification( player.idCard ) );
		if ( otherPlayersWithNewIDCard ) {
			if ( existingPlayer._id.toString() !== otherPlayersWithNewIDCard._id.toString() ) {
				throw { code: 422, message: "El identificador personal de jugador " + player.idCard + " ya está en uso" };
			}
		}
	}
	
	if ( avatar ) {
		if ( existingPlayer.avatar ) ( await domainTools.removeUploadedImage( existingPlayer.avatar ) );
		player[ 'avatar' ] = ( await domainTools.moveImageToMediaDirectory( avatar.path, "players/" + id + ".jpg" ) );
	} else {
		if ( existingPlayer.avatar && player.deleteAvatar ) ( await domainTools.removeUploadedImage( existingPlayer.avatar ) );
	}
	
	return ( await playerDatabase.updatePlayer( id, player ) );
};


exports.purgePlayer = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de jugador inválido" };
	
	let existingPlayer = ( await playerDatabase.getPlayerById( id ) );
	if ( !existingPlayer ) {
		throw { code: 422, message: "El jugador especificado no se encuentra en el sistema" };
	}
	
	let playerTeam = ( await teamDomain.hasPlayerAnyTeam( id ) );
	if ( playerTeam ) {
		throw { code: 422, message: "El jugador especificado no se puede borrar del sistema, se encuentra en un equipo" };
	}
	let playerStats = ( await competitionPlayerStatsDomain.hasPlayerPlayedAnyCompetition( id ) );
	if ( playerStats ) {
		throw { code: 422, message: "El jugador especificado no se puede borrar del sistema, posee estadísticas de competición" };
	}
	
	if ( existingPlayer.avatar ) {
		( await domainTools.removeUploadedImage( existingPlayer.avatar ) );
	}
	
	return ( await playerDatabase.purgePlayer( id ) );
};


exports.playerParametersValidator = async ( player, avatar ) => {
	if ( !player.name ) throw { code: 422, message: "Nombre de jugador inválido" };
	if ( !player.surname ) throw { code: 422, message: "Apellido de jugador inválido" };
	if ( !player.birthDate ) throw { code: 422, message: "Fecha de nacimiento de jugador inválido" };
	if ( !player.birthPlace ) throw { code: 422, message: "Lugar de nacimiento de jugador inválido" };
	if ( !player.idCard ) throw { code: 422, message: "Identificador personal de jugador inválido" };
	if ( !player.weight ) throw { code: 422, message: "Peso de jugador inválido" };
	if ( !player.height ) throw { code: 422, message: "Altura de jugador inválido" };
	if ( avatar ) ( await domainTools.checkUploadedImage( avatar ) );
};


// exports.addNewPlayerToTeam = async ( player, competitionID, teamID ) => {
// 	if ( !competitionID ) throw { code: 422, message: "Invalid competition id" };
// 	if ( !teamID ) throw { code: 422, message: "Invalid team id" };
//
// 	let existingCompetition = ( await competitionDomain.getCompetitionById( competitionID ) );
// 	if ( !existingCompetition ) throw { code: 422, message: "Specified competition is not in system" };
//
// 	let existingTeam = ( await teamDomain.getTeamById( teamID ) );
// 	if ( !existingTeam ) throw { code: 422, message: "Specified team is not in system" };
//
// 	if ( ( await exports.countPlayersInTeam( existingTeam._id ) ) >= existingCompetition.maxPlayerNumberPerTeam ) {
// 		throw { code: 422, message: "Reached maximum number of registered players for this team" };
// 	}
//
// 	let validityResult = await exports.checkCreatePlayerValidity( player );
//
// 	player.competitions.push( { "teamID": existingTeam._id, "competitionID": existingCompetition._id } );
// 	return ( await exports.createPlayer( player ) );
// };


// exports.addExistingPlayerToTeam = async ( playerID, competitionID, teamID ) => {
// 	if ( !playerID ) throw { code: 422, message: "Invalid player id" };
// 	if ( !teamID ) throw { code: 422, message: "Invalid team id" };
// 	if ( !competitionID ) throw { code: 422, message: "Invalid competition id" };
//
// 	let existingCompetition = ( await competitionDomain.getCompetitionById( competitionID ) );
// 	if ( !existingCompetition ) throw { code: 422, message: "Specified competition is not in system" };
//
// 	let existingTeam = ( await teamDomain.getTeamById( teamID ) );
// 	if ( !existingTeam ) throw { code: 422, message: "Specified team is not in system" };
//
// 	let existingPlayer = ( await exports.getPlayerById( playerID ) );
// 	if ( !existingPlayer ) throw { code: 422, message: "Specified player is not in system" };
//
// 	if ( ( await exports.countPlayersInTeam( existingTeam._id ) ) >= existingCompetition.maxPlayerNumberPerTeam ) {
// 		throw { code: 422, message: "Reached maximum number of registered players for this team" };
// 	}
//
// 	let isPlayerInCompetition = ( await exports.isPlayerInCompetition( competitionID, existingPlayer._id ) );
// 	if ( isPlayerInCompetition ) throw { code: 422, message: "Player id " + existingPlayer._id + " already enrolled in this competition" };
//
// 	existingPlayer.competitions.push( { "teamID": existingTeam._id, "competitionID": existingCompetition._id } );
// 	return ( await exports.updatePlayer( existingPlayer._id, existingPlayer ) );
// };


// exports.removePlayerFromTeam = async ( playerID, teamID, competitionID ) => {
// 	if ( !playerID ) throw { code: 422, message: "Invalid player id" };
//
// 	let player = ( await exports.getPlayerById( playerID ) );
// 	let playerCompetitionIndex = player.competitions.findIndex( competition =>
// 		competition.teamID.toString() == teamID.toString() && competition.competitionID.toString() == competitionID.toString()
// 	);
// 	if ( playerCompetitionIndex == -1 ) throw { code: 422, message: "Player is not registered in this competition" };
//
// 	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
// 	if ( !competition ) throw { code: 422, message: "Specified competition is not in system" };
// 	if ( competition.inProgress ) throw { code: 422, message: "Cannot remove player from team, competition has already started" };
//
// 	player.competitions.splice( playerCompetitionIndex, 1 );
//
// 	return ( await exports.updatePlayer( playerID, player ) );
// };
