const DBHelper = require("../utils/sqlite-helpers");

// one time database init that we can import into multiple files
const db = new DBHelper("database/db.sqlite3", (e) => {
	if (e) console.error("DBHelper ERROR: ", e);
	else console.log("DBHelper: database connected");
});

module.exports = db;
