var domainTools = require( "../domainTools" );
var competitionEventDatabase = require( '../../db/competition/competitionEventDatabase' );
var gameDomain = require( "./competitionGameDomain" );
var lodash = require( "lodash" )


exports.getCompetitionEventById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de evento inválido" };
	return ( await competitionEventDatabase.getCompetitionEventById( id ) );
};


exports.getCompetitionEventListByGameId = async ( competitionID, gameID ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	return ( await competitionEventDatabase.getCompetitionEventListByGameId( competitionID, gameID ) );
};


exports.createCompetitionEvent = async ( event ) => {
	( await exports.competitionEventParametersValidator( event ) );
	let game = ( await gameDomain.getGameById( event.gameID ) );
	if ( !game ) throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	
	event.createdAt = new Date().toISOString();
	event.updatedAt = new Date().toISOString();
	
	if ( await gameDomain.isGameStarted( game ) ) {
		switch ( event.type ) {
			case exports.CompetitionEventTypes.timeOut:
				( await exports.callForTimeout( event, game ) );
				break;
			case exports.CompetitionEventTypes.basket:
				( await exports.logBasket( event, game ) );
				break;
			case exports.CompetitionEventTypes.freeThrow:
				( await exports.logFreeThrow( event, game ) );
				break;
			case exports.CompetitionEventTypes.foul:
				( await exports.logFoul( event, game ) );
				break;
			case exports.CompetitionEventTypes.endQuarter:
				( await exports.advanceNextQuarter( event, game ) );
				break;
		}
	}
	
	let createdEvent = ( await competitionEventDatabase.createCompetitionEvent( event ) );
	if ( createdEvent.type === exports.CompetitionEventTypes.endQuarter &&
		( !( await gameDomain.canIFinishGame( event.competitionID, event.gameID ) ) || createdEvent.quarter < 4 ) ) {
		( await competitionEventDatabase.createCompetitionEvent( {
			competitionID: event.competitionID,
			gameID: event.gameID,
			type: exports.CompetitionEventTypes.startQuarter,
			quarter: createdEvent.quarter + 1,
			minute: ( ( createdEvent.quarter + 1 ) < 5 ) ? ( createdEvent.quarter + 1 - 1 ) * 10 + 1 : 40 + 1 + ( createdEvent.quarter + 1 - 1 - 4 ) * 5
		} ) );
	} else if ( createdEvent.type === exports.CompetitionEventTypes.endQuarter && createdEvent.quarter >= 4 && ( await gameDomain.canIFinishGame( event.competitionID, event.gameID ) ) ) {
		( await competitionEventDatabase.createCompetitionEvent( {
			competitionID: event.competitionID,
			gameID: event.gameID,
			type: exports.CompetitionEventTypes.endGame,
			quarter: createdEvent.quarter,
			minute: createdEvent.minute
		} ) );
	}
	return createdEvent;
};


exports.callForTimeout = async ( event, game ) => {
	if ( !event.teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( gameCopy.localTeamInfo._id.toString() === event.teamID.toString() ) {
		if ( gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].timeoutsRemaining ) {
			gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].timeoutsRemaining -= 1;
		} else {
			throw { code: 422, message: "Error, el equipo solicitante no tiene tiempos muertos restantes" };
		}
	} else {
		if ( gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].timeoutsRemaining ) {
			gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].timeoutsRemaining -= 1;
		} else {
			throw { code: 422, message: "Error, el equipo solicitante no tiene tiempos muertos restantes" };
		}
	}
	await gameDomain.updateGame( game._id, gameCopy );
}


exports.logBasket = async ( event, game ) => {
	if ( !event.teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	if ( !event.playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( gameCopy.localTeamInfo._id.toString() === event.teamID.toString() ) {
		gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].points += event.data;
		let playerIndex = gameCopy.localTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		gameCopy.localTeamInfo.playerStats[ playerIndex ].points += event.data;
	} else {
		gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].points += event.data;
		let playerIndex = gameCopy.visitorTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		gameCopy.visitorTeamInfo.playerStats[ playerIndex ].points += event.data;
	}
	
	await gameDomain.updateGame( game._id, gameCopy );
};


exports.logFreeThrow = async ( event, game ) => {
	if ( !event.teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	if ( !event.playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( event.data ) {
		if ( gameCopy.localTeamInfo._id.toString() === event.teamID.toString() ) {
			gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].points += 1;
			let playerIndex = gameCopy.localTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
			gameCopy.localTeamInfo.playerStats[ playerIndex ].points += 1;
		} else {
			gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].points += 1;
			let playerIndex = gameCopy.visitorTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
			gameCopy.visitorTeamInfo.playerStats[ playerIndex ].points += 1;
		}
		
		await gameDomain.updateGame( game._id, gameCopy );
	}
};


