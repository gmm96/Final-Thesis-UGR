var MongoClient = require( 'mongodb' ).MongoClient;
var url = 'mongodb://administrator:mongoLO@localhost:27017';

let dbConnection = null;
let dbCursor = null;

exports.getDb = () => dbCursor;

exports.createDBConnection = async () => {
	if (dbCursor)
		return dbCursor;
	
	dbConnection = await MongoClient.connect( url, { useNewUrlParser: true } );
	if (!dbConnection)
		throw Error('Error connecting DB');
	
	dbCursor = dbConnection.db('Actapp');
	return dbCursor;
};

exports.closeDBConnection = async () => {
	if (dbConnection)
		dbConnection.close();
};


