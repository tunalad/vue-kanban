const express = require("express");
const router = express.Router();

const db = require("../database");
const tableName = "card_label";

/* GET */
router.get("/", (req, res) => {
    try {
        const table = db.table(tableName);
        const { card_id, label_id } = req.query;

        const whereCondition = {};
        if (card_id) whereCondition.card_id = card_id;
        if (label_id) whereCondition.label_id = label_id;

        table.selectAll(whereCondition, (err, data) => {
            if (err) {
                res.status(1500).json({ error: err.message });
            } else {
                res.status(200).json(data);
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

/* POST */
router.post("/", (req, res) => {
    try {
        const table = db.table(tableName);
        const { card_id, label_id } = req.body;

        table.insertRow(
            {
                card_id: card_id,
                label_id: label_id,
            },
            (e) => {
                if (e)
                    res.status(500).json({
                        error: `failed to create a ${tableName} item`,
                    });
                else
                    res.status(201).json({
                        message: `${tableName} item created successfully`,
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

router.delete("/", (req, res) => {
    try {
        const table = db.table(tableName);
        const { card_id, label_id } = req.query;

        table.deleteRow({ card_id: card_id, label_id: label_id }, (e) => {
            if (e) res.status(500).json({ error: e });
            else res.status(204).end();
        });
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

module.exports = router;
