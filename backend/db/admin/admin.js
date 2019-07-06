var dbModule = require( '../db' );

let adminsCollection = dbModule.getDb().collection( 'admins' );

exports.createAdmin = async ( admin ) => {
	let result = await adminsCollection.findOne( { email: admin.email } );
	if ( result ) {
		// TODO catching exception
		return 'Admin already exists!';
	}
	result = ( await adminsCollection.insertOne( admin ) ).ops[ 0 ];
	console.log( 'result', result );
	return result;
};

exports.deleteAdmin = async ( email ) => {
	let result = ( await adminsCollection.deleteOne( { email: email } ) );
	console.log( 'result', result );
	return result;
};

exports.updateAdmin = async ( admin ) => {
	let result = ( await adminsCollection.updateOne( { email: email }, admin ) );
	console.log( 'result', result );
	return result;
};


