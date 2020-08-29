var domainTools = require( "../domainTools" );
var competitionDomain = require( "./competitionDomain" );
var teamDomain = require( "../team/teamDomain" );
var gameDomain = require( "./competitionGameDomain" );
var playoffsRoundDatabase = require( "../../db/competition/competitionPlayoffsRoundDatabase" );
var lodash = require( "lodash" );


exports.getPlayoffsRoundById = async ( playoffsRoundID ) => {
	if ( !playoffsRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	return ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRoundID ) );
};


exports.getFullPlayoffsRoundById = async ( playoffsRoundID ) => {
	if ( !playoffsRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	return ( await playoffsRoundDatabase.getFullPlayoffsRoundById( playoffsRoundID ) );
};


exports.getPlayoffsRoundsByCompetitionAndRound = async ( competitionID, roundNumber ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !roundNumber ) throw { code: 422, message: "Ronda inválido" };
	return ( await playoffsRoundDatabase.getPlayoffsRoundsByCompetitionAndRound( competitionID, roundNumber ) );
};


exports.getAllAvailablePlayoffsRoundsByCompetition = async ( competitionID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	
	return ( await playoffsRoundDatabase.getAllAvailablePlayoffsRoundsByCompetition( competitionID ) );
}


exports.checkIfEndPlayoffsRound = async ( playoffsRoundID, gamesToWin ) => {
	if ( !playoffsRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	
	let playoffsRound = ( await playoffsRoundDatabase.getFullPlayoffsRoundById( playoffsRoundID ) );
	let roundCopy = lodash.cloneDeep( playoffsRound );
	delete roundCopy.games;
	delete roundCopy._id;
	
	playoffsRound.localWins = playoffsRound.games.filter( game => {
		if ( game.winner ) return game.winner.toString() === playoffsRound.localTeamID.toString();
	} ).length;
	playoffsRound.visitorWins = playoffsRound.games.filter( game => {
		if ( game.winner ) return game.winner.toString() === playoffsRound.visitorTeamID.toString();
	} ).length;
	
	if ( playoffsRound.localWins >= gamesToWin ) {
		roundCopy.winnerID = playoffsRound.localTeamID;
		let gamesToRemove = playoffsRound.games.filter( game => game.winner == null );
		for ( let game of gamesToRemove ) {
			( await gameDomain.purgeGame( game._id ) );
		}
		if ( playoffsRound.nextRound ) {
			let nextRound = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRound.nextRound ) );
			if ( nextRound.prevRoundLocalID && playoffsRound._id.toString() === nextRound.prevRoundLocalID.toString() ) {
				nextRound.localTeamID = playoffsRound.localTeamID;
			} else if ( nextRound.prevRoundVisitorID && playoffsRound._id.toString() === nextRound.prevRoundVisitorID.toString() ) {
				nextRound.visitorTeamID = playoffsRound.localTeamID;
			}
			( await playoffsRoundDatabase.updatePlayoffsRound( nextRound._id, nextRound ) );
		} else {
			( await competitionDomain.setEndOfCompetition( playoffsRound.competitionID ) );
		}
		( await playoffsRoundDatabase.updatePlayoffsRound( playoffsRound._id, roundCopy ) );
	} else if ( playoffsRound.visitorWins >= gamesToWin ) {
		roundCopy.winnerID = playoffsRound.visitorTeamID;
		let gamesToRemove = playoffsRound.games.filter( game => game.winner == null );
		for ( let game of gamesToRemove ) {
			( await gameDomain.purgeGame( game._id ) );
		}
		if ( playoffsRound.nextRound ) {
			let nextRound = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRound.nextRound ) );
			if ( nextRound.prevRoundLocalID && playoffsRound._id.toString() === nextRound.prevRoundLocalID.toString() ) {
				nextRound.localTeamID = playoffsRound.visitorTeamID;
			} else if ( nextRound.prevRoundVisitorID && playoffsRound._id.toString() === nextRound.prevRoundVisitorID.toString() ) {
				nextRound.visitorTeamID = playoffsRound.visitorTeamID;
			}
			( await playoffsRoundDatabase.updatePlayoffsRound( nextRound._id, nextRound ) );
		} else {
			( await competitionDomain.setEndOfCompetition( playoffsRound.competitionID ) );
		}
		( await playoffsRoundDatabase.updatePlayoffsRound( playoffsRound._id, roundCopy ) );
	}
};


