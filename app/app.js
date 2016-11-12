import $ from 'jquery';
import Handlebars from 'handlebars';
import holidayListTemplate from 'templates/holiday-list.hbs';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';
import Navigo from 'navigo';
import Transition from 'transition';

$(function () {

    var transition = new Transition();
    transition.setup();

    $( "#view-holiday" ).click( () => {
        router.navigate('/holiday');
    });
    $( "#go-back" ).click( () => {
        router.navigate('/');
    });

    $( "#datepicker-from, #datepicker-to" ).datepicker();
    $( "#send-request" ).click( () => {
        transition( "sending" );
        submitRequest(
            data => {
                refreshHoliday();
                transition("current");
            },
            ( aj, stat, err ) => {
                $('#view-container-2 > div').html(
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
                success: data => {
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

    var showHolidayRequest = function(){
    };
    var showCurrentHoliday = function(){
        refreshHoliday();
    };

    var router = new Navigo( null, true ); // root, useHash
    router.on({
        '/': () => {
            transition.transition('request');
            return showHolidayRequest();
        },
        '/holiday': () => {
            transition.transition('current');
            return showCurrentHoliday();
        }
    }).resolve();
});
