module.exports = {
  files: {
    javascripts: {
      joinTo: {
        'vendor.js': /^(?!app)/,
        'app.js': /^app/
      }
    },
    templates: {
        precompile: true,
        joinTo: 'templates.js'
    },
    stylesheets: {joinTo: 'app.css'}
  },

  plugins: {
    babel: {presets: ['es2015']},
    handlebars: {}
  }
};
