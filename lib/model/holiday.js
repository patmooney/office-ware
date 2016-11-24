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
                message: {
                    type: Sequelize.STRING(255)
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
                },
                day_total: {
                    type: Sequelize.INTEGER,
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
            user_id: user.id,
            day_total: this._dateDiff( holiday.date_from, holiday.date_to )
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

    _dateDiff ( from, to ) {
        var diff = Math.abs( // diff in milliseconds
            (new Date(to)) - (new Date(from))
        );
        // milliseconds to days
        return Math.floor( diff / ( 86400 * 1000 ) );
    }

    search ( where ) { return this.model.findAll({ where: where }); }

    /* holidaysThisYear
        given a user_id and the reset date of an organisation, this method
        will return the number of whole days the user has booked off inclusive
        of the holiday term
    */
    holidaysThisYear( user_id, reset_date ){

        var _this = this;
        reset_date = new Date( reset_date );
        var prev_reset_date = new Date( reset_date );
        prev_reset_date.setFullYear( reset_date.getFullYear() - 1 );

        return this.search({
            user_id: user_id,
            $or: [
                {
                    date_from: {
                        $lt: reset_date,
                        $gt: prev_reset_date
                    }
                },
                {
                    date_to: {
                        $lt: reset_date,
                        $gt: prev_reset_date
                    }
                }
            ]
        }).then(
            function ( results ) {
                var days = 0;
                results.forEach ( function ( row ) {
                    var a = _this._inclusiveDays( row, prev_reset_date, reset_date );
                    days += a;
                });
                return days;
            }
        );
    }

    holidaysThisYearPerUser( org_id, reset_date ){

        var _this = this;
        reset_date = new Date( reset_date );
        var prev_reset_date = new Date( reset_date );
        prev_reset_date.setFullYear( reset_date.getFullYear() - 1 );

        return this.model.findAll({
            where: {
                authorised: true,
                $or: [
                    {
                        date_from: {
                            $lt: reset_date,
                            $gt: prev_reset_date
                        }
                    },
                    {
                        date_to: {
                            $lt: reset_date,
                            $gt: prev_reset_date
                        }
                    }
                ]
            },
            include: {
                association: this.User,
                attributes: [],
                where: {
                    organisation_id: org_id
                }
            }
        }).then(
            function ( results ) {
                var holidays = {};
                results.forEach ( function ( row ) {
                    
                    if ( holidays[row.user_id] === undefined ){
                        holidays[row.user_id] = 0;
                    }

                    var a = _this._inclusiveDays( row, prev_reset_date, reset_date );
                    holidays[row.user_id] += a;
                });

                return holidays;
            }
        );
    }

    _inclusiveDays ( row, from_reset_date, to_reset_date ){
        var f = (new Date( row.date_from )).getTime();
        var t = (new Date( row.date_to )).getTime();
        var rf = from_reset_date.getTime();
        var rt = to_reset_date.getTime();

        if ( f >= rf && t < rt ){ //inside the year
            return row.day_total;
        }
        
        if ( f >= rf && t >= rt ){ //spans over the reset date
            var diff = t - rt;
            return diff / ( 1000 * 86400 );
        }

        if ( f < rf && t < rt ){ //spans before the last reset date
            var diff = rf - f;
            return diff / ( 1000 * 86400 );
        }

        if ( f < rf && t > rt ){ //spans the whole year
            return 365;
        }
    }
};
