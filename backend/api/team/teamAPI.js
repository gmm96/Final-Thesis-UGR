var apiTools = require( "../apiTools" );
var teamDomain = require( "../../domain/team/teamDomain" );
var formidable = require( 'formidable' );


exports.getTeamById = async ( req, res ) => {
	try {
		let result = ( await teamDomain.getTeamById( req.params.teamID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getTeamArrayByName = async ( req, res ) => {
	try {
		let result = ( await teamDomain.getTeamListByName( req.query.q ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.getTeamCompetitions = async ( req, res ) => {
	try {
		let result = ( await teamDomain.getTeamCompetitions( req.params.teamID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};



exports.createTeam = async ( req, res ) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse( req, async function ( err, fields, files ) {
			if ( err ) throw err;
			
			try {
				let newTeam = {
					name: fields.name,
					city: fields.city,
					address: fields.address,
					localJersey: fields.localJersey,
					visitorJersey: fields.visitorJersey,
					players: JSON.parse( fields.players ),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString()
				};
				let result = ( await teamDomain.createTeam( newTeam, files.avatar ) );
				res.send( result );
			} catch ( e ) {
				apiTools.manageError( req, res, e );
			}
		} );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.updateTeam = async ( req, res ) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse( req, async function ( err, fields, files ) {
			if ( err ) throw err;
			
			try {
				let updatedTeam = {
					name: fields.name,
					city: fields.city,
					address: fields.address,
					localJersey: fields.localJersey,
					visitorJersey: fields.visitorJersey,
					players: JSON.parse( fields.players ),
					deleteAvatar: fields.deleteAvatar === "true",
					updatedAt: new Date().toISOString()
				};
				let result = ( await teamDomain.updateTeam( req.params.teamID, updatedTeam, files.avatar ) );
				res.send( result );
			} catch ( e ) {
				apiTools.manageError( req, res, e );
			}
		} );
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
