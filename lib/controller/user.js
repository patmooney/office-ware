'use strict';

import jwt from 'jsonwebtoken';

export default class {

    constructor ( schema ) {
        this.schema = schema;
    }

    /* registerDetails
        After the JWT login gate, this completes the registration of a user against
        an organisation
    */
    registerDetails ( req, res ) {

        var user = {};
        var missing = [];
        ['firstname','organisation_id','lastname','email','password'].forEach( (key) => {
            var val = req.signedCookies[key];
            if ( typeof(val) === 'undefined' || val === "" ){
                missing.push(key);
            }
            user[key]=val;
        });

        // all fields are mandatory
        if ( missing.length ){
            return res.status(400).send( 'missing fields: ' + missing.join(', ') );
        }

        return this.schema.user.add( user ).then(
            function ( user ) {
                res.cookie('user_id',user.id,{signed:true});
                res.cookie('org_id',user.organisation_id,{signed:true});
                return res.status(200).send('OK');
            },
            function ( error ) {
                return res.status(400).send( error );
            }
        );
    }

    /* register
        First step for a user being registered, will decompose JWT and assign it to the
        session cookie
    */
    register ( req, res ) {

        if ( ! req.params.jwt ){
            return res.status(401).send('Unauthorised');
        }

        jwt.verify( req.params.jwt, process.env.JWT_SECRET, function ( err, decoded ) {
            if ( err ) {
                return res.status(401).send('Unauthorised');
            }

            this.schema.organisation.find({
                where: {
                    holiday_organisation_id: decoded.organisation_id
                }
            }).then(
                function( org ) {
                    Object.keys( decoded ).forEach( (key) => {
                        res.cookie( key, decoded[key], { signed: true });
                    });

                    return res.send( templates['register']({organisation: org.name}) );
                },
                function ( ){
                    return res.status(400).send('Organisation not found');
                }
            );
        });
    }
};
