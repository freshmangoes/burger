const mysql = require(`mysql2`);

const connection = mysql.createConnection({
	host: `localhost`,
	port: 8889,
	user: `root`,
	password: `root`,
	database: `burgers_db`
});

connection.connect((err) => {
	if (err) return console.error(`error connecting ${err.stack}`);
	console.log(`connected as id ${connection.threadId}`);
});

module.exports = connection;