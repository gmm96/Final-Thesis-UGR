var domainTools = require( "../domainTools" );
var gameDatabase = require( '../../db/competition/competitionGameDatabase' );
var competitionDomain = require( "./competitionDomain" );
var teamDomain = require( "../team/teamDomain" );
var playerDomain = require( "../player/playerDomain" );
var competitionEventDomain = require( "./competitionEventDomain" );
var robin = require( "roundrobin" );
var competitionPlayerStatsDomain = require( "./competitionPlayerStatsDomain" )
var competitionTeamStatsDomain = require( "./competitionTeamStatsDomain" )


exports.getGameById = async ( gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	return ( await gameDatabase.getGameById( gameID ) );
};


exports.getFullGameById = async ( competitionID, gameID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	let game = ( await gameDatabase.getGameById( gameID ) );
	if ( !game ) throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	
	game.localTeamInfo.team = competition.teams.find( team => team._id.toString() === game.localTeamInfo._id.toString() );
	game.visitorTeamInfo.team = competition.teams.find( team => team._id.toString() === game.visitorTeamInfo._id.toString() );
	game.events = ( await competitionEventDomain.getCompetitionEventListByGameId( competitionID, gameID ) ).reverse();
	
	if ( await exports.isGameStarted( game ) ) {
		( await exports.getTeamScore( game.localTeamInfo ) );
		( await exports.getTeamScore( game.visitorTeamInfo ) );
	}
	
	return game;
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


exports.getUnplayedGamesByCompetitionForScheduling = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	
	let result = ( await gameDatabase.getUnplayedGamesByCompetitionForScheduling( competitionID ) );
	if ( result.length ) {
		for ( let i = 0; i < result.length; i += 1 ) {
			result[ i ].localTeamInfo.team = competition.teams.find( team => team._id.toString() === result[ i ].localTeamInfo._id.toString() );
			result[ i ].visitorTeamInfo.team = competition.teams.find( team => team._id.toString() === result[ i ].visitorTeamInfo._id.toString() );
		}
	}
	
	return result;
};


exports.isGameStarted = async ( game ) => {
	if ( !game ) throw { code: 422, message: "Objecto partido inválido" };
	let localTeamInfo = game.localTeamInfo;
	let visitorTeamInfo = game.visitorTeamInfo;
	let localOk = localTeamInfo.playerStats && localTeamInfo.playerStats.length && localTeamInfo.quarterStats && localTeamInfo.quarterStats.length;
	let visitorOk = visitorTeamInfo.playerStats && visitorTeamInfo.playerStats.length && visitorTeamInfo.quarterStats && visitorTeamInfo.quarterStats.length;
	return localOk && visitorOk;
};


