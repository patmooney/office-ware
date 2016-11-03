var express = require('express')
var fs = require('fs');
var hbs = require('handlebars');

fs.mkdirSync( './public' );
fs.mkdirSync( './public/css' );
fs.mkdirSync( './public/js' );

prepare_assets(
    './public/js/vendor.js',
    [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/jquery-ui-dist/jquery-ui.min.js'
    ]
);
prepare_assets(
    './public/css/vendor.css',
    [
        'node_modules/jquery-ui-dist/jquery-ui.min.css'
    ]
);
prepare_assets(
    './public/css/app.css',
    [
        'assets/css/app.css'
    ]
);
prepare_assets(
    './public/js/app.js',
    [
        'assets/js/app.js'
    ]
);

var templates = compile_templates();

var app = express();
app.use('/static', express.static('public'))
app.get('/', function (req, res) {
    res.send( templates['index']({ name: req.query.name }) );
});
app.listen(3000, function () {
    console.log( 'Server started.' );
});

function compile_templates() {
    var t_path = './templates';
    var templates = {};
    fs.readdirSync( t_path ).forEach(
        function( item ) {
            var content = fs.readFileSync( `${t_path}/${item}`, 'utf8' );
            var name = item.match(/(.+?)\.hbs/)[1];
            templates[name] = hbs.compile( content );
        }
    );
    return templates;
}

function prepare_assets( outFn, assets ) {
    fs.writeFileSync(
        outFn,
        assets.map(
            function( item ) {
                return fs.readFileSync( item, 'utf8' );
            }
        ).join("\n\n")
    );
}
