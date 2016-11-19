"use strict";

const orm = require('../database').orm;
const Sequelize = require('sequelize');

var model = exports.orm = orm.define(
    'user',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        firstname: { type: Sequelize.STRING },
        lastname: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        pwd_sha256: { type: Sequelize.STRING(256) },
        allowed_days: { type: Sequelize.INTEGER },
        organisation_id: { type: Sequelize.INTEGER }
    },
    {
        /*
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
        */
    }
);
model.sync();

exports.search = function ( where ){ return model.findAll({ where:where }); };
exports.find = function ( id ){ return model.findById(id); };
