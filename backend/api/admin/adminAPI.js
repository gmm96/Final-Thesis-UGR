var apiTools = require( "../apiTools" );
var adminDomain = require( "../../domain/admin/adminDomain" );
var jwt = require( "jsonwebtoken" );


exports.login = async ( req, res ) => {
	let user = req.user;
	delete user.password;
	let token = jwt.sign( user, 'secret', { expiresIn: 36000 } );
	
	res.json( { token: 'bearer ' + token } );
};
