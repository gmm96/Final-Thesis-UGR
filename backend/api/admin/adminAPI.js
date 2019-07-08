var apiTools = require( "../apiTools" );
var adminDomain = require( "../../domain/admin/adminDomain" );
var adminCollection = require( "../../db/admin/adminDatabase" );
var jwt = require( "jsonwebtoken" );


exports.createAdmin = async ( req, res ) => {
	try {
		let newAdmin = {
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password
		};
		let result = await adminDomain.createAdmin( newAdmin );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
}

exports.updateAdmin = async ( req, res ) => {
	try {
		let updatedAdmin = {
			_id: req.body._id,
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password
		};
		let result = await adminDomain.updateAdmin( updatedAdmin );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
}

exports.deleteAdmin = async ( req, res ) => {
	// let email = req.params.email;
	console.log( req.params.email );
	let result = await adminCollection.deleteAdmin( req.params.email );
	0
	res.send( result );
}


exports.login = async ( req, res ) => {
	let user = req.user;
	delete user.password;
	let token = jwt.sign( user, 'secret', { expiresIn: 3600 } );
	
	res.json( { token: 'bearer ' + token } );
}
