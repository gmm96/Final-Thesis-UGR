var search = require( './searchAPI' );
var permissions = require( '../permissions' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/search', search.searchForResults );
}
