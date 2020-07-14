var dbModule = require( '../db' );

let db = dbModule.getDb();
let teamCursor = db.collection( 'team' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getTeamById = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de equipo inválido" };
	let result = ( await teamCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};


exports.getTeamByName = async ( name ) => {
	let result = ( await teamCursor.findOne( { name: name} ));
	return result;
}


exports.getTeamListByName = async ( name ) => {
	let result = ( await dbModule.findResultToArray( teamCursor, { "name": dbModule.createRegexForCaseInsTextQuery( name ) } ) );
	return result;
}


exports.getPlayerTeam = async ( playerID ) => {
	let result = ( await teamCursor.findOne( { players: { $elemMatch: { _id: ObjectID( playerID.toString() ) } } } ));
	return result;
}


exports.createTeam = async ( team ) => {
	let result = ( await teamCursor.insertOne( team ) );
	return result.ops[ 0 ];
};

exports.updateTeam = async ( id, team ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de equipo inválido" };
	let result = ( await teamCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: team }, { returnOriginal: false } ) );
	return result.value;
};

exports.purgeTeam = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de equipo inválido" };
	let result = ( await teamCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

// exports.countTeamsInCompetition = async ( competitionID ) => {
// 	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Invalid competition id" };
// 	return ( await teamCursor.find( { "competitions": ObjectID( competitionID.toString() ) } ).count() );
// };
//
// exports.getTeamsInCompetition = async ( competitionID ) => {
// 	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Invalid competition id" };
// 	return ( await dbModule.findResultToArray( teamCursor, { "competitions": ObjectID( competitionID.toString() ) } ) );
// };

