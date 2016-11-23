import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';
import Transition from 'transition';
import Request from 'request';
import holidayListTemplate from './templates/holiday/holiday-row.hbs';
import LoadingScreen from './loading';

$(function () {

    Request.submitRequest(
        {
            url: '/api/user/remaining',
            method: 'GET'
        }
    );

    var _validator = {
        request: {
            date_from: /^[0-9\/]+/,
            date_to: function ( val ) {
                if ( ! val ){ return false; }
                var from_time = new Date($('form#request').find('input#date_from').first().val()).getTime();
                var to_time = new Date(val).getTime();
                return to_time > from_time;
            }
        }
    };

    var loadingScreen = new LoadingScreen();
    
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
                    if ( confirm("Are you sure you would like to delete this holiday?") ){
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
                    }
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
        loadingScreen.show();
        Request.submitRequest(
            {
                url: '/api/holiday',
                form: 'request',
                validate: _validator.request
            }
        ).then(
            function ( data ){
                $('form#request > div#error').html('');
                _newId = data.id;
                transition.navigate("current");
                loadingScreen.hide();
            },
            function ( error ) {
                $('form#request > div#error').html(
                    "<strong>Error</strong>" + "<p>"+error+"</p>"
                );
                loadingScreen.hide();
            }
        );
    });

    /* thanks http://stackoverflow.com/a/3827570 */
    var customRange = function ( input ) {
        if (input.id == 'date_to') {
            return {
                minDate: new Date($('#date_from').val())
            };
        }
    };

    $( "input#date_from, input#date_to" ).datepicker({
        constrainInput: true,
        beforeShow: customRange
    });

});
