
var jsIncludes = [
    'jquery/src/jquery.js'
];

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
