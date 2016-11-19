'use strict';

export default class {
    constructor ( schema, templates ) {
        this.schema = schema;
        this.templates = templates;
    }
    /* register
        Creates an organisation and then a user which is the admin
    */
    register ( req, res ) {

        var _this = this;
        var missing = [];
        var orgData = {};
        var userData = {};

        ['organisation'].forEach( (key) => {
            var val = req.body[key];
            if ( typeof(val) === 'undefined' || val === "" ){
                missing.push(key);
            }
            orgData[key] = val;
        });

        ['firstname','lastname','email','password'].forEach( (key) => {
            var val = req.body[key];
            if ( typeof(val) === 'undefined' || val === "" ){
                missing.push(key);
            }
            userData[key]=val;
        });

        /* all fields are mandatory */
        if ( missing.length ){
            return res.status(400).send( 'missing fields: ' + missing.join(', ') );
        }

        this.schema.user.add( userData ).then(
            function ( user ) {
                return _this.schema.organisation.add({
                    name: orgData['organisation'],
                    admin_id: user.id
                }).then(
                    function ( org ) {
                        _this.schema.user.update(
                            {
                                organisation_id: org.id
                            },
                            {
                                where: {
                                    id: user.id
                                }
                            }
                        );
                        res.cookie('user_id',user.id,{signed:true});
                        res.cookie('is_admin',true,{signed:true});
                        res.cookie('org_id',org.id,{signed:true});
                        return res.status(200).send('OK');
                    },
                    function ( err ) {
                        return res.status(400).send( error );
                    }
                )
            },
            function ( error ) {
                return res.status(400).send( error );
            }
        );
    }

    admin ( req, res, user ) {
        console.log( user );
        return res.send(templates['admin']());
    }
};
