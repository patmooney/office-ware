'use strict';

const express = require('express');
const utils = require('./lib/utils');
import user from './lib/user';
console.log( user );
const holiday = require('./lib/holiday');
import organisation from './lib/organisation';
const hbs = require('handlebars');
const cookieParser = require('cookie-parser');
const randomstring = require('randomstring');
import bodyParser from 'body-parser';

import _uC from './lib/controller/user';
const userController = new _uC({
    user: user
});

var _hC = require('./lib/controller/holiday').controller;
const holidayController = new _hC({
    holiday: holiday
});

import _oC from './lib/controller/organisation';
const orgController = new _oC({
    organisation: organisation,
    user: user
});

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
    app.post( '/login', (req,res) => { userController.loginSubmit(req,res) } );

    /* app routes */
    app.auth.get( '/', (req,res,user) => { holidayController.request(req,res,user) } );
    app.auth.get( '/admin', (req,res,user) => { orgController.admin(req,res,user) } );

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
