var dbModule = require( '../db' );
let db = dbModule.getDb();
let playerCursor = db.collection( 'player' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getAllPlayers = async () => {
	let result = (await dbModule.findResultToArray(playerCursor, {}));
	return result;
};


exports.getPlayerById = async ( playerID ) => {
	if ( !ObjectID.isValid( playerID ) ) throw { code: 404, message: "Identificador de jugador inválido" };
	let result = ( await playerCursor.findOne( { _id: ObjectID( playerID.toString() ) } ) );
	return result;
};


exports.getPlayerByNameOrSurname = async ( nameOrSurname ) => {
	let result = ( await playerCursor.aggregate( [ {
		$addFields: {
			"fullname": { $concat: [ "$name", ' ', "$surname" ] },
			"reversedFullname": { $concat: [ "$surname", " ", "$name" ] }
		}
	}, {
		$match: {
			"$or": [
				{ "name": new RegExp( nameOrSurname, 'i' ) },
				{ "surname": new RegExp( nameOrSurname, 'i' ) },
				{ "fullname": new RegExp( nameOrSurname, 'i' ) },
				{ "reversedFullname": new RegExp( nameOrSurname, "i" ) }
			]
		}
	} ] ).toArray() );
	
	return result;
}


exports.getPlayerByPersonalIdentification = async ( idCard ) => {
	let result = ( await playerCursor.findOne( { idCard: idCard } ) );
	return result;
};


exports.getPlayerArrayByPersonalIdentification = async ( idCard ) => {
	let result = ( await dbModule.findResultToArray( playerCursor, { "idCard": new RegExp( idCard, 'i' ) } ) )
	return result;
}


exports.createPlayer = async ( player ) => {
	let result = ( await playerCursor.insertOne( player ) );
	return result.ops[ 0 ];
};

exports.updatePlayer = async ( id, player ) => {
	if ( !ObjectID.isValid( id ) ) throw { code: 422, message: "Identificador de jugador inválido" };
	let result = ( await playerCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: player }, { returnOriginal: false } ) );
	return result.value;
};

exports.purgePlayer = async ( playerID ) => {
	if ( !ObjectID.isValid( playerID ) ) throw { code: 422, message: "Identificador de jugador inválido" };
	let result = ( await playerCursor.deleteOne( { _id: ObjectID( playerID.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};


// exports.countPlayersInTeam = async ( teamID ) => {
// 	if ( !ObjectID.isValid( teamID ) ) throw { code: 422, message: "Invalid team id" };
// 	return ( await ( await playerCursor.find( { "competitions.teamID": ObjectID( teamID.toString() ) } ) ).count() );
// };
