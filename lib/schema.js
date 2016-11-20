import Sequelize    from 'sequelize';

import UserModelClass               from './model/user';
import OrganisationModelClass       from './model/organisation';
import HolidayModelClass            from './model/holiday';

const orm = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: true
    }
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

export default schema;
