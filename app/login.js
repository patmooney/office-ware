import $ from 'jquery';
import Handlebars from 'handlebars';
import registerTemplate from 'templates/holiday-list.hbs';
import Transition from 'transition';

$(function () {
    $('#registration-form').html( registerTemplate() );
    var transition = new Transition();
    transition.setup();

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
});
