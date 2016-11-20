import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';
import Transition from 'transition';
import Request from 'request';

$(function () {
    $( "#datepicker-from, #datepicker-to" ).datepicker();

    $( "button#request" ).click( () => {
        transition( "sending" );
        Request.submitRequest(
            {
                url: '/api/holiday',
                form: 'request'
            },
            function ( data ){
                refreshHoliday();
                transition("current");
            },
            function ( err ) {
                $('#view-container-2 > div').html(
                    "<h3>"+err+"</h3>" +
                    "<p>Something bad has happened," +
                    "<a href='#' onclick='makeTransition(\"view\")'>go back</a>"
                );
            }
        );
    });

    var refreshHoliday = function () {
        Request.submitRequest(
            {
                url: '/api/holiday',
                method: 'GET'
            },
            function ( data ) {
                $('.holiday-list-container').html(
                    holidayListTemplate({ fixtures: data.data, hello: "sausage" })
                );
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
