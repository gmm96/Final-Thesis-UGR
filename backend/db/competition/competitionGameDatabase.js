var dbModule = require( '../db' );

let db = dbModule.getDb();
let gameCursor = db.collection( 'comp_game' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getGameById = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de partido inválido" };
	let result = ( await gameCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};


exports.getGamesByCompetitionAndFixture = async ( competitionID, fixture ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	// let result = ( await dbModule.findResultToArray( gameCursor, { competitionID: ObjectID( competitionID.toString() ), fixture: fixture } ) );
	let result = ( await gameCursor.aggregate( [
		{ $match: { competitionID: ObjectID( competitionID.toString() ), fixture: fixture } },
		{
			$lookup: {
				from: 'team',
				localField: 'localTeamInfo._id',
				foreignField: '_id',
				as: 'localTeamInfo.team'
			}
		},
		{
			$lookup: {
				from: 'team',
				localField: 'visitorTeamInfo._id',
				foreignField: '_id',
				as: 'visitorTeamInfo.team'
			}
		},
		{ $unwind: "$localTeamInfo.team" },
		{ $unwind: "$visitorTeamInfo.team" }
	] ).toArray() );
	return result;
};


exports.getCurrentFixture = async ( competitionID ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = ( await gameCursor.find( { competitionID: ObjectID( competitionID.toString() ), winner: null } ).sort( { fixture: 1 } ).limit( 1 ).toArray() );
	return result;
};


exports.getNextTeamGamesInCompetition = async ( competitionID, teamID ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !ObjectID.isValid( teamID ) ) throw { code: 422, message: "Identificador de equipo inválido" };
	let result = ( await gameCursor.find( {
		competitionID: ObjectID( competitionID.toString() ),
		winner: null,
		$or: [ { "localTeamInfo._id": ObjectID( teamID.toString() ) },
			{ "visitorTeamInfo._id": ObjectID( teamID.toString() ) },
		]
	} )
	.sort( { fixture: 1 } ).toArray() );
	return result;
};


exports.getPrevTeamGamesInCompetition = async ( competitionID, teamID ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	if ( !ObjectID.isValid( teamID ) ) throw { code: 422, message: "Identificador de equipo inválido" };
	let result = ( await gameCursor.find( {
		competitionID: ObjectID( competitionID.toString() ),
		winner: { $ne: null },
		$or: [ { "localTeamInfo._id": ObjectID( teamID.toString() ) },
			{ "visitorTeamInfo._id": ObjectID( teamID.toString() ) },
		]
	} )
	.sort( { updatedAt: 1 } ).toArray() );
	return result;
};


exports.getUnplayedGamesByCompetitionForScheduling = async (competitionID) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = ( await gameCursor.find( {
		"competitionID": ObjectID( competitionID.toString() ),
		"winner": null,
		"loser": null,
		"localTeamInfo.playerStats": null,
		"localTeamInfo.teamStats": null,
		"visitorTeamInfo.playerStats": null,
		"visitorTeamInfo.teamStats": null,
	} )
	.sort( { fixture: 1 } ).toArray() );
	return result;
}


exports.createGame = async ( game ) => {
	let result = ( await gameCursor.insertOne( game ) );
	return result.ops[ 0 ];
};

exports.updateGame = async ( id, game ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de partido inválido" };
	let result = ( await gameCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: game }, { returnOriginal: false } ) );
	return result.value;
};

exports.purgeGame = async ( id ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de partido inválido" };
	let result = ( await gameCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

exports.deleteGamesByCompetition = async ( competitionID ) => {
	if ( !ObjectID.isValid( competitionID ) ) throw { code: 422, message: "Identificador de competición inválido" };
	let result = ( await gameCursor.deleteMany( { competitionID: ObjectID( competitionID.toString() ) } ) );
	return ( !!result.result.n && !!result.result.ok );
};
