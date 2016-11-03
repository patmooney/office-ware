var express = require('express');
var utils = require('./lib/utils.js');

[
    './public',
    './public/css',
    './public/js'
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

var templates = utils.compileTemplates( './templates' );

var app = express();

app.use('/static', express.static('public'))

app.get('/', function (req, res) {
    res.send( templates['index']({ name: req.query.name }) );
});

app.listen(3000, function () {
    console.log( 'Server started.' );
});
