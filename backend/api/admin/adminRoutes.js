var admin = require( './adminAPI' );
var permissions = require( '../permissions' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/admin', passport.authenticate( 'jwt' ), permissions.validatePermissionByRole( permissions.ROLES.SUPER_ADMIN ), function ( req, res, next ) {
		res.send( { message: "working" } );
	} );
	app.post( '/login', passport.authenticate( 'local' ), admin.login );
	app.get( '/admins', admin.getAllAdmins );
	app.post( '/admins', admin.createAdmin );
	app.put( '/admins/:_id', admin.updateAdmin );
	app.put( '/admins/:_id/password', admin.updateAdminPassword );
	app.delete( '/admins/:_id', admin.deleteAdmin );
}
