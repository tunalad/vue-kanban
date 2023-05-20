const express = require("express");
const router = express.Router();

const board = require("./board");
const list = require("./list");

router.use("/board", board);
router.use("/list", list);

router.get("/", (req, res) => {
	res.json({
		routes: {
			/* BOARD */
			"/board": {
				GET: "returns all the boards",
				POST: {
					description: "creates a new board",
					requestBody: "'title' and 'password'",
				},
			},
			"/board/:id": {
				GET: "returns board with specified id",
				PATCH: {
					description: "updates the board with the specified id",
					requestBody: "optional 'title' and 'password'",
				},
				DELETE: "deletes board with specified id",
			},
			/* LIST */
			"/list": {
				GET: {
					description: "returns all the lists",
					queryParameters: {
						date_created: "filter by date created",
						board_id: "filter by board id",
						position: "filter by position",
					},
				},
				POST: {
					description: "creates a new list",
					requestBody:
						"'title', 'date_created', 'position', 'board_id'",
				},
			},
			"/list/:id": {
				GET: "returns list with specified id",
				PATCH: {
					description: "updates the list with the specified id",
					requestBody: "optional 'title', 'date_created', 'position'",
				},
				DELETE: "deletes list with specified id",
			},
			/* CARD */

			/* LABEL */

			/* CARD_LABEL */
		},
	});
});

module.exports = router;
