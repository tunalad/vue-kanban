const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "label";

/* GET */
router.get("/", (req, res) => {
	try {
		const { date_created, board_id, list } = req.query;

		let sql = `SELECT * FROM ${tableName}`;

		if (Object.keys(req.query).length > 0) {
			let conditions = [];
			if (date_created) conditions.push(`date_created=${date_created}`);
			if (board_id) conditions.push(`board_id=${board_id}`);
			if (list) conditions.push(`list=${list}`);
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
		const { title, date_created, color, board_id } = req.body;

		table.insertRow(
			{
				title: title,
				date_created: date_created, // make sure it's unix time,
				color: color,

				board_id: board_id,
			},
			(e) => {
				if (e)
					res.status(500).json({ error: "failed to create a label" });
				else
					res.status(201).json({
						message: "label created successfully",
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
		const { title, color } = req.body;

		const label = await new Promise((res, rej) => {
			db.execSql(
				`SELECT * FROM ${table.name} WHERE id=${tableId}`,
				(e, data) => {
					if (e) return rej(e);
					else res(data[0]);
				}
			);
		});

		if (!label) res.status(404).json({ message: "label doesn't exist" });
		else
			table.updateRowNew(
				{
					title: title || label.title,
					color: color || label.color,
					// board_id shouldn't be updated. Same goes for creation date, doesn't make sense
				},
				{ id: tableId },
				(e) => {
					if (e) res.status(500).json({ error: e });
					else res.status(204).end();
				}
			);
	} catch (e) {
		res.status(500).json({ error: e });
	}
});

module.exports = router;
