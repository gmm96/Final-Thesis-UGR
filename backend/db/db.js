var MongoClient = require( 'mongodb' ).MongoClient;
var url = 'mongodb://administrator:mongoLO@localhost:27017';

let dbConnection = null;
let dbCursor = null;

exports.getDb = () => dbCursor;

exports.createDBConnection = async () => {
	if ( dbCursor )
		return dbCursor;
	
	dbConnection = await MongoClient.connect( url, { useNewUrlParser: true, useUnifiedTopology: true } );
	if ( !dbConnection )
		throw Error( 'Error connecting DB' );
	
	dbCursor = dbConnection.db( 'Actapp' );
	return dbCursor;
};

exports.closeDBConnection = async () => {
	if ( dbConnection )
		dbConnection.close();
};

exports.findResultToArray = async ( collectionCursor, query ) => {
	return ( await new Promise( async ( resolve, reject ) => {
		( await collectionCursor.find( query ).toArray( async ( err, item ) => {
			if ( err ) reject( err );
			resolve( item );
		} ) )
	} ) );
};

exports.convertDateToDatabaseDate = function ( date ) {
	return date.toISOString();
};

exports.convertDatabaseDateToDate = function ( dbDate ) {
	return new Date( dbDate );
};

exports.createRegexForCaseInsTextQuery = function ( text ) {
	return new RegExp( text, "i" );
}

