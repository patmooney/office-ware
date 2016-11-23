const assert = require('assert');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');

process.env.DATABASE_URL = "sqlite::memory:";

import Schema from '../../lib/schema';
const schema = Schema("sqlite::memory:");
const userDetails = {
    email: 'john@example.com',
    password: 'testpassword',
    firstname: 'John',
    lastname: 'Smith',
    organisation_id: 1,
    allowed_days: 25
};

describe('User - add user', function () {

    let number_of_tests = 4;

    it('should save without error', function( done ) {
        schema.user.add( userDetails ).then(
            function ( user ) {
                number_of_tests--;
                assert.equal( user.id, 1, "user was added with id 1" );
                number_of_tests--;
                assert.equal( user.pwd_sha256.length, 64, "the password appears to be hashed" );
                number_of_tests--;
                assert.ok( user.pwd_sha256 != userDetails.password, "the hashed password is not the same as the raw" );
            },
            function ( err ) {
                assert.fail( "user failed for this reason: " + err );
            }
        ).finally( function () { done() } );
    });

    it('should fail on duplicate email address', function(done) {
        schema.user.add( userDetails ).then(
            function ( user ) {
                assert.fail( "User was added with id: " + user.id + "which is incorrect" );
            },
            function ( err ) {
                number_of_tests--;
                assert.ok( /Email already exists/.test(err) );
            }
        ).finally( function () { done() } );
    });

    it('all tests have run', function () {
        assert.ok( ! number_of_tests );
    });

});

describe('User - login user', function () {
    
    let number_of_tests = 3;

    it('should fail with wrong credentials', function ( done ) {
        schema.user.loginUser( 'wrong@example.com', userDetails.password ).then(
            function ( user ) {
                assert.fail( "shouldnt log in with wrong credentials" );
            },
            function ( err ) {
                number_of_tests--;
                assert.ok( "login has failed with incorrect credentials" );
            }
        ).finally( function () { done(); } );
    });

    it('should fail with wrong password', function ( done ) {
        schema.user.loginUser( userDetails.email, 'made up' ).then(
            function ( user ) {
                assert.fail( "shouldnt log in with wrong credentials" );
            },
            function ( err ) {
                number_of_tests--;
                assert.ok( "login has failed with incorrect credentials" );
            }
        ).finally( function () { done(); } );
    });

    it('should login with correct details', function ( done ) {
        schema.user.loginUser( userDetails.email, userDetails.password ).then(
            function ( user ) {
                number_of_tests--;
                assert.equal( user.firstname, userDetails.firstname, "the correct user has been returned" );
            },
            function ( err ) {
                assert.fail( "login has failed with correct credentials" );
            }
        ).finally( function () { done(); } );
    });


    it('all tests have run', function () {
        assert.ok( ! number_of_tests );
    });

});
