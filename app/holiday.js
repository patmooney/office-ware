import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';
import Transition from 'transition';
import Request from 'request';
import holidayListTemplate from './templates/holiday/holiday-row.hbs';
import bouncingBall from 'bouncing-ball';

$(function () {

    console.log( bouncingBall );
                    var container = $('<div />',{ "class":"darkness" });
                    $('body').append(container);
                    (new bouncingBall({ ballColour: [ 'red','green','#ff00ee' ] })).bounce(container[0]);



    var _newId;
    window.Handlebars.registerHelper( 'formatDate', function ( date ) {
        return new Intl.DateTimeFormat().format(new Date(date));
    });
    var refreshHoliday = function () {
        return Request.submitRequest(
            {
                url: '/api/holiday',
                method: 'GET'
            }
        ).then(
            function ( data ) {
                if ( _newId ){
                    data.data.holidays.forEach( function ( row ) {
                        if ( row.id === _newId ){
                            row.highlight = true;
                        }
                    });
                }

                $('table#current-holiday > tbody').html(
                    holidayListTemplate( data.data )
                );

                // set up actions
                $( "i#action-delete" ).click( ( e ) => {
                    var row = $(e.target).parents('tr');
                    var id = $(e.target).attr('data-holiday-id');

                    Request.submitRequest(
                        {
                            url: `/api/holiday/${id}`,
                            method: 'DELETE'
                        }
                    ).then(
                        function () {
                            row.remove();
                        }
                    );
                });
                $( "i#action-edit" ).click( ( e ) => {
                    console.log( "EDIT", $(e.target).attr('data-holiday-id') );
                });
            }
        );
    };

    var transition = new Transition();
    transition.init({
        'current': {
            callback: function () { refreshHoliday(); }
        }
    });

    $( "button#request" ).click( () => {
        transition.navigate( "sending" );
        Request.submitRequest(
            {
                url: '/api/holiday',
                form: 'request'
            }
        ).then(
            function ( data ){
                _newId = data.id;
                transition.navigate("current");
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

    $( "input#date_from, input#date_to" ).datepicker();

});
