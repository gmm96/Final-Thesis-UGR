const routes = [
	"./api/admin/adminRoutes",
	"./api/competition/competitionRoutes",
	"./api/team/teamRoutes",
	"./api/player/playerRoutes"
];

exports.assignRoutes = async ( app ) => {
	for ( let route of routes ) {
		let routesToAssign = require( route );
		routesToAssign.assignRoutes( app );
	}
};
