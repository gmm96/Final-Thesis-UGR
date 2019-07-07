var admin = require( './admin' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/admin', passport.authenticate( 'jwt' ), admin.getAdmins );
	app.post( '/login', passport.authenticate( 'local' ), admin.login );
	app.post( '/admin', admin.addAdmin );
	app.put( '/admin/:id', admin.updateAdmin );
	app.delete( '/admin/:email', admin.deleteAdmin );
}