exports.createGame = async ( game ) => {
	( await exports.competitionGameParametersValidator( game ) );
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


exports.startGame = async ( competitionID, gameID, initGame ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	if ( !initGame || !initGame.localTeam || !initGame.visitorTeam || !initGame.referees ) throw { code: 422, message: "Parámetros de inicio de partido inválidos" };
	
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	let game = ( await gameDatabase.getGameById( gameID ) );
	if ( !game ) throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	
	if ( game.time && game.location ) {
		if ( !( await exports.isGameStarted( game ) ) ) {
			delete game._id;
			game.referees = initGame.referees;
			( await exports.createTeamInfoStats( game.localTeamInfo, initGame.localTeam ) );
			( await exports.createTeamInfoStats( game.visitorTeamInfo, initGame.visitorTeam ) );
			( await competitionEventDomain.createCompetitionEvent( {
				competitionID: competitionID,
				gameID: gameID,
				type: competitionEventDomain.CompetitionEventTypes.startGame,
				minute: 1,
				quarter: 1
			} ) );
			( await competitionEventDomain.createCompetitionEvent( {
				competitionID: competitionID,
				gameID: gameID,
				type: competitionEventDomain.CompetitionEventTypes.startQuarter,
				minute: 1,
				quarter: 1
			} ) );
			return ( gameDatabase.updateGame( gameID, game ) );
		} else {
			throw { code: 422, message: "El partido ya fue iniciado anteriormente" };
		}
	} else {
		throw { code: 422, message: "El partido no se puede iniciar, tiene que establecer fecha y localización en el calendario" };
	}
};


exports.canIFinishGame = async ( competitionID, gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	let game = ( await exports.getFullGameById( competitionID, gameID ) );
	if ( !game ) throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	let quarter = game.localTeamInfo.quarterStats[ game.localTeamInfo.quarterStats.length - 1 ].quarter;
	return quarter >= 4 && game.localTeamInfo.points != game.visitorTeamInfo.points;
};


exports.finishGame = async ( competitionID, gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	let game = ( await exports.getFullGameById( competitionID, gameID ) );
	if ( !game ) throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	let competition = ( await competitionDomain.getCompetitionById( game.competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	
	if ( typeof game.round == "number" ) {
		let localCompetitionSt = ( await competitionTeamStatsDomain.getCompetitionTeamStatsByCompetitionAndTeam( game.competitionID, game.localTeamInfo._id ) );
		localCompetitionSt.stats.playedGames += 1;
		if ( game.winner.toString() === game.localTeamInfo._id.toString() ) localCompetitionSt.stats.wonGames += 1;
		localCompetitionSt.stats.points += game.localTeamInfo.points;
		localCompetitionSt.stats.opponentPoints += game.visitorTeamInfo.points;
		( await competitionTeamStatsDomain.updateCompetitionTeamStats( localCompetitionSt._id, localCompetitionSt ) );
		
		let visitorCompetitionSt = ( await competitionTeamStatsDomain.getCompetitionTeamStatsByCompetitionAndTeam( game.competitionID, game.visitorTeamInfo._id ) );
		visitorCompetitionSt.stats.playedGames += 1;
		if ( game.winner.toString() === game.visitorTeamInfo._id.toString() ) visitorCompetitionSt.stats.wonGames += 1;
		visitorCompetitionSt.stats.points += game.visitorTeamInfo.points;
		visitorCompetitionSt.stats.opponentPoints += game.localTeamInfo.points;
		( await competitionTeamStatsDomain.updateCompetitionTeamStats( visitorCompetitionSt._id, visitorCompetitionSt ) );
	}
	( exports.updateCompetitionPlayerStatsAfterGame( game, game.localTeamInfo ) );
	( exports.updateCompetitionPlayerStatsAfterGame( game, game.visitorTeamInfo ) );
};


exports.updateCompetitionPlayerStatsAfterGame = async ( game, teamInfo ) => {
	if ( !game ) throw { code: 422, message: "Objeto partido inválido" };
	if ( !teamInfo ) throw { code: 422, message: "Objeto estadísticas de equipo inválido" };
	
	for ( let playerSt of teamInfo.playerStats ) {
		let competitionSt = ( await competitionPlayerStatsDomain.getCompetitionPlayerStatsByCompetitionTeamAndPlayer( game.competitionID, teamInfo._id, playerSt.playerID ) );
		competitionSt.stats.playedGames += 1;
		competitionSt.stats.points += playerSt.points;
		competitionSt.stats.fouls += playerSt.fouls.length;
		( await competitionPlayerStatsDomain.updateCompetitionPlayerStats( competitionSt._id, competitionSt ) );
	}
};


exports.createTeamInfoStats = async ( teamInfo, players ) => {
	if ( !teamInfo ) throw { code: 422, message: "Objecto estadísitcas de equipo inválido" };
	teamInfo.quarterStats = [];
	teamInfo.quarterStats.push( {
		points: 0,
		fouls: 0,
		quarter: 1,
		timeoutsRemaining: 2
	} );
	teamInfo.playerStats = [];
	players.forEach( player => {
		teamInfo.playerStats.push( {
			playerID: player._id,
			points: 0,
			fouls: [],
			number: player.number
		} );
	} );
};


exports.getTeamScore = async ( teamInfo ) => {
	if ( !teamInfo ) throw { code: 422, message: "Objeto estadísticas de equipo inválido" };
	teamInfo.points = teamInfo.quarterStats.reduce( ( sum, quarter ) => sum + quarter.points, 0 );
};


exports.getPlayedGamesBetweenTeamsForStandings = async ( competitionID, teamIDArray ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !teamIDArray || !teamIDArray.length ) throw { code: 422, message: "Lista de identificadores de equipo inválida" };
	return ( await gameDatabase.getPlayedGamesBetweenTeamsForStandings( competitionID, teamIDArray ) );
};


exports.purgeGame = async ( gameID ) => {
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	
	let existingGame = ( await gameDatabase.getGameById( gameID ) );
	if ( !existingGame ) {
		throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	}
	
	return ( await gameDatabase.purgeGame( gameID ) );
};


exports.competitionGameParametersValidator = async ( game ) => {
	if ( !game.competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !game.localTeamInfo || !game.localTeamInfo._id ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !game.visitorTeamInfo || !game.visitorTeamInfo._id ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !game.fixture ) throw { code: 422, message: "Número de jornada inválido" };
	if ( !game.round ) throw { code: 422, message: "Ronda de partido inválida" };
};
