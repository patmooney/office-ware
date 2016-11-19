'use strict';

exports.controller = function (){
    constructor: ( schema ){
        this.schema = schema;
    }

    /* register
        Creates an organisation and then a user which is the admin
    */
    register: ( req, res ) {

            var warnings;
            var orgData = {};
            var userData = {};
            ['organisation_name'].forEach( (key) => {
                var value = req.params[key];
                if ( ! value ){
                    warnings.push(key);
                }
            });
        });
    }
};
