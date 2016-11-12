var fs = require('fs-extra');
var hbs = require('handlebars');

exports.compileTemplates = function( t_path ) {
    var templates = {};
    fs.readdirSync( t_path ).forEach(
        function( item ) {
            var stats = fs.statSync( `${t_path}/${item}` );
            if ( stats.isFile() ){
                var name = item.match(/(.+?)\.hbs/)[1];
                var content = fs.readFileSync( `${t_path}/${item}`, 'utf8' );
                templates[name] = hbs.compile( content );
            }
        }
    );

    return templates;
};
