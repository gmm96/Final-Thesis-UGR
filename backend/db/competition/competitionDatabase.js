var dbModule = require( '../db' );

let db = dbModule.getDb();
let competitionCursor = db.collection( 'competition' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getCompetitionById = async ( id ) => {
	let result = ( await competitionCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.getAllCompetitions = async () => {
	let result = await new Promise( async ( resolve, reject ) => {
		( await competitionCursor.find( {} ).toArray( async ( err, item ) => {
			if ( err ) reject( err );
			resolve( item );
		} ) )
	} );
	return result;
};

exports.createCompetition = async ( competition ) => {
	let result = ( await competitionCursor.insertOne( competition ) );
	return result.ops[ 0 ];
};

exports.updateCompetition = async ( id, competition ) => {
	let result = ( await competitionCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: competition }, { returnOriginal: false } ) );
	return result.value;
};

exports.deleteCompetition = async ( id ) => {
	let result = ( await competitionCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

