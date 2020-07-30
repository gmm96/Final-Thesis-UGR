var domainTools = require( "../domainTools" );
var competitionDatabase = require( '../../db/competition/competitionDatabase' );
var teamDomain = require( "../team/teamDomain" );
var playerDomain = require( "../player/playerDomain" );
var gameDomain = require( "./competitionGameDomain" );
var competitionTeamStatsDomain = require( "./competitionTeamStatsDomain" );
var competitionPlayerStatsDomain = require( "./competitionPlayerStatsDomain" );
var competitionPlayoffsRoundDomain = require( "./competitionPlayoffsRoundDomain" );
var robin = require( "roundrobin" );
var lodash = require( "lodash" );
var underscore = require( "underscore" );


exports.getCompetitionById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de competición inválido" };
	return ( await competitionDatabase.getCompetitionById( id ) );
};


exports.getCompetitionByName = async ( name ) => {
	if ( !name ) return [];
	return ( await competitionDatabase.getCompetitionByName( name ) );
}


exports.getCompetitionListByName = async ( name ) => {
	if ( !name ) throw { code: 422, message: "Nombre de competición inválido" };
	return ( await competitionDatabase.getCompetitionListByName( name ) );
}


exports.createCompetition = async ( competition ) => {
	( await exports.competitionParametersValidator( competition ) );
	
	let existingCompetition = ( await exports.getCompetitionByName( competition.name ) );
	if ( existingCompetition ) {
		throw { code: 422, message: "El nombre de competición ya está en uso" };
	}
	
	( await exports.getTeamObjectArray( competition ) );
	
	let createdCompetition = ( await competitionDatabase.createCompetition( competition ) );
	
	( await exports.createStatsObjects( createdCompetition ) );
	( await exports.generateCompetitionSchedule( createdCompetition ) );
	
	return createdCompetition;
};


exports.getTeamObjectArray = async ( competition ) => {
	let teamIDsCopy = lodash.cloneDeep( competition.teams );
	competition.teams = [];
	
	for ( let teamID of teamIDsCopy ) {
		let existingTeam = ( await teamDomain.getTeamById( teamID ) );
		if ( existingTeam ) {
			if ( !existingTeam.players || !existingTeam.players.length ) throw {
				code: 422,
				message: "Está intentando añadir un equipo sin jugadores. Imposible procesar la operación"
			};
			if ( competition.minPlayerNumberPerTeam > existingTeam.players.length ) throw { code: 422, message: "Número de jugadores de equipo inválido" };
			competition.teams.push( existingTeam );
		} else {
			throw { code: 422, message: "El equipo especificado no existe en el sistema" };
		}
	}
};


exports.createStatsObjects = async ( competition ) => {
	for ( let team of competition.teams ) {
		if ( !competition.leagueFixturesVsSameTeam && competition.playoffsFixturesVsSameTeam ) {
			let newCompetitionTeamStats = ( await competitionTeamStatsDomain.createCompetitionTeamStats( competition._id, team._id ) )
		}
		for ( let player of team.players ) {
			let newCompetitionPlayerStats = ( await competitionPlayerStatsDomain.createCompetitionPlayerStats( competition._id, team._id, player._id ) );
		}
	}
};


