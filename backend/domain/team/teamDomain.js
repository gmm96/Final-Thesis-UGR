var domainTools = require( "../domainTools" );
var competitionDomain = require( "../competition/competitionDomain" );
var playerDomain = require( "../player/playerDomain" );
var teamDatabase = require( '../../db/team/teamDatabase' );
var lodash = require( "lodash" );


exports.getTeamById = async ( id ) => {
	if ( !id ) throw { code: 404, message: "Identificador de equipo inválido" };
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
};


exports.getPlayersWithTeam = async () => {
	let result = ( await teamDatabase.getPlayersWithTeam() );
	return result;
};


exports.hasPlayerAnyTeam = async ( playerID ) => {
	if ( !playerID ) throw { code: 404, message: "Identificador de jugador inválido" };
	let result = ( await teamDatabase.getPlayerTeam( playerID ) );
	return result;
}


exports.getTeamCompetitions = async ( teamID ) => {
	if ( !teamID ) throw { code: 404, message: "Identificador de equipo inválido" };
	let result = ( await competitionDomain.hasTeamPlayedAnyCompetition( teamID ) );
	let parsedResult = result.map( ( competition ) => {
		let parsedCompetition = lodash.cloneDeep( competition );
		delete parsedCompetition.teams;
		parsedCompetition.team = competition.teams.find( team => team._id.toString() === teamID.toString() );
		return parsedCompetition;
	} );
	return parsedResult;
};


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
	
	
	team[ 'createdAt' ] = existingTeam.createdAt;
	delete team.deleteAvatar;
	return ( await teamDatabase.updateTeam( id, team ) );
};


exports.purgeTeam = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de equipo inválido" };
	
	let existingTeam = ( await teamDatabase.getTeamById( id ) );
	if ( !existingTeam ) {
		throw { code: 422, message: "El equipo especificado no existe en el sistema" };
	}
	
	if ( existingTeam.players && existingTeam.players.length ) throw { code: 422, message: "El equipo especificado no se puede borrar, posee aún jugadores" };
	let playedCompetitions = ( await competitionDomain.hasTeamPlayedAnyCompetition( existingTeam._id ) );
	if ( playedCompetitions && playedCompetitions.length ) throw { code: 422, message: "El equipo especificado no se puede borrar, participa en ciertas competiciones" };
	
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
