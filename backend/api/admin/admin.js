const apiTools = require( "../api_tools" );
var jwt = require( 'jsonwebtoken' );
var dbModule = require( '../../db/db' );

exports.getAdmins = async ( req, res ) => {
	res.send( req.user );
}

exports.addAdmin = async ( req, res ) => {
	try {
		let newAdmin = {
			name: req.body.name,
			surname: req.body.surname,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password
		};
		let result = ( await adminCollection.createAdmin( newAdmin ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
}

exports.updateAdmin = async ( req, res ) => {
	let newAdmin = {
		name: req.body.admin.name,
		surname: req.body.admin.surname,
		username: req.body.admin.username,
		password: req.body.admin.password,
		email: req.body.admin.email
	};
	let email = req.body.email;
	let result = ( await adminCollection.updateAdmin( email, newAdmin ) );
	res.send( result );
}

exports.deleteAdmin = async ( req, res ) => {
	// let email = req.params.email;
	console.log( req.params.email );
	let result = await adminCollection.deleteAdmin( req.params.email );
	
	// for ( var adminIndex in admins ) {
	// 	var admin = admins[ adminIndex ];
	//
	// 	if ( admin.id === adminID ) {
	// 		admins.splice( adminIndex, 1 );
	// 		break;
	// 	}
	// }
	res.send( result );
}


exports.login = async ( req, res ) => {
	let user = req.user;
	delete user.password;
	let token = jwt.sign( user, 'secret', { expiresIn: 3600 } );
	
	res.json( { token: 'bearer ' + token } );
}