exports.competitionParametersValidator = async ( competition ) => {
	if ( !competition.name ) throw { code: 422, message: "Nombre de competición inválido" };
	if ( !competition.organizer ) throw { code: 422, message: "Organizador de competición inválido" };
	if ( !competition.season ) throw { code: 422, message: "Temporada de competición inválido" };
	if ( !competition.minTeamNumber ) throw { code: 422, message: "Número mínimo de equipos de competición inválido" };
	if ( competition.minTeamNumber > competition.teams.length ) throw { code: 422, message: "Número de equipos de competición inválido" };
	if ( !competition.minPlayerNumberPerTeam ) throw { code: 422, message: "Número mínimo de jugadores por equipo de competición inválido" };
	if ( !competition.leagueFixturesVsSameTeam && !competition.playoffsFixturesVsSameTeam ) throw { code: 422, message: "Formato de competición inválido" };
	if ( !domainTools.isPositiveInteger( competition.leagueFixturesVsSameTeam ) && !domainTools.isPositiveInteger( competition.playoffsFixturesVsSameTeam ) )
		throw { code: 422, message: "Formato de competición inválido" };
	if ( competition.playoffsFixturesVsSameTeam && !domainTools.isOdd( competition.playoffsFixturesVsSameTeam ) )
		throw { code: 422, message: "El número de partidos de playoffs por ronda debe ser impar" };
	if ( await domainTools.hasArrayDuplicatedElements( competition.teams ) ) throw { code: 422, message: "Lista de equipos de competición inválida, equipo duplicado" };
};


