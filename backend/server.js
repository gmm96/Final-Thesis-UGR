var express = require( 'express' );
var app = express();
// var dbModule = require('./db/db');
var bodyParser = require( 'body-parser' );
var cors = require( 'cors' );

var corsOptions = {
    origin: true,
    credentials: true
};

// dbModule.createDBConnection().then(() => {
    app.use( cors( corsOptions ) );
    app.use( bodyParser.json() );
    
    var routes = require( './api/admin/admin_routes' );
    routes.assignRoutes( app );
    
    app.listen( 3000 );
// });

