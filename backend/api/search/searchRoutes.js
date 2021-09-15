var search = require( './searchAPI' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/search', search.searchForResults );
}
