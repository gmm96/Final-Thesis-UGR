var domainTools = require( "../domainTools" );
var competitionEventDatabase = require( '../../db/competition/competitionEventDatabase' );


exports.getCompetitionEventById = async ( id ) => {
	if ( !id ) throw { code: 422, message: "Identificador de evento inválido" };
	return ( await competitionEventDatabase.getCompetitionEventById( id ) );
};


exports.createCompetitionEvent = async ( event ) => {
	( await exports.competitionEventParametersValidator( event ) );
	
	// Sumar estadisticas
	
	return ( await competitionEventDatabase.createCompetitionEvent( event ) );
};


exports.updateCompetitionEvent = async ( id, event ) => {
	if ( !id ) throw { code: 422, message: "Identificador de evento inválido" };
	
	let existingEvent = ( await competitionEventDatabase.getCompetitionEventById( id ) );
	if ( !existingEvent ) throw { code: 422, message: "El evento especificado no se encuentra en el sistema" };
	
	return ( await competitionEventDatabase.updateCompetitionEvent( id, event ) );
};


exports.purgeCompetitionEvent = async ( competitionEventID ) => {
	if ( !competitionEventID ) throw { code: 422, message: "Identificador de evento inválido" };
	
	let existingEvent = ( await competitionEventDatabase.getCompetitionEventById( competitionEventID ) );
	if ( !existingEvent ) {
		throw { code: 422, message: "El evento especificado no se encuentran en el sistema" };
	}
	
	return ( await competitionEventDatabase.purgeCompetitionEvent( competitionEventID ) );
};


exports.competitionEventParametersValidator = async ( event ) => {
	if ( !event.competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !event.gameID ) throw { code: 422, message: "Identificador de partido inválido" };
	if ( !event.teamID ) throw { code: 422, message: "Identificador de equipo inválido" };
	if ( !event.playerID ) throw { code: 422, message: "Identificador de jugador inválido" };
	if ( !event.quarter ) throw { code: 422, message: "Cuarto de evento inválido" };
	if ( !event.minute ) throw { code: 422, message: "Minuto de evento inválido" };
	if ( !event.type || !Object.values( exports.competitionEventTypes ).includes( event.type ) ) throw { code: 422, message: "Tipo de evento inválido" };
}


exports.competitionEventTypes = {
	foul: 'foul',
	basket: 'basket',
	freeThrow: 'freeThrow',
	timeOut: 'timeOut',
	startGame: 'startGame',
	endQuarter: 'endQuarter',
	endGame: 'endGame'
}
