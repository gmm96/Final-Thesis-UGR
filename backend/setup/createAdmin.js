var dbModule = require( '../db/db' );
var adminDomain = require( '../domain/admin/adminDomain' );

dbModule.createDBConnection().then( async () => {
	try {
		let arguments = process.argv.slice(2);
		
		if (!Array.isArray(arguments) || arguments.length < 4) {
			console.error("Error: número inválido de parámetros. " +
						"Debe ejecutar este script con los argumentos nombre, apellido, email y contraseñá en ese orden." +
						"\nEjemplo de uso: node createAdmin.js name surname email password")
			return;
		}
		
		let admin = {
			name: arguments[0],
			surname: arguments[1],
			email: arguments[2],
			password: arguments[3]
		};
		await adminDomain.createAdmin(admin)
		console.log("Administrador con email " + admin.email + " creado correctamente")
	} catch ( e ) {
		console.error("Error creando administrador: ", e)
	} finally {
		process.exit()
	}
});
