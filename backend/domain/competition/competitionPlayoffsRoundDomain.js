var domainTools = require( "../domainTools" );
var competitionDomain = require( "./competitionDomain" );
var teamDomain = require( "../team/teamDomain" );
var playoffsRoundDatabase = require( "../../db/competition/competitionPlayoffsRoundDatabase" );


exports.getPlayoffsRoundById = async ( playoffsRoundID ) => {
	if ( !playoffsRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	return ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRoundID ) );
};


exports.getPlayoffsRoundsByCompetitionAndRound = async ( competitionID, round ) => {
	if ( !competitionID ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !round ) throw { code: 422, message: "Ronda inválido" };
	
	return ( await playoffsRoundDatabase.getPlayoffsRoundsByCompetitionAndRound( competitionID, round ) );
};


exports.createPlayoffsRound = async ( playoffsRound ) => {
	( await exports.playoffsRoundParametersValidator( playoffsRound ) );
	( await exports.checkIfPlayoffRoundParametersExists( playoffsRound ) );
	
	return ( await playoffsRoundDatabase.createPlayoffsRound( playoffsRound ) );
};


exports.updatePlayoffsRound = async ( playoffsRoundID, playoffsRound ) => {
	if ( !playoffsRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	( await exports.playoffsRoundParametersValidator( playoffsRound ) );
	( await exports.checkIfPlayoffRoundParametersExists( playoffsRound ) );
	
	let existingPlayoffsRound = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRoundID ) );
	if ( !existingPlayoffsRound ) throw { code: 422, message: "La ronda de playoffs especificada no se encuentra en el sistema" };
	
	return ( await playoffsRoundDatabase.updatePlayoffsRound( playoffsRoundID, playoffsRound ) );
};


exports.purgePlayoffsRound = async ( playoffsRoundID ) => {
	if ( !playoffsRoundID ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	
	let existingPlayoffsRound = ( await playoffsRoundDatabase.getPlayoffsRoundById( playoffsRoundID ) );
	if ( !existingPlayoffsRound ) {
		throw { code: 422, message: "La ronda de playoffs especificada no se encuentra en el sistema" };
	}
	
	return ( await playoffsRoundDatabase.purgePlayoffsRound( playoffsRoundID ) );
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
