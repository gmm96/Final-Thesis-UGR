let domainTools = require('./domainTools')

process.argv.slice(2).forEach( password => {
	let encryptedPassword = domainTools.encryptPassword(password);
	console.log("password", password, "encrypted password", encryptedPassword)
})
