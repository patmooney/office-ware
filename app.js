'use strict';

const express = require('express');
const utils = require('./lib/utils');
const hbs = require('handlebars');
const cookieParser = require('cookie-parser');
const randomstring = require('randomstring');
import bodyParser from 'body-parser';

import user from './lib/user';
import organisation from './lib/organisation';
import holiday from './lib/holiday';
import _uC from './lib/controller/user';
import _oC from './lib/controller/organisation';
import _hC from './lib/controller/holiday';

const schema = {
    user: user,
    organisation: organisation,
    holiday: holiday
};

const userController = new _uC(schema);
const holidayController = new _hC(schema);
const orgController = new _oC(schema);

var port = process.env.PORT || '3000';

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

    /* user routes */
    app.get( '/register', (req,res) => { userController.register(req,res) } );
    app.post( '/register', (req,res) => { userController.registerDetails(req,res) } );
    app.get( '/login', (req,res) => {
        if ( req.signedCookies.user_id ) {
            return res.redirect('/');
        }
        return res.send(templates['login']());
    });
    app.post( '/login', (req,res) => { userController.login(req,res) } );

    /* app routes */
    app.auth.get( '/', (req,res) => { holidayController.request(req,res) } );
    app.auth.get( '/admin', (req,res) => { orgController.admin(req,res) } );

    /* admin routes */
    app.post('/organisation', (req,res) => { orgController.register(req,res) } );

    return app;
}

function _setupApp () {
    var app = express();

    /* set static assets dir */
    app.use('/', express.static('public'));

    /* handle post params */
    app.use(bodyParser.json());

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
            return user.find( user_id ).then(
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
