import Sequelize from 'sequelize';

export default class {
    constructor ( orm ) {
        this.model = orm.define(
            'holiday',
            {
                id: {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true
                },
                type: {
                    type: Sequelize.STRING
                },
                date_from: {
                    type: Sequelize.DATE
                },
                date_to: {
                    type: Sequelize.DATE
                },
                user_id: {
                    type: Sequelize.INTEGER
                },
                authorised: {
                    type: Sequelize.BOOLEAN
                }
            }
        );
        this.model.sync();
    }
};
