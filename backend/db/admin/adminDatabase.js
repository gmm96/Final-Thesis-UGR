var dbModule = require( '../db' );

let db = dbModule.getDb();
let adminCursor = db.collection( 'admin' );
let ObjectID = require( 'mongodb' ).ObjectID;


exports.getAdminById = async ( id ) => {
	let result = ( await adminCursor.findOne( { _id: ObjectID( id.toString() ) } ) );
	return result;
};

exports.getAdminByEmail = async ( email ) => {
	let result = ( await adminCursor.findOne( { email: email } ) );
	return result;
};

exports.createAdmin = async ( admin ) => {
	let result = ( await adminCursor.insertOne( admin ) );
	return result.ops[ 0 ];
};


