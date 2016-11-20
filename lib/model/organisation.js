import Sequelize from 'sequelize';

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
                admin_id: {
                    type: Sequelize.INTEGER
                },
                name: {
                    type: Sequelize.STRING
                }
            }
        );
        this.model.sync();
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
