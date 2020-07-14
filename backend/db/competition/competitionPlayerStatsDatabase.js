var dbModule = require( '../db' );
let db = dbModule.getDb();
let competitionPlayerStatsCursor = db.collection( 'comp_player_stats' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getCompetitionPlayerStatsById = async ( competitionPlayerStatsID ) => {
	if ( !ObjectID.isValid( competitionPlayerStatsID ) ) throw { code: 422, message: "Identificador de estadísticas de jugador inválido" };
	let result = ( await competitionPlayerStatsCursor.findOne( { _id: ObjectID( competitionPlayerStatsID.toString() ) } ) );
	return result;
};


exports.createCompetitionPlayerStats = async ( competitionPlayerStats ) => {
	let result = ( await competitionPlayerStatsCursor.insertOne( competitionPlayerStats ) );
	return result.ops[ 0 ];
};


exports.updateCompetitionPlayerStats = async ( id, competitionPlayerStats ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de estadísticas de jugador inválido" };
	let result = ( await competitionPlayerStatsCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: competitionPlayerStats }, { returnOriginal: false } ) );
	return result.value;
};


exports.purgeCompetitionPlayerStats = async ( competitionPlayerStatsID ) => {
	if ( !ObjectID.isValid( competitionPlayerStatsID ) ) throw { code: 422, message: "Identificador de estadísticas de jugador inválido" };
	let result = ( await competitionPlayerStatsCursor.deleteOne( { _id: ObjectID( competitionPlayerStatsID.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

exports.getCompetitionPlayerStatsByPlayerId = async ( playerID ) => {
	if ( !ObjectID.isValid( playerID ) ) throw { code: 422, message: "Identificador de estadísticas de jugador inválido" };
	let result = ( await dbModule.findResultToArray( competitionPlayerStatsCursor, { playerID: ObjectID( playerID.toString() ) } ) );
	return result;
}
