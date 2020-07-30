var domainTools = require( "../domainTools" );
var gameDatabase = require( '../../db/competition/competitionGameDatabase' );
var competitionDomain = require( "./competitionDomain" );
var teamDomain = require( "../team/teamDomain" );
var playerDomain = require( "../player/playerDomain" );
var robin = require( "roundrobin" );


exports.getGameById = async ( gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	return ( await gameDatabase.getGameById( gameID ) );
};


exports.getGamesByCompetitionAndFixture = async ( competitionID, fixture ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	if ( fixture < 1 || fixture > ( competition.teams.length - 1 ) * competition.leagueFixturesVsSameTeam ) {
		throw { code: 422, message: "Número de jornada inválida" };
	}
	let result = ( await gameDatabase.getGamesByCompetitionAndFixture( competitionID, fixture ) );
	return result;
}


exports.getCurrentFixture = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	let result = ( await gameDatabase.getCurrentFixture( competitionID ) );
	if ( result && result.length ) {
		result = result[ 0 ].fixture;
	} else {
		result = ( competition.teams.length - 1 ) * competition.leagueFixturesVsSameTeam;
	}
	return result;
};


exports.getNextTeamGamesInCompetition = async ( competitionID, teamID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	let team = ( await teamDomain.getTeamById( teamID ) );
	if ( !team ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	
	let result = ( await gameDatabase.getNextTeamGamesInCompetition( competitionID, teamID ) );
	if ( result.length ) {
		for ( let i = 0; i < result.length; i += 1 ) {
			result[ i ].localTeamInfo.team = competition.teams.find( team => team._id.toString() === result[ i ].localTeamInfo._id.toString() );
			result[ i ].visitorTeamInfo.team = competition.teams.find( team => team._id.toString() === result[ i ].visitorTeamInfo._id.toString() );
		}
	}
	
	return result;
};


exports.getPrevTeamGamesInCompetition = async ( competitionID, teamID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	let team = ( await teamDomain.getTeamById( teamID ) );
	if ( !team ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	
	let result = ( await gameDatabase.getPrevTeamGamesInCompetition( competitionID, teamID ) );
	if ( result.length ) {
		for ( let i = 0; i < result.length; i += 1 ) {
			result[ i ].localTeamInfo.team = competition.teams.find( team => team._id.toString() === result[ i ].localTeamInfo._id.toString() );
			result[ i ].visitorTeamInfo.team = competition.teams.find( team => team._id.toString() === result[ i ].visitorTeamInfo._id.toString() );
		}
	}
	
	return result;
};



exports.createGame = async ( game ) => {
	let competition = ( await competitionDomain.getCompetitionById( game.competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	
	let localTeam = ( await teamDomain.getTeamById( game.localTeamInfo._id ) );
	if ( !localTeam ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	if ( !competition.teams.find( team => team._id.toString() == localTeam._id.toString() ) )
		throw { code: 422, message: "El equipo local especificado no se encuentra en la competición" };
	let visitorTeam = ( await teamDomain.getTeamById( game.visitorTeamInfo._id ) );
	if ( !visitorTeam ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	if ( !competition.teams.find( team => team._id.toString() == visitorTeam._id.toString() ) )
		throw { code: 422, message: "El equipo visitante especificado no se encuentra en la competición" };
	
	game.createdAt = new Date().toISOString();
	game.updatedAt = new Date().toISOString();
	game.time = null;
	game.location = null;
	
	return ( await gameDatabase.createGame( game ) );
};


exports.updateGame = async ( gameID, game ) => {
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	
	let existingGameById = ( await gameDatabase.getGameById( gameID ) );
	if ( !existingGameById ) throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	
	game.createdAt = existingGameById.createdAt;
	game.updatedAt = new Date().toISOString();
	
	return ( await gameDatabase.updateGame( gameID, game ) );
};


exports.purgeGame = async ( gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	
	let existingGame = ( await gameDatabase.getGameById( gameID ) );
	if ( !existingGame ) {
		throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	}
	
	return ( await gameDatabase.purgeGame( gameID ) );
};


exports.deleteCompetitionSchedule = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de partido inválido" };
	
	return ( await gameDatabase.deleteGamesByCompetition( competitionID ) );
};


exports.competitionGameParametersValidator = async ( game ) => {

};
