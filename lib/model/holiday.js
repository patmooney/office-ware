import Sequelize from 'sequelize';
import UserModelClass from './user';

export default class {
    constructor ( orm ) {
        this.relationships = { user: new UserModelClass( orm ) };
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
                    type: Sequelize.INTEGER,
                },
                authorised: {
                    type: Sequelize.BOOLEAN
                }
            }
        );
        this.model.belongsTo(
            this.relationships.user.model,
            {
                foreignKey:'user_id'
            }
        );
    }

    getUnauthorised ( org_id ){
        return this.findAll({
            where: {
                'Users.organisation_id': org_id
            },
            include: [
                {
                    model: this.relationships.user.model,
                    as: 'Users'
                }
            ]
        });
    }
};
