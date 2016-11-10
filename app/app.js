import $ from 'jquery';
import Handlebars from 'handlebars';
import holidayListTemplate from 'templates/holiday-list.hbs';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';

$(function () {
    var _transitionTime = 1000;
    var _currentScreen = 1;

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

    var refreshHoliday = function () {
        jQuery.ajax(
            '/api/holiday',
            {
                success: function ( data ){
                    $('.holiday-list-container').html(
                        holidayListTemplate({ fixtures: data.data, hello: "sausage" })
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
        console.log( to, _currentScreen );

        if ( to == _currentScreen ) {
            return false;
        }

        $('body').css({overflow: 'hidden'});
        if ( to > _currentScreen ){
            $('#big-container-'+_currentScreen).animate({ top: "-150%" }, { duration: _transitionTime, queue: false } );
            $('#big-container-'+_currentScreen).fadeOut( { duration: _transitionTime, queue: false } );
            $('#big-container-'+to).animate({ top: '0%'}, { duration: _transitionTime, queue: false } );
            $('#big-container-'+to).fadeIn( { duration: _transitionTime, queue: false } );
        }
        else {
            $('#big-container-'+to).animate({ top: "0%" }, { duration: _transitionTime, queue: false } );
            $('#big-container-'+to).fadeIn( { duration: _transitionTime, queue: false } );
            $('#big-container-'+_currentScreen).animate({ top: '150%'}, { duration: _transitionTime, queue: false } );
            $('#big-container-'+_currentScreen).fadeOut( { duration: _transitionTime, queue: false } );
        }

        setTimeout(function() {
            $('body').css({overflow: 'auto'});
        }, _transitionTime);

        _currentScreen = to;
    };
    window.makeTransition = transition;
});
