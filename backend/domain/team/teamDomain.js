var domainTools = require( "../domainTools" );
var competitionDomain = require( "../competition/competitionDomain" );
var playerDomain = require( "../player/playerDomain" );
var teamDatabase = require( '../../db/team/teamDatabase' );
var lodash = require( "lodash" );


exports.getTeamById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de equipo inválido" };
	let team = ( await teamDatabase.getTeamById( id ) );
	if ( !team ) throw { code: 404, message: "El equipo especificado no se encuentra en el sistema" };
	return team;
};


exports.getTeamByName = async ( name ) => {
	if ( !name ) throw { code: 422, message: "Nombre de equipo inválido" };
	return ( await teamDatabase.getTeamByName( name ) );
}


exports.getTeamListByName = async ( name ) => {
	if ( !name ) throw { code: 422, message: "Nombre de equipo inválido" };
	return ( await teamDatabase.getTeamListByName( name ) );
}


exports.hasPlayerAnyTeam = async ( playerID ) => {
	if ( !playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	let result = ( await teamDatabase.getPlayerTeam( playerID ) );
	return result;
}


exports.createTeam = async ( team, avatar ) => {
	( await exports.teamParametersValidator( team, avatar ) );
	let existingTeam = ( await exports.getTeamByName( team.name ) );
	if ( existingTeam ) {
		throw { code: 422, message: "El nombre de equipo ya está en uso" };
	}
	
	if ( team.players ) {
		let teamPlayerIDsCopy = lodash.cloneDeep( team.players );
		team.players = [];
		
		for ( let playerID of teamPlayerIDsCopy ) {
			let existingPlayer = ( await playerDomain.getPlayerById( playerID ) );
			if ( existingPlayer ) {
				if ( !( await exports.hasPlayerAnyTeam( playerID ) ) ) {
					team.players.push( existingPlayer );
				} else {
					throw { code: 422, message: "El jugador especificado ya se encuentra en un equipo" };
				}
			} else {
				throw { code: 422, message: "El jugador especificado no existe en el sistema" };
			}
		}
	}
	
	let createdTeam = ( await teamDatabase.createTeam( team ) );
	
	if ( avatar ) {
		let createdTeamID = createdTeam._id;
		delete createdTeam[ '_id' ];
		createdTeam[ 'avatar' ] = ( await domainTools.moveImageToMediaDirectory( avatar.path, "teams/" + createdTeamID + ".jpg" ) );
		createdTeam = ( await teamDatabase.updateTeam( createdTeamID, createdTeam ) );
	}
	
	return createdTeam;
};


exports.updateTeam = async ( id, team, avatar ) => {
	( await exports.teamParametersValidator( team, avatar ) );
	let existingTeam = ( await teamDatabase.getTeamById( id ) );
	if ( !existingTeam ) {
		throw { code: 422, message: "El equipo especificado no existe en el sistema" };
	}
	if ( existingTeam.name !== team.name ) {
		let existingTeamByName = ( await exports.getTeamByName( team.name ) );
		if ( existingTeamByName ) {
			if ( existingTeam._id.toString() !== existingTeamByName._id.toString() ) {
				throw { code: 422, message: "El nombre de equipo es inválido, ya se encuentra en uso" };
			}
		}
	}
	
	if ( team.players ) {
		let teamPlayerIDsCopy = lodash.cloneDeep( team.players );
		team.players = [];
		
		for ( let playerID of teamPlayerIDsCopy ) {
			let existingPlayer = ( await playerDomain.getPlayerById( playerID ) );
			if ( existingPlayer ) {
				let lastPlayerTeam = ( await exports.hasPlayerAnyTeam( playerID ) );
				if ( !lastPlayerTeam ) {
					team.players.push( existingPlayer );
				} else {
					if ( existingTeam._id.toString() !== lastPlayerTeam._id.toString() ) {
						throw { code: 422, message: "El jugador especificado ya se encuentra en un equipo" };
					} else {
						team.players.push( existingPlayer );
					}
				}
			} else {
				throw { code: 422, message: "El jugador especificado no existe en el sistema" };
			}
		}
	}
	
	if ( avatar ) {
		if ( existingTeam.avatar ) ( await domainTools.removeUploadedImage( existingTeam.avatar ) );
		team[ 'avatar' ] = ( await domainTools.moveImageToMediaDirectory( avatar.path, "teams/" + id + ".jpg" ) );
	} else {
		if ( existingTeam.avatar && team.deleteAvatar ) ( await domainTools.removeUploadedImage( existingTeam.avatar ) );
	}
	
	
	team['createdAt'] = existingTeam.createdAt;
	delete team.deleteAvatar;
	return ( await teamDatabase.updateTeam( id, team ) );
};


exports.purgeTeam = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de equipo inválido" };
	
	let existingTeam = ( await teamDatabase.getTeamById( id ) );
	if ( !existingTeam ) {
		throw { code: 422, message: "El equipo especificado no existe en el sistema" };
	}
	
	if ( existingTeam.player.length ) throw { code: 422, message: "El equipo especificado no se puede borrar, posee aún jugadores" };
	let playedCompetitions = ( await competitionDomain.hasTeamPlayedAnyCompetition( existingTeam._id ) );
	if ( !playedCompetitions.length ) throw { code: 422, message: "El equipo especificado no se puede borrar, participa en ciertas competiciones" };
	
	if ( existingTeam.avatar ) {
		( await domainTools.removeUploadedImage( existingTeam.avatar ) );
	}
	
	return ( await teamDatabase.purgeTeam( id ) );
};


