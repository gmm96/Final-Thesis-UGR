var dbModule = require( '../db' );
let db = dbModule.getDb();
let competitionEventCursor = db.collection( 'comp_event' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getCompetitionEventById = async ( eventID ) => {
	if ( !ObjectID.isValid( eventID ) ) throw { code: 422, message: "Identificador de evento inválido" };
	let result = ( await competitionEventCursor.findOne( { _id: ObjectID( eventID.toString() ) } ) );
	return result;
};


exports.getCompetitionEventListByGameId = async ( competitionID, gameID ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !ObjectID.isValid( gameID ) ) throw { code: 422, message: "Identificador de partido inválido" };
	let result = ( await dbModule.findResultToArray( competitionEventCursor, {
		competitionID: ObjectID( competitionID.toString() ),
		gameID: ObjectID( gameID.toString() )
	} ) );
	return result;
};


exports.createCompetitionEvent = async ( event ) => {
	event.competitionID = ObjectID(event.competitionID.toString());
	event.gameID = ObjectID(event.gameID.toString());
	if (event.teamID) event.teamID = ObjectID(event.teamID.toString());
	if (event.playerID) event.playerID = ObjectID(event.playerID.toString());
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
