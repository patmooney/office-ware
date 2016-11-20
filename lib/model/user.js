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
                    type: Sequelize.STRING(256)
                },
                allowed_days: {
                    type: Sequelize.INTEGER
                },
                organisation_id: {
                    type: Sequelize.INTEGER
                },
                is_admin: {
                    type: Sequelize.BOOLEAN
                }
            }
        );
        this.model.sync();
    }

    /* add
        returns a Promise
    */
    add ( data ) {
        var _this = this;
        return this._checkExists( data.email ).then(
            function () {
                return _this._addUser( data );
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
        return this.model.findById( id );
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

    _addUser ( data ) {
        var row = {
            email: data.email,
            pwd_sha256: crypto.createHash('sha256')
                .update(data.password, 'utf8').digest().toString('hex'),
            firstname: data.firstname,
            lastname: data.lastname,
            group_id: data.group_id,
            is_admin: data.is_admin || false
        };
        return this.model.create( row );
    }

    _checkExists ( email ) {
        return this.search({
            email: email
        }).then(
            function ( result ) {
                return result.length > 0 ? Promise.reject() : Promise.resolve();
            }, function ( err ){ console.log( err ); }
        );
    }
};
