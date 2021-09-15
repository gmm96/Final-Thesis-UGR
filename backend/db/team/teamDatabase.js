var dbModule = require( '../db' );

let db = dbModule.getDb();
let teamCursor = db.collection( 'team' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getTeamById = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 404, message: "Identificador de equipo inválido" };
	let result = ( await teamCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};


exports.getTeamByName = async ( name ) => {
	let result = ( await teamCursor.findOne( { name: name } ) );
	return result;
}


exports.getTeamListByName = async ( name ) => {
	let result = ( await dbModule.findResultToArray( teamCursor, { "name": dbModule.createRegexForCaseInsTextQuery( name ) } ) );
	return result;
}


exports.getPlayerTeam = async ( playerID ) => {
	if ( !ObjectID.isValid( playerID ) ) throw { code: 404, message: "Identificador de jugador inválido" };
	let result = ( await teamCursor.findOne( { players: { $elemMatch: { _id: ObjectID( playerID.toString() ) } } } ) );
	return result;
}


exports.getPlayersWithTeam = async () => {
	let result = ( await teamCursor.aggregate( [
		{ $unwind: "$players" },
		{ $group: { _id: 1, players: { $addToSet: "$players" } } },
		{ $project: { players: 1, _id: 0 } }
	] ).toArray() );
	if ( result && result[0] && result[0].players && result[0].players.length ) {
		return result[0].players;
	} else {
		return [];
	}
}


exports.createTeam = async ( team ) => {
	let result = ( await teamCursor.insertOne( team ) );
	return result.ops[ 0 ];
};

exports.updateTeam = async ( id, team ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de equipo inválido" };
	let result = ( await teamCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: team }, { returnOriginal: false } ) );
	return result.value;
};

exports.purgeTeam = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de equipo inválido" };
	let result = ( await teamCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};