exports.logFoul = async ( event, game ) => {
	if ( !event.teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	if ( !event.playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( gameCopy.localTeamInfo._id.toString() === event.teamID.toString() ) {
		let playerIndex = gameCopy.localTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		gameCopy.localTeamInfo.playerStats[ playerIndex ].fouls.push( event.data );
		if ( event.data !== "A" ) gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].fouls += 1;
	} else {
		let playerIndex = gameCopy.visitorTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		gameCopy.visitorTeamInfo.playerStats[ playerIndex ].fouls.push( event.data );
		if ( event.data !== "A" ) gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].fouls += 1;
	}
	
	await gameDomain.updateGame( game._id, gameCopy );
};


exports.advanceNextQuarter = async ( event, game ) => {
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	let quarter = event.quarter;
	event.minute = event.quarter * 10;
	
	if ( !( await gameDomain.canIFinishGame( game.competitionID, game._id ) ) ) {
		let timeoutsRemaining = gameCopy.localTeamInfo.quarterStats[ quarter - 1 ].timeoutsRemaining;
		if ( quarter === 2 ) {
			timeoutsRemaining = 3;
		} else if ( quarter >= 4 ) {
			timeoutsRemaining = 1;
		}
		gameCopy.localTeamInfo.quarterStats.push( {
			points: 0,
			fouls: ( quarter >= 4 ) ? gameCopy.localTeamInfo.quarterStats[ quarter - 1 ].fouls : 0,
			quarter: quarter + 1,
			timeoutsRemaining: timeoutsRemaining
		} );
		
		timeoutsRemaining = gameCopy.visitorTeamInfo.quarterStats[ quarter - 1 ].timeoutsRemaining;
		if ( quarter === 2 ) {
			timeoutsRemaining = 3;
		} else if ( quarter >= 4 ) {
			timeoutsRemaining = 1;
		}
		gameCopy.visitorTeamInfo.quarterStats.push( {
			points: 0,
			fouls: ( quarter >= 4 ) ? gameCopy.visitorTeamInfo.quarterStats[ quarter - 1 ].fouls : 0,
			quarter: quarter + 1,
			timeoutsRemaining: timeoutsRemaining
		} );
		
		( await gameDomain.updateGame( game._id, gameCopy ) );
	} else {
		( await gameDomain.getTeamScore( game.localTeamInfo ) );
		( await gameDomain.getTeamScore( game.visitorTeamInfo ) );
		gameCopy.winner = ( game.localTeamInfo.points > game.visitorTeamInfo.points ) ? game.localTeamInfo._id : game.visitorTeamInfo._id;
		gameCopy.loser = ( game.localTeamInfo.points > game.visitorTeamInfo.points ) ? game.visitorTeamInfo._id : game.localTeamInfo._id;
		( await gameDomain.updateGame( game._id, gameCopy ) );
		( await gameDomain.finishGame( game.competitionID, game._id ) );
	}
};

exports.updateCompetitionEvent = async ( id, event ) => {
	if ( !id ) throw { code: 422, message: "Identificador de evento inválido" };
	
	let existingEvent = ( await competitionEventDatabase.getCompetitionEventById( id ) );
	if ( !existingEvent ) throw { code: 422, message: "El evento especificado no se encuentra en el sistema" };
	
	return ( await competitionEventDatabase.updateCompetitionEvent( id, event ) );
};


exports.purgeCompetitionEvent = async ( competitionEventID ) => {
	if ( !competitionEventID ) throw { code: 422, message: "Identificador de evento inválido" };
	let event = ( await competitionEventDatabase.getCompetitionEventById( competitionEventID ) );
	if ( !event ) throw { code: 422, message: "El evento especificado no se encuentran en el sistema" };
	let game = ( await gameDomain.getGameById( event.gameID ) );
	if ( !game ) throw { code: 422, message: "El partido especificado no se encuentra en el sistema" };
	
	if ( event.type === exports.CompetitionEventTypes.basket || event.type === exports.CompetitionEventTypes.freeThrow ||
		event.type === exports.CompetitionEventTypes.foul || event.type === exports.CompetitionEventTypes.timeOut ) {
		switch ( event.type ) {
			case exports.CompetitionEventTypes.basket:
				( await exports.removeBasketEvent( event, game ) );
				break;
			case exports.CompetitionEventTypes.freeThrow:
				( await exports.removeFreeThrowEvent( event, game ) );
				break;
			case exports.CompetitionEventTypes.timeOut:
				( await exports.removeTimeoutEvent( event, game ) );
				break;
			case exports.CompetitionEventTypes.foul:
				( await exports.removeFoulEvent( event, game ) );
				break;
		}
	} else {
		throw { code: 422, message: "El tipo de evento especificado no se puede borrar del sistema" };
	}
	
	
	return ( await competitionEventDatabase.purgeCompetitionEvent( competitionEventID ) );
};


