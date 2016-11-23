import $ from 'jquery';
import Transition from 'transition';
import Request from 'request';
import unauthorisedRow from './templates/admin/unauthorised-row.hbs';
import userRow from './templates/admin/user-row.hbs';

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
                    unauthorisedRow(data.data)
                );
            }
        );
    };

    var refreshUsers = function () {
        Request.submitRequest({
            url: '/api/organisation/users',
            method: 'GET'
        }).then(
            function ( data ){
                $('table#users > tbody').html(
                    userRow(data.data)
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
        },
        users: {
            callback: function () {
                refreshUsers();
            }
        }
    });
});
