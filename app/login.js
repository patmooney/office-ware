import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/effect';
import Transition from 'transition';
import Request from 'request';
import LoadingScreen from './loading';

$(function () {

    var loadingScreen = new LoadingScreen();

    var _validate = {
        register: {
            firstname: /^[a-zA-Z\.\-]+$/,
            lastname: /^[a-zA-Z\.\-]+$/,
            email: /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
            password: /^.{8,}$/,
            passwordAgain: function ( val ) {
                return $('form#register').find('input#password').val() === val;
            },
            organisation: /^[a-zA-Z\.\-0-9\s]+$/,
            reset_date: /^[0-9\/]+$/
        }
    };

    var transition = new Transition();
    transition.init();

    $('button#register').click( () => {
        loadingScreen.show();
        Request.submitRequest(
            {
                form: 'register',
                url: '/organisation',
                method: 'POST',
                validate: _validate['register']
            }
        ).then(
            function (){
                loadingScreen.hide();
                window.location = '/admin';
            },
            function ( error ) {
                loadingScreen.hide();
                console.log( error );
            }
        );
    });

    $('button#login').click( () => {
        loadingScreen.show();
        Request.submitRequest(
            {
                form: 'login',
                url: '/login',
                method: 'POST'
            }
        ).then(
            function (){
                loadingScreen.hide();
                window.location = '/';
            },
            function ( error ) {
                loadingScreen.hide();
                console.log( error );
            }
        );
    });

    $( "input#reset_date" ).datepicker({
        constrainInput: true
    });

});
