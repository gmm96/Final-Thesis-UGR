exports.ROLES = {
	ADMIN: "ADMIN",
	SUPER_ADMIN: "SUPER_ADMIN"
};

exports.validatePermissionByRole = ( role ) => ( req, res, next ) => {
	
	if ( req.user && ( req.user.role === exports.ROLES.SUPER_ADMIN || req.user.role === role ) ) {
		return next();
	}
	
	// res.setHeader("WWW-Authenticate", 'Basic realm="FOOREALM"')
	res.status( 401 ).send();
};
