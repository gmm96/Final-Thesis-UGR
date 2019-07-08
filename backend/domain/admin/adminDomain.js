var domainTools = require( "../domainTools" );
var adminDatabase = require( '../../db/admin/adminDatabase' );
var bcrypt = require( 'bcrypt' );
var emailValidator = require( 'email-validator' );

exports.createAdmin = async ( admin ) => {
	// 1. verificar que todos los datos vienen bien
	console.log( admin.email );
	if ( !admin.email ) {
	} else if ( !emailValidator.validate( admin.email ) ) {
	}
	
	console.log( admin.password );
	if ( !admin.password ) {
	} else if ( admin.password.length < 8 || admin.password.length > 16 ) {
	} else {
		admin.password = domainTools.encryptPassword( admin.password );
	}
	
	console.log( admin.name );
	if ( !admin.name ) {
	}
	
	// 2. buscar un usuario con el mismo email
	let existingAdmin = await adminDatabase.getAdminByEmail( admin.email );
	console.log( 'finding admin', existingAdmin )
	
	// 2.1 Si existe un usuario, lanzar exception
	if ( existingAdmin ) {
		throw { code: 422, message: "Admin email is not allowed" };
	}
	
	// 3. Lllamar a create admin en db
	return await adminDatabase.createAdmin( admin );
};

exports.getAdminByEmailAndPassword = async ( email, password ) => {
	let admin = await adminDatabase.getAdminByEmail( email );
	if ( !admin ) {
		return null;
	}
	if ( admin.password !== password ) {
		console.log( admin.password, password );
		return null;
	}
	return admin;
};
