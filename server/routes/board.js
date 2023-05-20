const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "board";

/* GET */
router.get("/", (req, res) => {
	try {
		db.execSql(`SELECT * FROM ${tableName}`, (e, data) => {
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
		const { title, password } = req.body;

		table.insertRow(
			{
				title: title,
				password: password,
			},
			(e) => {
				if (e)
					res.status(500).json({ error: "failed to create board" });
				else
					res.status(201).json({
						message: "board created successfully",
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
		const { title, password } = req.body;

		const board = await new Promise((res, rej) => {
			db.execSql(
				`SELECT * FROM ${table.name} WHERE id=${tableId}`,
				(e, data) => {
					if (e) return rej(e);
					else res(data[0]);
				}
			);
		});

		if (!board) res.status(404).json({ message: "board doesn't exist" });

		table.updateRowNew(
			{
				title: title || board.title,
				password: password || board.password,
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
