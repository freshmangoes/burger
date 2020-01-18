// Import MySQL connection.
const connection = require('../config/connection.js');

// Helper function for SQL syntax.
// Let's say we want to pass 3 values into the mySQL query.
// In order to write the query, we need 3 question marks.
// The above helper function loops through and creates an array of question marks - ["?", "?", "?"] - and turns it into a string.
// ["?", "?", "?"].toString() => "?,?,?";
function printQuestionMarks(num) {
	let arr = [];

	for (let i = 0; i < num; i++) {
		arr.push('?');
	}

	return arr.toString();
}

// Helper function to convert object key/value pairs to SQL syntax
function objToSql(ob) {
	let arr = [];

	// loop through the keys and push the key/value as a string int arr
	for (let key in ob) {
		let value = ob[key];
		// check to skip hidden properties
		if (Object.hasOwnProperty.call(ob, key)) {
			// if string with spaces, add quotations (Lana Del Grey => 'Lana Del Grey')
			if (typeof value === 'string' && value.indexOf(' ') >= 0) {
				value = "'" + value + "'";
			}
			// e.g. {name: 'Lana Del Grey'} => ["name='Lana Del Grey'"]
			// e.g. {sleepy: true} => ["sleepy=true"]
			arr.push(key + '=' + value);
		}
	}

	// translate array of strings to a single comma-separated string
	return arr.toString();
}

// Object for all our SQL statement functions.
const orm = {
	all: (tableInput, cb) => {
		let qString = 'SELECT * FROM ' + tableInput + ';';
		connection.query(qString, (err, result) => {
			if (err) {
				throw err;
			}
			cb(result);
		});
	},
	create: (table, cols, vals, cb) => {
		let qString = 'INSERT INTO ' + table;

		qString += ' (';
		qString += cols.toString();
		qString += ') ';
		qString += 'VALUES (';
		qString += printQuestionMarks(vals.length);
		qString += ') ';

		console.log(qString);

		connection.query(qString, vals, (err, result) => {
			if (err) {
				throw err;
			}

			cb(result);
		});
	},
	// An example of objColVals would be {name: panther, sleepy: true}
	update: (table, objColVals, condition, cb) => {
		let qString = 'UPDATE ' + table;

		qString += ' SET ';
		qString += objToSql(objColVals);
		qString += ' WHERE ';
		qString += condition;

		console.log(qString);
		connection.query(qString, (err, result) => {
			if (err) {
				throw err;
			}

			cb(result);
		});
	}
};

module.exports = orm;
