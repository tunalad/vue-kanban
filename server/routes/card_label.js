const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "card_label";

/* GET */
router.get("/", (req, res) => {
	try {
		const { card_id, label_id } = req.query;

		let sql = `SELECT * FROM ${tableName}`;

		if (Object.keys(req.query).length > 0) {
			let conditions = [];
			if (card_id) conditions.push(`card_id=${card_id}`);
			if (label_id) conditions.push(`label_id=${label_id}`);
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
		const { card_id, label_id } = req.query;

		table.insertRow(
			{
				card_id: card_id,
				label_id: label_id,
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

module.exports = router;
