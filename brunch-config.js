module.exports = {
  paths: {
      watched: [ 'app' ],
      public: './public'
  },
  files: {
    javascripts: {
      joinTo: {
/*        'jquery.js': function ( path ) { return path.match(/jquery.js$/); },
        'vendor.js': function ( path ) {
            if ( path.match(/jquery.js$/) ){
                return false;
            }
            return path.match(/^node_modules/);
        },*/
        'vendor.js': /^node_modules/,
        'app.js': /^app/
      },
      order: {
        before: [
          'node_modules/jquery/dist/jquery.js'
        ]
      }
    },
    templates: {
        precompile: true,
        joinTo: 'templates.js'
    }
  },

  plugins: {
    babel: {
        presets: ['es2015','es2016'],
        ignore: [/node_modules/]
    },
    handlebars: {}
  }
};
