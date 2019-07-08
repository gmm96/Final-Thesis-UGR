var admin = require( './adminAPI' );
var permissions = require( '../permissions' )
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/admin', passport.authenticate( 'jwt' ), permissions.validatePermissionByRole( permissions.ROLES.SUPER_ADMIN ), function ( req, res, next ) {
		res.send( { message: "working" } );
	} );
	app.post( '/login', passport.authenticate( 'local' ), admin.login );
	app.post( '/admin', admin.createAdmin );
	app.put( '/admin/:_id', admin.updateAdmin );
	app.put( '/admin/:_id/password', admin.updateAdminPassword );
	app.delete( '/admin/:_id', admin.deleteAdmin );
}
