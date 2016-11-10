module.exports = {
  paths: {
      watched: [ 'app' ],
      public: './public'
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
            'app.css': /^app/
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
