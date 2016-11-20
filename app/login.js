import $ from 'jquery';
import Transition from 'transition';
import Request from 'request'

$(function () {
    var _validate = {
        register: {
            firstname: /^[a-zA-Z\.\-]+$/,
            lastname: /^[a-zA-Z\.\-]+$/,
            email: /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            password: /^.{8,}$/,
            passwordAgain: function ( val ) {
                return $('form#register').find('input#password').val() === val;
            },
            organisation: /^[a-zA-Z\.\-0-9\s]+$/
        }
    };

    var transition = new Transition();
    transition.init();

    $('button#register').click( () => {
        Request.submitRequest(
            {
                form: 'register',
                url: '/organisation',
                method: 'POST',
                validate: _validate['register']
            },
            function (){
                window.location = '/admin';
            },
            function ( data ) {
                console.log( data );
            }
        );
    });

    $('button#login').click( () => {
        Request.submitRequest(
            {
                form: 'login',
                url: '/login',
                method: 'POST'
            },
            function (){
                window.location = '/';
            },
            function ( data ) {
                console.log( data );
            }
        );
    });
});
