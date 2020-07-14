var dbModule = require( '../db' );

let db = dbModule.getDb();
let gameCursor = db.collection( 'comp_game' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getGameById = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid game id" };
	let result = ( await gameCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.createGame = async ( game ) => {
	let result = ( await gameCursor.insertOne( game ) );
	return result.ops[ 0 ];
};

exports.updateGame = async ( id, game ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid game id" };
	let result = ( await gameCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: game }, { returnOriginal: false } ) );
	return result.value;
};

exports.purgeGame = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid game id" };
	let result = ( await gameCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

exports.deleteGamesByCompetition = async ( competitionID ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Invalid competition id" };
	let result = ( await gameCursor.deleteMany( { competitionID: ObjectID( competitionID.toString() ) } ) );
	return ( !!result.result.n && !!result.result.ok );
};