exports.setHomeCourtAdvantage = async ( competitionID, roundNumber ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !roundNumber ) throw { code: 422, message: "Ronda inválido" };
	
	let competition = ( await competitionDomain.getCompetitionById( competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	
	if ( competition.playoffsFixturesVsSameTeam && competition.playoffsTeamsAfterLeague ) {
		let orderedTeamsByStandings = ( await competitionDomain.getCompetitionLeagueTable( competitionID ) ).map( teamSt => {
			return teamSt.teamID;
		} );
		let playoffsRounds = ( await exports.getPlayoffsRoundsByCompetitionAndRound( competitionID, roundNumber ) );
		
		for ( let round of playoffsRounds ) {
			let localIndex = orderedTeamsByStandings.findIndex( teamID => teamID.toString() == round.localTeamID.toString() );
			let visitorIndex = orderedTeamsByStandings.findIndex( teamID => teamID.toString() == round.visitorTeamID.toString() );
			if ( visitorIndex < localIndex ) {
				let teamAux = round.localTeamID;
				let prevRoundAux = round.prevRoundLocalID;
				round.localTeamID = round.visitorTeamID;
				round.prevRoundLocalID = round.prevRoundVisitorID;
				round.visitorTeamID = teamAux;
				round.prevRoundVisitorID = prevRoundAux;
				( await exports.updatePlayoffsRound( round._id, round ) );
			}
		}
	}
};


exports.createPlayoffsRound = async ( playoffsRound ) => {
	( await exports.playoffsRoundParametersValidator( playoffsRound ) );
	( await exports.checkIfPlayoffRoundParametersExists( playoffsRound ) );
	playoffsRound["createdAt"] = new Date().toISOString();
	playoffsRound["updatedAt"] = new Date().toISOString();
	
	return ( await playoffsRoundDatabase.createPlayoffsRound( playoffsRound ) );
};


exports.updatePlayoffsRound = async ( playoffsRoundID, playoffsRound ) => {
	if ( !playoffsRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	( await exports.playoffsRoundParametersValidator( playoffsRound ) );
	( await exports.checkIfPlayoffRoundParametersExists( playoffsRound ) );
	
	let existingPlayoffsRound = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRoundID ) );
	if ( !existingPlayoffsRound ) throw { code: 422, message: "La ronda de playoffs especificada no se encuentra en el sistema" };
	
	playoffsRound["updatedAt"] = new Date().toISOString();
	return ( await playoffsRoundDatabase.updatePlayoffsRound( playoffsRoundID, playoffsRound ) );
};


exports.playoffsRoundParametersValidator = async ( playoffsRound ) => {
	if ( !playoffsRound.competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !playoffsRound.localTeamID && !playoffsRound.prevRoundLocalID ) throw { code: 422, message: "Equipo local inválido" };
	if ( !playoffsRound.visitorTeamID && !playoffsRound.prevRoundVisitorID ) throw { code: 422, message: "Equipo visitante inválido" };
	if ( playoffsRound.round <= 0 || !Number.isInteger( playoffsRound.round ) ) throw { code: 422, message: "Número de ronda de playoffs inválida" };
};


exports.checkIfPlayoffRoundParametersExists = async ( playoffsRound ) => {
	let competition = ( await competitionDomain.getCompetitionById( playoffsRound.competitionID ) );
	if ( !competition ) throw { code: 422, message: "La competición especificada no se encuentra en el sistema" };
	
	if ( playoffsRound.localTeamID ) {
		let localTeam = ( await teamDomain.getTeamById( playoffsRound.localTeamID ) );
		if ( !localTeam ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
		if ( !competition.teams.find( team => team._id.toString() == localTeam._id.toString() ) )
			throw { code: 422, message: "El equipo local especificado no se encuentra en la competición" };
	} else if ( playoffsRound.prevRoundLocalID ) {
		let prevRoundLocal = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRound.prevRoundLocalID ) );
		if ( !prevRoundLocal ) throw { code: 422, message: "La ronda de playoffs especificada no se encuentra en el sistema" };
	}
	
	if ( playoffsRound.visitorTeamID ) {
		let visitorTeam = ( await teamDomain.getTeamById( playoffsRound.visitorTeamID ) );
		if ( !visitorTeam ) throw { code: 422, message: "El equipo especificado no se encuentra en el sistema" };
		if ( !competition.teams.find( team => team._id.toString() == visitorTeam._id.toString() ) )
			throw { code: 422, message: "El equipo visitante especificado no se encuentra en la competición" };
	} else if ( playoffsRound.prevRoundVisitorID ) {
		let prevRoundVisitor = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRound.prevRoundVisitorID ) );
		if ( !prevRoundVisitor ) throw { code: 422, message: "La ronda de playoffs especificada no se encuentra en el sistema" };
	}
	
	if ( playoffsRound.nextRound ) {
		let nextRound = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRound.nextRound ) );
		if ( !nextRound ) throw { code: 422, message: "La ronda de playoffs especificada no se encuentra en el sistema" };
	}
	
	if ( playoffsRound.winnerID ) {
		if ( playoffsRound.winnerID.toString() !== playoffsRound.localTeamID.toString() || playoffsRound.winnerID.toString() !== playoffsRound.visitorTeamID.toString() ) {
			throw { code: 422, message: "El equipo ganador de la ronda de playoffs no corresponde con ninguno de los contrincantes" };
		}
	}
};


exports.setNextRound = async ( playoffsRoundID, nextRoundID ) => {
	if ( !playoffsRoundID || !nextRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	let prevRound = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRoundID ) );
	delete prevRound._id;
	prevRound.nextRound = nextRoundID;
	let editedPrevRound = ( await playoffsRoundDatabase.updatePlayoffsRound( playoffsRoundID, prevRound ) );
	return editedPrevRound;
}
