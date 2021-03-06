import crypto from 'crypto';
import orm from '../database';
import Sequelize from 'sequelize';

export default class {

    constructor( orm ){
        this.model = orm.define(
            'user',
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                firstname: {
                    type: Sequelize.STRING
                },
                lastname: {
                    type: Sequelize.STRING
                },
                email: {
                    type: Sequelize.STRING
                },
                pwd_sha256: {
                    type: Sequelize.STRING(64)
                },
                days_allowed: {
                    type: Sequelize.INTEGER
                },
                days_remaining: {
                    type: Sequelize.INTEGER
                },
                organisation_id: {
                    type: Sequelize.INTEGER
                },
                is_admin: {
                    type: Sequelize.BOOLEAN
                }
            },
            {
                getterMethods: {
                    fullName: function()  { return this.firstname + ' ' + this.lastname; }
                }
            }
        );
    }

    /* add
        returns a Promise
    */
    add ( data ) {
        var _this = this;
        return this.userNotExists( data.email ).then(
            function () {
                return _this.addUser( data );
            },
            function () {
                return Promise.reject("Email already exists");
            }
        );
    }

    update ( what, where ) {
        return this.model.update( what, where );
    }

    search ( where ){
        return this.model.findAll({ where: where });
    }

    find ( id ){
        return this.model.findOne({
            where: { id: id },
            include: [this.Organisation]
        });
    }

    loginUser ( email, password ) {
        return this.model.findAll({
            where: {
                email: email,
                pwd_sha256: crypto.createHash('sha256')
                            .update(password, 'utf8').digest().toString('hex')
            }
        }).then(
            function ( users ) {
                if ( ! users.length ){
                    return Promise.reject();
                }
                return users[0];
            }
        );
    }

    addUser ( data ) {
        var row = {
            email: data.email,
            pwd_sha256: crypto.createHash('sha256')
                .update(data.password, 'utf8').digest().toString('hex'),
            firstname: data.firstname,
            lastname: data.lastname,
            organisation_id: data.organisation_id,
            group_id: data.group_id,
            is_admin: data.is_admin || false,
            days_allowed: data.days_allowed || 0,
            days_remaining: data.days_remaining || 0
        };
        return this.model.create( row );
    }

    userNotExists ( email ) {
        return this.search({
            email: email
        }).then(
            function ( result ) {
                return result.length > 0 ? Promise.reject() : Promise.resolve();
            }, function ( err ){ console.log( err ); }
        );
    }

};
