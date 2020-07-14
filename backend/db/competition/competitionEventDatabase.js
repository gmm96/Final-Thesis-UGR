var dbModule = require( '../db' );
let db = dbModule.getDb();
let competitionEventCursor = db.collection( 'comp_event' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getCompetitionEventById = async ( eventID ) => {
	if ( !ObjectID.isValid( eventID ) ) throw { code: 422, message: "Identificador de evento inválido" };
	let result = ( await competitionEventCursor.findOne( { _id: ObjectID( eventID.toString() ) } ) );
	return result;
};


exports.createCompetitionEvent = async ( event ) => {
	let result = ( await competitionEventCursor.insertOne( event ) );
	return result.ops[ 0 ];
};


exports.updateCompetitionEvent = async ( id, event ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de evento inválido" };
	let result = ( await competitionEventCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: event }, { returnOriginal: false } ) );
	return result.value;
};


exports.purgeCompetitionEvent = async ( eventID ) => {
	if ( !ObjectID.isValid( eventID ) ) throw { code: 422, message: "Identificador de evento inválido" };
	let result = ( await competitionEventCursor.deleteOne( { _id: ObjectID( eventID.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};
