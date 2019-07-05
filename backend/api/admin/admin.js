var MongoClient = require( 'mongodb' ).MongoClient;
var assert = require( 'assert' );
var url = 'mongodb://administrator:mongoLO@localhost:27017';

var admins = [
	{ "id": "1", "name": "Juan García", "username": "juanga", "password": "juanga" },
	{ "id": "2", "name": "María Pérez", "username": "mariape", "password": "mariape" },
	{ "id": "3", "name": "David Alonso", "username": "davida", "password": "davida" }
];

exports.getAdmins = function ( req, res ) {
	// res.send( admins );
	MongoClient.connect( url, { useNewUrlParser: true }, function ( err, db ) {
		if ( err ) throw err;
		var dbo = db.db( "Actapp" );
		dbo.collection( "admins" ).findOne( {}, function ( err, result ) {
			if ( err ) throw err;
			console.log( result.name );
			db.close();
			res.send( result );
		} );
	} );
	// 	MongoClient.connect(url, {useNewUrlParser: true},function(err, db) {
	// 		assert.equal(null, err);
	// 		console.log("Connected successfully to server");
	//
	// 		db.close();
	// 	})
}

exports.addAdmin = function ( req, res ) {
	var id = req.body.id;
	var name = req.body.name;
	var username = req.body.username;
	var password = req.body.password
	
	// Add user with predefined image for the demo
	admins.push( { "id": id, "name": name, "username": username, "password": password } );
	res.send( admins );
}

exports.updateAdmin = function ( req, res ) {
	// TODO: Not included in this demo
}

exports.deleteAdmin = function ( req, res ) {
	var adminID = req.params.id;
	
	for ( var adminIndex in admins ) {
		var admin = admins[ adminIndex ];
		
		if ( admin.id === adminID ) {
			admins.splice( adminIndex, 1 );
			break;
		}
	}
	res.send( admins );
}
