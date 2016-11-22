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
    }

    getUnauthorised ( org_id ){
        return this.model.findAll({
            include: [
                {
                    model: this.relationships.user.model,
                    where: {
                        organisation_id: org_id
                    },
                    attributes: [ 'firstname', 'lastname', 'email', 'id' ]
                }
            ]
        });
    }

    getUserCurrentHoliday ( user_id ) {
        return this.model.findAll({
            where: { user_id: user_id },
            order: [ [ "date_from", "DESC" ] ]
        });
    }

    newHoliday ( user, holiday ) {
        return this.model.create({
            authorised: false,
            date_from: holiday.date_from,
            date_to: holiday.date_to,
            type: holiday.type,
            user_id: user.id
        });
    }

    deleteHoliday ( holiday_id, user ) {
        return this.model.destroy({
            where: {
                id: holiday_id,
                user_id: user.id
            }
        });
    }
};
