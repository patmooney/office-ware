var db = require('./database.js');
var Sequelize = require('sequelize');
var crypto = require('crypto');
var orm = db.orm;

/* addUser
    returns a Promise
*/
exports.addUser = function ( data ) {
    return _checkExists( data.email ).then(
        function () {
            if ( data.jwt ){
                return _addUser( _enrichFromJWT(data) );
            }
            return _addAdmin( data );
        },
        function () {
            return Promise.reject("Email already exists");
        }
    );
};

var _addUser = function ( data ) {
    return User.create(
        {
            email: data.email,
            password: crypto.createHash('sha256').update(data.password, 'utf8').digest(),
            firstname: data.firstname,
            lastname: data.lastname,
            group_id: data.group_id
        }
    );
};

var _checkExists = function ( email )
    return User.findAll({
        where: {
            email: data.email
        }
    }).then(
        function ( result ) {
            if ( result.length ){
                return Promise.reject();
            }
        }
    );
};

var Group = orm.define(
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

var User = orm.define(
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
