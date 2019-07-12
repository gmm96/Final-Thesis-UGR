var apiTools = require( "../apiTools" );
var adminDomain = require( "../../domain/admin/adminDomain" );
var jwt = require( "jsonwebtoken" );


exports.getAllAdmins = async ( req, res ) => {
	try {
		let result = ( await adminDomain.getAllAdmins() );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.createAdmin = async ( req, res ) => {
	try {
		let newAdmin = {
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password
		};
		let result = ( await adminDomain.createAdmin( newAdmin ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.updateAdmin = async ( req, res ) => {
	try {
		let updatedAdmin = {
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
		};
		let result = ( await adminDomain.updateAdmin( req.params._id, updatedAdmin ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};

exports.updateAdminPassword = async ( req, res ) => {
	try {
		let result = ( await adminDomain.updateAdminPassword( req.params._id, req.body.password ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.deleteAdmin = async ( req, res ) => {
	try {
		let result = ( await adminDomain.deleteAdmin( req.params._id ) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};


exports.login = async ( req, res ) => {
	let user = req.user;
	delete user.password;
	let token = jwt.sign( user, 'secret', { expiresIn: 3600 } );
	
	res.json( { token: 'bearer ' + token } );
};
