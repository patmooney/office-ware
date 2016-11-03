var fs = require('fs-extra');
var hbs = require('handlebars');

exports.makeDirIfNotExists = function ( dir ) {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
};

exports.compileTemplates = function( t_path ) {
    var templates = {};
    fs.readdirSync( t_path ).forEach(
        function( item ) {
            var content = fs.readFileSync( `${t_path}/${item}`, 'utf8' );
            var name = item.match(/(.+?)\.hbs/)[1];
            templates[name] = hbs.compile( content );
        }
    );
    return templates;
};

exports.prepareAssets = function ( assets ) {
    Object.keys(assets).forEach(function(key) {
          var val = assets[key];
          _prepare_assets( key, val );
    });
};

exports.prepareStatic = function ( stat ) {
    Object.keys(stat).forEach(function(key) {
        var val = stat[key];
        try {
              fs.copySync(key, val);
        } catch (err) {
              console.error(err)
        }
    });
};

function _prepare_assets( outFn, assets ) {
    fs.writeFileSync(
        outFn,
        assets.map(
            function( item ) {
                return fs.readFileSync( item, 'utf8' );
            }
        ).join("\n\n")
    );
}
