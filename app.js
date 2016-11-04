var express = require('express');
var utils = require('./lib/utils.js');
var model = require('./lib/model.js');
var hbs = require('handlebars');
var db = require('./lib/database.js');

var port = process.argv[2] || '3000';

[
    './public',
    './public/css',
    './public/js',
    './public/fontello'
].forEach( function ( dir ) {
    utils.makeDirIfNotExists( dir );
});

utils.prepareAssets({
    './public/js/vendor.js': [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery-ui-dist/jquery-ui.min.js',
        'node_modules/handlebars/dist/handlebars.min.js'
    ],
    './public/css/vendor.css': [
        'node_modules/jquery-ui-dist/jquery-ui.min.css'
    ],
    './public/css/app.css': [
        'assets/css/normalize.css',
        'assets/css/app.css',
        'assets/css/skeleton.css'
    ],
    './public/js/app.js': [
        'assets/js/app.js'
    ]
});

utils.prepareStatic({
    './assets/fontello/css': './public/fontello/css',
    './assets/fontello/font': './public/fontello/font'
});

hbs.registerHelper('wrap', function ( context, options ) {
    return templates[context]({
        content: options.fn(this)
    });
});

var templates = utils.compileTemplates( './templates', './public/js/templates.js' );

var app = express();

app.use('/static', express.static('public'))

app.get('/', function (req, res) {
    res.send( templates['index']() );
});

app.get('/api/holiday', function (req, res) {
    res.send( { data: model.fixtures } );
});

app.post('/api/holiday', function ( req, res ) {
});

app.listen(port, function () {
    console.log( 'Server started. PORT ' + port );
});
