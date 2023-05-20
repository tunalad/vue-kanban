const sqlite3 = require("sqlite3").verbose();

class DBHelper {
	constructor(dbName, callback) {
		this.db = new sqlite3.Database(dbName, (err) => {
			if (err) console.error(err.message);
			else callback();
		});
	}

	execSql(query, callback) {
		this.db.all(query, (err, res) => {
			if (err && typeof callback === "function")
				callback(err ? err.message : null, null);
			if (!err && typeof callback === "function") callback(null, res);
		});
	}

	createTable(tableName, columns, options = { id: true }, callback) {
		/**
		 * Creates a SQLite table with the specified name, columns, and options.
		 *
		 * @param {string} tableName - The name of the table to create.
		 * @param {Object} columns - A dictionary where the keys represent column names and the values represent column types.
		 * @param {Object} options - A dictionary of optional parameters for the table creation. The default is { id: true }, which will automatically add an 'id' column with INTEGER PRIMARY KEY AUTOINCREMENT. The foreignKeys option can also be provided as a dictionary where the keys represent column names and the values represent objects with the properties 'references' and 'onDelete'.
		 * @param {function} callback - A callback function to be executed when the table is created.
		 *
		 * @returns {void}
		 *
		 * @example
		 * createTable('students', {'name': 'TEXT', 'age': 'INTEGER'}, {'foreignKeys': {'class_id': {'references': 'classes(id)', 'onDelete': 'CASCADE'}}}, callback);
		 */
		const columnEntries = Object.entries(columns);
		if (options.id || !columns.hasOwnProperty("id"))
			columnEntries.unshift(["id", "INTEGER PRIMARY KEY AUTOINCREMENT"]);

		const definedColumns = columnEntries
			.map(([columnName, columnType]) => `${columnName} ${columnType}`)
			.join(", \n");

		const foreignKeys = options.foreignKeys;
		const definedKeys = foreignKeys
			? Object.entries(foreignKeys)
					.map(
						([keyName, keyReference]) =>
							`FOREIGN KEY(${keyName}) REFERENCES ${
								keyReference.references
							} ON DELETE ${keyReference.onDelete || "NO ACTION"}`
					)
					.join(", \n")
			: "";

		let sql = `CREATE TABLE IF NOT EXISTS ${tableName}(\n${definedColumns}`;
		if (definedKeys) sql += `,\n${definedKeys}`;
		sql += `)`;

		this.execSql(sql, callback);
	}

	table(tableName) {
		return {
			name: tableName,
			dropTable: (callback) => {
				const sql = `DROP TABLE IF EXISTS ${tableName}`;
				this.execSql(sql, callback);
			},
			renameTo: (newName, callback) => {
				const sql = `ALTER TABLE ${tableName} RENAME TO ${newName}`;
				this.execSql(sql, callback);
			},
			dropColumn: (columnName, callback) => {
				const sql = `ALTER TABLE ${tableName} DROP COLUMN ${columnName}`;
				this.execSql(sql, callback);
			},
			renameColumn: (oldName, newName, callback) => {
				const sql = `ALTER TABLE ${tableName} RENAME COLUMN ${oldName} to ${newName}`;
				this.execSql(sql, callback);
			},
			addColumn: (
				columnName,
				columnDefinition,
				options = {},
				callback
			) => {
				const sql = `ALTER TABLE ${tableName} ADD COLUMN IF NOT EXIST ${columnName} ${columnDefinition}`;
				if (options.foreignKey) {
					const {
						foreignKey: { name, table, column },
					} = options;
					sql += `, ADD FOREIGN KEY (${columnName}) REFERENCES ${table}(${column}) ON DELETE CASCADE ON UPDATE CASCADE`;
				}
				this.execSql(sql, callback);
			},
			insertRow: (data, callback) => {
				const keys = Object.keys(data).join(", ");
				const values = Object.values(data)
					.map((val) => (typeof val === "string" ? `'${val}'` : val))
					.join(", \n");
				const sql = `INSERT INTO ${tableName}(${keys}) \nVALUES(${values});`;
				this.execSql(sql, callback);
			},
			deleteRow: (condition, callback) => {
				const keys = Object.keys(condition);
				const values = Object.values(condition);

				let sql = `DELETE FROM ${tableName}`;

				if (keys.length > 0) {
					const conditions = keys.map((key, index) => {
						const value =
							typeof values[index] === "string"
								? `'${values[index]}'`
								: values[index];
						return `${key}=${value}`;
					});
					sql += ` WHERE ${conditions.join(" AND ")}`;
				}

				this.execSql(sql, callback);
			},
			updateRow: (newValues, condition, callback) => {
				const newKeys = Object.keys(newValues);
				const newVals = Object.values(newValues);

				const conditionKeys = Object.keys(condition);
				const conditionValues = Object.values(condition);

				let sql = `UPDATE ${tableName}`;

				if (newKeys.length > 0) {
					const conditions = newKeys.map((newKey, index) => {
						const newVal =
							typeof newVals[index] === "string"
								? `'${newVals[index]}'`
								: newVals[index];
						return `${newKey}=${newVal}`;
					});
					sql += ` SET ${conditions.join(", ")}`;
				}

				if (conditionKeys.length > 0) {
					const conditions = conditionKeys.map(
						(conditionKey, index) => {
							const conditionValue =
								typeof conditionValues[index] === "string"
									? `'${conditionValues[index]}'`
									: conditionValues[index];
							return `${conditionKey}=${conditionValue}`;
						}
					);
					sql += ` WHERE ${conditions.join(" AND ")}`;
				}
				console.log(sql);
				this.execSql(sql, callback);
			},
			updateRowNew: (newValues, condition, callback) => {
				const newKeys = Object.keys(newValues);
				const newVals = Object.values(newValues);

				const conditionKeys = Object.keys(condition);
				const conditionValues = Object.values(condition);

				let sql = `UPDATE ${tableName}`;

				if (newKeys.length > 0) {
					const conditions = newKeys.map((newKey, index) => {
						const newVal =
							typeof newVals[index] === "string"
								? `'${newVals[index]}'`
								: newVals[index];
						return `${newKey}=${newVal}`;
					});
					sql += ` SET ${conditions.join(", ")}`;
				}

				if (conditionKeys.length > 0) {
					const conditions = conditionKeys.map(
						(conditionKey, index) => {
							const conditionValue = conditionValues[index];
							if (Array.isArray(conditionValue)) {
								const values = conditionValue.map((value) =>
									typeof value === "string"
										? `'${value}'`
										: value
								);
								return `${conditionKey} IN (${values.join(
									", "
								)})`;
							} else {
								const value =
									typeof conditionValue === "string"
										? `'${conditionValue}'`
										: conditionValue;
								return `${conditionKey}=${value}`;
							}
						}
					);
					const whereClause = conditions.join(" AND ");
					sql += ` WHERE ${whereClause}`;
				}

				this.execSql(sql, callback);
			},
		};
	}
}

module.exports = DBHelper;
