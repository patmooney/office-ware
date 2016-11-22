import $ from 'jquery';
import Transition from 'transition';
import Request from 'request';
import UnauthorisedRow from './templates/admin/unauthorised-row.hbs';
$(function () {

    var refreshUnauthorised = function () {
        Request.submitRequest(
            {
                url: '/api/holiday/unauthorised',
                method: 'GET'
            }
        ).then(
            function ( data ) {
                $('table#unauthorised > tbody').html(
                    UnauthorisedRow(data.data)
                );
            }
        );
    };

    var transition = new Transition();
    transition.init({
        unauthorised: {
            callback: function () {
                refreshUnauthorised();
            }
        }
    });
});
