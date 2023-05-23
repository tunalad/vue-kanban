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

router.get("/:id/full", async (req, res) => {
	try {
		const itemId = req.params.id;

		const boardQuery = `SELECT * FROM ${tableName} WHERE id=${itemId}`;
		const listsQuery = `SELECT * FROM list WHERE board_id=${itemId}`;
		const cardsQuery = `SELECT * FROM card WHERE list_id IN (SELECT id FROM list WHERE board_id=${itemId})`;
		const labelsQuery = `SELECT * FROM label WHERE board_id=${itemId}`;
		const cardLabelQuery = `SELECT * FROM card_label WHERE card_id IN (SELECT id FROM card WHERE list_id IN (SELECT id FROM list WHERE board_id=${itemId}))`;

		const getSqlData = (query) => {
			return new Promise((resolve, reject) => {
				db.execSql(query, (error, data) => {
					if (error) {
						reject(error);
					} else {
						resolve(data);
					}
				});
			});
		};

		const [boardData, listsData, cardsData, labelsData, cardLabelData] =
			await Promise.all([
				getSqlData(boardQuery),
				getSqlData(listsQuery),
				getSqlData(cardsQuery),
				getSqlData(labelsQuery),
				getSqlData(cardLabelQuery),
			]);

		// returns cards with corresponding labels
		const nestedCards = cardsData.map((card) => {
			// connect labels to the corresponding card
			const nestedLabels = cardLabelData
				.filter((cardLabel) => cardLabel.card_id === card.id)
				.map((cardLabel) =>
					labelsData.find((label) => label.id === cardLabel.label_id)
				);

			// create a nested card object with associated labels
			const nestedCard = {
				...card,
				labels: nestedLabels,
			};

			return nestedCard;
		});

		// returns list with corresponding cards
		const nestedLists = listsData.map((list) => {
			// assign the corresponding cards to each list
			const nestedCardsData = nestedCards.filter(
				(card) => card.list_id === list.id
			);

			// create a nested list object with associated cards
			const nestedList = {
				...list,
				cards: nestedCardsData,
			};

			return nestedList;
		});

		// returns board with corresponding lists
		const nestedBoardData = boardData.map((board) => {
			// assign the corresponding lists to each board
			const nestedListsData = nestedLists.filter(
				(list) => list.board_id === board.id
			);

			// create a nested board object with associated lists and labels
			const nestedBoard = {
				...board,
				lists: nestedListsData,
				labels: labelsData.filter(
					(label) => label.board_id === board.id
				),
			};
			return nestedBoard;
		});

		res.status(200).json(nestedBoardData);
	} catch (error) {
		res.status(500).json({ error: error.message });
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
		else
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
