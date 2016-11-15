'use strict';
 
const assert = require('assert');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
process.env.DATABASE_URL="sqlite::memory:";

describe('User - UserService (using sequelizeMockingMocha) - ', function () {
    const UserService = require('../../lib/user');
    const UserModel = require('../../lib/user/model');
 
    it('the service shall exist', function () {
        assert.ok( UserService !== undefined );
    });
 
    describe('and the method findAll shall ', function () {
        it('exist', function () {
            assert.equal( typeof(UserService.add), 'function' );
        });
 
        it('shall create a user', function () {
            return UserService.add({ firstname: 'john', lastname: 'smith', email: 'john@example.com', password: '12345678' })
                .then(function (user) {
                    assert.equal( user.id, 1 );
                });
        });

        it('cant add a user with the same email', function () {
            return UserService.add({ firstname: 'john', lastname: 'smith', email: 'john@example.com', password: '12345678' })
                .then(
                    function (user) {
                        console.log( user );
                        assert.equal( user.id, 1 );
                    },
                    function (error) {
                        console.log( error );
                    }
                );
        });
    });
 
});
