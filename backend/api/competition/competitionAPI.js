var apiTools = require( "../apiTools" );
var competitionDomain = require( "../../domain/competition/competitionDomain" );


exports.getCompetitionByID = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getCompetitionById( req.params.competitionID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getCompetitionLeagueTable = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getCompetitionLeagueTable( req.params.competitionID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getGamesByCompetitionAndFixture = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getGamesByCompetitionAndFixture( req.params.competitionID, parseInt( req.params.fixtureNumber ) ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getCurrentFixture = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getCurrentFixture( req.params.competitionID ) );
		res.send( JSON.stringify( result ) );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getAllAvailablePlayoffsRoundsByCompetition = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getAllAvailablePlayoffsRoundsByCompetition( req.params.competitionID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getCompetitionTeamStatsByCompetitionAndTeam = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getCompetitionTeamStatsByCompetitionAndTeam( req.params.competitionID, req.params.teamID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getCompetitionPlayerStatsByCompetitionTeamAndPlayer = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getCompetitionPlayerStatsByCompetitionTeamAndPlayer( req.params.competitionID, req.params.teamID, req.params.playerID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getNextTeamGamesInCompetition = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getNextTeamGamesInCompetition( req.params.competitionID, req.params.teamID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getPrevTeamGamesInCompetition = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getPrevTeamGamesInCompetition( req.params.competitionID, req.params.teamID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getCompetitionListByName = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getCompetitionListByName( req.query.q ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getUnplayedGamesByCompetitionForScheduling = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getUnplayedGamesByCompetitionForScheduling( req.params.competitionID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.createCompetition = async ( req, res ) => {
	try {
		let newCompetition = {
			name: req.body.name,
			organizer: req.body.organizer,
			season: parseInt( req.body.season ),
			class: req.body.class,
			sex: req.body.sex,
			minTeamNumber: parseInt( req.body.minTeamNumber ),
			minPlayerNumberPerTeam: parseInt( req.body.minPlayerNumberPerTeam ),
			leagueFixturesVsSameTeam: parseInt( req.body.leagueFixturesVsSameTeam ),
			playoffsFixturesVsSameTeam: parseInt( req.body.playoffsFixturesVsSameTeam ),
			inProgress: true,
			teams: req.body.teams,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};
		let result = ( await competitionDomain.createCompetition( newCompetition ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.updateCompetition = async ( req, res ) => {
	// try {
	// 	let updatedCompetition = {
	// 		name: req.body.name,
	// 		organizer: req.body.organizer,
	// 		season: req.body.season,
	// 		minTeamNumber: req.body.minTeamNumber,
	// 		minPlayerNumberPerTeam: req.body.minPlayerNumberPerTeam,
	// 		leagueFixturesVsSameTeam: req.body.leagueFixturesVsSameTeam,
	// 		playoffsFixturesVsSameTeam: req.body.playoffsFixturesVsSameTeam,
	// 		inProgress: req.body.inProgress,
	// 		teams: req.body.teams,
	// 		updatedAt: new Date()
	// 	};
	// 	let result = ( await competitionDomain.updateCompetition( req.params.competitionID, updatedCompetition ) );
	// 	res.send( result );
	// } catch ( e ) {
	// 	apiTools.manageError( req, res, e );
	// }
};


exports.updateGameTimeAndLocation = async ( req, res ) => {
	try {
		let newParameters = {
			time: req.body.time,
			location: req.body.location,
		};
		let result = ( await competitionDomain.updateGameTimeAndLocation( req.params.competitionID, req.params.gameID, newParameters ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
	
};


exports.purgeCompetition = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.purgeCompetition( req.params.competitionID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

// exports.generateCompetitionSchedule = async ( req, res ) => {
// 	try {
// 		let result = ( await competitionDomain.generateCompetitionSchedule( req.params.competitionID ) );
// 		res.send( result );
// 	} catch ( e ) {
// 		apiTools.manageError( req, res, e );
// 	}
// };
//
//
// exports.deleteCompetitionSchedule = async ( req, res ) => {
// 	try {
// 		let result = ( await competitionDomain.deleteCompetitionSchedule( req.params.competitionID ) );
// 		res.send( result );
// 	} catch ( e ) {
// 		apiTools.manageError( req, res, e );
// 	}
// };
