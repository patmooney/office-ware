import Sequelize from 'sequelize';
import UserModelClass from './user';
import HolidayModelClass from './holiday';

export default class {

    constructor ( orm ){
        this.relationships = { user: new UserModelClass( orm ), holiday: new HolidayModelClass( orm ) };
        this.model = orm.define(
            'organisation',
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                admin_id: {
                    type: Sequelize.INTEGER
                },
                name: {
                    type: Sequelize.STRING
                },
                reset_date: {
                    type: Sequelize.DATE
                }
            }
        );
    }

    add ( data ){
        return this.model.create( data );
    }
    search ( where ){
        return this.model.findAll({ where: where });
    }
    find ( id ){
        return this.model.findById( id );
    }

    listUsers ( org_id ) {
        var _this = this;
        return this._getUsers(org_id).then(
            function ( data ) {
                var promises = data.users.map( (user) => {
                    return _this.relationships.holiday.holidaysThisYear( user.id, data.org.reset_date );
                });

                return Promise.all( promises ).then(
                    function ( values ) {
                        return data.users.map( (user) => {
                            var days = values.shift();
                            user.days_remaining = user.allowed_days - days;
                            user.days_used = days;
                            return user;
                        });
                    }
                );
            }
        );
    }

    _getUsers ( org_id ) {
        var userPromise = this.relationships.user.model.findAll({
            where: {
                organisation_id: org_id
            }
        });
        var orgPromise = this.find( org_id );
        
        return Promise.all([userPromise,orgPromise]).then(
            function ( values ){
                var results = values[0];
                var organisation = values[1];
                return {
                    users: results.map( (row) => {
                        return {
                            name: row.fullName,
                            email: row.email,
                            allowed_days: row.allowed_days,
                            id: row.id
                        }
                    }),
                    org: organisation
                };
            }
        );
    }
};
