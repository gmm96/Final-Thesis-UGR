var dbModule = require( '../db' );

let db = dbModule.getDb();
let competitionCursor = db.collection( 'competition' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getCompetitionById = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid competition id" };
	let result = ( await competitionCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.getAllCompetitions = async () => {
	let result = ( await dbModule.findResultToArray( competitionCursor, {} ) );
	return result;
};

exports.createCompetition = async ( competition ) => {
	let result = ( await competitionCursor.insertOne( competition ) );
	return result.ops[ 0 ];
};

exports.updateCompetition = async ( id, competition ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid competition id" };
	let result = ( await competitionCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: competition }, { returnOriginal: false } ) );
	return result.value;
};

exports.deleteCompetition = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Invalid competition id" };
	let result = ( await competitionCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

