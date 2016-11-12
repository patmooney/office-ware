import $ from 'jquery';
import Transition from 'transition';

$(function () {
    var submitRequest = function ( cb, err_cb ) {
        jQuery.ajax(
            '/api/register',
            {
                method: 'POST',
                success: cb,
                error: err_cb
            }
        );
    };

    var transition = new Transition();
    transition.init({
        'register-organisation': {
            options: {
                organisation: true
            },
            template: 'templates/subviews/register'
        }
    });
});
