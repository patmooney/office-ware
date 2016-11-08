var fs = require('fs-extra');
var hbs = require('handlebars');

exports.compileTemplates = function( t_path ) {
    var templates = {};
    var preTemplates = {};
    fs.readdirSync( t_path ).forEach(
        function( item ) {
            var content = fs.readFileSync( `${t_path}/${item}`, 'utf8' );
            var name = item.match(/(.+?)\.hbs/)[1];
            templates[name] = hbs.compile( content );
            preTemplates[name] = hbs.precompile( content );
        }
    );

    return templates;
};