exports.removeBasketEvent = async ( event, game ) => {
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( game.localTeamInfo._id.toString() === event.teamID.toString() ) {
		gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].points -= event.data;
		let playerIndex = gameCopy.localTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		gameCopy.localTeamInfo.playerStats[ playerIndex ].points -= event.data;
	} else {
		gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].points -= event.data;
		let playerIndex = gameCopy.visitorTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		gameCopy.visitorTeamInfo.playerStats[ playerIndex ].points -= event.data;
	}
	await gameDomain.updateGame( game._id, gameCopy );
};


exports.removeFreeThrowEvent = async ( event, game ) => {
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( event.data ) {
		if ( gameCopy.localTeamInfo._id.toString() === event.teamID.toString() ) {
			gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].points -= 1;
			let playerIndex = gameCopy.localTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
			gameCopy.localTeamInfo.playerStats[ playerIndex ].points -= 1;
		} else {
			gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].points -= 1;
			let playerIndex = gameCopy.visitorTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
			gameCopy.visitorTeamInfo.playerStats[ playerIndex ].points -= 1;
		}
		await gameDomain.updateGame( game._id, gameCopy );
	}
};


exports.removeTimeoutEvent = async ( event, game ) => {
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( gameCopy.localTeamInfo._id.toString() === event.teamID.toString() ) {
		gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].timeoutsRemaining += 1;
	} else {
		gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].timeoutsRemaining += 1;
	}
	await gameDomain.updateGame( game._id, gameCopy );
};


exports.removeFoulEvent = async ( event, game ) => {
	let gameCopy = lodash.cloneDeep( game );
	delete gameCopy._id;
	
	if ( gameCopy.localTeamInfo._id.toString() === event.teamID.toString() ) {
		let playerIndex = gameCopy.localTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		let foulIndex = gameCopy.localTeamInfo.playerStats[ playerIndex ].fouls.length - 1 - gameCopy.localTeamInfo.playerStats[ playerIndex ].fouls.slice().reverse().findIndex( foul => foul === event.data );
		gameCopy.localTeamInfo.playerStats[ playerIndex ].fouls.splice( foulIndex, 1 );
		if ( event.data !== "A" ) gameCopy.localTeamInfo.quarterStats[ event.quarter - 1 ].fouls -= 1;
	} else {
		let playerIndex = gameCopy.visitorTeamInfo.playerStats.findIndex( playerSt => playerSt.playerID.toString() === event.playerID.toString() );
		let foulIndex = gameCopy.visitorTeamInfo.playerStats[ playerIndex ].fouls.length - 1 - gameCopy.visitorTeamInfo.playerStats[ playerIndex ].fouls.slice().reverse().findIndex( foul => foul === event.data );
		gameCopy.visitorTeamInfo.playerStats[ playerIndex ].fouls.splice( foulIndex, 1 );
		if ( event.data !== "A" ) gameCopy.visitorTeamInfo.quarterStats[ event.quarter - 1 ].fouls -= 1;
	}
	await gameDomain.updateGame( game._id, gameCopy );
};


exports.competitionEventParametersValidator = async ( event ) => {
	if ( !event.competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !event.gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	if ( !event.quarter ) throw { code: 422, message: "Cuarto de evento inválido" };
	if ( !event.minute && event.type !== "endQuarter" ) throw { code: 422, message: "Minuto de evento inválido" };
	if ( !event.type || !Object.values( exports.CompetitionEventTypes ).includes( event.type ) ) throw { code: 422, message: "Tipo de evento inválido" };
}


exports.CompetitionEventTypes = {
	startGame: 'startGame',
	startQuarter: 'startQuarter',
	timeOut: 'timeOut',
	basket: 'basket',
	freeThrow: 'freeThrow',
	foul: 'foul',
	endQuarter: 'endQuarter',
	endGame: 'endGame'
}
