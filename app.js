var express = require('express');
var utils = require('./lib/utils.js');
var user = require('./lib/user.js');
var hbs = require('handlebars');
var cookieParser = require('cookie-parser');
var randomstring = require('randomstring');

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

    var _appRoutes = {
        get: {
            '/login': function (req, res) {
                return req.signedCookies.user_id ?
                    res.redirect('/') :
                    res.send( templates['login']() );
            },
            '/admin': function( req, res ) {
                if ( ! req.signedCookies.is_admin ){
                    return res.send( templates['admin-unauthorised']() );
                }
                return res.send( templates['admin']() );
            }
        },
        authGet: {
            '/': function ( req, res ) { res.send( templates['index']() ); },
        },
        post: {
            '/login': function ( req, res ) {
                res.cookie('user_id',1,{ signed: true });
                res.redirect('/');
            },
            '/register': function ( req, res ) {
                user.addUser( req.params ).then(
                    function ( user ){
                        console.log( user );
                        res.cookie('user_id',user.id,{ signed: true });
                        res.status(200).send({ message: "OK" });
                    },
                    function ( error ){
                        res.status(400).send({ error: error });
                    }
                );
            }
        }
    };

    var _apiRoutes = {
        get: {
            '/holiday': function ( req, res ) {
                res.send( { data: user.fixtures } );
            },
        },
        post: {
            '/holiday': function ( req, res ) {
            }
        }
    };

    var app = _setupApp();
    var api = express();

    /* api routes need a session */
    api.use(function ( req, res, next ){
        return req.signedCookies.user_id ? next() : res.status(401).end();
    });

    /* register app routes */
    Object.keys(_appRoutes).forEach( function ( method ) {
        Object.keys(_appRoutes[method]).forEach( function ( route ) {
            app[method](route,_appRoutes[method][route]);
        });
    });

    /* register api routes */
    Object.keys(_apiRoutes).forEach( function ( method ) {
        Object.keys(_apiRoutes[method]).forEach( function ( route ) {
            api[method](route,_apiRoutes[method][route]);
        });
    });

    app.use( '/api', api );
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
    app.authGet = function( route,  cb ) {
        var wrap = function ( req, res ){

            var user_id = req.signedCookies.user_id;

            if ( user_id ){
                // user id logged in, proceed
                return cb( req, res, user.find( user_id ) );
            }

            // user is not logged in, go to login page
            return res.redirect('/login');
        };
        app.get(route, wrap);
    };

    return app;
}
