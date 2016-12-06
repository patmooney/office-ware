import $ from 'jquery';
import Transition from 'transition';
import Request from 'request';
import unauthorisedRow from './templates/admin/unauthorised-row.hbs';
import userRow from './templates/admin/user-row.hbs';

$(function () {

    var refreshUnauthorised = function () {
        var unauthorisedPromise = Request.submitRequest(
            {
                url: '/api/holiday/unauthorised',
                method: 'GET'
            }
        ).then(
            function ( data ) {
                var authData = data.data.unauthorised.map( function (row) {
                    var remaining_after = row.user.days_remaining - row.day_total;
                    return Object.assign(
                        row,
                        {
                            remaining_after: remaining_after,
                            remaining_warn: ( remaining_after < 0 ) ? true: false
                        }
                    );
                });
                $('div#unauthorised').html(
                    unauthorisedRow({ unauthorised: authData })
                );
                $('a[data-action="authorise-holiday"').on( 'click', function ( e ) {
                    console.log( e );
                });
                $('a[data-action="decline-holiday"').on( 'click', function ( e ) {
                });
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
