const express = require("express");
const router = express.Router();

const board = require("./board");

router.use("/board", board);

router.get("/", (req, res) => {
	res.json({
		message: "hello world",
	});
});

module.exports = router;
