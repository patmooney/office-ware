"use strict";

import model from './organisation/model';

export default {
    add: function ( data ){
        return model.orm.create( data );
    }
};
