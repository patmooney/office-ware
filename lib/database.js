var Sequelize = require('sequelize');

var orm = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});
exports.orm = orm;
