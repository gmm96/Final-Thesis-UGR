var apiTools = require( "../apiTools" );
var searchDomain = require( "../../domain/search/searchDomain" );
var jwt = require( "jsonwebtoken" );


exports.searchForResults = async ( req, res ) => {
	try {
		let result = ( await searchDomain.searchCompetitionTeamOrPlayer(req.query.q) );
		res.send( result );
	} catch ( e ) {
		apiTools.manageError( req, res, e );
	}
};
