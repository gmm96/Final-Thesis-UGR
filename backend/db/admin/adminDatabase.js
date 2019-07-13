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

exports.getAllAdmins = async () => {
	let result = ( await dbModule.findResultToArray( adminCursor, {} ) );
	return result;
};

exports.createAdmin = async ( admin ) => {
	result = ( await adminCursor.insertOne( admin ) );
	return result.ops[ 0 ];
};

exports.updateAdmin = async ( id, admin ) => {
	let result = ( await adminCursor.findOneAndUpdate( { _id: ObjectID( id.toString() ) }, { $set: admin }, { returnOriginal: false } ) );
	return result.value;
};

exports.deleteAdmin = async ( id ) => {
	let result = ( await adminCursor.deleteOne( { _id: ObjectID( id.toString() ) } ) );
	return ( result.result.n === 1 && result.result.ok === 1 );
};



