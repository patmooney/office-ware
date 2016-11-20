'use strict';

export default class {
    constructor ( schema, templates ) {
        this.schema = schema;
        this.templates = templates;
    }

    /* get the holiday request form */
    request ( req, res ) { // get
        return res.send(
            this.templates['holiday']({
                firstname: req.user.firstname,
                isAdmin: req.user.is_admin
            })
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
