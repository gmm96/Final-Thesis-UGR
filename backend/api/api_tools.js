
exports.manageError = (req, res, e) => {
	let error = {};
	
	console.error(e);
	
	error.code = e.code ? e.code : 500;
	error.message = e.message ? e.message : "Unexpected error";
	
	res.status(error.code).send(error);
};
