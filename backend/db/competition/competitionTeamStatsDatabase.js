var dbModule = require( '../db' );
let db = dbModule.getDb();
let competitionTeamStatsCursor = db.collection( 'comp_team_stats' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getCompetitionTeamStatsById = async ( competitionTeamStatsID ) => {
	if ( !ObjectID.isValid( competitionTeamStatsID ) ) throw { code: 422, message: "Identificador de estadísticas de equipo inválido" };
	let result = ( await competitionTeamStatsCursor.findOne( { _id: ObjectID( competitionTeamStatsID.toString() ) } ) );
	return result;
};


exports.getCompetitionTeamStatsByCompetition = async (competitionID) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = (await dbModule.findResultToArray(competitionTeamStatsCursor, {competitionID: ObjectID( competitionID.toString() ) }));
	return result;
};


exports.createCompetitionTeamStats = async ( competitionTeamStats ) => {
	let result = ( await competitionTeamStatsCursor.insertOne( competitionTeamStats ) );
	return result.ops[ 0 ];
};


exports.updateCompetitionTeamStats = async ( id, competitionTeamStats ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de estadísticas de equipo inválido" };
	let result = ( await competitionTeamStatsCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: competitionTeamStats }, { returnOriginal: false } ) );
	return result.value;
};


exports.purgeCompetitionTeamStats = async ( competitionTeamStatsID ) => {
	if ( !ObjectID.isValid( competitionTeamStatsID ) ) throw { code: 422, message: "Identificador de estadísticas de equipo inválido" };
	let result = ( await competitionTeamStatsCursor.deleteOne( { _id: ObjectID( competitionTeamStatsID.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};
