'use strict';

var orm = require('../database').orm;
var Sequelize = require('sequelize');

var model = exports.model = orm.define(
    'organisation',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        admin_id: { type: Sequelize.INTEGER },
        name: { type: Sequelize.STRING }
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
exports.find = function ( where ){ return model.findOne({ where:where }); };
