var apiTools = require( "../apiTools" );
var competitionDomain = require( "../../domain/competition/competitionDomain" );


exports.getAllCompetitions = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.getAllCompetitions() );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.createCompetition = async ( req, res ) => {
	try {
		let newCompetition = {
			name: req.body.name,
			description: req.body.description,
			regulation: req.body.regulation,
			lineUpPlayerNumber: req.body.lineUpPlayerNumber,
			maxPlayerNumber: req.body.maxPlayerNumber,
			leagueFixturesVsSameTeam: req.body.leagueFixturesVsSameTeam,
			playoffsFixturesVsSameTeam: req.body.playoffsFixturesVsSameTeam,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		let result = ( await competitionDomain.createCompetition( newCompetition ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.updateCompetition = async ( req, res ) => {
	try {
		let updatedCompetition = {
			name: req.body.name,
			description: req.body.description,
			regulation: req.body.regulation,
			leagueFixturesVsSameTeam: req.body.leagueFixturesVsSameTeam,
			playoffsFixturesVsSameTeam: req.body.playoffsFixturesVsSameTeam,
			updatedAt: new Date()
		};
		let result = ( await competitionDomain.updateCompetition( req.params._id, updatedCompetition ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.deleteCompetition = async ( req, res ) => {
	try {
		let result = ( await competitionDomain.deleteCompetition( req.params._id ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.addNewPlayerToTeam = async ( req, res ) => {
	try {
		let newPlayer = {
			name: req.body.name,
			surname: req.body.surname,
			nationalIdentityCard: req.body.nationalIdentityCard,
			passport: req.body.passport,
			federatedNumber: req.body.federatedNumber,
			birthDate: req.body.birthDate,
			birthPlace: req.body.birthPlace,
			nationality: req.body.nationality,
			competitions: [ { teamID: req.params.teamID, competitionID: req.params.competitionID } ],
			createdAt: new Date(),
			updatedAt: new Date()
		};
		let result = ( await competitionDomain.addNewPlayerToTeam( newPlayer ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

