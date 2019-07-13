var dbModule = require( '../db' );

let db = dbModule.getDb();
let playerCursor = db.collection( 'player' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getPlayerById = async ( id ) => {
	let result = ( await playerCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.getPlayerByPersonalIdentification = async ( nationalIdentityCard, passport ) => {
	let result;
	if ( nationalIdentityCard && passport ) {
		result = ( await dbModule.findResultToArray( playerCursor, { $or: [ { nationalIdentityCard: nationalIdentityCard }, { passport: passport } ] } ) );
	} else if ( !passport )
		result = ( await dbModule.findResultToArray( playerCursor, { nationalIdentityCard: nationalIdentityCard } ) );
	else
		result = ( await dbModule.findResultToArray( playerCursor, { passport: passport } ) );
	
	return result;
};

exports.getAllPlayers = async () => {
	let result = ( await dbModule.findResultToArray( playerCursor, {} ) );
	return result;
};

exports.createPlayer = async ( player ) => {
	let result = ( await playerCursor.insertOne( player ) );
	return result.ops[ 0 ];
};

exports.updatePlayer = async ( id, player ) => {
	let result = ( await playerCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: player }, { returnOriginal: false } ) );
	return result.value;
};

exports.deletePlayer = async ( id ) => {
	let result = ( await playerCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};

