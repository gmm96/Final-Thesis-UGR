var apiTools = require( "../apiTools" );
var teamDomain = require( "../../domain/team/teamDomain" );


exports.getAllTeams = async ( req, res ) => {
	try {
		let result = ( await teamDomain.getAllTeams() );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.addTeamToCompetition = async ( req, res ) => {
	try {
		let newTeam = {
			name: req.body.name,
			location: req.body.location,
			federatedNumber: req.body.federatedNumber,
			competitions: [],
			createdAt: new Date(),
			updatedAt: new Date()
		};
		let players = req.body.players;
		let result = ( await teamDomain.addTeamToCompetition( req.params.competitionID, newTeam, players ) );
		// let result = ( await competitionDomain.addNewTeamToCompetition( req.params.competitionID, newTeam, players ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.updateTeam = async ( req, res ) => {
	try {
		let updatedTeam = {
			name: req.body.name,
			city: req.body.city,
			federatedNumber: req.body.federatedNumber,
			players: [],
			staff: [],
			updatedAt: new Date()
		};
		let result = ( await teamDomain.updateTeam( req.params.teamID, updatedTeam ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.purgeTeam = async ( req, res ) => {
	try {
		let result = ( await teamDomain.purgeTeam( req.params.teamID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};
