$(function() {
    window.Handlebars.registerHelper( 'formatDate', function ( date ) {
        return new Intl.DateTimeFormat().format(new Date(date));
    });
    window.Handlebars.registerHelper( 'mobile', function ( options ) {
        if ( window.screen.availWidth > 550 ){
            return options.inverse(this);
        }
        return options.fn(this);
    });
});
