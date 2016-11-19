import $ from 'jquery';
import Transition from 'transition';


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
            organisation: /^[a-zA-Z\.\-0-9]+$/
        }
    };

    var _validateField = function ( value, validator ){
        if ( validator === undefined ){ // no validator
            return true;
        }
        if ( typeof(validator) === 'function' ){ // function
            return validator(value);
        }
        return validator.test( value ); // regex
    };

    var highlightWarnings = function( warnings, form ) {
        warnings.forEach( (field) => {
            $(`form#${form}`).find(`:input#${field}`).addClass('warning');
        });
    };

    var validateForm = function ( form ) {
        var values = {};
        $(`form#${form}`).find(':input').each( ( _, inp ) => {
            values[$(inp).attr('id')] = $(inp).val();
        });

        var warnings = [];
        var validator = _validate[form];
        if ( validator ) {
            Object.keys( values ).forEach( (key) => {
                var fieldValidator = validator[key];
                if ( ! _validateField( values[key], validator[key] ) ){
                    warnings.push(key);
                }
                else {
                    $(`form#${form}`).find(`:input#${key}`).removeClass('warning');
                }
            });
            if ( warnings.length ) {
                highlightWarnings( warnings, form );
                return false;
            }
        }

        return values;
    };

    var submitRequest = function ( opts, cb, err ) {
        var values = validateForm( opts.form );
        if ( values ) {
            return jQuery.ajax(
                opts.url,
                {
                    data: JSON.stringify(values),
                    method: opts.method || 'POST',
                    success: cb,
                    error: err,
                    contentType: 'application/json'
                }
            );
        }
    };

    var transition = new Transition();
    transition.init();

    $('button#register').click( () => {
        submitRequest(
            {
                form: 'organisation',
                url: '/organisation',
                method: 'POST',
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
        submitRequest(
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
