import $ from 'jquery';

/* request.js
Ajax utility methods, will scrape values from the
given form and validate any fields where specified.
If a field value is invalid, it will be highlighted in red
and the request will not complete

Usage:
    $this.submitRequest(
        {
            form: 'my-form-id',
            url: '/api/my-url',
            method: 'POST', // default POST
            validate: {
                email: new RegExp('\@.+\..+'),
                password: function ( value ) { return value.length >= 8; }
            }
        }
    ).then(
        function ( data ) { // success },
        function ( err ) { // failure }
    );
*/

export default class {

    static _validateField ( value, validator ){
        if ( validator === undefined ){ // no validator
            return true;
        }
        if ( typeof(validator) === 'function' ){ // function
            return validator(value);
        }
        return validator.test( value ); // regex
    }

    static highlightWarnings( warnings, form ) {
        warnings.forEach( (field) => {
            $(`form#${form}`).find(`:input#${field}`).addClass('warning');
        });
    }

    static validateForm ( form, validator ) {
        var values = {};
        $(`form#${form}`).find(':input').each( ( _, inp ) => {
            values[$(inp).attr('id')] = $(inp).val();
        });

        var warnings = [];
        if ( validator ) {
            Object.keys( values ).forEach( (key) => {
                var fieldValidator = validator[key];
                if ( ! this._validateField( values[key], validator[key] ) ){
                    warnings.push(key);
                }
                else {
                    $(`form#${form}`).find(`:input#${key}`).removeClass('warning');
                }
            });
            if ( warnings.length ) {
                this.highlightWarnings( warnings, form );
                return false;
            }
        }

        return values;
    }

    static submitRequest ( opts ) {
        var values;
        var _this = this;

        if ( opts.form ){
            values = this.validateForm( opts.form, opts.validate );
            if ( ! values ) { return Promise.reject("Invalid Input"); }
        }

        return jQuery.ajax(
            opts.url,
            {
                data: values ? JSON.stringify(values) : null,
                method: opts.method || 'POST',
                contentType: 'application/json'
            }
        ).then(
            function ( data ) {
                return data;
            },
            function ( xhr, code, message ) {
                var error = xhr.responseJSON.error || 'Internal Error';
                var missing = xhr.responseJSON.missing;

                if ( missing && missing.length ){
                    var missingString = _this._resolveMissing( opts, missing );
                    error += ": " + missingString;
                }

                return Promise.reject( error );
            }
        );
    }

    static _resolveMissing ( opts, missing ) {
        var missingLabels = [];
        missing.forEach( function ( id ) {
            missingLabels.push( $(`form#${opts.form}`).find(`label[for="${id}"]`).first().text() );
        });
        return missingLabels.join( ', ' );
    }

};
