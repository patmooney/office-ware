'use strict';

const express = require('express');
const utils = require('./lib/utils');
const user = require('./lib/user');
const holiday = require('./lib/holiday');
const organisation = require('./lib/organisation');
const hbs = require('handlebars');
const cookieParser = require('cookie-parser');
const randomstring = require('randomstring');

const _uC = require('lib/controller/user');
const userController = new _uC({
    userModel: user
});

const _hC = require('lib/controller/holiday');
const holidayController = new _hC({
    holidayModel: holiday
});

const _oC = require('lib/controller/organisation');
const orgController = new _oC({
    organisationModel: organisation,
    userModel: user
});

var port = process.argv[2] || '3000';

_initApp().listen(port, function () {
    console.log( 'Server started. PORT ' + port );
});

/*

Node app

Uses cookie encryption for session, handlebars for HTML,
Sequelize for ORM, MailJet for email

*/

function _initApp() {
    /*
        compile handlebars templates for server use
        with a helper to use the main layout
    */
    hbs.registerHelper('wrap', function ( context, options ) {
        return templates[context]({
            content: options.fn(this)
        });
    });
    var templates = utils.compileTemplates( './app/templates' );

    var app = _setupApp();

    app.authGet( '/', function ( req, res ) {
        res.send( templates['index']() );
    });

    /* user routes */
    app.get( '/register', userController.register );
    app.post( '/register', userController.registerSubmit );
    app.get( '/login', userControlller.login );
    app.post( '/login', userController.loginSubmit );

    app.auth.get( '/', holidayController.request );

    return app;
}

function _setupApp () {
    var app = express();

    /* set static assets dir */
    app.use('/', express.static('public'));

    /* use encrypted cookies */
    var cookieKey = process.env.APP_COOKIE_KEY || randomstring.generate();
    app.use(cookieParser(cookieKey));

    /* a hook for locking down specific routes */
    var authRouteError = function ( req, res ) {
        if ( req.header('X-Requested-With') === 'XMLHttpRequest' ){
            return res.status(401).send('Unauthorised');
        }
        return res.redirect('/login');
    };
    var authRoute = function ( req, res, cb ){
        var user_id = req.signedCookies.user_id;
        if ( user_id ){
            user.find({ user_id: user_id }).then(
                function ( user ) {
                    req.user = user;
                    // user id logged in, proceed
                    return cb( req, res ); // using middleware seems overkill
                },
                function () {
                    return authRouteError( req, res );
                }
            );
        }
        return authRouteError( req, res );
    };
    app.auth = {
        post: function( route,  cb ) {
            app.post( route, function( req, res ) { authRoute( req, res, cb ); } );
        },
        get: function( route,  cb ) {
            app.get( route, function( req, res ) { authRoute( req, res, cb ); } );
        }
    };

    return app;
}
