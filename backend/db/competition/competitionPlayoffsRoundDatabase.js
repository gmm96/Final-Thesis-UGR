var dbModule = require( '../db' );
let db = dbModule.getDb();
let playoffsCursor = db.collection( 'comp_playoff_round' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getPlayoffsRoundById = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	let result = ( await playoffsCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.getPlayoffsRoundsByCompetitionAndRound = async ( competitionID, round ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = ( await dbModule.findResultToArray( playoffsCursor, { competitionID: ObjectID( competitionID.toString() ), round: round } ) );
	return result;
};

exports.createPlayoffsRound = async ( playoffsRound ) => {
	let result = ( await playoffsCursor.insertOne( playoffsRound ) );
	return result.ops[ 0 ];
};

exports.updatePlayoffsRound = async ( id, playoffsRound ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	let result = ( await playoffsCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: playoffsRound }, { returnOriginal: false } ) );
	return result.value;
};

exports.purgePlayoffsRound = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de ronda de playoffs inválido" };
	let result = ( await playoffsCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};