exports.teamParametersValidator = async ( team, avatar ) => {
	if ( !team.name ) throw { code: 422, message: "Nombre de equipo inválido" };
	if ( !team.city ) throw { code: 422, message: "Ciudad de equipo inválido" };
	if ( !team.address ) throw { code: 422, message: "Dirección de equipo inválido" };
	if ( !team.localJersey ) throw { code: 422, message: "Equipación local de equipo inválido" };
	if ( !team.visitorJersey ) throw { code: 422, message: "Equipación visitante de equipo inválido" };
	if ( await domainTools.hasArrayDuplicatedElements( team.players ) ) throw { code: 422, message: "Lista de jugadores de equipo inválida, jugador duplicado" };
	if ( avatar ) ( await domainTools.checkUploadedImage( avatar ) );
};


// exports.addTeamToCompetition = async ( competitionID, newTeam, players ) => {
// 	if ( !competitionID ) throw { code: 422, message: "Invalid competition id" };
//
// 	let existingCompetition = ( await competitionDomain.getCompetitionById( competitionID ) );
// 	if ( !existingCompetition ) {
// 		throw { code: 422, message: "Specified competition is not in system" };
// 	}
//
// 	let currentTeamNumber = ( await exports.countTeamsInCompetition( competitionID ) );
// 	if ( existingCompetition.maxTeamNumber && currentTeamNumber >= existingCompetition.maxTeamNumber ) {
// 		throw { code: 422, message: "Reached maximum number of teams per this competition" };
// 	}
// 	newTeam.competitions.push( existingCompetition._id );
//
// 	if ( players.length < existingCompetition.minPlayerNumberPerTeam ) {
// 		throw { code: 422, message: "Cannot create team, minimum number of players has not been reached" };
// 	} else if ( players.length > existingCompetition.maxPlayerNumberPerTeam ) {
// 		throw { code: 422, message: "Cannot create team, maximum number of players reached." };
// 	}
//
// 	for ( let player of players ) {
// 		if ( player._id ) {
// 			let isPlayerInCompetition = ( await playerDomain.isPlayerInCompetition( existingCompetition._id, player._id ) );
// 			if ( isPlayerInCompetition ) throw { code: 422, message: "Player id " + player._id + " already enrolled in this competition" };
// 		} else {
// 			let validityResult = await playerDomain.checkCreatePlayerValidity( player );
// 		}
// 	}
//
// 	let returnedTeam = ( await exports.createTeam( newTeam ) );
// 	returnedTeam.players = [];
//
// 	for ( let player of players ) {
// 		if ( player._id ) {
// 			let returnedPlayer = ( await playerDomain.getPlayerById( player._id ) );
// 			returnedPlayer.competitions.push( { teamID: returnedTeam._id, competitionID: existingCompetition._id } );
// 			let updatedPlayer = ( await playerDomain.updatePlayer( returnedPlayer._id, returnedPlayer ) );
// 			returnedTeam.players.push( updatedPlayer );
// 		} else {
// 			player.competitions = [ { teamID: returnedTeam._id, competitionID: existingCompetition._id } ];
// 			let returnedPlayer = ( await playerDomain.createPlayer( player ) );
// 			returnedTeam.players.push( returnedPlayer );
// 		}
// 	}
//
// 	return returnedTeam;
// };


// exports.countTeamsInCompetition = async ( competitionID ) => {
// 	if ( !competitionID ) throw { code: 422, message: "Invalid competition id" };
// 	let existingCompetition = ( await competitionDomain.getCompetitionById( competitionID ) );
// 	if ( !existingCompetition ) {
// 		throw { code: 422, message: "Specified competition is not in system" };
// 	}
//
// 	return ( await teamDatabase.countTeamsInCompetition( competitionID ) );
// };
//
//
// exports.getTeamsInCompetition = async ( competitionID ) => {
// 	if ( !competitionID ) throw { code: 422, message: "Invalid competition id" };
// 	let existingCompetition = ( await competitionDomain.getCompetitionById( competitionID ) );
// 	if ( !existingCompetition ) {
// 		throw { code: 422, message: "Specified competition is not in system" };
// 	};
//
// 	return ( await teamDatabase.getTeamsInCompetition( competitionID ) );
// };
