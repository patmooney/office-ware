import $ from 'jquery';
import Handlebars from 'handlebars';
import holidayListTemplate from 'templates/holiday-list.hbs';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';
import Navigo from 'navigo';

$(function () {

    var router = new Navigo( null, true ); // root, useHash

    var _transitionTime = 1000;
    var _currentScreen = "1-request";
    var _pageLoad = true;

    $( "#view-holiday" ).click( function () {
        router.navigate('/holiday');
    });
    $( "#go-back" ).click( function () {
        router.navigate('/');
    });

    $( "#datepicker-from, #datepicker-to" ).datepicker();
    $( "#send-request" ).click( function () {
        transition( "2-sending" );
        submitRequest(
            function ( data ) {
                refreshHoliday();
                transition(3);
            },
            function ( aj, stat, err ){
                $('#big-container-2 > div').html(
                    "<h3>"+err+"</h3>" +
                    "<p>Something bad has happened, <a href='#' onclick='makeTransition(\"view\")'>go back</a>"
                );
            }
        );
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

    /* 
        all ".big-containers" are assigned a data-view attribute, then transitions
        are based on their current location.
        when the page first loads, the order is arranged so the first screen
    */
    var transition = function ( to ) {
        var slideTime = _pageLoad ? 0 : _transitionTime;
        var fadeTime = _transitionTime + 200;
        var $current = $(`.big-container[data-view="${_currentScreen}"]`);
        var $to = $(`.big-container[data-view="${to}"]`);

        // where the 'current' view should end up
        var curAnim = to > _currentScreen ? { top: "-150%" } : { top: '150%' };
        // where the 'to' view should being
        var toAnim = to > _currentScreen ? { top: "150%" } : { top: '-150%' };

        if ( _pageLoad ) {
            _pageLoad = false;
            slideTime = 0;
        }
        else if ( to == _currentScreen ) {
            return false;
        }
        
        $('body').css({overflow: 'hidden'});
        setTimeout(function() {
            $('body').css({overflow: 'auto'});
        }, fadeTime);

        if ( $current ) {
            $current.animate(curAnim, { duration: slideTime, queue: false });
            $current.fadeOut( { duration: fadeTime, queue: false } );
        }
        if ( $to ) {
            $to.css(toAnim);
            $to.animate({ top: "0%" }, { duration: slideTime, queue: false } );
            $to.fadeIn( { duration: fadeTime, queue: false } );
        }

        _currentScreen = to;
    };

    var showHolidayRequest = function(){
    };
    var showCurrentHoliday = function(){
        refreshHoliday();
    };

    router.on({
        '/': function () {
            transition('1-request');
            return showHolidayRequest();
        },
        '/holiday': function () {
            transition('3-current');
            return showCurrentHoliday();
        }
    }).resolve();

    window.makeTransition = transition;
});
