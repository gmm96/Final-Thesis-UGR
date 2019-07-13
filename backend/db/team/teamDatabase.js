var dbModule = require( '../db' );

let db = dbModule.getDb();
let teamCursor = db.collection( 'team' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getTeamById = async ( id ) => {
	let result = ( await teamCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.getAllTeams = async () => {
	let result = ( await dbModule.findResultToArray( teamCursor, {} ) );
	return result;
};

exports.createTeam = async ( team ) => {
	let result = ( await teamCursor.insertOne( team ) );
	return result.ops[ 0 ];
};

exports.updateTeam = async ( id, team ) => {
	let result = ( await teamCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: team }, { returnOriginal: false } ) );
	return result.value;
};

exports.deleteTeam = async ( id ) => {
	let result = ( await teamCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

