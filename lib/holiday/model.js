"use strict";

const orm = require('../database').orm;
const Sequelize = require('sequelize');

var model = exports.orm = orm.define(
    'holiday',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        type: { type Sequelize.STRING },
        date_from: { type: Sequelize.DATE },
        date_to: { type: Sequelize.DATE },
        user_id: { type: Sequelize.INTEGER },
        authorised: { type: Sequelize.BOOLEAN }
    },
    {
        /*
        createdAt: false,
        updatedAt: false,
        */
    }
);
model.sync();

exports.search = function ( where ){ return model.findAll({ where:where }); };
exports.find = function ( id ){ return model.findById(id); };
