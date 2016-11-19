"use strict";

import crypto from 'crypto';
import model from './user/model';

/* add
    returns a Promise
*/
export default {
    add: function ( data ) {
        return _checkExists( data.email ).then(
            function () {
                return _addUser( data );
            },
            function () {
                return Promise.reject("Email already exists");
            }
        );
    },
    update: function ( what, where ) {
        return model.orm.update( what, where );
    },
    search: function ( where ){
        return model.orm.findAll({ where: where });
    },
    find: function ( id ){
        return model.orm.findById( id );
    },
    loginUser: function ( email, password ) {
        return model.orm.findAll({
            where: {
                email: email,
                pwd_sha256: crypto.createHash('sha256')
                            .update(password, 'utf8').digest().toString('hex')
            }
        }).then(
            function ( users ) {
                if ( ! users.length ){
                    return Promise.reject();
                }
                return users[0];
            }
        );
    }
};

var _addUser = function ( data ) {
    var row = {
        email: data.email,
        pwd_sha256: crypto.createHash('sha256')
            .update(data.password, 'utf8').digest().toString('hex'),
        firstname: data.firstname,
        lastname: data.lastname,
        group_id: data.group_id
    };
    return model.orm.create( row );
};

var _checkExists = function ( email ) {
    return model.search({
        email: email
    }).then(
        function ( result ) {
            return result.length > 0 ? Promise.reject() : Promise.resolve();
        }, function ( err ){ console.log( err ); }
    );
};
