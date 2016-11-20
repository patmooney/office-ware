'use strict';

export default class {
    constructor ( schema, templates ) {
        this.schema = schema;
        this.templates = templates;
    }

    /* get the holiday request form */
    request ( req, res ) { // get
        return res.send(
            this.templates['index']({
                firstname: req.user.firstname,
                is_admin: req.user.is_admin
            })
        );
    }
};
