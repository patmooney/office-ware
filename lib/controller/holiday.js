'use strict';

export default class {
    constructor ( schema ) {
        this.schema = schema;
    }

    request ( req, res ) {
        return res.send(`user: ${req.user.id}, org: ${req.user.organisation_id}`);
    }
};
