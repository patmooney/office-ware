import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';
import Transition from 'transition';

$(function () {
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

    var transition = new Transition();
    transition.init({
        'current': {
            callback: function () { refreshHoliday(); }
        }
    });
});
