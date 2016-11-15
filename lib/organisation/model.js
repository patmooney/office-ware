var db = require('./database.js');
var Sequelize = require('sequelize');
var orm = db.orm;

var Group = orm.define(
    'holiday_group',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        admin_id: { type: Sequelize.INTEGER },
        group_name: { type: Sequelize.STRING }
    },
    {
        /*
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
        */
    }
);
