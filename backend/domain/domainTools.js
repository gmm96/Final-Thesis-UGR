var bcrypt = require( "bcrypt" );
var lodash = require( "lodash" );
var fs = require( "fs" );
var backendDirectory = process.cwd();

let saltRounds = 2.88;

exports.gameType = { league: "league", playoffs: "playoffs" };
exports.playoffMatchupCompetitorType = { team: "team", matchup: "matchup" };

exports.encryptPassword = ( password ) => {
	let hashedPassword = bcrypt.hashSync(password, saltRounds);
	return hashedPassword;
};

exports.comparePasswords = ( plainPassword, encryptedPassword ) => {
	let areTheSame = bcrypt.compareSync(plainPassword, encryptedPassword)
	return areTheSame;
};


exports.randomizeArray = async ( arr ) => {
	let arrCopy = lodash.cloneDeep( arr );
	
	arrCopy.sort( function () {
		return 0.5 - Math.random()
	} );
	return arrCopy;
};


exports.getRandomElementFromArray = async ( arr ) => {
	return ( arr.splice( Math.floor( Math.random() * arr.length ), 1 ) )[ 0 ];
};


exports.isPositiveInteger = function ( num ) {
	return typeof num === 'number' && !isNaN( num ) && parseInt( Number( num ) ) == num && !isNaN( parseInt( num, 10 ) ) && num > 0;
};


exports.isOdd = async ( num ) => {
	return num % 2;
};

exports.hasArrayDuplicatedElements = async ( array ) => {
	if (array && array.length) {
		return ( new Set( array ) ).size !== array.length;
	}
	return false;
};

exports.checkUploadedImage = async ( file ) => {
	let acceptedMimeTypes = [ 'image/jpeg', 'image/png', 'image/gif' ];
	let maxAcceptedSize = 3 * 1024 * 1024;
	
	if ( file.size > maxAcceptedSize ) throw { code: 422, message: "La imagen subida excede el tamaño máximo establecido (3MB)" };
	if ( !acceptedMimeTypes.includes( file.type ) ) throw { code: 422, message: "La imagen subida no tiene el formato correcto (jpg/jpeg, png, gif)" };
	return true;
};

exports.moveImageToMediaDirectory = async ( oldPath, newPath ) => {
	if ( !( oldPath && newPath ) || !( typeof oldPath == "string" && typeof newPath == "string" ) ) {
		throw { code: 422, message: "Imposible mover la imagen, uno de las direcciones no es correcta" };
	}
	let relativeNewPath = "/media/" + newPath;
	fs.copyFileSync( oldPath, backendDirectory + relativeNewPath );
	fs.unlinkSync( oldPath );
	return relativeNewPath;
};


exports.removeUploadedImage = async ( path ) => {
	if ( !path ) throw { code: 422, message: "Imposible borrar la imagen, la dirección es incorrecta" };
	fs.unlinkSync( backendDirectory + path );
};
