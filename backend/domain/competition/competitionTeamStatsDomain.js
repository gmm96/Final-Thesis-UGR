var domainTools = require( "../domainTools" );
var competitionTeamStatsDatabase = require( '../../db/competition/competitionTeamStatsDatabase' );


exports.getCompetitionTeamStatsById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de estadísticas de equipo inválido" };
	return ( await competitionTeamStatsDatabase.getCompetitionTeamStatsById( id ) );
};


exports.getCompetitionTeamStatsByCompetition = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de estadísticas de equipo inválido" };
	let result = ( await competitionTeamStatsDatabase.getCompetitionTeamStatsByCompetition( competitionID ) );
	return result;
};


exports.getCompetitionTeamStatsByCompetitionAndTeam = async ( competitionID, teamID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	return ( await competitionTeamStatsDatabase.getCompetitionTeamStatsByCompetitionAndTeam( competitionID, teamID ) );
}


exports.createCompetitionTeamStats = async ( competitionID, teamID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	
	let newCompetitionTeamStats = {
		competitionID: competitionID,
		teamID: teamID,
		stats: {
			playedGames: 0,
			wonGames: 0,
			points: 0,
			opponentPoints: 0
		}
	};
	
	return ( await competitionTeamStatsDatabase.createCompetitionTeamStats( newCompetitionTeamStats ) );
};


exports.updateCompetitionTeamStats = async ( id, competitionTeamStats ) => {
	if ( !id ) throw { code: 422, message: "Identificador de estadísticas de equipo inválido" };
	
	let existingCompetitionTeamStats = ( await competitionTeamStatsDatabase.getCompetitionTeamStatsById( id ) );
	if ( !existingCompetitionTeamStats ) throw { code: 422, message: "Las estadísticas del equipo especificado no se encuentran en el sistema" };
	
	return ( await competitionTeamStatsDatabase.updateCompetitionTeamStats( id, competitionTeamStats ) );
};


exports.purgeCompetitionTeamStats = async ( competitionTeamStatsID ) => {
	if ( !competitionTeamStatsID ) throw { code: 422, message: "Identificador de estadísticas de equipo inválido" };
	
	let existingCompetitionTeamStats = ( await competitionTeamStatsDatabase.getCompetitionTeamStatsById( competitionTeamStatsID ) );
	if ( !existingCompetitionTeamStats ) {
		throw { code: 422, message: "Las estadísticas del equipo especificado no se encuentran en el sistema" };
	}
	
	return ( await competitionTeamStatsDatabase.purgeCompetitionTeamStats( competitionTeamStatsID ) );
};
