var domainTools = require( "../domainTools" );
var adminDatabase = require( '../../db/admin/adminDatabase' );
var bcrypt = require( 'bcrypt' );
var emailValidator = require( 'email-validator' );


exports.createAdmin = async ( admin ) => {
	if ( !admin.name ) throw { code: 422, message: "Invalid admin name" };
	if ( !admin.surname ) throw { code: 422, message: "Invalid admin surname" };
	if ( !admin.email || !emailValidator.validate( admin.email ) ) throw { code: 422, message: "Invalid admin email" };
	if ( !admin.password ) throw { code: 422, message: "Invalid password" };
	
	admin.password = ( await domainTools.encryptPassword( admin.password ) );
	
	let existingAdmin = ( await adminDatabase.getAdminByEmail( admin.email ) );
	if ( existingAdmin ) {
		throw { code: 422, message: "Email is already in use" };
	}
	
	return ( await adminDatabase.createAdmin( admin ) );
};


exports.getAdminByEmailAndPassword = async ( email, password ) => {
	let admin = await adminDatabase.getAdminByEmail( email );
	if ( !admin ) {
		return null;
	}
	if ( !domainTools.comparePasswords(password, admin.password) ) {
		console.log( admin.password, password );
		return null;
	}
	return admin;
};
