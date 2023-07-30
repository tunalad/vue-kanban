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
            status: "running",
        },
    });
});

module.exports = router;
