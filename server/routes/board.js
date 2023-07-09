const express = require("express");
const router = express.Router();

const JWTHelper = require("../utils/jwt-helpers");
const db = require("../database");
const tableName = "board";

async function getBoardDataFull(itemId) {
	// returns full board data
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

	// Returns cards with corresponding labels
	const nestedCards = cardsData.map((card) => {
		// Connect labels to the corresponding card
		const nestedLabels = cardLabelData
			.filter((cardLabel) => cardLabel.card_id === card.id)
			.map((cardLabel) =>
				labelsData.find((label) => label.id === cardLabel.label_id)
			);

		// Create a nested card object with associated labels
		const nestedCard = {
			...card,
			labels: nestedLabels,
		};

		return nestedCard;
	});

	// Returns lists with corresponding cards
	const nestedLists = listsData.map((list) => {
		// Assign the corresponding cards to each list
		const nestedCardsData = nestedCards.filter(
			(card) => card.list_id === list.id
		);

		// Create a nested list object with associated cards
		const nestedList = {
			...list,
			cards: nestedCardsData,
		};

		return nestedList;
	});

	// Returns board with corresponding lists and labels
	const nestedBoardData = boardData.map((board) => {
		// Assign the corresponding lists to each board
		const nestedListsData = nestedLists.filter(
			(list) => list.board_id === board.id
		);

		// Create a nested board object with associated lists and labels
		const nestedBoard = {
			...board,
			lists: nestedListsData,
			labels: labelsData.filter((label) => label.board_id === board.id),
		};

		return nestedBoard;
	});

	return nestedBoardData;
}

/**************************/
/********* ROUTES *********/
/**************************/

/* GET */
router.get("/", (req, res) => {
	try {
		const table = db.table(tableName);
		table.selectAll({}, (e, data) => {
			if (e) res.status(500).json({ error: err.message });
			else {
				const { includePasswords } = req.body;
				if (includePasswords)
					res.status(200).json(data); // include passwords
				else
					res.status(200).json(
						// remove passwords
						data.map((item) => {
							const { password, ...rest } = item;
							return rest;
						})
					);
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

router.get("/:id/full", async (req, res) => {
	try {
		const itemId = req.params.id;
		const nestedBoardData = await getBoardDataFull(itemId);
		res.status(200).json(nestedBoardData);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

router.get("/:id/live", async (req, res) => {
	try {
		res.setHeader("Content-Type", "text/event-stream");

		const itemId = req.params.id;
		let data = {
			boardId: itemId,
			updateRequired: false,
		};

		let latestData = await getBoardDataFull(itemId);

		setInterval(async () => {
			let newLatestData = await getBoardDataFull(itemId);

			if (JSON.stringify(latestData) === JSON.stringify(newLatestData))
				data.updateRequired = false;
			else {
				latestData = newLatestData;
				data.updateRequired = true;
			}
			res.write(`data: ${JSON.stringify(data)}\n\n`);
		}, 500);
	} catch (e) {
		res.status(500).json({ error: e.message });
	}
});

/* POST */
router.post("/", (req, res) => {
	try {
		const table = db.table(tableName);
		const { title, password } = req.body;

		const date_created = Date.now();
		table.insertRow(
			{
				title: title,
				password: password,
				date_created: date_created,
			},
			(e) => {
				if (e)
					res.status(500).json({
						error: e,
					});
				else {
					const conditions = {
						title: title,
						password: password,
						date_created: date_created,
					};

					table.selectAll(conditions, (err, data) => {
						if (err) {
							res.status(500).json({
								error: err,
							});
						} else {
							const responseData = {
								message: "board created successfully",
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

router.post("/:id/unlock", async (req, res) => {
	try {
		const table = db.table(tableName);
		const { password } = req.body;
		const itemId = req.params.id;

		// get the board's password
		const boardData = await new Promise((res, rej) => {
			table.selectAll({ id: itemId }, (e, data) => {
				if (e) return rej(e);
				else {
					res(data[0]);
				}
			});
		});

		// if passed password is correct
		if (boardData.password === password) {
			const token = JWTHelper.generateToken({
				boardId: boardData.id,
				boardTitle: boardData.title,
				boardPassword: boardData.password,
			});

			res.status(200).json({
				message: "correct password",
				boardTitle: boardData.title,
				jwt: token,
				dateUnlocked: Date.now(),
			});
		} else res.status(401).json({ error: "wrong password" });
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
