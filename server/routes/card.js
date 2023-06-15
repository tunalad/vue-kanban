const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "card";

/* GET */
router.get("/", (req, res) => {
	try {
		const table = db.table(tableName);
		const { date_created, list_id, position } = req.query;

		const whereCondition = {};
		if (date_created) whereCondition.date_created = date_created;
		if (list_id) whereCondition.list_id = list_id;
		if (position) whereCondition.position = position;

		table.selectAll(whereCondition, (err, data) => {
			if (err) {
				res.status(500).json({ error: err.message });
			} else {
				res.status(200).json(data);
			}
		});
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/:id", (req, res) => {
	try {
		const table = db.table(tableName);
		const itemId = req.params.id;

		table.selectAll({ id: itemId }, (e, data) => {
			if (e) res.status(500).json({ error: err.message });
			else res.status(200).json(data);
		});
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

/* POST */
router.post("/", (req, res) => {
	try {
		const table = db.table(tableName);
		const { title, description, date_created, position, list_id } =
			req.body;

		table.insertRow(
			{
				title: title,
				description: description,
				date_created: date_created, // make sure it's unix time,
				position: position,

				list_id: list_id,
			},
			(e) => {
				if (e)
					res.status(500).json({ error: "failed to create a card" });
				else {
					const conditions = {
						title: title,
						description: description,
						date_created: date_created,
						position: position,
						list_id: list_id,
					};

					table.selectAll(conditions, (err, data) => {
						if (err) {
							res.status(500).json({
								error: "failed to retrieve the created card",
							});
						} else {
							const responseData = {
								message: "card created successfully",
								data: data,
							};

							res.status(201).json(responseData);
						}
					});
				}
			}
		);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

/* DELETE */
router.delete("/:id", async (req, res) => {
	try {
		const table = db.table(tableName);
		const tableId = req.params.id;

		const card = await new Promise((res, rej) => {
			db.execSql(
				`SELECT * FROM ${table.name} WHERE id=${tableId}`,
				(e, data) => {
					if (e) return rej(e);
					else res(data[0]);
				}
			);
		});

		if (!card) {
			res.status(404).json({ message: "card doesn't exist" }).end();
			return;
		}

		// delete item
		table.deleteRow({ id: tableId }, (e) => {
			if (e) res.status(500).json({ error: e });
			else res.status(204).end();
		});

		// get items where position > deleted item's position
		const toUpdate = await new Promise((res, rej) => {
			db.execSql(
				`SELECT * FROM ${table.name} WHERE list_id=${card.list_id} AND position>${card.position}`,
				(e, data) => {
					if (e) return rej(e);
					else res(data);
				}
			);
		});

		// -1 their positions
		const sql = `UPDATE ${table.name} SET position=position-1 WHERE list_id=${card.list_id} AND position>${card.position}`;
		db.execSql(sql, (e) => {
			if (e) res.status(500).json({ error: e });
			else res.status(204).end();
		});
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

/* PATCH */
router.patch("/:id", async (req, res) => {
	try {
		const table = db.table(tableName);
		const tableId = req.params.id;
		const { title, description, position, list_id } = req.body;

		const card = await new Promise((res, rej) => {
			db.execSql(
				`SELECT * FROM ${table.name} WHERE id=${tableId}`,
				(e, data) => {
					if (e) return rej(e);
					else res(data[0]);
				}
			);
		});

		if (!card) {
			res.status(404).json({ message: "card doesn't exist" }).end();
			return;
		}

		// moving to a different list
		if (list_id !== undefined && list_id !== card.list_id) {
			// delete from old one
			table.deleteRow({ id: tableId }, (e) => {
				if (e) {
					res.status(500)
						.json({ error: "failed to delete a card" })
						.end();
					return;
				}
			});

			// append to the new list
			table.insertRow(
				{
					id: card.id,
					title: card.title,
					description: card.description,
					date_created: card.date_created,
					position: position,

					list_id: list_id,
				},
				(e) => {
					if (e) {
						res.status(500)
							.json({
								error: "failed to create a card",
							})
							.end();
						return;
					} else {
						res.status(201)
							.json({
								message: "card moved successfully",
								data: {
									id: card.id,
									title: card.title,
									description: card.description,
									date_created: card.date_created,
									position: position,

									list_id: list_id,
								},
							})
							.end();
						return;
					}
				}
			);
		}

		// moving items around if required
		if (position !== undefined && position !== card.position) {
			let sql = `UPDATE ${table.name} `;
			if (card.position < position)
				sql += `SET position=position-1 WHERE list_id=${card.list_id} AND (position BETWEEN ${card.position} AND ${position})`;
			else if (card.position > position)
				sql += `SET position=position+1 WHERE list_id=${card.list_id} AND (position BETWEEN ${position} AND ${card.position})`;

			db.execSql(sql, (e) => {
				if (e) res.status(500).json({ error: e });
			});
		}

		table.updateRowNew(
			{
				title: title || card.title,
				description: description || card.description,
				position: position !== undefined ? position : card.position,

				list_id: list_id || card.list_id,
				// date creation shouldn't be updated.
			},
			{ id: tableId },
			(e) => {
				if (e) {
					res.status(500).json({ error: e });
				} else res.status(204).end();
			}
		);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports = router;
