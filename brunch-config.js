module.exports = {
  paths: {
      watched: [ 'app' ],
      public: './public'
  },
  npm: {
    styles: {
        // the css file path is relative to node_modules/$module_name/
        'jquery-ui': ['themes/base/core.css','themes/base/theme.css','themes/base/datepicker.css']
    }
  },
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^node_modules/,
        'app.js': /^app/
      },
      order: {
        before: [
          'node_modules/jquery/dist/jquery.js'
        ]
      }
    },
    stylesheets: {
        joinTo: {
            'app.css': /^app/,
            'vendor.css': /^node_modules/
        }
    },
    templates: {
        precompile: true,
        joinTo: 'templates.js'
    }
  },
  plugins: {
    babel: {
        presets: ['es2015'],
        ignore: [/node_modules/]
    },
    handlebars: {},
    sass: {
        mode: 'native'
    }
  }
};
