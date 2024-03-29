const routes = [
	"./api/admin/adminRoutes",
	"./api/competition/competitionRoutes",
	"./api/search/searchRoutes",
	"./api/player/playerRoutes",
	"./api/team/teamRoutes"
];

exports.assignRoutes = async ( app ) => {
	for ( let route of routes ) {
		let routesToAssign = require( route );
		routesToAssign.assignRoutes( app );
	}
};
