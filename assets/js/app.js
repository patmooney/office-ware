
var _transitionTime = 1000;
var _currentScreen = 1;

$( function() {

    $( "#datepicker-from, #datepicker-to" ).datepicker();
    $( "#send-request" ).click( function () {
        transition( 2 );
        submitRequest(
            function ( data ) {
                console.log( data );
                refreshHoliday();
                transition(3);
            },
            function ( aj, stat, err ){
                $('#big-container-2 > div').html(
                    "<h3>"+err+"</h3>" +
                    "<p>Something bad has happened, <a href='#' onclick='transition(1)'>go back</a>"
                );
            }
        );
    });
    $( "#view-holiday" ).click( function () {
        transition(3);
        refreshHoliday();
    });
});

var refreshHoliday = function () {
    jQuery.ajax(
        '/api/holiday',
        {
            success: function ( data ){
                $('.holiday-list-container').html(
                    Handlebars.template(
                        Handlebars.templates['holiday-list']
                    )({ fixtures: data.data, hello: "sausage" })
                );
            }
        }
    );
};

var submitRequest = function ( cb, err_cb ) {
    jQuery.ajax(
        '/api/holiday',
        {
            method: 'POST',
            success: cb,
            error: err_cb
        }
    );
};

var transition = function ( to ) {

    if ( to == _currentScreen ) {
        return false;
    }

    $('body').css({overflow: 'hidden'});
    if ( to > _currentScreen ){
        $('#big-container-'+_currentScreen).toggle('slide', { direction: "up", duration: _transitionTime });
        $('#big-container-'+to).toggle('slide', { direction: "down", duration: _transitionTime });
        $('#big-container-'+to+' > div.container').fadeIn( _transitionTime );
        $('#big-container-'+_currentScreen+' > div.container').fadeOut( _transitionTime );
    }
    else {
        $('#big-container-'+to).toggle('slide', { direction: "up", duration: _transitionTime });
        $('#big-container-'+_currentScreen).toggle('slide', { direction: "down", duration: _transitionTime });
        $('#big-container-'+to+' > div.container').fadeIn( _transitionTime );
        $('#big-container-'+_currentScreen+' > div.container').fadeOut( _transitionTime );
    }
    setTimeout(function() {
        $('body').css({overflow: 'auto'});
    }, _transitionTime);

    _currentScreen = to;
};
