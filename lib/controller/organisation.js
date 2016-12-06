
export default class {
    constructor ( schema, templates ) {
        this.schema = schema;
        this.templates = templates;
    }
    /* register
        Creates an organisation and then a user which is the admin
    */
    register ( req, res ) {

        var _this = this;
        var missing = [];
        var orgData = {};
        var userData = {
            is_admin: true
        };

        ['organisation','reset_date'].forEach( (key) => {
            var val = req.body[key];
            if ( typeof(val) === 'undefined' || val === "" ){
                missing.push(key);
            }
            orgData[key] = val;
        });

        ['firstname','lastname','email','password'].forEach( (key) => {
            var val = req.body[key];
            if ( typeof(val) === 'undefined' || val === "" ){
                missing.push(key);
            }
            userData[key]=val;
        });

        /* all fields are mandatory */
        if ( missing.length ){
            return res.status(400).send( 'missing fields: ' + missing.join(', ') );
        }

        this.schema.user.userNotExists( // check if user exists
            userData.email
        ).then(
            function () {
                return _this.schema.organisation.add(
                    { // add organisation
                        name: orgData['organisation'],
                        reset_date: orgData['reset_date'],
                    }
                ).then(
                    function ( org ) {
                        userData.organisation_id = org.id;
                        return _this.schema.user.addUser( userData ).then(
                            function ( user ) {
                                res.cookie('user_id',user.id,{signed:true});
                                res.cookie('is_admin',true,{signed:true});
                                res.cookie('org_id',org.id,{signed:true});
                                return res.status(200).send('OK');
                            },
                            function ( error ) {
                                return Promise.reject( error );
                            }
                        );
                    }
                )
            },
            function () {
                return res.status(400).send( error || 'User already exists' );
            }
        );
    }

    /* the html entry point */
    index ( req, res ) {
        return res.send(this.templates['admin']());
    }

    listUsers ( req, res ) {
        var _this = this;
        var holidayBalancePromise = this.schema.organisation.find( req.user.organisation_id ).then(
            function ( org ) {
                return _this.schema.holiday.holidaysThisYearPerUser( org.id, org.reset_date );
            }
        );

        var allUsersPromise = this.schema.user.search({
            organisation_id: req.user.organisation_id
        });

        Promise.all([allUsersPromise,holidayBalancePromise]).then(
            function ( values ) {
                var users = values.shift();
                var holidays = values.shift();

                var rows = users.map( (user) => {
                    var row = {
                        days_allowed: user.days_allowed,
                        name: user.fullName,
                        email: user.email
                    };
                    if ( holidays[user.id] === undefined ){
                        row.remaining_days = user.days_allowed;
                        row.used_days = 0;
                    }
                    else {
                        row.remaining_days = user.days_allowed - holidays[user.id];
                        row.used_days = holidays[user.id];
                    }
                    return row;
                });

                return res.json({ data: { users: rows } });
            }
        );
    }
};
