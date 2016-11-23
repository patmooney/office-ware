'use strict';

export default class {
    constructor ( schema, templates ) {
        this.schema = schema;
        this.templates = templates;
    }

    /* get the holiday request form */
    index ( req, res ) { // get
        return res.send(
            this.templates['holiday']({
                firstname: req.user.firstname,
                isAdmin: req.user.is_admin
            })
        );
    }

    /* fetch a user's current holiday requests */
    get ( req, res ) {
        this.schema.holiday.getUserCurrentHoliday(
            req.user.id
        ).then(
            function ( results ) {
                return res.json( { data: { holidays: results } } );
            }
        );
    }

    /* new holiday request */
    post( req, res ) {

        var missing = [];
        var body = req.body;
        var holiday = {};
        ['date_from','date_to','type'].forEach( function ( attr ) {
            var value = body[attr];
            if ( value === undefined || value === "" ) {
                missing.push(attr);
            }
            else {
                holiday[attr] = value;
            }
        });

        if ( missing.length ) {
            return res.status(400).json( { error: 'Missing fields', missing: missing } );
        }

        ['message'].forEach( function ( attr ) {
            holiday[attr] = body[attr];
        });

        return this.schema.holiday.newHoliday( req.user, holiday ).then(
            function ( holiday ) {
                return res.status(200).json({ id: holiday.id });
            },
            function ( err ) {
                return res.status(400).json( { error: err } );
            }
        );
    }

    /* delete a holiday */
    delete( req, res ) {
        return this.schema.holiday.deleteHoliday( req.params.holiday_id, req.user ).then(
            function () {
                return res.status(200).send();
            },
            function ( err ) {
                return res.status(400).json({ error: err });
            }
        );
    }

    unauthorised ( req, res ) { // get auth
        this.schema.holiday.getUnauthorised( req.user.organisation_id ).then(
            function ( results ){
                return res.json( { data: { unauthorised: results } } );
            }
        );
    }
};
