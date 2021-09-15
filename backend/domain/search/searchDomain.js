var domainTools = require( "../domainTools" );
var competitionDomain = require( "../competition/competitionDomain" );
var teamDomain = require( "../team/teamDomain" );
var playerDomain = require( "../player/playerDomain" );


exports.searchCompetitionTeamOrPlayer = async ( query ) => {
	if ( query ) {
		let competitions = ( await competitionDomain.getCompetitionListByName( query ) ).map( item => {
			return {
				_id: item._id,
				name: item.name,
				type: "COMPETITION"
			}
		});
		let teams = ( await teamDomain.getTeamListByName( query ) ).map( item => {
			return {
				_id: item._id,
				name: item.name,
				type: "TEAM"
			}
		});
		let players = ( await playerDomain.getPlayerByNameOrSurname( query ) ).map( item => {
			return {
				_id: item._id,
				name: item.fullname,
				type: "PLAYER"
			}
		});;
		let result = competitions.concat( teams ).concat( players );
		result.sort( function ( a, b ) {
			if ( a.name < b.name ) return -1;
			if ( a.name > b.name ) return 1;
			return 0;
		} );
		if (result.length > 10) result = result.slice(0,10);
		return result;
	}
};
