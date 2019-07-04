var admins = [
	{ "id": "1", "name": "Juan García", "username": "juanga", "password": "juanga" },
	{ "id": "2", "name": "María Pérez", "username": "mariape", "password": "mariape" },
	{ "id": "3", "name": "David Alonso", "username": "davida", "password": "davida" }
];

exports.getAdmins = function ( req, res ) {
	res.send( admins );
}

exports.addAdmin = function ( req, res ) {
	var name = req.body.name;
	var desc = req.body.desc;
	
	// Add user with predefined image for the demo
	admins.push( { "name": name } );
	res.send( users );
}

exports.updateAdmin = function ( req, res ) {
	// TODO: Not included in this demo
}

exports.deleteAdmin = function ( req, res ) {
	var userId = req.params.userId;
	
	for ( var userIndex in users ) {
		var user = users[ userIndex ];
		
		if ( user.id === userId ) {
			users.splice( userIndex, 1 );
			break;
		}
	}
	
	res.send( users );
}
