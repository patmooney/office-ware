const assert = require('assert');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(':memory:');
import Schema from '../../lib/schema';
const schema = Schema("sqlite::memory:");

describe('Holiday - Add holiday', function () {


});
