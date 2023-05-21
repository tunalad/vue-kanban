const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "card";

/* GET */
router.get("/", (req, res) => {
	try {
		const { date_created, list_id, position } = req.query;

		let sql = `SELECT * FROM ${tableName}`;

		if (Object.keys(req.query).length > 0) {
			let conditions = [];
			if (date_created) conditions.push(`date_created=${date_created}`);
			if (list_id) conditions.push(`list_id=${list_id}`);
			if (position) conditions.push(`position=${position}`);
			sql += ` WHERE ${conditions.join(" AND ")}`;
		}

		db.execSql(sql, (e, data) => {
			if (e) res.status(500).json({ error: e.message });
			else res.status(200).json(data);
		});
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

router.get("/:id", (req, res) => {
	try {
		const itemId = req.params.id;

		db.execSql(
			`SELECT * FROM ${tableName} where id=${itemId}`,
			(e, data) => {
				if (e) res.status(500).json({ error: e.message });
				else res.status(200).json(data);
			}
		);
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
				else
					res.status(201).json({
						message: "card created successfully",
					});
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
