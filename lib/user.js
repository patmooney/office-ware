"use strict";

const crypto = require('crypto');
const model = require('./user/model');

/* add
    returns a Promise
*/
exports.add = function ( data ) {
    console.log( data );
    return _checkExists( data.email ).then(
        function () {
            if ( data.jwt ){
                return _addUser( _enrichFromJWT(data) );
            }
            return _addAdmin( data );
        },
        function () {
            return Promise.reject("Email already exists");
        }
    );
};

var _addAdmin = function ( data ) {
    return _addUser( data );
}

var _addUser = function ( data ) {
    return model.orm.create(
        {
            email: data.email,
            password: crypto.createHash('sha256').update(data.password, 'utf8').digest(),
            firstname: data.firstname,
            lastname: data.lastname,
            group_id: data.group_id
        }
    );
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
