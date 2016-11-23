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
        logging: false
    });

    const schema = {
        user: new UserModelClass( orm ),
        organisation: new OrganisationModelClass( orm ),
        holiday: new HolidayModelClass( orm )
    };

    /* relationships */
    schema.holiday.model.belongsTo(schema.user.model,{foreignKey: 'user_id'});
    schema.user.model.hasMany(schema.holiday.model,{foreignKey: 'user_id'});
    schema.organisation.model.hasMany(schema.user.model,{foreignKey: 'organisation_id'});

    /* ensure the models are in sync with the DB */
    Object.keys( schema ).forEach( (key) => {
        schema[key].model.sync();
    });

    return schema;
};
