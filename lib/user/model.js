"use strict";

const orm = require('../database').orm;
const Sequelize = require('sequelize');
const organisation = require('../organisation/model');

var model = exports.orm = orm.define(
    'user',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        firstname: { type: Sequelize.STRING },
        lastname: { type: Sequelize.STRING },
        email: { type: Sequelize.STRING },
        pwd_sha256: { type: Sequelize.STRING },
        allowed_days: { type: Sequelize.INTEGER },
        organisation_id: {
            type: Sequelize.INTEGER,
            references: {
                model: organisation,
                key: 'id'
            }
        }
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
