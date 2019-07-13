var apiTools = require( "../apiTools" );
var playerDomain = require( "../../domain/player/playerDomain" );


exports.getAllPlayers = async ( req, res ) => {
	try {
		let result = ( await playerDomain.getAllPlayers() );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.createPlayer = async ( req, res ) => {
	try {
		let newPlayer = {
			name: req.body.name,
			surname: req.body.surname,
			nationalIdentityCard: req.body.nationalIdentityCard,
			passport: req.body.passport,
			federatedNumber: req.body.federatedNumber,
			birthDate: req.body.birthDate,
			birthPlace: req.body.birthPlace,
			nationality: req.body.nationality
		};
		let result = ( await playerDomain.createPlayer( newPlayer ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.updatePlayer = async ( req, res ) => {
	try {
		let updatedPlayer = {
			name: req.body.name,
			surname: req.body.surname,
			federatedNumber: req.body.federatedNumber,
			birthDate: req.body.birthDate,
			birthPlace: req.body.birthPlace,
			nationality: req.body.nationality
		};
		let result = ( await playerDomain.updatePlayer( req.params._id, updatedPlayer ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.deletePlayer = async ( req, res ) => {
	try {
		let result = ( await playerDomain.deletePlayer( req.params._id ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};
