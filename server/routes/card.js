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
router.delete("/:id", (req, res) => {
	try {
		const table = db.table(tableName);
		const tableId = req.params.id;

		table.deleteRow({ id: tableId }, (e) => {
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

		if (!card) res.status(404).json({ message: "card doesn't exist" });
		else
			table.updateRowNew(
				{
					title: title || card.title,
					description: description || card.description,
					position: position || card.position,

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
