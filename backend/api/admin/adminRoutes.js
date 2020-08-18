var admin = require( './adminAPI' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/admin', passport.authenticate( 'jwt' ), function ( req, res, next ) {
		res.send( req.user );
	} );
	app.post( '/login', passport.authenticate( 'local' ), admin.login );
	app.get( '/admins', admin.getAllAdmins );
	app.post( '/admins', admin.createAdmin );
	app.put( '/admins/:_id', admin.updateAdmin );
	app.put( '/admins/:_id/password', admin.updateAdminPassword );
	app.delete( '/admins/:_id', admin.deleteAdmin );
}
