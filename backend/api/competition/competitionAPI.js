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
			leagueFixturesVsSameTeam: req.body.leagueFixturesVsSameTeam,
			playoffsFixturesVsSameTeam: req.body.playoffsFixturesVsSameTeam
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
			playoffsFixturesVsSameTeam: req.body.playoffsFixturesVsSameTeam
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
