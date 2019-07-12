var competition = require( './competitionAPI' );
var permissions = require( '../permissions' );
var passport = require( 'passport' );


exports.assignRoutes = function ( app ) {
	app.get( '/competitions', competition.getAllCompetitions );
	app.post( '/competitions', competition.createCompetition );
	app.put( '/competitions/:_id', competition.updateCompetition );
	app.delete( '/competitions/:_id', competition.deleteCompetition );
}
