const express = require("express");
const router = express.Router();

const board = require("./board");
const list = require("./list");
const card = require("./card");
const label = require("./label");
const card_label = require("./card_label");

router.use("/board", board);
router.use("/list", list);
router.use("/card", card);
router.use("/label", label);
router.use("/card_label", card_label);

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
					requestBody: "optional 'title', 'position', 'board_id'",
				},
				DELETE: "deletes list with specified id",
			},
			/* CARD */
			"/card": {
				GET: {
					description: "returns all the cards",
					queryParameters: {
						date_created: "filter by date created",
						list_id: "filter by list id",
						position: "filter by position",
					},
				},
				POST: {
					description: "creates a new list",
					requestBody:
						"'title', 'description', 'date_created', 'position', 'list_id'",
				},
			},
			"/card/:id": {
				GET: "returns card with specified id",
				PATCH: {
					description: "updates the card with the specified id",
					requestBody:
						"optional 'title', 'description' , 'position', 'list_id'",
				},
				DELETE: "deletes card with specified id",
			},
			/* LABEL */
			"/label": {
				GET: {
					description: "returns all the label",
					queryParameters: {
						date_created: "filter by date created",
						board_id: "filter by board id",
						color: "filter by color",
					},
				},
				POST: {
					description: "creates a new label",
					requestBody: "'title', 'date_created', 'color', 'board_id'",
				},
			},
			"/label/:id": {
				GET: "returns label with specified id",
				PATCH: {
					description: "updates the label with the specified id",
					requestBody: "optional 'title', 'color', 'board_id'",
				},
				DELETE: "deletes label with specified id",
			},
			/* CARD_LABEL */
			"/card_label": {
				GET: {
					description: "returns all the card_label",
					queryParameters: {
						card_id: "filter by card_id",
						label_id: "filter by label_id",
					},
				},
				POST: {
					description: "creates a new card_label",
					requestBody: "'card_id', 'label_id'",
				},
			},
			"/card_label/:id": {
				GET: "returns card_label with specified id",
				DELETE: "deletes card_label with specified id",
			},
		},
	});
});

module.exports = router;
