var express = require('express');
var utils = require('./lib/utils.js');
var model = require('./lib/model.js');
var hbs = require('handlebars');
var cookieParser = require('cookie-parser');

var port = process.argv[2] || '3000';

hbs.registerHelper('wrap', function ( context, options ) {
    return templates[context]({
        content: options.fn(this)
    });
});

var templates = utils.compileTemplates( './app/templates' );

var app = express();
app.use(cookieParser('3uf93uf93ri02io-w2'));
app.use('/', express.static('public'))

app.authGet = function( route,  cb ) {
    var wrap = function ( req, res ){
        var user_id = req.signedCookies.user_id;

        if ( user_id ){
            console.log( 'got user id : ' + user_id );
            return route == '/login' ?
                    res.redirect('/') :
                    cb( req, res, model.findUser( user_id ) );
        }

        if ( req.header('X-Requested-With') == 'XMLHttpRequest' ){
            return res.status(401).end();
        }

        return route == '/login' ?
            res.send( templates['login']() ) :
            res.redirect('/login');
    };
    app.get(route, wrap);
};

app.authGet('/', function (req, res) {
    res.send( templates['index']() );
});

app.authGet('/api/holiday', function (req, res) {
    res.send( { data: model.fixtures } );
});

app.post('/api/holiday', function ( req, res ) {
});

app.authGet('/login',function (req, res) {
    res.send( templates['login']() );
});

app.post('/login', function ( req, res ) {
    res.cookie('user_id',1,{ signed: true });
    res.redirect('/');
});

app.listen(port, function () {
    console.log( 'Server started. PORT ' + port );
});


