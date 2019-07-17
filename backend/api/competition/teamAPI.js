var apiTools = require( "../apiTools" );
var teamDomain = require( "../../domain/competition/teamDomain" );


exports.getAllTeams = async ( req, res ) => {
	try {
		let result = ( await teamDomain.getAllTeams() );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.createTeam = async ( req, res ) => {
	try {
		let newTeam = {
			name: req.body.name,
			city: req.body.city,
			federatedNumber: req.body.federatedNumber,
			players: [],
			staff: [],
			createdAt: new Date(),
			updatedAt: new Date()
		};
		let result = ( await teamDomain.createTeam( newTeam ) );
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
		let result = ( await teamDomain.updateTeam( req.params._id, updatedTeam ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.deleteTeam = async ( req, res ) => {
	try {
		let result = ( await teamDomain.deleteTeam( req.params._id ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};
