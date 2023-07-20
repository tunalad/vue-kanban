const DBHelper = require("../utils/sqlite-helpers");

// one time database init that we can import into multiple files
const db = new DBHelper("database/db.sqlite3", async (e) => {
    if (e) console.error("DBHelper ERROR: ", e);
    else {
        console.log("DBHelper: database connected");

        db.execSql("PRAGMA foreign_keys = 1;", (err) => {
            if (err) {
                console.error("Error enabling foreign key constraints:", err);
            } else {
                db.db.get("PRAGMA foreign_keys;", (err, result) => {
                    if (err) {
                        console.error(
                            "Error checking foreign key status:",
                            err,
                        );
                    } else {
                        console.log(
                            "Foreign key constraints enabled:",
                            result.foreign_keys === 1,
                        );
                    }
                });
            }
        });
    }
});

module.exports = db;
