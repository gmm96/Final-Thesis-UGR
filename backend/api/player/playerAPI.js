var apiTools = require( "../apiTools" );
var playerDomain = require( "../../domain/player/playerDomain" );
var formidable = require( 'formidable' );


exports.getFullPlayerById = async ( req, res ) => {
	try {
		let result = ( await playerDomain.getFullPlayerById( req.params.playerID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.createPlayer = async ( req, res ) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse( req, async function ( err, fields, files ) {
			if ( err ) throw err;
			
			try {
				let newPlayer = {
					name: fields.name,
					surname: fields.surname,
					idCard: fields.idCard,
					birthDate: fields.birthDate,
					birthPlace: fields.birthPlace,
					weight: fields.weight,
					height: fields.height,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				let result = ( await playerDomain.createPlayer( newPlayer, files.avatar ) );
				res.send( result );
				
			} catch ( e ) {
				apiTools.manageError( req, res, e );
			}
		} );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.updatePlayer = async ( req, res ) => {
	try {
		let form = new formidable.IncomingForm();
		form.parse( req, async function ( err, fields, files ) {
			if ( err ) throw err;
			
			try {
				let updatedPlayer = {
					name: fields.name,
					surname: fields.surname,
					idCard: fields.idCard,
					birthDate: fields.birthDate,
					birthPlace: fields.birthPlace,
					weight: fields.weight,
					height: fields.height,
					deleteAvatar: fields.deleteAvatar,
					createdAt: new Date(),
					updatedAt: new Date()
				};
				let result = ( await playerDomain.updatePlayer( req.params.playerID, updatedPlayer, files.avatar) );
				res.send( result );
			} catch ( e ) {
				apiTools.manageError( req, res, e );
			}
		} );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.purgePlayer = async ( req, res ) => {
	try {
		let result = ( await playerDomain.purgePlayer( req.params.playerID ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};
