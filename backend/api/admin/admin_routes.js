var admin = require( './admin' )

exports.assignRoutes = function ( app ) {
	app.get( '/admin', admin.getAdmins );
	app.post( '/admin', admin.addAdmin );
	app.put( '/admin/:adminID', admin.updateAdmin );
	app.delete( '/admin/:adminID', admin.deleteAdmin );
}
