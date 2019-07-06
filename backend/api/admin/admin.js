var MongoClient = require( 'mongodb' ).MongoClient;
var dbModule = require( '../../db/db' );
var adminCollection = require( '../../db/admin/admin' )


exports.getAdmins = async ( req, res ) => {
	var dbo = dbModule.getDb();
	dbo.collection( "admins" ).findOne( {}, function ( err, result ) {
		if ( err ) throw err;
		console.log( result.name );
		res.send( result );
	} );
}

exports.addAdmin = async ( req, res ) => {
	let newAdmin = {
		name: req.body.name,
		surname: req.body.surname,
		username: req.body.username,
		password: req.body.password,
		email: req.body.email
	};
	let result = ( await adminCollection.createAdmin( newAdmin ) );
	res.send( result );
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