exports.hasTeamPlayedAnyCompetition = async ( teamID ) => {
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	let existingTeam = ( await teamDomain.getTeamById( teamID ) );
	if ( !existingTeam ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	let playedCompetitions = ( await competitionDatabase.getCompetitionPlayedByTeam( existingTeam._id ) );
	return playedCompetitions;
};


exports.generateCompetitionSchedule = async ( competition ) => {
	if ( !competition ) throw { code: 422, message: "Objecto competición dañado" };
	
	// let canInitializeCompetition = ( await exports.canInitializeCompetition( existingCompetition ) );
	
	let teamsInCompetition = lodash.cloneDeep( competition.teams );
	let randomizeTeams = ( await domainTools.randomizeArray( teamsInCompetition ) );
	let randomizeTeamsIDs = randomizeTeams.map( function ( team ) {
		return team._id;
	} );
	
	if ( competition.leagueFixturesVsSameTeam && domainTools.isPositiveInteger( competition.leagueFixturesVsSameTeam ) ) {
		let fixtures = ( await exports.generateLeagueFixtures( competition, randomizeTeamsIDs ) );
		let games = ( await exports.parseFixturesToGames( fixtures, competition._id ) );
		// return games;
	} else if ( domainTools.isPositiveInteger( competition.playoffsFixturesVsSameTeam ) ) {
		let rounds = ( await exports.generatePlayoffsRoundsWithoutLeague( competition, randomizeTeamsIDs ) );
		// return rounds;
	}
	
};
//
//
// exports.canInitializeCompetition = async ( competition ) => {
// 	if ( !competition ) throw { code: 422, message: "Invalid competition" };
// 	if ( competition.inProgress ) throw { code: 422, message: "Competition has already started" };
// 	return true;
// };
//
//
exports.generateLeagueFixtures = async ( competition, randomizeTeamsIDs ) => {
	if ( !competition ) throw { code: 422, message: "Invalid competition" };
	
	
	if ( !competition.leagueFixturesVsSameTeam ) {
		throw { code: 422, message: "Invalid competition format. Needed league rounds." };
	} else {
		let oddRoundFixtures = robin( randomizeTeamsIDs.length, randomizeTeamsIDs );
		for ( let i = 1; i < oddRoundFixtures.length; i += 2 ) {
			for ( let j = 0; j < oddRoundFixtures[ i ].length; j += 1 ) {
				let aux = oddRoundFixtures[ i ][ j ][ 0 ];
				oddRoundFixtures[ i ][ j ][ 0 ] = oddRoundFixtures[ i ][ j ][ 1 ];
				oddRoundFixtures[ i ][ j ][ 1 ] = aux;
			}
		}
		
		let allRoundFixtures = [];
		allRoundFixtures.push( oddRoundFixtures );
		
		if ( competition.leagueFixturesVsSameTeam > 1 ) {
			let evenRoundFixtures = ( await exports.generateFixturesChangingLocalVisitor( oddRoundFixtures ) );
			for ( let roundIndex = 2; roundIndex <= competition.leagueFixturesVsSameTeam; roundIndex += 1 ) {
				if ( roundIndex % 2 )
					allRoundFixtures.push( oddRoundFixtures );
				else
					allRoundFixtures.push( evenRoundFixtures );
			}
		}
		return allRoundFixtures;
	}
};


exports.generateFixturesChangingLocalVisitor = async ( fixturesArray ) => {
	let changedFixtures = lodash.cloneDeep( fixturesArray );
	
	for ( let i in changedFixtures ) {
		for ( let j in changedFixtures[ i ] ) {
			[ changedFixtures[ i ][ j ][ 0 ], changedFixtures[ i ][ j ][ 1 ] ] = [ changedFixtures[ i ][ j ][ 1 ], changedFixtures[ i ][ j ][ 0 ] ];
		}
	}
	return changedFixtures;
};


exports.parseFixturesToGames = async ( fixturesMatrix, competitionID ) => {
	let allGames = [];
	for ( let roundIndex = 0; roundIndex < fixturesMatrix.length; roundIndex += 1 ) {
		for ( let fixtureIndex = 0; fixtureIndex < fixturesMatrix[ roundIndex ].length; fixtureIndex += 1 ) {
			for ( let gameIndex = 0; gameIndex < fixturesMatrix[ roundIndex ][ fixtureIndex ].length; gameIndex += 1 ) {
				let game = {
					competitionID: competitionID,
					winner: null,
					loser: null,
					localTeamInfo: {
						_id: fixturesMatrix[ roundIndex ][ fixtureIndex ][ gameIndex ][ 0 ],
						playerStats: null,
						quarterStats: null
					},
					visitorTeamInfo: {
						_id: fixturesMatrix[ roundIndex ][ fixtureIndex ][ gameIndex ][ 1 ],
						playerStats: null,
						quarterStats: null
					},
					fixture: ( roundIndex * fixturesMatrix[ roundIndex ].length ) + ( fixtureIndex + 1 ),
					round: roundIndex + 1,
				};
				allGames.push( ( await gameDomain.createGame( game ) ) );
			}
		}
	}
	
	return allGames;
};


exports.generatePlayoffsRoundsWithoutLeague = async ( competition, randomizeTeamsIDs ) => {
	if ( !competition ) throw { code: 422, message: "Invalid competition" };
	
	if ( !competition.playoffsFixturesVsSameTeam ) {
		throw { code: 422, message: "Invalid competition format. Needed playoffs rounds." };
	} else {
		let treeStats = ( await exports.calculateTournamentTreeStats( competition ) );
		
		let roundMatchups = [];
		let allMatchups = [];
		let currentStackTeams = randomizeTeamsIDs.map( id => {
			return { _id: id, type: "TEAM" }
		} );
		
		for ( let i = 1; i <= treeStats.nRoundLevels; ++i ) {
			for ( let j = 0; j < treeStats.nMatchupsPerRound[ i ]; ++j ) {
				let localTeam = ( await domainTools.getRandomElementFromArray( currentStackTeams ) );
				let visitorTeam = ( await domainTools.getRandomElementFromArray( currentStackTeams ) );
				
				let newPlayoffMatchup = {
					localTeamID: ( localTeam.type == "TEAM" ) ? localTeam._id : null,
					visitorTeamID: ( visitorTeam.type == "TEAM" ) ? visitorTeam._id : null,
					competitionID: competition._id,
					round: 2 ** ( treeStats.nRoundLevels - i ),
					nextRound: null,
					prevRoundLocalID: ( localTeam.type == "MATCHUP" ) ? localTeam._id : null,
					prevRoundVisitorID: ( visitorTeam.type == "MATCHUP" ) ? visitorTeam._id : null,
					winnerID: null
				};
				let createdPlayoffsRound = ( await competitionPlayoffsRoundDomain.createPlayoffsRound( newPlayoffMatchup ) );
				
				if ( createdPlayoffsRound.prevRoundLocalID || createdPlayoffsRound.prevRoundVisitorID ) {
					let editedRound;
					if ( createdPlayoffsRound.prevRoundLocalID ) {
						editedRound = ( await competitionPlayoffsRoundDomain.setNextRound( createdPlayoffsRound.prevRoundLocalID, createdPlayoffsRound._id ) );
					} else if ( createdPlayoffsRound.prevRoundVisitorID ) {
						editedRound = ( await competitionPlayoffsRoundDomain.setNextRound( createdPlayoffsRound.prevRoundVisitorID, createdPlayoffsRound._id ) );
					}
					let index = allMatchups.findIndex( round => round._id.toString() === editedRound._id.toString() );
					allMatchups[ index ] = editedRound;
				}
				
				roundMatchups.push( { _id: createdPlayoffsRound._id, type: "MATCHUP" } );
				allMatchups.push( createdPlayoffsRound );
			}
			currentStackTeams = [ ...currentStackTeams, ...roundMatchups ];
			roundMatchups = [];
		}
		competition[ 'games' ] = ( await exports.parsePlayoffsRoundToGames( competition._id, 2 ** ( treeStats.nRoundLevels - 1 ) ) );
		competition[ 'playoffsRounds' ] = allMatchups;
		return allMatchups;
	}
	
};


exports.parsePlayoffsRoundToGames = async ( competitionID, round ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !round ) throw { code: 422, message: "Ronda inválida" };
	let competition = ( await competitionDatabase.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	
	let playoffsRounds = ( await competitionPlayoffsRoundDomain.getPlayoffsRoundsByCompetitionAndRound( competitionID, round ) );
	if ( !playoffsRounds || !playoffsRounds.length ) throw { code: 422, message: "Las rondas de playoffs especificadas no se encuentran en el sistema" };
	
	let allRoundGames = [];
	for ( let round of playoffsRounds ) {
		for ( let index of underscore.range( 1, competition.playoffsFixturesVsSameTeam + 1 ) ) {
			let game = {
				competitionID: competition._id,
				winner: null,
				loser: null,
				localTeamInfo: {
					_id: ( index % 2 ) ? round.localTeamID : round.visitorTeamID,
					playerStats: null,
					quarterStats: null
				},
				visitorTeamInfo: {
					_id: ( index % 2 ) ? round.visitorTeamID : round.localTeamID,
					playerStats: null,
					quarterStats: null
				},
				fixture: index,
				round: round._id,
			};
			let createdGame = ( await gameDomain.createGame( game ) );
			allRoundGames.push( createdGame );
		}
	}
	return allRoundGames;
};


exports.calculateTournamentTreeStats = async ( competition ) => {
	if ( !competition ) throw { code: 422, message: "Invalid competition" };
	
	let result = {};
	result.nTeams = competition.teams.length;
	result.nMatchups = result.nTeams - 1;
	result.nRoundLevels = Math.ceil( Math.log( result.nTeams ) / Math.log( 2 ) );
	
	result.nMatchupsPerRound = {};
	let matchupCount = 0;
	
	for ( let i = result.nRoundLevels; i > 1; --i ) {
		result.nMatchupsPerRound[ i ] = 2 ** ( result.nRoundLevels - i );
		matchupCount += result.nMatchupsPerRound[ i ];
	}
	result.nMatchupsPerRound[ 1 ] = result.nMatchups - matchupCount;
	
	return result;
};


exports.getCompetitionLeagueTable = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = ( await competitionTeamStatsDomain.getCompetitionTeamStatsByCompetition( competitionID ) );
	if ( result ) result.sort( function ( a, b ) {
		if ( a.stats.wonGames < b.stats.wonGames ) return 1;
		if ( a.stats.wonGames > b.stats.wonGames ) return -1;
		return 0;
	} );
	return result;
};


