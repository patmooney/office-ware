'use strict';

import express      from 'express';
import hbs          from 'handlebars';
import cookieParser from 'cookie-parser';
import randomstring from 'randomstring';
import bodyParser   from 'body-parser';

import utils                        from './lib/utils';
import schema                       from './lib/schema';

import UserControllerClass          from './lib/controller/user';
import OrganisationControllerClass  from './lib/controller/organisation';
import HolidayControllerClass       from './lib/controller/holiday';

const templates = utils.compileTemplates( './app/templates' );

const userController = new UserControllerClass(schema, templates);
const holidayController = new HolidayControllerClass(schema, templates);
const orgController = new OrganisationControllerClass(schema, templates);

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

    var app = _setupApp();

    app.get( '/login', (req,res) => {
        if ( req.signedCookies.user_id ) {
            return res.redirect('/');
        }
        return res.send(templates['login']());
    });

    /* user routes */
    app.get( '/register', (req,res) => { userController.register(req,res) } );
    app.post( '/register', (req,res) => { userController.registerDetails(req,res) } );
    app.post( '/login', (req,res) => { userController.login(req,res) } );

    /* app routes */
    app.user.get( '/', (req,res) => { holidayController.request(req,res) } );
    app.admin.get( '/admin', (req,res) => { orgController.admin(req,res) } );

    /* admin routes */
    app.post('/organisation', (req,res) => { orgController.register(req,res) } );

    /* holiday routes */
    app.admin.get(
        '/api/holiday/unauthorised',
        (req,res) => {
            holidayController.unauthorised(req,res)
        }
    );

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
        ['user_id','org_id','is_admin'].forEach((key) => {
            res.clearCookie(key);
        });
        if ( req.header('X-Requested-With') === 'XMLHttpRequest' ){
            return res.status(401).send('Unauthorised');
        }
        return res.redirect('/login');
    };
    var authRoute = function ( req, res, cb, admin=false ){
        var user_id = req.signedCookies.user_id;
        if ( user_id ){
            return schema.user.find( user_id ).then(
                function ( user ) {
                    if ( user ) {
                        if ( admin && ! user.is_admin ) {
                            return res.redirect('/');
                        }
                        req.user = user;
                        // user id logged in, proceed
                        return cb( req, res ); // using middleware seems overkill
                    }
                    return authRouteError( req, res );
                }
            );
        }
        return authRouteError( req, res );
    };
    app.user = {
        post: function( route,  cb ) {
            app.post( route, function( req, res ) { authRoute( req, res, cb ); } );
        },
        get: function( route,  cb ) {
            app.get( route, function( req, res ) { authRoute( req, res, cb ); } );
        }
    };
    app.admin = {
        post: function( route,  cb ) {
            app.post( route, function( req, res ) { authRoute( req, res, cb, true ); } );
        },
        get: function( route,  cb ) {
            app.get( route, function( req, res ) { authRoute( req, res, cb, true ); } );
        }
    };

    return app;
}
