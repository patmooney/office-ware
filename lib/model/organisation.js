import Sequelize from 'sequelize';
import UserModelClass from './user';
import HolidayModelClass from './holiday';

export default class {

    constructor ( orm ){
        this.model = orm.define(
            'organisation',
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
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

};
