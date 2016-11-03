var express = require('express');
var utils = require('./lib/utils.js');
var hbs = require('handlebars');

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
        'node_modules/jquery-ui-dist/jquery-ui.min.js'
    ],
    './public/css/vendor.css': [
        'node_modules/jquery-ui-dist/jquery-ui.min.css'
    ],
    './public/css/app.css': [
        'assets/css/app.css'
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
var templates = utils.compileTemplates( './templates' );
var app = express();

app.use('/static', express.static('public'))

app.get('/', function (req, res) {
    res.send( templates['index']({ name: req.query.name }) );
});

app.listen(3000, function () {
    console.log( 'Server started.' );
});
