'use strict';

var Sequelize = require('sequelize');

exports.orm = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});
