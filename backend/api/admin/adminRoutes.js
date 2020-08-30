var admin = require( './adminAPI' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/admin', passport.authenticate( 'jwt' ), function ( req, res, next ) {
		res.send( req.user );
	} );
	app.post( '/login', passport.authenticate( 'local' ), admin.login );
}
