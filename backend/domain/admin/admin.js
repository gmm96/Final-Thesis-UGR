var adminDBCollection = require( '../../db/admin/admin' );
var bcrypt = require( 'bcrypt' );
var emailValidator = require('email-validator');

exports.createAdmin = async ( admin ) => {
	
	// 1. verificar que todos los datos vienen bien
	// 2. buscar un usuario con el mismo email
	// 2.1 Si existe un usuario, lanzar exception
	// 3. Lllamar a create admin en db
		
		// throw {code: 422, message: ""}
};

exports.getAdminByEmailAndPassword = async ( email, password ) => {
	console.log(email, password);
	let admin = await adminDBCollection.getAdmin(email);
	if (!admin) {
		return null;
	}
	console.log(admin)
	if (admin.password !== password) {
		console.log(admin.password, password);
		console.log(1);
		return null;
	}
	console.log(2);
	return admin;
}