exports.getPlayerCompetitions = async ( playerID ) => {
	if ( !playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	let result = ( await competitionDatabase.getPlayerCompetitions( playerID ) );
	return result;
};


exports.getGamesByCompetitionAndFixture = async ( competitionID, fixtureNumber ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !fixtureNumber ) throw { code: 422, message: "Número de jornada inválido" };
	let result = ( await gameDomain.getGamesByCompetitionAndFixture( competitionID, fixtureNumber ) );
	return result;
};


exports.getCurrentFixture = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = ( await gameDomain.getCurrentFixture( competitionID ) );
	return result;
};


exports.getAllAvailablePlayoffsRoundsByCompetition = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	let competition = ( await competitionDatabase.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	let result = ( await competitionPlayoffsRoundDomain.getAllAvailablePlayoffsRoundsByCompetition( competitionID ) );
	
	result = lodash.groupBy( result, "round" );
	for ( let roundIndex in result ) {
		let playoffsRounds = result[ roundIndex ];
		for ( let playoffsRoundIndex = 0; playoffsRoundIndex < playoffsRounds.length; playoffsRoundIndex += 1 ) {
			let round = playoffsRounds[ playoffsRoundIndex ];
			round.localTeam = competition.teams.find( team => team._id.toString() === round.localTeamID.toString() );
			round.visitorTeam = competition.teams.find( team => team._id.toString() === round.visitorTeamID.toString() );
			for ( let gameIndex = 0; gameIndex < round.games.length; gameIndex += 1 ) {
				let game = round.games[ gameIndex ];
				round.games[ gameIndex ].localTeamInfo.team = competition.teams.find( team => team._id.toString() === game.localTeamInfo._id.toString() );
				round.games[ gameIndex ].visitorTeamInfo.team = competition.teams.find( team => team._id.toString() === game.visitorTeamInfo._id.toString() );
			}
		}
	}
	return result;
};


