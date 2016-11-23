import Sequelize    from 'sequelize';

import UserModelClass               from './model/user';
import OrganisationModelClass       from './model/organisation';
import HolidayModelClass            from './model/holiday';

export default function ( dsn ) {
    if ( ! dsn ) {
        throw new Error( 'Database DSN is required' );
    }

    const orm = new Sequelize(dsn, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: true
        },
        //logging: false
    });

    const schema = {
        user: new UserModelClass( orm ),
        organisation: new OrganisationModelClass( orm ),
        holiday: new HolidayModelClass( orm )
    };

    /* relationships */
    schema.holiday.model.belongsTo(schema.user.model,{foreignKey: 'user_id'});
    schema.user.model.hasMany(schema.holiday.model,{foreignKey: 'user_id'});
    schema.user.model.belongsTo(schema.organisation.model,{foreignKey: { name: 'organisation_id', allowNull: true }});
    schema.organisation.model.hasMany(schema.user.model,{foreignKey: 'organisation_id'});

    /* make sure tables are created in order */
    schema.organisation.model.sync().then(
        function () {
            schema.user.model.sync().then(
                function () {
                    schema.holiday.model.sync();
                }
            )
        }
    );

    return schema;
};
