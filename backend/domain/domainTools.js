var bcrypt = require( "bcrypt" );

let saltRounds = 288;


exports.encryptPassword = async ( password ) => {
	let hashedPassword = await new Promise( ( resolve, reject ) => {
		bcrypt.hash( password, saltRounds, function ( err, hash ) {
			if ( err ) reject( err );
			resolve( hash )
		} );
	} );
	return hashedPassword;
};
