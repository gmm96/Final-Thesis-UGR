var dbModule = require( '../db' );


let db = dbModule.getDb();
let adminCursor = db.collection( 'admin' );


exports.getAdminById = async ( id ) => {
	let result = await adminCursor.findOne( { _id: id } );
	console.log( result );
	return result;
};

exports.getAdminByEmail = async ( email ) => {
	let result = await adminCursor.findOne( { email: email } );
	console.log( result );
	return result;
};

exports.createAdmin = async ( admin ) => {
	result = ( await adminCursor.insertOne( admin ) );
	console.log( result );
	return result.ops[ 0 ];
};

exports.deleteAdmin = async ( email ) => {
	let result = ( await adminCursor.deleteOne( { email: email } ) );
	console.log( 'result', result );
	return result;
};

exports.updateAdmin = async ( admin ) => {
	let result = ( await adminCursor.updateOne( { email: email }, admin ) );
	console.log( 'result', result );
	return result;
};


