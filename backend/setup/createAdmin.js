var dbModule = require( '../db/db' );

dbModule.createDBConnection().then( async () => {
	
	try {
		var adminDomain = require( '../domain/admin/adminDomain' );
		
		let arguments = process.argv.slice(2);
		
		if (!Array.isArray(arguments) || arguments.length < 4) {
			console.log("run this script with name surname email and password arguments in that order")
			return;
		}
		
		await adminDomain.createAdmin({
			name: arguments[0],
			surname: arguments[1],
			email: arguments[2],
			password: arguments[3]
		})
		console.log("Admin created successfully")
	} catch ( e ) {
		console.error("Error creating admin: ", e)
	} finally {
		process.exit()
	}
	
});
