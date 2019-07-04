var express = require( 'express' );
var app = express();

var bodyParser = require( 'body-parser' );
var cors = require( 'cors' );

var corsOptions = {
    origin: true,
    credentials: true
};

app.use( cors( corsOptions ) );
app.use( bodyParser.json() );

var routes = require( './api/admin/admin_routes' );
routes.assignRoutes( app );

app.listen( 3000 );
