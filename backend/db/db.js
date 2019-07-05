var MongoClient = require( 'mongodb' ).MongoClient;
var url = 'mongodb://administrator:mongoLO@localhost:27017/Actapp';


exports.createDBConnection = async () => {
	if (db) return new Promise((resolve, reject) => resolve(db));
	
	let dbURL = getDBUrl();
	// Connect to the db
	let dbConnection = await MongoClient.connect(dbURL);
	if (!dbConnection) {
		throw Error('Error connecting DB');
	}
	
	return db;
};
