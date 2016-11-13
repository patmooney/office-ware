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

    var submitRequest = function ( form, cb, err ) {
        var values = validateForm( form );
        if ( values ) {
            return jQuery.ajax(
                `/${form}`,
                {
                    data: values,
                    method: 'POST',
                    success: cb,
                    error: err
                }
            );
        }
    };

    var transition = new Transition();
    transition.init();

    $('button#register').click( () => {
        submitRequest( 'register',
            function (){
                window.location = '/admin';
            },
            function ( data ) {
                console.log( data );
            }
        );
    });

    $('button#login').click( () => {
        submitRequest( 'login',
            function (){
                window.location = '/';
            },
            function ( data ) {
                console.log( data );
            }
        );
    });
});
