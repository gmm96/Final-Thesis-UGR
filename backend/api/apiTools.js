exports.manageError = ( req, res, e ) => {
	let error = {};
	
	error.code = e.code ? e.code : 500;
	error.message = e.message ? e.message : "Unexpected error";
	
	res.status( error.code ).send( error );
};
