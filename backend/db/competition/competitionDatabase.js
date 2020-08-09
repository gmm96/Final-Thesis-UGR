var dbModule = require( '../db' );

let db = dbModule.getDb();
let competitionCursor = db.collection( 'competition' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getCompetitionById = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 404, message: "Identificador de competición inválido" };
	let result = ( await competitionCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.getCompetitionByName = async ( name ) => {
	let result = ( await competitionCursor.findOne( { name: name } ) );
	return result;
}


exports.getCompetitionListByName = async ( name ) => {
	let result = ( await dbModule.findResultToArray( competitionCursor, { "name": dbModule.createRegexForCaseInsTextQuery( name ) } ) );
	return result;
}


exports.getCompetitionPlayedByTeam = async ( teamID ) => {
	if ( !ObjectID.isValid( teamID ) ) throw { code: 404, message: "Identificador de equipo inválido" };
	let result = ( await dbModule.findResultToArray( competitionCursor, { teams: { $elemMatch: { _id: ObjectID( teamID.toString() ) } } } ) )
	return result;
};


exports.getPlayerCompetitions = async ( playerID ) => {
	if ( !ObjectID.isValid( playerID ) ) throw { code: 404, message: "Identificador de jugador inválido" };
	let result = ( await dbModule.findResultToArray( competitionCursor, { "teams.players": { $elemMatch: { _id: ObjectID( playerID ) } } } ) );
	return result;
};

exports.createCompetition = async ( competition ) => {
	let result = ( await competitionCursor.insertOne( competition ) );
	return result.ops[ 0 ];
};


exports.updateCompetition = async ( id, competition ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = ( await competitionCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: competition }, { returnOriginal: false } ) );
	return result.value;
};
