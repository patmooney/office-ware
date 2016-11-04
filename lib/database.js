var Sequelize = require('sequelize');


var orm = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: true
  }
});
exports.orm = orm;

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

exports.User.findAll().then( function( items ) {
    console.log( items );
});
