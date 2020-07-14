var domainTools = require( "../domainTools" );
var gameDatabase = require( '../../db/competition/competitionGameDatabase' );
var competitionDomain = require( "./competitionDomain" );
var teamDomain = require( "../team/teamDomain" );
var playerDomain = require( "../player/playerDomain" );
var robin = require( "roundrobin" );


exports.getGameById = async ( gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Invalid game id" };
	return ( await gameDatabase.getGameById( gameID ) );
};


exports.createGame = async ( game ) => {
	console.log( game );
	let competition = ( await competitionDomain.getCompetitionById( game.competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	
	let localTeam = ( await teamDomain.getTeamById( game.localTeamInfo._id ) );
	if ( !localTeam ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	if ( !competition.teams.find( team => team._id.toString() == localTeam._id.toString() ) )
		throw { code: 422, message: "El equipo local especificado no se encuentra en la competición" };
	let visitorTeam = ( await teamDomain.getTeamById( game.visitorTeamInfo._id ) );
	if ( !visitorTeam ) throw { code: 422, message: "Specified team is not in system" };
	if ( !competition.teams.find( team => team._id.toString() == visitorTeam._id.toString() ) )
		throw { code: 422, message: "El equipo visitante especificado no se encuentra en la competición" };
	
	game.time = null;
	game.location = null;
	game.localTeamInfo.name = localTeam.name;
	game.visitorTeamInfo.name = visitorTeam.name;
	
	return ( await gameDatabase.createGame( game ) );
};


exports.updateGame = async ( gameID, game ) => {
	if ( !gameID ) throw { code: 422, message: "Invalid game id" };
	
	let existingGameById = ( await gameDatabase.getGameById( gameID ) );
	if ( !existingGameById ) throw { code: 422, message: "Specified game is not in system" };
	
	return ( await gameDatabase.updateGame( gameID, game ) );
};


exports.purgeGame = async ( gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Invalid game id" };
	
	let existingGame = ( await gameDatabase.getGameById( gameID ) );
	if ( !existingGame ) {
		throw { code: 422, message: "Specified game is not in system" };
	}
	
	return ( await gameDatabase.purgeGame( gameID ) );
};


exports.deleteCompetitionSchedule = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Invalid competition id" };
	
	return ( await gameDatabase.deleteGamesByCompetition( competitionID ) );
};


exports.competitionGameParametersValidator = async ( game ) => {

};
