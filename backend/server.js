var express = require( 'express' );
var app = express();
var dbModule = require('./db/db');
var bodyParser = require( 'body-parser' );
var cors = require( 'cors' );
var moment = require( 'moment' );
var passport = require( 'passport' );
var LocalStrategy = require( 'passport-local' ).Strategy;

var corsOptions = {
    origin: true,
    credentials: true
};

dbModule.createDBConnection().then(() => {
    var adminDomain = require( './domain/admin/admin' );
    
    app.use( cors( corsOptions ) );
    app.use( bodyParser.json() );
    
    app.use( passport.initialize() );
    app.use( passport.session() );
    
    passport.use( new LocalStrategy(
        async ( username, password, done ) => {
            try {
                let user = await adminDomain.getAdminByEmailAndPassword( username, password );
                return done( null, user ? user : false );
            } catch ( e ) {
                return done( e );
            }
        }
    ) );
    
    var JwtStrategy = require( 'passport-jwt' ).Strategy,
        ExtractJwt = require( 'passport-jwt' ).ExtractJwt;
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'secret';
    passport.use( new JwtStrategy( opts, function ( jwt_payload, done ) {
        let expiration = moment( jwt_payload.exp * 1000 );
        if ( expiration < moment().utc() ) {
            return done( null, false );
        }
        done( null, jwt_payload );
    } ) );
    
    passport.serializeUser( function ( user, done ) {
        debugger;
        done( null, user );
    } );
    
    passport.deserializeUser( function ( user, done ) {
        debugger;
        done( null, user );
    } );
    
    var routes = require( './api/admin/admin_routes' );
    routes.assignRoutes( app );
    
    app.listen( 3000 );
});

