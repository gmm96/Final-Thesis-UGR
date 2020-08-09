var domainTools = require( "../domainTools" );
var competitionPlayerStatsDatabase = require( '../../db/competition/competitionPlayerStatsDatabase' );


exports.getCompetitionPlayerStatsById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de estadísticas de jugador inválido" };
	return ( await competitionPlayerStatsDatabase.getCompetitionPlayerStatsById( id ) );
};


exports.createCompetitionPlayerStats = async ( competitionID, teamID, playerID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	if ( !playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	
	let newCompetitionPlayerStats = {
		competitionID: competitionID,
		teamID: teamID,
		playerID: playerID,
		stats: {
			playedGames: 0,
			points: 0,
			fouls: 0
		}
	};
	
	return ( await competitionPlayerStatsDatabase.createCompetitionPlayerStats( newCompetitionPlayerStats ) );
};


exports.updateCompetitionPlayerStats = async ( id, competitionPlayerStats ) => {
	if ( !id ) throw { code: 422, message: "Identificador de estadísticas de jugador inválido" };
	
	let existingCompetitionPlayerStats = ( await competitionPlayerStatsDatabase.getCompetitionPlayerStatsById( id ) );
	if ( !existingCompetitionPlayerStats ) throw { code: 422, message: "Las estadísticas del jugador especificado no se encuentran en el sistema" };
	
	return ( await competitionPlayerStatsDatabase.updateCompetitionPlayerStats( id, competitionPlayerStats ) );
};


exports.purgeCompetitionPlayerStats = async ( competitionPlayerStatsID ) => {
	if ( !competitionPlayerStatsID ) throw { code: 422, message: "Identificador de estadísticas de jugador inválido" };
	
	let existingCompetitionPlayerStats = ( await competitionPlayerStatsDatabase.getCompetitionPlayerStatsById( competitionPlayerStatsID ) );
	if ( !existingCompetitionPlayerStats ) {
		throw { code: 422, message: "Las estadísticas del equipo especificado no se encuentran en el sistema" };
	}
	
	return ( await competitionPlayerStatsDatabase.purgeCompetitionPlayerStats( competitionPlayerStatsID ) );
};

exports.hasPlayerPlayedAnyCompetition = async ( playerID ) => {
	if ( !playerID ) throw { code: 404, message: "Identificador de jugador inválido" };
	let competitionPlayerStats = ( await competitionPlayerStatsDatabase.getCompetitionPlayerStatsByPlayerId( playerID ) );
	return competitionPlayerStats;
}

exports.getCompetitionPlayerStatsByCompetitionTeamAndPlayer = async ( competitionID, teamID, playerID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	if ( !playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	
	return ( await competitionPlayerStatsDatabase.getCompetitionPlayerStatsByCompetitionTeamAndPlayer( competitionID, teamID, playerID ) );
};