exports.getCompetitionTeamStatsByCompetitionAndTeam = async ( competitionID, teamID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	let competition = ( await competitionDatabase.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	let team = ( await teamDomain.getTeamById( teamID ) );
	if ( !team ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	
	return ( await competitionTeamStatsDomain.getCompetitionTeamStatsByCompetitionAndTeam( competitionID, teamID ) );
};


exports.getCompetitionPlayerStatsByCompetitionTeamAndPlayer = async ( competitionID, teamID, playerID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	if ( !playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	let competition = ( await competitionDatabase.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	let team = ( await teamDomain.getTeamById( teamID ) );
	if ( !team ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	let player = ( await playerDomain.getPlayerById( playerID ) );
	if ( !player ) throw { code: 422, message: "El jugador especificado no se encuentra en el sistema" };
	
	return ( await competitionPlayerStatsDomain.getCompetitionPlayerStatsByCompetitionTeamAndPlayer( competitionID, teamID, playerID ) );
};


exports.getNextTeamGamesInCompetition = async ( competitionID, teamID ) => {
	return ( gameDomain.getNextTeamGamesInCompetition( competitionID, teamID ) );
};


exports.getPrevTeamGamesInCompetition = async ( competitionID, teamID ) => {
	return ( gameDomain.getPrevTeamGamesInCompetition( competitionID, teamID ) );
};


exports.updateGameTimeAndLocation = async ( competitionID, gameID, param ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	if ( !param || !param.location || !param.time ) throw { code: 422, message: "Fecha y localización del partido incorrectas" };
	
	let competition = ( await competitionDatabase.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	let existingGame = ( await gameDomain.getGameById( gameID ) );
	if ( !existingGame ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
	
	existingGame.location = param.location;
	existingGame.time = param.time;
	delete existingGame._id;
	
	return ( await gameDomain.updateGame( gameID, existingGame ) );
}
//
//
// exports.deleteCompetitionSchedule = async ( competitionID ) => {
// 	if ( !competitionID ) throw { code: 422, message: "Invalid competition id" };
//
// 	let existingCompetition = ( await competitionDatabase.getCompetitionById( competitionID ) );
// 	if ( !existingCompetition ) {
// 		throw { code: 422, message: "Specified competition is not in system" };
// 	}
//
// 	return ( await gameDomain.deleteCompetitionSchedule( competitionID ) );
// };
//
//
