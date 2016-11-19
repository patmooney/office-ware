'use strict';

function controller ( schema ) {
    this.schema = schema;
}

controller.prototype.request = function ( req, res, user ) {
    res.send(`user: ${user.id}, org: ${user.organisation_id}`);
};

exports.controller = controller;
