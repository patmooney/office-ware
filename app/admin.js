import $ from 'jquery';
import Transition from 'transition';
import Request from 'request';

$(function () {

    var refreshUnauthorised = function () {
        Request.submitRequest(
            {
                url: '/api/admin/unauthorised',
                method: 'GET'
            },
            function ( data ) {
                console.log(data);
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
