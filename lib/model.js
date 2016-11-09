var db = require('./database.js');
var Sequelize = require('sequelize');

var orm = db.orm;

exports.submitRequest = function ( data ) {
    fixtures.push( data );
};

var fixtures = [
    { from: '2016-12-26', to: '2016-12-28', type: 'holiday', approved: false },
    { from: '2016-11-12', to: '2016-11-18', type: 'sick', approved: true }
];
exports.fixtures = fixtures;

exports.Group = orm.define(
    'holiday_group',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        admin_id: { type: Sequelize.INTEGER },
        group_name: { type: Sequelize.STRING }
    },
    {
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    }
);

exports.User = orm.define(
    'holiday_user',
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        email: { type: Sequelize.STRING },
        pwd_sha256: { type: Sequelize.STRING }
    },
    {
        createdAt: false,
        updatedAt: false,
        freezeTableName: true
    }
);

exports.findUser = function () {};

exports.User.findAll().then( function( items ) {
});
