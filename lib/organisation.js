"use strict";

import model from './organisation/model';

export default {
    add: function ( data ){
        return model.orm.create( data );
    },
    search: function ( where ){
        return model.orm.findAll({ where: where });
    },
    find: function ( id ){
        return model.orm.findById( id );
    },
    isAdmin: function ( user_id ) {
        return model.orm.findAll({
            admin_id: user_id
        }).then(
            function ( orgs ) {
                return !! orgs.length;
            }
        );
    }
};
